from fastapi import APIRouter, HTTPException
from app.models.prediction import PredictionMarket, VoteRequest, VoteResponse
from app.services.redis import redis_client, publish_vote_update
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import asyncpg
import os
import json

router = APIRouter()

# Database connection
async def get_db():
    """Get database connection"""
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise Exception("DATABASE_URL not configured")
    return await asyncpg.connect(database_url)

# Helper functions
def usdt_to_bigint(amount: float) -> int:
    """Convert USDT float to BigInt (6 decimals)"""
    return int(amount * 1_000_000)

def bigint_to_usdt(amount: int) -> float:
    """Convert BigInt to USDT float"""
    return amount / 1_000_000

async def get_market_from_db(conn: asyncpg.Connection, market_id: str) -> Optional[PredictionMarket]:
    """Fetch market from database and convert to PredictionMarket model"""
    row = await conn.fetchrow(
        '''
        SELECT 
            "marketId", question, status, winner,
            "yesPool", "noPool", "startDate", "endDate"
        FROM "Market"
        WHERE "marketId" = $1
        ''',
        market_id
    )
    
    if not row:
        return None
    
    # Calculate total bets count
    total_bets = await conn.fetchval(
        'SELECT COUNT(*) FROM "Vote" WHERE "marketId" = $1',
        market_id
    ) or 0
    
    return PredictionMarket(
        id=row['marketId'],
        question=row['question'],
        status=row['status'],
        winner=row['winner'],
        yes_pool=bigint_to_usdt(row['yesPool']),
        no_pool=bigint_to_usdt(row['noPool']),
        total_bets=total_bets,
        start_date=row['startDate'],
        end_date=row['endDate'],
        category="Crypto",
        icon="🏆"
    )

@router.get("/markets", response_model=List[PredictionMarket])
async def get_markets():
    """Get all prediction markets"""
    conn = await get_db()
    try:
        rows = await conn.fetch(
            '''
            SELECT 
                "marketId", question, status, winner,
                "yesPool", "noPool", "startDate", "endDate"
            FROM "Market"
            ORDER BY "createdAt" DESC
            '''
        )
        
        markets = []
        for row in rows:
            # Get vote count for each market
            total_bets = await conn.fetchval(
                'SELECT COUNT(*) FROM "Vote" WHERE "marketId" = $1',
                row['marketId']
            ) or 0
            
            markets.append(PredictionMarket(
                id=row['marketId'],
                question=row['question'],
                status=row['status'],
                winner=row['winner'],
                yes_pool=bigint_to_usdt(row['yesPool']),
                no_pool=bigint_to_usdt(row['noPool']),
                total_bets=total_bets,
                start_date=row['startDate'],
                end_date=row['endDate'],
                category="Crypto",
                icon="🏆"
            ))
        
        return markets
    finally:
        await conn.close()

@router.get("/markets/{market_id}", response_model=PredictionMarket)
async def get_market(market_id: str):
    """Get a specific prediction market by ID"""
    conn = await get_db()
    try:
        market = await get_market_from_db(conn, market_id)
        if not market:
            raise HTTPException(status_code=404, detail="Market not found")
        return market
    finally:
        await conn.close()

