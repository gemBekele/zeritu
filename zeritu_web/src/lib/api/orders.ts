import { apiClient } from '../api-client';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  chapaTxRef?: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CreateOrderData {
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
}

export interface CreateOrderResponse {
  order: Order;
  payment_url: string | null;
  error?: string;
}

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/api/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderData): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/api/orders', data);
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: {
      status?: Order['status'];
      paymentStatus?: Order['paymentStatus'];
    }
  ): Promise<Order> => {
    const response = await apiClient.put<Order>(`/api/orders/${id}/status`, data);
    return response.data;
  },

  verifyPayment: async (id: string): Promise<{ order: Order; updated: boolean }> => {
    const response = await apiClient.post<{ order: Order; updated: boolean }>(`/api/orders/${id}/verify-payment`);
    return response.data;
  },
};



