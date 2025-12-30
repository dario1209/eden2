import { NextResponse } from 'next/server'

export async function GET() {
    // Mock Chainlink market data
    const markets = [
        {
            id: 'next-goal-123',
            sport: 'soccer',
            description: 'Next Goal Scorer',
            odds: { home: '1.85', away: '1.95' },
            expires: Date.now() + 300000 // 5min
        }
    ]

    return NextResponse.json(markets)
}
