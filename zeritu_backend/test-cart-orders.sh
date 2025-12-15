#!/bin/bash

BASE_URL="http://localhost:3002"
COOKIE_FILE="/tmp/zeritu_user_cookies.txt"

echo "=========================================="
echo "Testing Cart and Order Endpoints"
echo "=========================================="
echo ""

# Sign in as regular user
echo "1. Signing in as user..."
curl -s -X POST "$BASE_URL/api/auth/sign-in" \
  -c "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r '.user.id' > /tmp/user_id.txt

USER_ID=$(cat /tmp/user_id.txt)
echo "User ID: $USER_ID"
echo ""

# First, create a product as admin (we'll skip image for now by modifying the route temporarily)
# Actually, let's test with a product that doesn't require image upload first
# Or we can create a product directly in the database

echo "2. Creating a product directly in DB for testing..."
cd /home/barch/projects/zeritu_backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const product = await prisma.product.create({
    data: {
      title: 'Test Product for Cart',
      description: 'Test description',
      price: 29.99,
      category: 'Merch',
      stock: 10,
      image: '/images/test.jpg'
    }
  });
  console.log('Product created:', product.id);
  await prisma.\$disconnect();
})();
"

PRODUCT_ID=$(node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); (async () => { const p = await prisma.product.findFirst(); console.log(p.id); await prisma.\$disconnect(); })();")

if [ -z "$PRODUCT_ID" ]; then
  echo "No product found, creating one..."
  PRODUCT_ID=$(node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); (async () => { const p = await prisma.product.create({data:{title:'Test',description:'Test',price:29.99,category:'Merch',stock:10,image:'/test.jpg'}}); console.log(p.id); await prisma.\$disconnect(); })();")
fi

echo "Product ID: $PRODUCT_ID"
echo ""

echo "3. Adding item to cart..."
curl -s -X POST "$BASE_URL/api/cart" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":2}" | jq .

echo ""
echo "4. Getting cart..."
curl -s -X GET "$BASE_URL/api/cart" \
  -b "$COOKIE_FILE" | jq .

echo ""
echo "5. Creating order..."
curl -s -X POST "$BASE_URL/api/orders" \
  -b "$COOKIE_FILE" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingName": "John Doe",
    "shippingEmail": "john@example.com",
    "shippingPhone": "+251911234567",
    "shippingAddress": "123 Main St, Addis Ababa"
  }' | jq .

echo ""
echo "6. Getting orders..."
curl -s -X GET "$BASE_URL/api/orders" \
  -b "$COOKIE_FILE" | jq '.[0] | {id, total, status, paymentStatus}'

