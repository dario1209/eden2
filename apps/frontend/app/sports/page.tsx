"use client"
import { BetSlip } from '@/components/bet-ui/BetSlip'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAccount } from 'wagmi'

// Mock data - replace with TanStack Query later
const sports = [
    {
        icon: '⚽',
        name: 'Football',
        count: 142
    },
    {
        icon: '🏀',
        name: 'Basketball',
        count: 38
    },
    {
        icon: '🎾',
        name: 'Tennis',
        count: 24
    },
    {
        icon: '⚾',
        name: 'Baseball',
        count: 8
    },
    {
        icon: '🏒',
        name: 'Hockey',
        count: 16
    },
]


const sportsMatches = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 0,
        awayScore: 0,
        time: '15:30',
        odds: { home: 1.85, draw: 3.60, away: 4.20 },
        overUnder: { over: 1.75, under: 2.05 }
    },
    // Add more mock matches...
    {
        id: 2,
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: 1,
        awayScore: 0,
        time: '18:45',
        odds: { home: 2.10, draw: 3.40, away: 3.25 },
        overUnder: { over: 1.72, under: 2.10 }
    },
    {
        id: 3,
        league: 'Bundesliga',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Dortmund',
        homeScore: 2,
        awayScore: 1,
        time: '20:00',
        odds: { home: 1.65, draw: 4.00, away: 5.25 },
        overUnder: { over: 1.40, under: 2.85 }
    },
    {
        id: 4,
        league: 'Serie A',
        homeTeam: 'Juventus',
        awayTeam: 'AC Milan',
        homeScore: 0,
        awayScore: 0,
        time: '21:30',
        odds: { home: 2.20, draw: 3.20, away: 3.50 },
        overUnder: { over: 1.90, under: 1.85 }
    }
]

