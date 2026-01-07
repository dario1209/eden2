"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// Esports games data
const esportsGames = [
    { icon: "🔫", name: "CS2", count: 67 },
    { icon: "⚔️", name: "League of Legends", count: 45 },
    { icon: "🐉", name: "Dota 2", count: 32 },
    { icon: "🎯", name: "Valorant", count: 28 },
    { icon: "🚀", name: "Rocket League", count: 19 },
    { icon: "🎮", name: "Fortnite", count: 24 },
];

const esportsMatches = [
    {
        id: 1,
        league: "BLAST Premier",
        homeTeam: "NaVi",
        awayTeam: "FaZe Clan",
        homeScore: 14,
        awayScore: 12,
        time: "Map 2",
        status: "LIVE",
        odds: { home: 1.35, away: 3.1 },
        overUnder: { over: 1.9, under: 1.9 },
    },
    {
        id: 2,
        league: "LCS Winter",
        homeTeam: "Cloud9",
        awayTeam: "Team Liquid",
        homeScore: 1,
        awayScore: 0,
        time: "23:45",
        status: "LIVE",
        odds: { home: 2.25, away: 1.65 },
        overUnder: { over: 1.85, under: 1.95 },
    },
    {
        id: 3,
        league: "DPC SA",
        homeTeam: "Evil Geniuses",
        awayTeam: "Team Spirit",
        homeScore: 28,
        awayScore: 25,
        time: "38:12",
        status: "LIVE",
        odds: { home: 1.8, away: 2.0 },
        overUnder: { over: 1.75, under: 2.05 },
    },
    {
        id: 4,
        league: "VCT Americas",
        homeTeam: "Sentinels",
        awayTeam: "100 Thieves",
        homeScore: 8,
        awayScore: 6,
        time: "Round 12",
        status: "LIVE",
        odds: { home: 1.95, away: 1.85 },
        overUnder: { over: 1.88, under: 1.92 },
    },
    {
        id: 5,
        league: "RLCS Major",
        homeTeam: "G2 Esports",
        awayTeam: "Team BDS",
        homeScore: 0,
        awayScore: 0,
        time: "19:00",
        status: "UPCOMING",
        odds: { home: 1.72, away: 2.15 },
        overUnder: { over: 1.8, under: 2.0 },
    },
];

const navItems: { name: string; path: Route }[] = [
    { name: "Home", path: "/" as Route },
    { name: "Sports", path: "/sports" as Route },
    { name: "Esports", path: "/esports" as Route },
    { name: "Casino", path: "/casino" as Route },
    { name: "Prediction", path: "/prediction" as Route },
];

