"use client"

import type { Route } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Live match data
const liveMatches = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 2,
        awayScore: 1,
        time: "67'",
        type: 'football',
        odds: { home: 1.45, draw: 4.20, away: 6.50 },
        overUnder: { over: 1.85, under: 1.95 }
    },
    {
        id: 2,
        league: 'La Liga',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: 1,
        awayScore: 1,
        time: "34'",
        type: 'football',
        odds: { home: 2.10, draw: 3.40, away: 3.25 },
        overUnder: { over: 1.72, under: 2.10 }
    },
    {
        id: 3,
        league: 'BLAST Premier',
        homeTeam: 'NaVi',
        awayTeam: 'FaZe Clan',
        homeScore: 14,
        awayScore: 12,
        time: 'Map 2',
        type: 'esports',
        odds: { home: 1.35, draw: null, away: 3.10 },
        overUnder: { over: 1.90, under: 1.90 }
    },
    {
        id: 4,
        league: 'Bundesliga',
        homeTeam: 'Bayern Munich',
        awayTeam: 'Dortmund',
        homeScore: 3,
        awayScore: 2,
        time: "52'",
        type: 'football',
        odds: { home: 1.65, draw: 4.00, away: 5.25 },
        overUnder: { over: 1.40, under: 2.85 }
    },
    {
        id: 5,
        league: 'Serie A',
        homeTeam: 'AC Milan',
        awayTeam: 'Inter Milan',
        homeScore: 0,
        awayScore: 2,
        time: "81'",
        type: 'football',
        odds: { home: 8.50, draw: 5.00, away: 1.25 },
        overUnder: { over: 1.55, under: 2.40 }
    }
]

const sports = [
    { icon: '⚽', name: 'Football', count: 142 },
    { icon: '🏀', name: 'Basketball', count: 38 },
    { icon: '🎮', name: 'Esports', count: 67 },
    { icon: '🎾', name: 'Tennis', count: 24 },
    { icon: '🏈', name: 'NFL', count: 12 },
    { icon: '🎰', name: 'Casino', count: 89 },
]

const navItems: { name: string; path: Route }[] = [
    { name: 'Live', path: '/' as Route },
    { name: 'Sports', path: '/sports' as Route },
    { name: 'Esports', path: '/esports' as Route },
    { name: 'Casino', path: '/casino' as Route }
]

