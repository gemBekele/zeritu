"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, Event, EventsResponse, CreateEventData } from '@/lib/api/events';

export const useEvents = (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<EventsResponse>({
    queryKey: ['events', params],
    queryFn: () => eventsApi.getAll(params),
  });
};

export const useEvent = (id: string) => {
  return useQuery<Event>({
    queryKey: ['events', id],
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventData> }) =>
      eventsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};








