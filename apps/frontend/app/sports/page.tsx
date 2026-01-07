"use client"

import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

// Sports data
const sports = [
    { icon: "⚽", name: "Football", count: 142 },
    { icon: "🏀", name: "Basketball", count: 38 },
    { icon: "🎾", name: "Tennis", count: 24 },
    { icon: "⚾", name: "Baseball", count: 18 },
    { icon: "🏒", name: "Hockey", count: 16 },
    { icon: "🏈", name: "NFL", count: 12 },
]

const liveMatches = [
    {
        id: 1,
        league: "Premier League",
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        homeScore: 2,
        awayScore: 1,
        time: "67'",
        status: "LIVE",
        odds: { home: 1.45, draw: 4.2, away: 6.5 },
        overUnder: { over: 1.85, under: 1.95 },
    },
    {
        id: 2,
        league: "La Liga",
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        homeScore: 1,
        awayScore: 1,
        time: "34'",
        status: "LIVE",
        odds: { home: 2.1, draw: 3.4, away: 3.25 },
        overUnder: { over: 1.72, under: 2.1 },
    },
    {
        id: 3,
        league: "Bundesliga",
        homeTeam: "Bayern Munich",
        awayTeam: "Dortmund",
        homeScore: 3,
        awayScore: 2,
        time: "81'",
        status: "LIVE",
        odds: { home: 1.25, draw: 6.0, away: 9.5 },
        overUnder: { over: 1.4, under: 2.85 },
    },
    {
        id: 4,
        league: "Serie A",
        homeTeam: "Juventus",
        awayTeam: "AC Milan",
        homeScore: 0,
        awayScore: 0,
        time: "15:30",
        status: "UPCOMING",
        odds: { home: 2.2, draw: 3.2, away: 3.5 },
        overUnder: { over: 1.9, under: 1.85 },
    },
    {
        id: 5,
        league: "Ligue 1",
        homeTeam: "PSG",
        awayTeam: "Lyon",
        homeScore: 0,
        awayScore: 0,
        time: "20:45",
        status: "UPCOMING",
        odds: { home: 1.35, draw: 5.0, away: 8.0 },
        overUnder: { over: 1.65, under: 2.25 },
    },
]

const navItems: { name: string; path: Route }[] = [
    { name: "Live", path: "/" as Route },
    { name: "Sports", path: "/sports" as Route },
    { name: "Esports", path: "/esports" as Route },
    { name: "Casino", path: "/casino" as Route },
    { name: "Prediction", path: "/prediction" as Route },
]

function formatOdds(n: number) {
    return n.toFixed(2)
}

