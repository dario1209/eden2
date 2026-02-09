from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.api.v1 import x402, markets, bets, predictions
from app.api.websocket import router as websocket_router
from app.services.redis import init_redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Sportsbook Backend starting...")
    await init_redis()
    yield
    # Shutdown
    print("🛑 Backend shutdown")

app = FastAPI(
    title="Chainlink Sportsbook API", 
    version="1.0.0",
    lifespan=lifespan
)

def get_allowed_origins() -> list[str]:
    """
    Get CORS allowed origins from environment variable.
    Supports comma-separated list in ALLOWED_ORIGINS env var.
    Falls back to common defaults if not set.
    """
    env_value = os.getenv("ALLOWED_ORIGINS", "").strip()
    
    if env_value:
        # Parse comma-separated origins from Railway/Vercel variables
        origins = [origin.strip() for origin in env_value.split(",") if origin.strip()]
        print(f"✅ CORS origins from ALLOWED_ORIGINS: {origins}")
        return origins
    
    # Default origins if ALLOWED_ORIGINS not set
    default_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://sportsbook-monorepo-frontend.vercel.app",
        "https://edenhaus.vercel.app",
        "https://sportsbookfrontend-production-7f42.up.railway.app",
    ]
    
    print(f"⚠️  ALLOWED_ORIGINS not set, using defaults: {default_origins}")
    return default_origins

# CORS Configuration - Supports both HTTP and WebSocket
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# API Routes
app.include_router(x402.router, prefix="/api/v1/x402", tags=["x402"])
app.include_router(markets.router, prefix="/api/v1/markets", tags=["markets"])
app.include_router(bets.router, prefix="/api/v1/bets", tags=["bets"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(websocket_router, prefix="/api/v1/ws", tags=["websocket"])

@app.get("/")
async def root():
    return {
        "message": "Chainlink Sportsbook Backend",
        "version": "1.0.0",
        "x402": "ready",
        "chainlink": "ready", 
        "cronos": "ready",
        "cors_origins": len(get_allowed_origins())
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/debug/cors")
async def debug_cors():
    """Debug endpoint to check CORS configuration"""
    return {
        "allowed_origins": get_allowed_origins(),
        "allowed_origins_env": os.getenv("ALLOWED_ORIGINS", "NOT_SET"),
        "redis_url_set": bool(os.getenv("REDIS_URL")),
        "database_url_set": bool(os.getenv("DATABASE_URL"))
    }
