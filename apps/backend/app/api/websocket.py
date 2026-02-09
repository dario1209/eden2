from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.redis import redis_client
import json
import asyncio
import asyncpg
import os
from typing import Dict, Set

router = APIRouter()

# Active WebSocket connections
active_connections: Set[WebSocket] = set()

# Database connection pool
db_pool = None

async def get_db_pool():
    """Initialize PostgreSQL connection pool"""
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(
            host=os.getenv("PGHOST", "localhost"),
            port=int(os.getenv("PGPORT", "5432")),
            user=os.getenv("PGUSER", "postgres"),
            password=os.getenv("PGPASSWORD", ""),
            database=os.getenv("PGDATABASE", "eden_haus"),
            min_size=2,
            max_size=10
        )
    return db_pool

async def fetch_market_update(market_id: str) -> Dict:
    """Fetch latest market data from PostgreSQL"""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT 
                id, question, status, winner,
                yes_pool, no_pool, total_bets,
                start_date, end_date, category, icon
            FROM prediction_markets
            WHERE id = $1
        """, market_id)
        
        if row:
            total_pool = row['yes_pool'] + row['no_pool']
            yes_percent = (row['yes_pool'] / total_pool * 100) if total_pool > 0 else 50.0
            no_percent = (row['no_pool'] / total_pool * 100) if total_pool > 0 else 50.0
            
            return {
                "type": "market_update",
                "market_id": row['id'],
                "yes_pool": float(row['yes_pool']),
                "no_pool": float(row['no_pool']),
                "total_pool": float(total_pool),
                "yes_percent": round(yes_percent, 1),
                "no_percent": round(no_percent, 1),
                "total_bets": row['total_bets'],
                "status": row['status']
            }
    return None

async def broadcast_to_all(message: str):
    """Send message to all connected WebSocket clients"""
    disconnected = set()
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception as e:
            print(f"Error sending to client: {e}")
            disconnected.add(connection)
    
    # Remove disconnected clients
    active_connections.difference_update(disconnected)

@router.websocket("/ws/markets")
async def websocket_markets(websocket: WebSocket):
    """
    Eden Haus market updates via Redis Pub/Sub + PostgreSQL
    
    This WebSocket endpoint provides:
    - Real-time vote updates via Redis pub/sub
    - Market status changes
    - Live pool and percentage updates
    - Database-backed data consistency
    """
    await websocket.accept()
    active_connections.add(websocket)
    
    if not redis_client:
        await websocket.close(code=1011, reason="Redis unavailable")
        return
    
    pubsub = redis_client.pubsub()
    
    try:
        # Subscribe to market channels and vote updates
        await pubsub.subscribe("market:*", "vote:update")
        print(f"✅ WebSocket connected. Total connections: {len(active_connections)}")
        
        # Send initial connection confirmation
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "message": "Eden Haus WebSocket ready"
        })
        
        while True:
            # Listen for Redis pub/sub messages
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            
            if message and message["type"] == "message":
                channel = message["channel"].decode("utf-8")
                data = message["data"].decode("utf-8")
                
                try:
                    # Parse the message data
                    message_data = json.loads(data)
                    
                    # Handle vote updates - fetch fresh data from database
                    if channel == "vote:update":
                        market_id = message_data.get("market_id")
                        if market_id:
                            # Fetch latest market data from PostgreSQL
                            market_update = await fetch_market_update(market_id)
                            if market_update:
                                # Add vote metadata
                                market_update["vote"] = {
                                    "choice": message_data.get("choice"),
                                    "amount": message_data.get("amount"),
                                    "wallet": message_data.get("wallet", "anonymous")
                                }
                                await websocket.send_json(market_update)
                    
                    # Handle market-specific updates
                    elif channel.startswith("market:"):
                        market_id = channel.split(":", 1)[1]
                        # Fetch latest data from database to ensure consistency
                        market_update = await fetch_market_update(market_id)
                        if market_update:
                            await websocket.send_json(market_update)
                        else:
                            # Fallback to Redis message if DB fetch fails
                            await websocket.send_text(data)
                    
                    else:
                        # Send raw message for other channels
                        await websocket.send_text(data)
                        
                except json.JSONDecodeError:
                    # Send raw text if not JSON
                    await websocket.send_text(data)
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Error processing update"
                    })
            
            # Small delay to prevent CPU spinning
            await asyncio.sleep(0.01)
            
    except WebSocketDisconnect:
        print(f"🔌 WebSocket disconnected. Remaining: {len(active_connections) - 1}")
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
    finally:
        # Cleanup
        active_connections.discard(websocket)
        await pubsub.unsubscribe("market:*", "vote:update")
        await pubsub.close()

@router.websocket("/ws/markets/{market_id}")
async def websocket_market_specific(websocket: WebSocket, market_id: str):
    """
    Single market WebSocket endpoint for focused updates
    
    Subscribes only to a specific market's updates for reduced bandwidth
    """
    await websocket.accept()
    
    if not redis_client:
        await websocket.close(code=1011, reason="Redis unavailable")
        return
    
    pubsub = redis_client.pubsub()
    
    try:
        # Subscribe to specific market and vote updates
        await pubsub.subscribe(f"market:{market_id}", "vote:update")
        print(f"✅ WebSocket connected to market: {market_id}")
        
        # Send initial market data from database
        initial_data = await fetch_market_update(market_id)
        if initial_data:
            await websocket.send_json(initial_data)
        
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            
            if message and message["type"] == "message":
                channel = message["channel"].decode("utf-8")
                data = message["data"].decode("utf-8")
                
                try:
                    message_data = json.loads(data)
                    
                    # Only process if it's for this market
                    if channel == "vote:update":
                        if message_data.get("market_id") == market_id:
                            market_update = await fetch_market_update(market_id)
                            if market_update:
                                market_update["vote"] = {
                                    "choice": message_data.get("choice"),
                                    "amount": message_data.get("amount"),
                                    "wallet": message_data.get("wallet", "anonymous")
                                }
                                await websocket.send_json(market_update)
                    
                    elif channel == f"market:{market_id}":
                        market_update = await fetch_market_update(market_id)
                        if market_update:
                            await websocket.send_json(market_update)
                            
                except json.JSONDecodeError:
                    await websocket.send_text(data)
                except Exception as e:
                    print(f"❌ Error in market-specific WebSocket: {e}")
            
            await asyncio.sleep(0.01)
            
    except WebSocketDisconnect:
        print(f"🔌 WebSocket disconnected from market: {market_id}")
    except Exception as e:
        print(f"❌ WebSocket error for market {market_id}: {e}")
    finally:
        await pubsub.unsubscribe(f"market:{market_id}", "vote:update")
        await pubsub.close()

@router.get("/ws-test")
async def ws_test():
    """Test endpoint to verify WebSocket is available"""
    return {
        "message": "WebSocket endpoints ready",
        "endpoints": {
            "all_markets": "/api/v1/ws/markets",
            "specific_market": "/api/v1/ws/markets/{market_id}"
        },
        "active_connections": len(active_connections),
        "features": [
            "Real-time vote updates",
            "Market status changes",
            "Database-backed consistency",
            "Redis pub/sub messaging"
        ]
    }

@router.get("/ws-stats")
async def ws_stats():
    """Get WebSocket connection statistics"""
    return {
        "active_connections": len(active_connections),
        "redis_connected": redis_client is not None,
        "database_connected": db_pool is not None
    }
