import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Types for API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Base API configuration
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://warungwarga-api.azurewebsites.net';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Reduce timeout to 10 seconds for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token'); // Use consistent token key
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error:`, {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        // Show detailed validation errors for 422
        detail: error.response?.data?.detail,
      });
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // Note: In a real app, you might want to use a router here
        // window.location.href = '/login';
      }
    }
    
    // Handle timeout specifically
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server might be slow');
    }
    
    // Transform error for consistent handling
    const apiError: ApiError = {
      message: error.response?.data?.message || 
               error.message === 'Network Error' ? 'Koneksi bermasalah. Coba lagi nanti.' :
               error.code === 'ECONNABORTED' ? 'Server lambat merespons. Coba lagi.' :
               // For 422 errors, show validation details
               error.response?.status === 422 && error.response?.data?.detail ? 
               `Validation error: ${JSON.stringify(error.response.data.detail)}` :
               error.message || 'Terjadi kesalahan yang tidak diketahui',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
    
    return Promise.reject(apiError);
  }
);

// Helper functions for different HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.get(url, config).then(response => response.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.post(url, data, config).then(response => response.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.put(url, data, config).then(response => response.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config).then(response => response.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    api.delete(url, config).then(response => response.data),
    
  // Upload file helper
  uploadFile: <T = any>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },
  
  // Upload multiple files helper
  uploadFiles: <T = any>(url: string, files: File[], additionalData?: Record<string, any>): Promise<T> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    // Add additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data);
  },
};

// Export the axios instance for direct use if needed
export default api; 