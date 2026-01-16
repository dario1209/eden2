# Security & Best Practices

This document outlines security considerations and best practices for the DegenHouse project.

## ✅ .gitignore Verification

The `.gitignore` file has been updated to prevent committing sensitive data:

### Protected Files (Never Committed)

#### Environment Variables
- ✅ `.env` - All environment files
- ✅ `.env.local` - Local environment overrides
- ✅ `apps/backend/.env` - Backend secrets
- ✅ `apps/frontend/.env.local` - Frontend secrets
- ✅ All `.env*.local` variations

#### Python Backend
- ✅ `__pycache__/` - Python bytecode
- ✅ `*.pyc` - Compiled Python files
- ✅ `venv/` - Virtual environments
- ✅ `.venv/` - Alternative venv naming
- ✅ `*.db` - Local database files
- ✅ `.pytest_cache/` - Test cache

#### Sensitive Data
- ✅ `*.pem` - Private keys
- ✅ `*.key` - Key files
- ✅ `secrets.json` - Secret configurations
- ✅ `credentials.json` - API credentials
- ✅ `*.sql.bak` - Database backups

#### Build Artifacts
- ✅ `node_modules/` - NPM dependencies
- ✅ `.next/` - Next.js build
- ✅ `build/` - Production builds
- ✅ `dist/` - Distribution files

### Safe to Commit (Whitelisted)

- ✅ `.env.example` - Environment variable templates
- ✅ `.env.local.example` - Local config templates
- ✅ `prisma/schema.prisma` - Database schemas
- ✅ `migrations/*.sql` - Database migrations

## 🔒 Environment Variables Security

### Critical Rules

1. **NEVER commit actual environment variables**
   ```bash
   # ❌ WRONG - Never commit
   DATABASE_URL=postgresql://user:password@host:5432/db

   # ✅ CORRECT - Use examples
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```

2. **Use .env.example files as templates**
   - Include all required variables
   - Use placeholder values
   - Document what each variable does

3. **Set actual values in deployment platforms**
   - Railway: Dashboard → Variables
   - Vercel: Settings → Environment Variables
   - Never in code or git history

### Backend Environment Variables

**Public Variables (Safe in client):**
- None - Backend doesn't expose variables to client

**Private Variables (Server-only):**
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection (if used)
- `ALLOWED_ORIGINS` - CORS origins
- API keys, secrets, private keys

### Frontend Environment Variables

**Public Variables (Exposed to browser):**
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_CRONOS_NETWORK` - Blockchain network
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Smart contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect ID

**Private Variables (Server-only):**
- `DATABASE_URL` - Database connection (for Prisma)
- Any API keys without `NEXT_PUBLIC_` prefix

**Rule:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🛡️ Database Security

### Connection Security

1. **Use SSL/TLS for production**
   ```bash
   # Railway PostgreSQL includes SSL by default
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   ```

2. **Never expose database credentials**
   - Use environment variables only
   - Rotate credentials regularly
   - Use least-privilege database users

3. **Connection pooling**
   - Railway includes PgBouncer by default
   - Prevents connection exhaustion
   - Improves performance

### Data Protection

1. **Sensitive data handling**
   - Hash passwords (use bcrypt, argon2)
   - Don't store plain-text secrets
   - Encrypt PII if required

2. **SQL injection prevention**
   - ✅ Use Prisma (parameterized queries)
   - ✅ Use SQLAlchemy ORM
   - ❌ Never concatenate user input into SQL

3. **Wallet address handling**
   - Store checksummed addresses
   - Validate format before storing
   - Consider privacy implications

## 🔐 API Security

### CORS Configuration

**Current setup (apps/backend/main.py):**
```python
allow_origins=[
    "http://localhost:3000",           # Local dev
    "https://your-app.vercel.app",     # Production
    "https://*.vercel.app",            # Preview deployments
]
```

**Security checklist:**
- [ ] Update with your actual domains
- [ ] Don't use `allow_origins=["*"]` in production
- [ ] Enable `allow_credentials=True` only if needed
- [ ] Limit `allow_methods` and `allow_headers` if possible

### Rate Limiting

**Recommended for production:**

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/v1/predictions/vote")
@limiter.limit("10/minute")
async def place_vote(vote: VoteRequest):
    # ...
```

### Authentication & Authorization

**Current status:** ⚠️ No authentication (demo mode)