export default function SportsPage() {
    const pathname = usePathname()
    const [selectedSport, setSelectedSport] = useState("Football")
    const [betSlip, setBetSlip] = useState<
        { match: string; selection: string; odds: number }[]
    >([])
    const [currentTime, setCurrentTime] = useState("")
    const [currentDate, setCurrentDate] = useState("")

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }),
            )
            setCurrentDate(
                now.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                }),
            )
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip((prev) => [...prev, { match, selection, odds }])
    }

    const removeBet = (index: number) => {
        setBetSlip((prev) => prev.filter((_, i) => i !== index))
    }

    const liveCount = useMemo(
        () => liveMatches.filter((m) => m.status === "LIVE").length,
        [],
    )

    const totalOdds = useMemo(() => {
        if (betSlip.length === 0) return 1
        return betSlip.reduce((acc, bet) => acc * bet.odds, 1)
    }, [betSlip])

    const panelClass = `relative rounded-3xl bg-[linear-gradient(135deg,rgba(10,14,12,0.55),rgba(10,14,12,0.22))]
backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-[#B08D57]/15 border border-[#B08D57]/50`

    const panelInnerBorder = (
        <div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/20" />
    )

    const chipClass = `inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]
uppercase tracking-[0.28em] border border-[#B08D57]/45 bg-[#0A0E0C]/30 text-[#D8CFC0]/80`

    const activeNav = (href: string) => pathname === href

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Eden Haus atmosphere */}
            <div className="absolute inset-0 bg-[#1F3D2B]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.65),rgba(10,14,12,0.92))]" />
            <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light wallpaper" />
            <div className="absolute inset-0 opacity-[0.12] deco-lines" />

            {/* Content */}
            <div className="relative z-10 px-4 md:px-8 py-10">
                {/* Top header */}
                <header className={`${panelClass} px-6 py-5`}>
                    {panelInnerBorder}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center justify-between gap-4">
                            <Link href={"/" as Route} className="group">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-serif text-2xl md:text-3xl tracking-[0.12em] text-[#F3EBDD] drop-shadow-[0_10px_25px_rgba(0,0,0,0.55)]">
                                        Eden Haus
                                    </span>
                                    <span className="hidden sm:inline text-[11px] tracking-[0.45em] uppercase text-[#B08D57]/85">
                                        Members Only
                                    </span>
                                </div>
                                <div className="mt-1 text-[11px] tracking-[0.34em] uppercase text-[#D8CFC0]/55 group-hover:text-[#C2A14D]/85 transition-colors">
                                    Live Lines • Quiet Confidence • Brass & Smoke
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center gap-3">
                                <span className={chipClass}>
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_18px_rgba(194,161,77,0.45)]" />
                                    {liveCount} live
                                </span>

                                <span className={chipClass}>
                                    <span className="text-[#C2A14D]/80">⏱</span>
                                    {currentDate} <span className="text-[#B08D57]/60">•</span>{" "}
                                    {currentTime}
                                </span>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex flex-wrap items-center gap-2">
                            {navItems.map((item) => {
                                const isActive = activeNav(item.path as string)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className={[
                                            "relative rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] transition",
                                            "border",
                                            isActive
                                                ? "border-[#C2A14D]/70 text-[#F3EBDD] bg-[linear-gradient(180deg,rgba(194,161,77,0.18),rgba(176,141,87,0.06))] shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
                                                : "border-[#B08D57]/35 text-[#D8CFC0]/70 bg-[#0A0E0C]/20 hover:text-[#F3EBDD] hover:border-[#C2A14D]/55",
                                        ].join(" ")}
                                    >
                                        {isActive && (
                                            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_16px_rgba(194,161,77,0.45)]" />
                                        )}
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </header>

                {/* Body grid */}
                <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Sports rail */}
                    <aside className="xl:col-span-3">
                        <div className={`${panelClass} p-5`}>
                            {panelInnerBorder}

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[11px] tracking-[0.48em] uppercase text-[#B08D57]/85">
                                        Sports
                                    </div>
                                    <div className="mt-1 font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                        Pick a game
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-[#D8CFC0]/55">
                                    <span className="text-[#C2A14D]/80">⌁</span> Lines
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
                                {sports.map((sport) => {
                                    const active = selectedSport === sport.name
                                    return (
                                        <button
                                            key={sport.name}
                                            onClick={() => setSelectedSport(sport.name)}
                                            className={[
                                                "relative rounded-2xl p-4 text-left transition",
                                                "border",
                                                active
                                                    ? "border-[#C2A14D]/70 bg-[linear-gradient(180deg,rgba(194,161,77,0.16),rgba(10,14,12,0.10))] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                                                    : "border-[#B08D57]/30 bg-[#0A0E0C]/20 hover:border-[#C2A14D]/45",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{sport.icon}</span>
                                                    <div>
                                                        <div className="text-xs tracking-[0.22em] uppercase text-[#D8CFC0]/80">
                                                            {sport.name}
                                                        </div>
                                                        <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-[#B08D57]/70">
                                                            {sport.count} markets
                                                        </div>
                                                    </div>
                                                </div>

                                                <span
                                                    className={[
                                                        "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] tracking-[0.22em] uppercase",
                                                        active
                                                            ? "bg-[#C2A14D]/20 text-[#F3EBDD] border border-[#C2A14D]/35"
                                                            : "bg-[#0A0E0C]/25 text-[#D8CFC0]/70 border border-[#B08D57]/25",
                                                    ].join(" ")}
                                                >
                                                    {sport.count > 99 ? "99+" : sport.count}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-5 text-[11px] italic text-[#D8CFC0]/40">
                                Lines whisper; the house listens.
                            </div>
                        </div>
                    </aside>

                    {/* Matches */}
                    <section className="xl:col-span-6">
                        <div className={`${panelClass} p-5`}>
                            {panelInnerBorder}

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="text-[11px] tracking-[0.48em] uppercase text-[#B08D57]/85">
                                        {selectedSport}
                                    </div>
                                    <div className="mt-1 font-serif text-2xl tracking-[0.10em] text-[#F3EBDD]">
                                        Today’s board
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={chipClass}>1X2</span>
                                    <span className={chipClass}>O/U 2.5</span>
                                    <span className={chipClass}>Live settle</span>
                                </div>
                            </div>

                            <div className="mt-5 overflow-hidden rounded-2xl border border-[#B08D57]/30 bg-[#0A0E0C]/20">
                                {/* table header */}
                                <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/80 border-b border-[#B08D57]/25">
                                    <div className="col-span-4">Match</div>
                                    <div className="col-span-3 text-center">1 X 2</div>
                                    <div className="col-span-2 text-center">O/U 2.5</div>
                                    <div className="col-span-1 text-center">Score</div>
                                    <div className="col-span-2 text-center">Status</div>
                                </div>

                                {/* rows */}
                                {liveMatches.map((match, index) => {
                                    const rowBorder =
                                        index !== liveMatches.length - 1
                                            ? "border-b border-[#B08D57]/15"
                                            : ""

                                    return (
                                        <div
                                            key={match.id}
                                            className={`grid grid-cols-12 gap-3 px-4 py-4 items-center transition ${rowBorder} hover:bg-[#0A0E0C]/25`}
                                        >
                                            {/* Match info */}
                                            <div className="col-span-12 sm:col-span-4">
                                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#D8CFC0]/60">
                                                    {match.status === "LIVE" && (
                                                        <span className="inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_16px_rgba(194,161,77,0.55)]" />
                                                    )}
                                                    <span className="text-[#B08D57]/85">{match.league}</span>
                                                </div>

                                                <div className="mt-2 space-y-1">
                                                    <div className="font-semibold text-[#F3EBDD]">
                                                        {match.homeTeam}
                                                    </div>
                                                    <div className="font-semibold text-[#D8CFC0]/80">
                                                        {match.awayTeam}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 1X2 */}
                                            <div className="col-span-12 sm:col-span-3 flex justify-center gap-2">
                                                {[
                                                    { label: "1", selection: match.homeTeam, value: match.odds.home },
                                                    { label: "X", selection: "Draw", value: match.odds.draw },
                                                    { label: "2", selection: match.awayTeam, value: match.odds.away },
                                                ].map((odd) => (
                                                    <button
                                                        key={odd.label}
                                                        onClick={() =>
                                                            addToBetSlip(
                                                                `${match.homeTeam} vs ${match.awayTeam}`,
                                                                odd.selection,
                                                                odd.value,
                                                            )
                                                        }
                                                        className={`min-w-[70px] rounded-xl px-3 py-2 transition border border-[#B08D57]/35 bg-[#0A0E0C]/20 hover:border-[#C2A14D]/55 hover:bg-[#0A0E0C]/30`}
                                                    >
                                                        <div className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/80">
                                                            {odd.label}
                                                        </div>
                                                        <div className="mt-1 font-semibold text-[#F3EBDD]">
                                                            {formatOdds(odd.value)}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* O/U */}
                                            <div className="col-span-12 sm:col-span-2 flex justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        addToBetSlip(
                                                            `${match.homeTeam} vs ${match.awayTeam}`,
                                                            "Over 2.5",
                                                            match.overUnder.over,
                                                        )
                                                    }
                                                    className="min-w-[78px] rounded-xl px-3 py-2 transition border border-[#B08D57]/35 bg-[#0A0E0C]/20 hover:border-[#C2A14D]/55 hover:bg-[#0A0E0C]/30"
                                                >
                                                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/80">
                                                        O
                                                    </div>
                                                    <div className="mt-1 font-semibold text-[#F3EBDD]">
                                                        {formatOdds(match.overUnder.over)}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        addToBetSlip(
                                                            `${match.homeTeam} vs ${match.awayTeam}`,
                                                            "Under 2.5",
                                                            match.overUnder.under,
                                                        )
                                                    }
                                                    className="min-w-[78px] rounded-xl px-3 py-2 transition border border-[#B08D57]/35 bg-[#0A0E0C]/20 hover:border-[#C2A14D]/55 hover:bg-[#0A0E0C]/30"
                                                >
                                                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/80">
                                                        U
                                                    </div>
                                                    <div className="mt-1 font-semibold text-[#F3EBDD]">
                                                        {formatOdds(match.overUnder.under)}
                                                    </div>
                                                </button>
                                            </div>

                                            {/* Score */}
                                            <div className="col-span-6 sm:col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B08D57]/25 bg-[#0A0E0C]/18 px-3 py-2 text-sm font-semibold text-[#F3EBDD]">
                                                    <span>{match.homeScore}</span>
                                                    <span className="text-[#B08D57]/50">–</span>
                                                    <span>{match.awayScore}</span>
                                                </span>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-6 sm:col-span-2 text-center">
                                                <span
                                                    className={[
                                                        "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.28em]",
                                                        match.status === "LIVE"
                                                            ? "border border-[#C2A14D]/60 bg-[#C2A14D]/15 text-[#F3EBDD]"
                                                            : "border border-[#B08D57]/35 bg-[#0A0E0C]/18 text-[#D8CFC0]/70",
                                                    ].join(" ")}
                                                >
                                                    {match.status === "LIVE" && (
                                                        <span className="inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_14px_rgba(194,161,77,0.45)]" />
                                                    )}
                                                    {match.time}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                <div className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/45">
                                    Settlement: chainlink • cronos
                                </div>
                                <Link
                                    href={"/prediction" as Route}
                                    className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/55 hover:text-[#C2A14D] transition-colors"
                                >
                                    Go to prediction markets →
                                </Link>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total volume", value: "$2.4M", note: "+12% week" },
                                { label: "Active bets", value: "8,432", note: "+5% week" },
                                { label: "Avg settlement", value: "0.8s", note: "faster" },
                                { label: "Oracle updates", value: "1.2K/min", note: "real-time" },
                            ].map((stat) => (
                                <div key={stat.label} className={`${panelClass} p-5`}>
                                    {panelInnerBorder}
                                    <div className="text-[11px] tracking-[0.32em] uppercase text-[#B08D57]/80">
                                        {stat.label}
                                    </div>
                                    <div className="mt-2 font-serif text-2xl tracking-[0.10em] text-[#F3EBDD]">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/50">
                                        {stat.note}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Bet slip */}
                    <aside className="xl:col-span-3">
                        <div className={`${panelClass} p-5 xl:sticky xl:top-6`}>
                            {panelInnerBorder}

                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <div className="text-[11px] tracking-[0.48em] uppercase text-[#B08D57]/85">
                                        Bet slip
                                    </div>
                                    <div className="mt-1 font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                        Quiet stack
                                    </div>
                                </div>

                                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#B08D57]/35 bg-[#0A0E0C]/20 px-3 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/70">
                                    {betSlip.length}
                                </span>
                            </div>

                            <div className="mt-5 rounded-2xl border border-[#B08D57]/30 bg-[#0A0E0C]/18 overflow-hidden">
                                {betSlip.length === 0 ? (
                                    <div className="px-5 py-10 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B08D57]/30 bg-[#0A0E0C]/20 text-2xl">
                                            🎯
                                        </div>
                                        <div className="text-sm font-semibold text-[#F3EBDD]">
                                            No selections yet
                                        </div>
                                        <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/50">
                                            Tap odds to add
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="max-h-[340px] overflow-y-auto p-4 space-y-3">
                                            {betSlip.map((bet, index) => (
                                                <div
                                                    key={`${bet.match}-${bet.selection}-${index}`}
                                                    className="rounded-2xl border border-[#B08D57]/25 bg-[#0A0E0C]/18 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                                                {bet.match}
                                                            </div>
                                                            <div className="mt-1 font-semibold text-[#F3EBDD]">
                                                                {bet.selection}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => removeBet(index)}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#B08D57]/25 bg-[#0A0E0C]/15 text-[#D8CFC0]/70 hover:text-[#C2A14D] hover:border-[#C2A14D]/45 transition"
                                                            aria-label="Remove bet"
                                                            title="Remove"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-[11px] tracking-[0.22em] uppercase text-[#B08D57]/70">
                                                            Odds
                                                        </span>
                                                        <span className="font-serif text-lg tracking-[0.08em] text-[#F3EBDD]">
                                                            {formatOdds(bet.odds)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#B08D57]/20 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/55">
                                                    Total odds
                                                </span>
                                                <span className="font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                                    {formatOdds(totalOdds)}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/55">
                                                    Stake (CRO)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0.01"
                                                    defaultValue="0.01"
                                                    step="0.01"
                                                    min="0.01"
                                                    className="mt-2 w-full rounded-2xl border border-[#B08D57]/30 bg-[#0A0E0C]/20 px-4 py-3 text-sm text-[#F3EBDD] outline-none placeholder:text-[#D8CFC0]/30 focus:border-[#C2A14D]/55"
                                                />
                                            </div>

                                            <button
                                                className={`mt-4 w-full rounded-2xl px-5 py-4 text-xs uppercase tracking-[0.35em] text-[#F3EBDD]
border border-[#B08D57]/70
bg-[linear-gradient(180deg,rgba(194,161,77,0.16),rgba(176,141,87,0.06))]
shadow-[0_18px_55px_rgba(0,0,0,0.55)]
transition hover:border-[#C2A14D]/90 hover:shadow-[0_18px_75px_rgba(0,0,0,0.70)]`}
                                            >
                                                Place bet
                                            </button>

                                            <div className="mt-4 text-center text-[11px] italic text-[#D8CFC0]/35">
                                                Keep it neat. Keep it quiet.
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Featured match (kept, re-skinned) */}
                            <div className="mt-6 rounded-3xl border border-[#B08D57]/40 bg-[#0A0E0C]/18 p-5">
                                <div className="text-[11px] tracking-[0.48em] uppercase text-[#B08D57]/85 text-center">
                                    Featured match
                                </div>
                                <div className="mt-3 text-center font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                    Champions League Final
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🔴</div>
                                        <div className="text-sm font-semibold text-[#F3EBDD]">
                                            Liverpool
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-[#B08D57]/30 bg-[#0A0E0C]/18 px-3 py-2 text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/70">
                                        vs
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">⚪</div>
                                        <div className="text-sm font-semibold text-[#F3EBDD]">
                                            Real Madrid
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                    Sat, Jun 1 • 21:00 CET
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Mobile time/date (only shows when header line is hidden) */}
                <div className="mt-6 md:hidden text-center text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/45">
                    {currentDate} • {currentTime}
                </div>
            </div>

            {/* Local CSS for texture/lines */}
            <style jsx>{`
        .wallpaper {
          background-image:
            radial-gradient(circle at 25% 20%, rgba(194,161,77,0.06), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(15,92,74,0.07), transparent 60%),
            radial-gradient(circle at 40% 85%, rgba(90,31,43,0.05), transparent 60%);
          filter: blur(0.2px);
        }

        .deco-lines {
          background-image:
            linear-gradient(to right, rgba(176,141,87,0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(176,141,87,0.14) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 72%);
        }
      `}</style>
        </main>
    )
}
