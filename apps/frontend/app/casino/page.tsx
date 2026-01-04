"use client"

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Casino games data
const casinoGames = [
    { icon: '🎰', name: 'Slots', count: 245 },
    { icon: '🃏', name: 'Blackjack', count: 89 },
    { icon: '♠️', name: 'Poker', count: 67 },
    { icon: '🎲', name: 'Roulette', count: 54 },
    { icon: '🚀', name: 'Crash', count: 112 },
    { icon: '🎯', name: 'Dice', count: 38 },
]

const liveTables = [
    {
        id: 1,
        game: 'Lightning Roulette',
        table: 'Table 7',
        dealer: 'Elena K.',
        players: 847,
        minBet: '$0.50',
        status: 'SPINNING',
        odds: { red: 1.95, black: 1.95, green: 35.0 },
        lastNumbers: [7, 32, 15, 19, 4]
    },
    {
        id: 2,
        game: 'Infinite Blackjack',
        table: 'Table 3',
        dealer: 'Mike R.',
        players: 1243,
        minBet: '$1.00',
        status: 'DEALING',
        odds: { hit: 1.92, stand: 1.05, double: 2.0 },
        lastNumbers: []
    },
    {
        id: 3,
        game: 'Speed Baccarat',
        table: 'Table 12',
        dealer: 'Sophia L.',
        players: 562,
        minBet: '$5.00',
        status: 'BETTING',
        odds: { player: 1.98, banker: 0.95, tie: 8.0 },
        lastNumbers: []
    },
    {
        id: 4,
        game: 'Rocket Crash',
        table: 'Crash Arena',
        dealer: 'Auto',
        players: 2891,
        minBet: '$0.10',
        status: 'FLYING',
        odds: { cashout: null, banker: null, tie: null },
        multiplier: 3.47
    },
    {
        id: 5,
        game: 'Dream Catcher',
        table: 'Wheel 1',
        dealer: 'Luna M.',
        players: 423,
        minBet: '$0.25',
        status: 'SPINNING',
        odds: { x1: 1.0, x2: 2.0, x5: 5.0 },
        lastNumbers: [2, 1, 5, 2, 1]
    }
]

const navItems: { name: string; path: Route }[] = [
    { name: 'Live', path: '/' as Route },
    { name: 'Sports', path: '/sports' as Route },
    { name: 'Esports', path: '/esports' as Route },
    { name: 'Casino', path: '/casino' as Route },
    { name: 'Prediction', path: '/prediction' as Route }
]

