# Configuration Guide - Railway & Vercel Setup

This guide covers the complete setup of your DegenHouse application infrastructure on Railway (backend) and Vercel (frontend).

## Table of Contents
- [Railway Setup (Backend + Database)](#railway-setup-backend--database)
- [Vercel Setup (Frontend)](#vercel-setup-frontend)
- [Environment Variables](#environment-variables)
- [CORS Configuration](#cors-configuration)
- [Testing the Setup](#testing-the-setup)

---

## Railway Setup (Backend + Database)

Railway will host your FastAPI backend and PostgreSQL database.

### Step 1: Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Deploy PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. Note: The `DATABASE_URL` environment variable is automatically created

**Database Configuration:**
- **Service Name:** `postgres` (default)
- **Plan:** Hobby Plan (free tier available)
- **Region:** Choose closest to your users
- **PostgreSQL Version:** 15+ recommended

**Important Variables Created Automatically:**
```
DATABASE_URL=postgresql://user:password@host:port/dbname
PGHOST=containers-us-west-xxx.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=xxxxx
PGDATABASE=railway
```

### Step 3: Deploy Backend Application

#### Option A: Deploy from GitHub (Recommended)

1. In Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Connect your `DegenHouse` repository
4. Railway will auto-detect the Python app using Nixpacks
5. Set the **Root Directory** to `apps/backend`

#### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory
railway up --service backend --dir apps/backend
```

### Step 4: Configure Backend Service

**Service Settings:**

1. **Name:** `degenhouse-backend` (or your preferred name)
2. **Root Directory:** `apps/backend`
3. **Build Settings:**
   - Builder: `NIXPACKS` (auto-detected)
   - Build Command: Auto-detected from `requirements.txt`
   - Start Command: Configured in `railway.json`

**Railway.json Configuration:**
Already configured at `apps/backend/railway.json`:
```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    },
    "deploy": {
        "startCommand": "sh -c 'uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}'",
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
}
```

### Step 5: Set Backend Environment Variables

In Railway, go to your backend service → **Variables** tab:

**Required Variables:**

```bash
# Database (auto-linked if using Railway PostgreSQL)
DATABASE_URL=${postgres.DATABASE_URL}

# Redis (optional - for real-time features)
REDIS_URL=redis://default:password@host:port

# CORS Origins (update with your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app,http://localhost:3000

# Environment
ENVIRONMENT=production
DEBUG=false

# Optional: For Chainlink/Cronos integration
CRONOS_RPC_URL=https://evm.cronos.org
CRONOS_TESTNET_RPC_URL=https://evm-t3.cronos.org
CONTRACT_ADDRESS=0xYourContractAddress
USDT_ADDRESS=0xF0F161fDA2712DB8b566946122a5af183995e2eD
GNOSIS_SAFE_ADDRESS=0xYourGnosisSafeAddress

# API Keys (if needed)
CHAINLINK_API_KEY=your_key_here
X402_API_KEY=your_key_here
```

**Variable Reference Syntax:**
Railway allows you to reference other services' variables:
```bash
DATABASE_URL=${postgres.DATABASE_URL}
REDIS_URL=${redis.REDIS_URL}
```

### Step 6: Add Redis (Optional - for Real-time Features)

If you want real-time WebSocket updates:

1. Click **"+ New"** in your Railway project
2. Select **"Database"** → **"Add Redis"**
3. The `REDIS_URL` variable is auto-created
4. Update backend environment variables to reference it:
   ```bash
   REDIS_URL=${redis.REDIS_URL}
   ```

### Step 7: Custom Domain (Optional)

1. Go to backend service → **Settings** → **Domains**
2. Click **"Generate Domain"** for a `.railway.app` domain
3. Or add a custom domain:
   - Click **"Custom Domain"**
   - Enter your domain (e.g., `api.degenhouse.com`)
   - Add DNS records as instructed by Railway

### Step 8: Deploy and Verify

1. Railway will automatically deploy on git push
2. Check deployment logs in the **Deployments** tab
3. Verify health check:
   ```bash
   curl https://your-backend.railway.app/
   # Should return: {"message":"Chainlink Sportsbook Backend",...}
   ```

4. Test prediction API:
   ```bash
   curl https://your-backend.railway.app/api/v1/predictions/markets
   ```

---

## Vercel Setup (Frontend)

Vercel will host your Next.js frontend application.

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Install Vercel GitHub app (if not already)

### Step 2: Import Project

1. Click **"Add New Project"**
2. Select your `DegenHouse` repository
3. Vercel will auto-detect Next.js

### Step 3: Configure Build Settings

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- **Root Directory:** `apps/frontend`
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

**Advanced Settings:**
- **Node.js Version:** 18.x or 20.x
- **Environment Variables:** See below

### Step 4: Set Frontend Environment Variables

In Vercel → Your Project → **Settings** → **Environment Variables**

Add the following for **Production**, **Preview**, and **Development** environments:

```bash
# Backend API URL (CRITICAL - Update with your Railway URL)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Blockchain Configuration
NEXT_PUBLIC_CRONOS_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_USDT_ADDRESS=0xF0F161fDA2712DB8b566946122a5af183995e2eD
NEXT_PUBLIC_GNOSIS_SAFE_ADDRESS=0xYourGnosisSafeAddress

# WalletConnect Configuration (if using)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ENABLE_TESTNETS=false

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_LIVE_UPDATES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DEBUG=false

# Database URL (for Prisma)
DATABASE_URL=${postgres.DATABASE_URL}
```

**Important Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Keep sensitive keys (API keys, private keys) WITHOUT `NEXT_PUBLIC_` prefix
- For preview deployments, you can use the testnet configuration

### Step 5: Configure Domains

**Production Domain:**
1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `degenhouse.com`)
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL

**Preview Deployments:**
- Every PR gets a unique preview URL
- Format: `degenhouse-{branch}-{team}.vercel.app`

### Step 6: Deploy

**Automatic Deployment:**
- Push to `main` branch → deploys to production
- Push to other branches → creates preview deployment
- Open PR → automatically creates preview URL in PR comments

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 7: Verify Deployment

1. Check deployment status in Vercel dashboard
2. Visit your production URL
3. Test the prediction page: `https://your-domain.com/prediction`
4. Open browser console and verify:
   - No CORS errors
   - API calls succeed
   - Voting works correctly

---

## Environment Variables Summary

### Backend (Railway)

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| `DATABASE_URL` | Secret | `postgresql://...` | ✅ Yes |
| `ALLOWED_ORIGINS` | Config | `https://app.vercel.app` | ✅ Yes |
| `ENVIRONMENT` | Config | `production` | ✅ Yes |
| `REDIS_URL` | Secret | `redis://...` | ⚠️ Optional |
| `CRONOS_RPC_URL` | Config | `https://evm.cronos.org` | ⚠️ Optional |
| `CONTRACT_ADDRESS` | Config | `0x...` | ⚠️ Optional |
| `USDT_ADDRESS` | Config | `0x...` | ⚠️ Optional |
| `DEBUG` | Config | `false` | ⚠️ Optional |

### Frontend (Vercel)

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Public | `https://api.railway.app` | ✅ Yes |
| `DATABASE_URL` | Secret | `postgresql://...` | ✅ Yes (for Prisma) |
| `NEXT_PUBLIC_CRONOS_NETWORK` | Public | `mainnet` | ✅ Yes |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Public | `0x...` | ⚠️ Optional |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Public | `abc123...` | ⚠️ Optional |
| `NEXT_PUBLIC_ENABLE_LIVE_UPDATES` | Public | `true` | ⚠️ Optional |

---

## CORS Configuration

### Update Backend CORS Settings

Edit `apps/backend/main.py` with your actual domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                           # Local development
        "https://degenhouse.vercel.app",                   # Production domain
        "https://degenhouse-*.vercel.app",                 # Preview deployments
        "https://*.vercel.app",                            # All Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Or use environment variable:**

```python
import os

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then set in Railway:
```bash
ALLOWED_ORIGINS=https://degenhouse.vercel.app,https://*.vercel.app,http://localhost:3000
```

---

## Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl https://your-backend.railway.app/

# Get prediction markets
curl https://your-backend.railway.app/api/v1/predictions/markets

# Place a vote
curl -X POST https://your-backend.railway.app/api/v1/predictions/vote \
  -H "Content-Type: application/json" \
  -d '{"market_id": "eden-haus-hackathon", "choice": "YES", "amount": 10.0}'
```

### 2. Test Frontend

1. Visit: `https://your-app.vercel.app/prediction`
2. Open browser DevTools → Console
3. Expand the "Eden Haus Hackathon Win" market
4. Click YES or NO button
5. Verify:
   - ✅ No CORS errors
   - ✅ API call succeeds
   - ✅ Percentages update
   - ✅ Trade slip updates

### 3. Test Database Connection

**From Railway Dashboard:**
1. Go to PostgreSQL service
2. Click **"Data"** tab
3. Run query to verify tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

**From local machine:**
```bash
# Get DATABASE_URL from Railway
railway variables get DATABASE_URL

# Connect with psql
psql "postgresql://user:pass@host:port/dbname"

# Or use a GUI tool like TablePlus, Postico, etc.
```

### 4. Monitor Logs

**Backend Logs (Railway):**
```bash
railway logs --service backend
```

**Frontend Logs (Vercel):**
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View **Build Logs** or **Function Logs**

---

## Common Issues & Solutions

### Issue: CORS Error in Browser

**Symptoms:**
```
Access to fetch at 'https://backend.railway.app/api/...' from origin 'https://app.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. Verify `ALLOWED_ORIGINS` in Railway includes your Vercel domain
2. Redeploy backend after updating CORS settings
3. Clear browser cache
4. Check that `allow_credentials=True` is set

### Issue: API Returns 404

**Symptoms:**
```
GET https://backend.railway.app/api/v1/predictions/markets → 404
```

**Solution:**
1. Verify the route is registered in `main.py`
2. Check Railway deployment logs for startup errors
3. Test the health endpoint: `/`
4. Ensure the predictions router is included

### Issue: Database Connection Failed

**Symptoms:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
1. Verify `DATABASE_URL` is set in Railway
2. Check PostgreSQL service is running
3. Test connection from Railway shell:
   ```bash
   railway run psql $DATABASE_URL
   ```
4. Ensure database migrations have run (see DATABASE.md)

### Issue: Environment Variables Not Loading

**Symptoms:**
- `undefined` values in frontend
- Backend failing to start

**Solution:**
1. Frontend: Rebuild in Vercel (env vars only apply to new builds)
2. Backend: Restart service in Railway
3. Verify variable names (typos are common!)
4. Check that `NEXT_PUBLIC_` prefix is used correctly

---

## Production Checklist

Before going live, ensure:

- [ ] Backend deployed and healthy on Railway
- [ ] PostgreSQL database provisioned
- [ ] Database migrations run (see DATABASE.md)
- [ ] Frontend deployed on Vercel
- [ ] Custom domains configured (optional)
- [ ] SSL certificates active (automatic on both platforms)
- [ ] CORS properly configured with production domains
- [ ] Environment variables set for production
- [ ] Sensitive keys are NOT in `NEXT_PUBLIC_` variables
- [ ] API rate limiting configured (if needed)
- [ ] Monitoring/logging set up
- [ ] Backup strategy for database
- [ ] Test transaction flow end-to-end

---

## Cost Estimates

### Railway (Backend + Database)

**Hobby Plan (Free Tier):**
- $5 credit per month
- Good for development/testing
- May need to upgrade for production traffic

**Pro Plan:**
- $20/month base
- Additional resources as needed
- Production-ready

### Vercel (Frontend)

**Hobby Plan (Free):**
- Perfect for personal projects
- 100GB bandwidth/month
- Unlimited deployments

**Pro Plan ($20/month):**
- Recommended for production
- More bandwidth
- Better analytics
- Commercial use allowed

---

## Next Steps

1. ✅ Complete Railway setup
2. ✅ Complete Vercel setup
3. 📖 Read [DATABASE.md](DATABASE.md) for database schema and migrations
4. 🚀 Deploy to production
5. 📊 Set up monitoring and analytics
6. 🧪 Run end-to-end tests

---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

For project-specific issues, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