export default function EsportsPage() {
    const pathname = usePathname();
    const [selectedEsport, setSelectedEsport] = useState("CS2");
    const [betSlip, setBetSlip] = useState<{ match: string; selection: string; odds: number }[]>([]);
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [viewerCount, setViewerCount] = useState(247892);

    // Accordion state (prevents score/status overlap by revealing details vertically)
    const [expandedMatchId, setExpandedMatchId] = useState<number | null>(esportsMatches[0]?.id ?? null);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })
            );
            setCurrentDate(
                now.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate viewer count fluctuation
    useEffect(() => {
        const viewerTimer = setInterval(() => {
            setViewerCount((prev) => prev + Math.floor(Math.random() * 100) - 50);
        }, 2000);
        return () => clearInterval(viewerTimer);
    }, []);

    const addToBetSlip = (match: string, selection: string, odds: number) => {
        setBetSlip((prev) => [...prev, { match, selection, odds }]);
    };

    const removeBet = (index: number) => {
        setBetSlip((prev) => prev.filter((_, i) => i !== index));
    };

    const liveCount = useMemo(() => esportsMatches.filter((m) => m.status === "LIVE").length, []);
    const totalOdds = useMemo(() => betSlip.reduce((acc, bet) => acc * bet.odds, 1), [betSlip]);

    const isActiveNav = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname?.startsWith(path);
    };

    const panelClass =
        "relative rounded-3xl bg-[linear-gradient(135deg,rgba(10,14,12,0.55),rgba(10,14,12,0.22))] " +
        "backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.55)] ring-1 ring-[#B08D57]/12 border border-[#B08D57]/45";

    const innerBorder = (
        <div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/16" />
    );

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Eden Haus background */}
            <div className="absolute inset-0 bg-[#1F3D2B]" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.65),rgba(10,14,12,0.92))]" />
            <div className="absolute inset-0 opacity-10 mix-blend-soft-light eh-wallpaper" />
            <div className="absolute inset-0 opacity-10 eh-decoLines" />

            <div className="relative z-10 px-4 md:px-8 py-10">
                {/* Header panel */}
                <header className={`${panelClass} px-6 py-5`}>
                    {innerBorder}

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="min-w-0">
                            <Link href={"/" as Route} className="group inline-block">
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
                                        {liveCount} live • {viewerCount.toLocaleString()} watching
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
                                const isActive = isActiveNav(item.path as string);
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
                                );
                            })}
                        </nav>
                    </div>
                </header>

                <main className="eh-main">
                    <div className="eh-layout">
                        {/* Games sidebar */}
                        <aside className="eh-side">
                            <div className="eh-card">
                                <div className="eh-card__pad">
                                    <div className="eh-miniTitle">Games</div>
                                    <div className="eh-games">
                                        {esportsGames.map((game) => {
                                            const active = selectedEsport === game.name;
                                            return (
                                                <button
                                                    key={game.name}
                                                    onClick={() => setSelectedEsport(game.name)}
                                                    className={active ? "eh-game eh-game--active" : "eh-game"}
                                                    type="button"
                                                >
                                                    <span className="eh-game__icon">{game.icon}</span>
                                                    <span className="eh-game__name">{game.name}</span>
                                                    <span className="eh-game__count">{game.count > 99 ? "99+" : game.count}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="eh-card">
                                <div className="eh-card__pad">
                                    <div className="eh-miniTitle">Spotlight</div>
                                    <div className="eh-spot">
                                        <div className="eh-spot__k">THE INTERNATIONAL 2024</div>
                                        <div className="eh-spot__teams">
                                            <div className="eh-spot__team">
                                                <div className="eh-spot__icon">🐉</div>
                                                <div className="eh-spot__name">Team Spirit</div>
                                            </div>
                                            <div className="eh-spot__vs">VS</div>
                                            <div className="eh-spot__team">
                                                <div className="eh-spot__icon">⚔️</div>
                                                <div className="eh-spot__name">Gaimin Gladiators</div>
                                            </div>
                                        </div>
                                        <div className="eh-spot__prize">$15,000,000</div>
                                        <div className="eh-spot__sub">Grand Finals • Tomorrow 18:00 CET</div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Matches */}
                        <section className="eh-center">
                            <div className="eh-card">
                                <div className="eh-card__pad">
                                    <div className="eh-headRow">
                                        <div>
                                            <div className="eh-miniTitle">Live matches</div>
                                            <div className="eh-subtle">Tap a match to expand • {selectedEsport}</div>
                                        </div>
                                        <div className="eh-pill">
                                            <span className="eh-dot" />
                                            {esportsMatches.length} matches
                                        </div>
                                    </div>

                                    {/* Desktop header row */}
                                    <div className="eh-tableHead">
                                        <div>Match</div>
                                        <div className="text-center">Winner</div>
                                        <div className="text-center">O/U</div>
                                        <div className="text-center">Score</div>
                                        <div className="text-center">Status</div>
                                    </div>

                                    {/* Accordion list */}
                                    <div className="eh-acc">
                                        {esportsMatches.map((match) => {
                                            const isExpanded = expandedMatchId === match.id;
                                            return (
                                                <div key={match.id} className={isExpanded ? "eh-rowAcc eh-rowAcc--open" : "eh-rowAcc"}>
                                                    {/* Summary row (mobile + desktop safe) */}
                                                    <button
                                                        type="button"
                                                        className="eh-rowAcc__summary"
                                                        onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                                                    >
                                                        <div className="eh-rowAcc__left">
                                                            <div className="eh-league">
                                                                {match.status === "LIVE" ? <span className="eh-liveDot" /> : null}
                                                                {match.league}
                                                            </div>

                                                            <div className="eh-teams">
                                                                <div className="eh-team">{match.homeTeam}</div>
                                                                <div className="eh-team eh-team--muted">{match.awayTeam}</div>
                                                            </div>
                                                        </div>

                                                        <div className="eh-rowAcc__right">
                                                            <div className="eh-score">
                                                                <span>{match.homeScore}</span>
                                                                <span className="eh-score__sep">-</span>
                                                                <span>{match.awayScore}</span>
                                                            </div>

                                                            <span className={match.status === "LIVE" ? "eh-status eh-status--live" : "eh-status"}>
                                                                {match.time}
                                                            </span>

                                                            <span className="eh-rowAcc__chev" aria-hidden="true">
                                                                {isExpanded ? "−" : "+"}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    {/* Expanded details */}
                                                    {isExpanded ? (
                                                        <div className="eh-rowAcc__details">
                                                            <div className="eh-rowAcc__grid">
                                                                <div className="eh-detailBlock">
                                                                    <div className="eh-detailBlock__k">Winner</div>
                                                                    <div className="eh-oddsBtns">
                                                                        <button
                                                                            type="button"
                                                                            className="eh-oddBtn"
                                                                            onClick={() =>
                                                                                addToBetSlip(
                                                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                                                    match.homeTeam,
                                                                                    match.odds.home
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="eh-oddBtn__k">1</div>
                                                                            <div className="eh-oddBtn__v">{match.odds.home.toFixed(2)}</div>
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="eh-oddBtn"
                                                                            onClick={() =>
                                                                                addToBetSlip(
                                                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                                                    match.awayTeam,
                                                                                    match.odds.away
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="eh-oddBtn__k">2</div>
                                                                            <div className="eh-oddBtn__v">{match.odds.away.toFixed(2)}</div>
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="eh-detailBlock">
                                                                    <div className="eh-detailBlock__k">Over / Under</div>
                                                                    <div className="eh-oddsBtns">
                                                                        <button
                                                                            type="button"
                                                                            className="eh-oddBtn eh-oddBtn--soft"
                                                                            onClick={() =>
                                                                                addToBetSlip(
                                                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                                                    "Over",
                                                                                    match.overUnder.over
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="eh-oddBtn__k">O</div>
                                                                            <div className="eh-oddBtn__v">{match.overUnder.over.toFixed(2)}</div>
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            className="eh-oddBtn eh-oddBtn--soft"
                                                                            onClick={() =>
                                                                                addToBetSlip(
                                                                                    `${match.homeTeam} vs ${match.awayTeam}`,
                                                                                    "Under",
                                                                                    match.overUnder.under
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="eh-oddBtn__k">U</div>
                                                                            <div className="eh-oddBtn__v">{match.overUnder.under.toFixed(2)}</div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="eh-rowAcc__meta">
                                                                <div className="eh-metaPill">
                                                                    <span className="eh-metaPill__k">Score</span>
                                                                    <span className="eh-metaPill__v">
                                                                        {match.homeScore}-{match.awayScore}
                                                                    </span>
                                                                </div>
                                                                <div className="eh-metaPill">
                                                                    <span className="eh-metaPill__k">Status</span>
                                                                    <span className="eh-metaPill__v">{match.status}</span>
                                                                </div>
                                                                <div className="eh-metaPill">
                                                                    <span className="eh-metaPill__k">Time</span>
                                                                    <span className="eh-metaPill__v">{match.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="eh-statsGrid">
                                {[
                                    { label: "Prize pool", value: "$1.2M", change: "+28%" },
                                    { label: "Live viewers", value: "247K", change: "+15%" },
                                    { label: "Avg bet", value: "$42", change: "+8%" },
                                    { label: "Settlement", value: "0.3s", change: "-22%" },
                                ].map((stat) => (
                                    <div key={stat.label} className="eh-card">
                                        <div className="eh-card__pad">
                                            <div className="eh-stat__k">{stat.label}</div>
                                            <div className="eh-stat__v">{stat.value}</div>
                                            <div className="eh-stat__sub">{stat.change} today</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Bet slip */}
                        <aside className="eh-right">
                            <div className="eh-card eh-sticky">
                                <div className="eh-card__pad">
                                    <div className="eh-headRow">
                                        <div>
                                            <div className="eh-miniTitle">Bet slip</div>
                                            <div className="eh-subtle">Selections • {betSlip.length}</div>
                                        </div>
                                        <div className="eh-pill">
                                            <span className="eh-dot" />
                                            Ready
                                        </div>
                                    </div>

                                    {betSlip.length === 0 ? (
                                        <div className="eh-empty">
                                            <div className="eh-empty__k">No bets placed yet</div>
                                            <div className="eh-empty__sub">Click odds to add selections.</div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="eh-slipList">
                                                {betSlip.map((bet, index) => (
                                                    <div key={index} className="eh-slipItem">
                                                        <div className="eh-slipItem__top">
                                                            <div className="min-w-0">
                                                                <div className="eh-slipItem__match">{bet.match}</div>
                                                                <div className="eh-slipItem__sel">{bet.selection}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeBet(index)}
                                                                className="eh-x"
                                                                type="button"
                                                                aria-label="Remove bet"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                        <div className="eh-slipItem__odds">{bet.odds.toFixed(2)}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="eh-slipTotals">
                                                <div className="eh-slipTotals__row">
                                                    <span>Total odds</span>
                                                    <span className="eh-gold">{totalOdds.toFixed(2)}</span>
                                                </div>

                                                <input
                                                    type="number"
                                                    placeholder="Stake (CRO)"
                                                    className="eh-input"
                                                    defaultValue="0.01"
                                                    step="0.01"
                                                    min="0.01"
                                                />

                                                <button className="eh-action" type="button">
                                                    Place bet
                                                </button>

                                                <div className="eh-fineprint">Demo UI • Wallet + settlement wiring next</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>

            <style jsx global>{`
        .eh-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 18px 0 56px;
        }

        .eh-layout {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        @media (min-width: 1024px) {
          .eh-layout {
            grid-template-columns: 300px 1fr 360px;
            align-items: start;
          }
        }

        .eh-card {
          background: rgba(10, 14, 12, 0.22);
          border: 1px solid rgba(176, 141, 87, 0.22);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
          overflow: hidden;
        }

        .eh-card__pad {
          padding: 16px;
        }

        .eh-miniTitle {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.8);
          margin-bottom: 8px;
        }

        .eh-subtle {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.6);
          letter-spacing: 0.06em;
        }

        .eh-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.65);
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(10, 14, 12, 0.12);
          border: 1px solid rgba(176, 141, 87, 0.18);
          height: fit-content;
        }

        .eh-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c2a14d;
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.16);
          display: inline-block;
        }

        .eh-headRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }

        /* Games */
        .eh-games {
          display: grid;
          gap: 10px;
        }

        .eh-game {
          width: 100%;
          display: grid;
          grid-template-columns: 34px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          cursor: pointer;
          transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
          text-align: left;
        }

        .eh-game:hover {
          transform: translateY(-1px);
          border-color: rgba(194, 161, 77, 0.35);
          background: rgba(10, 14, 12, 0.14);
        }

        .eh-game--active {
          border-color: rgba(194, 161, 77, 0.55);
          background: rgba(194, 161, 77, 0.08);
        }

        .eh-game__icon {
          font-size: 18px;
        }

        .eh-game__name {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: rgba(243, 235, 221, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eh-game__count {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.6);
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.1);
        }

        /* Desktop-style header row for table (hidden on small screens) */
        .eh-tableHead {
          display: none;
          grid-template-columns: 4fr 3fr 2fr 1.5fr 2fr;
          gap: 10px;
          padding: 12px 14px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          margin-bottom: 10px;
        }

        @media (min-width: 980px) {
          .eh-tableHead {
            display: grid;
          }
        }

        /* Accordion list */
        .eh-acc {
          display: grid;
          gap: 10px;
        }

        .eh-rowAcc {
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          overflow: hidden;
        }

        .eh-rowAcc--open {
          border-color: rgba(194, 161, 77, 0.35);
          background: rgba(10, 14, 12, 0.14);
        }

        .eh-rowAcc__summary {
          width: 100%;
          border: 0;
          background: transparent;
          cursor: pointer;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          text-align: left;
        }

        .eh-rowAcc__left {
          min-width: 0;
        }

        .eh-rowAcc__right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .eh-rowAcc__chev {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.75);
        }

        .eh-rowAcc__details {
          padding: 12px 14px 14px;
          border-top: 1px solid rgba(176, 141, 87, 0.12);
        }

        .eh-rowAcc__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .eh-rowAcc__grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .eh-detailBlock {
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 12px;
        }

        .eh-detailBlock__k {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
          margin-bottom: 10px;
        }

        .eh-rowAcc__meta {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .eh-metaPill {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-metaPill__k {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-metaPill__v {
          font-size: 12px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
        }

        /* League + teams */
        .eh-league {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.85);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .eh-liveDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c2a14d;
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.16);
          display: inline-block;
        }

        .eh-teams {
          display: grid;
          gap: 6px;
        }

        .eh-team {
          font-size: 13px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.92);
        }

        .eh-team--muted {
          color: rgba(216, 207, 192, 0.7);
        }

        /* Odds buttons */
        .eh-oddsBtns {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .eh-oddBtn {
          width: 78px;
          padding: 10px 10px;
          border-radius: 14px;
          border: 1px solid rgba(194, 161, 77, 0.28);
          background: rgba(10, 14, 12, 0.12);
          cursor: pointer;
          transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
        }

        .eh-oddBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(194, 161, 77, 0.55);
          background: rgba(194, 161, 77, 0.06);
        }

        .eh-oddBtn--soft {
          border-color: rgba(176, 141, 87, 0.18);
        }

        .eh-oddBtn__k {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-oddBtn__v {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        /* Score + status */
        .eh-score {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
          white-space: nowrap;
        }

        .eh-score__sep {
          opacity: 0.5;
        }

        .eh-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.65);
          min-width: 110px;
          white-space: nowrap;
        }

        .eh-status--live {
          border-color: rgba(194, 161, 77, 0.45);
          color: rgba(243, 235, 221, 0.92);
          background: rgba(194, 161, 77, 0.08);
        }

        /* Stats grid */
        .eh-statsGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 768px) {
          .eh-statsGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .eh-stat__k {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-stat__v {
          margin-top: 10px;
          font-size: 26px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-stat__sub {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(194, 161, 77, 0.75);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 900;
        }

        /* Bet slip */
        .eh-sticky {
          position: sticky;
          top: 86px;
        }

        .eh-empty {
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 16px;
          text-align: center;
        }

        .eh-empty__k {
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
          letter-spacing: 0.06em;
        }

        .eh-empty__sub {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-slipList {
          display: grid;
          gap: 10px;
          max-height: 330px;
          overflow: auto;
          padding-right: 4px;
        }

        .eh-slipItem {
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 12px;
        }

        .eh-slipItem__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .eh-slipItem__match {
          font-size: 11px;
          color: rgba(216, 207, 192, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .eh-slipItem__sel {
          margin-top: 6px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
        }

        .eh-x {
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          color: rgba(216, 207, 192, 0.65);
          width: 30px;
          height: 30px;
          border-radius: 12px;
          cursor: pointer;
        }

        .eh-x:hover {
          border-color: rgba(194, 161, 77, 0.45);
          color: rgba(243, 235, 221, 0.85);
        }

        .eh-slipItem__odds {
          margin-top: 10px;
          font-size: 18px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-slipTotals {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(176, 141, 87, 0.16);
          display: grid;
          gap: 10px;
        }

        .eh-slipTotals__row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: rgba(216, 207, 192, 0.6);
          font-size: 13px;
        }

        .eh-gold {
          color: rgba(194, 161, 77, 0.95) !important;
          font-weight: 900;
        }

        .eh-input {
          width: 100%;
          padding: 12px 12px;
          font-size: 14px;
          font-weight: 900;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.22);
          background: rgba(10, 14, 12, 0.18);
          color: rgba(243, 235, 221, 0.95);
          outline: none;
        }

        .eh-input::placeholder {
          color: rgba(216, 207, 192, 0.25);
        }

        .eh-input:focus {
          border-color: rgba(194, 161, 77, 0.45);
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.12);
        }

        .eh-action {
          width: 100%;
          border: 1px solid rgba(176, 141, 87, 0.6);
          background: linear-gradient(180deg, rgba(194, 161, 77, 0.14), rgba(176, 141, 87, 0.04));
          color: rgba(243, 235, 221, 0.95);
          border-radius: 16px;
          padding: 14px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.55);
        }

        .eh-action:hover {
          border-color: rgba(194, 161, 77, 0.8);
          box-shadow: 0 18px 75px rgba(0, 0, 0, 0.7);
        }

        .eh-fineprint {
          font-size: 12px;
          color: rgba(216, 207, 192, 0.45);
          text-align: center;
          font-style: italic;
          margin-top: 6px;
        }

        /* Spotlight */
        .eh-spot {
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 14px;
          text-align: center;
        }

        .eh-spot__k {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(194, 161, 77, 0.75);
          margin-bottom: 12px;
        }

        .eh-spot__teams {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }

        .eh-spot__team {
          display: grid;
          gap: 6px;
          justify-items: center;
        }

        .eh-spot__icon {
          font-size: 22px;
        }

        .eh-spot__name {
          font-size: 12px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
        }

        .eh-spot__vs {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
          padding: 8px 10px;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-spot__prize {
          margin-top: 10px;
          font-size: 22px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-spot__sub {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.6);
        }

        /* Background layers */
        .eh-wallpaper {
          background-image: radial-gradient(circle at 25% 20%, rgba(194, 161, 77, 0.06), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(15, 92, 74, 0.07), transparent 60%),
            radial-gradient(circle at 40


.eh-decoLines {
          background-image: linear-gradient(to right, rgba(176, 141, 87, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(176, 141, 87, 0.12) 1px, transparent 1px);
          background-size: 140px 140px;
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 74%);
        }
      `}</style>
        </div>
    );
}
