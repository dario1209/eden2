'use client'

import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { useX402Pay } from '@/lib/x402'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface BetSlipProps {
    marketId: string
    sport: string
    className?: string
}

interface BetPosition {
    id: string
    match: string
    selection: string
    odds: number
    stake: number
}

export function BetSlip({ marketId, sport, className = '' }: BetSlipProps) {
    const [positions, setPositions] = useState<BetPosition[]>([])
    const [stake, setStake] = useState('0.01')
    const { isConnected } = useAccount()
    const { pay, isPaying } = useX402Pay(`/api/x402/place-bet`)

    const totalOdds = positions.reduce((acc, pos) => acc * pos.odds, 1)
    const totalStake = positions.reduce((acc, pos) => acc + pos.stake, 0)

    const addPosition = (match: string, selection: string, odds: number, stake: number = 0.01) => {
        const newPosition: BetPosition = {
            id: `pos_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            match,
            selection,
            odds,
            stake,
        }
        setPositions(prev => [...prev, newPosition])
    }

    const removePosition = (id: string) => {
        setPositions(prev => prev.filter(p => p.id !== id))
    }

    const placeBet = async () => {
        if (positions.length === 0) {
            alert('No positions - Add bets to your slip first')
            return
        }

        try {
            const result = await pay({
                marketId,
                sport,
                stake: parseFloat(stake),
            })

            if (result.success) {
                alert(`Bet Placed! Stake: $${stake}\nPosition token minted.`)
                setPositions([])
                setStake('0.01')
            }
        } catch (error) {
            alert('Bet Failed - Please try again')
        }
    }

    return (
        <Card className={`w-full max-w-sm ${className}`}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Bet Slip
                    <span className="text-2xl font-black text-pink-500">{positions.length}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {positions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-lg font-medium mb-2">No bets added</p>
                        <p className="text-sm">Click odds to add selections</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {positions.map((position) => (
                            <div key={position.id} className="p-4 border rounded-lg space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{position.match}</p>
                                        <p className="text-xs text-muted-foreground">{position.selection}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">@{position.odds.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">${position.stake.toFixed(2)}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => removePosition(position.id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <div className="pt-4 border-t space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Total Odds: <span className="font-bold text-foreground">{totalOdds.toFixed(2)}</span>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                Potential Return: <span className="font-bold text-green-600">${(totalStake * totalOdds).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Stake (CRO)</label>
                        <Input
                            type="number"
                            value={stake}
                            onChange={(e) => setStake(e.target.value)}
                            placeholder="0.01"
                            step="0.01"
                            min="0.01"
                            max="100"
                            disabled={!isConnected || isPaying}
                        />
                    </div>
                    <Button
                        onClick={placeBet}
                        disabled={!isConnected || positions.length === 0 || isPaying}
                        className="w-full h-12 font-bold text-lg"
                        size="lg"
                    >
                        {isPaying ? 'Processing...' : `Place Bet • $${stake}`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Global event emitter for adding bets from anywhere
declare global {
    interface Window {
        addToBetSlip: (match: string, selection: string, odds: number) => void
    }
}

if (typeof window !== 'undefined') {
    window.addToBetSlip = (match, selection, odds) => {
        // Emit to all BetSlip instances via custom event
        document.dispatchEvent(new CustomEvent('add-bet', {
            detail: { match, selection, odds }
        }))
    }
}
