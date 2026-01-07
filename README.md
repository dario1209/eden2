# Eden Haus – Prediction Markets on Cronos

Eden Haus is a **real-time prediction market** for live events, where one of the flagship experiences is a fully on-chain, x402‑powered sportsbook for micro-bets that resolve in seconds, not hours. It is built as a polyglot monorepo (Next.js + FastAPI + smart contracts) targeting Cronos, Chainlink SPORTS feeds, and the emerging x402 internet‑native payments standard.

***

## 1. What Eden Haus Is

Eden Haus lets users:

- Trade **event-level prediction markets** (governance, crypto, sports, real‑world events), with automated resolution via Chainlink oracles.
- Place **sportsbook-style micro bets** on the next play, point, serve, or possession, leveraging the same underlying prediction market liquidity.
- Pay and settle using **x402 programmatic payments**, where HTTP 402 “Payment Required” becomes a first‑class primitive for stablecoin bets and fees.

Designed for hackathons and production investors alike, Eden Haus demonstrates how on-chain markets, real‑time data, and machine‑payable APIs converge into a single product surface.

***

## 2. High‑Level Architecture

At the top level, Eden Haus is a Turborepo-style monorepo orchestrating frontend, backend, smart contracts, and automation:

```bash
sportsbook-monorepo/
├── README.md                  # Hackathon setup + deploy guide
├── package.json               # Root deps (turbo, typescript)
├── turbo.json                 # Build orchestration
├── .gitignore                 # Standard Next.js + Python
│
├── apps/
│   ├── frontend/              # Next.js 15 App Router (Vercel)
│   └── backend/               # FastAPI (Railway)
│
├── packages/
│   ├── contracts/             # Hardhat/Foundry Cronos contracts
│   ├── types/                 # Shared TS types (markets, positions)
│   └── x402/                  # x402 payment utils
│
└── scripts/                   # Deploy, test, Chainlink jobs
```

**Key design traits**

- **Monorepo with shared types and x402 logic**: Frontend, backend, and contracts speak the same language for markets, positions, and settlements, reducing integration bugs.  
- **Event-driven core**: Chainlink feeds, Redis pub/sub, and WebSockets power low-latency odds, micro-betting ticks, and instant market settlement.
- **x402‑native architecture**: The x402 package centralizes “Payment Required” flows, making every endpoint and bet placement potentially paywalled or fee‑gated at the protocol level.

***

## 3. Frontend (Next.js 15 – Live Micro‑Markets)

The frontend is a Next.js 15 App Router application deployed on Vercel, optimized for live overlays, micro-interactions, and wallet‑native UX.

```bash
apps/frontend/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx         # Wallet connect + x402 auth
│   ├── (live)/
│   │   ├── layout.tsx         # Live sports overlay layout
│   │   ├── [sport]/           # /live/soccer, /live/lol
│   │   │   ├── page.tsx       # Sport dashboard
│   │   │   ├── markets/       # Dynamic markets list
│   │   │   │   └── page.tsx
│   │   │   └── [marketId]/    # Single micro-market
│   │   │       └── page.tsx   # Next-point bet UI
│   │   └── page.tsx           # Live sports landing
│   ├── api/
│   │   ├── x402/              # Proxy x402 payments
│   │   │   └── place-bet/
│   │   │       └── route.ts   # POST → backend → 402 quote
│   │   └── chainlink/         # Public market data
│   │       └── markets/
│   │           └── route.ts
│   ├── globals.css            # Tailwind + live overlay styles
│   ├── layout.tsx             # Root + shadcn/ui
│   └── page.tsx               # Landing (hackathon pitch)
├── components/
│   ├── ui/                    # shadcn buttons, cards, tables
│   ├── bet-ui/                # Bet slip, odds display
│   ├── live/                  # Score ticker, next-event cards
│   └── wallet/                # Cronos wallet connect + x402
├── lib/
│   ├── x402.ts                # Client-side 402 payment handler
│   ├── chainlink.ts           # Public market feeds
│   └── utils.ts               # WebSocket reconnects
└── ...
```

**UX pillars**

- **(live) namespace**: Dedicated layouts for “bet-the-next-event” markets, emphasizing speed and clarity over long slips.
- **Sportsbook as a feature, not the product**: `/live/[sport]/[marketId]` presents sportsbook‑style odds on top of generic prediction markets, so any feed (sports, crypto, off‑chain data) can become a micro‑market.  
- **x402-aware flows**: The `x402.ts` client and `/api/x402/place-bet` route handle 402 challenges and retries, letting the UI treat payments as first‑class, programmable responses.

Under the hood, the frontend uses shadcn/ui and Tailwind for composable primitives, viem + wagmi for Cronos wallet connectivity, and React Query for live data fetching.

***

## 4. Backend (FastAPI – Markets, Bets, and Oracles)

The backend is a FastAPI service deployed to Railway, acting as the coordination layer between x402 payments, Chainlink feeds, Redis, and Cronos smart contracts.

