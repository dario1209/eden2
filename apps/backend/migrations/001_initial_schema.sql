-- DegenHouse Initial Database Schema
-- PostgreSQL 15+
-- Created: 2026-01-16

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MARKETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Market" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),
    "marketId" TEXT UNIQUE NOT NULL,
    question TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'RESOLVED')),
    winner TEXT CHECK (winner IN ('YES', 'NO', NULL)),

    "yesPool" BIGINT DEFAULT 0 CHECK ("yesPool" >= 0),
    "noPool" BIGINT DEFAULT 0 CHECK ("noPool" >= 0),

    "startDate" TIMESTAMP NOT NULL DEFAULT NOW(),
    "endDate" TIMESTAMP NOT NULL,

    "contractAddress" TEXT NOT NULL,
    "gnosisSafeAddress" TEXT NOT NULL,

    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_end_date CHECK ("endDate" > "startDate")
);

-- Indexes for Market
CREATE INDEX IF NOT EXISTS idx_market_marketId ON "Market"("marketId");
CREATE INDEX IF NOT EXISTS idx_market_status ON "Market"(status);
CREATE INDEX IF NOT EXISTS idx_market_endDate ON "Market"("endDate");

-- ============================================================================
-- BETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Bet" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),

    "walletAddress" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,

    choice TEXT NOT NULL CHECK (choice IN ('YES', 'NO')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    "betNumber" INTEGER NOT NULL CHECK ("betNumber" >= 1 AND "betNumber" <= 10),

    status TEXT DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'FLAGGED', 'CLAWED_BACK')),
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

-- ============================================================================
-- BET HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "BetHistory" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),

    "betId" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    wallet TEXT NOT NULL,

    action TEXT NOT NULL CHECK (action IN (
        'PLACED', 'CONFIRMED', 'FLAGGED', 'FLAGGED_VELOCITY',
        'FLAGGED_CONCENTRATION', 'CLAWED_BACK', 'REFUNDED'
    )),
    reason TEXT,

    "clawbackAmount" BIGINT CHECK ("clawbackAmount" >= 0),
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

-- ============================================================================
-- FLAGGED WALLETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "FlaggedWallet" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),

    wallet TEXT UNIQUE NOT NULL,
    "marketId" TEXT NOT NULL,
    reason TEXT NOT NULL,
    severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    "isActive" BOOLEAN DEFAULT TRUE,

    "createdAt" TIMESTAMP DEFAULT NOW(),
    "unflaggedAt" TIMESTAMP
);

-- Indexes for FlaggedWallet
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_wallet ON "FlaggedWallet"(wallet);
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_marketId ON "FlaggedWallet"("marketId");
CREATE INDEX IF NOT EXISTS idx_flaggedwallet_isActive ON "FlaggedWallet"("isActive");

-- ============================================================================
-- POOL SNAPSHOTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "PoolSnapshot" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),

    "marketId" TEXT NOT NULL,
    "yesPool" BIGINT NOT NULL CHECK ("yesPool" >= 0),
    "noPool" BIGINT NOT NULL CHECK ("noPool" >= 0),
    "totalBets" INTEGER NOT NULL CHECK ("totalBets" >= 0),

    "createdAt" TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE
);

-- Indexes for PoolSnapshot
CREATE INDEX IF NOT EXISTS idx_poolsnapshot_marketId ON "PoolSnapshot"("marketId");
CREATE INDEX IF NOT EXISTS idx_poolsnapshot_createdAt ON "PoolSnapshot"("createdAt");

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updatedAt timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_market_updated_at BEFORE UPDATE ON "Market"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEED
-- ============================================================================

-- Insert Eden Haus Hackathon Market
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
    525000000,  -- 525 USDT
    725000000,  -- 725 USDT
    NOW(),
    NOW() + INTERVAL '31 days',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000'
) ON CONFLICT ("marketId") DO NOTHING;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables were created
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check initial market
SELECT
    "marketId",
    question,
    status,
    "yesPool",
    "noPool",
    "endDate"
FROM "Market"
WHERE "marketId" = 'eden-haus-hackathon';
