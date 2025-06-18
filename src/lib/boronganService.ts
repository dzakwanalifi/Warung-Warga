import { apiClient } from './api';

// Types for Borongan API
export interface BoronganItem {
  id: string;
  title: string;
  description: string;
  target_quantity: number;
  current_quantity: number;
  price_per_unit: number;
  original_price_per_unit?: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  participants_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BoronganStats {
  totalActiveBorongan: number;
  totalParticipants: number;
  totalSavings: number;
}

// Extended types for detail page
export interface BoronganDetail extends BoronganItem {
  images: string[];
  location: string;
  pickup_location: string;
  terms_conditions: string[];
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    total_borongan_created: number;
    is_verified: boolean;
  };
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    joined_at: string;
    quantity: number;
  }>;
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
  }>;
}

// Fetch all borongan
export const getBoronganList = async (): Promise<BoronganItem[]> => {
  try {
    const response = await apiClient.get<BoronganItem[]>('/borongan');
    return response || [];
  } catch (error) {
    console.error('Error fetching borongan list:', error);
    return [];
  }
};

// Fetch borongan detail by ID
export const getBoronganDetail = async (id: string): Promise<BoronganDetail | null> => {
  try {
    const response = await apiClient.get<BoronganDetail>(`/borongan/${id}`);
    return response || null;
  } catch (error) {
    console.error('Error fetching borongan detail:', error);
    return null;
  }
};

// Calculate statistics from borongan data
export const calculateBoronganStats = (boronganList: BoronganItem[]): BoronganStats => {
  const activeBorongan = boronganList.filter(item => item.status === 'active');
  
  const totalActiveBorongan = activeBorongan.length;
  
  const totalParticipants = activeBorongan.reduce((total, item) => {
    return total + item.participants_count;
  }, 0);
  
  // Calculate total savings based on price difference and current quantity
  const totalSavings = activeBorongan.reduce((total, item) => {
    if (item.original_price_per_unit && item.original_price_per_unit > item.price_per_unit) {
      const savingsPerUnit = item.original_price_per_unit - item.price_per_unit;
      return total + (savingsPerUnit * item.current_quantity);
    }
    return total;
  }, 0);

  return {
    totalActiveBorongan,
    totalParticipants,
    totalSavings
  };
};

// Mock data for development/MVP
export const getMockBoronganStats = (): BoronganStats => {
  return {
    totalActiveBorongan: 12,
    totalParticipants: 89,
    totalSavings: 2500000 // Rp 2.5 Juta
  };
};

// Mock detailed borongan data for development
export const getMockBoronganDetail = (id: string): BoronganDetail => {
  return {
    id: id,
    title: "Beras Premium Organik 25kg",
    description: "Beras organik premium langsung dari petani lokal. Kualitas terjamin, bebas pestisida, dan sudah bersertifikat organik. Cocok untuk keluarga yang peduli kesehatan.",
    target_quantity: 10,
    current_quantity: 7,
    price_per_unit: 180000,
    original_price_per_unit: 220000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: 'active',
    participants_count: 7,
    created_by: "user123",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    images: [
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop"
    ],
    location: "Jakarta Selatan",
    pickup_location: "Warung Pak Budi, Jl. Kemang Raya No. 45",
    terms_conditions: [
      "Pembayaran dilakukan di muka saat bergabung",
      "Barang dapat diambil setelah target tercapai",
      "Lokasi pengambilan di Warung Pak Budi",
      "Batas waktu pengambilan 3 hari setelah notifikasi",
      "Tidak ada pengembalian uang kecuali target tidak tercapai"
    ],
    organizer: {
      id: "user123",
      name: "Sari Wulandari",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1d2?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      total_borongan_created: 23,
      is_verified: true
    },
    participants: [
      {
        id: "p1",
        name: "Ahmad Rizki",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        joined_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1
      },
      {
        id: "p2",
        name: "Maya Sari",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        joined_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 2
      },
      {
        id: "p3",
        name: "Budi Santoso",
        joined_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1
      },
      {
        id: "p4",
        name: "Linda Agustin",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
        joined_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1
      },
      {
        id: "p5",
        name: "Rendra Wijaya",
        joined_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 2
      }
    ],
    timeline: [
      {
        id: "t1",
        title: "Borongan Dibuat",
        description: "Borongan berhasil dibuat dan mulai mengumpulkan peserta",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: "t2",
        title: "Pengumpulan Peserta",
        description: "Sedang mengumpulkan peserta hingga mencapai target minimum",
        date: new Date().toISOString(),
        status: 'current'
      },
      {
        id: "t3",
        title: "Pemesanan ke Supplier",
        description: "Pesanan akan diteruskan ke supplier setelah target tercapai",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: "t4",
        title: "Pengiriman Barang",
        description: "Barang dikirim dari supplier ke lokasi pengambilan",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: "t5",
        title: "Pengambilan Barang",
        description: "Peserta dapat mengambil barang di lokasi yang telah ditentukan",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      }
    ]
  };
}; 