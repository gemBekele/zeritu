# Backend Setup Instructions

## Step 1: Install Dependencies

```bash
cd /home/barch/projects/zeritu_backend
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/zeritu_db?schema=public"

# BetterAuth - Generate a random secret (use: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-random-secret-here"
BETTER_AUTH_URL="http://localhost:3001"
BETTER_AUTH_BASE_URL="http://localhost:3001"

# OAuth (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Chapa Payment - Get from https://developer.chapa.co
CHAPA_SECRET_KEY="your-chapa-secret-key"
CHAPA_PUBLIC_KEY="your-chapa-public-key"
CHAPA_WEBHOOK_SECRET="your-webhook-secret"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

## Step 3: Set Up Database

### Option A: Using Prisma Migrate (Recommended)

```bash
# Generate Prisma Client
npm run db:generate

# Create and run migration
npm run db:migrate
```

### Option B: Using Prisma Push (Development)

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 4: Create Admin User

After setting up the database, you can create an admin user using Prisma Studio:

```bash
npm run db:studio
```

1. Open Prisma Studio (usually at http://localhost:5555)
2. Go to the `User` table
3. Create a new user with:
   - Email: your-admin@email.com
   - Role: `ADMIN`
   - Set other fields as needed

Or use a script to create admin user programmatically.

## Step 5: Start the Server

```bash
npm run dev
```

The server should start on `http://localhost:3001`

## Step 6: Test the API

1. Test health endpoint:
```bash
curl http://localhost:3001/api/health
```

2. Register a user:
```bash
curl -X POST http://localhost:3001/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

3. Login:
```bash
curl -X POST http://localhost:3001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify database exists: `createdb zeritu_db` (if using psql)

### BetterAuth Issues
- Make sure BETTER_AUTH_SECRET is set
- Check that BETTER_AUTH_BASE_URL matches your server URL

### Image Upload Issues
- Make sure `uploads/` directory exists (it will be created automatically)
- Check file permissions on the uploads directory

## Next Steps

After the backend is running:
1. Test all endpoints using the test guide in `src/scripts/test-endpoints.md`
2. Integrate with frontend using TanStack Query
3. Set up production environment variables








