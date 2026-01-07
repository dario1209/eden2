/**
 * Eden Haus Prediction Market Detail Page (Irish Earthy)
 * Route: /prediction/[id]
 *
 * Intent:
 * - Replace the vaporwave/XO look with a more "Eden Haus" members-club aesthetic.
 * - Keep existing behavior: recharts history + wagmi connection gating + mock data.
 */

"use client";

import type { Route } from "next";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";
import { useAccount } from "wagmi";


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
	{ name: "Live", path: "/" as Route },
	{ name: "Sports", path: "/sports" as Route },
	{ name: "Esports", path: "/esports" as Route },
	{ name: "Casino", path: "/casino" as Route },
	{ name: "Prediction", path: "/prediction" as Route },
];

const pathname = usePathname();

const activeNav = (path: string) => {
	if (path === "/") return pathname === "/";
	return pathname?.startsWith(path);
};

const panelClass =
	"rounded-[18px] overflow-hidden border border-[#B08D57]/30 " +
	"bg-[linear-gradient(180deg,rgba(31,61,43,0.92),rgba(31,61,43,0.55))] " +
	"shadow-[0_24px_70px_rgba(0,0,0,0.30)]";

const innerBorder = (
	<div className="pointer-events-none absolute inset-0 rounded-[18px] border border-[#F3EBDD]/10" />
);

// ============================================================================
// MOCK DATA - Will be replaced with real data
// ============================================================================

const MARKET_DATA: MarketInfo = {
	id: "Eden Haus-hackathon-win",
	question: "Will Eden Haus win the Cronos x402 Hackathon?",
	description:
		"Prediction market for the outcome of Eden Haus in the DoraHacks Cronos x402 hackathon competition.",
	creator: "@Eden Haus",
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
	<button
		onClick={onClick}
		className={
			active
				? "eh-seg-btn eh-seg-btn--active"
				: "eh-seg-btn eh-seg-btn--idle"
		}
	>
		{filter}
	</button>
);

