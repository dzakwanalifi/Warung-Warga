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

// Mock data dengan lebih banyak variasi
export const getMockBoronganList = (): BoronganItem[] => {
  return [
    {
      id: "brg001",
      title: "Beras Premium Organik 25kg",
      description: "Beras organik premium langsung dari petani lokal. Kualitas terjamin, bebas pestisida, dan sudah bersertifikat organik.",
      target_quantity: 10,
      current_quantity: 7,
      price_per_unit: 180000,
      original_price_per_unit: 220000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 7,
      created_by: "user123",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg002",
      title: "Minyak Goreng Kemasan 2L",
      description: "Minyak goreng berkualitas dalam kemasan 2 liter. Cocok untuk kebutuhan rumah tangga sehari-hari.",
      target_quantity: 20,
      current_quantity: 15,
      price_per_unit: 32000,
      original_price_per_unit: 38000,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 15,
      created_by: "user456",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg003",
      title: "Gula Pasir Kemasan 1kg",
      description: "Gula pasir murni kemasan 1kg dari pabrik gula terpercaya. Kualitas SNI dan harga terjangkau.",
      target_quantity: 50,
      current_quantity: 42,
      price_per_unit: 14500,
      original_price_per_unit: 17000,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 28,
      created_by: "user789",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg004",
      title: "Telur Ayam Kampung 1kg",
      description: "Telur ayam kampung segar langsung dari peternak lokal. Ukuran medium-large dengan kualitas premium.",
      target_quantity: 30,
      current_quantity: 30,
      price_per_unit: 32000,
      original_price_per_unit: 38000,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      participants_count: 25,
      created_by: "user101",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg005",
      title: "Daging Sapi Segar 1kg",
      description: "Daging sapi segar pilihan dari RPH bersertifikat halal. Cocok untuk berbagai masakan.",
      target_quantity: 15,
      current_quantity: 12,
      price_per_unit: 135000,
      original_price_per_unit: 150000,
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 12,
      created_by: "user202",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg006",
      title: "Kopi Arabika Premium 500g",
      description: "Kopi arabika premium single origin dari Toraja. Roasted fresh untuk cita rasa terbaik.",
      target_quantity: 25,
      current_quantity: 18,
      price_per_unit: 85000,
      original_price_per_unit: 95000,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 18,
      created_by: "user303",
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg007",
      title: "Buah Jeruk Manis 5kg",
      description: "Jeruk manis segar langsung dari kebun. Rasa manis natural dan kandungan vitamin C tinggi.",
      target_quantity: 40,
      current_quantity: 35,
      price_per_unit: 25000,
      original_price_per_unit: 30000,
      deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 22,
      created_by: "user404",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg008",
      title: "Ikan Lele Segar 2kg",
      description: "Ikan lele segar dari kolam budidaya bersih. Sudah dibersihkan dan siap untuk dimasak.",
      target_quantity: 20,
      current_quantity: 16,
      price_per_unit: 28000,
      original_price_per_unit: 35000,
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 16,
      created_by: "user505",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg009",
      title: "Cabai Merah Segar 1kg",
      description: "Cabai merah segar dengan tingkat kepedasan sedang. Cocok untuk bumbu masakan sehari-hari.",
      target_quantity: 35,
      current_quantity: 8,
      price_per_unit: 45000,
      original_price_per_unit: 55000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 8,
      created_by: "user606",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg010",
      title: "Tepung Terigu Protein Tinggi 1kg",
      description: "Tepung terigu protein tinggi cocok untuk membuat roti, kue, dan berbagai adonan.",
      target_quantity: 60,
      current_quantity: 55,
      price_per_unit: 12500,
      original_price_per_unit: 15000,
      deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 38,
      created_by: "user707",
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg011",
      title: "Mentega Tawar 500g",
      description: "Mentega tawar berkualitas premium untuk keperluan baking dan masak. Tekstur lembut dan rasa gurih.",
      target_quantity: 25,
      current_quantity: 20,
      price_per_unit: 45000,
      original_price_per_unit: 52000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 20,
      created_by: "user808",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "brg012",
      title: "Sayur Bayam Hidroponik 250g",
      description: "Sayur bayam segar hasil hidroponik. Bebas pestisida, bersih, dan bergizi tinggi.",
      target_quantity: 50,
      current_quantity: 12,
      price_per_unit: 8500,
      original_price_per_unit: 12000,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants_count: 12,
      created_by: "user909",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

// Fetch all borongan
export const getBoronganList = async (): Promise<BoronganItem[]> => {
  try {
    console.log('🚀 Calling API: GET /api/borongan');
    const response = await apiClient.get<BoronganItem[]>('/api/borongan');
    console.log('✅ API Response received:', response);
    return response;
  } catch (error) {
    console.warn('⚠️ API call failed, using mock data:', error);
    return getMockBoronganList();
  }
};

// Fetch borongan detail by ID
export const getBoronganDetail = async (id: string): Promise<BoronganDetail | null> => {
  try {
    console.log(`🚀 Calling API: GET /api/borongan/${id}`);
    const response = await apiClient.get<BoronganDetail>(`/api/borongan/${id}`);
    console.log('✅ API Response received:', response);
    return response;
  } catch (error) {
    console.warn('⚠️ API call failed, using mock data:', error);
    return getMockBoronganDetail(id);
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
  const mockData = getMockBoronganList();
  return calculateBoronganStats(mockData);
};

// Mock detailed borongan data for development
export const getMockBoronganDetail = (id: string): BoronganDetail => {
  const mockList = getMockBoronganList();
  const baseBorongan = mockList.find(item => item.id === id) || mockList[0];
  
  // Product images based on borongan type
  const getProductImages = (title: string) => {
    if (title.includes('Beras')) {
      return [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Minyak')) {
      return [
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Gula')) {
      return [
        "https://images.unsplash.com/photo-1518963915188-bb6d7e4b9e70?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571115764595-6461ffad8d80?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Telur')) {
      return [
        "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Daging')) {
      return [
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Kopi')) {
      return [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Jeruk') || title.includes('Buah')) {
      return [
        "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1521671413015-ce2b0103c8c2?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Ikan')) {
      return [
        "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1555976095-4b6a6a9d5eb4?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Cabai')) {
      return [
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Tepung')) {
      return [
        "https://images.unsplash.com/photo-1628783002819-d6a11b58b117?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&h=300&fit=crop"
      ];
    } else if (title.includes('Mentega')) {
      return [
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1628783002819-d6a11b58b117?w=500&h=300&fit=crop"
      ];
    } else {
      return [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500&h=300&fit=crop"
      ];
    }
  };
  
  return {
    ...baseBorongan,
    images: getProductImages(baseBorongan.title),
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
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
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
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
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

// UPDATE borongan
export const updateBorongan = async (id: string, updates: Partial<BoronganItem>): Promise<BoronganItem | null> => {
  try {
    const response = await apiClient.put<BoronganItem>(`/borongan/${id}`, updates);
    return response || null;
  } catch (error) {
    console.error('Error updating borongan:', error);
    
    // For development/MVP, simulate update with mock data
    const mockList = getMockBoronganList();
    const existingBorongan = mockList.find(item => item.id === id);
    
    if (existingBorongan) {
      const updatedBorongan = {
        ...existingBorongan,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Simulate successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updatedBorongan;
    }
    
    throw new Error('Borongan tidak ditemukan');
  }
};

// DELETE borongan
export const deleteBorongan = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/borongan/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting borongan:', error);
    
    // For development/MVP, simulate deletion
    const mockList = getMockBoronganList();
    const exists = mockList.some(item => item.id === id);
    
    if (exists) {
      // Simulate successful deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    
    throw new Error('Borongan tidak ditemukan');
  }
};

// CREATE borongan
export const createBorongan = async (boronganData: Omit<BoronganItem, 'id' | 'created_at' | 'updated_at' | 'current_quantity' | 'participants_count'>): Promise<BoronganItem> => {
  try {
    console.log('🚀 Calling API: POST /api/borongan', boronganData);
    const response = await apiClient.post<BoronganItem>('/api/borongan', boronganData);
    console.log('✅ Borongan created successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creating borongan via API:', error);
    
    // For development/MVP, simulate creation with mock data as fallback
    console.warn('⚠️ Using mock creation as fallback');
    const newBorongan: BoronganItem = {
      ...boronganData,
      id: `brg${Date.now()}`,
      current_quantity: 0,
      participants_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return newBorongan;
  }
};

// JOIN borongan
export const joinBorongan = async (id: string, quantity: number = 1): Promise<boolean> => {
  try {
    console.log(`🚀 Calling API: POST /api/borongan/${id}/join`, { quantity });
    await apiClient.post(`/api/borongan/${id}/join`, { quantity });
    console.log('✅ Successfully joined borongan');
    return true;
  } catch (error) {
    console.error('❌ Error joining borongan via API:', error);
    
    // For development/MVP, simulate join as fallback
    console.warn('⚠️ Using mock join as fallback');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};

// LEAVE borongan
export const leaveBorongan = async (id: string): Promise<boolean> => {
  try {
    console.log(`🚀 Calling API: POST /api/borongan/${id}/leave`);
    await apiClient.post(`/api/borongan/${id}/leave`);
    console.log('✅ Successfully left borongan');
    return true;
  } catch (error) {
    console.error('❌ Error leaving borongan via API:', error);
    
    // For development/MVP, simulate leave as fallback
    console.warn('⚠️ Using mock leave as fallback');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}; 