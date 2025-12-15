import { apiClient, createFormData } from '../api-client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'Books' | 'Music' | 'Merch';
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: 'Books' | 'Music' | 'Merch';
  stock?: number;
  isActive?: boolean;
  image?: File;
}

export const productsApi = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/api/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductData): Promise<Product> => {
    const formData = createFormData(
      {
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        category: data.category,
        stock: data.stock?.toString() || '0',
        isActive: data.isActive?.toString() || 'true',
      },
      data.image
    );

    const response = await apiClient.post<Product>('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    const formData = createFormData(
      {
        title: data.title,
        description: data.description,
        price: data.price?.toString(),
        category: data.category,
        stock: data.stock?.toString(),
        isActive: data.isActive?.toString(),
      },
      data.image
    );

    const response = await apiClient.put<Product>(`/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/products/${id}`);
  },
};








