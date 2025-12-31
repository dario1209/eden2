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
        <div className="min-h-screen text-slate-800 overflow-hidden" style={{ background: '#FEF9F3' }}>
            {/* Subtle background texture */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Warm gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(135deg, #FEF9F3 0%, #FDF2E9 50%, #F5EBE0 100%)'
                    }}
                />
                {/* Soft decorative shapes */}
                <div
                    className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-30 blur-3xl"
                    style={{ background: 'linear-gradient(135deg, #14B8A6, #06B6D4)' }}
                />
                <div
                    className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'linear-gradient(135deg, #F97373, #FB923C)' }}
                />
                {/* Subtle wave pattern at bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-64 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2314B8A6' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'bottom'
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
                <div className="flex items-center justify-between px-6 h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg transition-transform group-hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                                    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.35)'
                                }}
                            >
                                μ
                            </div>
                            <span className="text-xl font-black tracking-tight">
                                <span style={{ color: '#0D9488' }}>MICRO</span>
                                <span className="text-slate-400">BETS</span>
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            {['Live', 'Sports', 'Esports', 'Casino'].map((item, i) => (
                                <Link
                                    key={item}
                                    href={item === 'Live' ? '/live' : '#'}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${i === 0
                                            ? 'text-white shadow-md'
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                    style={i === 0 ? {
                                        background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                                        boxShadow: '0 2px 10px rgba(20, 184, 166, 0.3)'
                                    } : {}}
                                >
                                    {i === 0 && <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />}
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all">
                            <span>🔍</span>
                            Search
                        </button>
                        <button
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-105 transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #F97373, #F87171)',
                                boxShadow: '0 4px 14px rgba(249, 115, 115, 0.35)'
                            }}
                        >
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex flex-col w-20 border-r border-slate-200/60 bg-white/50 backdrop-blur-xl min-h-[calc(100vh-64px)]">
                    <div className="flex flex-col items-center py-4 gap-1">
                        {sports.map((sport) => (
                            <button
                                key={sport.name}
                                onClick={() => setSelectedSport(sport.name)}
                                className={`group relative w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${selectedSport === sport.name
                                        ? 'bg-white shadow-lg'
                                        : 'hover:bg-white/60'
                                    }`}
                                style={selectedSport === sport.name ? {
                                    boxShadow: '0 4px 20px rgba(20, 184, 166, 0.15)'
                                } : {}}
                            >
                                <span className="text-2xl">{sport.icon}</span>
                                <span
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-md"
                                    style={{ background: '#14B8A6' }}
                                >
                                    {sport.count > 99 ? '99+' : sport.count}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    {sport.name}
                                </div>
                                {/* Active indicator */}
                                {selectedSport === sport.name && (
                                    <div
                                        className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                                        style={{ background: '#14B8A6' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Hero Banner */}
                    <div
                        className="relative rounded-3xl overflow-hidden mb-6 shadow-xl"
                        style={{
                            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #0F766E 100%)'
                        }}
                    >
                        {/* Decorative pattern */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}
                        />
                        <div className="relative p-8 md:p-12">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-semibold mb-4 backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    NEW SEASON
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-white">
                                    Micro-Bets Live
                                </h1>
                                <p className="text-lg text-white/80 mb-6 max-w-xl">
                                    x402 payments + Chainlink oracles on Cronos. Bet on every point, kill, corner.
                                    <span className="text-white font-semibold"> Sub-second settlement.</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/live"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-teal-700 bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        <span>⚡</span>
                                        Enter Live Arena
                                    </Link>
                                    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 backdrop-blur-sm transition-all">
                                        How It Works
                                    </button>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-4 right-4 md:top-8 md:right-8 text-6xl md:text-8xl opacity-20">
                                🌴
                            </div>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {[
                            { icon: '⚡', label: '402 Tickets', desc: 'HTTP 402 Payments', color: '#F97373' },
                            { icon: '🔗', label: 'Chainlink', desc: 'Oracle Settlement', color: '#14B8A6' },
                            { icon: '⚫', label: 'Cronos', desc: 'Sub-second Blocks', color: '#6366F1' },
                        ].map((feature) => (
                            <div
                                key={feature.label}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                    style={{ background: `${feature.color}15` }}
                                >
                                    {feature.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{feature.label}</div>
                                    <div className="text-xs text-slate-400">{feature.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Matches Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-800">Live Matches</h2>
                                <span
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                                    style={{ background: '#F97373' }}
                                >
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    {liveMatches.length} LIVE
                                </span>
                            </div>
                            <Link
                                href="/live"
                                className="text-sm font-semibold transition-colors"
                                style={{ color: '#14B8A6' }}
                            >
                                View All →
                            </Link>
                        </div>

                        {/* Matches Table */}
                        <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-100">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-5">Match</div>
                                <div className="col-span-3 text-center">Result (1 X 2)</div>
                                <div className="col-span-2 text-center">Over/Under 2.5</div>
                                <div className="col-span-2 text-center">Time</div>
                            </div>

                            {/* Match Rows */}
                            {liveMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className={`grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors hover:bg-slate-50 ${index !== liveMatches.length - 1 ? 'border-b border-slate-100' : ''
                                        }`}
                                >
                                    {/* Match Info */}
                                    <div className="col-span-5">
                                        <div
                                            className="text-[10px] font-bold uppercase tracking-wider mb-1"
                                            style={{ color: '#F97373' }}
                                        >
                                            {match.league}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-semibold text-slate-700 truncate">{match.homeTeam}</span>
                                                    <span
                                                        className="text-xl font-black"
                                                        style={{ color: '#14B8A6' }}
                                                    >
                                                        {match.homeScore}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <span className="font-semibold text-slate-700 truncate">{match.awayTeam}</span>
                                                    <span
                                                        className="text-xl font-black"
                                                        style={{ color: '#F97373' }}
                                                    >
                                                        {match.awayScore}
                                                    </span>
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
                                                    className="group relative px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition-all min-w-[52px]"
                                                >
                                                    <div className="text-[10px] text-slate-400 font-medium">{odd.label}</div>
                                                    <div
                                                        className="text-sm font-bold group-hover:text-teal-600 transition-colors"
                                                        style={{ color: '#0D9488' }}
                                                    >
                                                        {odd.value.toFixed(2)}
                                                    </div>
                                                </button>
                                            ))}
                                    </div>

                                    {/* Over/Under */}
                                    <div className="col-span-2 flex justify-center gap-2">
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Over 2.5', match.overUnder.over)}
                                            className="group px-2 py-2 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition-all"
                                        >
                                            <div className="text-[10px] text-slate-400">O</div>
                                            <div
                                                className="text-sm font-bold group-hover:text-teal-600"
                                                style={{ color: '#14B8A6' }}
                                            >
                                                {match.overUnder.over.toFixed(2)}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Under 2.5', match.overUnder.under)}
                                            className="group px-2 py-2 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-coral-400 hover:bg-red-50 transition-all"
                                        >
                                            <div className="text-[10px] text-slate-400">U</div>
                                            <div
                                                className="text-sm font-bold group-hover:text-red-500"
                                                style={{ color: '#F97373' }}
                                            >
                                                {match.overUnder.under.toFixed(2)}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-2 text-center">
                                        <div
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                                            style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                style={{ background: '#14B8A6' }}
                                            />
                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: '#0D9488' }}
                                            >
                                                {match.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Volume', value: '$2.4M', change: '+12%', color: '#14B8A6', positive: true },
                            { label: 'Active Bets', value: '8,432', change: '+5%', color: '#F97373', positive: true },
                            { label: 'Avg Settlement', value: '0.8s', change: '-15%', color: '#6366F1', positive: true },
                            { label: 'Oracle Updates', value: '1.2K/min', change: '', color: '#FB923C', positive: true },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div className="text-xs text-slate-400 font-medium mb-1">{stat.label}</div>
                                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                                {stat.change && (
                                    <div className={`text-xs font-semibold ${stat.positive ? 'text-teal-500' : 'text-red-400'}`}>
                                        {stat.change} this week
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Bet Slip Sidebar */}
                <aside className="hidden xl:block w-80 border-l border-slate-200/60 bg-white/70 backdrop-blur-xl min-h-[calc(100vh-64px)]">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800">Bet Slip</h3>
                            <span
                                className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                                style={{ background: '#F97373' }}
                            >
                                {betSlip.length}
                            </span>
                        </div>

                        {betSlip.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-3 opacity-50">🎫</div>
                                <div className="text-sm text-slate-400">Click odds to add bets</div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {betSlip.map((bet, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-100"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-slate-400 truncate">{bet.match}</div>
                                                <div className="font-semibold text-slate-700">{bet.selection}</div>
                                            </div>
                                            <button
                                                onClick={() => removeBet(index)}
                                                className="text-slate-300 hover:text-red-400 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div
                                            className="mt-2 text-lg font-bold"
                                            style={{ color: '#14B8A6' }}
                                        >
                                            {bet.odds.toFixed(2)}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-3 border-t border-slate-200">
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="text-slate-400">Total Odds</span>
                                        <span
                                            className="font-bold"
                                            style={{ color: '#F97373' }}
                                        >
                                            {betSlip.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Stake (CRO)"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-teal-400 outline-none text-slate-700 placeholder-slate-300 mb-3"
                                        defaultValue="0.01"
                                        step="0.01"
                                        min="0.01"
                                    />
                                    <button
                                        className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                                            boxShadow: '0 4px 20px rgba(20, 184, 166, 0.35)'
                                        }}
                                    >
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