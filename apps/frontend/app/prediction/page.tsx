"use client"

import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

// ============================================================================
// TYPES
// ============================================================================

type MarketStatus = "active" | "closed" | "resolved"

interface Market {
    id: string
    slug: string
    question: string
    shortTitle: string
    odds: number
    pool: number
    status: MarketStatus
    category: string
    icon: string
    yesPercent: number
    noPercent: number
    endsIn: string
}

interface ScoreboardData {
    teamA: { name: string; score: number; shots: number }
    teamB: { name: string; score: number; shots: number }
    time: string
    possession: number
    isLive: boolean
}

// ============================================================================
// MARKET DATA
// ============================================================================

const MARKETS: Market[] = [
    {
        id: "Eden Haus-hackathon",
        slug: "markets",
        question: "Will Eden Haus win the Cronos x402 Hackathon?",
        shortTitle: "Eden Haus Hackathon Win",
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
]

const SCOREBOARD: ScoreboardData = {
    teamA: { name: "Team A", score: 1, shots: 5 },
    teamB: { name: "Team B", score: 0, shots: 3 },
    time: "45:23",
    possession: 55,
    isLive: true,
}

const navItems: { name: string; path: Route }[] = [
    { name: "Home", path: "/" as Route },
    { name: "Sports", path: "/sports" as Route },
    { name: "Esports", path: "/esports" as Route },
    { name: "Casino", path: "/casino" as Route },
    { name: "Prediction", path: "/prediction" as Route },
]

function formatOdds(n: number) {
    return n.toFixed(2)
}

function formatCurrency(n: number) {
    return "$" + n.toLocaleString("en-US")
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Scoreboard({ data }: { data: ScoreboardData }) {
    const pillBase =
        "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.28em] border"

    return (
        <div className="rounded-2xl border border-[#B08D57]/25 bg-[#0A0E0C]/12 overflow-hidden">
            <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] tracking-[0.34em] uppercase text-[#B08D57]/80">
                        Live board
                    </div>
                    <span
                        className={[
                            pillBase,
                            data.isLive
                                ? "border-[#C2A14D]/45 bg-[#C2A14D]/10 text-[#F3EBDD]"
                                : "border-[#B08D57]/22 bg-[#0A0E0C]/10 text-[#D8CFC0]/60",
                        ].join(" ")}
                    >
                        {data.time}
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-3 items-center gap-4">
                    <div className="text-left">
                        <div className="text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                            {data.teamA.name}
                        </div>
                        <div className="mt-2 font-serif text-4xl tracking-[0.10em] text-[#F3EBDD]">
                            {data.teamA.score}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-[11px] tracking-[0.22em] uppercase text-[#B08D57]/70">
                            Possession
                        </div>
                        <div className="mt-2 font-serif text-2xl tracking-[0.10em] text-[#F3EBDD]">
                            {data.possession}%
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                            {data.teamB.name}
                        </div>
                        <div className="mt-2 font-serif text-4xl tracking-[0.10em] text-[#F3EBDD]">
                            {data.teamB.score}
                        </div>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                    {[{ label: "Shots", value: data.teamA.shots }, { label: "Poss%", value: data.possession + "%" }, { label: "Shots", value: data.teamB.shots }].map(
                        (stat, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-[#B08D57]/18 bg-[#0A0E0C]/10 px-4 py-3 text-center"
                            >
                                <div className="text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                    {stat.label}
                                </div>
                                <div className="mt-1 font-semibold text-[#F3EBDD]">
                                    {stat.value}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>

            <div className="border-t border-[#B08D57]/16 px-5 py-4">
                <div className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/40">
                    Real-time micro-betting • sub-second settlement
                </div>
            </div>
        </div>
    )
}

function MarketCard({
    market,
    onToggle,
    expanded,
    addSelection,
}: {
    market: Market
    expanded: boolean
    onToggle: () => void
    addSelection: (market: Market, side: "YES" | "NO", price: number) => void
}) {
    const pillBase =
        "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.28em] border"

    const buttonBase =
        "rounded-xl border border-[#B08D57]/28 bg-[#0A0E0C]/14 hover:bg-[#0A0E0C]/24 hover:border-[#C2A14D]/45 transition"

    const featured = market.id === "Eden Haus-hackathon"

    // Lightweight "price" mapping from yes/no split
    const yesPrice = market.yesPercent / 100
    const noPrice = market.noPercent / 100

    return (
        <div
            className={[
                "rounded-2xl border bg-[#0A0E0C]/12 transition",
                expanded
                    ? "border-[#C2A14D]/45"
                    : "border-[#B08D57]/22 hover:border-[#C2A14D]/35",
            ].join(" ")}
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full text-left px-4 py-4"
                aria-expanded={expanded}
                aria-controls={`market-${market.id}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xl opacity-90">{market.icon}</span>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/75">
                                {market.category}
                            </span>
                            {featured && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#C2A14D]/35 bg-[#C2A14D]/10 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-[#F3EBDD]">
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_16px_rgba(194,161,77,0.45)]" />
                                    Featured
                                </span>
                            )}
                        </div>

                        <div className="mt-3 font-semibold text-[#F3EBDD]">
                            {market.question}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                                className={[
                                    pillBase,
                                    "border-[#B08D57]/22 bg-[#0A0E0C]/10 text-[#D8CFC0]/60",
                                ].join(" ")}
                            >
                                Pool: {formatCurrency(market.pool)}
                            </span>
                            <span
                                className={[
                                    pillBase,
                                    "border-[#B08D57]/22 bg-[#0A0E0C]/10 text-[#D8CFC0]/60",
                                ].join(" ")}
                            >
                                Ends in {market.endsIn}
                            </span>
                            <span
                                className={[
                                    pillBase,
                                    market.status === "active"
                                        ? "border-[#C2A14D]/45 bg-[#C2A14D]/10 text-[#F3EBDD]"
                                        : "border-[#B08D57]/22 bg-[#0A0E0C]/10 text-[#D8CFC0]/60",
                                ].join(" ")}
                            >
                                {market.status}
                            </span>
                        </div>

                        <div className="mt-4 h-1.5 rounded-full overflow-hidden flex">
                            <div
                                className="bg-[linear-gradient(90deg,rgba(194,161,77,0.95),rgba(176,141,87,0.55))]"
                                style={{ width: `${market.yesPercent}%` }}
                            />
                            <div
                                className="bg-[linear-gradient(90deg,rgba(216,207,192,0.18),rgba(10,14,12,0.30))]"
                                style={{ width: `${market.noPercent}%` }}
                            />
                        </div>

                        <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                            Yes {market.yesPercent}% • No {market.noPercent}%
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-2">
                        <span className="text-[11px] tracking-[0.28em] uppercase text-[#D8CFC0]/45">
                            {expanded ? "Close" : "Open"}
                        </span>
                        <span
                            className={[
                                "inline-flex items-center justify-center h-10 w-10 rounded-full border transition",
                                expanded
                                    ? "border-[#C2A14D]/55 bg-[#C2A14D]/10 text-[#F3EBDD]"
                                    : "border-[#B08D57]/22 bg-[#0A0E0C]/10 text-[#D8CFC0]/60",
                            ].join(" ")}
                        >
                            {expanded ? "−" : "+"}
                        </span>
                    </div>
                </div>
            </button>

            {expanded && (
                <div id={`market-${market.id}`} className="px-4 pb-4 pt-0">
                    <div className="rounded-2xl border border-[#B08D57]/18 bg-[#0A0E0C]/10 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-[11px] tracking-[0.34em] uppercase text-[#B08D57]/80">
                                Trade
                            </div>
                            <div className="text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/50">
                                Tap to add
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                onClick={() => addSelection(market, "YES", yesPrice)}
                                className={`w-full px-4 py-3 text-left ${buttonBase}`}
                            >
                                <div className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/70">
                                    YES
                                </div>
                                <div className="mt-1 font-semibold text-[#F3EBDD]">
                                    {formatOdds(yesPrice)}
                                </div>
                            </button>

                            <button
                                onClick={() => addSelection(market, "NO", noPrice)}
                                className={`w-full px-4 py-3 text-left ${buttonBase}`}
                            >
                                <div className="text-[11px] uppercase tracking-[0.28em] text-[#B08D57]/70">
                                    NO
                                </div>
                                <div className="mt-1 font-semibold text-[#F3EBDD]">
                                    {formatOdds(noPrice)}
                                </div>
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <Link
                                href={`/prediction/${market.slug}`}
                                className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/50 hover:text-[#C2A14D] transition-colors"
                            >
                                Details →
                            </Link>

                            <button
                                type="button"
                                onClick={onToggle}
                                className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/50 hover:text-[#C2A14D] transition-colors"
                            >
                                Collapse →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PredictionPage() {
    const pathname = usePathname()

    const [currentTime, setCurrentTime] = useState("")
    const [currentDate, setCurrentDate] = useState("")

    const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null)

    const [tradeSlip, setTradeSlip] = useState<
        { market: string; side: "YES" | "NO"; price: number }[]
    >([])

    const [scoreboardTime, setScoreboardTime] = useState(SCOREBOARD.time)

    // Update time and date
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

    // Simulate live timer for scoreboard
    useEffect(() => {
        const interval = setInterval(() => {
            const [mins, secs] = scoreboardTime.split(":").map(Number)
            const totalSecs = mins * 60 + secs + 1
            const newMins = Math.floor(totalSecs / 60)
            const newSecs = totalSecs % 60
            setScoreboardTime(`${newMins}:${newSecs.toString().padStart(2, "0")}`)
        }, 1000)

        return () => clearInterval(interval)
    }, [scoreboardTime])

    const activeNav = (href: string) => pathname === href

    const addSelection = (market: Market, side: "YES" | "NO", price: number) => {
        setTradeSlip((prev) => [
            ...prev,
            { market: market.shortTitle, side, price },
        ])
    }

    const removeSelection = (index: number) => {
        setTradeSlip((prev) => prev.filter((_, i) => i !== index))
    }

    const avgPrice = useMemo(() => {
        if (tradeSlip.length === 0) return 0
        return tradeSlip.reduce((acc, t) => acc + t.price, 0) / tradeSlip.length
    }, [tradeSlip])

    // Design tokens (keep local, consistent with Sports)
    const panelClass =
        "relative rounded-3xl bg-[linear-gradient(135deg,rgba(10,14,12,0.55),rgba(10,14,12,0.22))] backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-[#B08D57]/12 border border-[#B08D57]/45"

    const innerBorder = (
        <div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/16" />
    )

    const subtleLabel =
        "text-[11px] tracking-[0.34em] uppercase text-[#B08D57]/80"

    const subtleText =
        "text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/50"

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Eden Haus atmosphere (match Sports) */}
            <div className="absolute inset-0 bg-[#1F3D2B]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.65),rgba(10,14,12,0.92))]" />
            <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light wallpaper" />
            <div className="absolute inset-0 opacity-[0.10] deco-lines" />

            <div className="relative z-10 px-4 md:px-8 py-10">
                {/* Header (match Sports) */}
                <header className={`${panelClass} px-6 py-5`}>
                    {innerBorder}

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="min-w-0">
                            <Link href={("/" as Route)} className="group inline-block">
                                <div className="flex items-baseline gap-3">
                                    <span className="font-serif text-2xl md:text-3xl tracking-[0.12em] text-[#F3EBDD] drop-shadow-[0_10px_25px_rgba(0,0,0,0.55)]">
                                        Eden Haus
                                    </span>
                                    <span className="hidden sm:inline text-[11px] tracking-[0.45em] uppercase text-[#B08D57]/80">
                                        Members Only
                                    </span>
                                </div>
                                <div className="mt-1 text-[11px] tracking-[0.34em] uppercase text-[#D8CFC0]/50 group-hover:text-[#C2A14D]/80 transition-colors">
                                    Quiet Confidence • Reliable Odds
                                </div>
                            </Link>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 border border-[#B08D57]/30 bg-[#0A0E0C]/14">
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#C2A14D] shadow-[0_0_18px_rgba(194,161,77,0.40)]" />
                                    <span className="text-[11px] tracking-[0.28em] uppercase text-[#D8CFC0]/70">
                                        {MARKETS.length} markets
                                    </span>
                                </div>

                                <div className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-2 border border-[#B08D57]/25 bg-[#0A0E0C]/12">
                                    <span className="text-[#C2A14D]/75">⏱</span>
                                    <span className="text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/60">
                                        {currentDate} • {currentTime}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <nav className="flex flex-wrap items-center gap-2">
                            {navItems.map((item) => {
                                const isActive = activeNav(item.path as string)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className={[
                                            "relative rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] transition border",
                                            isActive
                                                ? "border-[#C2A14D]/65 text-[#F3EBDD] bg-[linear-gradient(180deg,rgba(194,161,77,0.16),rgba(176,141,87,0.05))]"
                                                : "border-[#B08D57]/30 text-[#D8CFC0]/65 bg-[#0A0E0C]/10 hover:text-[#F3EBDD] hover:border-[#C2A14D]/45",
                                        ].join(" ")}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </header>

                {/* Layout */}
                <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Markets */}
                    <section className="xl:col-span-8">
                        <div className={`${panelClass} p-5`}>
                            {innerBorder}

                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className={subtleLabel}>Prediction</div>
                                    <div className="mt-1 font-serif text-2xl tracking-[0.10em] text-[#F3EBDD]">
                                        Active markets
                                    </div>
                                </div>

                                <div className="hidden md:block text-right">
                                    <div className={subtleText}>Tap a market</div>
                                    <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/55">
                                        Expand to trade
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {MARKETS.map((market) => (
                                    <MarketCard
                                        key={market.id}
                                        market={market}
                                        expanded={expandedMarketId === market.id}
                                        onToggle={() =>
                                            setExpandedMarketId((prev) =>
                                                prev === market.id ? null : market.id,
                                            )
                                        }
                                        addSelection={addSelection}
                                    />
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-3">
                                <div className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/40">
                                    Settlement: chainlink • cronos
                                </div>

                                <Link
                                    href={("/prediction/all" as Route)}
                                    className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/50 hover:text-[#C2A14D] transition-colors"
                                >
                                    View all →
                                </Link>
                            </div>
                        </div>

                        {/* Stats row (match Sports style) */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total volume", value: "$9.85K", note: "demo" },
                                { label: "Active markets", value: String(MARKETS.length), note: "live" },
                                { label: "Total bets", value: "142", note: "demo" },
                                { label: "Unique traders", value: "89", note: "demo" },
                            ].map((stat) => (
                                <div key={stat.label} className={`${panelClass} p-5`}>
                                    {innerBorder}
                                    <div className={subtleLabel}>{stat.label}</div>
                                    <div className="mt-2 font-serif text-2xl tracking-[0.10em] text-[#F3EBDD]">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                        {stat.note}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* How it works (clean + Eden Haus) */}
                        <div className={`mt-6 ${panelClass} p-5`}>
                            {innerBorder}

                            <div>
                                <div className={subtleLabel}>How it works</div>
                                <div className="mt-1 font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                    Trade a conviction
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(
                                    [
                                        {
                                            step: "1",
                                            title: "Pick a market",
                                            desc: "Browse active markets and open the one you want.",
                                        },
                                        {
                                            step: "2",
                                            title: "Choose YES/NO",
                                            desc: "Select a side and add it to your trade slip.",
                                        },
                                        {
                                            step: "3",
                                            title: "Confirm",
                                            desc: "Connect wallet and execute when ready.",
                                        },
                                    ] as const
                                ).map((s) => (
                                    <div
                                        key={s.step}
                                        className="rounded-2xl border border-[#B08D57]/25 bg-[#0A0E0C]/12 p-5"
                                    >
                                        <div className={subtleLabel}>Step {s.step}</div>
                                        <div className="mt-2 font-semibold text-[#F3EBDD]">{s.title}</div>
                                        <div className="mt-2 text-sm text-[#D8CFC0]/60">{s.desc}</div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>

                    {/* Right rail */}
                    <aside className="xl:col-span-4">
                        <div className={`${panelClass} p-5 xl:sticky xl:top-6`}>
                            {innerBorder}

                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <div className={subtleLabel}>Trade slip</div>
                                    <div className="mt-1 font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                        Quiet stack
                                    </div>
                                </div>

                                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#B08D57]/25 bg-[#0A0E0C]/10 px-3 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/60">
                                    {tradeSlip.length}
                                </span>
                            </div>

                            <div className="mt-5 rounded-2xl border border-[#B08D57]/25 bg-[#0A0E0C]/12 overflow-hidden">
                                {tradeSlip.length === 0 ? (
                                    <div className="px-5 py-10 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B08D57]/22 bg-[#0A0E0C]/12 text-2xl opacity-90">
                                            🔮
                                        </div>
                                        <div className="text-sm font-semibold text-[#F3EBDD]">
                                            No positions yet
                                        </div>
                                        <div className="mt-2 text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                            Expand a market to trade
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="max-h-[340px] overflow-y-auto p-4 space-y-3">
                                            {tradeSlip.map((t, index) => (
                                                <div
                                                    key={`${t.market}-${t.side}-${index}`}
                                                    className="rounded-2xl border border-[#B08D57]/20 bg-[#0A0E0C]/10 p-4"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/45">
                                                                {t.market}
                                                            </div>
                                                            <div className="mt-1 font-semibold text-[#F3EBDD]">
                                                                {t.side}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => removeSelection(index)}
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#B08D57]/20 bg-[#0A0E0C]/10 text-[#D8CFC0]/60 hover:text-[#C2A14D] hover:border-[#C2A14D]/35 transition"
                                                            aria-label="Remove selection"
                                                            title="Remove"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-[11px] tracking-[0.22em] uppercase text-[#B08D57]/65">
                                                            Price
                                                        </span>
                                                        <span className="font-serif text-lg tracking-[0.08em] text-[#F3EBDD]">
                                                            {formatOdds(t.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#B08D57]/16 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/50">
                                                    Avg price
                                                </span>
                                                <span className="font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                                    {formatOdds(avgPrice)}
                                                </span>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/50">
                                                    Stake (CRO)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="0.01"
                                                    defaultValue="0.01"
                                                    step="0.01"
                                                    min="0.01"
                                                    className="mt-2 w-full rounded-2xl border border-[#B08D57]/25 bg-[#0A0E0C]/12 px-4 py-3 text-sm text-[#F3EBDD] outline-none placeholder:text-[#D8CFC0]/25 focus:border-[#C2A14D]/45"
                                                />
                                            </div>

                                            <button
                                                className="mt-4 w-full rounded-2xl px-5 py-4 text-xs uppercase tracking-[0.35em] text-[#F3EBDD] border border-[#B08D57]/60 bg-[linear-gradient(180deg,rgba(194,161,77,0.14),rgba(176,141,87,0.04))] shadow-[0_18px_55px_rgba(0,0,0,0.55)] transition hover:border-[#C2A14D]/80 hover:shadow-[0_18px_75px_rgba(0,0,0,0.70)]"
                                            >
                                                Place trade
                                            </button>

                                            <div className="mt-4 text-center text-[11px] italic text-[#D8CFC0]/32">
                                                Keep it neat. Keep it quiet.
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6">
                                <div className={subtleLabel}>Scoreboard</div>
                                <div className="mt-3">
                                    <Scoreboard data={{ ...SCOREBOARD, time: scoreboardTime }} />
                                </div>
                            </div>

                            <div className="mt-6 rounded-3xl border border-[#B08D57]/30 bg-[#0A0E0C]/10 p-5">
                                <div className="text-[11px] tracking-[0.48em] uppercase text-[#B08D57]/80 text-center">
                                    Featured
                                </div>

                                <div className="mt-3 text-center font-serif text-xl tracking-[0.10em] text-[#F3EBDD]">
                                    Eden Haus x402
                                </div>

                                <div className="mt-4 text-center text-[11px] tracking-[0.22em] uppercase text-[#D8CFC0]/40">
                                    On-chain markets • instant settlement
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="mt-6 sm:hidden text-center text-[11px] tracking-[0.32em] uppercase text-[#D8CFC0]/40">
                    {currentDate} • {currentTime}
                </div>
            </div>

            <style jsx>{`
                .wallpaper {
                    background-image:
                        radial-gradient(
                            circle at 25% 20%,
                            rgba(194, 161, 77, 0.06),
                            transparent 55%
                        ),
                        radial-gradient(
                            circle at 70% 60%,
                            rgba(15, 92, 74, 0.07),
                            transparent 60%
                        ),
                        radial-gradient(
                            circle at 40% 85%,
                            rgba(90, 31, 43, 0.05),
                            transparent 60%
                        );
                    filter: blur(0.2px);
                }

                .deco-lines {
                    background-image:
                        linear-gradient(
                            to right,
                            rgba(176, 141, 87, 0.2) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            to bottom,
                            rgba(176, 141, 87, 0.12) 1px,
                            transparent 1px
                        );
                    background-size: 140px 140px;
                    mask-image: radial-gradient(
                        circle at 50% 40%,
                        black 0%,
                        transparent 74%
                    );
                }
            `}</style>
        </main>
    )
}
