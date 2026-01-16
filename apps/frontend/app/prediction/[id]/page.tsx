/**
 * Eden Haus Prediction Market Detail Page
 * Route: /prediction/[id]
 *
 * Notes:
 * - Keeps existing behavior: recharts history + wagmi connection gating + mock data.
 * - Styling updated to match File 1 (dark glass, brass/gold accents, cream/beige text).
 */

"use client";

import { ConnectButton } from "@/app/components/wallet/ConnectButton";
import type { Route } from "next";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useX402Pay } from "@/lib/x402";

// ============================================================================
// TYPES
// ============================================================================

interface PricePoint {
	timestamp: number;
	date: string;
	yes: number;
	no: number;
}

interface MarketInfo {
	id: string;
	question: string;
	description: string;
	creator: string;
	createdAt: string;
	resolutionDate: string;
	totalPool: number;
	currency: string;
	status: "Active" | "Closed" | "Resolved";
	yesPercent: number;
	noPercent: number;
	totalBets: number;
	rules: {
		resolvesTo: string;
		criteria: string;
		source: string;
	};
}

// ============================================================================
// NAVIGATION
// ============================================================================

const navItems: { name: string; path: Route }[] = [
	{ name: "Home", path: "/" as Route },
	{ name: "Sports", path: "/sports" as Route },
	{ name: "Esports", path: "/esports" as Route },
	{ name: "Casino", path: "/casino" as Route },
	{ name: "Prediction", path: "/prediction" as Route },
];

// ============================================================================
// MOCK DATA - Will be replaced with real data
// ============================================================================

const MARKET_DATA: MarketInfo = {
	id: "Eden Haus-hackathon-win",
	question: "Will Eden Haus win the Cronos x402 Hackathon?",
	description:
		"Prediction market for the outcome of Eden Haus in the DoraHacks Cronos x402 hackathon competition.",
	creator: "Eden Haus",
	createdAt: "2025-12-15T00:00:00Z",
	resolutionDate: "2026-01-31T23:59:59Z",
	totalPool: 1250,
	currency: "USDT",
	status: "Active",
	yesPercent: 42,
	noPercent: 58,
	totalBets: 47,
	rules: {
		resolvesTo: "Yes",
		criteria: "Eden Haus places 1st in the Cronos x402 Hackathon on DoraHacks",
		source: "https://dorahacks.io/hackathon/cronos-x402/detail",
	},
};

function generatePriceHistory(): PricePoint[] {
	const points: PricePoint[] = [];
	const now = Date.now();
	const startDate = new Date("2025-12-15").getTime();
	const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

	let yesPrice = 35;

	for (let i = 0; i <= Math.min(days, 30); i++) {
		const date = new Date(startDate + i * 24 * 60 * 60 * 1000);
		const volatility = (Math.random() - 0.5) * 8;
		const trend = i > 10 ? 0.3 : -0.1;
		yesPrice = Math.max(5, Math.min(95, yesPrice + volatility + trend));

		points.push({
			timestamp: date.getTime(),
			date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			yes: Math.round(yesPrice),
			no: Math.round(100 - yesPrice),
		});
	}

	if (points.length > 0) {
		points[points.length - 1].yes = MARKET_DATA.yesPercent;
		points[points.length - 1].no = MARKET_DATA.noPercent;
	}

	return points;
}

// ============================================================================
// UI HELPERS
// ============================================================================

type TimeFilter = "1H" | "3H" | "24H" | "7D" | "ALL";

const TimeFilterButton = ({
	filter,
	active,
	onClick,
}: {
	filter: TimeFilter;
	active: boolean;
	onClick: () => void;
}) => (
	<button onClick={onClick} className={active ? "eh-seg-btn eh-seg-btn--active" : "eh-seg-btn eh-seg-btn--idle"}>
		{filter}
	</button>
);

