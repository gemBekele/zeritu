import { apiClient, createFormData } from '../api-client';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateArticleData {
  title: string;
  excerpt: string;
  content: string;
  published?: boolean;
  image?: File;
}

export const articlesApi = {
  getAll: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
    published?: 'all' | 'true';
  }): Promise<ArticlesResponse> => {
    const response = await apiClient.get<ArticlesResponse>('/api/articles', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/api/articles/${id}`);
    return response.data;
  },

  create: async (data: CreateArticleData): Promise<Article> => {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    formData.append('published', (data.published || false).toString());
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<Article>('/api/articles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateArticleData>): Promise<Article> => {
    const formData = new FormData();
    
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.excerpt !== undefined) formData.append('excerpt', data.excerpt);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.published !== undefined) formData.append('published', data.published.toString());
    
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.put<Article>(`/api/articles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/articles/${id}`);
  },
};







