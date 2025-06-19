import { User, AuthResponse } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface LoginResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

interface RegisterResponse {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    // Check if response has the expected structure
    if (!response || !response.user || !response.session) {
      console.error('Unexpected API response structure:', response);
      throw new Error('Format respons tidak valid dari server');
    }

    // Store token in localStorage
    localStorage.setItem('access_token', response.session.access_token);
    
    return response;
  } catch (error: any) {
    console.error('Login error details:', error);
    
    // Handle different error scenarios
    if (error.status === 400) {
      throw new Error('Email atau password tidak valid');
    } else if (error.status === 401) {
      throw new Error('Email atau password salah');
    } else if (error.status === 429) {
      throw new Error('Terlalu banyak percobaan login. Coba lagi nanti');
    } else if (error.message.includes('Format respons tidak valid')) {
      throw error; // Re-throw our custom error
    } else {
      throw new Error(error.message || 'Gagal masuk. Silakan coba lagi');
    }
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post('/auth/register', {
      full_name: fullName,
      email,
      password,
    });

    // Check if response has the expected structure
    if (!response || !response.user || !response.session) {
      console.error('Unexpected API response structure:', response);
      throw new Error('Format respons tidak valid dari server');
    }

    // Store token in localStorage
    localStorage.setItem('access_token', response.session.access_token);
    
    return response;
  } catch (error: any) {
    console.error('Register error details:', error);
    
    // Handle different error scenarios
    if (error.status === 400) {
      throw new Error('Data registrasi tidak valid');
    } else if (error.status === 409) {
      throw new Error('Email sudah digunakan');
    } else if (error.status === 422) {
      throw new Error('Format data tidak sesuai');
    } else if (error.message.includes('Format respons tidak valid')) {
      throw error; // Re-throw our custom error
    } else {
      throw new Error(error.message || 'Gagal mendaftar. Silakan coba lagi');
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if logout fails on server, clear local storage
    console.warn('Logout request failed, but clearing local session');
  } finally {
    // Always clear token from localStorage
    localStorage.removeItem('access_token');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/users/me');
    return response;
  } catch (error: any) {
    if (error.status === 401) {
      throw new Error('Sesi telah berakhir. Silakan login kembali');
    } else {
      throw new Error('Gagal mengambil data pengguna');
    }
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Data profil tidak valid');
    } else if (error.response?.status === 401) {
      throw new Error('Sesi telah berakhir. Silakan login kembali');
    } else {
      throw new Error('Gagal memperbarui profil');
    }
  }
}; 