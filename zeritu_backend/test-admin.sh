#!/bin/bash

BASE_URL="http://localhost:3002"
COOKIE_FILE="/tmp/zeritu_admin_cookies.txt"

echo "=========================================="
echo "Testing Admin Endpoints"
echo "=========================================="
echo ""

# Sign in as admin
echo "Signing in as admin..."
curl -s -X POST "$BASE_URL/api/auth/sign-in" \
  -c "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zeritu.com","password":"admin123"}' | jq .

echo ""
echo "Creating test product..."
curl -s -X POST "$BASE_URL/api/products" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "description": "This is a test product description",
    "price": 29.99,
    "category": "Merch",
    "stock": 10
  }' | jq .

echo ""
echo "Creating test article..."
curl -s -X POST "$BASE_URL/api/articles" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "excerpt": "This is a test article excerpt",
    "content": "This is the full content of the test article",
    "published": true
  }' | jq .

echo ""
echo "Creating test event..."
curl -s -X POST "$BASE_URL/api/events" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event description",
    "date": "2025-12-25T00:00:00Z",
    "time": "7:00 PM",
    "location": "Addis Ababa, Ethiopia",
    "status": "UPCOMING"
  }' | jq .

echo ""
echo "Getting all products..."
curl -s -X GET "$BASE_URL/api/products" | jq '.products | length'

echo ""
echo "Getting all articles..."
curl -s -X GET "$BASE_URL/api/articles" | jq '.articles | length'

echo ""
echo "Getting all events..."
curl -s -X GET "$BASE_URL/api/events" | jq '.events | length'