@router.post("/vote", response_model=VoteResponse)
async def place_vote(vote: VoteRequest):
    """Place a YES/NO vote on a prediction market"""
    conn = await get_db()
    try:
        # Validate market exists
        market = await get_market_from_db(conn, vote.market_id)
        if not market:
            raise HTTPException(status_code=404, detail="Market not found")

        # Validate market is active
        if market.status != "ACTIVE":
            raise HTTPException(status_code=400, detail="Market is not active")

        # Validate market hasn't ended
        if datetime.utcnow() > market.end_date:
            raise HTTPException(status_code=400, detail="Market has ended")

        # Convert amount to BigInt
        amount_bigint = usdt_to_bigint(vote.amount)

        # Start transaction for atomic operations
        async with conn.transaction():
            # Upsert vote (insert or update if wallet already voted)
            vote_id = str(uuid.uuid4())
            
            await conn.execute(
                '''
                INSERT INTO "Vote" ("voteId", "marketId", "walletAddress", choice, amount, "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                ON CONFLICT ("marketId", "walletAddress") 
                DO UPDATE SET
                    choice = EXCLUDED.choice,
                    amount = EXCLUDED.amount,
                    "updatedAt" = NOW()
                ''',
                vote_id,
                vote.market_id,
                vote.wallet or "0x0000000000000000000000000000000000000000",
                vote.choice,
                amount_bigint
            )

            # ✅ FIXED: Manually recalculate pools from ALL votes
            pool_data = await conn.fetchrow(
                '''
                SELECT
                    COALESCE(SUM(CASE WHEN choice = 'YES' THEN amount ELSE 0 END), 0) as yes_total,
                    COALESCE(SUM(CASE WHEN choice = 'NO' THEN amount ELSE 0 END), 0) as no_total
                FROM "Vote"
                WHERE "marketId" = $1
                ''',
                vote.market_id
            )

            # Update Market table with recalculated pools
            await conn.execute(
                '''
                UPDATE "Market"
                SET 
                    "yesPool" = $1,
                    "noPool" = $2,
                    "updatedAt" = NOW()
                WHERE "marketId" = $3
                ''',
                pool_data['yes_total'],
                pool_data['no_total'],
                vote.market_id
            )

        # Fetch updated market data
        updated_market = await get_market_from_db(conn, vote.market_id)

        # ✅ Publish vote update to Redis for WebSocket
        if redis_client:
            await publish_vote_update(
                market_id=vote.market_id,
                choice=vote.choice,
                amount=vote.amount,
                wallet=vote.wallet or "anonymous"
            )

        return VoteResponse(
            success=True,
            vote_id=vote_id,
            market_id=vote.market_id,
            choice=vote.choice,
            amount=vote.amount,
            new_yes_pool=updated_market.yes_pool,
            new_no_pool=updated_market.no_pool,
            yes_percent=updated_market.yes_percent,
            no_percent=updated_market.no_percent
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to place vote: {str(e)}")
    finally:
        await conn.close()

@router.get("/markets/{market_id}/stats")
async def get_market_stats(market_id: str):
    """Get real-time statistics for a market"""
    conn = await get_db()
    try:
        market = await get_market_from_db(conn, market_id)
        if not market:
            raise HTTPException(status_code=404, detail="Market not found")

        # Calculate time remaining
        now = datetime.utcnow()
        time_remaining = (market.end_date - now).total_seconds()
        days_remaining = max(0, int(time_remaining / 86400))

        return {
            "market_id": market.id,
            "question": market.question,
            "status": market.status,
            "yes_pool": market.yes_pool,
            "no_pool": market.no_pool,
            "total_pool": market.total_pool,
            "yes_percent": market.yes_percent,
            "no_percent": market.no_percent,
            "total_bets": market.total_bets,
            "days_remaining": days_remaining,
            "ends_in": f"{days_remaining} days"
        }
    finally:
        await conn.close()

@router.get("/users/{wallet_address}/votes")
async def get_user_votes(wallet_address: str):
    """Get all votes for a specific wallet address"""
    conn = await get_db()
    try:
        votes = await conn.fetch(
            '''
            SELECT v.*, m.question
            FROM "Vote" v
            JOIN "Market" m ON v."marketId" = m."marketId"
            WHERE v."walletAddress" = $1
            ORDER BY v."createdAt" DESC
            ''',
            wallet_address
        )
        
        return [
            {
                "vote_id": row['voteId'],
                "market_id": row['marketId'],
                "market_question": row['question'],
                "choice": row['choice'],
                "amount": bigint_to_usdt(row['amount']),
                "created_at": row['createdAt'],
                "updated_at": row['updatedAt']
            }
            for row in votes
        ]
    finally:
        await conn.close()

@router.get("/markets/{market_id}/votes")
async def get_market_votes(market_id: str, limit: int = 100, offset: int = 0):
    """Get all votes for a market (paginated)"""
    conn = await get_db()
    try:
        votes = await conn.fetch(
            '''
            SELECT "voteId", "walletAddress", choice, amount, "createdAt"
            FROM "Vote"
            WHERE "marketId" = $1
            ORDER BY "createdAt" DESC
            LIMIT $2 OFFSET $3
            ''',
            market_id,
            limit,
            offset
        )
        
        return [
            {
                "vote_id": row['voteId'],
                "wallet_address": row['walletAddress'],
                "choice": row['choice'],
                "amount": bigint_to_usdt(row['amount']),
                "created_at": row['createdAt']
            }
            for row in votes
        ]
    finally:
        await conn.close()
