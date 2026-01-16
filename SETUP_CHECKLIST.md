# Setup Checklist - DegenHouse Deployment

Complete checklist for deploying the DegenHouse prediction market platform.

## Documentation Overview

- **[CONFIG.md](CONFIG.md)** - Railway & Vercel configuration guide
- **[DATABASE.md](DATABASE.md)** - PostgreSQL schema, migrations, and queries
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Quick deployment instructions

---

## Prerequisites

- [ ] GitHub account
- [ ] Railway account (for backend + database)
- [ ] Vercel account (for frontend)
- [ ] Git installed locally
- [ ] Node.js 18+ installed
- [ ] Python 3.12+ installed (for local development)

---

## Part 1: Railway Setup (Backend + Database)

### Step 1.1: Create Railway Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Click "New Project"
- [ ] Connect GitHub account

### Step 1.2: Add PostgreSQL Database
- [ ] In Railway project, click "+ New"
- [ ] Select "Database" → "Add PostgreSQL"
- [ ] Wait for provisioning (automatically creates `DATABASE_URL`)

### Step 1.3: Deploy Backend
- [ ] Click "+ New" → "GitHub Repo"
- [ ] Select `DegenHouse` repository
- [ ] Set root directory: `apps/backend`
- [ ] Wait for initial deployment

### Step 1.4: Configure Backend Environment Variables
Go to backend service → Variables tab and add:

```bash
DATABASE_URL=${postgres.DATABASE_URL}
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
ENVIRONMENT=production
DEBUG=false
```

### Step 1.5: Run Database Migrations
In Railway backend service, open the terminal:

```bash
# Option 1: Using the migration script
./migrations/run_migrations.sh

# Option 2: Using psql directly
psql $DATABASE_URL < migrations/001_initial_schema.sql

# Option 3: Using Prisma (if installed)
npx prisma migrate deploy
```

### Step 1.6: Seed Initial Data
```bash
python seed_data.py
```

### Step 1.7: Verify Backend Deployment
Get your Railway backend URL and test:

```bash
# Health check
curl https://your-backend.railway.app/

# Get markets
curl https://your-backend.railway.app/api/v1/predictions/markets
```

**Expected response:**
```json
[{
  "id": "eden-haus-hackathon",
  "question": "Will Eden Haus win the Cronos x402 Hackathon?",
  "status": "ACTIVE",
  ...
}]
```

---

## Part 2: Vercel Setup (Frontend)

### Step 2.1: Import Project to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Select `DegenHouse` repository
- [ ] Set root directory: `apps/frontend`

### Step 2.2: Configure Build Settings
- [ ] Framework: Next.js (auto-detected)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`

### Step 2.3: Set Environment Variables
In Vercel → Settings → Environment Variables, add for **All Environments**:

```bash
# CRITICAL: Update with your Railway backend URL
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Database (for Prisma)
DATABASE_URL=${postgres.DATABASE_URL}

# Blockchain Configuration
NEXT_PUBLIC_CRONOS_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_USDT_ADDRESS=0xF0F161fDA2712DB8b566946122a5af183995e2eD

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_LIVE_UPDATES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Step 2.4: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify deployment at your Vercel URL

---

## Part 3: Configure CORS

### Step 3.1: Update Backend CORS
Edit `apps/backend/main.py` and add your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",        # Add your domain
        "https://your-app-*.vercel.app",      # Preview deployments
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 3.2: Commit and Push
```bash
git add apps/backend/main.py
git commit -m "Update CORS for production domain"
git push
```

Railway will automatically redeploy.

---

## Part 4: Testing

### Test 4.1: Backend Health
```bash
curl https://your-backend.railway.app/
```
✅ Should return: `{"message":"Chainlink Sportsbook Backend",...}`

### Test 4.2: Database Connection
```bash
curl https://your-backend.railway.app/api/v1/predictions/markets
```
✅ Should return array of markets

### Test 4.3: Vote Functionality
```bash
curl -X POST https://your-backend.railway.app/api/v1/predictions/vote \
  -H "Content-Type: application/json" \
  -d '{"market_id":"eden-haus-hackathon","choice":"YES","amount":10.0}'
```
✅ Should return vote confirmation with updated pools

### Test 4.4: Frontend Integration
1. [ ] Visit `https://your-app.vercel.app/prediction`
2. [ ] Open browser DevTools → Console (should have no errors)
3. [ ] Expand "Eden Haus Hackathon Win" market
4. [ ] Click YES or NO button
5. [ ] Verify percentages update
6. [ ] Check trade slip updates

### Test 4.5: Database Verification
In Railway → PostgreSQL → Query tab:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check market data
SELECT * FROM "Market" WHERE "marketId" = 'eden-haus-hackathon';

