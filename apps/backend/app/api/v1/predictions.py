from fastapi import APIRouter, HTTPException
from app.models.prediction import PredictionMarket, VoteRequest, VoteResponse
from typing import List
from datetime import datetime, timedelta
import random
import uuid

router = APIRouter()

# In-memory storage for demo (replace with database in production)
MARKETS_DB = {}
VOTES_DB = []

# Initialize the Eden Haus hackathon market
HACKATHON_MARKET = PredictionMarket(
    id="eden-haus-hackathon",
    question="Will Eden Haus win the Cronos x402 Hackathon?",
    status="ACTIVE",
    yes_pool=525.0,  # Starting with some demo data
    no_pool=725.0,
    total_bets=0,
    start_date=datetime.utcnow() - timedelta(days=1),
    end_date=datetime.utcnow() + timedelta(days=31),
    category="Crypto",
    icon="🏆"
)

MARKETS_DB["eden-haus-hackathon"] = HACKATHON_MARKET

@router.get("/markets", response_model=List[PredictionMarket])
async def get_markets():
    """Get all prediction markets"""
    return list(MARKETS_DB.values())

@router.get("/markets/{market_id}", response_model=PredictionMarket)
async def get_market(market_id: str):
    """Get a specific prediction market by ID"""
    market = MARKETS_DB.get(market_id)
    if not market:
        raise HTTPException(status_code=404, detail="Market not found")
    return market

@router.post("/vote", response_model=VoteResponse)
async def place_vote(vote: VoteRequest):
    """Place a YES/NO vote on a prediction market"""

    # Validate market exists
    market = MARKETS_DB.get(vote.market_id)
    if not market:
        raise HTTPException(status_code=404, detail="Market not found")

    # Validate market is active
    if market.status != "ACTIVE":
        raise HTTPException(status_code=400, detail="Market is not active")

    # Validate market hasn't ended
    if datetime.utcnow() > market.end_date:
        raise HTTPException(status_code=400, detail="Market has ended")

    # Update pools
    if vote.choice == "YES":
        market.yes_pool += vote.amount
    else:
        market.no_pool += vote.amount

    market.total_bets += 1

    # Store vote
    vote_id = str(uuid.uuid4())
    VOTES_DB.append({
        "vote_id": vote_id,
        "market_id": vote.market_id,
        "choice": vote.choice,
        "amount": vote.amount,
        "wallet": vote.wallet,
        "timestamp": datetime.utcnow()
    })

    # Update market in DB
    MARKETS_DB[vote.market_id] = market

    return VoteResponse(
        success=True,
        vote_id=vote_id,
        market_id=vote.market_id,
        choice=vote.choice,
        amount=vote.amount,
        new_yes_pool=market.yes_pool,
        new_no_pool=market.no_pool,
        yes_percent=market.yes_percent,
        no_percent=market.no_percent
    )

@router.get("/markets/{market_id}/stats")
async def get_market_stats(market_id: str):
    """Get real-time statistics for a market"""
    market = MARKETS_DB.get(market_id)
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
