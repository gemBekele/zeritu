import { apiClient } from '../api-client';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface ArticleComment {
  id: string;
  articleId: string;
  userId?: string;
  name?: string;
  email?: string;
  content: string;
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    image?: string;
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
    } else if ((data as any).imageUrl) {
      formData.append('imageUrl', (data as any).imageUrl);
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
    } else if ((data as any).imageUrl) {
      formData.append('imageUrl', (data as any).imageUrl);
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

  incrementView: async (id: string): Promise<void> => {
    await apiClient.post(`/api/articles/${id}/view`);
  },

  getComments: async (id: string): Promise<ArticleComment[]> => {
    const response = await apiClient.get<ArticleComment[]>(`/api/articles/${id}/comments`);
    return response.data;
  },

  addComment: async (id: string, data: { content: string; name?: string; email?: string }): Promise<ArticleComment> => {
    const response = await apiClient.post<ArticleComment>(`/api/articles/${id}/comments`, data);
    return response.data;
  },

  deleteComment: async (articleId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/api/articles/${articleId}/comments/${commentId}`);
  },

  getLikeStatus: async (id: string): Promise<{ liked: boolean; count: number }> => {
    const response = await apiClient.get(`/api/articles/${id}/like/status`);
    return response.data;
  },

  likeArticle: async (id: string): Promise<{ liked: boolean; count: number }> => {
    const response = await apiClient.post(`/api/articles/${id}/like`);
    return { liked: true, count: response.data.count };
  },

  unlikeArticle: async (id: string): Promise<{ liked: boolean; count: number }> => {
    const response = await apiClient.delete(`/api/articles/${id}/like`);
    return { liked: false, count: response.data.count };
  },
};







