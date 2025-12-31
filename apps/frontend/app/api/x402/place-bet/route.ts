import { getWalletAddress } from '@/lib/cookies'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Industry-standard Zod validation schema
const PlaceBetSchema = z.object({
    marketId: z.string().min(1, 'Market ID required'),
    sport: z.enum(['football', 'basketball', 'tennis', 'esports', 'casino']),
    stake: z.coerce.number().min(0.01, 'Minimum stake $0.01').max(100, 'Maximum stake $100'),
})

export async function POST(request: NextRequest) {
    try {
        // Parse + validate request body
        const body = await request.json()
        const { marketId, sport, stake } = PlaceBetSchema.parse(body)

        // Get authenticated wallet
        const wallet = await getWalletAddress()
        if (!wallet) {
            return NextResponse.json(
                { error: 'Wallet not connected' },
                { status: 401 }
            )
        }

        // TODO: Integrate with real blockchain/DB
        const bet = {
            id: `bet_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            marketId,
            sport,
            wallet,
            stake,
            status: 'pending' as const,
            odds: 1.92, // Fetch from market data
            timestamp: new Date().toISOString(),
            chain: 'cronos',
            txHash: null, // Set after blockchain confirmation
        }

        console.log('[BET-PLACED]', { betId: bet.id, wallet: wallet.slice(0, 10) + '...', stake })

        // TODO: Store in database + emit websocket event
        return NextResponse.json({
            success: true,
            bet,
            message: 'Bet placed successfully. Awaiting blockchain confirmation.',
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request', details: error.errors },
                { status: 400 }
            )
        }

        console.error('[PLACE-BET-ERROR]', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
