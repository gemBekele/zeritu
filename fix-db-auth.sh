#!/bin/bash

echo "🔧 Fixing PostgreSQL Authentication Issues"
echo "=========================================="

# Step 1: Verify and fix PostgreSQL user password
echo ""
echo "Step 1: Setting password for zeritu user..."
sudo -u postgres psql << EOSQL
-- Reset password to ensure it's correct
ALTER USER zeritu WITH PASSWORD '30433043';
ALTER USER zeritu WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE zeritu_db TO zeritu;
\c zeritu_db
GRANT ALL PRIVILEGES ON SCHEMA public TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO zeritu;
EOSQL

echo "✅ User permissions updated"
echo ""

# Step 2: Check PostgreSQL authentication configuration
echo "Step 2: Checking PostgreSQL authentication configuration..."
PG_VERSION=$(sudo -u postgres psql -t -c "SHOW server_version_num;" | xargs | cut -c1-2)
PG_MAJOR_VERSION=$(echo "scale=0; $PG_VERSION/1000" | bc)

PG_HBA_FILE="/etc/postgresql/${PG_MAJOR_VERSION}/main/pg_hba.conf"
echo "PostgreSQL version: ${PG_MAJOR_VERSION}"
echo "Config file: ${PG_HBA_FILE}"

if [ -f "$PG_HBA_FILE" ]; then
    echo ""
    echo "Current pg_hba.conf settings for localhost:"
    grep -E "^host.*127.0.0.1|^host.*::1" "$PG_HBA_FILE" || echo "No host entries found for localhost"
    echo ""
    echo "Current local settings:"
    grep "^local" "$PG_HBA_FILE" | head -3
    echo ""
    echo "⚠️  If authentication is still failing, you may need to update pg_hba.conf"
    echo "   to use 'md5' instead of 'peer' for localhost connections"
    echo ""
    echo "Would you like to update pg_hba.conf now? (This will make a backup first)"
    echo "Run this command manually if needed:"
    echo "  sudo nano $PG_HBA_FILE"
    echo ""
    echo "Change lines with 'peer' to 'md5' for host connections"
else
    echo "⚠️  Could not find pg_hba.conf file"
fi

# Step 3: Test connection
echo "Step 3: Testing database connection..."
export PGPASSWORD='30433043'
if psql -U zeritu -d zeritu_db -h localhost -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check:"
    echo "   1. Password in .env file matches: 30433043"
    echo "   2. PostgreSQL is running: sudo systemctl status postgresql"
    echo "   3. pg_hba.conf allows password authentication"
fi
unset PGPASSWORD

echo ""
echo "Step 4: Next steps"
echo "=================="
echo "1. Update your .env file:"
echo "   DATABASE_URL=\"postgresql://zeritu:30433043@localhost:5432/zeritu_db?schema=public\""
echo ""
echo "2. Make sure there are no extra characters in the password"
echo ""
echo "3. Test Prisma connection:"
echo "   cd ~/zeritu/zeritu_backend"
echo "   npm run db:push"
echo ""

