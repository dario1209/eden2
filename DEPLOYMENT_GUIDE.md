# Prediction Market Deployment Guide

## Summary of Changes

### 1. Railway Deployment Fix ✅
**Problem:** Railway was failing with error `'$PORT' is not a valid integer`

**Solution:** Updated [apps/backend/railway.json](apps/backend/railway.json:7) to properly expand environment variables:
```json
"startCommand": "sh -c 'uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'"
```

### 2. Backend API Implementation ✅
Created a complete prediction market voting system:

- **New Files:**
  - [apps/backend/app/models/prediction.py](apps/backend/app/models/prediction.py) - Data models
  - [apps/backend/app/api/v1/predictions.py](apps/backend/app/api/v1/predictions.py) - API endpoints

- **Endpoints:**
  - `GET /api/v1/predictions/markets` - List all markets
  - `GET /api/v1/predictions/markets/{id}` - Get specific market
  - `POST /api/v1/predictions/vote` - Place YES/NO vote
  - `GET /api/v1/predictions/markets/{id}/stats` - Get market statistics

- **Updated:**
  - [apps/backend/main.py](apps/backend/main.py:9) - Registered predictions router

### 3. Frontend Integration ✅
Connected the Prediction page to the backend API:

- **New Files:**
  - [apps/frontend/lib/api/predictions.ts](apps/frontend/lib/api/predictions.ts) - API client
  - [apps/frontend/.env.local.example](apps/frontend/.env.local.example) - Environment variables template

- **Updated:**
  - [apps/frontend/app/prediction/page.tsx](apps/frontend/app/prediction/page.tsx) - Real-time voting and data fetching

## Backend Project Structure

```
apps/backend/
├── main.py                    # FastAPI application entry point
├── requirements.txt           # Python dependencies
├── railway.json              # Railway deployment config
├── Dockerfile                # Docker configuration
├── .env.example              # Environment variables template
├── app/
│   ├── api/v1/
│   │   ├── predictions.py    # Prediction market voting endpoints
│   │   ├── markets.py        # Sports betting markets
│   │   ├── bets.py           # Bet confirmation
│   │   └── x402.py           # x402 payment endpoints
│   ├── models/
│   │   ├── prediction.py     # Prediction market models
│   │   ├── market.py         # Sports market models
│   │   └── bet.py            # Bet models
│   ├── core/                 # Core business logic
│   └── services/             # External services (Redis, etc.)
├── prisma/
│   └── schema.prisma         # Database schema
├── migrations/
│   ├── 001_initial_schema.sql
│   └── run_migrations.sh     # Migration runner script
└── seed_data.py              # Database seeding script
```

## Deployment Instructions

### Backend (Railway)

1. **Environment Variables:**

   Create `.env` file in `apps/backend/`:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Configure in Railway dashboard (Variables tab):
   ```bash
   DATABASE_URL=${postgres.DATABASE_URL}
   ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
   ENVIRONMENT=production
   DEBUG=false
   ```

   Railway automatically provides the `PORT` variable.

2. **Run Database Migrations:**

   After PostgreSQL is provisioned, run migrations:
   ```bash
   # From Railway CLI
   railway run ./migrations/run_migrations.sh

   # Or directly with DATABASE_URL
   psql "$DATABASE_URL" < migrations/001_initial_schema.sql
   ```

3. **Seed Initial Data:**
   ```bash
   railway run python seed_data.py
   ```

4. **Deploy:**
   ```bash
   cd apps/backend
   git add .
   git commit -m "Add prediction market voting endpoints"
   git push
   ```

   Railway will automatically deploy using the updated `railway.json` configuration.

5. **Verify Deployment:**
   - Check Railway logs for successful startup
   - Test the health endpoint: `https://your-app.railway.app/`
   - Test the API: `https://your-app.railway.app/api/v1/predictions/markets`

   Expected response:
   ```json
   [{
     "id": "eden-haus-hackathon",
     "question": "Will Eden Haus win the Cronos x402 Hackathon?",
     "status": "ACTIVE",
     "yes_pool": 525.0,
     "no_pool": 725.0
   }]
   ```