```bash
apps/backend/
├── main.py                    # FastAPI app + CORS for Vercel
├── requirements.txt           # fastapi, uvicorn, web3.py, redis
├── Dockerfile                 # Railway deploy
├── railway.json               # Env vars (Cronos RPC, Chainlink keys)
│
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── x402.py        # 402 quote endpoints
│   │   │   ├── markets.py     # Market creation + odds
│   │   │   └── bets.py        # Place bet → contract call
│   │   └── websocket.py       # Live market updates (Redis pubsub)
│   ├── core/
│   │   ├── x402.py            # x402 payment verification
│   │   ├── chainlink.py       # Oracle price feeds
│   │   └── contracts.py       # web3.py Cronos contract calls
│   ├── models/
│   │   ├── market.py          # Pydantic market/position schemas
│   │   └── bet.py
│   └── services/
│       ├── market_manager.py  # Odds calc + exposure limits
│       ├── settlement.py      # Keeper logic for payouts
│       └── redis.py           # Rate limits + live cache
└── tests/                     # Pytest for x402 flows
```

**Backend responsibilities**

- **Markets & odds**: `markets.py` and `market_manager.py` ingest Chainlink SPORTS and other feeds to bootstrap and update markets, with exposure limits and configurable vig.
- **Bet lifecycle**: `bets.py`, `contracts.py`, and `settlement.py` orchestrate the full lifecycle: x402 payment → on-chain bet → oracle-driven resolution → payout.  
- **Real-time layer**: `websocket.py` and `redis.py` push incremental odds and settlement events to the frontend with sub-second latency, a requirement for micro-betting UX.

All external-facing x402 flows are covered by tests under `tests/`, demonstrating robust verification and settlement for hackathon judges and auditors.

***

## 5. Smart Contracts, x402, and Cronos/Chainlink

Under `packages/` live the reusable building blocks that make Eden Haus more than a demo:

```bash
packages/
├── contracts/             # Hardhat/Foundry Cronos contracts
├── types/                 # Shared TS types (markets, positions)
└── x402/                  # x402 payment utils
```

**Contracts (Cronos)**

- Deployed on **Cronos**, leveraging its EVM compatibility and Chainlink integration for secure price and odds feeds.
- Market contracts are designed for **parametric settlements**: they consume Chainlink SPORTS and other feeds to autonomously resolve markets without trusted intermediaries.

**x402 payment layer**

- Implements the x402 flow where APIs can respond with an HTTP 402 status containing payment requirements, which clients satisfy via signed stablecoin payments before retrying.
- Enables **machine-payable endpoints** for bets, data access, and premium analytics – a foundation for AI agents participating in markets programmatically.

This composition positions Eden Haus at the intersection of prediction markets, on-chain sports data, and internet-native payments.

***

## 6. Local Development & Deployment

### Prerequisites

- Node.js + pnpm  
- Python 3.11+  
- Cronos RPC endpoint  
- Chainlink credentials (SPORTS / price feeds)  
- Redis instance  
- Vercel & Railway accounts

### Install & bootstrap

```bash
# Clone
git clone <repo-url> sportsbook-monorepo
cd sportsbook-monorepo

# Install JS workspace deps
pnpm install

# Install backend deps
cd apps/backend
pip install -r requirements.txt
cd ../../
```

### Run everything locally

```bash
# Start backend (FastAPI + Redis)
cd apps/backend
uvicorn main:app --reload

# Start frontend (Next.js 15)
cd ../frontend
pnpm dev
```

The frontend connects to the backend via environment‑configured URLs with CORS enabled in `main.py`, mirroring the Vercel → Railway production topology.

### Deploy

- **Frontend**: Push to GitHub and import into Vercel; set env vars for backend URL, Cronos RPC, and Chainlink endpoints.
- **Backend**: Deploy `apps/backend` to Railway using the provided `Dockerfile` and `railway.json`, wiring in Cronos, Chainlink, and Redis configuration.  

Chainlink jobs and market automation scripts live under `scripts/`, enabling scheduled market creation and resolution workflows.

***

## 7. Why This Matters (for Devs, Judges, and Investors)

- **For developers**: A full-stack reference for x402‑native dApps that blend prediction markets, sports micro‑betting, and on-chain data into a single coherent monorepo.
- **For hackathon judges**: Demonstrates mastery of Cronos, Chainlink SPORTS feeds, real-time websockets, FastAPI, and Next.js, with a clear separation of concerns and test coverage for critical payment flows.
- **For VCs/investors**: Targets the fastest-growing segment of wagering – micro-betting – which already represents a significant share of sports bets and is still accelerating as live, mobile-first engagement grows.

Eden Haus is not “just another sportsbook”. It is a **prediction market engine** where the sportsbook experience is one of many possible frontends on top of a programmable, x402‑enabled, oracle‑driven on-chain market layer.