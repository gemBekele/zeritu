import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Only redirect to login for checkout and order-related endpoints
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isCheckoutRelated = currentPath.includes('/checkout') || 
                                  currentPath.includes('/orders') ||
                                  currentPath.includes('/dashboard');
        
        // Only redirect if not already on auth pages and it's a checkout/order related page
        if (isCheckoutRelated && 
            !currentPath.includes('/login') && 
            !currentPath.includes('/signup')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    
    // Format error message for better UX
    const errorMessage = error.response?.data
      ? (error.response.data as any).message || (error.response.data as any).error || 'An error occurred'
      : error.message || 'Network error. Please check your connection.';
    
    const formattedError = new Error(errorMessage);
    (formattedError as any).response = error.response;
    (formattedError as any).status = error.response?.status;
    
    return Promise.reject(formattedError);
  }
);

// Helper function for form data requests
export const createFormData = (data: Record<string, any>, file?: File): FormData => {
  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  
  if (file) {
    formData.append('image', file);
  }
  
  return formData;
};

