#!/usr/bin/env python3
"""
Seed initial data for DegenHouse database
Run this after migrations to populate test data
"""

import os
import sys
from datetime import datetime, timedelta

# Check for DATABASE_URL
if not os.getenv("DATABASE_URL"):
    print("❌ ERROR: DATABASE_URL environment variable not set")
    sys.exit(1)

print("🌱 Seeding DegenHouse database...")

# SQL seed data
seed_sql = """
-- Insert Eden Haus Hackathon Market (if not exists)
INSERT INTO "Market" (
    "marketId",
    question,
    status,
    "yesPool",
    "noPool",
    "startDate",
    "endDate",
    "contractAddress",
    "gnosisSafeAddress"
) VALUES (
    'eden-haus-hackathon',
    'Will Eden Haus win the Cronos x402 Hackathon?',
    'ACTIVE',
    525000000,
    725000000,
    NOW(),
    NOW() + INTERVAL '31 days',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000'
) ON CONFLICT ("marketId") DO UPDATE SET
    "updatedAt" = NOW();

-- Insert additional test markets
INSERT INTO "Market" (
    "marketId",
    question,
    status,
    "yesPool",
    "noPool",
    "startDate",
    "endDate",
    "contractAddress",
    "gnosisSafeAddress"
) VALUES
(
    'btc-100k-feb',
    'Will BTC reach $100k by February 2026?',
    'ACTIVE',
    2500000000,
    1800000000,
    NOW(),
    NOW() + INTERVAL '45 days',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000'
),
(
    'eth-proto-danksharding-q1',
    'Will ETH implement Proto-Danksharding in Q1 2026?',
    'ACTIVE',
    1600000000,
    1500000000,
    NOW(),
    NOW() + INTERVAL '60 days',
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000'
)
ON CONFLICT ("marketId") DO NOTHING;

-- Create initial pool snapshots
INSERT INTO "PoolSnapshot" ("marketId", "yesPool", "noPool", "totalBets", "createdAt")
SELECT
    m."marketId",
    m."yesPool",
    m."noPool",
    0,
    NOW()
FROM "Market" m
WHERE NOT EXISTS (
    SELECT 1 FROM "PoolSnapshot" ps WHERE ps."marketId" = m."marketId"
);
"""

# Execute seed SQL
import subprocess

try:
    result = subprocess.run(
        ["psql", os.getenv("DATABASE_URL")],
        input=seed_sql.encode(),
        capture_output=True,
        check=True
    )
    print("✅ Seed data inserted successfully!")
    print("\n📊 Markets in database:")

    # Show markets
    show_markets_sql = """
    SELECT
        "marketId",
        question,
        status,
        "yesPool" / 1000000.0 as yes_usdt,
        "noPool" / 1000000.0 as no_usdt
    FROM "Market"
    ORDER BY "createdAt" DESC;
    """

    result = subprocess.run(
        ["psql", os.getenv("DATABASE_URL"), "-c", show_markets_sql],
        capture_output=True,
        text=True,
        check=True
    )
    print(result.stdout)

except subprocess.CalledProcessError as e:
    print(f"❌ Seed failed: {e}")
    print(e.stderr.decode() if e.stderr else "")
    sys.exit(1)
except FileNotFoundError:
    print("❌ psql command not found. Please install PostgreSQL client tools.")
    sys.exit(1)

print("\n🎉 Database seeded successfully!")