const StatsChip = ({
	label,
	value,
}: {
	label: string;
	value: string;
}) => (
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

	// State
	const [market] = useState<MarketInfo>(MARKET_DATA);
	const [priceHistory] = useState<PricePoint[]>(generatePriceHistory);
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("ALL");
	const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(
		null
	);
	const [betAmount, setBetAmount] = useState<string>("");
	const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
	const [isPlacingBet, setIsPlacingBet] = useState(false);
	const [currentTime, setCurrentTime] = useState("");
	const [currentDate, setCurrentDate] = useState("");

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

		if (!isConnected) {
			toast.error("Please connect your wallet first");
			return;
		}

		setIsPlacingBet(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		toast.success(`Bet placed! ${selectedOutcome.toUpperCase()} for $${betAmount}`);
		setIsPlacingBet(false);
		setBetAmount("");
		setSelectedOutcome(null);
	}, [selectedOutcome, betAmount, isConnected]);

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

	return (
		<div className="eh-page">
			{/* Background */}
			<div className="eh-bg" aria-hidden="true">
				<div className="eh-bg__grad" />
				<div className="eh-bg__grid" />
				<div className="eh-bg__grain" />
			</div>

			{/* Header (match Sports) */}
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
				</div>
			</header>


			{/* Body */}
			<main className="eh-main">
				<div className="eh-breadcrumbs">
					<Link href="/" className="eh-link">Home</Link>
					<span className="eh-breadcrumbs__sep">/</span>
					<Link href="/prediction" className="eh-link">Markets</Link>
					<span className="eh-breadcrumbs__sep">/</span>
					<span className="eh-breadcrumbs__here">{String(params?.id ?? "market")}</span>
				</div>

				<div className="eh-layout">
					{/* Left */}
					<section className="eh-left">
						<div className="eh-card eh-card--hero">
							<div className="eh-hero">
								<div className="eh-hero__meta">
									<div className="eh-hero__pill">
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
										<AreaChart data={filteredHistory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
											<defs>
												<linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="var(--eh-emerald)" stopOpacity={0.32} />
													<stop offset="95%" stopColor="var(--eh-emerald)" stopOpacity={0} />
												</linearGradient>
												<linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="var(--eh-burgundy)" stopOpacity={0.30} />
													<stop offset="95%" stopColor="var(--eh-burgundy)" stopOpacity={0} />
												</linearGradient>
											</defs>
											<XAxis
												dataKey="date"
												axisLine={false}
												tickLine={false}
												tick={{ fill: "var(--eh-muted)", fontSize: 11 }}
												dy={10}
											/>
											<YAxis
												domain={[0, 100]}
												axisLine={false}
												tickLine={false}
												tick={{ fill: "var(--eh-muted)", fontSize: 11 }}
												tickFormatter={(v) => `${v}%`}
												dx={-10}
											/>
											<Tooltip content={<CustomTooltip />} />
											<Area type="monotone" dataKey="yes" stroke="var(--eh-emerald)" strokeWidth={2} fill="url(#yesGradient)" />
											<Area type="monotone" dataKey="no" stroke="var(--eh-burgundy)" strokeWidth={2} fill="url(#noGradient)" />
										</AreaChart>
									</ResponsiveContainer>
								</div>

								<div className="eh-legend">
									<div className="eh-legend__item"><span className="eh-dot eh-dot--yes" />Yes</div>
									<div className="eh-legend__item"><span className="eh-dot eh-dot--no" />No</div>
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
										<a href={market.rules.source} target="_blank" rel="noopener noreferrer" className="eh-link eh-rules__v">
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
									<div className="eh-trade__date"><span>Created</span><span>{formatDate(market.createdAt)}</span></div>
									<div className="eh-trade__date"><span>Resolves</span><span>{formatDate(market.resolutionDate)}</span></div>
								</div>

								<div className="eh-tabs">
									<button className={activeTab === "buy" ? "eh-tab eh-tab--active" : "eh-tab"} onClick={() => setActiveTab("buy")}>Buy</button>
									<button className={activeTab === "sell" ? "eh-tab eh-tab--active" : "eh-tab"} onClick={() => setActiveTab("sell")}>Sell</button>
								</div>

								<div className="eh-outcomes">
									<button
										onClick={() => setSelectedOutcome(selectedOutcome === "yes" ? null : "yes")}
										className={selectedOutcome === "yes" ? "eh-outcome eh-outcome--yes eh-outcome--active" : "eh-outcome eh-outcome--yes"}
									>
										<span className="eh-outcome__k">Yes</span>
										<span className="eh-outcome__v">{market.yesPercent}%</span>
									</button>

									<button
										onClick={() => setSelectedOutcome(selectedOutcome === "no" ? null : "no")}
										className={selectedOutcome === "no" ? "eh-outcome eh-outcome--no eh-outcome--active" : "eh-outcome eh-outcome--no"}
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
												<button className="eh-quick__btn" onClick={() => setBetAmount("10")}>10</button>
												<button className="eh-quick__btn" onClick={() => setBetAmount("50")}>50</button>
												<button className="eh-quick__btn" onClick={() => setBetAmount("100")}>Max</button>
											</div>
										</div>

										{betAmount && parseFloat(betAmount) > 0 ? (
											<div className="eh-payout">
												<div className="eh-payout__row">
													<span>Potential payout</span>
													<span className="eh-payout__strong">
														${(
															parseFloat(betAmount) *
															(100 /
																(selectedOutcome === "yes"
																	? market.yesPercent
																	: market.noPercent)) *
															0.95
														).toFixed(2)}
													</span>
												</div>
												<div className="eh-payout__row eh-payout__row--muted">
													<span>After 5% fee</span>
													<span>
														{(
															(100 /
																(selectedOutcome === "yes"
																	? market.yesPercent
																	: market.noPercent)) *
															0.95
														).toFixed(2)}x
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
										<button className="eh-action eh-action--gold">Connect Wallet</button>
									</div>
								) : (
									<button
										onClick={handlePlaceBet}
										disabled={!selectedOutcome || !betAmount || isPlacingBet}
										className={
											selectedOutcome && betAmount && !isPlacingBet
												? selectedOutcome === "yes"
													? "eh-action eh-action--yes"
													: "eh-action eh-action--no"
												: "eh-action eh-action--disabled"
										}
									>
										{isPlacingBet
											? "Placing bet..."
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
									<div className="eh-statsRow"><span>Total pool</span><span>${market.totalPool.toLocaleString()}</span></div>
									<div className="eh-statsRow"><span>Total bets</span><span>{market.totalBets}</span></div>
									<div className="eh-statsRow"><span>Days remaining</span><span className="eh-gold">{daysLeft}</span></div>
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

			<style jsx global>{`
        :root {
          --eh-hunter: #1F3D2B;
          --eh-emerald: #0F5C4A;
          --eh-moss: #5F6F52;
          --eh-mahogany: #4A2C1D;
          --eh-walnut: #6B4A32;
          --eh-burgundy: #5A1F2B;
          --eh-claret: #7B2D26;
          --eh-gold: #C2A14D;
          --eh-brass: #B08D57;
          --eh-cream: #F3EBDD;
          --eh-beige: #D8CFC0;
          --eh-muted: rgba(31, 61, 43, 0.55);
          --eh-ink: rgba(22, 28, 24, 0.92);
        }

        .eh-page {
          min-height: 100vh;
          color: var(--eh-ink);
          position: relative;
        }

        /* Background */
        .eh-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .eh-bg__grad {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(194, 161, 77, 0.22) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 70%, rgba(15, 92, 74, 0.24) 0%, transparent 60%),
            linear-gradient(180deg, rgba(243, 235, 221, 1) 0%, rgba(216, 207, 192, 1) 58%, rgba(243, 235, 221, 1) 100%);
        }

        .eh-bg__grid {
          position: absolute;
          inset: 0;
          opacity: 0.14;
          background-image:
            linear-gradient(rgba(31, 61, 43, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 61, 43, 0.18) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .eh-bg__grain {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px);
          background-size: 3px 3px;
          mix-blend-mode: multiply;
        }

        /* Top */
        .eh-top {
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(14px);
          background: rgba(243, 235, 221, 0.86);
          border-bottom: 1px solid rgba(31, 61, 43, 0.14);
        }

        .eh-top__inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .eh-top__left {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .eh-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
        }

        .eh-crest {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          letter-spacing: 0.12em;
          color: var(--eh-cream);
          background: linear-gradient(135deg, var(--eh-hunter), var(--eh-emerald));
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);
          border: 1px solid rgba(194, 161, 77, 0.25);
        }

        .eh-brand__name {
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .eh-brand__tag {
          font-weight: 700;
          font-size: 11px;
          color: rgba(31, 61, 43, 0.65);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .eh-nav {
          display: none;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        @media (min-width: 860px) {
          .eh-nav {
            display: flex;
          }
        }

        .eh-nav__item {
          text-decoration: none;
          color: rgba(31, 61, 43, 0.85);
          font-weight: 800;
          font-size: 13px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid transparent;
          transition: background 160ms ease, border 160ms ease;
        }

        .eh-nav__item:hover {
          background: rgba(31, 61, 43, 0.06);
          border-color: rgba(31, 61, 43, 0.10);
        }

        .eh-nav__item--active {
          background: rgba(31, 61, 43, 0.10);
          border-color: rgba(31, 61, 43, 0.14);
          color: rgba(31, 61, 43, 0.95);
        }

        .eh-top__right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .eh-clock {
          display: none;
          gap: 8px;
          font-size: 12px;
          color: rgba(31, 61, 43, 0.72);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        @media (min-width: 640px) {
          .eh-clock {
            display: flex;
          }
        }

        .eh-clock__sep {
          opacity: 0.6;
        }

        .eh-cta {
          background: linear-gradient(135deg, var(--eh-gold) 0%, var(--eh-brass) 100%);
          border: 1px solid rgba(31, 61, 43, 0.14);
          color: rgba(31, 61, 43, 0.95);
          padding: 10px 14px;
          font-weight: 900;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        /* Layout */
        .eh-main {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 16px;
          padding-bottom: 56px;
        }

        .eh-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(31, 61, 43, 0.72);
          margin-bottom: 14px;
        }

        .eh-breadcrumbs__sep {
          opacity: 0.5;
        }

        .eh-breadcrumbs__here {
          font-weight: 800;
          color: rgba(31, 61, 43, 0.88);
        }

        .eh-link {
          color: rgba(15, 92, 74, 0.95);
          text-decoration: none;
        }

        .eh-link:hover {
          color: rgba(31, 61, 43, 1);
          text-decoration: underline;
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

        .eh-card {
          background: rgba(243, 235, 221, 0.84);
          border: 1px solid rgba(31, 61, 43, 0.16);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }

        .eh-card__pad {
          padding: 18px;
        }

        .eh-card--hero .eh-card__pad {
          padding: 0;
        }

        .eh-hero {
          padding: 22px;
          position: relative;
        }

        .eh-hero:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 10%, rgba(194, 161, 77, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 90%, rgba(15, 92, 74, 0.12) 0%, transparent 60%);
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
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(31, 61, 43, 0.08);
          border: 1px solid rgba(31, 61, 43, 0.14);
          color: rgba(31, 61, 43, 0.90);
        }

        .eh-hero__pill--muted {
          color: rgba(31, 61, 43, 0.70);
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
          font-weight: 950;
          color: rgba(31, 61, 43, 0.95);
          margin: 0 0 10px 0;
        }

        .eh-body {
          margin: 0;
          color: rgba(31, 61, 43, 0.72);
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
          background: rgba(216, 207, 192, 0.36);
          border: 1px solid rgba(31, 61, 43, 0.14);
          min-width: 168px;
        }

        .eh-chip__label {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.60);
        }

        .eh-chip__value {
          font-size: 12px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.92);
        }

        .eh-hero__byline {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(31, 61, 43, 0.12);
          display: flex;
          gap: 10px;
          align-items: baseline;
        }

        .eh-byline__k {
          font-size: 12px;
          font-weight: 800;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-byline__v {
          font-size: 13px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.92);
        }

        .eh-odds {
          background: rgba(243, 235, 221, 0.78);
          border: 1px solid rgba(31, 61, 43, 0.14);
          border-radius: 16px;
          padding: 14px;
        }

        .eh-odds__head {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.72);
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
          border: 1px solid rgba(31, 61, 43, 0.12);
          background: rgba(216, 207, 192, 0.26);
        }

        .eh-odds__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .eh-odds__val {
          font-weight: 950;
          font-size: 16px;
          color: rgba(31, 61, 43, 0.92);
          justify-self: end;
        }

        .eh-odds__sub {
          grid-column: 1 / -1;
          font-size: 12px;
          font-weight: 800;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-odds__bar {
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          display: flex;
          background: rgba(31, 61, 43, 0.10);
          border: 1px solid rgba(31, 61, 43, 0.12);
        }

        .eh-odds__barYes {
          background: linear-gradient(90deg, var(--eh-emerald), var(--eh-moss));
          height: 100%;
        }

        .eh-odds__barNo {
          background: linear-gradient(90deg, var(--eh-burgundy), var(--eh-claret));
          height: 100%;
        }

        .eh-note {
          margin-top: 12px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(243, 235, 221, 0.72);
        }

        .eh-note__k {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.60);
          margin-bottom: 6px;
        }

        .eh-note__v {
          font-size: 12px;
          word-break: break-all;
        }

        /* Section headers */
        .eh-h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.88);
        }

        .eh-sub {
          margin: 6px 0 0 0;
          font-size: 13px;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-divider {
          flex: 1;
          height: 1px;
          background: rgba(31, 61, 43, 0.14);
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
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(31, 61, 43, 0.06);
          padding: 4px;
          gap: 4px;
        }

        .eh-seg-btn {
          border: 0;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .eh-seg-btn--idle {
          background: transparent;
          color: rgba(31, 61, 43, 0.68);
        }

        .eh-seg-btn--idle:hover {
          background: rgba(31, 61, 43, 0.06);
        }

        .eh-seg-btn--active {
          background: linear-gradient(135deg, var(--eh-gold), var(--eh-brass));
          color: rgba(31, 61, 43, 0.95);
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
          background: rgba(216, 207, 192, 0.28);
          border: 1px solid rgba(31, 61, 43, 0.12);
        }

        .eh-kpi__k {
          font-size: 12px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.70);
        }

        .eh-kpi__v {
          font-size: 12px;
          font-weight: 950;
          color: rgba(31, 61, 43, 0.92);
        }

        .eh-chartWrap {
          margin-top: 14px;
          height: 320px;
          border-radius: 16px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(243, 235, 221, 0.70);
          overflow: hidden;
        }

        .eh-legend {
          display: flex;
          justify-content: center;
          gap: 18px;
          padding-top: 12px;
          margin-top: 12px;
          border-top: 1px solid rgba(31, 61, 43, 0.12);
          font-weight: 900;
          color: rgba(31, 61, 43, 0.75);
          font-size: 12px;
        }

        .eh-legend__item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* Tooltip */
        .eh-tooltip {
          background: rgba(243, 235, 221, 0.94);
          border: 1px solid rgba(31, 61, 43, 0.16);
          border-radius: 14px;
          padding: 10px 12px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.14);
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
          font-weight: 950;
          color: rgba(31, 61, 43, 0.68);
        }

        .eh-tooltip__badge {
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(31, 61, 43, 0.08);
          border: 1px solid rgba(31, 61, 43, 0.12);
          color: rgba(31, 61, 43, 0.75);
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
          font-size: 12px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.78);
        }

        .eh-tooltip__v {
          font-size: 12px;
          font-weight: 950;
          color: rgba(31, 61, 43, 0.92);
        }

        /* Dots */
        .eh-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          display: inline-block;
        }

        .eh-dot--yes {
          background: var(--eh-emerald);
          box-shadow: 0 0 0 4px rgba(15, 92, 74, 0.12);
        }

        .eh-dot--no {
          background: var(--eh-burgundy);
          box-shadow: 0 0 0 4px rgba(90, 31, 43, 0.12);
        }

        .eh-dot--live {
          background: var(--eh-gold);
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
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-rules__v {
          font-size: 13px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.90);
        }

        .eh-rules__box {
          padding: 12px 12px;
          border-radius: 14px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(216, 207, 192, 0.30);
          color: rgba(31, 61, 43, 0.80);
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
          font-size: 16px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.90);
        }

        .eh-trade__sub {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-trade__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.82);
          padding: 8px 10px;
          border-radius: 999px;
          background: rgba(31, 61, 43, 0.06);
          border: 1px solid rgba(31, 61, 43, 0.12);
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
          color: rgba(31, 61, 43, 0.70);
        }

        .eh-trade__date span:last-child {
          font-weight: 900;
          color: rgba(31, 61, 43, 0.88);
          text-align: right;
        }

        .eh-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(31, 61, 43, 0.06);
          margin-bottom: 12px;
        }

        .eh-tab {
          border: 0;
          cursor: pointer;
          padding: 12px 10px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(31, 61, 43, 0.70);
          background: transparent;
        }

        .eh-tab--active {
          background: rgba(31, 61, 43, 0.92);
          color: var(--eh-cream);
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
          border: 1px solid rgba(31, 61, 43, 0.16);
          background: rgba(243, 235, 221, 0.72);
          cursor: pointer;
          transition: transform 120ms ease, border 120ms ease;
        }

        .eh-outcome:hover {
          transform: translateY(-1px);
          border-color: rgba(15, 92, 74, 0.25);
        }

        .eh-outcome--active {
          border-width: 2px;
        }

        .eh-outcome--yes.eh-outcome--active {
          border-color: rgba(15, 92, 74, 0.75);
          background: rgba(15, 92, 74, 0.06);
        }

        .eh-outcome--no.eh-outcome--active {
          border-color: rgba(90, 31, 43, 0.75);
          background: rgba(90, 31, 43, 0.06);
        }

        .eh-outcome__k {
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.88);
        }

        .eh-outcome__v {
          font-size: 16px;
          font-weight: 950;
          color: rgba(31, 61, 43, 0.92);
        }

        .eh-amount {
          margin-top: 12px;
          padding: 12px;
          border-radius: 16px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(216, 207, 192, 0.24);
        }

        .eh-label {
          display: block;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.70);
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
          border: 2px solid rgba(31, 61, 43, 0.14);
          background: rgba(243, 235, 221, 0.80);
          color: rgba(31, 61, 43, 0.95);
          outline: none;
        }

        .eh-input:focus {
          border-color: rgba(194, 161, 77, 0.85);
          box-shadow: 0 0 0 4px rgba(194, 161, 77, 0.18);
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
          border: 1px solid rgba(31, 61, 43, 0.16);
          background: rgba(31, 61, 43, 0.08);
          color: rgba(31, 61, 43, 0.88);
          padding: 6px 8px;
          border-radius: 10px;
          font-weight: 950;
          font-size: 12px;
          cursor: pointer;
        }

        .eh-quick__btn:hover {
          background: rgba(31, 61, 43, 0.12);
        }

        .eh-payout {
          margin-top: 10px;
          border-radius: 14px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(243, 235, 221, 0.70);
          padding: 10px;
        }

        .eh-payout__row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
          color: rgba(31, 61, 43, 0.80);
        }

        .eh-payout__row--muted {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-payout__strong {
          font-weight: 950;
          color: rgba(31, 61, 43, 0.92);
        }

        .eh-gate {
          margin-top: 12px;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(31, 61, 43, 0.14);
          background: rgba(243, 235, 221, 0.72);
          text-align: center;
        }

        .eh-gate__k {
          font-weight: 950;
          color: rgba(31, 61, 43, 0.88);
        }

        .eh-gate__sub {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(31, 61, 43, 0.62);
        }

        .eh-action {
          width: 100%;
          margin-top: 12px;
          border: 0;
          border-radius: 16px;
          padding: 14px;
          font-size: 14px;
          font-weight: 950;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .eh-action--gold {
          background: linear-gradient(135deg, var(--eh-gold), var(--eh-brass));
          color: rgba(31, 61, 43, 0.95);
          border: 1px solid rgba(31, 61, 43, 0.12);
        }

        .eh-action--yes {
          background: linear-gradient(135deg, var(--eh-emerald), var(--eh-hunter));
          color: var(--eh-cream);
        }

        .eh-action--no {
          background: linear-gradient(135deg, var(--eh-burgundy), var(--eh-claret));
          color: var(--eh-cream);
        }

        .eh-action--disabled {
          background: rgba(31, 61, 43, 0.10);
          color: rgba(31, 61, 43, 0.45);
          cursor: not-allowed;
        }

        .eh-fineprint {
          margin-top: 10px;
          font-size: 12px;
          color: rgba(31, 61, 43, 0.60);
          text-align: center;
        }

        /* Stats card */
        .eh-miniTitle {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(31, 61, 43, 0.72);
          margin-bottom: 10px;
        }

        .eh-statsList {
          display: grid;
          gap: 10px;
          font-size: 13px;
          color: rgba(31, 61, 43, 0.72);
        }

        .eh-statsRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .eh-statsRow span:last-child {
          font-weight: 950;
          color: rgba(31, 61, 43, 0.90);
        }

        .eh-gold {
          color: var(--eh-gold) !important;
        }

        .eh-miniBar {
          margin-top: 12px;
          height: 12px;
          border-radius: 999px;
          overflow: hidden;
          display: flex;
          background: rgba(31, 61, 43, 0.10);
          border: 1px solid rgba(31, 61, 43, 0.12);
        }

        .eh-miniBar__yes {
          background: linear-gradient(90deg, var(--eh-emerald), var(--eh-moss));
        }

        .eh-miniBar__no {
          background: linear-gradient(90deg, var(--eh-burgundy), var(--eh-claret));
        }

        .eh-miniBarLegend {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 950;
        }

        .eh-yes {
          color: var(--eh-emerald);
        }

        .eh-no {
          color: var(--eh-burgundy);
        }

        .eh-ticker {
          text-align: center;
          font-size: 12px;
          font-weight: 900;
          color: rgba(31, 61, 43, 0.62);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(31, 61, 43, 0.12);
          background: rgba(243, 235, 221, 0.60);
        }
      `}</style>
		</div>
	);
}