-- Check for votes (after testing)
SELECT COUNT(*) FROM "Bet";
```

---

## Part 5: Optional Enhancements

### 5.1: Add Redis (for Real-time Updates)
- [ ] In Railway, click "+ New" → "Database" → "Add Redis"
- [ ] Update backend env: `REDIS_URL=${redis.REDIS_URL}`
- [ ] Restart backend service

### 5.2: Custom Domains

**Backend (Railway):**
- [ ] Go to backend service → Settings → Domains
- [ ] Click "Custom Domain"
- [ ] Add: `api.your-domain.com`
- [ ] Update DNS records as instructed

**Frontend (Vercel):**
- [ ] Go to Settings → Domains
- [ ] Add: `your-domain.com`
- [ ] Update DNS records as instructed

### 5.3: Set up Monitoring
- [ ] Enable Railway logs
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (Sentry, etc.)

### 5.4: Database Backups
Railway Pro plan includes automatic backups. For Hobby plan:
```bash
# Manual backup
railway run pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## Part 6: Local Development Setup

### 6.1: Clone Repository
```bash
git clone https://github.com/your-username/DegenHouse.git
cd DegenHouse
```

### 6.2: Backend Setup
```bash
cd apps/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your Railway DATABASE_URL

# Run migrations (if not done on Railway)
./migrations/run_migrations.sh

# Start server
uvicorn main:app --reload --port 8000
```

### 6.3: Frontend Setup
```bash
cd apps/frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

### 6.4: Test Locally
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## Troubleshooting

### Issue: Railway Backend Not Starting

**Check:**
1. View logs in Railway dashboard
2. Verify `DATABASE_URL` is set
3. Check `railway.json` configuration
4. Ensure all dependencies in `requirements.txt`

**Fix:**
```bash
# View logs
railway logs --service backend

# Restart service
railway restart --service backend
```

### Issue: CORS Errors in Browser

**Symptoms:**
```
Access to fetch... has been blocked by CORS policy
```

**Fix:**
1. Verify Vercel domain in `ALLOWED_ORIGINS`
2. Update `main.py` CORS middleware
3. Redeploy backend
4. Clear browser cache

### Issue: Database Connection Failed

**Check:**
1. PostgreSQL service is running in Railway
2. `DATABASE_URL` is correctly set
3. Migrations have been run

**Fix:**
```bash
# Test connection from Railway CLI
railway run psql $DATABASE_URL

# Re-run migrations
railway run ./migrations/run_migrations.sh
```

### Issue: Environment Variables Not Loading

**Frontend (Vercel):**
- Rebuild the project (env vars only apply to new builds)
- Verify `NEXT_PUBLIC_` prefix for client-side vars

**Backend (Railway):**
- Restart the service after changing variables
- Check for typos in variable names

---

## Deployment Checklist

Before going live:

- [ ] ✅ Backend deployed on Railway
- [ ] ✅ PostgreSQL database provisioned
- [ ] ✅ Database migrations executed
- [ ] ✅ Initial data seeded
- [ ] ✅ Frontend deployed on Vercel
- [ ] ✅ Environment variables configured (both platforms)
- [ ] ✅ CORS properly configured
- [ ] ✅ SSL certificates active (automatic)
- [ ] ✅ Health checks passing
- [ ] ✅ API endpoints responding
- [ ] ✅ Frontend can connect to backend
- [ ] ✅ Voting functionality works
- [ ] ✅ No console errors in browser
- [ ] ✅ Database queries working
- [ ] ⚠️ Custom domains configured (optional)
- [ ] ⚠️ Monitoring set up (optional)
- [ ] ⚠️ Backup strategy in place (optional)

---

## Quick Reference

### Railway Commands
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs --service backend

# Run commands in Railway environment
railway run psql $DATABASE_URL

# Restart service
railway restart --service backend
```

### Vercel Commands
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs
```

### Database Commands
```bash
# Connect to database
psql $DATABASE_URL

# Run migration
psql $DATABASE_URL < migrations/001_initial_schema.sql

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

---

## Next Steps

1. ✅ Complete setup using this checklist
2. 📖 Review [CONFIG.md](CONFIG.md) for detailed configuration
3. 🗄️ Review [DATABASE.md](DATABASE.md) for database operations
4. 🚀 Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for quick deployment
5. 🧪 Test voting functionality end-to-end
6. 📊 Set up analytics and monitoring
7. 🎨 Customize branding and content
8. 🔐 Implement wallet authentication (future)

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI:** https://fastapi.tiangolo.com
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **PostgreSQL:** https://www.postgresql.org/docs

**Project Documentation:**
- [CONFIG.md](CONFIG.md) - Platform configuration
- [DATABASE.md](DATABASE.md) - Database setup
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Quick start

---

## Cost Estimate

### Railway (Hobby Plan)
- **Free Tier:** $5 credit/month
- **Includes:** Backend + PostgreSQL
- **Upgrade to Pro:** $20/month for production

### Vercel (Hobby Plan)
- **Free Tier:** 100GB bandwidth
- **Perfect for:** Personal projects
- **Upgrade to Pro:** $20/month for commercial use

**Total Monthly Cost (Free Tier):** $0
**Total Monthly Cost (Pro Plans):** $40/month

---

**✨ You're all set! Happy deploying!**
