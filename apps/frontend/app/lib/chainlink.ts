export async function fetchMarkets(sport: string) {
    const res = await fetch(`/api/chainlink/markets?sport=${sport}`)
    return res.json()
}

export interface Market {
    id: string
    sport: string
    description: string
    odds: Record<string, string>
    expires: number
}
