import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://warungwarga-api.azurewebsites.net',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever you store it
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        // Redirect to login page if needed
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

// Export commonly used HTTP methods for convenience
export const api = {
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
  patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
} 