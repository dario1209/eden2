/**
 * Prediction Market Page - XO Market Style
 * 
 * DegenHouse Hackathon Market
 * "Will DegenHouse win the Cronos x402 Hackathon?"
 * 
 * Features:
 * - Price history chart with Yes/No probability lines
 * - Clean market header with stats badges
 * - Sidebar trading panel with Yes/No buttons
 * - Rules & Resolution section
 * - Pastel Dream vaporwave aesthetic
 * 
 * Route: /prediction/[id]
 */

"use client";

import type { Route } from 'next';
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
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
	{ name: 'Live', path: '/' as Route },
	{ name: 'Sports', path: '/sports' as Route },
	{ name: 'Esports', path: '/esports' as Route },
	{ name: 'Casino', path: '/casino' as Route },
	{ name: 'Prediction', path: '/prediction' as Route }
]

// ============================================================================
// MOCK DATA - Will be replaced with real data
// ============================================================================

const MARKET_DATA: MarketInfo = {
	id: "DegenHouse-hackathon-win",
	question: "Will DegenHouse win the Cronos x402 Hackathon?",
	description: "Prediction market for the outcome of DegenHouse in the DoraHacks Cronos x402 hackathon competition.",
	creator: "@DegenHouse",
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
		criteria: "DegenHouse places 1st in the Cronos x402 Hackathon on DoraHacks",
		source: "https://dorahacks.io/hackathon/cronos-x402/detail",
	},
};

// Generate realistic-looking price history
function generatePriceHistory(): PricePoint[] {
	const points: PricePoint[] = [];
	const now = Date.now();
	const startDate = new Date("2025-12-15").getTime();
	const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

	let yesPrice = 35; // Starting probability

	for (let i = 0; i <= Math.min(days, 30); i++) {
		const date = new Date(startDate + i * 24 * 60 * 60 * 1000);

		// Add some realistic volatility
		const volatility = (Math.random() - 0.5) * 8;
		const trend = i > 10 ? 0.3 : -0.1; // Slight upward trend after initial period
		yesPrice = Math.max(5, Math.min(95, yesPrice + volatility + trend));

		points.push({
			timestamp: date.getTime(),
			date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			yes: Math.round(yesPrice),
			no: Math.round(100 - yesPrice),
		});
	}

	// Ensure last point matches current market state
	if (points.length > 0) {
		points[points.length - 1].yes = MARKET_DATA.yesPercent;
		points[points.length - 1].no = MARKET_DATA.noPercent;
	}

	return points;
}

// ============================================================================
// CUSTOM CHART TOOLTIP
// ============================================================================

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="glass-pastel rounded-lg p-3 shadow-lg">
				<p className="text-xs text-[#957DAD] font-medium mb-2">{label}</p>
				<div className="space-y-1">
					<p className="text-sm">
						<span className="inline-block w-3 h-3 rounded-full bg-[#10B981] mr-2" />
						<span className="text-[#6B4C7A]">Yes: </span>
						<span className="font-bold text-[#10B981]">{payload[0]?.value}%</span>
					</p>
					<p className="text-sm">
						<span className="inline-block w-3 h-3 rounded-full bg-[#F43F5E] mr-2" />
						<span className="text-[#6B4C7A]">No: </span>
						<span className="font-bold text-[#F43F5E]">{payload[1]?.value}%</span>
					</p>
				</div>
			</div>
		);
	}
	return null;
};

