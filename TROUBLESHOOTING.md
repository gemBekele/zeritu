# PostgreSQL Authentication Troubleshooting

## Issue: Authentication Failed

If you're getting `P1000: Authentication failed` errors, follow these steps:

### Quick Checklist First

Before diving deep, check these common issues:

1. **Password typo in `.env`**: Make sure the password in your `.env` file exactly matches what you set in PostgreSQL
   - Check for extra characters, missing characters, or typos
   - Example: `30433043` not `304330433` or `3043304`

2. **Missing quotes in `.env`**: Ensure DATABASE_URL has quotes
   - ✅ Correct: `DATABASE_URL="postgresql://zeritu:30433043@localhost:5432/zeritu_db?schema=public"`
   - ❌ Wrong: `DATABASE_URL=postgresql://zeritu:30433043@localhost:5432/zeritu_db?schema=public`

3. **Username mismatch**: The username in DATABASE_URL must match the PostgreSQL user you created
   - If you created user `zeritu`, use `zeritu` in the connection string
   - If you created user `chenaniah`, use `chenaniah` in the connection string

4. **Test connection manually**:
   ```bash
   psql -U zeritu -d zeritu_db -h localhost
   # Enter password when prompted
   ```
   If this works but Prisma doesn't, it's likely a `pg_hba.conf` configuration issue.

## Step 1: Verify PostgreSQL User Exists

Connect to PostgreSQL as the postgres superuser:

```bash
sudo -u postgres psql
```

Then check existing users:

```sql
\du
```

## Step 2: Create or Fix User

### Option A: Use the `zeritu` user you already created

Make sure the user has the correct password. In PostgreSQL shell:

```sql
-- Connect to your database
\c zeritu_db

-- Set password for existing user
ALTER USER zeritu WITH PASSWORD '30433043';

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON DATABASE zeritu_db TO zeritu;
GRANT ALL PRIVILEGES ON SCHEMA public TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO zeritu;

-- Make the user a superuser (if you need shadow database creation)
ALTER USER zeritu WITH SUPERUSER;
```

Or create a new user with a different name:

```sql
CREATE USER chenaniah WITH PASSWORD '30433043';
GRANT ALL PRIVILEGES ON DATABASE zeritu_db TO chenaniah;
ALTER USER chenaniah WITH SUPERUSER;
\q
```

## Step 3: Update .env File

Make sure your `.env` file matches the user you created:

```env
DATABASE_URL="postgresql://zeritu:30433043@localhost:5432/zeritu_db?schema=public"
```

OR if using `chenaniah`:

```env
DATABASE_URL="postgresql://chenaniah:30433043@localhost:5432/zeritu_db?schema=public"
```

## Step 4: Fix Common Password Issues

**Common mistake:** Typos in the password in `.env` file. Double-check:
- Password in `.env`: `30433043` (not `304330433` or other variations)
- Make sure the DATABASE_URL has quotes: `DATABASE_URL="postgresql://..."`
- No extra spaces or special characters

## Step 5: Configure PostgreSQL Authentication (if still failing)

Edit PostgreSQL's authentication configuration:

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Find the line that looks like:
```
local   all             all                                     peer
```

For the database connections, change it to:
```
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Then restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

**Important:** After changing `pg_hba.conf`, you MUST restart PostgreSQL for changes to take effect:
```bash
sudo systemctl restart postgresql
```

## Step 6: Test Connection

Test the connection from command line:

```bash
psql -U zeritu -d zeritu_db -h localhost
# Enter password: 30433043
```

If this works, your credentials are correct.

## Step 7: Fix Prisma Migrate Shadow Database Issue

Prisma Migrate needs permission to create a shadow database. You have two options:

### Option A: Grant SUPERUSER (Quick fix for development)

```sql
sudo -u postgres psql
ALTER USER zeritu WITH SUPERUSER;
\q
```

### Option B: Use `db:push` instead of `db:migrate` (Recommended for initial setup)

```bash
npm run db:push
```

This pushes the schema directly without needing a shadow database.

## Step 8: Run Database Setup

After fixing authentication:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema (instead of migrate)
npm run db:push

# Seed database (optional)
npm run db:seed
```

## Quick Fix Script

Run this to quickly set up the user with all necessary permissions:

```bash
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'zeritu') THEN
      CREATE USER zeritu WITH PASSWORD '30433043';
   END IF;
END
\$\$;

-- Grant privileges
ALTER USER zeritu WITH SUPERUSER;
GRANT ALL PRIVILEGES ON DATABASE zeritu_db TO zeritu;

-- Connect to database and grant schema privileges
\c zeritu_db
GRANT ALL PRIVILEGES ON SCHEMA public TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO zeritu;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO zeritu;
EOF
```

Then update your `.env`:

```env
DATABASE_URL="postgresql://zeritu:30433043@localhost:5432/zeritu_db?schema=public"
```

