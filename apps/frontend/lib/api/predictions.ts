/**
 * Prediction Market API Client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PredictionMarket {
  id: string;
  question: string;
  status: 'ACTIVE' | 'CLOSED' | 'RESOLVED';
  winner: 'YES' | 'NO' | null;
  yes_pool: number;
  no_pool: number;
  total_bets: number;
  start_date: string;
  end_date: string;
  category: string;
  icon: string;
  total_pool: number;
  yes_percent: number;
  no_percent: number;
}

export interface VoteRequest {
  market_id: string;
  choice: 'YES' | 'NO';
  amount: number;
  wallet?: string;
}

export interface VoteResponse {
  success: boolean;
  vote_id: string;
  market_id: string;
  choice: 'YES' | 'NO';
  amount: number;
  new_yes_pool: number;
  new_no_pool: number;
  yes_percent: number;
  no_percent: number;
}

export interface MarketStats {
  market_id: string;
  question: string;
  status: string;
  yes_pool: number;
  no_pool: number;
  total_pool: number;
  yes_percent: number;
  no_percent: number;
  total_bets: number;
  days_remaining: number;
  ends_in: string;
}

/**
 * Fetch all prediction markets
 */
export async function getPredictionMarkets(): Promise<PredictionMarket[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/markets`);

    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prediction markets:', error);
    return [];
  }
}

/**
 * Fetch a specific prediction market
 */
export async function getPredictionMarket(marketId: string): Promise<PredictionMarket | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/markets/${marketId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch market: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching market ${marketId}:`, error);
    return null;
  }
}

/**
 * Place a YES/NO vote on a prediction market
 */
export async function placeVote(vote: VoteRequest): Promise<VoteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vote),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to place vote');
    }

    return await response.json();
  } catch (error) {
    console.error('Error placing vote:', error);
    throw error;
  }
}

/**
 * Get market statistics
 */
export async function getMarketStats(marketId: string): Promise<MarketStats | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predictions/markets/${marketId}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch market stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching market stats for ${marketId}:`, error);
    return null;
  }
}
