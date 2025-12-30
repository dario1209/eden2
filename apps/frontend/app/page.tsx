'use client'

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-24 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-6xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-8">
                    Micro-Bets Live
                </h1>
                <p className="text-xl text-muted-foreground mb-12">
                    x402 payments + Chainlink settlement on Cronos. Bet on every point,
                    kill, corner. Real-time, on-chain, sub-second.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="text-left p-8 rounded-xl border bg-card">
                        <h3 className="text-2xl font-bold mb-4">⚡ 402 Tickets</h3>
                        <p>Every bet is an HTTP 402 payment. Instant, verifiable, agent-ready.</p>
                    </div>
                    <div className="text-left p-8 rounded-xl border bg-card">
                        <h3 className="text-2xl font-bold mb-4">🔗 Chainlink</h3>
                        <p>Sports data oracles settle every micro-market automatically.</p>
                    </div>
                    <div className="text-left p-8 rounded-xl border bg-card">
                        <h3 className="text-2xl font-bold mb-4">⚫ Cronos</h3>
                        <p>Sub-second blocks, micro-transaction fees. Built for speed.</p>
                    </div>
                </div>
                <a
                    href="/live"
                    className="inline-flex items-center gap-4 bg-primary text-primary-foreground px-12 py-6 rounded-2xl text-xl font-bold hover:bg-primary/90 transition-all"
                >
                    Enter Live Arena
                </a>
            </div>
        </div>
    )
}
