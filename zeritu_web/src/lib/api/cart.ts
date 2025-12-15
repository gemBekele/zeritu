import { apiClient } from '../api-client';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    isActive: boolean;
  };
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponse>('/api/cart');
    return response.data;
  },

  addItem: async (data: AddToCartData): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/api/cart', data);
    return response.data;
  },

  updateItem: async (id: string, quantity: number): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(`/api/cart/${id}`, { quantity });
    return response.data;
  },

  removeItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/cart/${id}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/api/cart');
  },
};