export default function CasinoPage() {
    const pathname = usePathname()
    const [selectedGame, setSelectedGame] = useState('Slots')
    const [betSlip, setBetSlip] = useState<{ table: string; selection: string; odds: number }[]>([])
    const [currentTime, setCurrentTime] = useState('')
    const [currentDate, setCurrentDate] = useState('')
    const [crashMultiplier, setCrashMultiplier] = useState(1.00)

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

    useEffect(() => {
        const crashTimer = setInterval(() => {
            setCrashMultiplier(prev => {
                if (prev >= 10) return 1.00
                return prev + 0.03
            })
        }, 100)
        return () => clearInterval(crashTimer)
    }, [])

    const addToBetSlip = (table: string, selection: string, odds: number) => {
        setBetSlip(prev => [...prev, { table, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy Vaporwave Background */}
            <div className="fixed inset-0">
                {/* Main gradient - soft pastels like the reference */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #FFB6C1 0%, #DDA0DD 15%, #E6E6FA 30%, #B0E0E6 50%, #98D8C8 70%, #F0E68C 85%, #FFB6C1 100%)'
                    }}
                />

                {/* Secondary overlay for depth */}
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 182, 193, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(176, 224, 230, 0.4) 0%, transparent 50%)'
                    }}
                />

                {/* Retro grid overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
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

                {/* Casino-themed floating elements */}
                <div className="absolute bottom-24 right-[15%] text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>🎰</div>
                <div className="absolute top-[45%] left-[5%] text-2xl opacity-30 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>🃏</div>
                <div className="absolute bottom-[40%] right-[5%] text-2xl opacity-35 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>💎</div>
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
                                background: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 100%)',
                                boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)'
                            }}
                        >
                            🎰
                        </div>
                        <span
                            className="text-xl font-black tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, #FF69B4, #BA55D3)',
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
                                            background: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 100%)',
                                            boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)'
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
                            <span className="text-xs font-medium" style={{ color: '#9370DB' }}>
                                {currentDate}
                            </span>
                        </div>
                        <button
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #DA70D6 0%, #BA55D3 100%)',
                                boxShadow: '0 4px 15px rgba(186, 85, 211, 0.4)'
                            }}
                        >
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 pt-20 pb-8 px-4 flex gap-6 max-w-[1800px] mx-auto">
                {/* Left Sidebar - Game Categories */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div
                        className="rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Window Title Bar */}
                        <div
                            className="px-3 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #DA70D6 0%, #BA55D3 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white drop-shadow-sm">🎰 GAMES.EXE</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            </div>
                        </div>

                        <div className="p-3 space-y-1">
                            {casinoGames.map((game) => (
                                <button
                                    key={game.name}
                                    onClick={() => setSelectedGame(game.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${selectedGame === game.name ? 'scale-[1.02]' : 'hover:scale-[1.02]'
                                        }`}
                                    style={
                                        selectedGame === game.name
                                            ? {
                                                background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))',
                                                border: '2px solid #FF69B4'
                                            }
                                            : {
                                                background: 'transparent',
                                                border: '2px solid transparent'
                                            }
                                    }
                                >
                                    <span className="text-xl">{game.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <span
                                            className="text-sm font-bold block"
                                            style={{ color: selectedGame === game.name ? '#BA55D3' : '#6B4C7A' }}
                                        >
                                            {game.name}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: selectedGame === game.name
                                                ? 'linear-gradient(135deg, #FF69B4, #BA55D3)'
                                                : 'rgba(147, 112, 219, 0.2)',
                                            color: selectedGame === game.name ? 'white' : '#9370DB'
                                        }}
                                    >
                                        {game.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Promotions */}
                    <div
                        className="mt-4 rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="px-3 py-2"
                            style={{
                                background: 'linear-gradient(90deg, #FF69B4 0%, #FF1493 100%)'
                            }}
                        >
                            <span className="text-xs font-bold text-white drop-shadow-sm">🎁 PROMOS</span>
                        </div>
                        <div className="p-3 space-y-2">
                            <div
                                className="p-3 rounded-lg text-center"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))'
                                }}
                            >
                                <div className="text-2xl mb-1">🎲</div>
                                <div className="text-xs font-bold" style={{ color: '#BA55D3' }}>
                                    100% First Deposit
                                </div>
                                <div className="text-[10px]" style={{ color: '#9370DB' }}>
                                    Up to 1000 CRO
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    {/* Casino Banner */}
                    <div
                        className="rounded-xl overflow-hidden mb-6"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="px-4 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #FF69B4 0%, #DA70D6 50%, #BA55D3 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-bold drop-shadow-sm">✨ LIVE CASINO</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1
                                        className="text-2xl font-black"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF69B4, #BA55D3)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent'
                                        }}
                                    >
                                        Live Tables
                                    </h1>
                                    <p className="text-sm mt-1" style={{ color: '#9370DB' }}>
                                        Real dealers • Real cards • Real-time wins
                                    </p>
                                </div>
                                <div
                                    className="flex items-center gap-2 px-4 py-2 rounded-full animate-pulse"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))',
                                        border: '2px solid #FF69B4'
                                    }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                                    <span className="text-sm font-bold" style={{ color: '#BA55D3' }}>
                                        {liveTables.length} Live
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Tables */}
                    <div className="space-y-4">
                        {liveTables.map((table) => (
                            <div
                                key={table.id}
                                className="rounded-xl overflow-hidden transition-all hover:scale-[1.01]"
                                style={{
                                    background: 'rgba(255,255,255,0.9)',
                                    border: '3px solid #D8BFD8',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* Table Header */}
                                <div
                                    className="px-4 py-2 flex items-center justify-between"
                                    style={{
                                        background: table.game === 'Rocket Crash'
                                            ? 'linear-gradient(90deg, #FF6347 0%, #FF4500 100%)'
                                            : 'linear-gradient(90deg, #DA70D6 0%, #BA55D3 100%)'
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-bold drop-shadow-sm">
                                            {table.game === 'Rocket Crash' ? '🚀' : '🎴'} {table.game}
                                        </span>
                                    </div>
                                    <div
                                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                                        style={{
                                            background: 'rgba(255,255,255,0.3)',
                                            color: 'white'
                                        }}
                                    >
                                        {table.status}
                                    </div>
                                </div>

                                {/* Table Content */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-lg font-black" style={{ color: '#6B4C7A' }}>
                                                {table.table}
                                            </div>
                                            <div className="text-xs" style={{ color: '#9370DB' }}>
                                                Dealer: {table.dealer} • {table.players.toLocaleString()} watching
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs" style={{ color: '#9370DB' }}>Min Bet</div>
                                            <div className="text-lg font-black" style={{ color: '#FF69B4' }}>
                                                {table.minBet}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Crash Game Special Display */}
                                    {table.game === 'Rocket Crash' && (
                                        <div
                                            className="p-4 rounded-xl mb-4 text-center"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,99,71,0.1), rgba(255,69,0,0.1))',
                                                border: '2px solid rgba(255, 99, 71, 0.3)'
                                            }}
                                        >
                                            <div className="text-xs mb-1" style={{ color: '#FF6347' }}>CURRENT MULTIPLIER</div>
                                            <div
                                                className="text-4xl font-black animate-pulse"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FF6347, #FF4500)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent'
                                                }}
                                            >
                                                {crashMultiplier.toFixed(2)}x
                                            </div>
                                            <button
                                                className="mt-3 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)',
                                                    boxShadow: '0 4px 15px rgba(255, 99, 71, 0.4)'
                                                }}
                                            >
                                                🚀 CASH OUT
                                            </button>
                                        </div>
                                    )}

                                    {/* Betting Options */}
                                    {table.odds.red !== undefined && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Red', table.odds.red!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.25))',
                                                    border: '2px solid rgba(239, 68, 68, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#EF4444' }}>Red</div>
                                                <div className="text-lg font-black" style={{ color: '#EF4444' }}>
                                                    {table.odds.red!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Green', table.odds.green!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.25))',
                                                    border: '2px solid rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#10B981' }}>Green</div>
                                                <div className="text-lg font-black" style={{ color: '#10B981' }}>
                                                    {table.odds.green!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Black', table.odds.black!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(30,30,30,0.15), rgba(30,30,30,0.25))',
                                                    border: '2px solid rgba(30, 30, 30, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#374151' }}>Black</div>
                                                <div className="text-lg font-black" style={{ color: '#374151' }}>
                                                    {table.odds.black!.toFixed(2)}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Blackjack Options */}
                                    {table.odds.hit !== undefined && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Hit', table.odds.hit!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))',
                                                    border: '2px solid rgba(255, 105, 180, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#9370DB' }}>Hit</div>
                                                <div className="text-lg font-black" style={{ color: '#FF69B4' }}>
                                                    {table.odds.hit!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Stand', table.odds.stand!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(147,112,219,0.15), rgba(186,85,211,0.15))',
                                                    border: '2px solid rgba(147, 112, 219, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#9370DB' }}>Stand</div>
                                                <div className="text-lg font-black" style={{ color: '#6B4C7A' }}>
                                                    {table.odds.stand!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Double', table.odds.double!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(218,112,214,0.15), rgba(186,85,211,0.15))',
                                                    border: '2px solid rgba(218, 112, 214, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#9370DB' }}>Double</div>
                                                <div className="text-lg font-black" style={{ color: '#DA70D6' }}>
                                                    {table.odds.double!.toFixed(2)}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Baccarat Options */}
                                    {table.odds.player !== undefined && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Player', table.odds.player!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.25))',
                                                    border: '2px solid rgba(59, 130, 246, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#3B82F6' }}>Player</div>
                                                <div className="text-lg font-black" style={{ color: '#3B82F6' }}>
                                                    {table.odds.player!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Tie', table.odds.tie!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.25))',
                                                    border: '2px solid rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#10B981' }}>Tie</div>
                                                <div className="text-lg font-black" style={{ color: '#10B981' }}>
                                                    {table.odds.tie!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, 'Banker', table.odds.banker!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.25))',
                                                    border: '2px solid rgba(239, 68, 68, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#EF4444' }}>Banker</div>
                                                <div className="text-lg font-black" style={{ color: '#EF4444' }}>
                                                    {table.odds.banker!.toFixed(2)}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Dream Catcher Options */}
                                    {table.odds.x1 !== undefined && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => addToBetSlip(table.game, '1x', table.odds.x1!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.25))',
                                                    border: '2px solid rgba(251, 191, 36, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#F59E0B' }}>1x</div>
                                                <div className="text-lg font-black" style={{ color: '#F59E0B' }}>
                                                    {table.odds.x1!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, '2x', table.odds.x2!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.25))',
                                                    border: '2px solid rgba(59, 130, 246, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#3B82F6' }}>2x</div>
                                                <div className="text-lg font-black" style={{ color: '#3B82F6' }}>
                                                    {table.odds.x2!.toFixed(2)}
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => addToBetSlip(table.game, '5x', table.odds.x5!)}
                                                className="p-3 rounded-xl transition-all hover:scale-105"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.25))',
                                                    border: '2px solid rgba(168, 85, 247, 0.3)'
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-1" style={{ color: '#A855F7' }}>5x</div>
                                                <div className="text-lg font-black" style={{ color: '#A855F7' }}>
                                                    {table.odds.x5!.toFixed(2)}
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {/* Last Numbers for Roulette/Wheel */}
                                    {table.lastNumbers && table.lastNumbers.length > 0 && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs" style={{ color: '#9370DB' }}>Last:</span>
                                            <div className="flex gap-1">
                                                {table.lastNumbers.map((num, i) => (
                                                    <span
                                                        key={i}
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                        style={{
                                                            background: num === 0 ? '#10B981' : num <= 18 ? '#EF4444' : '#374151'
                                                        }}
                                                    >
                                                        {num}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Right Sidebar - Bet Slip */}
                <aside className="hidden xl:block w-72 flex-shrink-0">
                    <div
                        className="rounded-xl overflow-hidden sticky top-20"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            border: '3px solid #D8BFD8',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Window Title Bar */}
                        <div
                            className="px-3 py-2 flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(90deg, #FF69B4 0%, #DA70D6 100%)'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white drop-shadow-sm">
                                    🎫 BETSLIP.EXE
                                </span>
                                {betSlip.length > 0 && (
                                    <span
                                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                                        style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}
                                    >
                                        {betSlip.length}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-300 border border-green-400"></div>
                                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                            </div>
                        </div>

                        {/* Bet Slip Content */}
                        {betSlip.length === 0 ? (
                            <div className="p-6 text-center">
                                <div className="text-4xl mb-3">🎯</div>
                                <div className="text-sm font-bold mb-2" style={{ color: '#6B4C7A' }}>
                                    No bets placed yet
                                </div>
                                <div className="text-xs" style={{ color: '#9370DB' }}>
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
                                                background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))',
                                                border: '2px solid rgba(186, 85, 211, 0.3)'
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] truncate mb-1" style={{ color: '#9370DB' }}>
                                                        {bet.table}
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
                                                style={{ color: '#FF69B4' }}
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
                                            style={{ color: '#FF69B4' }}
                                        >
                                            {betSlip.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                                        </span>
                                    </div>

                                    <input
                                        type="number"
                                        placeholder="Stake (CRO)"
                                        className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all focus:scale-[1.02]"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,182,193,0.3), rgba(221,160,221,0.3))',
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
                                            background: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 50%, #BA55D3 100%)',
                                            boxShadow: '0 8px 30px rgba(255, 105, 180, 0.4)'
                                        }}
                                    >
                                        ✨ PLACE BET ✨
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Jackpot Ticker */}
                    <div
                        className="mt-4 rounded-xl overflow-hidden"
                        style={{
                            border: '3px solid #FFD700',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
                        }}
                    >
                        <div
                            className="px-4 py-2 text-center"
                            style={{
                                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)'
                            }}
                        >
                            <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                🏆 MEGA JACKPOT 🏆
                            </span>
                        </div>
                        <div
                            className="p-4 text-center"
                            style={{
                                background: 'rgba(255,255,255,0.95)'
                            }}
                        >
                            <div
                                className="text-3xl font-black animate-pulse"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                $2,847,392
                            </div>
                            <div className="text-xs mt-2" style={{ color: '#9370DB' }}>
                                Growing every second! 🚀
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Desktop Icons (decorative) */}
            <div className="fixed right-8 top-32 z-5 hidden 2xl:flex flex-col gap-6">
                {[
                    { icon: '📁', label: 'My Bets' },
                    { icon: '📊', label: 'History' },
                    { icon: '⚙️', label: 'Settings' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all group-hover:scale-110"
                            style={{
                                background: 'rgba(255,255,255,0.7)',
                                border: '2px solid #D8BFD8',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            }}
                        >
                            {item.icon}
                        </div>
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{
                                background: 'rgba(255,255,255,0.8)',
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