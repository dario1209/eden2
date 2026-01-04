"use client"

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Esports games data
const esportsGames = [
    { icon: '🔫', name: 'CS2', count: 67 },
    { icon: '⚔️', name: 'League of Legends', count: 45 },
    { icon: '🐉', name: 'Dota 2', count: 32 },
    { icon: '🎯', name: 'Valorant', count: 28 },
    { icon: '🚀', name: 'Rocket League', count: 19 },
    { icon: '🎮', name: 'Fortnite', count: 24 },
]

const esportsMatches = [
    {
        id: 1,
        league: 'BLAST Premier',
        homeTeam: 'NaVi',
        awayTeam: 'FaZe Clan',
        homeScore: 14,
        awayScore: 12,
        time: 'Map 2',
        status: 'LIVE',
        odds: { home: 1.35, away: 3.10 },
        overUnder: { over: 1.90, under: 1.90 }
    },
    {
        id: 2,
        league: 'LCS Winter',
        homeTeam: 'Cloud9',
        awayTeam: 'Team Liquid',
        homeScore: 1,
        awayScore: 0,
        time: '23:45',
        status: 'LIVE',
        odds: { home: 2.25, away: 1.65 },
        overUnder: { over: 1.85, under: 1.95 }
    },
    {
        id: 3,
        league: 'DPC SA',
        homeTeam: 'Evil Geniuses',
        awayTeam: 'Team Spirit',
        homeScore: 28,
        awayScore: 25,
        time: '38:12',
        status: 'LIVE',
        odds: { home: 1.80, away: 2.00 },
        overUnder: { over: 1.75, under: 2.05 }
    },
    {
        id: 4,
        league: 'VCT Americas',
        homeTeam: 'Sentinels',
        awayTeam: '100 Thieves',
        homeScore: 8,
        awayScore: 6,
        time: 'Round 12',
        status: 'LIVE',
        odds: { home: 1.95, away: 1.85 },
        overUnder: { over: 1.88, under: 1.92 }
    },
    {
        id: 5,
        league: 'RLCS Major',
        homeTeam: 'G2 Esports',
        awayTeam: 'Team BDS',
        homeScore: 0,
        awayScore: 0,
        time: '19:00',
        status: 'UPCOMING',
        odds: { home: 1.72, away: 2.15 },
        overUnder: { over: 1.80, under: 2.00 }
    }
]

const navItems: { name: string; path: Route }[] = [
    { name: 'Live', path: '/' as Route },
    { name: 'Sports', path: '/sports' as Route },
    { name: 'Esports', path: '/esports' as Route },
    { name: 'Casino', path: '/casino' as Route },
    { name: 'Prediction', path: '/prediction' as Route }
]

