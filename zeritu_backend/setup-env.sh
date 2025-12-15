#!/bin/bash
cat > .env << 'ENVEOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zeritu_db?schema=public"

# BetterAuth
BETTER_AUTH_SECRET="zeritu-secret-key-$(openssl rand -hex 16)"
BETTER_AUTH_URL="http://localhost:3001"
BETTER_AUTH_BASE_URL="http://localhost:3001"

# OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Chapa Payment
CHAPA_SECRET_KEY="CHASECK_TEST-PEa4jdVUMyuMvIJyDFfSCSLekDw5kNp0"
CHAPA_PUBLIC_KEY="CHAPUBK_TEST-3BrH3OCFCEGSU4olqYLdxOX1FBISVZ5Y"
CHAPA_WEBHOOK_SECRET="webhook-secret-change-in-production"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
ENVEOF
echo ".env file created"
