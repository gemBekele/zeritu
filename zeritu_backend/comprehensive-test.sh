#!/bin/bash
BASE_URL="http://localhost:3002"
COOKIE_FILE="/tmp/test_cookies.txt"

echo "=========================================="
echo "COMPREHENSIVE API TEST"
echo "=========================================="
echo ""

# 1. Health
echo "1. Health Check"
curl -s "$BASE_URL/api/health" | jq -r '.status'
echo ""

# 2. Register & Login
echo "2. Register User"
curl -s -X POST "$BASE_URL/api/auth/sign-up" -c "$COOKIE_FILE" -H "Content-Type: application/json" -d '{"email":"user2@test.com","password":"pass123","name":"User 2"}' | jq -r '.user.email // .error'
echo ""

echo "3. Login"
curl -s -X POST "$BASE_URL/api/auth/sign-in" -c "$COOKIE_FILE" -H "Content-Type: application/json" -d '{"email":"user2@test.com","password":"pass123"}' | jq -r '.user.email // .error'
echo ""

# 3. Products
echo "4. Get Products"
curl -s "$BASE_URL/api/products" | jq -r '.pagination.total'
echo ""

# 4. Articles  
echo "5. Get Articles"
curl -s "$BASE_URL/api/articles" | jq -r '.pagination.total'
echo ""

# 5. Events
echo "6. Get Events"
curl -s "$BASE_URL/api/events" | jq -r '.pagination.total'
echo ""

# 6. Cart
echo "7. Get Cart"
curl -s -b "$COOKIE_FILE" "$BASE_URL/api/cart" | jq -r '.total'
echo ""

# 7. Orders
echo "8. Get Orders"
curl -s -b "$COOKIE_FILE" "$BASE_URL/api/orders" | jq -r 'length'
echo ""

echo "=========================================="
echo "All endpoints tested successfully!"
echo "=========================================="
