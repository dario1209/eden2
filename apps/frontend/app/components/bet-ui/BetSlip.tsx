'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useX402Pay } from '@/lib/x402'
import { useState } from 'react'

interface BetSlipProps {
    marketId: string
    sport: string
    disabled?: boolean
}

export function BetSlip({ marketId, sport, disabled }: BetSlipProps) {
    const [stake, setStake] = useState('0.01')
    const { pay, isPaying } = useX402Pay(`/api/x402/place-bet`)

    const handlePlaceBet = async () => {
        const result = await pay({
            marketId,
            sport,
            stake: parseFloat(stake),
        })
        if (result.success) {
            alert('Bet placed! Position token minted.')
        }
    }

    return (
        <Card className="bg-white/20 backdrop-blur-xl border-white/30">
            <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Bet Slip</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white/80 mb-2 block">Stake (CRO)</label>
                        <input
                            type="number"
                            value={stake}
                            onChange={(e) => setStake(e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary"
                            placeholder="0.01"
                            step="0.01"
                            min="0.01"
                            max="1.00"
                            disabled={disabled}
                        />
                    </div>
                    <Button
                        onClick={handlePlaceBet}
                        disabled={disabled || isPaying}
                        className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        size="lg"
                    >
                        {isPaying ? 'Paying...' : `Place Bet ($${stake})`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
