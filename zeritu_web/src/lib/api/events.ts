import { apiClient, createFormData } from '../api-client';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status?: 'UPCOMING' | 'PAST' | 'CANCELLED';
  image?: File;
}

export const eventsApi = {
  getAll: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<EventsResponse> => {
    const response = await apiClient.get<EventsResponse>('/api/events', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Event> => {
    const response = await apiClient.get<Event>(`/api/events/${id}`);
    return response.data;
  },

  create: async (data: CreateEventData): Promise<Event> => {
    const formData = createFormData(
      {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        status: data.status || 'UPCOMING',
      },
      data.image
    );

    const response = await apiClient.post<Event>('/api/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateEventData>): Promise<Event> => {
    const formData = createFormData(
      {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        status: data.status,
      },
      data.image
    );

    const response = await apiClient.put<Event>(`/api/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/events/${id}`);
  },
};








