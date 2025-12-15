#!/bin/bash

BASE_URL="http://localhost:3002"
COOKIE_FILE="/tmp/zeritu_admin_cookies.txt"

echo "=========================================="
echo "Testing Image Upload Endpoints"
echo "=========================================="
echo ""

# Sign in as admin
curl -s -X POST "$BASE_URL/api/auth/sign-in" \
  -c "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zeritu.com","password":"admin123"}' > /dev/null

# Create a test image file
echo "Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test_image.png

echo "Creating product with image..."
curl -s -X POST "$BASE_URL/api/products" \
  -b "$COOKIE_FILE" \
  -F "title=Test Product with Image" \
  -F "description=Test description" \
  -F "price=29.99" \
  -F "category=Merch" \
  -F "stock=10" \
  -F "image=@/tmp/test_image.png" | jq .

echo ""
echo "Creating article with image..."
curl -s -X POST "$BASE_URL/api/articles" \
  -b "$COOKIE_FILE" \
  -F "title=Test Article with Image" \
  -F "excerpt=Test excerpt" \
  -F "content=Test content" \
  -F "published=true" \
  -F "image=@/tmp/test_image.png" | jq .

echo ""
echo "Creating event with image..."
curl -s -X POST "$BASE_URL/api/events" \
  -b "$COOKIE_FILE" \
  -F "title=Test Event with Image" \
  -F "description=Test description" \
  -F "date=2025-12-25T00:00:00Z" \
  -F "time=7:00 PM" \
  -F "location=Addis Ababa" \
  -F "image=@/tmp/test_image.png" | jq .

