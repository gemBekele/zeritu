"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, User } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session, isLoading } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: authApi.getSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
    },
  });

  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'session'], null);
      queryClient.clear();
      router.push('/');
    },
  });

  return {
    user: session?.user || null,
    isLoading,
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === 'ADMIN',
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
  };
};








