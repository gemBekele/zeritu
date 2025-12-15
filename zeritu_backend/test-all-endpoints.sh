#!/bin/bash

BASE_URL="http://localhost:3001"
COOKIE_FILE="/tmp/zeritu_cookies.txt"

echo "=========================================="
echo "Testing Zeritu Backend API Endpoints"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" -b "$COOKIE_FILE" -c "$COOKIE_FILE" -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" -b "$COOKIE_FILE" -c "$COOKIE_FILE" -H "Content-Type: application/json" -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Success (HTTP $http_code)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body" | head -5
    else
        echo -e "  ${RED}✗ Failed (HTTP $http_code)${NC}"
        echo "$body" | head -3
    fi
    echo ""
}

# Clear cookies
rm -f "$COOKIE_FILE"

# 1. Health Check
test_endpoint "GET" "/api/health" "" "Health Check"

# 2. Register User
test_endpoint "POST" "/api/auth/sign-up" '{"email":"test'$(date +%s)'@example.com","password":"password123","name":"Test User"}' "Register User"

# 3. Sign In (use the email from registration)
EMAIL="test$(date +%s)@example.com"
test_endpoint "POST" "/api/auth/sign-up" "{\"email\":\"$EMAIL\",\"password\":\"password123\",\"name\":\"Test User\"}" "Register User for Sign In"
test_endpoint "POST" "/api/auth/sign-in" "{\"email\":\"$EMAIL\",\"password\":\"password123\"}" "Sign In"

# 4. Get Session
test_endpoint "GET" "/api/auth/session" "" "Get Session"

# 5. Get Products (Public)
test_endpoint "GET" "/api/products" "" "Get All Products"

# 6. Get Products with filters
test_endpoint "GET" "/api/products?category=Merch&page=1&limit=5" "" "Get Products (Filtered)"

# 7. Get Articles (Public)
test_endpoint "GET" "/api/articles" "" "Get All Articles"

# 8. Get Events (Public)
test_endpoint "GET" "/api/events" "" "Get All Events"

# 9. Get Cart (Requires Auth - should work if signed in)
test_endpoint "GET" "/api/cart" "" "Get Cart"

# 10. Get Orders (Requires Auth)
test_endpoint "GET" "/api/orders" "" "Get Orders"

# 11. Sign Out
test_endpoint "POST" "/api/auth/sign-out" "" "Sign Out"

# 12. Test protected endpoints without auth (should fail)
test_endpoint "GET" "/api/cart" "" "Get Cart (No Auth - Should Fail)"

echo "=========================================="
echo "Testing Complete"
echo "=========================================="







