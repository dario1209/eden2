import type { Route } from 'next'
import Link from 'next/link'

type LiveMatch = {
    id: number
    league: string
    homeTeam: string
    awayTeam: string
    homeScore: number
    awayScore: number
    time: string
    type: 'football' | 'esports'
    odds: { home: number; draw: number | null; away: number }
    overUnder: { over: number; under: number }
}

// Live match data
const liveMatches: LiveMatch[] = [
    {
        id: 1,
        league: 'Premier League',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 2,
        awayScore: 1,
        time: "67'",
        type: 'football',
        odds: { home: 1.45, draw: 4.2, away: 6.5 },
        overUnder: { over: 1.85, under: 1.95 },
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
        odds: { home: 2.1, draw: 3.4, away: 3.25 },
        overUnder: { over: 1.72, under: 2.1 },
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
        odds: { home: 1.35, draw: null, away: 3.1 },
        overUnder: { over: 1.9, under: 1.9 },
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
        odds: { home: 1.65, draw: 4.0, away: 5.25 },
        overUnder: { over: 1.4, under: 2.85 },
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
        odds: { home: 8.5, draw: 5.0, away: 1.25 },
        overUnder: { over: 1.55, under: 2.4 },
    },
]

const sports = [
    { icon: '⚽', name: 'Football', count: 142 },
    { icon: '🏀', name: 'Basketball', count: 38 },
    { icon: '🎮', name: 'Esports', count: 67 },
    { icon: '🎾', name: 'Tennis', count: 24 },
    { icon: '🏈', name: 'NFL', count: 12 },
    { icon: '🎰', name: 'Casino', count: 89 },
] as const

const navItems: { name: string; path: Route }[] = [
    { name: 'Live', path: '/' as Route },
    { name: 'Sports', path: '/sports' as Route },
    { name: 'Esports', path: '/esports' as Route },
    { name: 'Casino', path: '/casino' as Route },
    { name: 'Prediction', path: '/prediction' as Route },
]

const stats = [
    {
        label: 'Total Volume',
        value: '2.4M',
        change: '↑ 12% this week',
        icon: '💎',
        gradient: 'linear-gradient(135deg, #7EC8E3, #5BA4C9)',
    },
    {
        label: 'Active Bets',
        value: '8,432',
        change: '↑ 5% this week',
        icon: '🎯',
        gradient: 'linear-gradient(135deg, #FF6B9D, #C44569)',
    },
    {
        label: 'Avg Settlement',
        value: '0.8s',
        change: '↓ 15% this week',
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #957DAD, #6B4C7A)',
    },
    {
        label: 'Oracle Updates',
        value: '1.2K/min',
        change: 'Real-time',
        icon: '🔗',
        gradient: 'linear-gradient(135deg, #98D8C8, #20B2AA)',
    },
] as const

const desktopIcons = [
    { icon: '📊', label: 'My Bets' },
    { icon: '📈', label: 'Statistics' },
    { icon: '⚙️', label: 'Settings' },
] as const