// ============================================================================
// TIME FILTER BUTTONS
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
		className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${active
			? "bg-gradient-to-r from-[#FF6B9D] to-[#C44569] text-white shadow-md"
			: "text-[#957DAD] hover:bg-[#F8E8F8]"
			}`}
	>
		{filter}
	</button>
);

// ============================================================================
// STATS BADGE
// ============================================================================

const StatsBadge = ({
	icon,
	value,
	className = "",
}: {
	icon: string;
	value: string;
	className?: string;
}) => (
	<div
		className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#E0BBE4] text-xs font-medium text-[#6B4C7A] ${className}`}
	>
		<span>{icon}</span>
		<span>{value}</span>
	</div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PredictionMarketPage() {
	const params = useParams();
	const { address: walletAddress, isConnected } = useAccount();

	// State
	const [market] = useState<MarketInfo>(MARKET_DATA);
	const [priceHistory] = useState<PricePoint[]>(generatePriceHistory);
	const [timeFilter, setTimeFilter] = useState<TimeFilter>("ALL");
	const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null);
	const [betAmount, setBetAmount] = useState<string>("");
	const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
	const [isPlacingBet, setIsPlacingBet] = useState(false);
	const [currentTime, setCurrentTime] = useState('');
	const [currentDate, setCurrentDate] = useState('');

	// Update time and date
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

	// Calculate days remaining
	const daysLeft = useMemo(() => {
		const now = new Date();
		const resolution = new Date(market.resolutionDate);
		const diff = resolution.getTime() - now.getTime();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	}, [market.resolutionDate]);

	// Filter price history based on time filter
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

	// Handle bet placement
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

		// Simulate bet placement
		await new Promise((resolve) => setTimeout(resolve, 2000));

		toast.success(`Bet placed! ${selectedOutcome.toUpperCase()} for $${betAmount}`);
		setIsPlacingBet(false);
		setBetAmount("");
		setSelectedOutcome(null);
	}, [selectedOutcome, betAmount, isConnected]);

	// Format date
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		}) + " at " + date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}) + " UTC";
	};

	return (
		<div className="min-h-screen overflow-hidden relative">
			{/* Dreamy Vaporwave Background - Market Theme */}
			<div className="fixed inset-0">
				{/* Main gradient */}
				<div
					className="absolute inset-0"
					style={{
						background: 'linear-gradient(180deg, #E6E6FA 0%, #DDA0DD 15%, #FFB6C1 30%, #FFDAB9 50%, #B0E0E6 70%, #98D8C8 85%, #E6E6FA 100%)'
					}}
				/>

				{/* Secondary overlay for depth */}
				<div
					className="absolute inset-0 opacity-50"
					style={{
						background: 'radial-gradient(ellipse at 30% 20%, rgba(230, 230, 250, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 182, 193, 0.4) 0%, transparent 50%)'
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
				<div className="absolute top-16 left-[8%] text-5xl opacity-70 animate-bounce" style={{ animationDuration: '6s' }}>☁️</div>
				<div className="absolute top-32 right-[12%] text-4xl opacity-60 animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>☁️</div>
				<div className="absolute top-48 left-[25%] text-3xl opacity-50 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>☁️</div>

				{/* Sparkles */}
				<div className="absolute top-24 right-[30%] text-2xl opacity-60 animate-pulse">✦</div>
				<div className="absolute top-40 left-[15%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}>✧</div>
				<div className="absolute bottom-32 right-[20%] text-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
				<div className="absolute bottom-48 left-[35%] text-xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>✧</div>

				{/* Market-themed floating elements */}
				<div className="absolute bottom-24 right-[15%] text-3xl opacity-40 animate-bounce" style={{ animationDuration: '5s' }}>📊</div>
				<div className="absolute top-[45%] left-[5%] text-2xl opacity-30 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>🏆</div>
				<div className="absolute bottom-[40%] right-[5%] text-2xl opacity-35 animate-bounce" style={{ animationDuration: '7s', animationDelay: '2s' }}>💎</div>
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
								MARKET.EXE
							</span>
							<div
								className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
								style={{
									background: 'linear-gradient(135deg, #10B981, #059669)',
									color: 'white',
									boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
								}}
							>
								<span className="w-2 h-2 bg-white rounded-full animate-ping" />
								ACTIVE
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
										📊 MARKET VIEW 📊
									</span>
								</div>
							</Link>

							{/* Navigation */}
							<nav className="hidden md:flex items-center gap-1">
								{navItems.map((item) => {
									const isPrediction = item.name === 'Prediction'

									return (
										<Link
											key={item.name}
											href={item.path}
											className={`
												px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
												${isPrediction
													? 'text-white scale-105'
													: 'hover:scale-105'
												}
											`}
											style={isPrediction ? {
												background: 'linear-gradient(135deg, #957DAD 0%, #7EC8E3 50%, #98D8C8 100%)',
												boxShadow: '0 4px 15px rgba(149, 125, 173, 0.4)'
											} : {
												color: '#957DAD',
												background: 'transparent'
											}}
										>
											{isPrediction && (
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
								🔮 Connect Wallet
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 mt-4 pb-12">
				{/* Navigation Breadcrumb */}
				<nav className="flex items-center gap-2 text-sm mb-4">
					<Link href="/" className="text-[#957DAD] hover:text-[#6B4C7A] transition-colors">
						Home
					</Link>
					<span className="text-[#E0BBE4]">›</span>
					<Link href="/prediction" className="text-[#957DAD] hover:text-[#6B4C7A] transition-colors">
						Markets
					</Link>
					<span className="text-[#E0BBE4]">›</span>
					<span className="text-[#6B4C7A] font-medium">Hackathon</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

					{/* ============================================ */}
					{/* LEFT COLUMN - Market Info & Chart */}
					{/* ============================================ */}
					<div className="lg:col-span-2 space-y-6">

						{/* Market Header Card */}
						<div className="window-card">
							<div className="window-titlebar window-titlebar-pink flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span>✦</span>
									<span>MARKET_INFO.EXE</span>
								</div>
								<div className="flex gap-1">
									<div className="window-btn" />
									<div className="window-btn" />
									<div className="window-btn window-btn-close" />
								</div>
							</div>

							<div className="p-6">
								{/* Market Question */}
								<div className="flex items-start gap-4 mb-6">
									{/* Market Icon */}
									<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#C44569] flex items-center justify-center text-3xl shadow-lg glow-pink">
										🏆
									</div>

									<div className="flex-1">
										<h1 className="text-2xl font-bold text-[#6B4C7A] leading-tight mb-3">
											{market.question}
										</h1>

										{/* Creator Badge */}
										<div className="flex items-center gap-2 mb-4">
											<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7EC8E3] to-[#5BA4C9] flex items-center justify-center">
												<span className="text-xs">🎮</span>
											</div>
											<span className="text-sm font-semibold text-[#957DAD]">{market.creator}</span>
											<span className="text-[#E0BBE4]">•</span>
											<span className="text-sm text-[#957DAD]">
												{Math.floor((Date.now() - new Date(market.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
											</span>
										</div>

										{/* Stats Badges */}
										<div className="flex flex-wrap gap-2">
											<StatsBadge icon="📊" value={`$${market.totalPool.toLocaleString()}`} />
											<StatsBadge icon="💎" value={market.currency} />
											<StatsBadge icon="⏰" value={`${daysLeft} days left`} />
											<StatsBadge icon="🎲" value={`${market.totalBets} bets`} />
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Price History Chart Card */}
						<div className="window-card">
							<div className="window-titlebar window-titlebar-aqua flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span>📈</span>
									<span>PRICE_HISTORY.DAT</span>
								</div>
								<div className="flex gap-1">
									<div className="window-btn" />
									<div className="window-btn" />
									<div className="window-btn window-btn-close" />
								</div>
							</div>

							<div className="p-6">
								{/* Chart Header */}
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-4">
										<button className="px-4 py-2 rounded-lg bg-[#6B4C7A] text-white text-sm font-semibold flex items-center gap-2">
											<span>▼</span> All outcomes
										</button>
									</div>

									{/* Time Filters */}
									<div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8E8F8]">
										{(["1H", "3H", "24H", "7D", "ALL"] as TimeFilter[]).map((filter) => (
											<TimeFilterButton
												key={filter}
												filter={filter}
												active={timeFilter === filter}
												onClick={() => setTimeFilter(filter)}
											/>
										))}
									</div>
								</div>

								{/* Current Prices Display */}
								<div className="flex items-center gap-8 mb-4">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-[#10B981]" />
										<span className="text-sm text-[#6B4C7A]">Yes</span>
										<span className="text-lg font-bold text-[#10B981]">{market.yesPercent}%</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
										<span className="text-sm text-[#6B4C7A]">No</span>
										<span className="text-lg font-bold text-[#F43F5E]">{market.noPercent}%</span>
									</div>
								</div>

								{/* Chart */}
								<div className="h-[300px] w-full">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
											<defs>
												<linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
													<stop offset="95%" stopColor="#10B981" stopOpacity={0} />
												</linearGradient>
												<linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
													<stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
												</linearGradient>
											</defs>
											<XAxis
												dataKey="date"
												axisLine={false}
												tickLine={false}
												tick={{ fill: "#957DAD", fontSize: 11 }}
												dy={10}
											/>
											<YAxis
												domain={[0, 100]}
												axisLine={false}
												tickLine={false}
												tick={{ fill: "#957DAD", fontSize: 11 }}
												tickFormatter={(value) => `${value}%`}
												dx={-10}
											/>
											<Tooltip content={<CustomTooltip />} />
											<Area
												type="monotone"
												dataKey="yes"
												stroke="#10B981"
												strokeWidth={2}
												fill="url(#yesGradient)"
											/>
											<Area
												type="monotone"
												dataKey="no"
												stroke="#F43F5E"
												strokeWidth={2}
												fill="url(#noGradient)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>

								{/* Legend */}
								<div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#E0BBE4]">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-[#10B981]" />
										<span className="text-sm text-[#6B4C7A]">Yes</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
										<span className="text-sm text-[#6B4C7A]">No</span>
									</div>
								</div>
							</div>
						</div>

						{/* Rules & Resolution Card */}
						<div className="window-card">
							<div className="window-titlebar flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span>📋</span>
									<span>RULES.TXT</span>
								</div>
								<div className="flex gap-1">
									<div className="window-btn" />
									<div className="window-btn" />
									<div className="window-btn window-btn-close" />
								</div>
							</div>

							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-bold text-[#6B4C7A] flex items-center gap-2">
										<span>⚖️</span> Rules & Resolution
									</h3>
									<a
										href={market.rules.source}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-[#FF6B9D] hover:text-[#C44569] font-medium transition-colors"
									>
										See all rules →
									</a>
								</div>

								<div className="space-y-4">
									<div>
										<p className="text-sm text-[#957DAD] mb-1">Resolves to</p>
										<p className="text-lg font-bold text-[#10B981]">{market.rules.resolvesTo}</p>
									</div>

									<div className="p-4 rounded-lg bg-[#F8E8F8] border border-[#E0BBE4]">
										<p className="text-sm text-[#6B4C7A]">{market.rules.criteria}</p>
									</div>

									<div>
										<p className="text-sm text-[#957DAD] mb-1">Resolution Source</p>
										<a
											href={market.rules.source}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-[#7EC8E3] hover:text-[#5BA4C9] underline break-all"
										>
											{market.rules.source}
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* ============================================ */}
					{/* RIGHT COLUMN - Trading Panel */}
					{/* ============================================ */}
					<div className="space-y-6">

						{/* Trading Card */}
						<div className="window-card sticky top-4">
							<div className="window-titlebar window-titlebar-pink flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span>💰</span>
									<span>TRADE.EXE</span>
								</div>
								<div className="flex gap-1">
									<div className="window-btn" />
									<div className="window-btn" />
									<div className="window-btn window-btn-close" />
								</div>
							</div>

							<div className="p-6">
								{/* Status & Dates */}
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
										<span className="text-sm font-semibold text-[#10B981]">{market.status}</span>
									</div>
									<button className="px-3 py-1 text-xs font-semibold rounded-lg border border-[#E0BBE4] text-[#957DAD] hover:bg-[#F8E8F8] transition-colors">
										Resolve
									</button>
								</div>

								<div className="space-y-2 mb-6 text-sm">
									<div className="flex justify-between">
										<span className="text-[#957DAD]">Created</span>
										<span className="text-[#6B4C7A] font-medium">{formatDate(market.createdAt)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-[#957DAD]">Resolves</span>
										<span className="text-[#6B4C7A] font-medium">{formatDate(market.resolutionDate)}</span>
									</div>
								</div>

								{/* Buy/Sell Tabs */}
								<div className="flex mb-4">
									<button
										onClick={() => setActiveTab("buy")}
										className={`flex-1 py-3 text-sm font-bold rounded-l-lg transition-all ${activeTab === "buy"
											? "bg-[#6B4C7A] text-white"
											: "bg-[#F8E8F8] text-[#957DAD] hover:bg-[#E0BBE4]"
											}`}
									>
										Buy
									</button>
									<button
										onClick={() => setActiveTab("sell")}
										className={`flex-1 py-3 text-sm font-bold rounded-r-lg transition-all ${activeTab === "sell"
											? "bg-[#6B4C7A] text-white"
											: "bg-[#F8E8F8] text-[#957DAD] hover:bg-[#E0BBE4]"
											}`}
									>
										Sell
									</button>
								</div>

								{/* Outcome Buttons */}
								<div className="space-y-3 mb-6">
									<button
										onClick={() => setSelectedOutcome(selectedOutcome === "yes" ? null : "yes")}
										className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedOutcome === "yes"
											? "border-[#10B981] bg-[#10B981]/10"
											: "border-[#E0BBE4] bg-white hover:border-[#10B981]/50"
											}`}
									>
										<span className={`text-lg font-bold ${selectedOutcome === "yes" ? "text-[#10B981]" : "text-[#6B4C7A]"
											}`}>
											Yes
										</span>
										<span className={`text-xl font-bold ${selectedOutcome === "yes" ? "text-[#10B981]" : "text-[#6B4C7A]"
											}`}>
											{market.yesPercent}%
										</span>
									</button>

									<button
										onClick={() => setSelectedOutcome(selectedOutcome === "no" ? null : "no")}
										className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedOutcome === "no"
											? "border-[#F43F5E] bg-[#F43F5E]/10"
											: "border-[#E0BBE4] bg-white hover:border-[#F43F5E]/50"
											}`}
									>
										<span className={`text-lg font-bold ${selectedOutcome === "no" ? "text-[#F43F5E]" : "text-[#6B4C7A]"
											}`}>
											No
										</span>
										<span className={`text-xl font-bold ${selectedOutcome === "no" ? "text-[#F43F5E]" : "text-[#6B4C7A]"
											}`}>
											{market.noPercent}%
										</span>
									</button>
								</div>

								{/* Amount Input */}
								{selectedOutcome && (
									<div className="mb-6 space-y-3">
										<label className="text-sm font-medium text-[#6B4C7A]">Amount (USDT)</label>
										<div className="relative">
											<input
												type="number"
												value={betAmount}
												onChange={(e) => setBetAmount(e.target.value)}
												placeholder="0.00"
												className="w-full px-4 py-3 rounded-xl border-2 border-[#E0BBE4] bg-white text-[#6B4C7A] font-semibold text-lg focus:border-[#FF6B9D] focus:outline-none transition-colors"
											/>
											<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
												<button
													onClick={() => setBetAmount("10")}
													className="px-2 py-1 text-xs font-semibold rounded bg-[#F8E8F8] text-[#957DAD] hover:bg-[#E0BBE4] transition-colors"
												>
													$10
												</button>
												<button
													onClick={() => setBetAmount("50")}
													className="px-2 py-1 text-xs font-semibold rounded bg-[#F8E8F8] text-[#957DAD] hover:bg-[#E0BBE4] transition-colors"
												>
													$50
												</button>
												<button
													onClick={() => setBetAmount("100")}
													className="px-2 py-1 text-xs font-semibold rounded bg-[#F8E8F8] text-[#957DAD] hover:bg-[#E0BBE4] transition-colors"
												>
													MAX
												</button>
											</div>
										</div>

										{/* Potential Payout */}
										{betAmount && parseFloat(betAmount) > 0 && (
											<div className="p-3 rounded-lg bg-[#F8E8F8] border border-[#E0BBE4]">
												<div className="flex justify-between text-sm">
													<span className="text-[#957DAD]">Potential payout</span>
													<span className="font-bold text-[#6B4C7A]">
														${(parseFloat(betAmount) * (100 / (selectedOutcome === "yes" ? market.yesPercent : market.noPercent)) * 0.95).toFixed(2)}
													</span>
												</div>
												<div className="flex justify-between text-xs mt-1">
													<span className="text-[#957DAD]">After 5% fee</span>
													<span className="text-[#10B981] font-semibold">
														{((100 / (selectedOutcome === "yes" ? market.yesPercent : market.noPercent)) * 0.95).toFixed(2)}x
													</span>
												</div>
											</div>
										)}
									</div>
								)}

								{/* Action Button */}
								{!isConnected ? (
									<div className="text-center">
										<p className="text-sm text-[#957DAD] mb-3">Connect your wallet to trade</p>
										<p className="text-xs text-[#C9A0DC] mb-4">
											You need to connect your wallet to buy or sell shares in this market.
										</p>
										<button className="w-full py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-[1.02]"
											style={{
												background: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
												boxShadow: '0 4px 15px rgba(196, 69, 105, 0.4)'
											}}
										>
											🔮 Connect Wallet
										</button>
									</div>
								) : (
									<button
										onClick={handlePlaceBet}
										disabled={!selectedOutcome || !betAmount || isPlacingBet}
										className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${selectedOutcome && betAmount && !isPlacingBet
											? selectedOutcome === "yes"
												? "bg-gradient-to-r from-[#10B981] to-[#059669] text-white shadow-lg hover:shadow-xl"
												: "bg-gradient-to-r from-[#F43F5E] to-[#DC2626] text-white shadow-lg hover:shadow-xl"
											: "bg-[#E0BBE4] text-[#957DAD] cursor-not-allowed"
											}`}
									>
										{isPlacingBet ? (
											<span className="flex items-center justify-center gap-2">
												<span className="spinner" />
												Placing Bet...
											</span>
										) : selectedOutcome ? (
											`Buy ${selectedOutcome.toUpperCase()}`
										) : (
											"Select Outcome"
										)}
									</button>
								)}

								{/* Disclaimer */}
								<p className="text-xs text-center text-[#C9A0DC] mt-4">
									By trading, you agree to our terms. 5% fee on winnings.
								</p>
							</div>
						</div>

						{/* Market Stats Card */}
						<div className="window-card">
							<div className="window-titlebar flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span>📊</span>
									<span>STATS.DAT</span>
								</div>
								<div className="flex gap-1">
									<div className="window-btn" />
									<div className="window-btn" />
									<div className="window-btn window-btn-close" />
								</div>
							</div>

							<div className="p-6 space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm text-[#957DAD]">Total Pool</span>
									<span className="text-lg font-bold text-[#6B4C7A]">${market.totalPool.toLocaleString()}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-[#957DAD]">Total Bets</span>
									<span className="text-lg font-bold text-[#6B4C7A]">{market.totalBets}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-[#957DAD]">Days Remaining</span>
									<span className="text-lg font-bold text-[#FF6B9D]">{daysLeft}</span>
								</div>

								{/* Pool Distribution Bar */}
								<div className="pt-4 border-t border-[#E0BBE4]">
									<p className="text-sm text-[#957DAD] mb-3">Pool Distribution</p>
									<div className="h-4 rounded-full overflow-hidden flex">
										<div
											className="bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-500"
											style={{ width: `${market.yesPercent}%` }}
										/>
										<div
											className="bg-gradient-to-r from-[#F43F5E] to-[#FB7185] transition-all duration-500"
											style={{ width: `${market.noPercent}%` }}
										/>
									</div>
									<div className="flex justify-between mt-2 text-xs">
										<span className="text-[#10B981] font-semibold">Yes {market.yesPercent}%</span>
										<span className="text-[#F43F5E] font-semibold">No {market.noPercent}%</span>
									</div>
								</div>
							</div>
						</div>

						{/* Live Indicator */}
						<div className="text-center p-3 rounded-lg bg-white/50 border border-[#E0BBE4]">
							<div className="flex items-center justify-center gap-2 text-xs text-[#957DAD]">
								<span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
								<span>Market updates every 30s</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}