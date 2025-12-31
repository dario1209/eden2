'use client'

import Link from 'next/link'
import { useState } from 'react'

// Mock live match data
const liveMatches = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 2,
        awayScore: 1,
        time: '67:23',
        odds: { home: 1.45, draw: 4.20, away: 6.50 },
        overUnder: { over: 1.85, under: 1.95 },
    },
    {
        id: 2,
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: 1,
        awayScore: 1,
        time: '34:12',
        odds: { home: 2.10, draw: 3.40, away: 3.25 },
        overUnder: { over: 1.72, under: 2.10 },
    },
    {
        id: 3,
        league: 'Serie A',
        homeTeam: 'AC Milan',
        awayTeam: 'Inter Milan',
        homeScore: 0,
        awayScore: 2,
        time: '81:45',
        odds: { home: 8.50, draw: 5.00, away: 1.25 },
        overUnder: { over: 1.55, under: 2.40 },
    },
    {
        id: 4,
        league: 'Bundesliga',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Dortmund',
        homeScore: 3,
        awayScore: 2,
        time: '52:08',
        odds: { home: 1.65, draw: 4.00, away: 5.25 },
        overUnder: { over: 1.40, under: 2.85 },
    },
    {
        id: 5,
        league: 'Esports - CS2',
        homeTeam: 'NaVi',
        awayTeam: 'FaZe Clan',
        homeScore: 14,
        awayScore: 12,
        time: 'Map 2',
        odds: { home: 1.35, draw: null, away: 3.10 },
        overUnder: { over: 1.90, under: 1.90 },
    },
]

const sports = [
    { icon: '⚽', name: 'Football', count: 142 },
    { icon: '🏀', name: 'Basketball', count: 38 },
    { icon: '🎮', name: 'Esports', count: 67 },
    { icon: '🎾', name: 'Tennis', count: 24 },
    { icon: '🏈', name: 'American Football', count: 12 },
    { icon: '⚾', name: 'Baseball', count: 8 },
    { icon: '🏒', name: 'Hockey', count: 16 },
    { icon: '🥊', name: 'MMA/Boxing', count: 5 },
]

