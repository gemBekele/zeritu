"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart as useCartAPI, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { data: backendCart, isLoading: cartLoading } = useCartAPI();
  const addToCartMutation = useAddToCart();
  const updateCartMutation = useUpdateCartItem();
  const removeCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();
  
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const [hasMergedCart, setHasMergedCart] = useState(false);

  // Load from local storage on mount (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setLocalItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from local storage", e);
        }
      }
      setHasMergedCart(false);
    }
  }, [isAuthenticated]);

  // Merge local cart with backend cart when user logs in
  useEffect(() => {
    if (isAuthenticated && !hasMergedCart && !cartLoading) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const localCartItems: CartItem[] = JSON.parse(savedCart);
          if (localCartItems.length > 0) {
            console.log('Merging local cart items to backend:', localCartItems);
            
            // Add all local cart items to backend
            const mergePromises = localCartItems.map(item => 
              addToCartMutation.mutateAsync({
                productId: item.id,
                quantity: item.quantity,
              }).catch(err => {
                console.error(`Failed to add ${item.id} to backend cart:`, err);
              })
            );
            
            Promise.all(mergePromises).then(() => {
              // Clear local storage after successful merge
              localStorage.removeItem("cart");
              setLocalItems([]);
              setHasMergedCart(true);
              console.log('Cart merge completed');
            });
          } else {
            // No local items to merge
            setHasMergedCart(true);
          }
        } catch (e) {
          console.error("Failed to merge cart", e);
          setHasMergedCart(true);
        }
      } else {
        // No local cart to merge
        setHasMergedCart(true);
      }
    }
  }, [isAuthenticated, hasMergedCart, cartLoading, addToCartMutation]);

  // Save to local storage whenever local items change (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && !hasMergedCart) {
      localStorage.setItem("cart", JSON.stringify(localItems));
    }
  }, [localItems, isAuthenticated, hasMergedCart]);

  // Convert backend cart items to local format
  const items: CartItem[] = isAuthenticated && backendCart
    ? backendCart.items.map(item => ({
        id: item.productId,
        title: item.product.title,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      }))
    : localItems;

  const addItem = async (newItem: Omit<CartItem, "quantity">) => {
    if (isAuthenticated) {
      // Use backend API
      try {
        await addToCartMutation.mutateAsync({
          productId: newItem.id,
          quantity: 1,
        });
      } catch (error) {
        console.error('Failed to add item to cart:', error);
      }
    } else {
      // Use local storage
      setLocalItems((prev) => {
        const existing = prev.find((item) => item.id === newItem.id);
        if (existing) {
          return prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...newItem, quantity: 1 }];
      });
    }
  };

  const removeItem = async (id: string) => {
    if (isAuthenticated) {
      // Find the cart item ID from backend
      const cartItem = backendCart?.items.find(item => item.productId === id);
      if (cartItem) {
        try {
          await removeCartMutation.mutateAsync(cartItem.id);
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
        }
      }
    } else {
      setLocalItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    if (isAuthenticated) {
      // Find the cart item ID from backend
      const cartItem = backendCart?.items.find(item => item.productId === id);
      if (cartItem) {
        try {
          await updateCartMutation.mutateAsync({
            id: cartItem.id,
            quantity,
          });
        } catch (error) {
          console.error('Failed to update cart item:', error);
        }
      }
    } else {
      setLocalItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartMutation.mutateAsync();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setLocalItems([]);
    }
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading: cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
