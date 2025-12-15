import { apiClient } from '../api-client';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/sign-up', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/sign-in', data);
    return response.data;
  },

  signOut: async (): Promise<void> => {
    await apiClient.post('/api/auth/sign-out');
  },

  getSession: async (): Promise<{ user: User } | null> => {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/session');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};