export default async function SportLivePage({
    params,
}: {
    params: Promise<{ sport: string }>
}) {
    const { sport } = await params

    const now = new Date()
    const currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
    const currentDate = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })

    const selectedSport = sport
        ? sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase()
        : 'Football'

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Dreamy Vaporwave Background - Sunrise Theme */}
            <div className="fixed inset-0">
                {/* Main gradient - ethereal sunrise pastels */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, #FFB6C1 0%, #FFDAB9 12%, #E6E6FA 28%, #DDA0DD 45%, #B0E0E6 60%, #98D8C8 75%, #87CEEB 90%, #E6E6FA 100%)',
                    }}
                />

                {/* Warm sun glow at top */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-50"
                    style={{
                        background:
                            'radial-gradient(ellipse at center top, rgba(255, 218, 185, 0.5) 0%, rgba(255, 182, 193, 0.3) 30%, transparent 60%)',
                    }}
                />

                {/* Retro grid overlay */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Floating clouds */}
                <div
                    className="absolute top-10 left-6 text-6xl opacity-70 animate-bounce"
                    style={{ animationDuration: '7s' }}
                >
                    ☁️
                </div>
                <div
                    className="absolute top-20 right-10 text-5xl opacity-60 animate-bounce"
                    style={{ animationDuration: '9s', animationDelay: '1s' }}
                >
                    ☁️
                </div>
                <div
                    className="absolute top-36 left-20 text-4xl opacity-50 animate-bounce"
                    style={{ animationDuration: '8s', animationDelay: '2s' }}
                >
                    ☁️
                </div>
                <div
                    className="absolute top-28 right-28 text-3xl opacity-45 animate-bounce"
                    style={{ animationDuration: '10s', animationDelay: '3s' }}
                >
                    ☁️
                </div>

                {/* Sparkles and stars */}
                <div className="absolute top-16 left-1/3 text-2xl opacity-70 animate-pulse">
                    ✨
                </div>
                <div
                    className="absolute top-24 right-1/4 text-xl opacity-60 animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                >
                    ⭐
                </div>
                <div
                    className="absolute top-48 left-1/2 text-lg opacity-50 animate-pulse"
                    style={{ animationDelay: '1s' }}
                >
                    ✨
                </div>
                <div
                    className="absolute bottom-28 right-1/3 text-2xl opacity-60 animate-pulse"
                    style={{ animationDelay: '1.5s' }}
                >
                    ⭐
                </div>
                <div
                    className="absolute bottom-44 left-1/4 text-xl opacity-50 animate-pulse"
                    style={{ animationDelay: '2s' }}
                >
                    ✨
                </div>
                <div
                    className="absolute top-60 right-8 text-lg opacity-40 animate-pulse"
                    style={{ animationDelay: '2.5s' }}
                >
                    ⭐
                </div>

                {/* Themed floating elements */}
                <div
                    className="absolute bottom-20 right-12 text-3xl opacity-40 animate-bounce"
                    style={{ animationDuration: '5s' }}
                >
                    🎲
                </div>
                <div
                    className="absolute top-52 left-4 text-2xl opacity-35 animate-bounce"
                    style={{ animationDuration: '6s', animationDelay: '1s' }}
                >
                    💎
                </div>
                <div
                    className="absolute bottom-36 right-4 text-2xl opacity-30 animate-bounce"
                    style={{ animationDuration: '7s', animationDelay: '2s' }}
                >
                    🔗
                </div>
            </div>

            {/* Main Desktop Window */}
            <div className="relative z-10 mx-4 mt-4">
                {/* Window Frame */}
                <div
                    className="rounded-xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(180deg, #E6E6FA 0%, #DDA0DD 100%)',
                        border: '3px solid #D8BFD8',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.5)',
                    }}
                >
                    {/* Window Title Bar */}
                    <div
                        className="flex items-center justify-between px-4 py-2"
                        style={{
                            background:
                                'linear-gradient(90deg, #FF6B9D 0%, #C44569 25%, #957DAD 50%, #7EC8E3 75%, #98D8C8 100%)',
                            borderBottom: '2px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-white tracking-widest drop-shadow-md">
                                Edge Haus.EXE
                            </span>
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)',
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
                                <button
                                    type="button"
                                    className="w-4 h-4 rounded-sm bg-yellow-300 hover:bg-yellow-400 transition-colors flex items-center justify-center text-[10px] font-bold text-yellow-800"
                                >
                                    _
                                </button>
                                <button
                                    type="button"
                                    className="w-4 h-4 rounded-sm bg-green-300 hover:bg-green-400 transition-colors flex items-center justify-center text-[10px] font-bold text-green-800"
                                >
                                    □
                                </button>
                                <button
                                    type="button"
                                    className="w-4 h-4 rounded-sm bg-pink-300 hover:bg-pink-400 transition-colors flex items-center justify-center text-[10px] font-bold text-pink-800"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Bar */}
                    <div
                        className="flex items-center gap-6 px-4 py-1.5 text-xs font-medium"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            borderBottom: '1px solid rgba(186, 85, 211, 0.2)',
                            color: '#6B4C7A',
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
                        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    >
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link href={'/' as Route} className="flex items-center gap-3 group">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-black text-white transition-all group-hover:scale-110 group-hover:rotate-3"
                                    style={{
                                        background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #957DAD 100%)',
                                        boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)',
                                        inset: '0 2px 0 rgba(255,255,255,0.3)',
                                    }}
                                >
                                    💫
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tight leading-none">
                                        <span style={{ color: '#C44569' }}>MICRO</span>
                                        <span style={{ color: '#957DAD' }}>BETS</span>
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest" style={{ color: '#7EC8E3' }}>
                                        LIVE BETTING
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
                                            className="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
                                            style={
                                                isLive
                                                    ? {
                                                        color: 'white',
                                                        background:
                                                            'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #957DAD 100%)',
                                                        boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)',
                                                        transform: 'scale(1.05)',
                                                    }
                                                    : { color: '#957DAD', background: 'transparent' }
                                            }
                                        >
                                            {isLive && <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />}
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                                style={{
                                    background:
                                        'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(196,69,105,0.2))',
                                    border: '2px solid rgba(196, 69, 105, 0.3)',
                                    color: '#C44569',
                                }}
                            >
                                <span>🔍</span>
                                <span>Search</span>
                            </button>
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-full text-sm font-black text-white transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                                    boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)',
                                }}
                            >
                                Connect Wallet
                            </button>
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
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <div
                                    className="px-2 py-2 text-[10px] font-black text-center tracking-widest text-white"
                                    style={{ background: 'linear-gradient(90deg, #FF6B9D, #C44569, #957DAD)' }}
                                >
                                    LIVE
                                </div>

                                <div className="flex flex-col items-center py-3 gap-2">
                                    {sports.map((s) => {
                                        const selected = selectedSport === s.name
                                        return (
                                            <div
                                                key={s.name}
                                                className="group relative w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300"
                                                style={
                                                    selected
                                                        ? {
                                                            background:
                                                                'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(196, 69, 105, 0.3))',
                                                            border: '2px solid #FF6B9D',
                                                            boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
                                                            transform: 'scale(1.08)',
                                                        }
                                                        : {
                                                            background: 'rgba(255,255,255,0.5)',
                                                            border: '2px solid transparent',
                                                        }
                                                }
                                            >
                                                <span className="text-2xl">{s.icon}</span>
                                                <span
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                                        boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)',
                                                    }}
                                                >
                                                    {s.count > 99 ? '99+' : s.count}
                                                </span>

                                                <div
                                                    className="absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                                        color: 'white',
                                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                                    }}
                                                >
                                                    {s.name}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 mt-4 space-y-4">
                            {/* Header row for the sport */}
                            <div
                                className="rounded-xl overflow-hidden"
                                style={{
                                    background: 'rgba(255,255,255,0.9)',
                                    border: '3px solid #D8BFD8',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <div
                                    className="flex items-center justify-between px-4 py-3"
                                    style={{
                                        background:
                                            'linear-gradient(90deg, rgba(255,107,157,0.2), rgba(149,125,173,0.15), rgba(126,200,227,0.2))',
                                        borderBottom: '2px solid rgba(186, 85, 211, 0.2)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white"
                                            style={{
                                                background: 'linear-gradient(135deg, #7EC8E3, #5BA4C9)',
                                                boxShadow: '0 4px 15px rgba(126,200,227,0.35)',
                                            }}
                                        >
                                            🏟️
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#957DAD' }}>
                                                LIVE / {selectedSport}
                                            </div>
                                            <div className="text-xl font-black" style={{ color: '#6B4C7A' }}>
                                                {selectedSport} Markets
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/${sport}/markets`}
                                        className="px-4 py-2 rounded-full text-sm font-black text-white transition-all hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
                                            boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)',
                                        }}
                                    >
                                        Open Markets
                                    </Link>
                                </div>
                            </div>

                            {/* Live Matches Window */}
                            <div
                                className="rounded-xl overflow-hidden"
                                style={{
                                    border: '3px solid #D8BFD8',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    className="flex items-center justify-between px-4 py-2"
                                    style={{
                                        background:
                                            'linear-gradient(90deg, #FF6B9D 0%, #C44569 30%, #957DAD 60%, #7EC8E3 100%)',
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-white tracking-widest drop-shadow-md">
                                            LIVEMATCHES.DAT
                                        </span>
                                        <span
                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                            style={{
                                                background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                                boxShadow: '0 2px 8px rgba(196, 69, 105, 0.4)',
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                            {liveMatches.length} LIVE
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-white/40"></div>
                                        <div className="w-3 h-3 rounded-full bg-white/40"></div>
                                        <div className="w-3 h-3 rounded-full bg-pink-200"></div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    {/* Table header */}
                                    <div
                                        className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                                        style={{
                                            background:
                                                'linear-gradient(90deg, rgba(255,107,157,0.2), rgba(149,125,173,0.15), rgba(126,200,227,0.2))',
                                            color: '#6B4C7A',
                                            borderBottom: '2px solid rgba(186, 85, 211, 0.2)',
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
                                            className={[
                                                'grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all duration-300',
                                                'hover:bg-gradient-to-r hover:from-pink-50 hover:via-purple-50 hover:to-blue-50',
                                                index !== liveMatches.length - 1 ? 'border-b border-purple-100' : '',
                                            ].join(' ')}
                                        >
                                            {/* Match info */}
                                            <div className="col-span-4">
                                                <div
                                                    className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2"
                                                    style={{ color: match.type === 'esports' ? '#957DAD' : '#7EC8E3' }}
                                                >
                                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF6B9D' }} />
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

                                            {/* 1X2 Odds (display-only) */}
                                            <div className="col-span-3 flex justify-center gap-1.5">
                                                {[
                                                    { label: '1', value: match.odds.home, color: '#7EC8E3', bg: 'rgba(126,200,227,0.15)' },
                                                    { label: 'X', value: match.odds.draw, color: '#957DAD', bg: 'rgba(149,125,173,0.15)' },
                                                    { label: '2', value: match.odds.away, color: '#FF6B9D', bg: 'rgba(255,107,157,0.15)' },
                                                ].map((odd) =>
                                                    odd.value === null ? (
                                                        <div
                                                            key={odd.label}
                                                            className="px-2.5 py-1.5 rounded-lg min-w-[45px] text-center"
                                                            style={{ background: 'rgba(0,0,0,0.04)', border: '2px solid rgba(0,0,0,0.06)' }}
                                                        >
                                                            <div className="text-[9px] font-bold" style={{ color: '#957DAD' }}>
                                                                {odd.label}
                                                            </div>
                                                            <div className="text-sm font-black" style={{ color: '#957DAD' }}>
                                                                —
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={odd.label}
                                                            className="px-2.5 py-1.5 rounded-lg min-w-[45px] text-center"
                                                            style={{ background: odd.bg, border: `2px solid ${odd.color}` }}
                                                        >
                                                            <div className="text-[9px] font-bold" style={{ color: odd.color }}>
                                                                {odd.label}
                                                            </div>
                                                            <div className="text-sm font-black" style={{ color: odd.color }}>
                                                                {odd.value.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Over/Under (display-only) */}
                                            <div className="col-span-2 flex justify-center gap-1.5">
                                                <div
                                                    className="px-2 py-1.5 rounded-lg text-center"
                                                    style={{ background: 'rgba(126, 200, 227, 0.15)', border: '2px solid #7EC8E3' }}
                                                >
                                                    <div className="text-[9px] font-bold" style={{ color: '#7EC8E3' }}>
                                                        O
                                                    </div>
                                                    <div className="text-sm font-black" style={{ color: '#7EC8E3' }}>
                                                        {match.overUnder.over.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div
                                                    className="px-2 py-1.5 rounded-lg text-center"
                                                    style={{ background: 'rgba(255, 107, 157, 0.15)', border: '2px solid #FF6B9D' }}
                                                >
                                                    <div className="text-[9px] font-bold" style={{ color: '#FF6B9D' }}>
                                                        U
                                                    </div>
                                                    <div className="text-sm font-black" style={{ color: '#FF6B9D' }}>
                                                        {match.overUnder.under.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score */}
                                            <div className="col-span-1 text-center">
                                                <div
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-black text-lg"
                                                    style={{
                                                        background:
                                                            'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(196,69,105,0.2))',
                                                        color: '#C44569',
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
                                                        boxShadow: '0 4px 15px rgba(196, 69, 105, 0.3)',
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
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="p-5 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                                        style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            border: '3px solid #D8BFD8',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#957DAD' }}>
                                                {stat.label}
                                            </span>
                                            <span className="text-2xl group-hover:scale-125 transition-transform">{stat.icon}</span>
                                        </div>
                                        <div className="text-3xl font-black mb-1 bg-clip-text text-transparent" style={{ backgroundImage: stat.gradient }}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs font-bold" style={{ color: '#7EC8E3' }}>
                                            {stat.change}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>

                        {/* Betslip (static placeholder) */}
                        <aside className="hidden xl:block w-80 ml-4 mt-4">
                            <div
                                className="rounded-xl overflow-hidden sticky top-4"
                                style={{
                                    border: '3px solid #D8BFD8',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    className="flex items-center justify-between px-4 py-2"
                                    style={{ background: 'linear-gradient(90deg, #FF6B9D 0%, #C44569 100%)' }}
                                >
                                    <span className="text-xs font-black text-white tracking-widest drop-shadow-md">BETSLIP.EXE</span>
                                    <span
                                        className="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center"
                                        style={{
                                            background: 'white',
                                            color: '#C44569',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        0
                                    </span>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    <div className="text-center py-12 px-4">
                                        <div
                                            className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(126,200,227,0.2))',
                                                border: '3px solid #D8BFD8',
                                            }}
                                        >
                                            🧾
                                        </div>
                                        <div className="text-sm font-bold mb-2" style={{ color: '#6B4C7A' }}>
                                            Betslip is disabled in this build
                                        </div>
                                        <div className="text-xs" style={{ color: '#957DAD' }}>
                                            This route is running as a Server Component to satisfy Next 15 PageProps typing.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hot Streak Card */}
                            <div
                                className="mt-4 rounded-xl overflow-hidden"
                                style={{ border: '3px solid #7EC8E3', boxShadow: '0 8px 32px rgba(126, 200, 227, 0.2)' }}
                            >
                                <div
                                    className="px-4 py-2 text-center"
                                    style={{ background: 'linear-gradient(90deg, #7EC8E3 0%, #5BA4C9 50%, #7EC8E3 100%)' }}
                                >
                                    <span className="text-xs font-black text-white tracking-widest drop-shadow-md">HOT STREAK</span>
                                </div>
                                <div className="p-4 text-center" style={{ background: 'rgba(255,255,255,0.95)' }}>
                                    <div className="text-[10px] font-bold mb-2" style={{ color: '#7EC8E3' }}>
                                        TOP WINNER TODAY
                                    </div>
                                    <div
                                        className="text-3xl font-black animate-pulse mb-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                                            WebkitBackgroundClip: 'text',
                                            backgroundClip: 'text',
                                            color: 'transparent',
                                        }}
                                    >
                                        12,847
                                    </div>
                                    <div className="text-xs mb-3" style={{ color: '#957DAD' }}>
                                        5 consecutive wins!
                                    </div>
                                    <div
                                        className="flex items-center justify-center gap-2 text-xs font-bold px-3 py-2 rounded-lg"
                                        style={{
                                            background:
                                                'linear-gradient(135deg, rgba(255,107,157,0.15), rgba(126,200,227,0.15))',
                                            color: '#6B4C7A',
                                        }}
                                    >
                                        <span>0x7f3...8a2b</span>
                                        <span style={{ color: '#7EC8E3' }}>•</span>
                                        <span style={{ color: '#FF6B9D' }}>Verified</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Desktop Icons (decorative) */}
            <div className="fixed right-8 top-36 z-[5] hidden 2xl:flex flex-col gap-6">
                {desktopIcons.map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all group-hover:scale-110"
                            style={{
                                background: 'rgba(255,255,255,0.85)',
                                border: '2px solid #D8BFD8',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            }}
                        >
                            {item.icon}
                        </div>
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{ background: 'rgba(255,255,255,0.9)', color: '#6B4C7A' }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
