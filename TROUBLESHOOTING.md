# PostgreSQL Authentication Troubleshooting

## Issue: Authentication Failed

If you're getting `P1000: Authentication failed` errors, follow these steps:

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

## Step 4: Configure PostgreSQL Authentication (if still failing)

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

## Step 5: Test Connection

Test the connection from command line:

```bash
psql -U zeritu -d zeritu_db -h localhost
# Enter password: 30433043
```

If this works, your credentials are correct.

## Step 6: Fix Prisma Migrate Shadow Database Issue

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

## Step 7: Run Database Setup

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

