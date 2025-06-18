// User service for managing user data and profiles
import { apiClient } from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  verified: boolean;
  joinedAt: string;
  stats: {
    totalBoronganCreated: number;
    totalBoronganJoined: number;
    totalLapakCreated: number;
    totalTransactions: number;
    rating: number;
    totalReviews: number;
  };
  preferences: {
    enableNotifications: boolean;
    enableLocationSharing: boolean;
    language: 'id' | 'en';
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface UserStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalVerifiedUsers: number;
  averageRating: number;
}

// Mock profile pictures from diverse sources
const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b1d2?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
];

// Indonesian names for more realistic mock data
const MOCK_NAMES = [
  'Sari Wulandari', 'Ahmad Rizki', 'Maya Sari', 'Budi Santoso', 
  'Linda Agustin', 'Rendra Wijaya', 'Dewi Lestari', 'Andi Pratama',
  'Fitri Handayani', 'Dimas Prasetyo', 'Nur Aini', 'Bayu Setiawan',
  'Eka Puteri', 'Fajar Nugraha', 'Gita Sari', 'Hendra Kurniawan'
];

const MOCK_LOCATIONS = [
  'Jakarta Selatan', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang',
  'Medan', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
  'Solo', 'Malang', 'Bogor', 'Batam', 'Pekanbaru'
];

export const getMockUserProfile = (): UserProfile => {
  return {
    id: 'user-001',
    name: 'Sari Wulandari',
    email: 'sari.wulandari@gmail.com',
    phone: '+62 812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1d2?w=200&h=200&fit=crop&crop=face',
    location: 'Jakarta Selatan',
    verified: true,
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
    stats: {
      totalBoronganCreated: 8,
      totalBoronganJoined: 23,
      totalLapakCreated: 12,
      totalTransactions: 45,
      rating: 4.8,
      totalReviews: 31
    },
    preferences: {
      enableNotifications: true,
      enableLocationSharing: true,
      language: 'id',
      theme: 'light'
    }
  };
};

export const getMockUsersList = (): UserProfile[] => {
  return Array.from({ length: 15 }, (_, index) => ({
    id: `user-${String(index + 1).padStart(3, '0')}`,
    name: MOCK_NAMES[index % MOCK_NAMES.length],
    email: `${MOCK_NAMES[index % MOCK_NAMES.length].toLowerCase().replace(' ', '.')}@gmail.com`,
    phone: `+62 81${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    avatar: Math.random() > 0.2 ? MOCK_AVATARS[index % MOCK_AVATARS.length] : undefined,
    location: MOCK_LOCATIONS[index % MOCK_LOCATIONS.length],
    verified: Math.random() > 0.3, // 70% verified
    joinedAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      totalBoronganCreated: Math.floor(Math.random() * 15),
      totalBoronganJoined: Math.floor(Math.random() * 50),
      totalLapakCreated: Math.floor(Math.random() * 20),
      totalTransactions: Math.floor(Math.random() * 100),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
      totalReviews: Math.floor(Math.random() * 50)
    },
    preferences: {
      enableNotifications: Math.random() > 0.3,
      enableLocationSharing: Math.random() > 0.4,
      language: 'id',
      theme: Math.random() > 0.8 ? 'dark' : 'light'
    }
  }));
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await apiClient.put<UserProfile>('/user/profile', profileData);
    return response || getMockUserProfile();
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Return mock updated profile
    return { ...getMockUserProfile(), ...profileData };
  }
};

export const uploadUserAvatar = async (avatarFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await apiClient.post<{ avatarUrl: string }>('/user/avatar', formData);
    return response?.avatarUrl || MOCK_AVATARS[0];
  } catch (error) {
    console.error('Error uploading avatar:', error);
    // Return mock avatar URL
    return MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)];
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const response = await apiClient.get<UserStats>('/user/stats');
    return response || getMockUserStats();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return getMockUserStats();
  }
};

export const getMockUserStats = (): UserStats => {
  return {
    totalUsers: 1247,
    totalActiveUsers: 892,
    totalVerifiedUsers: 634,
    averageRating: 4.6
  };
};

// Helper function to generate random Indonesian user
export const generateRandomUser = (): UserProfile => {
  const users = getMockUsersList();
  return users[Math.floor(Math.random() * users.length)];
}; 