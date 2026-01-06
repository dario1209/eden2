'use client'

import Link from 'next/link'

const markets = [
    {
        id: 'next-point',
        title: 'Next Point Winner',
        options: [
            { name: 'Team A', odds: 1.92, color: '#7EC8E3' },
            { name: 'Team B', odds: 1.88, color: '#FF6B9D' },
        ]
    },
    {
        id: 'next-goal',
        title: 'Next Goal Scorer',
        options: [
            { name: 'Team A', odds: 1.75, color: '#7EC8E3' },
            { name: 'Team B', odds: 2.15, color: '#FF6B9D' },
        ]
    },
    {
        id: 'next-corner',
        title: 'Next Corner',
        options: [
            { name: 'Team A', odds: 1.85, color: '#7EC8E3' },
            { name: 'Team B', odds: 1.95, color: '#FF6B9D' },
        ]
    },
    {
        id: 'next-card',
        title: 'Next Card',
        options: [
            { name: 'Team A', odds: 2.20, color: '#7EC8E3' },
            { name: 'Team B', odds: 1.70, color: '#FF6B9D' },
        ]
    },
    {
        id: 'next-throw-in',
        title: 'Next Throw-In',
        options: [
            { name: 'Team A', odds: 1.90, color: '#7EC8E3' },
            { name: 'Team B', odds: 1.90, color: '#FF6B9D' },
        ]
    },
    {
        id: 'total-goals',
        title: 'Total Goals Over/Under 2.5',
        options: [
            { name: 'Over 2.5', odds: 1.65, color: '#957DAD' },
            { name: 'Under 2.5', odds: 2.25, color: '#C44569' },
        ]
    },
]

export default function Markets({ params }: { params: { sport: string } }) {
    const { sport } = params

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <Link
                    href="/"
                    className="font-medium transition-colors"
                    style={{ color: '#957DAD' }}
                >
                    Home
                </Link>
                <span style={{ color: '#C9A0DC' }}>›</span>
                <Link
                    href="/live"
                    className="font-medium transition-colors"
                    style={{ color: '#957DAD' }}
                >
                    Live
                </Link>
                <span style={{ color: '#C9A0DC' }}>›</span>
                <Link
                    href={`/${sport}`}
                    className="font-medium transition-colors"
                    style={{ color: '#957DAD' }}
                >
                    {sport.toUpperCase()}
                </Link>
                <span style={{ color: '#C9A0DC' }}>›</span>
                <span className="font-bold" style={{ color: '#6B4C7A' }}>
                    Markets
                </span>
            </div>

            {/* Page Title - Window Style */}
            <div
                className="rounded-lg overflow-hidden mb-8"
                style={{ border: '2px solid #E0BBE4' }}
            >
                <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{ background: 'linear-gradient(180deg, #E0BBE4 0%, #C9A0DC 100%)' }}
                >
                    <span className="text-xs font-bold text-white/90 tracking-wide">
                        ✦ {sport.toUpperCase()}_MARKETS.DAT
                    </span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-pink-300"></div>
                    </div>
                </div>
                <div
                    className="p-6"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1
                                className="text-3xl font-black mb-2"
                                style={{ color: '#6B4C7A' }}
                            >
                                {sport.toUpperCase()} Markets
                            </h1>
                            <p style={{ color: '#957DAD' }}>
                                Micro-bet on every action • HTTP 402 payments • Instant settlement
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{ background: 'rgba(126, 200, 227, 0.15)' }}
                        >
                            <span
                                className="text-sm font-bold"
                                style={{ color: '#5BA4C9' }}
                            >
                                {markets.length} Markets
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Markets Grid */}
            <div className="grid gap-4">
                {markets.map((market) => (
                    <div
                        key={market.id}
                        className="rounded-lg overflow-hidden transition-all hover:scale-[1.01]"
                        style={{ border: '2px solid #E0BBE4' }}
                    >
                        <div
                            className="flex items-center justify-between px-3 py-1.5"
                            style={{ background: 'linear-gradient(180deg, #F8E8F8 0%, #F0E0F0 100%)' }}
                        >
                            <span
                                className="text-xs font-bold tracking-wide"
                                style={{ color: '#957DAD' }}
                            >
                                {market.title.toUpperCase().replace(/ /g, '_')}.BET
                            </span>
                            <div
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(255, 107, 157, 0.15)' }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ background: '#FF6B9D' }}
                                />
                                <span
                                    className="text-[10px] font-bold"
                                    style={{ color: '#C44569' }}
                                >
                                    LIVE
                                </span>
                            </div>
                        </div>
                        <div
                            className="p-6"
                            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                        >
                            <h3
                                className="text-xl font-bold mb-4"
                                style={{ color: '#6B4C7A' }}
                            >
                                {market.title}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {market.options.map((option, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/${sport}/${market.id}`}
                                        className="group p-5 rounded-xl text-center transition-all hover:scale-[1.03]"
                                        style={{
                                            background: `${option.color}10`,
                                            border: `2px solid ${option.color}40`
                                        }}
                                    >
                                        <p
                                            className="font-semibold mb-2"
                                            style={{ color: '#6B4C7A' }}
                                        >
                                            {option.name}
                                        </p>
                                        <div
                                            className="text-3xl font-black transition-transform group-hover:scale-110"
                                            style={{ color: option.color }}
                                        >
                                            {option.odds.toFixed(2)}
                                        </div>
                                        <p
                                            className="text-xs mt-2 font-medium"
                                            style={{ color: '#957DAD' }}
                                        >
                                            Min: $0.01
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div
                className="mt-8 rounded-lg overflow-hidden"
                style={{ border: '2px solid #7EC8E3' }}
            >
                <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{ background: 'linear-gradient(180deg, #7EC8E3 0%, #5BA4C9 100%)' }}
                >
                    <span className="text-xs font-bold text-white/90 tracking-wide">
                        ℹ️ INFO.TXT
                    </span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-pink-300"></div>
                    </div>
                </div>
                <div
                    className="p-6"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                >
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div
                                className="text-2xl font-black mb-1"
                                style={{ color: '#FF6B9D' }}
                            >
                                ⚡ x402
                            </div>
                            <p
                                className="text-sm"
                                style={{ color: '#957DAD' }}
                            >
                                HTTP 402 payments for instant betting
                            </p>
                        </div>
                        <div>
                            <div
                                className="text-2xl font-black mb-1"
                                style={{ color: '#7EC8E3' }}
                            >
                                🔗 Chainlink
                            </div>
                            <p
                                className="text-sm"
                                style={{ color: '#957DAD' }}
                            >
                                Oracle-verified settlement
                            </p>
                        </div>
                        <div>
                            <div
                                className="text-2xl font-black mb-1"
                                style={{ color: '#957DAD' }}
                            >
                                ⚫ Cronos
                            </div>
                            <p
                                className="text-sm"
                                style={{ color: '#957DAD' }}
                            >
                                Sub-second block finality
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}