**For production, implement:**
1. Wallet signature verification
2. Session management
3. Rate limiting per wallet
4. Anti-sybil measures

## 🔍 Code Security

### Dependency Management

1. **Keep dependencies updated**
   ```bash
   # Frontend
   npm audit
   npm audit fix

   # Backend
   pip list --outdated
   pip install --upgrade package-name
   ```

2. **Scan for vulnerabilities**
   ```bash
   # Frontend
   npm audit

   # Backend
   pip install safety
   safety check
   ```

3. **Use lock files**
   - ✅ `package-lock.json` (frontend)
   - ✅ `requirements.txt` (backend)

### Input Validation

**Always validate user input:**

```python
from pydantic import BaseModel, Field

class VoteRequest(BaseModel):
    market_id: str
    choice: Literal["YES", "NO"]
    amount: float = Field(..., gt=0, le=100)  # ✅ Validates range
    wallet: Optional[str] = None
```

**Validation checklist:**
- [ ] Amount limits (min/max)
- [ ] Choice values (YES/NO only)
- [ ] Wallet address format
- [ ] Market ID exists
- [ ] No SQL injection vectors

## 🚨 Security Monitoring

### Logging

**Log security-relevant events:**
- Failed authentication attempts
- Invalid input attempts
- Database errors
- API rate limit hits
- Unusual betting patterns

**Don't log:**
- ❌ Passwords
- ❌ API keys
- ❌ Full database connection strings
- ❌ Private keys

### Monitoring Setup

**Railway:**
- View logs in dashboard
- Set up alerts for errors
- Monitor resource usage

**Vercel:**
- Enable Analytics
- Monitor function errors
- Check build logs

**Database:**
- Monitor connection count
- Track slow queries
- Set up backup alerts

## 🔄 Incident Response

### If Credentials Are Compromised

1. **Immediately rotate:**
   ```bash
   # Railway: Generate new DATABASE_URL
   railway variables set DATABASE_URL="new-connection-string"

   # Vercel: Update environment variables
   # Dashboard → Settings → Environment Variables → Edit
   ```

2. **Check git history:**
   ```bash
   # Search for exposed secrets
   git log -p | grep -i "password\|secret\|key"

   # If found, consider the repo compromised
   # Options: BFG Repo-Cleaner, git-filter-repo
   ```

3. **Invalidate exposed keys:**
   - Database: Change password
   - API keys: Regenerate in provider dashboard
   - JWT secrets: Rotate and invalidate sessions

### If Database Is Compromised

1. **Immediate actions:**
   - Take backup of current state
   - Rotate database credentials
   - Analyze access logs
   - Check for unauthorized changes

2. **Investigation:**
   - Review BetHistory for anomalies
   - Check for suspicious wallets
   - Analyze betting patterns
   - Verify pool balances

3. **Recovery:**
   - Restore from backup if needed
   - Run integrity checks
   - Notify affected users
   - Document incident

## ✅ Security Checklist

### Before Deployment

- [ ] All `.env` files in `.gitignore`
- [ ] No secrets in git history
- [ ] CORS configured with actual domains
- [ ] Database uses SSL
- [ ] Dependencies are up to date
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive info
- [ ] Logging excludes secrets
- [ ] Backups are configured

### In Production

- [ ] Monitor logs regularly
- [ ] Keep dependencies updated
- [ ] Rotate credentials periodically
- [ ] Review security alerts
- [ ] Test backup restoration
- [ ] Monitor for suspicious activity
- [ ] Have incident response plan
- [ ] Document security procedures

## 📚 Security Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **FastAPI Security:** https://fastapi.tiangolo.com/tutorial/security/
- **Next.js Security:** https://nextjs.org/docs/app/building-your-application/authentication
- **Railway Security:** https://docs.railway.app/reference/security
- **Vercel Security:** https://vercel.com/docs/concepts/security

## 🤝 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT open a public GitHub issue**
2. Email: [your-security-email@example.com]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📝 Regular Security Tasks

### Weekly
- [ ] Review deployment logs for errors
- [ ] Check for dependency updates
- [ ] Monitor API usage patterns

### Monthly
- [ ] Rotate database credentials
- [ ] Review and update CORS settings
- [ ] Test backup restoration
- [ ] Audit user permissions

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review and update security policies
- [ ] Update documentation

---

**Last Updated:** 2026-01-16
**Security Contact:** [Add your contact]

**Remember:** Security is an ongoing process, not a one-time setup!
