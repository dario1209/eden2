# DegenHouse (Eden Haus) Architecture

> **Full-stack prediction market platform with blockchain integration**

## Table of Contents

1. [Overview](#overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Schema](#database-schema)
6. [Smart Contracts](#smart-contracts)
7. [Communication Flow](#communication-flow)
8. [Configuration & Environment](#configuration--environment)
9. [Deployment](#deployment)
10. [Tech Stack](#tech-stack)
11. [Security & Design Patterns](#security--design-patterns)

---

## Overview

**DegenHouse** (branded as Eden Haus) is a full-stack prediction market platform built on:
- **Frontend:** Next.js 15 with App Router
- **Backend:** FastAPI (Python)
- **Blockchain:** Cronos network with Solidity smart contracts
- **Database:** PostgreSQL with Prisma/SQLAlchemy ORM
- **Real-time:** Redis pub/sub + Server-Sent Events

### Key Features
- Real-time binary (YES/NO) prediction markets
- Blockchain-integrated betting with USDT
- x402 payment protocol support
- Chainlink oracle integration for settlement
- Anti-manipulation & Sybil attack prevention
- Live score tracking and odds calculation
- Responsive sportsbook-style UI with Art Deco theme

---

## Monorepo Structure

```
DegenHouse/
├── apps/
│   ├── frontend/          # Next.js 15 App Router (Vercel/Railway)
│   └── backend/           # FastAPI Python (Railway)
├── packages/
│   ├── contracts/         # Solidity smart contracts (Cronos)
│   └── hardhat.config.ts  # Hardhat configuration
├── turbo.json            # Turborepo orchestration
├── package.json          # Root workspace config
└── [Documentation]       # CONFIG.md, DATABASE.md, SECURITY.md, etc.
```

**Build System:** Turborepo with npm workspaces
**Deployment:** Frontend on Vercel, Backend on Railway, Contracts on Cronos

---

## Frontend Architecture

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.1.0 (App Router) |
| Language | TypeScript 5.5.3 |
| Styling | Tailwind CSS 3.4.10 |
| UI Components | shadcn/ui (Radix UI) |
| State Management | TanStack React Query 5.59.0 |
| Blockchain | wagmi 2.16.0, viem 2.22.0 |
| Wallet | @reown/appkit 1.4.7 (WalletConnect) |
| Database | Prisma Client + PostgreSQL |
| Animations | Framer Motion 11.5.6 |
| Charts | Recharts 2.12.7 |

### Directory Structure

```
apps/frontend/
├── app/
│   ├── (auth)/                # Authentication layouts
│   ├── (live)/                # Live sports betting UI
│   ├── api/                   # Next.js API routes
│   │   ├── bets/              # Bet confirmation & retrieval
│   │   │   ├── confirm/
│   │   │   └── get-user-bets/
│   │   ├── chainlink/         # Chainlink oracle data
│   │   ├── markets/           # Market data & stats
│   │   │   ├── [id]/
│   │   │   └── live-stats/    # SSE endpoint
│   │   └── x402/              # x402 payment protocol
│   ├── casino/                # Casino page
│   ├── components/            # React components
│   │   ├── ui/                # shadcn primitives (Button, Card, Input)
│   │   ├── bet-ui/            # BetSlip component
│   │   ├── live/              # LiveScore component
│   │   └── wallet/            # WalletConnect, ConnectButton
│   ├── esports/               # Esports betting page
│   ├── prediction/            # Main prediction markets
│   │   ├── page.tsx           # Markets list with live updates
│   │   └── [id]/              # Individual market detail page
│   ├── sports/                # Sports betting page
│   ├── contact/               # Contact page
│   ├── responsible-gaming/    # Responsible gaming
│   ├── terms/                 # Terms of service
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Landing page (knock animation)
│   ├── providers.tsx          # React Query + Wagmi setup
│   └── globals.css            # Tailwind + custom CSS
├── lib/
│   ├── api/
│   │   └── predictions.ts     # API client for backend
│   ├── blockchain/
│   │   ├── viem-client.ts     # Viem blockchain client
│   │   └── tx-validator.ts    # Transaction validation
│   ├── config/
│   │   ├── appkit.ts          # WalletConnect config
│   │   └── constants.ts       # App constants
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma  # PostgreSQL schema
│   │   └── client.ts          # Prisma client singleton
│   ├── hooks/
│   │   ├── usePredictionMarket.ts  # Market data with SSE
│   │   ├── useContractBet.ts       # Smart contract betting
│   │   ├── useBetValidation.ts     # Client-side validation
│   │   └── useSSE.ts               # Server-Sent Events hook
│   ├── types/
│   │   └── prediction-market.ts    # TypeScript types
│   ├── validation/
│   │   └── bet-rules.ts            # Bet validation rules
│   ├── x402.ts                     # x402 payment client
│   ├── chainlink.ts                # Chainlink integration
│   ├── utils.ts                    # Utility functions
│   └── config.ts                   # Configuration loader
├── public/                         # Static assets (images, fonts)
├── Dockerfile                      # Multi-stage Docker build
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind customization
├── tsconfig.json                   # TypeScript config
└── package.json                    # Dependencies
```

### Key Frontend Pages

#### 1. Landing Page ([app/page.tsx](apps/frontend/app/page.tsx))
- **Theme:** Speakeasy-inspired "knock thrice" entrance
- **Design:** Art Deco with film grain, vignette, smoke effects
- **Interaction:** Click door 3 times or "Slip Inside" button
- **Animation:** Framer Motion for smooth transitions

#### 2. Prediction Markets ([app/prediction/page.tsx](apps/frontend/app/prediction/page.tsx))
- **Data:** Real-time market fetching from FastAPI backend
- **UI:** Collapsible market cards with YES/NO buttons
- **Live Updates:** Server-Sent Events for pool changes
- **Features:** Trade slip management, bet placement, live scoreboard
- **Integration:** Direct backend API calls for vote placement

#### 3. API Routes ([app/api/](apps/frontend/app/api/))
- `/api/bets/confirm` - Confirm bets after x402 payment
- `/api/bets/get-user-bets` - Retrieve user bet history
- `/api/markets/[id]` - Get specific market details
- `/api/markets/live-stats` - SSE endpoint for real-time pool updates
- `/api/x402/place-bet` - x402 payment flow initiation

### State Management

**React Query Configuration:**
- `staleTime: 30000` (30 seconds)
- `cacheTime: 300000` (5 minutes)
- Automatic background refetching
- Optimistic updates for bet placement

**Custom Hooks:**

| Hook | Purpose |
|------|---------|
| `usePredictionMarket` | Fetches market data, subscribes to SSE updates, manages cache |
| `useContractBet` | Interacts with smart contracts via wagmi |
| `useBetValidation` | Client-side bet validation (min/max amounts, cooldown) |
| `useSSE` | Generic Server-Sent Events subscription |

### Wallet Integration

**Provider:** Reown AppKit (WalletConnect v2)
**Supported Networks:** Ethereum Mainnet, Arbitrum (configurable for Cronos)
**Features:**
- Multi-wallet support (MetaMask, WalletConnect, Coinbase Wallet)
- Account switching
- Transaction signing
- Network switching

---

## Backend Architecture

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | FastAPI 0.115.0 |
| Server | Uvicorn 0.30.6 (ASGI) |
| Database | SQLAlchemy 2.0.23 + PostgreSQL |
| Migrations | Alembic 1.13.0 |
| Cache/Real-time | Redis 5.2.1 |
| Validation | Pydantic 2.9.2 |
| HTTP Client | httpx 0.27.0 |
| Environment | python-dotenv 1.0.1 |

### Directory Structure

```
apps/backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── x402.py           # x402 payment quotes & verification
│   │   │   ├── markets.py        # Market listing & creation
│   │   │   ├── bets.py           # Bet confirmation
│   │   │   └── predictions.py    # Prediction markets CRUD
│   │   └── websocket.py          # WebSocket with Redis pub/sub
│   ├── core/
│   │   ├── x402.py               # x402 payment verification
│   │   ├── chainlink.py          # Chainlink oracle data fetching
│   │   └── contracts.py          # Cronos contract calls (JSON-RPC)
│   ├── models/
│   │   ├── market.py             # Pydantic market schemas
│   │   ├── bet.py                # Bet schemas (quote, position)
│   │   └── prediction.py         # Prediction market schemas
│   └── services/
│       ├── market_manager.py     # Odds calculation & exposure limits
│       ├── settlement.py         # Oracle-driven settlement
│       └── redis.py              # Redis cache & pub/sub
├── prisma/
│   └── schema.prisma             # PostgreSQL schema (synced with frontend)
├── migrations/
│   ├── run_migrations.sh         # Migration runner script
│   └── 001_initial_schema.sql    # Initial DB setup + seed data
├── main.py                       # FastAPI app entry point
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Python 3.12 Docker image
├── railway.json                  # Railway deployment config
└── seed_data.py                  # Database seeding script
```

### API Endpoints

#### Predictions API (`/api/v1/predictions/`)
```python
GET    /markets                    # List all prediction markets
GET    /markets/{market_id}        # Get specific market details
POST   /vote                       # Place YES/NO vote
GET    /markets/{market_id}/stats  # Market statistics
```

**Vote Request:**
```json
{
  "market_id": "eden-haus-hackathon",
  "wallet_address": "0x...",
  "choice": "YES",
  "amount": "10.50"
}
```

#### Markets API (`/api/v1/markets/`)
```python
GET    /                           # List active micro-markets (sports)
```
Returns randomized markets for demo purposes.

#### Bets API (`/api/v1/bets/`)
```python
POST   /confirm                    # Confirm bet after x402 payment
```
- Verifies x402 payment proof
- Updates PostgreSQL (Market pools, Bet record)
- Mints position token on blockchain
- Publishes pool update to Redis

#### x402 API (`/api/v1/x402/`)
```python
POST   /quote                      # Generate payment quote
POST   /verify                     # Verify payment completion
```

#### WebSocket (`/api/v1/ws/`)
```python
WS     /markets                    # Real-time market updates via Redis
```

### Core Services

#### 1. Contract Integration ([core/contracts.py](apps/backend/app/core/contracts.py))
- Direct Cronos JSON-RPC calls (no web3.py dependency)
- Functions:
  - `get_market(market_id)` - Read on-chain market data
  - `mint_position(wallet, market_id, choice, amount)` - Create position token

#### 2. Chainlink Integration ([core/chainlink.py](apps/backend/app/core/chainlink.py))
- Fetches oracle data for market resolution
- Currently mock implementation for demo

#### 3. Redis Services ([services/redis.py](apps/backend/app/services/redis.py))
- **Rate Limiting:** Request throttling per IP/wallet
- **Cache:** Live market data (300s TTL)
- **Pub/Sub:** Real-time WebSocket event broadcasting
- **Pattern:** `market:{marketId}` for targeted updates

#### 4. x402 Payment ([core/x402.py](apps/backend/app/core/x402.py))
- Payment quote generation
- Payment verification
- Mock implementation returning success for demo

### CORS Configuration

```python
allow_origins=[
    "http://localhost:3000",           # Local development
    "https://sportsbook-monorepo-frontend.vercel.app",
    "https://*.vercel.app"             # Vercel preview deployments
]
allow_methods=["GET", "POST", "PUT", "DELETE"]
allow_credentials=True
```

---

## Database Schema

**Database:** PostgreSQL 15+
**ORM:** Prisma (frontend) + SQLAlchemy (backend)
**Location:** [apps/frontend/lib/db/prisma/schema.prisma](apps/frontend/lib/db/prisma/schema.prisma)

### Tables

#### 1. Market
```prisma
model Market {
  id                 String       @id @default(cuid())
  marketId           String       @unique
  question           String
  status             String       @default("ACTIVE")  // ACTIVE, CLOSED, RESOLVED
  winner             String?      // YES or NO
  yesPool            BigInt       @default(0)         // 6 decimals (USDT)
  noPool             BigInt       @default(0)
  startDate          DateTime     @default(now())
  endDate            DateTime
  contractAddress    String                          // Cronos contract address
  gnosisSafeAddress  String                          // Gnosis Safe for funds
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  bets               Bet[]
  history            BetHistory[]
  snapshots          PoolSnapshot[]
}
```

**Example Market:**
```
marketId: "eden-haus-hackathon"
question: "Will Eden Haus win Best Hack at Cronos Hackathon 2026?"
yesPool: 100000000 (100 USDT)
noPool: 50000000 (50 USDT)
status: "ACTIVE"
```

#### 2. Bet
```prisma
model Bet {
  id            String       @id @default(cuid())
  walletAddress String
  marketId      String
  choice        String       // YES or NO
  amount        BigInt       // USDT (6 decimals)
  betNumber     Int          // 1-10 per wallet
  status        String       @default("CONFIRMED")
  txHash        String?      // Blockchain transaction hash
  createdAt     DateTime     @default(now())

  market        Market       @relation(fields: [marketId], references: [marketId])
  history       BetHistory[]

  @@unique([marketId, walletAddress, betNumber])
}
```

**Constraints:**
- Max 10 bets per wallet per market
- Unique combination of marketId + walletAddress + betNumber

#### 3. BetHistory
```prisma
model BetHistory {
  id              String    @id @default(cuid())
  betId           String
  marketId        String
  action          String    // PLACED, CONFIRMED, FLAGGED, CLAWED_BACK, REFUNDED
  amount          BigInt
  clawbackAmount  BigInt?
  txHash          String?
  metadata        Json?     // Additional context
  createdAt       DateTime  @default(now())

  bet             Bet       @relation(fields: [betId], references: [id])
  market          Market    @relation(fields: [marketId], references: [marketId])
}
```

**Purpose:** Audit trail for manipulation detection and clawbacks

#### 4. FlaggedWallet
```prisma
model FlaggedWallet {
  id            String    @id @default(cuid())
  walletAddress String    @unique
  reason        String    // Sybil attack, manipulation, etc.
  severity      String    // LOW, MEDIUM, HIGH, CRITICAL
  flaggedAt     DateTime  @default(now())
  unflaggedAt   DateTime?
  isActive      Boolean   @default(true)
}
```

**Features:**
- Prevent flagged wallets from placing bets
- Admin can unflag wallets
- Severity-based restrictions

#### 5. PoolSnapshot
```prisma
model PoolSnapshot {
  id         String    @id @default(cuid())
  marketId   String
  yesPool    BigInt
  noPool     BigInt
  totalBets  Int
  timestamp  DateTime  @default(now())

  market     Market    @relation(fields: [marketId], references: [marketId])
}
```

**Purpose:** Time-series analytics and charting

### Database Features

- **Automatic Timestamps:** `updatedAt` trigger on all tables
- **Cascading Deletes:** Removing market removes bets/history
- **Indexes:** Optimized queries on walletAddress, marketId, status
- **Seed Data:** Initial "Eden Haus Hackathon" market with sample pools

---

## Smart Contracts

**Blockchain:** Cronos (EVM-compatible, ChainID: 25)
**Development:** Hardhat 3.1.2
**Solidity Version:** 0.8.24
**Location:** [packages/contracts/](packages/contracts/)

### Contract Architecture

#### 1. PredictionMarket.sol (Main Contract - 562 lines)

**Purpose:** Core betting logic with comprehensive security measures

**Key Features:**
- Binary YES/NO prediction markets
- USDT-based betting (ERC20)
- Funds sent to Gnosis Safe
- Pausable & ReentrancyGuard
- Anti-manipulation systems

**Security Limits:**
```solidity
MIN_BET = 5 USDT
MAX_BET = 5000 USDT
COOLDOWN = 300 seconds between bets
MAX_BETS_PER_WALLET = 10
POOL_CAP_PERCENT = 10% (max wallet exposure)
BET_VELOCITY = Max 3 bets per hour
```

**Key Functions:**
```solidity
function createMarket(
    string calldata question,
    uint256 endDate,
    address gnosisSafeAddress
) external onlyOwner returns (uint256);

function placeBet(
    uint256 marketId,
    bool choice,  // true = YES, false = NO
    uint256 amount
) external nonReentrant whenNotPaused;

function closeMarket(uint256 marketId) external onlyOwner;

function resolveMarket(
    uint256 marketId,
    bool winner  // true = YES, false = NO
) external onlyOwner;

function flagWallet(address wallet, string calldata reason) external onlyAdmin;
```

**Events:**
```solidity
event MarketCreated(uint256 indexed marketId, string question, uint256 endDate);
event BetPlaced(uint256 indexed marketId, address indexed bettor, bool choice, uint256 amount);
event MarketClosed(uint256 indexed marketId);
event MarketResolved(uint256 indexed marketId, bool winner);
event WalletFlagged(address indexed wallet, string reason);
```

#### 2. MarketManager.sol

**Purpose:** ERC1155 position tokens and market lifecycle

**Features:**
- Multi-market management
- House edge: 2% (200 basis points)
- Chainlink oracle integration
- Settlement logic

**Key Functions:**
```solidity
function createMarket(
    string calldata question,
    uint256 closingTime
) external returns (uint256);

function openPosition(
    uint256 marketId,
    bool outcome,
    uint256 amount
) external payable;

function settleMarket(
    uint256 marketId,
    bool result
) external;
```

#### 3. PositionToken.sol

**Purpose:** ERC1155 NFT representing bet positions

**Token IDs:**
- `marketId * 2 + 0` = YES position
- `marketId * 2 + 1` = NO position

#### 4. Settlement.sol

**Purpose:** Market resolution and payout distribution

**Calculation:**
```
Winning Pool = Total Pool * (1 - houseEdge)
Payout = (user stake / winning pool) * total pool
```

### Hardhat Configuration

```typescript
networks: {
  cronos: {
    url: "https://evm.cronos.org",
    chainId: 25,
    accounts: [process.env.PRIVATE_KEY]
  },
  "cronos-testnet": {
    url: "https://evm-t3.cronos.org",
    chainId: 338,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

**Deployment:** Use `npx hardhat run scripts/deploy.js --network cronos`

---

## Communication Flow

### 1. Market Data Flow

```
┌─────────┐    GET /api/v1/predictions/markets    ┌─────────┐
│ Frontend│──────────────────────────────────────>│ Backend │
└─────────┘                                        └─────────┘
     │                                                  │
     │                                                  ▼
     │                                           ┌──────────┐
     │                                           │PostgreSQL│
     │                                           └──────────┘
     │          VoteResponse (JSON)                   │
     │<──────────────────────────────────────────────┘
     │
     ▼
┌──────────────┐
│React Query   │  Cache: 30s staleTime
│(TanStack)    │  Auto-refetch: onWindowFocus
└──────────────┘
     │
     │         SSE: /api/markets/live-stats
     ├────────────────────────────────────────>┌─────────┐
     │                                          │  SSE    │
     │          POOL_UPDATE events              │Endpoint │
     │<─────────────────────────────────────────└─────────┘
     │                                                 ▲
     │                                                 │
     │                                          ┌──────┴───┐
     │                                          │  Redis   │
     └──────────────────────────────────────────│  Pub/Sub │
                                                └──────────┘
```

**Flow Steps:**
1. Frontend requests markets from backend
2. Backend queries PostgreSQL
3. Frontend caches response (React Query)
4. Frontend subscribes to SSE endpoint
5. Backend publishes pool updates to Redis
6. SSE pushes updates to all connected clients
7. Frontend updates UI in real-time

### 2. Bet Placement Flow

```
┌─────────┐                                         ┌─────────┐
│  User   │  Selects YES/NO + amount                │ Frontend│
│         │────────────────────────────────────────>│         │
└─────────┘                                         └─────────┘
                                                         │
                                                         │ Client-side
                                                         │ validation
                                                         ▼
                                                  ┌──────────────┐
                                                  │useBetValidate│
                                                  └──────────────┘
                                                         │
    POST /api/v1/predictions/vote                       │
┌──────────────────────────────────────────────────────┘
│
▼
┌─────────┐     1. Validate request         ┌──────────────┐
│ Backend │────────────────────────────────>│Pydantic Model│
└─────────┘                                  └──────────────┘
     │
     │ 2. Check wallet not flagged
     ▼
┌─────────────┐
│FlaggedWallet│
└─────────────┘
     │
     │ 3. Update pools + create bet record
     ▼
┌──────────┐
│PostgreSQL│  BEGIN TRANSACTION
└──────────┘    UPDATE Market.yesPool += amount
     │          INSERT INTO Bet (...)
     │          INSERT INTO BetHistory (action='CONFIRMED')
     │        COMMIT
     │
     │ 4. Publish to Redis
     ▼
┌──────┐     PUBLISH market:eden-haus-hackathon
│Redis │<────────────────────────────────────────
└──────┘     { yesPool, noPool, timestamp }
     │
     │ 5. Broadcast to SSE clients
     ▼
┌─────────────┐
│All Connected│  POOL_UPDATE event
│SSE Clients  │<─────────────────────────
└─────────────┘

     │ 6. Return VoteResponse
     ▼
┌─────────┐     { success, newYesPool, newNoPool }
│ Frontend│<──────────────────────────────────────
└─────────┘
     │
     │ 7. Optimistic UI update
     ▼
┌──────────┐
│React Query│  Invalidate cache, refetch
└───────────┘
```

### 3. x402 Payment Flow

```
┌──────┐                                              ┌─────────┐
│ User │  Places bet                                  │ Frontend│
│      │─────────────────────────────────────────────>│         │
└──────┘                                              └─────────┘
                                                           │
         POST /api/x402/place-bet                         │
         ┌────────────────────────────────────────────────┘
         │
         ▼
    ┌─────────┐    Returns 402 Payment Required     ┌─────────┐
    │ Backend │───────────────────────────────────>│ Frontend│
    └─────────┘    { quote_id, amount, recipient }  └─────────┘
                                                           │
                                                           │ Trigger wallet
                                                           ▼
                                                      ┌─────────┐
                                                      │  User   │
                                                      │ Wallet  │
                                                      └─────────┘
                                                           │
                                                           │ Sign tx
                                                           ▼
                                                      ┌──────────┐
                                                      │Blockchain│
                                                      └──────────┘
                                                           │
         POST /api/x402/place-bet                         │
         (with payment proof)                             │
         ┌────────────────────────────────────────────────┘
         │
         ▼
    ┌─────────┐    1. Verify payment               ┌──────────┐
    │ Backend │───────────────────────────────────>│x402 Core │
    └─────────┘                                     └──────────┘
         │
         │ 2. Confirm bet
         ▼
    ┌─────────┐    POST /api/v1/bets/confirm
    │Backend  │
    └─────────┘
         │
         │ 3. Update database
         ▼
    ┌──────────┐
    │PostgreSQL│
    └──────────┘
         │
         │ 4. Mint position token
         ▼
    ┌──────────┐    Call mint_position()          ┌─────────────────┐
    │Backend   │────────────────────────────────>│Smart Contract   │
    └──────────┘                                   │(Cronos)         │
         │                                         └─────────────────┘
         │ 5. Return success
         ▼
    ┌─────────┐
    │ Frontend│  Display confirmation
    └─────────┘
```

### 4. Real-Time Updates (SSE)

**Endpoint:** `GET /api/markets/live-stats?marketId=eden-haus-hackathon`

**Event Types:**
```typescript
// Pool update event
{
  event: "POOL_UPDATE",
  data: {
    marketId: "eden-haus-hackathon",
    yesPool: "105.50",
    noPool: "52.25",
    timestamp: "2026-01-16T12:34:56Z"
  }
}

// Market status change
{
  event: "MARKET_UPDATE",
  data: {
    marketId: "eden-haus-hackathon",
    status: "CLOSED",
    winner: "YES"
  }
}

// Error event
{
  event: "ERROR",
  data: {
    message: "Market not found"
  }
}
```

**Client Implementation:**
```typescript
const { data, isConnected } = useSSE<PoolUpdate>(
  `/api/markets/live-stats?marketId=${marketId}`
);
```

---

## Configuration & Environment

### Frontend Environment Variables

**File:** [apps/frontend/.env.local.example](apps/frontend/.env.local.example)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# WalletConnect
NEXT_PUBLIC_REOWN_PROJECT_ID=your_walletconnect_project_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/degenhouse

# Optional: Blockchain RPC
NEXT_PUBLIC_CRONOS_RPC=https://evm.cronos.org
```

### Backend Environment Variables

**File:** [apps/backend/.env.example](apps/backend/.env.example)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/degenhouse

# Redis
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://*.vercel.app

# Blockchain
CRONOS_RPC_URL=https://evm.cronos.org
CRONOS_TESTNET_RPC_URL=https://evm-t3.cronos.org
CONTRACT_ADDRESS=0x...
USDT_ADDRESS=0xF0F161fDA2712DB8b566946122a5af183995e2eD
GNOSIS_SAFE_ADDRESS=0x...

# API Keys
CHAINLINK_API_KEY=your_chainlink_key
X402_API_KEY=your_x402_key

# Server
PORT=8000
DEBUG=false
```

### Smart Contracts Environment

**File:** [packages/contracts/.env.local](packages/contracts/.env.local)

```bash
# Deployment
PRIVATE_KEY=your_private_key_here

# RPC Endpoints
CRONOS_RPC_URL=https://evm.cronos.org
CRONOS_TESTNET_RPC_URL=https://evm-t3.cronos.org

# Verification
CRONOSCAN_API_KEY=your_cronoscan_api_key
```

---

## Deployment

### Frontend Deployment (Vercel/Railway)

**Docker Configuration:** [apps/frontend/Dockerfile](apps/frontend/Dockerfile)

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

**Railway Config:** [apps/frontend/railway.json](apps/frontend/railway.json)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Build Command:** `npm run build`
**Start Command:** Automatic (from Dockerfile)

### Backend Deployment (Railway)

**Docker Configuration:** [apps/backend/Dockerfile](apps/backend/Dockerfile)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Railway Config:** [apps/backend/railway.json](apps/backend/railway.json)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Environment Variables Required:**
- `DATABASE_URL`
- `REDIS_URL`
- `CRONOS_RPC_URL`
- `CONTRACT_ADDRESS`

### Database Migrations

**Migration Script:** [apps/backend/migrations/run_migrations.sh](apps/backend/migrations/run_migrations.sh)

```bash
#!/bin/bash
psql $DATABASE_URL < migrations/001_initial_schema.sql
```

**Initial Schema:** [apps/backend/migrations/001_initial_schema.sql](apps/backend/migrations/001_initial_schema.sql)
- Creates all tables (Market, Bet, BetHistory, FlaggedWallet, PoolSnapshot)
- Adds indexes for performance
- Seeds "Eden Haus Hackathon" market
- Creates `updated_at` trigger

**Run Migration:**
```bash
cd apps/backend
chmod +x migrations/run_migrations.sh
./migrations/run_migrations.sh
```

### Smart Contract Deployment

**Deploy Script:**
```bash
cd packages/contracts
npx hardhat run scripts/deploy.js --network cronos
```

**Verification:**
```bash
npx hardhat verify --network cronos <CONTRACT_ADDRESS> "Constructor Args"
```

---

## Tech Stack

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.1.0 |
| Language | TypeScript | 5.5.3 |
| Styling | Tailwind CSS | 3.4.10 |
| UI Library | Radix UI | Latest |
| State | React Query | 5.59.0 |
| Blockchain | wagmi | 2.16.0 |
| Blockchain | viem | 2.22.0 |
| Wallet | @reown/appkit | 1.4.7 |
| ORM | Prisma | 6.1.0 |
| Animations | Framer Motion | 11.5.6 |
| Charts | Recharts | 2.12.7 |

### Backend

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | FastAPI | 0.115.0 |
| Server | Uvicorn | 0.30.6 |
| Language | Python | 3.12 |
| ORM | SQLAlchemy | 2.0.23 |
| Validation | Pydantic | 2.9.2 |
| Cache | Redis | 5.2.1 |
| Database | PostgreSQL | 15+ |
| Migrations | Alembic | 1.13.0 |
| HTTP | httpx | 0.27.0 |

### Smart Contracts

| Category | Technology | Version |
|----------|-----------|---------|
| Language | Solidity | 0.8.24 |
| Framework | Hardhat | 3.1.2 |
| Standards | OpenZeppelin | Latest |
| Oracle | Chainlink | Latest |
| Network | Cronos | Mainnet (25) |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway | Backend + Database |
| PostgreSQL | Relational database |
| Redis | Cache + Pub/Sub |
| Cronos | Blockchain network |

---

## Security & Design Patterns

### Frontend Patterns

1. **App Router with Server Components**
   - Leverage Next.js 15 RSC for optimal performance
   - Server-side data fetching where appropriate
   - Client components only where interactivity needed

2. **Custom Hook Architecture**
   - `usePredictionMarket` - Encapsulates market data + SSE
   - `useContractBet` - Blockchain interaction abstraction
   - `useBetValidation` - Client-side validation logic
   - `useSSE` - Generic Server-Sent Events hook

3. **Optimistic Updates**
   - Immediate UI feedback on bet placement
   - Background sync with backend
   - Automatic rollback on failure

4. **Type Safety**
   - Full TypeScript with strict mode
   - Shared types between frontend/backend
   - Zod/Pydantic schema validation

5. **Error Boundaries**
   - Graceful error handling
   - Fallback UI for failed states
   - Error logging and monitoring

### Backend Patterns

1. **Clean Architecture**
   - **API Layer:** Route handlers, request/response
   - **Core Layer:** Business logic, integrations
   - **Services Layer:** External services, caching
   - **Models Layer:** Data schemas, validation

2. **Async/Await**
   - FastAPI async for high concurrency
   - Non-blocking I/O for database/Redis
   - Parallel processing where possible

3. **Pydantic Validation**
   - Automatic request validation
   - Type-safe response models
   - Custom validators for complex logic

4. **Redis Pub/Sub**
   - Real-time event broadcasting
   - Decoupled microservices communication
   - Scalable to multiple backend instances

5. **Repository Pattern**
   - SQLAlchemy ORM abstraction
   - Testable database interactions
   - Easy to swap database implementations

### Smart Contract Patterns

1. **Security-First Design**
   - `ReentrancyGuard` - Prevent reentrancy attacks
   - `Pausable` - Emergency stop mechanism
   - `Ownable` - Admin functions protection
   - Rate limiting and cooldown periods

2. **Checks-Effects-Interactions**
   - Validate inputs first
   - Update state second
   - External calls last
   - Prevents reentrancy vulnerabilities

3. **Event-Driven Architecture**
   - Comprehensive event emissions
   - Off-chain indexing support
   - Audit trail for all actions

4. **Modular Design**
   - Separate contracts for different concerns
   - Upgradeable via proxy pattern (if needed)
   - Composable functionality

5. **Gas Optimization**
   - `immutable` for constants
   - Efficient storage layout
   - Batch operations where possible

### Security Measures

#### Application Security

| Measure | Implementation |
|---------|----------------|
| Rate Limiting | Redis-based per IP/wallet |
| CORS | Whitelist-based origins |
| Input Validation | Pydantic + Zod schemas |
| SQL Injection | Parameterized queries (SQLAlchemy) |
| XSS Protection | React auto-escaping |
| CSRF | SameSite cookies |

#### Blockchain Security

| Measure | Implementation |
|---------|----------------|
| Wallet Flagging | Sybil attack prevention |
| Bet Velocity | Max 3 bets/hour |
| Pool Concentration | Max 10% per wallet |
| Cooldown Periods | 300s between bets |
| Min/Max Bet | 5-5000 USDT limits |
| Contract Pause | Emergency stop |

#### Database Security

- **Connection Pooling:** Prevent connection exhaustion
- **Prepared Statements:** SQL injection prevention
- **Cascade Deletes:** Data integrity
- **Audit Trail:** BetHistory for all actions
- **Backup Strategy:** Regular automated backups

---

## Performance Optimizations

### Frontend

- **Code Splitting:** Next.js automatic route-based splitting
- **Image Optimization:** `next/image` with WebP
- **Bundle Analysis:** `next-bundle-analyzer`
- **React Query Caching:** 30s stale time, 5min cache
- **SSE Instead of Polling:** Reduce server load
- **Lazy Loading:** Dynamic imports for heavy components

### Backend

- **Redis Caching:** 300s TTL for market data
- **Database Indexes:** Optimized queries
- **Connection Pooling:** SQLAlchemy pool (5-20 connections)
- **Async I/O:** Non-blocking database/Redis calls
- **Response Compression:** Gzip middleware

### Smart Contracts

- **Immutable Variables:** Save gas on reads
- **Events Over Storage:** Cheaper than state changes
- **Batch Operations:** Reduce transaction count
- **Efficient Data Structures:** Mappings over arrays

---

## Monitoring & Observability

### Recommended Tools

- **Frontend:** Vercel Analytics, Sentry
- **Backend:** Railway metrics, Datadog
- **Database:** PostgreSQL logs, pgAdmin
- **Blockchain:** Cronos Explorer, Tenderly

### Key Metrics

- **Frontend:**
  - Core Web Vitals (LCP, FID, CLS)
  - API response times
  - Error rates
  - Wallet connection success rate

- **Backend:**
  - Request latency (p50, p95, p99)
  - Database query times
  - Redis hit/miss ratio
  - WebSocket connection count

- **Smart Contracts:**
  - Gas costs per transaction
  - Failed transaction rate
  - Contract balance
  - Event emission counts

---

## Future Enhancements

### Planned Features

1. **Multi-Sport Support**
   - NBA, NFL, Soccer, Esports
   - Sport-specific market templates

2. **Advanced Analytics**
   - Historical odds charts
   - User performance dashboard
   - Market liquidity metrics

3. **Social Features**
   - Leaderboards
   - Bet sharing
   - Community predictions

4. **Mobile App**
   - React Native app
   - Push notifications
   - Biometric authentication

5. **Advanced Markets**
   - Multi-outcome markets (beyond binary)
   - Parlay bets
   - Live in-game betting

### Technical Debt

- Replace mock x402 with real implementation
- Add comprehensive E2E tests
- Implement contract upgrade mechanism
- Add backend API rate limiting per endpoint
- Implement WebSocket fallback for SSE

---

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.12+
- PostgreSQL 15+
- Redis 7+
- MetaMask or compatible wallet

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/DegenHouse.git
cd DegenHouse

# Install dependencies
npm install

# Setup environment variables
cp apps/frontend/.env.local.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env

# Start database & Redis
docker-compose up -d postgres redis

# Run migrations
cd apps/backend
./migrations/run_migrations.sh

# Generate Prisma client
cd apps/frontend
npx prisma generate

# Start development servers
cd ../..
npm run dev  # Starts frontend + backend concurrently
```

### Project Commands

```bash
# Monorepo
npm run dev              # Start all apps
npm run build            # Build all apps
npm run clean            # Clean build artifacts

# Frontend
npm run dev:frontend     # Start Next.js dev server
npm run build:frontend   # Build Next.js app

# Backend
npm run dev:backend      # Start FastAPI with hot reload
npm run migrate          # Run database migrations

# Smart Contracts
npm run compile          # Compile contracts
npm run deploy:testnet   # Deploy to Cronos testnet
npm run deploy:mainnet   # Deploy to Cronos mainnet
```

---

## Documentation

- [Configuration Guide](CONFIG.md)
- [Database Schema](DATABASE.md)
- [Security Guidelines](SECURITY.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Setup Checklist](SETUP_CHECKLIST.md)

---

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ by the DegenHouse Team**
**Eden Haus • Est. 2026 • By invitation**
