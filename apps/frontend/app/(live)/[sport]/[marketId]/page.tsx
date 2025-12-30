'use client'

import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { BetSlip } from '../../../components/bet-ui/BetSlip'
import { LiveScore } from '../../../components/live/LiveScore'

export default function MarketDetail() {
    const params = useParams()
    const { isConnected } = useAccount()

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <LiveScore sport={params.sport as string} marketId={params.marketId as string} />
                </div>
                <div className="sticky top-8 self-start">
                    <BetSlip
                        marketId={params.marketId as string}
                        sport={params.sport as string}
                        disabled={!isConnected}
                    />
                </div>
            </div>
        </div>
    )
}
