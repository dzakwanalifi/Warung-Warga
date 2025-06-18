import { api } from './api'

// Types for API responses
interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    full_name: string
    address?: string
    latitude?: number
    longitude?: number
    created_at: string
    updated_at: string
  }
}

interface RegisterResponse {
  message: string
  user: {
    id: string
    email: string
    full_name: string
    address?: string
    latitude?: number
    longitude?: number
    created_at: string
    updated_at: string
  }
}

// Login function
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    })
    
    return response.data
  } catch (error: any) {
    // Handle different types of errors
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    } else if (error.response?.status === 401) {
      throw new Error('Email atau password salah')
    } else if (error.response?.status >= 500) {
      throw new Error('Terjadi kesalahan server. Silakan coba lagi.')
    } else {
      throw new Error('Terjadi kesalahan. Silakan coba lagi.')
    }
  }
}

// Register function
export const registerUser = async (
  fullName: string, 
  email: string, 
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await api.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    })
    
    return response.data
  } catch (error: any) {
    // Handle different types of errors
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    } else if (error.response?.status === 400) {
      throw new Error('Data yang dimasukkan tidak valid')
    } else if (error.response?.status === 409) {
      throw new Error('Email sudah terdaftar')
    } else if (error.response?.status >= 500) {
      throw new Error('Terjadi kesalahan server. Silakan coba lagi.')
    } else {
      throw new Error('Terjadi kesalahan. Silakan coba lagi.')
    }
  }
}

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/users/me')
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Sesi tidak valid. Silakan login kembali.')
    } else {
      throw new Error('Gagal mengambil data profil')
    }
  }
} 