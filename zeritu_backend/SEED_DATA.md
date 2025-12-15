# Seed Data Instructions

This document explains how to populate the database with initial seed data including admin and user accounts, products, articles, and events.

## Quick Start

Run the seed script to populate your database:

```bash
npm run db:seed
```

Or using Prisma directly:

```bash
npx prisma db seed
```

## What Gets Created

### Users
- **Admin User**
  - Email: `admin@zeritu.com`
  - Password: `admin123`
  - Role: `ADMIN`
  - Name: Admin User

- **Normal User**
  - Email: `user@zeritu.com`
  - Password: `user123`
  - Role: `USER`
  - Name: John Doe

### Products (6 items)
- Books: "The Journey of Life", "Signed Book Copy"
- Music: "Music Collection - Greatest Hits", "Concert DVD"
- Merch: "Official T-Shirt", "Hoodie"

### Articles (3 items)
- All published articles with sample content
- Created by the admin user

### Events (5 items)
- 3 upcoming events (Book Signing, Concert Tour, Music Workshop)
- 2 past events (2023 Annual Concert, Book Launch Event)

## Important Notes

⚠️ **Warning**: The seed script will **delete all existing data** before creating new seed data. This includes:
- All users, products, articles, events, orders, and cart items

If you want to keep existing data, modify the seed script to skip the cleanup section.

## Customization

You can modify `prisma/seed.ts` to:
- Add more users
- Create additional products
- Add more articles or events
- Change default passwords
- Skip data cleanup to preserve existing data

## Troubleshooting

If you encounter errors:

1. **Database connection issues**: Make sure your `.env` file has the correct `DATABASE_URL`
2. **Prisma client not generated**: Run `npm run db:generate` first
3. **Type errors**: Make sure all dependencies are installed: `npm install`

## After Seeding

Once seeded, you can:
1. Login to the admin dashboard at `/dashboard` using `admin@zeritu.com` / `admin123`
2. Login as a regular user using `user@zeritu.com` / `user123`
3. Browse products, articles, and events on the frontend
4. Test the checkout flow with the seeded products






