import { apiClient, createFormData } from '../api-client';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  capacity: number;
  ticketPrice: number;
  status: 'UPCOMING' | 'PAST' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  _count?: { registrations: number };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  quantity: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'WAITING';
  ticketRef: string;
  createdAt: string;
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
  capacity?: number;
  ticketPrice?: number;
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

  getRegistrations: async (id: string): Promise<EventRegistration[]> => {
    const response = await apiClient.get<EventRegistration[]>(`/api/events/${id}/registrations`);
    return response.data;
  },

  register: async (id: string, data: { name: string; email: string; phone?: string; quantity?: number }): Promise<EventRegistration> => {
    const response = await apiClient.post<EventRegistration>(`/api/events/${id}/register`, data);
    return response.data;
  },

  cancelRegistration: async (eventId: string, regId: string): Promise<void> => {
    await apiClient.delete(`/api/events/${eventId}/registrations/${regId}`);
  },
};








