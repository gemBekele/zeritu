"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, Article, ArticlesResponse, CreateArticleData } from '@/lib/api/articles';

export const useArticles = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  published?: 'all' | 'true';
}) => {
  return useQuery<ArticlesResponse>({
    queryKey: ['articles', params],
    queryFn: () => articlesApi.getAll(params),
  });
};

export const useArticle = (id: string) => {
  return useQuery<Article>({
    queryKey: ['articles', id],
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleData) => articlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateArticleData> }) =>
      articlesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articles', variables.id] });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};








