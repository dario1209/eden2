#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migration runner script for DegenHouse database
Runs SQL migrations in order using psycopg2
"""

import os
import sys
from pathlib import Path

# Check Python version (must be first, before any f-strings or unicode)
if sys.version_info < (3, 6):
    print("ERROR: Python 3.6 or higher is required")
    print("   Current version: {}".format(sys.version))
    print("   Please use: python3 migrations/run_migrations.py")
    sys.exit(1)

# Load environment variables from .env file (optional)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, that's okay - will use environment variables directly
    pass

# Import psycopg2
try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
except ImportError:
    print("❌ ERROR: psycopg2 not installed")
    print("   Please install it: pip3 install psycopg2-binary")
    print("   Or install all requirements: pip3 install -r requirements.txt")
    sys.exit(1)

def get_migration_files():
    """Get migration files in order"""
    script_dir = Path(__file__).parent
    migrations = [
        script_dir / "001_initial_schema.sql",
        script_dir / "002_add_votes_table.sql",
    ]
    return migrations

def run_migration(conn, migration_file: Path):
    """Run a single migration file using psycopg2"""
    print(f"📝 Running migration: {migration_file.name}")
    
    try:
        # Read the SQL file
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        # SQL files contain BEGIN/COMMIT blocks, so use autocommit
        # This allows the transaction blocks in SQL to work properly
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Execute the SQL (may contain multiple statements and transactions)
        cursor.execute(sql)
        cursor.close()
        
        print(f"✅ Migration {migration_file.name} completed")
        return True
    except psycopg2.Error as e:
        print(f"❌ Migration {migration_file.name} failed!")
        print(f"   Error: {e}")
        if e.pgcode:
            print(f"   PostgreSQL error code: {e.pgcode}")
        return False
    except Exception as e:
        print(f"❌ Migration {migration_file.name} failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main migration runner"""
    print("🗄️  Running DegenHouse database migrations...")
    
    # Check for DATABASE_URL
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ ERROR: DATABASE_URL environment variable is not set")
        print("Please set it to your PostgreSQL connection string:")
        print("  export DATABASE_URL='postgresql://user:password@host:port/dbname'")
        sys.exit(1)
    
    # Hide credentials in output
    safe_url = database_url.split('@')[0] + '@***' if '@' in database_url else '***'
    print(f"✅ Database URL found")
    print(f"📍 Target: {safe_url}")
    
    # Get migration files
    migrations = get_migration_files()
    
    # Check all files exist
    for migration in migrations:
        if not migration.exists():
            print(f"❌ ERROR: Migration file not found: {migration}")
            sys.exit(1)
    
    # Connect to database
    try:
        conn = psycopg2.connect(database_url)
        print("✅ Connected to database")
    except psycopg2.Error as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)
    
    # Run migrations
    print("")
    success = True
    try:
        for migration in migrations:
            if not run_migration(conn, migration):
                success = False
                break
            print("")
    finally:
        conn.close()
    
    if success:
        print("✅ All migrations completed successfully!")
        print("")
        print("🎉 Database is ready to use")
        sys.exit(0)
    else:
        print("❌ Migrations failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