const StatsChip = ({ label, value }: { label: string; value: string }) => (
	<div className="eh-chip">
		<span className="eh-chip__label">{label}</span>
		<span className="eh-chip__value">{value}</span>
	</div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
	<div className="flex items-end justify-between gap-3">
		<div>
			<h2 className="eh-h2">{title}</h2>
			{subtitle ? <p className="eh-sub">{subtitle}</p> : null}
		</div>
		<div className="eh-divider" />
	</div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="eh-tooltip">
				<div className="eh-tooltip__top">
					<span className="eh-tooltip__date">{label}</span>
					<span className="eh-tooltip__badge">ODDS</span>
				</div>
				<div className="eh-tooltip__rows">
					<div className="eh-tooltip__row">
						<span className="eh-dot eh-dot--yes" />
						<span className="eh-tooltip__k">Yes</span>
						<span className="eh-tooltip__v">{payload[0]?.value}%</span>
					</div>
					<div className="eh-tooltip__row">
						<span className="eh-dot eh-dot--no" />
						<span className="eh-tooltip__k">No</span>
						<span className="eh-tooltip__v">{payload[1]?.value}%</span>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PredictionMarketPage() {
	const params = useParams();
	const { isConnected } = useAccount();
	const { pay, isPaying } = useX402Pay("/api/x402/place-bet");

	// State
	const [market] = useState<MarketInfo>(MARKET_DATA);
	const [priceHistory] = useState<PricePoint[]>(generatePriceHistory);
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("ALL");
	const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null);
	const [betAmount, setBetAmount] = useState<string>("");
	const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
	const [isPlacingBet, setIsPlacingBet] = useState(false);
	const [currentTime, setCurrentTime] = useState("");
	const [currentDate, setCurrentDate] = useState("");
	const pathname = usePathname();

	const activeNav = (path: string) => {
		if (path === "/") return pathname === "/";
		return pathname?.startsWith(path);
	};

	// Main panel token (dark glass / gold-brass borders)
	const panelClass =
		"relative rounded-3xl " +
		"bg-[linear-gradient(135deg,rgba(10,14,12,0.55),rgba(10,14,12,0.22))] " +
		"backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.55)] " +
		"ring-1 ring-[#B08D57]/12 border border-[#B08D57]/45";

	const innerBorder = (
		<div className="pointer-events-none absolute inset-[10px] rounded-2xl border border-[#C2A14D]/16" />
	);

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

	const daysLeft = useMemo(() => {
		const now = new Date();
		const resolution = new Date(market.resolutionDate);
		const diff = resolution.getTime() - now.getTime();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	}, [market.resolutionDate]);

	const filteredHistory = useMemo(() => {
		if (timeFilter === "ALL") return priceHistory;

		const now = Date.now();
		const filterMs = {
			"1H": 60 * 60 * 1000,
			"3H": 3 * 60 * 60 * 1000,
			"24H": 24 * 60 * 60 * 1000,
			"7D": 7 * 24 * 60 * 60 * 1000,
		}[timeFilter];

		return priceHistory.filter((p) => now - p.timestamp <= filterMs);
	}, [priceHistory, timeFilter]);

	const handlePlaceBet = useCallback(async () => {
		if (!selectedOutcome || !betAmount) {
			toast.error("Please select an outcome and enter an amount");
			return;
		}

		const stake = Number(betAmount);
		if (!Number.isFinite(stake) || stake <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		if (!isConnected) {
			toast.error("Please connect your wallet first");
			return;
		}

		setIsPlacingBet(true);
		const marketId = String(params?.id ?? market.id);

		const result = await pay({
			market_id: marketId,
			side: selectedOutcome,
			stake,
		});

		if (result.success) {
			toast.success(`Bet placed! ${selectedOutcome.toUpperCase()} for $${betAmount}`);
			setBetAmount("");
			setSelectedOutcome(null);
		} else {
			toast.error(result.error || "Payment failed");
		}

		setIsPlacingBet(false);
	}, [selectedOutcome, betAmount, isConnected, params, market.id, pay]);

	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return (
			date.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric",
			}) +
			" at " +
			date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			}) +
			" UTC"
		);
	};

	const yesOdds = useMemo(() => 100 / Math.max(1, market.yesPercent), [market.yesPercent]);
	const noOdds = useMemo(() => 100 / Math.max(1, market.noPercent), [market.noPercent]);
	const isProcessing = isPlacingBet || isPaying;

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 bg-[#1F3D2B]" />
			<div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_50%_35%,rgba(243,235,221,0.10),rgba(31,61,43,0.65),rgba(10,14,12,0.92))]" />
			<div className="absolute inset-0 opacity-10 mix-blend-soft-light eh-wallpaper" />
			<div className="absolute inset-0 opacity-10 eh-decoLines" />

			<div className="relative z-10 px-4 md:px-8 py-10">
				{/* Header */}
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
										{market.status} • {daysLeft} days
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

						<div className="flex flex-wrap items-center gap-3">
							<nav className="flex flex-wrap items-center gap-2">
								{navItems.map((item) => {
									const isActive = activeNav(item.path as string);
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
							<ConnectButton />
						</div>
					</div>
				</header>

				{/* Body */}
				<main className="eh-main">
					<div className="eh-breadcrumbs">
						<Link href="/" className="eh-link">
							Home
						</Link>
						<span className="eh-breadcrumbs__sep">/</span>
						<Link href="/prediction" className="eh-link">
							Markets
						</Link>
						<span className="eh-breadcrumbs__sep">/</span>
						<span className="eh-breadcrumbs__here">{String(params?.id ?? "market")}</span>
					</div>

					<div className="eh-layout">
						{/* Left */}
						<section className="eh-left">
							<div className="eh-card eh-card--hero">
								<div className="eh-hero">
									<div className="eh-hero__meta">
										<div className="eh-hero__pill eh-hero__pill--live">
											<span className="eh-dot eh-dot--live" />
											{market.status}
										</div>
										<div className="eh-hero__pill eh-hero__pill--muted">Resolves in {daysLeft} days</div>
									</div>

									<div className="eh-hero__grid">
										<div className="eh-hero__main">
											<h1 className="eh-h1">{market.question}</h1>
											<p className="eh-body">{market.description}</p>

											<div className="eh-chips">
												<StatsChip label="Pool" value={`$${market.totalPool.toLocaleString()}`} />
												<StatsChip label="Currency" value={market.currency} />
												<StatsChip label="Bets" value={`${market.totalBets}`} />
												<StatsChip label="Created" value={formatDate(market.createdAt)} />
											</div>

											<div className="eh-hero__byline">
												<span className="eh-byline__k">Created by</span>
												<span className="eh-byline__v">{market.creator}</span>
											</div>
										</div>

										<aside className="eh-hero__side">
											<div className="eh-odds">
												<div className="eh-odds__head">Market odds</div>

												<div className="eh-odds__rows">
													<div className="eh-odds__row">
														<div className="eh-odds__label">
															<span className="eh-dot eh-dot--yes" /> YES
														</div>
														<div className="eh-odds__val">{market.yesPercent}%</div>
														<div className="eh-odds__sub">~{yesOdds.toFixed(2)}x</div>
													</div>

													<div className="eh-odds__row">
														<div className="eh-odds__label">
															<span className="eh-dot eh-dot--no" /> NO
														</div>
														<div className="eh-odds__val">{market.noPercent}%</div>
														<div className="eh-odds__sub">~{noOdds.toFixed(2)}x</div>
													</div>
												</div>

												<div className="eh-odds__bar" aria-hidden="true">
													<div className="eh-odds__barYes" style={{ width: `${market.yesPercent}%` }} />
													<div className="eh-odds__barNo" style={{ width: `${market.noPercent}%` }} />
												</div>
											</div>

											<div className="eh-note">
												<div className="eh-note__k">Resolution source</div>
												<a
													href={market.rules.source}
													target="_blank"
													rel="noopener noreferrer"
													className="eh-link eh-note__v"
												>
													{market.rules.source}
												</a>
											</div>
										</aside>
									</div>
								</div>
							</div>

							<div className="eh-card">
								<div className="eh-card__pad">
									<SectionTitle title="Price history" subtitle="Market probability over time" />

									<div className="eh-chartTop">
										<div className="eh-seg">
											{(["1H", "3H", "24H", "7D", "ALL"] as TimeFilter[]).map((filter) => (
												<TimeFilterButton
													key={filter}
													filter={filter}
													active={timeFilter === filter}
													onClick={() => setTimeFilter(filter)}
												/>
											))}
										</div>

										<div className="eh-chartKpis">
											<div className="eh-kpi">
												<span className="eh-dot eh-dot--yes" />
												<span className="eh-kpi__k">Yes</span>
												<span className="eh-kpi__v">{market.yesPercent}%</span>
											</div>
											<div className="eh-kpi">
												<span className="eh-dot eh-dot--no" />
												<span className="eh-kpi__k">No</span>
												<span className="eh-kpi__v">{market.noPercent}%</span>
											</div>
										</div>
									</div>

									<div className="eh-chartWrap">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={filteredHistory} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
												<defs>
													<linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#C2A14D" stopOpacity={0.28} />
														<stop offset="95%" stopColor="#C2A14D" stopOpacity={0} />
													</linearGradient>

													<linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#D8CFC0" stopOpacity={0.16} />
														<stop offset="95%" stopColor="#D8CFC0" stopOpacity={0} />
													</linearGradient>
												</defs>

												<XAxis
													dataKey="date"
													axisLine={false}
													tickLine={false}
													tick={{ fill: "rgba(216,207,192,0.55)", fontSize: 11 }}
													dy={10}
												/>
												<YAxis
													domain={[0, 100]}
													axisLine={false}
													tickLine={false}
													tick={{ fill: "rgba(216,207,192,0.55)", fontSize: 11 }}
													tickFormatter={(v) => `${v}%`}
													dx={-10}
												/>
												<Tooltip content={<CustomTooltip />} />
												<Area type="monotone" dataKey="yes" stroke="#C2A14D" strokeWidth={2} fill="url(#yesGradient)" />
												<Area type="monotone" dataKey="no" stroke="rgba(216,207,192,0.45)" strokeWidth={2} fill="url(#noGradient)" />
											</AreaChart>
										</ResponsiveContainer>
									</div>

									<div className="eh-legend">
										<div className="eh-legend__item">
											<span className="eh-dot eh-dot--yes" />
											Yes
										</div>
										<div className="eh-legend__item">
											<span className="eh-dot eh-dot--no" />
											No
										</div>
									</div>
								</div>
							</div>

							<div className="eh-card">
								<div className="eh-card__pad">
									<SectionTitle title="Rules" subtitle="How this market resolves" />

									<div className="eh-rules">
										<div className="eh-rules__row">
											<div className="eh-rules__k">Resolves to</div>
											<div className="eh-rules__v">{market.rules.resolvesTo}</div>
										</div>

										<div className="eh-rules__box">{market.rules.criteria}</div>

										<div className="eh-rules__row">
											<div className="eh-rules__k">Resolution source</div>
											<a
												href={market.rules.source}
												target="_blank"
												rel="noopener noreferrer"
												className="eh-link eh-rules__v"
											>
												{market.rules.source}
											</a>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Right */}
						<aside className="eh-right">
							<div className="eh-card eh-trade">
								<div className="eh-card__pad">
									<div className="eh-trade__top">
										<div>
											<div className="eh-trade__title">Trade</div>
											<div className="eh-trade__sub">Buy / sell shares</div>
										</div>
										<div className="eh-trade__status">
											<span className="eh-dot eh-dot--live" />
											{market.status}
										</div>
									</div>

									<div className="eh-trade__dates">
										<div className="eh-trade__date">
											<span>Created</span>
											<span>{formatDate(market.createdAt)}</span>
										</div>
										<div className="eh-trade__date">
											<span>Resolves</span>
											<span>{formatDate(market.resolutionDate)}</span>
										</div>
									</div>

									<div className="eh-tabs">
										<button
											className={activeTab === "buy" ? "eh-tab eh-tab--active" : "eh-tab"}
											onClick={() => setActiveTab("buy")}
											type="button"
										>
											Buy
										</button>
										<button
											className={activeTab === "sell" ? "eh-tab eh-tab--active" : "eh-tab"}
											onClick={() => setActiveTab("sell")}
											type="button"
										>
											Sell
										</button>
									</div>

									<div className="eh-outcomes">
										<button
											type="button"
											onClick={() => setSelectedOutcome(selectedOutcome === "yes" ? null : "yes")}
											className={
												selectedOutcome === "yes"
													? "eh-outcome eh-outcome--yes eh-outcome--active"
													: "eh-outcome eh-outcome--yes"
											}
										>
											<span className="eh-outcome__k">Yes</span>
											<span className="eh-outcome__v">{market.yesPercent}%</span>
										</button>

										<button
											type="button"
											onClick={() => setSelectedOutcome(selectedOutcome === "no" ? null : "no")}
											className={
												selectedOutcome === "no"
													? "eh-outcome eh-outcome--no eh-outcome--active"
													: "eh-outcome eh-outcome--no"
											}
										>
											<span className="eh-outcome__k">No</span>
											<span className="eh-outcome__v">{market.noPercent}%</span>
										</button>
									</div>

									{selectedOutcome ? (
										<div className="eh-amount">
											<label className="eh-label">Amount (USDT)</label>
											<div className="eh-amount__row">
												<input
													type="number"
													value={betAmount}
													onChange={(e) => setBetAmount(e.target.value)}
													placeholder="0.00"
													className="eh-input"
												/>
												<div className="eh-quick">
													<button className="eh-quick__btn" type="button" onClick={() => setBetAmount("10")}>
														10
													</button>
													<button className="eh-quick__btn" type="button" onClick={() => setBetAmount("50")}>
														50
													</button>
													<button className="eh-quick__btn" type="button" onClick={() => setBetAmount("100")}>
														Max
													</button>
												</div>
											</div>

											{betAmount && parseFloat(betAmount) > 0 ? (
												<div className="eh-payout">
													<div className="eh-payout__row">
														<span>Potential payout</span>
														<span className="eh-payout__strong">
															$
															{(
																parseFloat(betAmount) *
																(100 /
																	(selectedOutcome === "yes" ? market.yesPercent : market.noPercent)) *
																0.95
															).toFixed(2)}
														</span>
													</div>
													<div className="eh-payout__row eh-payout__row--muted">
														<span>After 5% fee</span>
														<span>
															{(
																(100 /
																	(selectedOutcome === "yes" ? market.yesPercent : market.noPercent)) *
																0.95
															).toFixed(2)}
															x
														</span>
													</div>
												</div>
											) : null}
										</div>
									) : null}

									{!isConnected ? (
										<div className="eh-gate">
											<div className="eh-gate__k">Connect your wallet to trade</div>
											<div className="eh-gate__sub">Wallet connection required for buys & sells.</div>
											<div className="flex justify-center">
												<ConnectButton />
											</div>
										</div>
									) : (
										<button
											onClick={handlePlaceBet}
											disabled={!selectedOutcome || !betAmount || isProcessing}
											className={
												selectedOutcome && betAmount && !isProcessing
													? selectedOutcome === "yes"
														? "eh-action eh-action--yes"
														: "eh-action eh-action--no"
													: "eh-action eh-action--disabled"
											}
											type="button"
										>
											{isProcessing
												? "Processing payment..."
												: selectedOutcome
													? `Buy ${selectedOutcome.toUpperCase()}`
													: "Select outcome"}
										</button>
									)}


									<p className="eh-fineprint">By trading, you agree to our terms. 5% fee on winnings.</p>
								</div>
							</div>

							<div className="eh-card">
								<div className="eh-card__pad">
									<div className="eh-miniTitle">Market stats</div>

									<div className="eh-statsList">
										<div className="eh-statsRow">
											<span>Total pool</span>
											<span>${market.totalPool.toLocaleString()}</span>
										</div>
										<div className="eh-statsRow">
											<span>Total bets</span>
											<span>{market.totalBets}</span>
										</div>
										<div className="eh-statsRow">
											<span>Days remaining</span>
											<span className="eh-gold">{daysLeft}</span>
										</div>
									</div>

									<div className="eh-miniBar" aria-hidden="true">
										<div className="eh-miniBar__yes" style={{ width: `${market.yesPercent}%` }} />
										<div className="eh-miniBar__no" style={{ width: `${market.noPercent}%` }} />
									</div>
									<div className="eh-miniBarLegend">
										<span className="eh-yes">Yes {market.yesPercent}%</span>
										<span className="eh-no">No {market.noPercent}%</span>
									</div>
								</div>
							</div>

							<div className="eh-ticker">Updates every 30s • Members only • Settle fast</div>
						</aside>
					</div>
				</main>
			</div>

			<style jsx global>{`
        :root {
          --eh-hunter: #1f3d2b;
          --eh-gold: #c2a14d;
          --eh-brass: #b08d57;
          --eh-cream: #f3ebdd;
          --eh-beige: #d8cfc0;
          --eh-ink: #0a0e0c;
        }

        .eh-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 16px;
          padding-bottom: 56px;
        }

        .eh-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.55);
          margin-top: 18px;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .eh-breadcrumbs__sep {
          opacity: 0.5;
        }

        .eh-breadcrumbs__here {
          font-weight: 800;
          color: rgba(243, 235, 221, 0.85);
        }

        .eh-link {
          color: rgba(216, 207, 192, 0.65);
          text-decoration: none;
          transition: color 160ms ease;
        }

        .eh-link:hover {
          color: rgba(194, 161, 77, 0.9);
          text-decoration: none;
        }

        .eh-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        @media (min-width: 1024px) {
          .eh-layout {
            grid-template-columns: 2fr 1fr;
            align-items: start;
          }
        }

        /* Shared cards (dark glass like File 1) */
        .eh-card {
          background: rgba(10, 14, 12, 0.22);
          border: 1px solid rgba(176, 141, 87, 0.22);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
          overflow: hidden;
        }

        .eh-card__pad {
          padding: 18px;
        }

        .eh-card--hero .eh-card__pad {
          padding: 0;
        }

        /* Hero */
        .eh-hero {
          padding: 22px;
          position: relative;
        }

        .eh-hero:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 25% 20%, rgba(194, 161, 77, 0.08), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(15, 92, 74, 0.07), transparent 60%),
            radial-gradient(circle at 40% 85%, rgba(90, 31, 43, 0.05), transparent 60%);
          filter: blur(0.2px);
          pointer-events: none;
        }

        .eh-hero__meta {
          position: relative;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .eh-hero__pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: rgba(10, 14, 12, 0.12);
          border: 1px solid rgba(176, 141, 87, 0.22);
          color: rgba(216, 207, 192, 0.7);
        }

        .eh-hero__pill--live {
          border-color: rgba(194, 161, 77, 0.45);
          background: rgba(194, 161, 77, 0.1);
          color: rgba(243, 235, 221, 0.92);
        }

        .eh-hero__pill--muted {
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-hero__grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 860px) {
          .eh-hero__grid {
            grid-template-columns: 1.35fr 0.65fr;
          }
        }

        .eh-h1 {
          font-size: 26px;
          line-height: 1.15;
          font-weight: 800;
          color: rgba(243, 235, 221, 0.98);
          margin: 0 0 10px 0;
        }

        .eh-body {
          margin: 0;
          color: rgba(216, 207, 192, 0.7);
          line-height: 1.55;
          font-size: 14px;
        }

        .eh-chips {
          margin-top: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .eh-chip {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(10, 14, 12, 0.12);
          border: 1px solid rgba(176, 141, 87, 0.18);
          min-width: 168px;
        }

        .eh-chip__label {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-chip__value {
          font-size: 12px;
          font-weight: 800;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-hero__byline {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(176, 141, 87, 0.16);
          display: flex;
          gap: 10px;
          align-items: baseline;
        }

        .eh-byline__k {
          font-size: 12px;
          font-weight: 800;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-byline__v {
          font-size: 13px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
        }

        /* Odds panel (dark) */
        .eh-odds {
          background: rgba(10, 14, 12, 0.14);
          border: 1px solid rgba(176, 141, 87, 0.22);
          border-radius: 16px;
          padding: 14px;
        }

        .eh-odds__head {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.8);
          margin-bottom: 10px;
        }

        .eh-odds__rows {
          display: grid;
          gap: 10px;
          margin-bottom: 12px;
        }

        .eh-odds__row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 6px;
          padding: 10px;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-odds__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 11px;
          color: rgba(216, 207, 192, 0.65);
        }

        .eh-odds__val {
          font-weight: 900;
          font-size: 16px;
          color: rgba(243, 235, 221, 0.95);
          justify-self: end;
        }

        .eh-odds__sub {
          grid-column: 1 / -1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.5);
        }

        .eh-odds__bar {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          display: flex;
          background: rgba(10, 14, 12, 0.2);
          border: 1px solid rgba(176, 141, 87, 0.16);
        }

        .eh-odds__barYes {
          background: linear-gradient(90deg, rgba(194, 161, 77, 0.95), rgba(176, 141, 87, 0.55));
          height: 100%;
        }

        .eh-odds__barNo {
          background: linear-gradient(90deg, rgba(216, 207, 192, 0.18), rgba(10, 14, 12, 0.3));
          height: 100%;
        }

        .eh-note {
          margin-top: 12px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-note__k {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
          margin-bottom: 6px;
        }

        .eh-note__v {
          font-size: 12px;
          word-break: break-all;
          color: rgba(216, 207, 192, 0.65);
        }

        /* Section headers */
        .eh-h2 {
          margin: 0;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.8);
        }

        .eh-sub {
          margin: 8px 0 0 0;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-divider {
          flex: 1;
          height: 1px;
          background: rgba(176, 141, 87, 0.16);
          max-width: 160px;
          border-radius: 999px;
        }

        /* Chart */
        .eh-chartTop {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .eh-seg {
          display: inline-flex;
          border-radius: 999px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 4px;
          gap: 4px;
        }

        .eh-seg-btn {
          border: 0;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .eh-seg-btn--idle {
          background: transparent;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-seg-btn--idle:hover {
          background: rgba(10, 14, 12, 0.14);
          color: rgba(243, 235, 221, 0.75);
        }

        .eh-seg-btn--active {
          background: linear-gradient(135deg, #c2a14d, #b08d57);
          color: rgba(10, 14, 12, 0.92);
        }

        .eh-chartKpis {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .eh-kpi {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(10, 14, 12, 0.12);
          border: 1px solid rgba(176, 141, 87, 0.18);
        }

        .eh-kpi__k {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-kpi__v {
          font-size: 12px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.92);
        }

        .eh-chartWrap {
          margin-top: 14px;
          height: 320px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          overflow: hidden;
        }

        .eh-legend {
          display: flex;
          justify-content: center;
          gap: 18px;
          padding-top: 12px;
          margin-top: 12px;
          border-top: 1px solid rgba(176, 141, 87, 0.16);
          font-weight: 900;
          color: rgba(216, 207, 192, 0.6);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .eh-legend__item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* Tooltip (dark) */
        .eh-tooltip {
          background: rgba(10, 14, 12, 0.92);
          border: 1px solid rgba(176, 141, 87, 0.22);
          border-radius: 14px;
          padding: 10px 12px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          min-width: 180px;
        }

        .eh-tooltip__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .eh-tooltip__date {
          font-size: 11px;
          font-weight: 900;
          color: rgba(216, 207, 192, 0.65);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .eh-tooltip__badge {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(194, 161, 77, 0.1);
          border: 1px solid rgba(194, 161, 77, 0.25);
          color: rgba(243, 235, 221, 0.9);
        }

        .eh-tooltip__rows {
          display: grid;
          gap: 8px;
        }

        .eh-tooltip__row {
          display: grid;
          grid-template-columns: 16px 1fr auto;
          gap: 8px;
          align-items: center;
        }

        .eh-tooltip__k {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-tooltip__v {
          font-size: 12px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.92);
        }

        /* Dots (match File 1) */
        .eh-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }

        .eh-dot--yes {
          background: #c2a14d;
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.16);
        }

        .eh-dot--no {
          background: rgba(216, 207, 192, 0.55);
          box-shadow: 0 0 0 4px rgba(216, 207, 192, 0.12);
        }

        .eh-dot--live {
          background: #c2a14d;
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.16);
        }

        /* Rules */
        .eh-rules {
          margin-top: 14px;
          display: grid;
          gap: 12px;
        }

        .eh-rules__row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }

        .eh-rules__k {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-rules__v {
          font-size: 12px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
          text-align: right;
        }

        .eh-rules__box {
          padding: 12px 12px;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          color: rgba(216, 207, 192, 0.7);
          line-height: 1.5;
          font-size: 13px;
        }

        /* Right column */
        .eh-right {
          display: grid;
          gap: 18px;
        }

        @media (min-width: 1024px) {
          .eh-trade {
            position: sticky;
            top: 86px;
          }
        }

        .eh-trade__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .eh-trade__title {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.8);
        }

        .eh-trade__sub {
          margin-top: 8px;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-trade__status {
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
        }

        .eh-trade__dates {
          display: grid;
          gap: 10px;
          margin-bottom: 14px;
        }

        .eh-trade__date {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-trade__date span:last-child {
          font-weight: 900;
          color: rgba(243, 235, 221, 0.85);
          text-align: right;
        }

        .eh-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          margin-bottom: 12px;
        }

        .eh-tab {
          border: 0;
          cursor: pointer;
          padding: 12px 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 11px;
          color: rgba(216, 207, 192, 0.6);
          background: transparent;
        }

        .eh-tab--active {
          background: rgba(10, 14, 12, 0.55);
          color: rgba(243, 235, 221, 0.95);
          box-shadow: inset 0 0 0 1px rgba(194, 161, 77, 0.25);
        }

        .eh-outcomes {
          display: grid;
          gap: 10px;
          margin-bottom: 12px;
        }

        .eh-outcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 16px;
          padding: 14px 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          cursor: pointer;
          transition: transform 120ms ease, border 120ms ease, background 120ms ease;
        }

        .eh-outcome:hover {
          transform: translateY(-1px);
          border-color: rgba(194, 161, 77, 0.35);
          background: rgba(10, 14, 12, 0.14);
        }

        .eh-outcome--active {
          border-width: 1px;
        }

        .eh-outcome--yes.eh-outcome--active {
          border-color: rgba(194, 161, 77, 0.55);
          background: rgba(194, 161, 77, 0.08);
        }

        .eh-outcome--no.eh-outcome--active {
          border-color: rgba(176, 141, 87, 0.35);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-outcome__k {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.65);
        }

        .eh-outcome__v {
          font-size: 16px;
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-amount {
          margin-top: 12px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        .eh-label {
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(216, 207, 192, 0.6);
          margin-bottom: 8px;
        }

        .eh-amount__row {
          position: relative;
        }

        .eh-input {
          width: 100%;
          padding: 12px 12px;
          font-size: 16px;
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

        .eh-quick {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
        }

        .eh-quick__btn {
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.14);
          color: rgba(216, 207, 192, 0.65);
          padding: 6px 8px;
          border-radius: 10px;
          font-weight: 900;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .eh-quick__btn:hover {
          border-color: rgba(194, 161, 77, 0.35);
          color: rgba(243, 235, 221, 0.85);
        }

        .eh-payout {
          margin-top: 10px;
          border-radius: 14px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          padding: 10px;
        }

        .eh-payout__row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
          color: rgba(216, 207, 192, 0.7);
        }

        .eh-payout__row--muted {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.55);
        }

        .eh-payout__strong {
          font-weight: 900;
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-gate {
          margin-top: 12px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          text-align: center;
        }

        .eh-gate__k {
          font-weight: 900;
          letter-spacing: 0.06em;
          color: rgba(243, 235, 221, 0.9);
        }

        .eh-gate__sub {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-action {
          width: 100%;
          margin-top: 12px;
          border: 0;
          border-radius: 16px;
          padding: 14px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .eh-action--gold {
          border: 1px solid rgba(176, 141, 87, 0.6);
          background: linear-gradient(180deg, rgba(194, 161, 77, 0.14), rgba(176, 141, 87, 0.04));
          color: rgba(243, 235, 221, 0.95);
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.55);
        }

        .eh-action--gold:hover {
          border-color: rgba(194, 161, 77, 0.8);
          box-shadow: 0 18px 75px rgba(0, 0, 0, 0.7);
        }

        .eh-action--yes {
          border: 1px solid rgba(194, 161, 77, 0.6);
          background: linear-gradient(180deg, rgba(194, 161, 77, 0.14), rgba(176, 141, 87, 0.04));
          color: rgba(243, 235, 221, 0.95);
        }

        .eh-action--no {
          border: 1px solid rgba(176, 141, 87, 0.45);
          background: rgba(10, 14, 12, 0.14);
          color: rgba(243, 235, 221, 0.85);
        }

        .eh-action--disabled {
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
          color: rgba(216, 207, 192, 0.35);
          cursor: not-allowed;
        }

        .eh-fineprint {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(216, 207, 192, 0.45);
          text-align: center;
          font-style: italic;
        }

        /* Stats card */
        .eh-miniTitle {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(176, 141, 87, 0.8);
          margin-bottom: 10px;
        }

        .eh-statsList {
          display: grid;
          gap: 10px;
          font-size: 13px;
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-statsRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .eh-statsRow span:last-child {
          font-weight: 900;
          color: rgba(243, 235, 221, 0.9);
        }

        .eh-gold {
          color: rgba(194, 161, 77, 0.95) !important;
        }

        .eh-miniBar {
          margin-top: 12px;
          height: 12px;
          border-radius: 999px;
          overflow: hidden;
          display: flex;
          background: rgba(10, 14, 12, 0.2);
          border: 1px solid rgba(176, 141, 87, 0.16);
        }

        .eh-miniBar__yes {
          background: linear-gradient(90deg, rgba(194, 161, 77, 0.95), rgba(176, 141, 87, 0.55));
        }

        .eh-miniBar__no {
          background: linear-gradient(90deg, rgba(216, 207, 192, 0.18), rgba(10, 14, 12, 0.3));
        }

        .eh-miniBarLegend {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .eh-yes {
          color: rgba(194, 161, 77, 0.9);
        }

        .eh-no {
          color: rgba(216, 207, 192, 0.6);
        }

        .eh-ticker {
          text-align: center;
          font-size: 12px;
          font-weight: 900;
          color: rgba(216, 207, 192, 0.5);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(176, 141, 87, 0.18);
          background: rgba(10, 14, 12, 0.12);
        }

        /* Background layers similar to File 1 style jsx */
        .eh-wallpaper {
          background-image:
            radial-gradient(circle at 25% 20%, rgba(194, 161, 77, 0.06), transparent 55%),
            radial-gradient(circle at 70% 60%, rgba(15, 92, 74, 0.07), transparent 60%),
            radial-gradient(circle at 40% 85%, rgba(90, 31, 43, 0.05), transparent 60%);
          filter: blur(0.2px);
        }

        .eh-decoLines {
          background-image:
            linear-gradient(to right, rgba(176, 141, 87, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(176, 141, 87, 0.12) 1px, transparent 1px);
          background-size: 140px 140px;
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 74%);
        }
      `}</style>
		</div>
	);
}
