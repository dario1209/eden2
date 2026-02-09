import redis.asyncio as redis
import json
import os
from typing import Optional, Dict, Any

redis_client = None

async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    try:
        redis_client = redis.from_url(redis_url, decode_responses=True)
        await redis_client.ping()
        print(f"✅ Redis connected: {redis_url}")
    except Exception as e:
        print(f"⚠️  Redis connection failed: {e}")
        print("⚠️  Continuing without Redis - real-time updates will be disabled")
        redis_client = None

async def get_rate_limit(key: str) -> Optional[int]:
    if not redis_client: return None
    value = await redis_client.get(key)
    return int(value) if value else None

async def increment_rate_limit(key: str, limit: int = 10, window: int = 60):
    if not redis_client: return True
    count = await redis_client.incr(key)
    if count == 1:
        await redis_client.expire(key, window)
    return count <= limit

async def set_rate_limit(key: str, value: int, expiry: int = 60):
    if redis_client:
        await redis_client.setex(key, expiry, value)

async def publish_market_update(market_id: str, data: Dict[str, Any]):
    """Publish general market update"""
    if redis_client:
        try:
            await redis_client.publish(f"market:{market_id}", json.dumps(data))
            print(f"📢 Published market update for {market_id}")
        except Exception as e:
            print(f"❌ Failed to publish market update: {e}")

async def publish_vote_update(market_id: str, vote_data: Dict[str, Any]):
    """Publish vote update to WebSocket clients"""
    if redis_client:
        try:
            message = {
                "type": "vote_update",
                "market_id": market_id,
                "timestamp": vote_data.get("timestamp"),
                "yes_pool": vote_data.get("yes_pool"),
                "no_pool": vote_data.get("no_pool"),
                "yes_percent": vote_data.get("yes_percent"),
                "no_percent": vote_data.get("no_percent"),
                "total_voters": vote_data.get("total_voters"),
                "last_vote": {
                    "choice": vote_data.get("choice"),
                    "amount": vote_data.get("amount")
                }
            }
            await redis_client.publish(f"market:{market_id}:votes", json.dumps(message))
            print(f"📢 Published vote update for market {market_id}")
        except Exception as e:
            print(f"❌ Failed to publish vote update: {e}")

async def get_live_cache(key: str) -> Optional[Dict[str, Any]]:
    if not redis_client: return None
    data = await redis_client.get(key)
    return json.loads(data) if data else None

async def set_live_cache(key: str, data: Dict[str, Any], expiry: int = 300):
    if redis_client:
        await redis_client.setex(key, expiry, json.dumps(data))