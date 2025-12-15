#!/bin/bash

BASE_URL="http://localhost:3002"

echo "=========================================="
echo "Testing Chapa Payment Integration"
echo "=========================================="
echo ""

echo "Testing Chapa payment initialization..."
curl -s -X POST "https://api.chapa.co/v1/transaction/initialize" \
  -H "Authorization: Bearer CHASECK_TEST-PEa4jdVUMyuMvIJyDFfSCSLekDw5kNp0" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "100",
    "currency": "ETB",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "251911234567",
    "tx_ref": "test-'$(date +%s)'",
    "callback_url": "http://localhost:3002/api/orders/webhook",
    "return_url": "http://localhost:3002/orders/test"
  }' | jq .

