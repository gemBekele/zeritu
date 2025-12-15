# API Testing Guide

## Setup

1. Start the server: `npm run dev`
2. Use Postman, Insomnia, or curl to test endpoints
3. Base URL: `http://localhost:3001`

## Authentication Endpoints

### Register User
```bash
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### Login
```bash
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Session
```bash
GET /api/auth/session
Cookie: better-auth.session_token=...
```

## Product Endpoints

### Get All Products
```bash
GET /api/products?category=Merch&search=tee&page=1&limit=20
```

### Get Single Product
```bash
GET /api/products/:id
```

### Create Product (Admin)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Test Product",
  "description": "Test description",
  "price": 29.99,
  "category": "Merch",
  "stock": 10,
  "image": <file>
}
```

## Article Endpoints

### Get All Articles
```bash
GET /api/articles?published=all&search=test&page=1&limit=20
```

### Create Article (Admin)
```bash
POST /api/articles
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Test Article",
  "excerpt": "Test excerpt",
  "content": "Full article content...",
  "published": false,
  "image": <file>
}
```

## Event Endpoints

### Get All Events
```bash
GET /api/events?status=UPCOMING&page=1&limit=20
```

### Create Event (Admin)
```bash
POST /api/events
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Test Event",
  "description": "Event description",
  "date": "2025-12-25T00:00:00Z",
  "time": "7:00 PM",
  "location": "Addis Ababa",
  "image": <file>
}
```

## Cart Endpoints (Requires Auth)

### Get Cart
```bash
GET /api/cart
Authorization: Bearer <token>
```

### Add to Cart
```bash
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id",
  "quantity": 2
}
```

## Order Endpoints (Requires Auth)

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingName": "John Doe",
  "shippingEmail": "john@example.com",
  "shippingPhone": "+251911234567",
  "shippingAddress": "123 Main St, Addis Ababa"
}
```

### Get Orders
```bash
GET /api/orders
Authorization: Bearer <token>
```

## Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Get session
- [ ] Create product (as admin)
- [ ] Get all products
- [ ] Get single product
- [ ] Create article (as admin)
- [ ] Get all articles
- [ ] Create event (as admin)
- [ ] Get all events
- [ ] Add item to cart
- [ ] Get cart
- [ ] Create order
- [ ] Get orders
- [ ] Update order status (as admin)