export default function Home() {
    const [selectedSport, setSelectedSport] = useState('Football')
    const [betSlip, setBetSlip] = useState<{ match: string; selection: string; odds: number }[]>([])
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')

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

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip(prev => [...prev, { match, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy Vaporwave Background - Sunrise Theme */}
            <div className="fixed inset-0">
                {/* Main gradient - ethereal sunrise pastels */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #FFB6C1 0%, #FFDAB9 12%, #E6E6FA 28%, #DDA0DD 45%, #B0E0E6 60%, #98D8C8 75%, #87CEEB 90%, #E6E6FA 100%)'
                    }}
                />

                {/* Warm sun glow at top */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-50"
                    style={{
                        background: 'radial-gradient(ellipse at center top, rgba(255, 218, 185, 0.5) 0%, rgba(255, 182, 193, 0.3) 30%, transparent 60%)'
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
                <div className="absolute top-10 left-[6%] text-6xl opacity-70 animate-bounce" style={{ animationDuration: '7s' }}>☁️</div>
                <div className="absolute top-20 right-[10%] text-5xl opacity-60 animate-bounce" style={{ animationDuration: '9s', animationDelay: '1s' }}>☁️</div>
                <div className="absolute top-36 left-[20%] text-4xl opacity-50 animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}>☁️</div>
                <div className="absolute top-28 right-[28%] text-3xl opacity-45 animate-bounce" style={{ animationDuration: '10s', animationDelay: '3s' }}>☁️</div>

                {/* Sparkles and stars */}
                <div className="absolute top-16 left-[35%] text-2xl opacity-70 animate-pulse">✦</div>
                <div className="absolute top-24 right-[22%] text-xl opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute top-48 left-[12%] text-lg opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
                <div className="absolute bottom-28 right-[16%] text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>
                <div className="absolute bottom-44 left-[25%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}>✧</div>
                <div className="absolute top-[60%] right-[8%] text-lg opacity-40 animate-pulse" style={{ animationDelay: '2.5s' }}>⭐</div>

                {/* Themed floating elements */}
                <div className="absolute bottom-20 right-[12%] text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>🔴</div>
                <div className="absolute top-[52%] left-[4%] text-2xl opacity-35 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>🏆</div>
                <div className="absolute bottom-[36%] right-[4%] text-2xl opacity-30 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>⚡</div>
            </div>

            {/* Main Desktop Window */}
            <div className="relative z-10 mx-4 mt-4">
                {/* Window Frame */}
                <div
                    className="rounded-xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #E6E6FA 0%, #DDA0DD 100%)',
                        border: '3px solid #D8BFD8',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.5)'
                    }}
                >
                    {/* Window Title Bar */}
                    <div
                        className="flex items-center justify-between px-4 py-2"
                        style={{
                            background: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 25%, #957DAD 50%, #7EC8E3 75%, #98D8C8 100%)',
                            borderBottom: '2px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-white tracking-widest drop-shadow-md">
                                MICROBETS.EXE
                            </span>
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)'
                                }}
                            >
                                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                {liveMatches.length} LIVE NOW
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/90">
                                <span>{currentDate}</span>
                                <span className="text-white/60">|</span>
                                <span>{currentTime}</span>
                            </div>
                            <div className="flex gap-1.5">
                                <button className="w-4 h-4 rounded-sm bg-yellow-300 hover:bg-yellow-400 transition-colors flex items-center justify-center text-[10px] font-bold text-yellow-800">−</button>
                                <button className="w-4 h-4 rounded-sm bg-green-300 hover:bg-green-400 transition-colors flex items-center justify-center text-[10px] font-bold text-green-800">□</button>
                                <button className="w-4 h-4 rounded-sm bg-pink-300 hover:bg-pink-400 transition-colors flex items-center justify-center text-[10px] font-bold text-pink-800">×</button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Bar */}
                    <div
                        className="flex items-center gap-6 px-4 py-1.5 text-xs font-medium"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            borderBottom: '1px solid rgba(186, 85, 211, 0.2)',
                            color: '#6B4C7A'
                        }}
                    >
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">File</span>
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">Edit</span>
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">View</span>
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">Markets</span>
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">Wallet</span>
                        <span className="hover:text-pink-500 cursor-pointer transition-colors">Help</span>
                    </div>

                    {/* Main Header Content */}
                    <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link href={'/' as Route} className="flex items-center gap-3 group">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black text-white transition-all group-hover:scale-110 group-hover:rotate-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #957DAD 100%)',
                                        boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
                                    }}
                                >
                                    μ
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tight leading-none">
                                        <span style={{ color: '#C44569' }}>MICRO</span>
                                        <span style={{ color: '#957DAD' }}>BETS</span>
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest" style={{ color: '#7EC8E3' }}>
                                        ✨ LIVE BETTING ✨
                                    </span>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isLive = item.name === 'Live'

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`
                                                px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                                                ${isLive
                                                    ? 'text-white scale-105'
                                                    : 'hover:scale-105'
                                                }
                                            `}
                                            style={isLive ? {
                                                background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #957DAD 100%)',
                                                boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)'
                                            } : {
                                                color: '#957DAD',
                                                background: 'transparent'
                                            }}
                                        >
                                            {isLive && (
                                                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                                            )}
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <button
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(196,69,105,0.2))',
                                    border: '2px solid rgba(196, 69, 105, 0.3)',
                                    color: '#C44569'
                                }}
                            >
                                <span>🔍</span>
                                <span>Search</span>
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                                    boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)'
                                }}
                            >
                                🔴 Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex px-4 pb-4">
                {/* Sports Sidebar */}
                <aside className="hidden lg:block w-24 mr-4 mt-4">
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {/* Sidebar title */}
                        <div
                            className="px-2 py-2 text-[10px] font-black text-center tracking-widest text-white"
                            style={{
                                background: 'linear-gradient(90deg, #FF6B9D, #C44569, #957DAD)'
                            }}
                        >
                            🔴 LIVE
                        </div>
                        <div className="flex flex-col items-center py-3 gap-2">
                            {sports.map(sport => (
                                <button
                                    key={sport.name}
                                    onClick={() => setSelectedSport(sport.name)}
                                    className={`
                                        group relative w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                        ${selectedSport === sport.name
                                            ? 'scale-110'
                                            : 'hover:scale-105'
                                        }
                                    `}
                                    style={selectedSport === sport.name ? {
                                        background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(196, 69, 105, 0.3))',
                                        border: '2px solid #FF6B9D',
                                        boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)'
                                    } : {
                                        background: 'rgba(255,255,255,0.5)',
                                        border: '2px solid transparent'
                                    }}
                                >
                                    <span className="text-2xl">{sport.icon}</span>
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                            boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)'
                                        }}
                                    >
                                        {sport.count > 99 ? '99+' : sport.count}
                                    </span>

                                    {/* Tooltip */}
                                    <div
                                        className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                        }}
                                    >
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
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Window title bar */}
                        <div
                            className="flex items-center justify-between px-4 py-2"
                            style={{
                                background: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 30%, #957DAD 60%, #7EC8E3 100%)'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                    LIVE_MATCHES.DAT
                                </span>
                                <span
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                        boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)'
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                    {liveMatches.length} LIVE
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-white/40" />
                                <div className="w-3 h-3 rounded-full bg-white/40" />
                                <div className="w-3 h-3 rounded-full bg-pink-200" />
                            </div>
                        </div>

                        {/* Matches content */}
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {/* Table header */}
                            <div
                                className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(255,107,157,0.2), rgba(149,125,173,0.15), rgba(126,200,227,0.2))',
                                    color: '#6B4C7A',
                                    borderBottom: '2px solid rgba(186, 85, 211, 0.2)'
                                }}
                            >
                                <div className="col-span-4">Match</div>
                                <div className="col-span-3 text-center">1 X 2</div>
                                <div className="col-span-2 text-center">O/U 2.5</div>
                                <div className="col-span-1 text-center">Score</div>
                                <div className="col-span-2 text-center">Time</div>
                            </div>

                            {/* Match rows */}
                            {liveMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className={`
                                        grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all duration-300
                                        hover:bg-gradient-to-r hover:from-pink-50 hover:via-purple-50 hover:to-blue-50
                                        ${index !== liveMatches.length - 1 ? 'border-b border-purple-100' : ''}
                                    `}
                                >
                                    {/* Match info */}
                                    <div className="col-span-4">
                                        <div
                                            className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2"
                                            style={{ color: match.type === 'esports' ? '#957DAD' : '#7EC8E3' }}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full animate-pulse"
                                                style={{ background: '#FF6B9D' }}
                                            />
                                            {match.league}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold" style={{ color: '#6B4C7A' }}>
                                                {match.homeTeam}
                                            </div>
                                            <div className="font-bold" style={{ color: '#957DAD' }}>
                                                {match.awayTeam}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1X2 Odds */}
                                    <div className="col-span-3 flex justify-center gap-1.5">
                                        {[
                                            { label: '1', value: match.odds.home, color: '#7EC8E3', bg: 'rgba(126,200,227,0.15)' },
                                            { label: 'X', value: match.odds.draw, color: '#957DAD', bg: 'rgba(149,125,173,0.15)' },
                                            { label: '2', value: match.odds.away, color: '#FF6B9D', bg: 'rgba(255,107,157,0.15)' }
                                        ].map(odd => (
                                            odd.value !== null && (
                                                <button
                                                    key={odd.label}
                                                    onClick={() => addToBetSlip(
                                                        `${match.homeTeam} vs ${match.awayTeam}`,
                                                        odd.label === '1' ? match.homeTeam : odd.label === '2' ? match.awayTeam : 'Draw',
                                                        odd.value!
                                                    )}
                                                    className="px-2.5 py-1.5 rounded-lg transition-all hover:scale-110 min-w-[45px]"
                                                    style={{
                                                        background: odd.bg,
                                                        border: `2px solid ${odd.color}`
                                                    }}
                                                >
                                                    <div className="text-[9px] font-bold" style={{ color: odd.color }}>
                                                        {odd.label}
                                                    </div>
                                                    <div className="text-sm font-black" style={{ color: odd.color }}>
                                                        {odd.value.toFixed(2)}
                                                    </div>
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Over/Under */}
                                    <div className="col-span-2 flex justify-center gap-1.5">
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Over 2.5', match.overUnder.over)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(126, 200, 227, 0.15)',
                                                border: '2px solid #7EC8E3'
                                            }}
                                        >
                                            <div className="text-[9px] font-bold" style={{ color: '#7EC8E3' }}>O</div>
                                            <div className="text-sm font-black" style={{ color: '#7EC8E3' }}>
                                                {match.overUnder.over.toFixed(2)}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Under 2.5', match.overUnder.under)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(255, 107, 157, 0.15)',
                                                border: '2px solid #FF6B9D'
                                            }}
                                        >
                                            <div className="text-[9px] font-bold" style={{ color: '#FF6B9D' }}>U</div>
                                            <div className="text-sm font-black" style={{ color: '#FF6B9D' }}>
                                                {match.overUnder.under.toFixed(2)}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Score */}
                                    <div className="col-span-1 text-center">
                                        <div
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-black text-lg"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(196,69,105,0.2))',
                                                color: '#C44569'
                                            }}
                                        >
                                            <span>{match.homeScore}</span>
                                            <span className="text-xs opacity-50">-</span>
                                            <span>{match.awayScore}</span>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="col-span-2 text-center">
                                        <span
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                                            style={{
                                                background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                                boxShadow: '0 4px 15px rgba(196, 69, 105, 0.3)'
                                            }}
                                        >
                                            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            {match.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Volume', value: '$2.4M', change: '+12%', icon: '📊', gradient: 'linear-gradient(135deg, #7EC8E3, #5BA4C9)' },
                            { label: 'Active Bets', value: '8,432', change: '+5%', icon: '🎯', gradient: 'linear-gradient(135deg, #FF6B9D, #C44569)' },
                            { label: 'Avg Settlement', value: '0.8s', change: '-15%', icon: '⚡', gradient: 'linear-gradient(135deg, #957DAD, #6B4C7A)' },
                            { label: 'Oracle Updates', value: '1.2K/min', change: 'Real-time', icon: '🔮', gradient: 'linear-gradient(135deg, #98D8C8, #20B2AA)' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-5 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                                style={{
                                    background: 'rgba(255,255,255,0.9)',
                                    border: '3px solid #D8BFD8',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-xs font-bold uppercase tracking-wider"
                                        style={{ color: '#957DAD' }}
                                    >
                                        {stat.label}
                                    </span>
                                    <span className="text-2xl group-hover:scale-125 transition-transform">
                                        {stat.icon}
                                    </span>
                                </div>
                                <div
                                    className="text-3xl font-black mb-1 bg-clip-text text-transparent"
                                    style={{ backgroundImage: stat.gradient }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    className="text-xs font-bold"
                                    style={{ color: '#7EC8E3' }}
                                >
                                    {stat.change} this week
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Bet Slip Sidebar */}
                <aside className="hidden xl:block w-80 ml-4 mt-4">
                    <div
                        className="rounded-xl overflow-hidden sticky top-4"
                        style={{
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Window title bar */}
                        <div
                            className="flex items-center justify-between px-4 py-2"
                            style={{
                                background: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 100%)'
                            }}
                        >
                            <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                BET_SLIP.EXE
                            </span>
                            <span
                                className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
                                style={{
                                    background: 'white',
                                    color: '#C44569',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                {betSlip.length}
                            </span>
                        </div>

                        {/* Bet slip content */}
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            {betSlip.length === 0 ? (
                                <div className="text-center py-12 px-4">
                                    <div
                                        className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(126,200,227,0.2))',
                                            border: '3px solid #D8BFD8'
                                        }}
                                    >
                                        🎫
                                    </div>
                                    <div className="text-sm font-bold mb-2" style={{ color: '#6B4C7A' }}>
                                        No bets placed yet
                                    </div>
                                    <div className="text-xs" style={{ color: '#957DAD' }}>
                                        Click on odds to add bets ✨
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                                        {betSlip.map((bet, index) => (
                                            <div
                                                key={index}
                                                className="p-3 rounded-xl transition-all hover:scale-[1.02]"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(126,200,227,0.15))',
                                                    border: '2px solid rgba(186, 85, 211, 0.3)'
                                                }}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[10px] truncate mb-1" style={{ color: '#957DAD' }}>
                                                            {bet.match}
                                                        </div>
                                                        <div className="font-bold" style={{ color: '#6B4C7A' }}>
                                                            {bet.selection}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeBet(index)}
                                                        className="text-pink-400 hover:text-pink-600 transition-colors text-lg hover:scale-125"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div
                                                    className="mt-2 text-xl font-black"
                                                    style={{ color: '#C44569' }}
                                                >
                                                    {bet.odds.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        className="p-4"
                                        style={{ borderTop: '2px solid rgba(186, 85, 211, 0.2)' }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-bold" style={{ color: '#6B4C7A' }}>
                                                Total Odds
                                            </span>
                                            <span
                                                className="text-xl font-black"
                                                style={{ color: '#C44569' }}
                                            >
                                                {betSlip.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                                            </span>
                                        </div>

                                        <input
                                            type="number"
                                            placeholder="Stake (CRO)"
                                            className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all focus:scale-[1.02]"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(126,200,227,0.15))',
                                                border: '2px solid rgba(186, 85, 211, 0.3)',
                                                color: '#6B4C7A'
                                            }}
                                            defaultValue="0.01"
                                            step="0.01"
                                            min="0.01"
                                        />

                                        <button
                                            className="w-full mt-3 py-4 rounded-xl font-black text-white transition-all hover:scale-[1.02] text-sm tracking-wide"
                                            style={{
                                                background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #957DAD 100%)',
                                                boxShadow: '0 8px 30px rgba(196, 69, 105, 0.4)'
                                            }}
                                        >
                                            ⚡ PLACE BET ⚡
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Hot Streak Card */}
                    <div
                        className="mt-4 rounded-xl overflow-hidden"
                        style={{
                            border: '3px solid #7EC8E3',
                            boxShadow: '0 8px 32px rgba(126, 200, 227, 0.2)'
                        }}
                    >
                        <div
                            className="px-4 py-2 text-center"
                            style={{
                                background: 'linear-gradient(90deg, #7EC8E3 0%, #5BA4C9 50%, #7EC8E3 100%)'
                            }}
                        >
                            <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                🔥 HOT STREAK 🔥
                            </span>
                        </div>
                        <div
                            className="p-4 text-center"
                            style={{
                                background: 'rgba(255,255,255,0.95)'
                            }}
                        >
                            <div className="text-[10px] font-bold mb-2" style={{ color: '#7EC8E3' }}>
                                TOP WINNER TODAY
                            </div>
                            <div
                                className="text-3xl font-black animate-pulse mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                $12,847
                            </div>
                            <div className="text-xs mb-3" style={{ color: '#957DAD' }}>
                                5 consecutive wins! 🎉
                            </div>
                            <div
                                className="flex items-center justify-center gap-2 text-xs font-bold px-3 py-2 rounded-lg"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(126,200,227,0.15))',
                                    color: '#6B4C7A'
                                }}
                            >
                                <span>0x7f3...8a2b</span>
                                <span style={{ color: '#7EC8E3' }}>•</span>
                                <span style={{ color: '#FF6B9D' }}>Verified ✓</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Desktop Icons (decorative) */}
            <div className="fixed right-8 top-36 z-5 hidden 2xl:flex flex-col gap-6">
                {[
                    { icon: '📁', label: 'My Bets' },
                    { icon: '📊', label: 'Statistics' },
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
    )
}