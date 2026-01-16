# Database Guide - PostgreSQL Setup & Schema

Complete guide for setting up and managing the PostgreSQL database for the DegenHouse prediction market.

## Table of Contents
- [Database Architecture](#database-architecture)
- [Schema Overview](#schema-overview)
- [Setup Instructions](#setup-instructions)
- [Migrations](#migrations)
- [Prisma Integration](#prisma-integration)
- [Python SQLAlchemy Setup](#python-sqlalchemy-setup)
- [Queries & Operations](#queries--operations)
- [Maintenance](#maintenance)

---

## Database Architecture

### Technology Stack
- **Database:** PostgreSQL 15+
- **ORM (Frontend):** Prisma (TypeScript)
- **ORM (Backend):** SQLAlchemy (Python) - *optional, can use Prisma*
- **Hosting:** Railway PostgreSQL
- **Connection Pooling:** PgBouncer (automatic with Railway)

### Database Structure

```
┌─────────────────────────────────────────────────┐
│                   Markets                       │
│  - Market metadata and configuration            │
│  - YES/NO pools tracking                        │
│  - Resolution status                            │
└─────────────┬───────────────────────────────────┘
              │
              ├─────────────────────────────────────┐
              │                                     │
    ┌─────────▼─────────┐              ┌──────────▼─────────┐
    │       Bets        │              │    BetHistory      │
    │  - User bets      │              │  - Audit trail     │
    │  - Amounts        │              │  - Clawbacks       │
    │  - Choices        │              │  - Flagging logs   │
    └─────────┬─────────┘              └────────────────────┘
              │
    ┌─────────▼──────────┐
    │  FlaggedWallets    │
    │  - Sybil detection │
    │  - Manipulation    │
    └────────────────────┘

    ┌────────────────────┐
    │  PoolSnapshots     │
    │  - Historical data │
    │  - Analytics       │
    └────────────────────┘
```

---

## Schema Overview

### 1. Markets Table
Stores prediction market metadata and state.

```sql
CREATE TABLE "Market" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "marketId" TEXT UNIQUE NOT NULL,           -- Smart contract market ID
    question TEXT NOT NULL,                    -- "Will Eden Haus win?"
    status TEXT DEFAULT 'ACTIVE',              -- ACTIVE, CLOSED, RESOLVED
    winner TEXT,                               -- YES or NO (after resolution)

    "yesPool" BIGINT DEFAULT 0,                -- Total USDT on YES (6 decimals)
    "noPool" BIGINT DEFAULT 0,                 -- Total USDT on NO (6 decimals)

    "startDate" TIMESTAMP NOT NULL DEFAULT NOW(),
    "endDate" TIMESTAMP NOT NULL,              -- When betting closes

    "contractAddress" TEXT NOT NULL,           -- PredictionMarket contract
    "gnosisSafeAddress" TEXT NOT NULL,         -- Where deposits go

    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_market_marketId ON "Market"("marketId");
CREATE INDEX idx_market_status ON "Market"(status);
CREATE INDEX idx_market_endDate ON "Market"("endDate");
```

**Example Data:**
```json
{
  "marketId": "eden-haus-hackathon",
  "question": "Will Eden Haus win the Cronos x402 Hackathon?",
  "status": "ACTIVE",
  "yesPool": 535000000,  // 535 USDT (6 decimals)
  "noPool": 725000000,   // 725 USDT
  "endDate": "2026-02-16T09:00:00Z"
}
```

### 2. Bets Table
Stores individual user bets.

```sql
CREATE TABLE "Bet" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),

    "walletAddress" TEXT NOT NULL,             -- User's wallet (0x...)
    "marketId" TEXT NOT NULL,                  -- FK to Market.marketId

    choice TEXT NOT NULL,                      -- YES or NO
    amount BIGINT NOT NULL,                    -- USDT amount (6 decimals)
    "betNumber" INTEGER NOT NULL,              -- 1-10 (nth bet for wallet)

    status TEXT DEFAULT 'CONFIRMED',           -- PENDING, CONFIRMED, FLAGGED, CLAWED_BACK
    "txHash" TEXT,                             -- Blockchain transaction hash

    "createdAt" TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE,
    UNIQUE ("marketId", "walletAddress", "betNumber")
);

CREATE INDEX idx_bet_wallet ON "Bet"("walletAddress");
CREATE INDEX idx_bet_marketId ON "Bet"("marketId");
CREATE INDEX idx_bet_status ON "Bet"(status);
CREATE INDEX idx_bet_createdAt ON "Bet"("createdAt");
CREATE INDEX idx_bet_choice ON "Bet"(choice);
```

**Example Data:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  "marketId": "eden-haus-hackathon",
  "choice": "YES",
  "amount": 10000000,  // 10 USDT
  "betNumber": 1,
  "status": "CONFIRMED",
  "txHash": "0xabc123..."
}
```

### 3. BetHistory Table
Immutable audit trail for compliance and debugging.

```sql
CREATE TABLE "BetHistory" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),

    "betId" TEXT NOT NULL,                     -- FK to Bet.id
    "marketId" TEXT NOT NULL,                  -- Denormalized for queries
    wallet TEXT NOT NULL,                      -- Denormalized for queries

    action TEXT NOT NULL,                      -- PLACED, CONFIRMED, FLAGGED, CLAWED_BACK, REFUNDED
    reason TEXT,                               -- Why (e.g., "Velocity exceeded")

    "clawbackAmount" BIGINT,                   -- Amount returned if clawed back
    "clawbackTxHash" TEXT,                     -- Refund transaction hash

    "createdAt" TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY ("betId") REFERENCES "Bet"(id) ON DELETE CASCADE,
    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE
);

CREATE INDEX idx_bethistory_betId ON "BetHistory"("betId");
CREATE INDEX idx_bethistory_marketId ON "BetHistory"("marketId");
CREATE INDEX idx_bethistory_wallet ON "BetHistory"(wallet);
CREATE INDEX idx_bethistory_action ON "BetHistory"(action);
CREATE INDEX idx_bethistory_createdAt ON "BetHistory"("createdAt");
```

### 4. FlaggedWallet Table
Tracks wallets flagged for suspicious activity.

```sql
CREATE TABLE "FlaggedWallet" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),

    wallet TEXT UNIQUE NOT NULL,               -- Wallet address
    "marketId" TEXT NOT NULL,                  -- Which market
    reason TEXT NOT NULL,                      -- "Velocity exceeded", "Concentration"
    severity TEXT DEFAULT 'MEDIUM',            -- LOW, MEDIUM, HIGH, CRITICAL

    "isActive" BOOLEAN DEFAULT TRUE,           -- Can be unflagged by admin

    "createdAt" TIMESTAMP DEFAULT NOW(),
    "unflaggedAt" TIMESTAMP
);

CREATE INDEX idx_flaggedwallet_wallet ON "FlaggedWallet"(wallet);
CREATE INDEX idx_flaggedwallet_marketId ON "FlaggedWallet"("marketId");
CREATE INDEX idx_flaggedwallet_isActive ON "FlaggedWallet"("isActive");
```

### 5. PoolSnapshot Table
Historical pool data for analytics and charts.

```sql
CREATE TABLE "PoolSnapshot" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),

    "marketId" TEXT NOT NULL,                  -- Which market
    "yesPool" BIGINT NOT NULL,                 -- YES pool at snapshot time
    "noPool" BIGINT NOT NULL,                  -- NO pool at snapshot time
    "totalBets" INTEGER NOT NULL,              -- Number of bets

    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_poolsnapshot_marketId ON "PoolSnapshot"("marketId");
CREATE INDEX idx_poolsnapshot_createdAt ON "PoolSnapshot"("createdAt");
```

---

## Setup Instructions

### Option 1: Using Railway (Recommended for Production)

Already covered in [CONFIG.md](CONFIG.md#step-2-deploy-postgresql-database). Railway automatically:
- ✅ Provisions PostgreSQL 15+
- ✅ Creates `DATABASE_URL` environment variable
- ✅ Enables SSL
- ✅ Sets up connection pooling
- ✅ Provides automatic backups

### Option 2: Local Development with Docker

```bash
# Create docker-compose.yml in project root
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: degenhouse-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: degenhouse
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: degenhouse-redis
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

# Start services
docker-compose up -d

# Set environment variable
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/degenhouse" > apps/backend/.env
```

### Option 3: Local PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb degenhouse

# Set environment variable
export DATABASE_URL="postgresql://localhost:5432/degenhouse"
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql-15
sudo systemctl start postgresql
sudo -u postgres createdb degenhouse
```

---

## Migrations

### Using Prisma (Recommended)

Prisma schema is already defined at `apps/frontend/lib/db/prisma/schema.prisma`.

#### 1. Install Prisma CLI

```bash
cd apps/frontend
npm install -D prisma
npm install @prisma/client
```

#### 2. Set Database URL

```bash
# .env file in apps/frontend
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

For Railway:
```bash
# Get the URL from Railway dashboard
railway variables get DATABASE_URL

# Or link Railway and use railway CLI
railway run prisma migrate dev
```

#### 3. Create Initial Migration

```bash
cd apps/frontend

# Generate migration
npx prisma migrate dev --name init

# This creates:
# - SQL migration file
# - Applies it to database
# - Generates Prisma Client
```

#### 4. Apply Migrations to Production

```bash
# From Railway CLI
railway run npx prisma migrate deploy

# Or directly with DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

#### 5. Generate Prisma Client

```bash
npx prisma generate
```

This creates the TypeScript client in `node_modules/@prisma/client`.

### Manual SQL Migration (Alternative)

If you prefer raw SQL:

```bash
# Create migration file
cat > apps/backend/migrations/001_initial_schema.sql << 'EOF'
-- Initial schema for DegenHouse Prediction Market

-- Markets Table
CREATE TABLE IF NOT EXISTS "Market" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "marketId" TEXT UNIQUE NOT NULL,
    question TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    winner TEXT,
    "yesPool" BIGINT DEFAULT 0,
    "noPool" BIGINT DEFAULT 0,
    "startDate" TIMESTAMP NOT NULL DEFAULT NOW(),
    "endDate" TIMESTAMP NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "gnosisSafeAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Indexes for Market
CREATE INDEX IF NOT EXISTS idx_market_marketId ON "Market"("marketId");
CREATE INDEX IF NOT EXISTS idx_market_status ON "Market"(status);
CREATE INDEX IF NOT EXISTS idx_market_endDate ON "Market"("endDate");

-- Bets Table
CREATE TABLE IF NOT EXISTS "Bet" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "walletAddress" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    choice TEXT NOT NULL,
    amount BIGINT NOT NULL,
    "betNumber" INTEGER NOT NULL,
    status TEXT DEFAULT 'CONFIRMED',
    "txHash" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE,
    UNIQUE ("marketId", "walletAddress", "betNumber")
);

-- Indexes for Bet
CREATE INDEX IF NOT EXISTS idx_bet_wallet ON "Bet"("walletAddress");
CREATE INDEX IF NOT EXISTS idx_bet_marketId ON "Bet"("marketId");
CREATE INDEX IF NOT EXISTS idx_bet_status ON "Bet"(status);
CREATE INDEX IF NOT EXISTS idx_bet_createdAt ON "Bet"("createdAt");
CREATE INDEX IF NOT EXISTS idx_bet_choice ON "Bet"(choice);

-- BetHistory Table
CREATE TABLE IF NOT EXISTS "BetHistory" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "betId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    wallet TEXT NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    "clawbackAmount" BIGINT,
    "clawbackTxHash" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("betId") REFERENCES "Bet"(id) ON DELETE CASCADE,
    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE
);

-- Indexes for BetHistory
CREATE INDEX IF NOT EXISTS idx_bethistory_betId ON "BetHistory"("betId");
CREATE INDEX IF NOT EXISTS idx_bethistory_marketId ON "BetHistory"("marketId");
CREATE INDEX IF NOT EXISTS idx_bethistory_wallet ON "BetHistory"(wallet);
CREATE INDEX IF NOT EXISTS idx_bethistory_action ON "BetHistory"(action);
CREATE INDEX IF NOT EXISTS idx_bethistory_createdAt ON "BetHistory"("createdAt");

-- FlaggedWallet Table
CREATE TABLE IF NOT EXISTS "FlaggedWallet" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    wallet TEXT UNIQUE NOT NULL,
    "marketId" TEXT NOT NULL,
    reason TEXT NOT NULL,
    severity TEXT DEFAULT 'MEDIUM',
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "unflaggedAt" TIMESTAMP
);

-- Indexes for FlaggedWallet
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_wallet ON "FlaggedWallet"(wallet);
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_marketId ON "FlaggedWallet"("marketId");
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_isActive ON "FlaggedWallet"("isActive");

-- PoolSnapshot Table
CREATE TABLE IF NOT EXISTS "PoolSnapshot" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "marketId" TEXT NOT NULL,
    "yesPool" BIGINT NOT NULL,
    "noPool" BIGINT NOT NULL,
    "totalBets" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Indexes for PoolSnapshot
CREATE INDEX IF NOT EXISTS idx_poolsnapshot_marketId ON "PoolSnapshot"("marketId");
CREATE INDEX IF NOT EXISTS idx_poolsnapshot_createdAt ON "PoolSnapshot"("createdAt");

-- Insert initial market
INSERT INTO "Market" (
    "marketId",
    question,
    status,
    "yesPool",
    "noPool",
    "startDate",
    "endDate",
    "contractAddress",
    "gnosisSafeAddress"
) VALUES (
    'eden-haus-hackathon',
    'Will Eden Haus win the Cronos x402 Hackathon?',
    'ACTIVE',
    525000000,
    725000000,
    NOW(),
    NOW() + INTERVAL '31 days',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000'
) ON CONFLICT ("marketId") DO NOTHING;
EOF

# Apply migration
psql "$DATABASE_URL" < apps/backend/migrations/001_initial_schema.sql
```

---

## Prisma Integration

The Prisma schema is already set up at `apps/frontend/lib/db/prisma/schema.prisma`.

### Using Prisma in Frontend (Next.js)

```typescript
// lib/db/prisma/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Example Queries

```typescript
import { prisma } from '@/lib/db/prisma/client'

// Get a market
const market = await prisma.market.findUnique({
  where: { marketId: 'eden-haus-hackathon' },
  include: {
    bets: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
})

// Place a bet
const bet = await prisma.bet.create({
  data: {
    walletAddress: '0x...',
    marketId: 'eden-haus-hackathon',
    choice: 'YES',
    amount: 10000000n, // 10 USDT
    betNumber: 1,
    status: 'CONFIRMED'
  }
})

// Update pool
await prisma.market.update({
  where: { marketId: 'eden-haus-hackathon' },
  data: {
    yesPool: { increment: 10000000n }
  }
})

// Get user bets
const userBets = await prisma.bet.findMany({
  where: {
    walletAddress: '0x...',
    marketId: 'eden-haus-hackathon'
  },
  orderBy: { createdAt: 'desc' }
})
```

---

## Python SQLAlchemy Setup

If you want to use the database from the Python backend:

### 1. Update Requirements

```bash
# Add to apps/backend/requirements.txt
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.13.0
```

### 2. Create Models

```python
# apps/backend/app/models/db.py
from sqlalchemy import create_engine, Column, String, BigInteger, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Market(Base):
    __tablename__ = "Market"

    id = Column(String, primary_key=True)
    marketId = Column(String, unique=True, nullable=False)
    question = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")
    winner = Column(String)
    yesPool = Column(BigInteger, default=0)
    noPool = Column(BigInteger, default=0)
    startDate = Column(DateTime, default=datetime.utcnow)
    endDate = Column(DateTime, nullable=False)
    contractAddress = Column(String, nullable=False)
    gnosisSafeAddress = Column(String, nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    bets = relationship("Bet", back_populates="market")

class Bet(Base):
    __tablename__ = "Bet"

    id = Column(String, primary_key=True)
    walletAddress = Column(String, nullable=False)
    marketId = Column(String, ForeignKey("Market.marketId"), nullable=False)
    choice = Column(String, nullable=False)
    amount = Column(BigInteger, nullable=False)
    betNumber = Column(Integer, nullable=False)
    status = Column(String, default="CONFIRMED")
    txHash = Column(String)
    createdAt = Column(DateTime, default=datetime.utcnow)

    market = relationship("Market", back_populates="bets")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 3. Use in FastAPI

```python
# In your route handler
from fastapi import Depends
from sqlalchemy.orm import Session
from app.models.db import get_db, Market

@router.get("/markets/{market_id}")
async def get_market(market_id: str, db: Session = Depends(get_db)):
    market = db.query(Market).filter(Market.marketId == market_id).first()
    if not market:
        raise HTTPException(status_code=404, detail="Market not found")
    return market
```

---

## Queries & Operations

### Common Queries

#### 1. Get Market with Statistics

```sql
SELECT
    m."marketId",
    m.question,
    m.status,
    m."yesPool",
    m."noPool",
    (m."yesPool" + m."noPool") as "totalPool",
    ROUND(100.0 * m."yesPool" / NULLIF(m."yesPool" + m."noPool", 0), 1) as "yesPercent",
    COUNT(b.id) as "totalBets",
    COUNT(DISTINCT b."walletAddress") as "uniqueWallets"
FROM "Market" m
LEFT JOIN "Bet" b ON m."marketId" = b."marketId" AND b.status = 'CONFIRMED'
WHERE m."marketId" = 'eden-haus-hackathon'
GROUP BY m.id;
```

#### 2. Get User Bet History

```sql
SELECT
    b.choice,
    b.amount,
    b.status,
    b."txHash",
    b."createdAt",
    m.question,
    m.status as "marketStatus"
FROM "Bet" b
JOIN "Market" m ON b."marketId" = m."marketId"
WHERE b."walletAddress" = '0x...'
ORDER BY b."createdAt" DESC;
```

#### 3. Detect High Velocity Wallets

```sql
SELECT
    "walletAddress",
    COUNT(*) as bet_count,
    SUM(amount) as total_amount
FROM "Bet"
WHERE "createdAt" > NOW() - INTERVAL '1 hour'
GROUP BY "walletAddress"
HAVING COUNT(*) >= 3
ORDER BY bet_count DESC;
```

#### 4. Pool History (Time Series)

```sql
SELECT
    "createdAt",
    "yesPool",
    "noPool",
    "totalBets"
FROM "PoolSnapshot"
WHERE "marketId" = 'eden-haus-hackathon'
ORDER BY "createdAt" DESC
LIMIT 50;
```

### Maintenance Queries

#### Backup Database

```bash
# Backup all tables
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d).sql

# Backup specific table
pg_dump "$DATABASE_URL" -t "Market" > market_backup.sql

# Restore
psql "$DATABASE_URL" < backup_20260116.sql
```

#### Clean Old Snapshots

```sql
-- Delete snapshots older than 30 days
DELETE FROM "PoolSnapshot"
WHERE "createdAt" < NOW() - INTERVAL '30 days';
```

#### Create Pool Snapshot (Cron Job)

```sql
INSERT INTO "PoolSnapshot" ("marketId", "yesPool", "noPool", "totalBets")
SELECT
    m."marketId",
    m."yesPool",
    m."noPool",
    COUNT(b.id)
FROM "Market" m
LEFT JOIN "Bet" b ON m."marketId" = b."marketId" AND b.status = 'CONFIRMED'
GROUP BY m."marketId", m."yesPool", m."noPool";
```

---

## Maintenance

### Automated Tasks

#### 1. Pool Snapshots (Every 5 minutes)

Create a cron job or Railway service:

```python
# apps/backend/app/tasks/snapshots.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from app.models.db import Market, PoolSnapshot, Bet

async def create_pool_snapshots(db: Session):
    markets = db.query(Market).filter(Market.status == "ACTIVE").all()

    for market in markets:
        bet_count = db.query(Bet).filter(
            Bet.marketId == market.marketId,
            Bet.status == "CONFIRMED"
        ).count()

        snapshot = PoolSnapshot(
            marketId=market.marketId,
            yesPool=market.yesPool,
            noPool=market.noPool,
            totalBets=bet_count
        )
        db.add(snapshot)

    db.commit()

scheduler = AsyncIOScheduler()
scheduler.add_job(create_pool_snapshots, 'interval', minutes=5)
scheduler.start()
```

#### 2. Close Expired Markets

```python
async def close_expired_markets(db: Session):
    from datetime import datetime

    expired_markets = db.query(Market).filter(
        Market.status == "ACTIVE",
        Market.endDate < datetime.utcnow()
    ).all()

    for market in expired_markets:
        market.status = "CLOSED"

    db.commit()
```

### Monitoring

#### Connection Pool Stats

```sql
SELECT
    count(*) as total_connections,
    state,
    query
FROM pg_stat_activity
WHERE datname = 'degenhouse'
GROUP BY state, query;
```

#### Table Sizes

```sql
SELECT
    schemaname as schema,
    tablename as table,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Index Usage

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## Next Steps

1. ✅ Set up PostgreSQL on Railway (see CONFIG.md)
2. ✅ Run Prisma migrations: `npx prisma migrate deploy`
3. ✅ Seed initial data
4. ✅ Set up automated backups
5. 📊 Configure monitoring and alerts
6. 🔒 Implement database security best practices

---

## Support

- **Prisma Docs:** https://www.prisma.io/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Railway Database Docs:** https://docs.railway.app/databases/postgresql
- **SQLAlchemy Docs:** https://docs.sqlalchemy.org/

For application-specific setup, see [CONFIG.md](CONFIG.md)
