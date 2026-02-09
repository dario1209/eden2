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
    await init_redis()  # ✅ ADD THIS LINE - Initialize Redis on startup
    yield
    # Shutdown
    print("🛑 Backend shutdown")

app = FastAPI(
    title="Chainlink Sportsbook API", 
    version="1.0.0",
    lifespan=lifespan
)

def get_allowed_origins() -> list[str]:
    env_value = os.getenv("ALLOWED_ORIGINS", "").strip()
    if env_value:
        return [origin.strip() for origin in env_value.split(",") if origin.strip()]
    return [
        "http://localhost:3000",
        "https://sportsbook-monorepo-frontend.vercel.app",
        "https://edenhaus.vercel.app",
        "https://*.vercel.app",
    ]

# CORS for Vercel + localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        "x402": "ready",
        "chainlink": "ready", 
        "cronos": "ready"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
