'use client'

import { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { isAddress, parseEther, type Address } from 'viem'

interface X402Payload {
    stake: number
    [key: string]: unknown
}

interface X402Result {
    success: boolean
    quoteId?: string
    positionId?: string
    error?: string
}

interface X402Options {
    confirmEndpoint?: string
}

interface PaymentRequest {
    address: Address
    amount?: string
}

function parsePaymentRequiredHeader(paymentRequired: string): PaymentRequest | null {
    const sanitized = paymentRequired.replace(/^crypto-cronos:\/\//i, '')
    if (!sanitized) return null

    const [left, right] = sanitized.split('@')
    const [addressPart, query] = left.split('?')
    const amountFromQuery = query ? new URLSearchParams(query).get('amount') ?? undefined : undefined

    const amount = amountFromQuery ?? right
    const address = addressPart.trim()

    if (!isAddress(address)) return null

    return { address: address as Address, amount }
}

export function useX402Pay(endpoint: string, options: X402Options = {}) {
    const [isPaying, setIsPaying] = useState(false)
    const { data: walletClient } = useWalletClient()
    const confirmEndpoint = options.confirmEndpoint ?? '/api/x402/confirm'

    const pay = async (payload: X402Payload): Promise<X402Result> => {
        setIsPaying(true)
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.status === 402) {
                // Handle 402 payment required
                const paymentUrl = response.headers.get('Payment-Required')
                const quoteId = response.headers.get('X-Quote-ID')

                if (!paymentUrl || !quoteId) {
                    return { success: false, error: 'Missing payment request details' }
                }

                const paymentRequest = parsePaymentRequiredHeader(paymentUrl)
                if (!paymentRequest) {
                    return { success: false, error: 'Invalid payment request' }
                }

                if (!walletClient) {
                    return { success: false, error: 'Wallet client not available' }
                }

                const fallbackStake = typeof payload.stake === 'number' ? payload.stake : Number(payload.stake ?? 0)
                const amount = paymentRequest.amount ?? String(fallbackStake)
                if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
                    return { success: false, error: 'Invalid payment amount' }
                }

                await walletClient.sendTransaction({
                    to: paymentRequest.address,
                    value: parseEther(amount),
                })

                const confirmResponse = await fetch(confirmEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quote_id: quoteId }),
                })

                if (!confirmResponse.ok) {
                    const errorData = await confirmResponse.json().catch(() => ({}))
                    return {
                        success: false,
                        error: errorData?.error || errorData?.detail || 'Payment confirmation failed',
                    }
                }

                const confirmData = await confirmResponse.json()
                return { success: true, quoteId, ...confirmData }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                return { success: false, error: errorData?.error || errorData?.detail || 'Payment failed' }
            }

            const data = await response.json()
            return { success: true, ...data }
        } catch (error) {
            return { success: false, error: (error as Error).message }
        } finally {
            setIsPaying(false)
        }
    }

    return { pay, isPaying }
}
