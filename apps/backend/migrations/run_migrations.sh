#!/bin/bash
# Migration runner script for DegenHouse database

set -e  # Exit on error

echo "🗄️  Running DegenHouse database migrations..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it to your PostgreSQL connection string:"
    echo "  export DATABASE_URL='postgresql://user:password@host:port/dbname'"
    exit 1
fi

echo "✅ Database URL found"
echo "📍 Target: ${DATABASE_URL%%@*}@***"  # Hide credentials in output

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run migrations in order
echo ""
echo "📝 Running migration: 001_initial_schema.sql"
psql "$DATABASE_URL" < "$SCRIPT_DIR/001_initial_schema.sql"

if [ $? -ne 0 ]; then
    echo "❌ Migration 001_initial_schema.sql failed!"
    exit 1
fi

echo "✅ Migration 001_initial_schema.sql completed"

echo ""
echo "📝 Running migration: 002_add_votes_table.sql"
psql "$DATABASE_URL" < "$SCRIPT_DIR/002_add_votes_table.sql"

if [ $? -ne 0 ]; then
    echo "❌ Migration 002_add_votes_table.sql failed!"
    exit 1
fi

echo "✅ Migration 002_add_votes_table.sql completed"
echo ""
echo "✅ All migrations completed successfully!"
echo ""
echo "🎉 Database is ready to use"