export default function SportsPage() {
    const pathname = usePathname()
    const [selectedSport, setSelectedSport] = useState('Football')
    const [betSlip, setBetSlip] = useState<{ match: string, selection: string, odds: number }[]>([])
    const { isConnected } = useAccount()

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip(prev => [...prev, { match, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy gradient background */}
            <div className="fixed inset-0">
                {/* Main gradient - pink to cyan */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #FFB6C1 0%, #E0BBE4 25%, #957DAD 50%, #7EC8E3 75%, #7FE5F0 100%)'
                    }}
                />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                {/* Floating clouds/sparkles */}
                <div className="absolute top-20 left-10 text-4xl opacity-60 animate-pulse">☁️</div>
                <div className="absolute top-40 right-15 text-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
                <div className="absolute top-60 left-25 text-2xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
                <div className="absolute bottom-40 right-25 text-3xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>☁️</div>
                <div className="absolute bottom-60 left-15 text-4xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>🌟</div>
            </div>

            {/* Header - Retro window style */}
            <header className="relative z-10 mx-4 mt-4">
                <div className="rounded-t-lg overflow-hidden" style={{ background: 'linear-gradient(180deg, #E0BBE4 0%, #D4A5D9 100%)', border: '2px solid #C9A0DC' }}>
                    {/* Window title bar */}
                    <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'linear-gradient(180deg, #C9A0DC 0%, #B794C0 100%)' }}>
                        <span className="text-xs font-bold text-white/90 tracking-wide">MICROBETS.EXE</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                            <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                            <div className="w-3 h-3 rounded-sm bg-pink-300"></div>
                        </div>
                    </div>

                    {/* Main header content */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2 group">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-black text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                        boxShadow: '0 2px 10px rgba(196, 69, 105, 0.3)'
                                    }}>
                                    M
                                </div>
                                <span className="text-lg font-black tracking-tight">
                                    <span style={{ color: '#C44569' }}>MICRO</span>
                                    <span style={{ color: '#957DAD' }}> BETS</span>
                                </span>
                            </Link>
                        </div>

                        {/* Navigation - Sports active */}
                        <nav className="hidden md:flex items-center gap-1">
                            {(['Live', 'Sports', 'Esports', 'Casino'] as const).map((item, i) => (
                                <Link
                                    key={item}
                                    href={item === 'Live' ? '/live' : `/${item.toLowerCase()}`}
                                // ... rest stays the same
                                >
                                    {i === 0 && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />}
                                    {item}
                                </Link>
                            ))}
                        </nav>


                        <div className="flex items-center gap-2">
                            {/* Search button */}
                            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                                style={{ background: '#E0BBE4', color: '#6B4C7A' }}>
                                <span>🔍</span>
                                <span>Search</span>
                            </button>
                            {/* Connect Wallet button */}
                            <button className="px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #7EC8E3, #5BA4C9)',
                                    boxShadow: '0 2px 10px rgba(126, 200, 227, 0.35)'
                                }}>
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 flex px-4 pb-4">
                {/* Sports Sidebar */}
                <aside className="hidden lg:block w-20 mr-4 mt-4">
                    <div className="rounded-lg overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            border: '2px solid #E0BBE4',
                            backdropFilter: 'blur(10px)'
                        }}>
                        <div className="px-2 py-1 text-[10px] font-bold text-center text-white"
                            style={{ background: 'linear-gradient(180deg, #C9A0DC 0%, #B794C0 100%)' }}>
                            SPORTS
                        </div>
                        <div className="flex flex-col items-center py-2 gap-1">
                            {sports.map(sport => (
                                <button
                                    key={sport.name}
                                    onClick={() => setSelectedSport(sport.name)}
                                    className={`group relative w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all ${selectedSport === sport.name ? 'bg-gradient-to-br from-pink-200 to-purple-200 hover:bg-purple-50' : 'hover:bg-purple-50'
                                        }`}
                                >
                                    <span className="text-xs">{sport.icon}</span>
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                        style={{ background: '#FF6B9D' }}>
                                        {sport.count > 99 ? '99+' : sport.count}
                                    </span>
                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-2 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-white"
                                        style={{ background: '#957DAD' }}>
                                        {sport.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 mt-4 space-y-4">
                    {/* Live Matches Window */}
                    <div className="rounded-lg overflow-hidden" style={{ border: '2px solid #E0BBE4' }}>
                        {/* Window title bar */}
                        <div className="flex items-center justify-between px-3 py-1.5" style={{ background: 'linear-gradient(180deg, #E0BBE4 0%, #C9A0DC 100%)' }}>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white/90 tracking-wide">SPORTSMATCHES.DAT</span>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-pink-500">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    {sportsMatches.length} LIVE
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                                <div className="w-3 h-3 rounded-sm bg-white/40"></div>
                                <div className="w-3 h-3 rounded-sm bg-pink-300"></div>
                            </div>
                        </div>

                        {/* Matches table */}
                        <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
                            {/* Matches table header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider" style={{ background: '#F8E8F8', color: '#957DAD' }}>
                                <div className="col-span-5">Match</div>
                                <div className="col-span-3 text-center">1 X 2</div>
                                <div className="col-span-2 text-center">OU 2.5</div>
                                <div className="col-span-2 text-center">Time</div>
                            </div>

                            {/* Matches rows */}
                            {sportsMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className={`grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors hover:bg-pink-50 ${index !== sportsMatches.length - 1 ? 'border-b border-purple-100' : ''
                                        }`}
                                >
                                    {/* Match info */}
                                    <div className="col-span-5">
                                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#FF6B9D' }}>
                                            {match.league}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-semibold truncate" style={{ color: '#6B4C7A' }}>
                                                        {match.homeTeam}
                                                    </span>
                                                    <span className="text-xl font-black" style={{ color: '#7EC8E3' }}>
                                                        {match.homeScore}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 mt-0.5">
                                                <span className="font-semibold truncate" style={{ color: '#6B4C7A' }}>
                                                    {match.awayTeam}
                                                </span>
                                                <span className="text-xl font-black" style={{ color: '#FF6B9D' }}>
                                                    {match.awayScore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1X2 Odds */}
                                    <div className="col-span-3 flex justify-center gap-1.5">
                                        {[
                                            { label: '1', value: match.odds.home },
                                            { label: 'X', value: match.odds.draw },
                                            { label: '2', value: match.odds.away }
                                        ].filter(odd => odd.value !== null).map(odd => (
                                            <button
                                                key={odd.label}
                                                onClick={() => addToBetSlip(
                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                    odd.label === '1' ? match.homeTeam : odd.label === '2' ? match.awayTeam : 'Draw',
                                                    odd.value!
                                                )}
                                                className="group px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 min-w-[48px]"
                                                style={{
                                                    background: '#F8E8F8',
                                                    border: '2px solid #E0BBE4'
                                                }}
                                            >
                                                <div className="text-[9px] font-medium" style={{ color: '#957DAD' }}>
                                                    {odd.label}
                                                </div>
                                                <div className="text-sm font-bold" style={{ color: '#C44569' }}>
                                                    {odd.value!.toFixed(2)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Over/Under */}
                                    <div className="col-span-2 flex justify-center gap-1.5">
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Over 2.5', match.overUnder.over)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-105"
                                            style={{ background: '#E8F4F8', border: '2px solid #7EC8E3' }}
                                        >
                                            <div className="text-[9px]" style={{ color: '#5BA4C9' }}>O</div>
                                            <div className="text-sm font-bold" style={{ color: '#5BA4C9' }}>
                                                {match.overUnder.over.toFixed(2)}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Under 2.5', match.overUnder.under)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-105"
                                            style={{ background: '#FFE8EE', border: '2px solid #FF6B9D' }}
                                        >
                                            <div className="text-[9px]" style={{ color: '#C44569' }}>U</div>
                                            <div className="text-sm font-bold" style={{ color: '#C44569' }}>
                                                {match.overUnder.under.toFixed(2)}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-2 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: '#E8F4F8' }}>
                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7EC8E3' }} />
                                            <span className="text-xs font-bold" style={{ color: '#5BA4C9' }}>
                                                {match.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Volume', value: '$2.4M', change: '+12%', color: '#7EC8E3' },
                            { label: 'Active Bets', value: '8,432', change: '+5%', color: '#FF6B9D' },
                            { label: 'Avg Settlement', value: '0.8s', change: '-15%', color: '#957DAD' },
                            { label: 'Oracle Updates', value: '1.2K/min', change: '', color: '#C44569' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-4 rounded-lg transition-all hover:scale-105"
                                style={{
                                    background: 'rgba(255,255,255,0.85)',
                                    border: '2px solid #E0BBE4',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div className="text-xs font-medium mb-1" style={{ color: '#957DAD' }}>
                                    {stat.label}
                                </div>
                                <div className="text-2xl font-black" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                {stat.change && (
                                    <div className="text-xs font-semibold" style={{ color: '#7EC8E3' }}>
                                        {stat.change} this week
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="hidden xl:block w-72 ml-4 mt-4">
                    <BetSlip marketId="sports-main" sport="football" />
                </aside>
            </div>
        </div>
    )
}
