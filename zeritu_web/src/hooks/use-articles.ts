"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, Article, ArticlesResponse, ArticleComment, CreateArticleData } from '@/lib/api/articles';

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

// Interaction hooks
export const useArticleComments = (articleId: string) => {
  return useQuery<ArticleComment[]>({
    queryKey: ['articles', articleId, 'comments'],
    queryFn: () => articlesApi.getComments(articleId),
    enabled: !!articleId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, data }: { articleId: string; data: { content: string; name?: string; email?: string } }) =>
      articlesApi.addComment(articleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, commentId }: { articleId: string; commentId: string }) =>
      articlesApi.deleteComment(articleId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId] });
    },
  });
};

export const useLikeStatus = (articleId: string) => {
  return useQuery<{ liked: boolean; count: number }>({
    queryKey: ['articles', articleId, 'like'],
    queryFn: () => articlesApi.getLikeStatus(articleId),
    enabled: !!articleId,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, liked }: { articleId: string; liked: boolean }) =>
      liked ? articlesApi.unlikeArticle(articleId) : articlesApi.likeArticle(articleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId, 'like'] });
      queryClient.invalidateQueries({ queryKey: ['articles', variables.articleId] });
    },
  });
};

export const useIncrementView = () => {
  return useMutation({
    mutationFn: (id: string) => articlesApi.incrementView(id),
  });
};








