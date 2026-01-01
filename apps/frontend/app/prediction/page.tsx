/**
 * Prediction Markets Landing Page
 * 
 * Displays active prediction markets with:
 * - Clickable market cards linking to detail pages
 * - Live scoreboard (for sports integration)
 * - Pastel Dream vaporwave aesthetic
 * 
 * Route: /prediction
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface Market {
    id: string;
    slug: string;
    question: string;
    shortTitle: string;
    odds: number;
    pool: number;
    status: "active" | "closed" | "resolved";
    category: string;
    icon: string;
    yesPercent: number;
    noPercent: number;
    endsIn: string;
}

interface ScoreboardData {
    teamA: { name: string; score: number; shots: number };
    teamB: { name: string; score: number; shots: number };
    time: string;
    possession: number;
    isLive: boolean;
}

// ============================================================================
// MARKET DATA
// ============================================================================

const MARKETS: Market[] = [
    {
        id: "microbets-hackathon",
        slug: "markets", // This links to /prediction/markets
        question: "Will MicroBets win the Cronos x402 Hackathon?",
        shortTitle: "MicroBets Hackathon Win",
        odds: 2.38,
        pool: 1250,
        status: "active",
        category: "Crypto",
        icon: "🏆",
        yesPercent: 42,
        noPercent: 58,
        endsIn: "31 days",
    },
    {
        id: "btc-100k",
        slug: "btc-100k",
        question: "Will BTC reach $100k by Feb 2026?",
        shortTitle: "BTC $100K",
        odds: 1.85,
        pool: 5420,
        status: "active",
        category: "Crypto",
        icon: "₿",
        yesPercent: 54,
        noPercent: 46,
        endsIn: "45 days",
    },
    {
        id: "eth-merge-v2",
        slug: "eth-merge-v2",
        question: "Will ETH implement Proto-Danksharding in Q1?",
        shortTitle: "ETH Proto-Danksharding",
        odds: 1.92,
        pool: 3180,
        status: "active",
        category: "Crypto",
        icon: "⟠",
        yesPercent: 52,
        noPercent: 48,
        endsIn: "60 days",
    },
];

const SCOREBOARD: ScoreboardData = {
    teamA: { name: "Team A", score: 1, shots: 5 },
    teamB: { name: "Team B", score: 0, shots: 3 },
    time: "45:23",
    possession: 55,
    isLive: true,
};

// ============================================================================
// COMPONENTS
// ============================================================================

const MarketCard = ({ market }: { market: Market }) => {
    const isHackathonMarket = market.id === "microbets-hackathon";

    return (
        <Link
            href={`/prediction/${market.slug}`}
            className="block p-4 rounded-xl border-2 border-[#E0BBE4] bg-white/80 hover:border-[#FF6B9D] hover:shadow-lg hover:shadow-[#FF6B9D]/20 transition-all duration-300 group cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{market.icon}</span>
                    <div>
                        <p className="text-xs text-[#957DAD] font-medium">{market.shortTitle}</p>
                        <p className="text-lg font-bold text-[#FF6B9D] group-hover:text-[#C44569] transition-colors">
                            {market.odds.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-[#F8E8F8] text-[#957DAD]">
                        ${market.pool.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Progress bar showing Yes/No split */}
            <div className="h-1.5 rounded-full overflow-hidden flex mb-2">
                <div
                    className="bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-500"
                    style={{ width: `${market.yesPercent}%` }}
                />
                <div
                    className="bg-gradient-to-r from-[#F43F5E] to-[#FB7185] transition-all duration-500"
                    style={{ width: `${market.noPercent}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-[#957DAD]">
                <span>Yes {market.yesPercent}% / No {market.noPercent}%</span>
                <span>{market.endsIn}</span>
            </div>

            {isHackathonMarket && (
                <div className="mt-3 pt-3 border-t border-[#E0BBE4]">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B9D]">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                        Featured Market
                    </span>
                </div>
            )}
        </Link>
    );
};

const Scoreboard = ({ data }: { data: ScoreboardData }) => (
    <div className="text-center">
        {/* Score Display */}
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-center">
                <p className="text-5xl font-black text-[#7EC8E3]">{data.teamA.score}</p>
                <p className="text-sm text-[#957DAD] mt-1">{data.teamA.name}</p>
            </div>
            <div className="text-2xl text-[#E0BBE4] font-light">-</div>
            <div className="text-center">
                <p className="text-5xl font-black text-[#FF6B9D]">{data.teamB.score}</p>
                <p className="text-sm text-[#957DAD] mt-1">{data.teamB.name}</p>
            </div>
        </div>

        {/* Time */}
        <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-lg font-bold text-[#7EC8E3]">{data.time}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#F8E8F8]/50">
            <div className="text-center">
                <p className="text-xl font-bold text-[#7EC8E3]">{data.teamA.shots}</p>
                <p className="text-xs text-[#957DAD]">Shots</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-[#6B4C7A]">{data.possession}%</p>
                <p className="text-xs text-[#957DAD]">Possession</p>
            </div>
            <div className="text-center">
                <p className="text-xl font-bold text-[#FF6B9D]">{data.teamB.shots}</p>
                <p className="text-xs text-[#957DAD]">Shots</p>
            </div>
        </div>
    </div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PredictionPage() {
    const [currentTime, setCurrentTime] = useState(SCOREBOARD.time);

    // Simulate live timer
    useEffect(() => {
        const interval = setInterval(() => {
            const [mins, secs] = currentTime.split(":").map(Number);
            const totalSecs = mins * 60 + secs + 1;
            const newMins = Math.floor(totalSecs / 60);
            const newSecs = totalSecs % 60;
            setCurrentTime(`${newMins}:${newSecs.toString().padStart(2, "0")}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTime]);

    return (
        <div className="min-h-screen pb-12">
            {/* Floating decorative elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-4 h-4 text-[#FF6B9D] opacity-40 sparkle">✦</div>
                <div className="absolute top-40 right-20 w-3 h-3 text-[#7EC8E3] opacity-50 sparkle" style={{ animationDelay: "0.5s" }}>✦</div>
                <div className="absolute bottom-40 left-1/4 w-5 h-5 text-[#E0BBE4] opacity-30 float">◇</div>
                <div className="absolute top-1/3 right-1/3 w-4 h-4 text-[#FFB6C1] opacity-40 float" style={{ animationDelay: "2s" }}>✧</div>
                <div className="absolute bottom-20 right-10 w-4 h-4 text-[#957DAD] opacity-30 sparkle" style={{ animationDelay: "1s" }}>✦</div>
            </div>

            {/* Navigation Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm">
                    <Link href="/" className="text-[#957DAD] hover:text-[#6B4C7A] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#E0BBE4]">›</span>
                    <Link href="/live" className="text-[#957DAD] hover:text-[#6B4C7A] transition-colors">
                        Live
                    </Link>
                    <span className="text-[#E0BBE4]">›</span>
                    <span className="text-[#6B4C7A] font-medium">PREDICTION</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4">

                {/* Hero Header */}
                <div className="window-card mb-8">
                    <div className="window-titlebar window-titlebar-pink flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>✦</span>
                            <span>PREDICTION_LIVE.EXE</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="window-btn" />
                            <div className="window-btn" />
                            <div className="window-btn window-btn-close" />
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-black gradient-text-pastel mb-3">
                                    PREDICTION Live
                                </h1>
                                <p className="text-[#957DAD]">
                                    Real-time micro-betting with sub-second settlement
                                </p>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#FF6B9D]">
                                <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                                <span className="text-sm font-bold text-[#FF6B9D]">LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Active Markets */}
                    <div className="window-card">
                        <div className="window-titlebar flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span>📊</span>
                                <span>ACTIVE_MARKETS.DAT</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="window-btn" />
                                <div className="window-btn" />
                                <div className="window-btn window-btn-close" />
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#6B4C7A] mb-6">Active Markets</h2>

                            <div className="space-y-4">
                                {MARKETS.map((market) => (
                                    <MarketCard key={market.id} market={market} />
                                ))}
                            </div>

                            <Link
                                href="/prediction/all"
                                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#FF6B9D] hover:text-[#C44569] transition-colors"
                            >
                                View All Markets
                                <span>→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Scoreboard */}
                    <div className="window-card">
                        <div className="window-titlebar window-titlebar-pink flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span>🎮</span>
                                <span>SCOREBOARD.EXE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="window-btn" />
                                <div className="window-btn" />
                                <div className="window-btn window-btn-close" />
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#6B4C7A] mb-6">Scoreboard</h2>
                            <Scoreboard data={{ ...SCOREBOARD, time: currentTime }} />
                        </div>
                    </div>
                </div>

                {/* Featured Market Banner */}
                <Link
                    href="/prediction/markets"
                    className="block mt-8 group"
                >
                    <div className="window-card overflow-hidden hover:shadow-xl hover:shadow-[#FF6B9D]/20 transition-all duration-300">
                        <div className="window-titlebar window-titlebar-aqua flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span>🏆</span>
                                <span>FEATURED_MARKET.EXE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="window-btn" />
                                <div className="window-btn" />
                                <div className="window-btn window-btn-close" />
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-r from-[#FF6B9D]/10 via-[#E0BBE4]/10 to-[#7EC8E3]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B9D] to-[#C44569] flex items-center justify-center text-4xl shadow-lg glow-pink group-hover:scale-110 transition-transform">
                                        🏆
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#FF6B9D] font-semibold mb-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                                            FEATURED MARKET
                                        </p>
                                        <h3 className="text-2xl font-bold text-[#6B4C7A] group-hover:text-[#FF6B9D] transition-colors">
                                            Will MicroBets win the Cronos x402 Hackathon?
                                        </h3>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="px-3 py-1 rounded-full bg-white border border-[#E0BBE4] text-xs font-medium text-[#6B4C7A]">
                                                📊 $1,250 Pool
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-white border border-[#E0BBE4] text-xs font-medium text-[#6B4C7A]">
                                                ⏰ 31 days left
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-medium text-[#10B981]">
                                                Yes 42%
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs font-medium text-[#F43F5E]">
                                                No 58%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-pink text-white font-bold group-hover:scale-105 transition-transform">
                                        Trade Now
                                        <span>→</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="window-card">
                        <div className="p-4 text-center">
                            <p className="text-3xl font-black text-[#FF6B9D]">$9,850</p>
                            <p className="text-xs text-[#957DAD] mt-1">Total Volume</p>
                        </div>
                    </div>
                    <div className="window-card">
                        <div className="p-4 text-center">
                            <p className="text-3xl font-black text-[#7EC8E3]">3</p>
                            <p className="text-xs text-[#957DAD] mt-1">Active Markets</p>
                        </div>
                    </div>
                    <div className="window-card">
                        <div className="p-4 text-center">
                            <p className="text-3xl font-black text-[#10B981]">142</p>
                            <p className="text-xs text-[#957DAD] mt-1">Total Bets</p>
                        </div>
                    </div>
                    <div className="window-card">
                        <div className="p-4 text-center">
                            <p className="text-3xl font-black text-[#957DAD]">89</p>
                            <p className="text-xs text-[#957DAD] mt-1">Unique Traders</p>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="window-card mt-8">
                    <div className="window-titlebar flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>📖</span>
                            <span>HOW_IT_WORKS.TXT</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="window-btn" />
                            <div className="window-btn" />
                            <div className="window-btn window-btn-close" />
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-[#6B4C7A] mb-6">How It Works</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#C44569] flex items-center justify-center text-2xl mb-4">
                                    1️⃣
                                </div>
                                <h3 className="text-lg font-bold text-[#6B4C7A] mb-2">Pick a Market</h3>
                                <p className="text-sm text-[#957DAD]">
                                    Browse active prediction markets and find one you have conviction on.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7EC8E3] to-[#5BA4C9] flex items-center justify-center text-2xl mb-4">
                                    2️⃣
                                </div>
                                <h3 className="text-lg font-bold text-[#6B4C7A] mb-2">Place Your Bet</h3>
                                <p className="text-sm text-[#957DAD]">
                                    Choose YES or NO, enter your amount, and confirm with your wallet.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-2xl mb-4">
                                    3️⃣
                                </div>
                                <h3 className="text-lg font-bold text-[#6B4C7A] mb-2">Win & Claim</h3>
                                <p className="text-sm text-[#957DAD]">
                                    If your prediction is correct, claim your winnings instantly on-chain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}