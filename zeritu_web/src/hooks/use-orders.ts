"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, Order, CreateOrderData, CreateOrderResponse } from '@/lib/api/orders';

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  });
};

export const useOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      paymentStatus,
    }: {
      id: string;
      status?: Order['status'];
      paymentStatus?: Order['paymentStatus'];
    }) => ordersApi.updateStatus(id, { status, paymentStatus }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
    },
  });
};








