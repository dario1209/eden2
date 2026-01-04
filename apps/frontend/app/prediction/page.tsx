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

import type { Route } from 'next';
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        slug: "markets",
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

const navItems: { name: string; path: Route }[] = [
    { name: 'Live', path: '/' as Route },
    { name: 'Sports', path: '/sports' as Route },
    { name: 'Esports', path: '/esports' as Route },
    { name: 'Casino', path: '/casino' as Route },
    { name: 'Prediction', path: '/prediction' as Route }
]

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
    const pathname = usePathname()
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')
    const [scoreboardTime, setScoreboardTime] = useState(SCOREBOARD.time);

    // Update time and date
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }))
            setCurrentDate(now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Simulate live timer for scoreboard
    useEffect(() => {
        const interval = setInterval(() => {
            const [mins, secs] = scoreboardTime.split(":").map(Number);
            const totalSecs = mins * 60 + secs + 1;
            const newMins = Math.floor(totalSecs / 60);
            const newSecs = totalSecs % 60;
            setScoreboardTime(`${newMins}:${newSecs.toString().padStart(2, "0")}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [scoreboardTime]);

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy Vaporwave Background - Prediction Theme */}
            <div className="fixed inset-0">
                {/* Main gradient - soft prediction pastels */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #E6E6FA 0%, #DDA0DD 15%, #FFB6C1 30%, #FFDAB9 50%, #B0E0E6 70%, #98D8C8 85%, #E6E6FA 100%)'
                    }}
                />

                {/* Secondary overlay for depth */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 20%, rgba(230, 230, 250, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 182, 193, 0.4) 0%, transparent 50%)'
                    }}
                />

                {/* Retro grid overlay */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Floating clouds */}
                <div className="absolute top-16 left-[8%] text-5xl opacity-70 animate-bounce" style={{ animationDuration: '6s' }}>☁️</div>
                <div className="absolute top-32 right-[12%] text-4xl opacity-60 animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>☁️</div>
                <div className="absolute top-48 left-[25%] text-3xl opacity-50 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>☁️</div>

                {/* Sparkles */}
                <div className="absolute top-24 right-[30%] text-2xl opacity-60 animate-pulse">✦</div>
                <div className="absolute top-40 left-[15%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute bottom-32 right-[20%] text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                <div className="absolute bottom-48 left-[35%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>✧</div>
                <div className="absolute top-[60%] right-[8%] text-lg opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>⭐</div>

                {/* Prediction-themed floating elements */}
                <div className="absolute bottom-24 right-[15%] text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>🔮</div>
                <div className="absolute top-[45%] left-[5%] text-2xl opacity-30 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>📊</div>
                <div className="absolute bottom-[40%] right-[5%] text-2xl opacity-35 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>🎯</div>
            </div>

            {/* Windows 95 Style Taskbar */}
            <div
                className="fixed top-0 left-0 right-0 z-50 h-14"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,232,248,0.95) 100%)',
                    borderBottom: '3px solid #D8BFD8',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <div className="h-full px-4 flex items-center justify-between max-w-[1800px] mx-auto">
                    {/* Left - Logo */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                            style={{
                                background: 'linear-gradient(135deg, #957DAD 0%, #6B4C7A 100%)',
                                boxShadow: '0 4px 15px rgba(149, 125, 173, 0.4)'
                            }}
                        >
                            🔮
                        </div>
                        <span
                            className="text-xl font-black tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, #957DAD, #6B4C7A)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            MicroBets
                        </span>
                    </div>

                    {/* Center - Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${pathname === item.path
                                        ? 'text-white'
                                        : 'hover:scale-105'
                                    }`}
                                style={
                                    pathname === item.path
                                        ? {
                                            background: 'linear-gradient(135deg, #957DAD 0%, #6B4C7A 100%)',
                                            boxShadow: '0 4px 15px rgba(149, 125, 173, 0.3)'
                                        }
                                        : { color: '#6B4C7A' }
                                }
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right - Time, Date & Connect Wallet */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-black" style={{ color: '#6B4C7A' }}>
                                {currentTime}
                            </span>
                            <span className="text-xs font-medium" style={{ color: '#957DAD' }}>
                                {currentDate}
                            </span>
                        </div>
                        <button
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%)',
                                boxShadow: '0 4px 15px rgba(126, 200, 227, 0.4)'
                            }}
                        >
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 pt-20 pb-12 px-4 max-w-7xl mx-auto">
                {/* Navigation Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link href="/" className="text-[#957DAD] hover:text-[#6B4C7A] transition-colors">
                        Home
                    </Link>
                    <span className="text-[#E0BBE4]">›</span>
                    <span className="text-[#6B4C7A] font-medium">Prediction Markets</span>
                </nav>

                {/* Hero Header */}
                <div
                    className="rounded-xl overflow-hidden mb-8"
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '3px solid #D8BFD8',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div
                        className="px-4 py-2 flex items-center justify-between"
                        style={{
                            background: 'linear-gradient(90deg, #FF6B9D 0%, #957DAD 50%, #7EC8E3 100%)'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-bold drop-shadow-sm">✦ PREDICTION_LIVE.EXE</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1
                                    className="text-4xl font-black mb-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D, #957DAD, #7EC8E3)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent'
                                    }}
                                >
                                    Prediction Markets
                                </h1>
                                <p className="text-[#957DAD]">
                                    Real-time micro-betting with sub-second settlement
                                </p>
                            </div>

                            <div
                                className="flex items-center gap-2 px-4 py-2 rounded-full"
                                style={{
                                    background: 'rgba(255,255,255,0.8)',
                                    border: '2px solid #FF6B9D'
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-[#FF6B9D] animate-pulse" />
                                <span className="text-sm font-bold text-[#FF6B9D]">LIVE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Active Markets */}
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="px-4 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #957DAD 0%, #7EC8E3 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-bold drop-shadow-sm">📊 ACTIVE_MARKETS.DAT</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
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
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="px-4 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-bold drop-shadow-sm">🎮 SCOREBOARD.EXE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#6B4C7A] mb-6">Scoreboard</h2>
                            <Scoreboard data={{ ...SCOREBOARD, time: scoreboardTime }} />
                        </div>
                    </div>
                </div>

                {/* Featured Market Banner */}
                <Link
                    href="/prediction/markets"
                    className="block mt-8 group"
                >
                    <div
                        className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="px-4 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #7EC8E3 0%, #5BA4C9 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-bold drop-shadow-sm">🏆 FEATURED_MARKET.EXE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-r from-[#FF6B9D]/10 via-[#E0BBE4]/10 to-[#7EC8E3]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                                            boxShadow: '0 8px 30px rgba(255, 107, 157, 0.4)'
                                        }}
                                    >
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
                                    <span
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold group-hover:scale-105 transition-transform"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                                            boxShadow: '0 8px 30px rgba(255, 107, 157, 0.4)'
                                        }}
                                    >
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
                    {[
                        { value: '$9,850', label: 'Total Volume', color: '#FF6B9D' },
                        { value: '3', label: 'Active Markets', color: '#7EC8E3' },
                        { value: '142', label: 'Total Bets', color: '#10B981' },
                        { value: '89', label: 'Unique Traders', color: '#957DAD' },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.9)',
                                border: '3px solid #D8BFD8',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div className="p-4 text-center">
                                <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-xs text-[#957DAD] mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* How It Works */}
                <div
                    className="mt-8 rounded-xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '3px solid #D8BFD8',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                >
                    <div
                        className="px-4 py-2 flex items-center justify-between"
                        style={{
                            background: 'linear-gradient(90deg, #957DAD 0%, #6B4C7A 100%)'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-white text-xs font-bold drop-shadow-sm">📖 HOW_IT_WORKS.TXT</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-[#6B4C7A] mb-6">How It Works</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)'
                                    }}
                                >
                                    1️⃣
                                </div>
                                <h3 className="text-lg font-bold text-[#6B4C7A] mb-2">Pick a Market</h3>
                                <p className="text-sm text-[#957DAD]">
                                    Browse active prediction markets and find one you have conviction on.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                                    style={{
                                        background: 'linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%)'
                                    }}
                                >
                                    2️⃣
                                </div>
                                <h3 className="text-lg font-bold text-[#6B4C7A] mb-2">Place Your Bet</h3>
                                <p className="text-sm text-[#957DAD]">
                                    Choose YES or NO, enter your amount, and confirm with your wallet.
                                </p>
                            </div>

                            <div className="p-6 rounded-xl bg-[#F8E8F8]/50 border border-[#E0BBE4]">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                    }}
                                >
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

            {/* Desktop Icons (decorative) */}
            <div className="fixed right-8 top-36 z-5 hidden 2xl:flex flex-col gap-6">
                {[
                    { icon: '📁', label: 'My Bets' },
                    { icon: '📊', label: 'Portfolio' },
                    { icon: '⚙️', label: 'Settings' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all group-hover:scale-110"
                            style={{
                                background: 'rgba(255,255,255,0.85)',
                                border: '2px solid #D8BFD8',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}
                        >
                            {item.icon}
                        </div>
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{
                                background: 'rgba(255,255,255,0.9)',
                                color: '#6B4C7A'
                            }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}