# Frontend-Backend Integration Complete

## Overview
The frontend has been successfully integrated with the backend API using TanStack Query for centralized API request management.

## What's Been Integrated

### 1. TanStack Query Setup
- ✅ Installed `@tanstack/react-query` and `@tanstack/react-query-devtools`
- ✅ Created `QueryProvider` component
- ✅ Wrapped app in `QueryProvider` in `layout.tsx`

### 2. API Client
- ✅ Created centralized API client (`src/lib/api-client.ts`)
- ✅ Configured with base URL from environment variables
- ✅ Set up cookie-based authentication support
- ✅ Added request/response interceptors

### 3. API Modules
All API modules created in `src/lib/api/`:
- ✅ `auth.ts` - Authentication (sign up, sign in, sign out, session)
- ✅ `products.ts` - Products CRUD
- ✅ `articles.ts` - Articles CRUD
- ✅ `events.ts` - Events CRUD
- ✅ `cart.ts` - Cart management
- ✅ `orders.ts` - Order management

### 4. React Hooks
All custom hooks created in `src/hooks/`:
- ✅ `use-auth.ts` - Authentication state and actions
- ✅ `use-products.ts` - Products queries and mutations
- ✅ `use-articles.ts` - Articles queries and mutations
- ✅ `use-events.ts` - Events queries and mutations
- ✅ `use-cart.ts` - Cart queries and mutations
- ✅ `use-orders.ts` - Orders queries and mutations

### 5. Component Updates
- ✅ **Shop Page** (`src/app/shop/page.tsx`) - Now fetches products from API
- ✅ **Articles Section** (`src/components/articles-section.tsx`) - Fetches published articles
- ✅ **Events Page** (`src/app/events/page.tsx`) - Fetches upcoming and past events
- ✅ **Dashboard** (`src/app/dashboard/page.tsx`) - Full CRUD integration for products and articles
- ✅ **Product Card** (`src/components/product-card.tsx`) - Updated to use API Product type

### 6. Image Handling
- ✅ All images now properly reference backend URLs
- ✅ Images from backend are prefixed with `http://localhost:3002` if not absolute URLs

## Environment Variables

Create a `.env.local` file in the frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Usage Examples

### Using Products
```typescript
import { useProducts } from '@/hooks/use-products';

function MyComponent() {
  const { data, isLoading } = useProducts({ category: 'Books' });
  const products = data?.products || [];
  // ...
}
```

### Using Authentication
```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, signIn, signOut } = useAuth();
  // ...
}
```

### Using Cart
```typescript
import { useCart, useAddToCart } from '@/hooks/use-cart';

function MyComponent() {
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  
  const handleAdd = async () => {
    await addToCart.mutateAsync({ productId: '123', quantity: 1 });
  };
}
```

## Next Steps

1. **Authentication UI**: Create login/signup pages
2. **Cart Sync**: Update cart context to sync with backend when authenticated
3. **Product Forms**: Create forms for adding/editing products and articles
4. **Order Checkout**: Implement checkout flow with Chapa payment
5. **Error Handling**: Add better error messages and loading states
6. **Image Upload**: Create UI for uploading images in dashboard

## Testing

To test the integration:
1. Make sure backend is running on `http://localhost:3002`
2. Start frontend: `npm run dev`
3. Navigate to different pages to see API data loading
4. Check browser DevTools Network tab to see API calls
5. Use React Query DevTools to inspect query cache








