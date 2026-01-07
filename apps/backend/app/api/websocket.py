from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.redis import redis_client
import json

router = APIRouter()

@router.websocket("/ws/markets")
async def websocket_markets(websocket: WebSocket):
    """Eden Haus market updates via Redis Pub/Sub"""
    await websocket.accept()
    
    if redis_client:
        pubsub = redis_client.pubsub()
        await pubsub.subscribe("market:*")
        
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message:
                    await websocket.send_text(message["data"])
        except WebSocketDisconnect:
            print("WebSocket disconnected")
    else:
        await websocket.close(code=1011, reason="Redis unavailable")

@router.get("/ws-test")
async def ws_test():
    return {"message": "WebSocket ready at /api/v1/ws/markets"}
