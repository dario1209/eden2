-- Add Votes Table Migration
-- Run this after 001_initial_schema.sql

BEGIN;

-- ============================================================================
-- VOTES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Vote" (
    id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(12), 'base64'),
    
    "voteId" TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'base64'),
    "marketId" TEXT NOT NULL,
    
    -- User info
    "walletAddress" TEXT NOT NULL,
    
    -- Vote details
    choice TEXT NOT NULL CHECK (choice IN ('YES', 'NO')),
    amount BIGINT NOT NULL CHECK (amount > 0), -- USDT with 6 decimals (e.g., 1000000 = 1 USDT)
    
    -- Timestamps
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key
    FOREIGN KEY ("marketId") REFERENCES "Market"("marketId") ON DELETE CASCADE,
    
    -- One vote per wallet per market (can update)
    UNIQUE ("marketId", "walletAddress")
);

-- Indexes for Vote
CREATE INDEX IF NOT EXISTS idx_vote_marketId ON "Vote"("marketId");
CREATE INDEX IF NOT EXISTS idx_vote_wallet ON "Vote"("walletAddress");
CREATE INDEX IF NOT EXISTS idx_vote_choice ON "Vote"(choice);
CREATE INDEX IF NOT EXISTS idx_vote_createdAt ON "Vote"("createdAt");

-- ============================================================================
-- UPDATE TRIGGER FOR VOTES
-- ============================================================================

CREATE TRIGGER update_vote_updated_at BEFORE UPDATE ON "Vote"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION TO SYNC MARKET POOLS FROM VOTES
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_market_pools()
RETURNS TRIGGER AS $$
DECLARE
    new_yes_pool BIGINT;
    new_no_pool BIGINT;
    target_market_id TEXT;
BEGIN
    -- Determine which market to update
    IF TG_OP = 'DELETE' THEN
        target_market_id := OLD."marketId";
    ELSE
        target_market_id := NEW."marketId";
    END IF;
    
    -- Calculate new pools from all votes
    SELECT
        COALESCE(SUM(amount) FILTER (WHERE choice = 'YES'), 0),
        COALESCE(SUM(amount) FILTER (WHERE choice = 'NO'), 0)
    INTO new_yes_pool, new_no_pool
    FROM "Vote"
    WHERE "marketId" = target_market_id;
    
    -- Update market pools
    UPDATE "Market"
    SET 
        "yesPool" = new_yes_pool,
        "noPool" = new_no_pool,
        "updatedAt" = NOW()
    WHERE "marketId" = target_market_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-sync pools when votes change
CREATE TRIGGER trigger_sync_market_pools
AFTER INSERT OR UPDATE OR DELETE ON "Vote"
FOR EACH ROW
EXECUTE FUNCTION sync_market_pools();

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check Vote table was created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'Vote';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'Vote';