export default function EsportsPage() {
    const pathname = usePathname()
    const [selectedEsport, setSelectedEsport] = useState('CS2')
    const [betSlip, setBetSlip] = useState<{ match: string; selection: string; odds: number }[]>([])
    const [currentTime, setCurrentTime] = useState('')
    const [viewerCount, setViewerCount] = useState(247892)

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Simulate viewer count fluctuation
    useEffect(() => {
        const viewerTimer = setInterval(() => {
            setViewerCount(prev => prev + Math.floor(Math.random() * 100) - 50)
        }, 2000)
        return () => clearInterval(viewerTimer)
    }, [])

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip(prev => [...prev, { match, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip(prev => prev.filter((_, i) => i !== index))
    }

    const liveCount = esportsMatches.filter(m => m.status === 'LIVE').length

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy Vaporwave Background - Gaming Paradise Theme */}
            <div className="fixed inset-0">
                {/* Main gradient - ethereal gaming pastels */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #E6E6FA 0%, #DDA0DD 15%, #FFB6C1 30%, #B0E0E6 50%, #98D8C8 65%, #DDA0DD 80%, #E6E6FA 100%)'
                    }}
                />

                {/* Holographic shimmer effect */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'linear-gradient(45deg, rgba(255,182,193,0.3) 0%, rgba(176,224,230,0.3) 25%, rgba(221,160,221,0.3) 50%, rgba(152,216,200,0.3) 75%, rgba(255,182,193,0.3) 100%)'
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
                        backgroundSize: '45px 45px'
                    }}
                />

                {/* Soft scanline effect (lighter) */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                    }}
                />

                {/* Floating clouds */}
                <div className="absolute top-12 left-[8%] text-5xl opacity-70 animate-bounce" style={{ animationDuration: '7s' }}>☁️</div>
                <div className="absolute top-24 right-[12%] text-4xl opacity-60 animate-bounce" style={{ animationDuration: '9s', animationDelay: '1s' }}>☁️</div>
                <div className="absolute top-40 left-[22%] text-3xl opacity-50 animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}>☁️</div>

                {/* Sparkles and stars */}
                <div className="absolute top-20 right-[28%] text-2xl opacity-70 animate-pulse">✦</div>
                <div className="absolute top-36 left-[15%] text-xl opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
                <div className="absolute bottom-28 right-[15%] text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                <div className="absolute bottom-44 left-[30%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>✧</div>
                <div className="absolute top-[55%] right-[6%] text-lg opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>⭐</div>

                {/* Gaming-themed floating elements */}
                <div className="absolute bottom-20 right-[10%] text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>🎮</div>
                <div className="absolute top-[50%] left-[4%] text-2xl opacity-35 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>🏆</div>
                <div className="absolute bottom-[38%] right-[4%] text-2xl opacity-30 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>💎</div>
                <div className="absolute top-[35%] right-[20%] text-xl opacity-25 animate-bounce" style={{ animationDuration: '8s', animationDelay: '3s' }}>⚡</div>
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
                            background: 'linear-gradient(90deg, #9370DB 0%, #BA55D3 35%, #DDA0DD 65%, #98D8C8 100%)',
                            borderBottom: '2px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-white tracking-widest drop-shadow-md">
                                ESPORTS_ARENA.EXE
                            </span>
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(147, 112, 219, 0.4)'
                                }}
                            >
                                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                {liveCount} LIVE
                            </div>
                            <div
                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                    background: 'rgba(255,255,255,0.3)',
                                    color: 'white'
                                }}
                            >
                                👁️ {viewerCount.toLocaleString()} watching
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:block text-xs font-mono text-white/90">{currentTime}</span>
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
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">File</span>
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">Edit</span>
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">View</span>
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">Tournaments</span>
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">Wallet</span>
                        <span className="hover:text-purple-600 cursor-pointer transition-colors">Help</span>
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
                                        background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #DDA0DD 100%)',
                                        boxShadow: '0 4px 15px rgba(147, 112, 219, 0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
                                    }}
                                >
                                    μ
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tight leading-none">
                                        <span style={{ color: '#9370DB' }}>MICRO</span>
                                        <span style={{ color: '#BA55D3' }}>BETS</span>
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest" style={{ color: '#98D8C8' }}>
                                        🎮 ESPORTS ARENA 🎮
                                    </span>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isEsports = item.name === 'Esports'

                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`
                                                px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                                                ${isEsports
                                                    ? 'text-white scale-105'
                                                    : 'hover:scale-105'
                                                }
                                            `}
                                            style={isEsports ? {
                                                background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #DDA0DD 100%)',
                                                boxShadow: '0 4px 15px rgba(147, 112, 219, 0.5)'
                                            } : {
                                                color: '#9370DB',
                                                background: 'transparent'
                                            }}
                                        >
                                            {isEsports && (
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
                                    background: 'linear-gradient(135deg, rgba(147,112,219,0.2), rgba(186,85,211,0.2))',
                                    border: '2px solid rgba(147, 112, 219, 0.3)',
                                    color: '#9370DB'
                                }}
                            >
                                <span>🔍</span>
                                <span>Search</span>
                            </button>
                            <button
                                className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 100%)',
                                    boxShadow: '0 4px 15px rgba(147, 112, 219, 0.4)'
                                }}
                            >
                                🎮 Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex px-4 pb-4">
                {/* Games Sidebar */}
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
                                background: 'linear-gradient(90deg, #9370DB, #BA55D3, #DDA0DD)'
                            }}
                        >
                            🎮 GAMES
                        </div>
                        <div className="flex flex-col items-center py-3 gap-2">
                            {esportsGames.map(game => (
                                <button
                                    key={game.name}
                                    onClick={() => setSelectedEsport(game.name)}
                                    className={`
                                        group relative w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300
                                        ${selectedEsport === game.name
                                            ? 'scale-110'
                                            : 'hover:scale-105'
                                        }
                                    `}
                                    style={selectedEsport === game.name ? {
                                        background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.3), rgba(186, 85, 211, 0.3))',
                                        border: '2px solid #BA55D3',
                                        boxShadow: '0 4px 15px rgba(186, 85, 211, 0.3)'
                                    } : {
                                        background: 'rgba(255,255,255,0.5)',
                                        border: '2px solid transparent'
                                    }}
                                >
                                    <span className="text-2xl">{game.icon}</span>
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                            boxShadow: '0 2px 8px rgba(147, 112, 219, 0.4)'
                                        }}
                                    >
                                        {game.count > 99 ? '99+' : game.count}
                                    </span>

                                    {/* Tooltip */}
                                    <div
                                        className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
                                        style={{
                                            background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {game.name}
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
                                background: 'linear-gradient(90deg, #9370DB 0%, #BA55D3 35%, #DDA0DD 65%, #98D8C8 100%)'
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                    LIVE_MATCHES.DAT
                                </span>
                                <span
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                        boxShadow: '0 2px 8px rgba(147, 112, 219, 0.4)'
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                    {esportsMatches.length} MATCHES
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
                                    background: 'linear-gradient(90deg, rgba(147,112,219,0.2), rgba(186,85,211,0.15), rgba(152,216,200,0.2))',
                                    color: '#6B4C7A',
                                    borderBottom: '2px solid rgba(186, 85, 211, 0.2)'
                                }}
                            >
                                <div className="col-span-4">Match</div>
                                <div className="col-span-3 text-center">Winner</div>
                                <div className="col-span-2 text-center">O/U</div>
                                <div className="col-span-1 text-center">Score</div>
                                <div className="col-span-2 text-center">Status</div>
                            </div>

                            {/* Match rows */}
                            {esportsMatches.map((match, index) => (
                                <div
                                    key={match.id}
                                    className={`
                                        grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all duration-300
                                        hover:bg-gradient-to-r hover:from-purple-50 hover:via-pink-50 hover:to-teal-50
                                        ${index !== esportsMatches.length - 1 ? 'border-b border-purple-100' : ''}
                                    `}
                                >
                                    {/* Match info */}
                                    <div className="col-span-4">
                                        <div
                                            className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2"
                                            style={{ color: '#9370DB' }}
                                        >
                                            {match.status === 'LIVE' && (
                                                <span
                                                    className="w-2 h-2 rounded-full animate-pulse"
                                                    style={{ background: '#BA55D3' }}
                                                />
                                            )}
                                            {match.league}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold" style={{ color: '#6B4C7A' }}>
                                                {match.homeTeam}
                                            </div>
                                            <div className="font-bold" style={{ color: '#9370DB' }}>
                                                {match.awayTeam}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Winner Odds */}
                                    <div className="col-span-3 flex justify-center gap-2">
                                        {[
                                            { label: '1', value: match.odds.home, color: '#9370DB', bg: 'rgba(147,112,219,0.15)' },
                                            { label: '2', value: match.odds.away, color: '#BA55D3', bg: 'rgba(186,85,211,0.15)' }
                                        ].map(odd => (
                                            <button
                                                key={odd.label}
                                                onClick={() => addToBetSlip(
                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                    odd.label === '1' ? match.homeTeam : match.awayTeam,
                                                    odd.value
                                                )}
                                                className="px-3 py-2 rounded-lg transition-all hover:scale-110 min-w-[55px]"
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
                                        ))}
                                    </div>

                                    {/* Over/Under */}
                                    <div className="col-span-2 flex justify-center gap-1.5">
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Over', match.overUnder.over)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(152, 216, 200, 0.2)',
                                                border: '2px solid #98D8C8'
                                            }}
                                        >
                                            <div className="text-[9px] font-bold" style={{ color: '#20B2AA' }}>O</div>
                                            <div className="text-sm font-black" style={{ color: '#20B2AA' }}>
                                                {match.overUnder.over.toFixed(2)}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => addToBetSlip(`${match.homeTeam} vs ${match.awayTeam}`, 'Under', match.overUnder.under)}
                                            className="px-2 py-1.5 rounded-lg transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(255, 182, 193, 0.2)',
                                                border: '2px solid #FFB6C1'
                                            }}
                                        >
                                            <div className="text-[9px] font-bold" style={{ color: '#FF69B4' }}>U</div>
                                            <div className="text-sm font-black" style={{ color: '#FF69B4' }}>
                                                {match.overUnder.under.toFixed(2)}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Score */}
                                    <div className="col-span-1 text-center">
                                        <div
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-black text-lg"
                                            style={{
                                                background: match.status === 'LIVE'
                                                    ? 'linear-gradient(135deg, rgba(147,112,219,0.2), rgba(186,85,211,0.2))'
                                                    : 'rgba(152,216,200,0.15)',
                                                color: match.status === 'LIVE' ? '#9370DB' : '#98D8C8'
                                            }}
                                        >
                                            <span>{match.homeScore}</span>
                                            <span className="text-xs opacity-50">-</span>
                                            <span>{match.awayScore}</span>
                                        </div>
                                    </div>

                                    {/* Status/Time */}
                                    <div className="col-span-2 text-center">
                                        <span
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                            style={match.status === 'LIVE' ? {
                                                background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(147, 112, 219, 0.3)'
                                            } : {
                                                background: 'linear-gradient(135deg, rgba(152,216,200,0.2), rgba(176,224,230,0.2))',
                                                color: '#20B2AA',
                                                border: '2px solid rgba(152,216,200,0.4)'
                                            }}
                                        >
                                            {match.status === 'LIVE' && (
                                                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                                            )}
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
                            { label: 'Prize Pool', value: '$1.2M', change: '+28%', icon: '🏆', gradient: 'linear-gradient(135deg, #9370DB, #BA55D3)' },
                            { label: 'Live Viewers', value: '247K', change: '+15%', icon: '👁️', gradient: 'linear-gradient(135deg, #98D8C8, #20B2AA)' },
                            { label: 'Avg Bet', value: '$42', change: '+8%', icon: '💎', gradient: 'linear-gradient(135deg, #DDA0DD, #BA55D3)' },
                            { label: 'Settlement', value: '0.3s', change: '-22%', icon: '⚡', gradient: 'linear-gradient(135deg, #FFB6C1, #FF69B4)' },
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
                                        style={{ color: '#9370DB' }}
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
                                    style={{ color: '#98D8C8' }}
                                >
                                    {stat.change} today
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
                                background: 'linear-gradient(90deg, #9370DB 0%, #BA55D3 100%)'
                            }}
                        >
                            <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                BET_SLIP.EXE
                            </span>
                            <span
                                className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
                                style={{
                                    background: 'white',
                                    color: '#9370DB',
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
                                            background: 'linear-gradient(135deg, rgba(147,112,219,0.2), rgba(152,216,200,0.2))',
                                            border: '3px solid #D8BFD8'
                                        }}
                                    >
                                        🎮
                                    </div>
                                    <div className="text-sm font-bold mb-2" style={{ color: '#6B4C7A' }}>
                                        No bets placed yet
                                    </div>
                                    <div className="text-xs" style={{ color: '#9370DB' }}>
                                        Click on odds to add bets 🎮
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
                                                    background: 'linear-gradient(135deg, rgba(147,112,219,0.15), rgba(152,216,200,0.15))',
                                                    border: '2px solid rgba(186, 85, 211, 0.3)'
                                                }}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[10px] truncate mb-1" style={{ color: '#9370DB' }}>
                                                            {bet.match}
                                                        </div>
                                                        <div className="font-bold" style={{ color: '#6B4C7A' }}>
                                                            {bet.selection}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeBet(index)}
                                                        className="text-purple-400 hover:text-purple-600 transition-colors text-lg hover:scale-125"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                                <div
                                                    className="mt-2 text-xl font-black"
                                                    style={{ color: '#9370DB' }}
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
                                                style={{ color: '#9370DB' }}
                                            >
                                                {betSlip.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                                            </span>
                                        </div>

                                        <input
                                            type="number"
                                            placeholder="Stake (CRO)"
                                            className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all focus:scale-[1.02]"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(147,112,219,0.15), rgba(152,216,200,0.15))',
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
                                                background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #DDA0DD 100%)',
                                                boxShadow: '0 8px 30px rgba(147, 112, 219, 0.4)'
                                            }}
                                        >
                                            🎮 PLACE BET 🎮
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tournament Spotlight Card */}
                    <div
                        className="mt-4 rounded-xl overflow-hidden"
                        style={{
                            border: '3px solid #98D8C8',
                            boxShadow: '0 8px 32px rgba(152, 216, 200, 0.2)'
                        }}
                    >
                        <div
                            className="px-4 py-2 text-center"
                            style={{
                                background: 'linear-gradient(90deg, #98D8C8 0%, #20B2AA 50%, #98D8C8 100%)'
                            }}
                        >
                            <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                🏆 SPOTLIGHT 🏆
                            </span>
                        </div>
                        <div
                            className="p-4 text-center"
                            style={{
                                background: 'rgba(255,255,255,0.95)'
                            }}
                        >
                            <div className="text-[10px] font-bold mb-2" style={{ color: '#20B2AA' }}>
                                THE INTERNATIONAL 2024
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-3">
                                <div className="text-center">
                                    <div className="text-2xl mb-1">🐉</div>
                                    <div className="font-black text-sm" style={{ color: '#6B4C7A' }}>Team Spirit</div>
                                </div>
                                <div
                                    className="text-xl font-black px-3 py-1 rounded-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(147,112,219,0.2), rgba(152,216,200,0.2))',
                                        color: '#9370DB'
                                    }}
                                >
                                    VS
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl mb-1">⚔️</div>
                                    <div className="font-black text-sm" style={{ color: '#6B4C7A' }}>Gaimin Gladiators</div>
                                </div>
                            </div>
                            <div
                                className="text-2xl font-black animate-pulse mb-2"
                                style={{
                                    background: 'linear-gradient(135deg, #9370DB, #BA55D3)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                $15,000,000
                            </div>
                            <div className="text-xs" style={{ color: '#9370DB' }}>
                                Grand Finals • Tomorrow 18:00 CET
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
                    { icon: '🎯', label: 'Predictions' },
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