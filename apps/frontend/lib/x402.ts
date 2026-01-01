'use client'

import { useState } from 'react'

interface X402Payload {
    marketId: string
    sport: string
    stake: number
}

interface X402Result {
    success: boolean
    quoteId?: string
    positionId?: string
    error?: string
}

export function useX402Pay(endpoint: string) {
    const [isPaying, setIsPaying] = useState(false)

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

                // Trigger wallet payment (Cronos)
                if (paymentUrl && (window as any).ethereum) {
                    try {
                        const tx = await (window as any).ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [{
                                to: paymentUrl.split('@')[0], // Extract address from payment URL
                                value: '0x' + (Math.floor(payload.stake * 1e18)).toString(16),
                            }],
                        })
                        // Poll for confirmation, then retry original request
                        await new Promise(resolve => setTimeout(resolve, 5000))
                        return await pay(payload) // Retry after payment
                    } catch (err) {
                        throw new Error('Payment failed')
                    }
                }
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
