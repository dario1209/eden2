from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class PredictionMarket(BaseModel):
    id: str
    question: str
    status: Literal["ACTIVE", "CLOSED", "RESOLVED"] = "ACTIVE"
    winner: Optional[Literal["YES", "NO"]] = None
    yes_pool: float = Field(default=0.0, ge=0)
    no_pool: float = Field(default=0.0, ge=0)
    total_bets: int = Field(default=0, ge=0)
    start_date: datetime
    end_date: datetime
    category: str = "Crypto"
    icon: str = "🏆"

    @property
    def total_pool(self) -> float:
        return self.yes_pool + self.no_pool

    @property
    def yes_percent(self) -> float:
        if self.total_pool == 0:
            return 50.0
        return round((self.yes_pool / self.total_pool) * 100, 1)

    @property
    def no_percent(self) -> float:
        if self.total_pool == 0:
            return 50.0
        return round((self.no_pool / self.total_pool) * 100, 1)

    class Config:
        from_attributes = True

class VoteRequest(BaseModel):
    market_id: str
    choice: Literal["YES", "NO"]
    amount: float = Field(..., gt=0, le=100)
    wallet: Optional[str] = None

class VoteResponse(BaseModel):
    success: bool
    vote_id: str
    market_id: str
    choice: Literal["YES", "NO"]
    amount: float
    new_yes_pool: float
    new_no_pool: float
    yes_percent: float
    no_percent: float
