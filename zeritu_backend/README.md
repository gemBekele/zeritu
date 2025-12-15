# Zeritu Backend API

Backend API for Zeritu Kebede website built with Node.js, Express, PostgreSQL, Prisma, and BetterAuth.

## Features

- 🔐 Authentication with BetterAuth (Email/Password + OAuth)
- 📦 Product management (CRUD)
- 📝 Article management (CRUD)
- 🎉 Event management (CRUD)
- 🛒 Shopping cart functionality
- 💳 Order management with Chapa payment integration
- 📤 Image upload support
- 👥 User roles (Admin/User)

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Chapa account (for payments)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Random secret for auth
- `CHAPA_SECRET_KEY`: Your Chapa secret key
- `CHAPA_PUBLIC_KEY`: Your Chapa public key

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations
npm run db:migrate
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Articles
- `GET /api/articles` - Get all articles (published only for public)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (admin)
- `PUT /api/articles/:id` - Update article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Cart
- `GET /api/cart` - Get user's cart (authenticated)
- `POST /api/cart` - Add item to cart (authenticated)
- `PUT /api/cart/:id` - Update cart item quantity (authenticated)
- `DELETE /api/cart/:id` - Remove item from cart (authenticated)
- `DELETE /api/cart` - Clear cart (authenticated)

### Orders
- `GET /api/orders` - Get user's orders (authenticated) or all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order from cart (authenticated)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `POST /api/orders/webhook` - Chapa payment webhook

## Database Schema

The database includes:
- Users (with roles)
- Products
- Articles
- Events
- Orders
- Cart Items
- BetterAuth tables (Session, Account, Verification)

## Payment Integration

Chapa payment gateway is integrated for Ethiopian payments. When an order is created, a payment URL is returned that redirects to Chapa's checkout page.

## Image Uploads

Images are uploaded to the `uploads/` directory and served at `/uploads/:filename`. Supported formats: JPEG, JPG, PNG, GIF, WEBP.

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Start production
npm start

# Database studio
npm run db:studio
```