### Backend (Local Development)

1. **Set Environment Variables:**
   ```bash
   cd apps/backend
   cp .env.example .env
   ```

   Edit `.env`:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/degenhouse
   ALLOWED_ORIGINS=http://localhost:3000
   ENVIRONMENT=development
   DEBUG=true
   ```

2. **Install Dependencies:**
   ```bash
   # Create virtual environment (recommended)
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate

   # Install packages
   pip install -r requirements.txt
   ```

3. **Set Up Local Database (Optional):**
   ```bash
   # Using Docker
   docker-compose up -d

   # Or install PostgreSQL locally
   # macOS: brew install postgresql
   # Linux: apt-get install postgresql
   ```

4. **Run Migrations:**
   ```bash
   export DATABASE_URL="postgresql://localhost:5432/degenhouse"
   ./migrations/run_migrations.sh
   python seed_data.py
   ```

5. **Start Backend Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   API will be available at:
   - http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend (Local Development)

1. **Set Environment Variables:**
   ```bash
   cd apps/frontend
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   DATABASE_URL=postgresql://localhost:5432/degenhouse
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Test Voting:**
   - Navigate to http://localhost:3000/prediction
   - Expand the "Eden Haus Hackathon Win" market
   - Click YES or NO to vote
   - Watch the percentages update in real-time

### Frontend (Production - Vercel)

1. **Update Environment Variable:**
   In Vercel dashboard, set:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
   ```

2. **Update CORS in Backend:**
   Add your Vercel domain to [apps/backend/main.py](apps/backend/main.py:29):
   ```python
   allow_origins=[
       "http://localhost:3000",
       "https://your-frontend.vercel.app",
       "https://*.vercel.app"
   ],
   ```

3. **Deploy:**
   ```bash
   git push
   ```

## How It Works

1. **Initial Load:**
   - Frontend fetches market data from `/api/v1/predictions/markets/eden-haus-hackathon`
   - Updates UI with current YES/NO percentages
   - Polls for updates every 10 seconds

2. **Voting:**
   - User clicks YES or NO button
   - Frontend sends POST request to `/api/v1/predictions/vote`
   - Backend updates pools and returns new percentages
   - Frontend immediately updates UI with new data

3. **Real-time Updates:**
   - Market data refreshes automatically every 10 seconds
   - Shows live voting results without page reload

## Testing the API

### Get All Markets:
```bash
curl https://your-app.railway.app/api/v1/predictions/markets
```

### Get Specific Market:
```bash
curl https://your-app.railway.app/api/v1/predictions/markets/eden-haus-hackathon
```

### Place a Vote:
```bash
curl -X POST https://your-app.railway.app/api/v1/predictions/vote \
  -H "Content-Type: application/json" \
  -d '{"market_id": "eden-haus-hackathon", "choice": "YES", "amount": 10.0}'
```

### Get Market Stats:
```bash
curl https://your-app.railway.app/api/v1/predictions/markets/eden-haus-hackathon/stats
```

## Notes

- **Data Persistence:** Currently using in-memory storage (resets on restart). For production, integrate with a database.
- **Authentication:** No wallet authentication required for demo. Add wallet signature verification for production.
- **Rate Limiting:** Consider adding rate limiting to prevent spam voting.
- **CORS:** Update allowed origins in production to match your domains.

## Troubleshooting

### Backend Not Starting on Railway
- Check Railway logs for errors
- Verify `PORT` environment variable is set by Railway
- Ensure all Python dependencies are in `requirements.txt`

### Frontend Can't Connect to Backend
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console for CORS errors
- Ensure backend allows your frontend domain in CORS settings

### Votes Not Updating
- Check browser console for API errors
- Verify backend endpoint is responding correctly
- Check that market ID matches exactly: `eden-haus-hackathon`