export default function Home() {
    const [selectedSport, setSelectedSport] = useState('Football')
    const [betSlip, setBetSlip] = useState<Array<{ match: string; selection: string; odds: number }>>([])

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip(prev => [...prev, { match, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen bg-[#0a0612] text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0a0612] to-[#0d1a2d]" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ff00ff]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00ffff]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#ff6b00]/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(#ff00ff 1px, transparent 1px),
              linear-gradient(90deg, #ff00ff 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff00ff] to-[#00ffff] flex items-center justify-center text-xl font-black shadow-lg shadow-[#ff00ff]/25 group-hover:shadow-[#ff00ff]/50 transition-shadow">
                                μ
                            </div>
                            <span className="text-xl font-black tracking-tight">
                                <span className="bg-gradient-to-r from-[#ff00ff] via-[#ff6ec7] to-[#00ffff] bg-clip-text text-transparent">
                                    MICRO
                                </span>
                                <span className="text-white/80">BETS</span>
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            {['Live', 'Sports', 'Esports', 'Casino'].map((item, i) => (
                                <Link
                                    key={item}
                                    href={item === 'Live' ? '/live' : '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${i === 0
                                            ? 'bg-gradient-to-r from-[#ff00ff]/20 to-[#00ffff]/20 text-white border border-[#ff00ff]/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {i === 0 && <span className="inline-block w-2 h-2 bg-[#00ff88] rounded-full mr-2 animate-pulse" />}
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
                            <span className="text-[#00ffff]">🔍</span>
                            Search
                        </button>
                        <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff00ff] to-[#ff6ec7] text-sm font-bold shadow-lg shadow-[#ff00ff]/25 hover:shadow-[#ff00ff]/40 hover:scale-105 transition-all">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-20 border-r border-white/5 bg-black/20 backdrop-blur-xl min-h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center py-4 gap-1">
                        {sports.map((sport) => (
                            <button
                                key={sport.name}
                                onClick={() => setSelectedSport(sport.name)}
                                className={`group relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${selectedSport === sport.name
                                        ? 'bg-gradient-to-br from-[#ff00ff]/30 to-[#00ffff]/30 border border-[#ff00ff]/50 shadow-lg shadow-[#ff00ff]/20'
                                        : 'hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-2xl">{sport.icon}</span>
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff00ff] text-[10px] font-bold flex items-center justify-center shadow-lg shadow-[#ff00ff]/50">
                                    {sport.count > 99 ? '99+' : sport.count}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    {sport.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Hero Banner */}
                    <div className="relative rounded-2xl overflow-hidden mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/40 via-[#7b2fff]/40 to-[#00ffff]/40" />
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}
                        />
                        <div className="relative p-8 md:p-12">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-4">
                                    <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
                                    NEW SEASON
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                                    <span className="bg-gradient-to-r from-white via-[#ff6ec7] to-white bg-clip-text text-transparent">
                                        Micro-Bets Live
                                    </span>
                                </h1>
                                <p className="text-lg text-white/70 mb-6 max-w-xl">
                                    x402 payments + Chainlink oracles on Cronos. Bet on every point, kill, corner.
                                    <span className="text-[#00ffff]"> Sub-second settlement.</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/live"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff00ff] to-[#ff6ec7] font-bold shadow-lg shadow-[#ff00ff]/30 hover:shadow-[#ff00ff]/50 hover:scale-105 transition-all"
                                    >
                                        <span>⚡</span>
                                        Enter Live Arena
                                    </Link>
                                    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-all">
                                        How It Works
                                    </button>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 md:top-8 md:right-8 text-6xl md:text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
                                🎰
                            </div>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            { icon: '⚡', label: '402 Tickets', desc: 'HTTP 402 Payments' },
                            { icon: '🔗', label: 'Chainlink', desc: 'Oracle Settlement' },
                            { icon: '⚫', label: 'Cronos', desc: 'Sub-second Blocks' },
                        ].map((feature) => (
                            <div
                                key={feature.label}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff00ff]/30 transition-colors"
                            >
                                <span className="text-xl">{feature.icon}</span>
                                <div>
                                    <div className="text-sm font-bold">{feature.label}</div>
                                    <div className="text-xs text-white/50">{feature.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Matches Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold">Live Matches</h2>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff00ff]/20 border border-[#ff00ff]/30 text-xs font-semibold text-[#ff6ec7]">
                                    <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                                    {liveMatches.length} LIVE
                                </span>
                            </div>
                            <Link href="/live" className="text-sm text-[#00ffff] hover:text-white font-medium transition-colors">
                                View All →
                            </Link>
                        </div>

                        {/* Matches Table */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-xl">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">
                                <div className="col-span-5">Match</div>
                                <div className="col-span-3 text-center">Result (1 X 2)</div>
                                <div className="col-span-2 text-center">Over/Under 2.5</div>
                                <div className="col-span-2 text-center">Time</div>
                            </div>

                            {/* Match Rows */}
                            {liveMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className={`grid grid-cols-12 gap-4 px-4 py-4 items-center transition-colors hover:bg-white/5 ${index !== liveMatches.length - 1 ? 'border-b border-white/5' : ''
                                        }`}
                                >
                                    {/* Match Info */}
                                    <div className="col-span-5">
                                        <div className="text-[10px] text-[#ff6ec7] font-semibold uppercase tracking-wider mb-1">
                                            {match.league}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-semibold truncate">{match.homeTeam}</span>
                                                    <span className="text-xl font-black text-[#00ffff]">{match.homeScore}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <span className="font-semibold truncate">{match.awayTeam}</span>
                                                    <span className="text-xl font-black text-[#ff6ec7]">{match.awayScore}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1X2 Odds */}
                                    <div className="col-span-3 flex justify-center gap-2">
                                        {[
                                            { label: '1', value: match.odds.home },
                                            { label: 'X', value: match.odds.draw },
                                            { label: '2', value: match.odds.away },
                                        ].filter((odd): odd is { label: string; value: number } => odd.value !== null)
                                            .map((odd) => (
                                                <button
                                                    key={odd.label}
                                                    onClick={() => addToBetSlip(
                                                        `${match.homeTeam} vs ${match.awayTeam}`,
                                                        odd.label === '1' ? match.homeTeam : odd.label === '2' ? match.awayTeam : 'Draw',
                                                        odd.value
                                                    )}
                                                    className="group relative px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/10 transition-all min-w-[52px]"
                                                >
                                                    <div className="text-[10px] text-white/40 font-medium">{odd.label}</div>
                                                    <div className="text-sm font-bold text-[#00ffff] group-hover:text-white">{odd.value.toFixed(2)}</div>
                                                </button>
                                            ))}
                                    </div>

                                    {/* Over/Under */}
                                    <div className="col-span-2 flex justify-center gap-2">
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Over 2.5', match.overUnder.over)}
                                            className="group px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00ffff]/50 hover:bg-[#00ffff]/10 transition-all"
                                        >
                                            <div className="text-[10px] text-white/40">O</div>
                                            <div className="text-sm font-bold text-[#00ff88] group-hover:text-white">{match.overUnder.over.toFixed(2)}</div>
                                        </button>
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Under 2.5', match.overUnder.under)}
                                            className="group px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff6ec7]/50 hover:bg-[#ff6ec7]/10 transition-all"
                                        >
                                            <div className="text-[10px] text-white/40">U</div>
                                            <div className="text-sm font-bold text-[#ff6ec7] group-hover:text-white">{match.overUnder.under.toFixed(2)}</div>
                                        </button>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-2 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
                                            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse" />
                                            <span className="text-sm font-bold text-[#00ff88]">{match.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Volume', value: '$2.4M', change: '+12%', color: '#00ffff' },
                            { label: 'Active Bets', value: '8,432', change: '+5%', color: '#ff00ff' },
                            { label: 'Avg Settlement', value: '0.8s', change: '-15%', color: '#00ff88' },
                            { label: 'Oracle Updates', value: '1.2K/min', change: '', color: '#ff6ec7' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            >
                                <div className="text-xs text-white/50 font-medium mb-1">{stat.label}</div>
                                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                                {stat.change && (
                                    <div className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-[#00ff88]' : 'text-[#ff6ec7]'}`}>
                                        {stat.change} this week
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Bet Slip Sidebar */}
                <aside className="hidden xl:block w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl min-h-[calc(100vh-64px)]">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Bet Slip</h3>
                            <span className="w-6 h-6 rounded-full bg-[#ff00ff] text-xs font-bold flex items-center justify-center">
                                {betSlip.length}
                            </span>
                        </div>

                        {betSlip.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3 opacity-50">🎫</div>
                                <div className="text-sm text-white/50">Click odds to add bets</div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {betSlip.map((bet, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-xl bg-white/5 border border-white/10"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-white/50 truncate">{bet.match}</div>
                                                <div className="font-semibold">{bet.selection}</div>
                                            </div>
                                            <button
                                                onClick={() => removeBet(index)}
                                                className="text-white/30 hover:text-[#ff6ec7] transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="mt-2 text-lg font-bold text-[#00ffff]">{bet.odds.toFixed(2)}</div>
                                    </div>
                                ))}

                                <div className="pt-3 border-t border-white/10">
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="text-white/50">Total Odds</span>
                                        <span className="font-bold text-[#ff00ff]">
                                            {betSlip.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Stake (CRO)"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#ff00ff]/50 outline-none text-white placeholder-white/30 mb-3"
                                        defaultValue="0.01"
                                        step="0.01"
                                        min="0.01"
                                    />
                                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff00ff] to-[#00ffff] font-bold text-lg shadow-lg shadow-[#ff00ff]/30 hover:shadow-[#ff00ff]/50 hover:scale-[1.02] transition-all">
                                        Place Bet ⚡
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}