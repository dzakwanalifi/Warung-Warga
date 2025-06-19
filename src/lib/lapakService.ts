import { apiClient } from '@/lib/api';
import { Lapak, LapakCreate, LapakListResponse, LapakAnalysisResult, NearbyParams } from '@/lib/types';
import { generateWhatsAppUrl } from './utils';

// Types for Lapak API
export interface LapakItem {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  stock: number;
  category: string;
  location: string;
  images: string[];
  seller: {
    name: string;
    rating: number;
    total_sales: number;
    verified: boolean;
  };
  tags: string[];
  status: 'available' | 'sold_out' | 'inactive';
  created_at: string;
  updated_at: string;
  views: number;
  favorites: number;
}

export interface LapakStats {
  totalActiveLapak: number;
  totalViews: number;
  totalSales: number;
}

// Get nearby lapak based on user location - Updated to match API documentation
export const getNearbyLapak = async (params: NearbyParams): Promise<LapakListResponse> => {
  try {
    console.log('🚀 Calling API: GET /api/lapak/nearby', params);
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get<LapakListResponse>(`/api/lapak/nearby?${queryParams.toString()}`);
    console.log('✅ API Response received:', response);
    return response;
  } catch (error) {
    console.warn('⚠️ API call failed, using mock data:', error);
    
    // Return mock data as fallback
    return getMockLapakData();
  }
};

// Mock data for development/fallback
const getMockLapakData = (): LapakListResponse => {
  const mockLapak: Lapak[] = [
    {
      id: 'mock-1',
      seller_id: 'seller-1',
      title: 'Sayuran Segar Organik',
      description: 'Sayuran segar dari kebun sendiri. Bayam, kangkung, dan sawi hijau.',
      price: 15000,
      unit: 'ikat',
      stock_quantity: 20,
      image_urls: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'],
      status: 'available' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-1',
        user_id: 'user-1',
        full_name: 'Ibu Sari',
        address: 'Jl. Merdeka No. 123',
        phone_number: '081234567890',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 0.5
    },
    {
      id: 'mock-2',
      seller_id: 'seller-2',
      title: 'Buah-buahan Lokal',
      description: 'Jeruk, apel, dan pisang segar langsung dari petani.',
      price: 25000,
      unit: 'kg',
      stock_quantity: 15,
      image_urls: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'],
      status: 'available' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-2',
        user_id: 'user-2',
        full_name: 'Pak Joko',
        address: 'Jl. Raya No. 456',
        phone_number: '082345678901',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 1.2
    },
    {
      id: 'mock-3',
      seller_id: 'seller-3',
      title: 'Ikan Segar Tangkapan Hari Ini',
      description: 'Ikan bandeng, mujair, dan lele segar baru dipanen.',
      price: 35000,
      unit: 'kg',
      stock_quantity: 8,
      image_urls: ['https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400'],
      status: 'available' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-3',
        user_id: 'user-3',
        full_name: 'Bu Rina',
        address: 'Jl. Pasar No. 789',
        phone_number: '083456789012',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 0.8
    },
    {
      id: 'mock-4',
      seller_id: 'seller-4',
      title: 'Tempe & Tahu Rumahan',
      description: 'Tempe dan tahu buatan sendiri, fresh dan higienis.',
      price: 5000,
      unit: 'potong',
      stock_quantity: 50,
      image_urls: ['https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400'],
      status: 'available' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-4',
        user_id: 'user-4',
        full_name: 'Pak Budi',
        address: 'Jl. Tahu Tempe No. 321',
        phone_number: '084567890123',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 1.5
    },
    {
      id: 'mock-5',
      seller_id: 'seller-5',
      title: 'Jajanan Pasar Tradisional',
      description: 'Klepon, onde-onde, dan kue tradisional lainnya.',
      price: 10000,
      unit: 'bungkus',
      stock_quantity: 25,
      image_urls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      status: 'available' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-5',
        user_id: 'user-5',
        full_name: 'Ibu Dewi',
        address: 'Jl. Manis No. 654',
        phone_number: '085678901234',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 2.1
    },
    {
      id: 'mock-6',
      seller_id: 'seller-6',
      title: 'Ayam Kampung & Telur',
      description: 'Ayam kampung segar dan telur ayam kampung asli.',
      price: 80000,
      unit: 'ekor',
      stock_quantity: 5,
      image_urls: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400'],
      status: 'sold_out' as const,
      latitude: -6.5562699,
      longitude: 106.7397488,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: 'seller-6',
        user_id: 'user-6',
        full_name: 'Pak Hadi',
        address: 'Jl. Ternak No. 987',
        phone_number: '086789012345',
        latitude: -6.5562699,
        longitude: 106.7397488,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      distance: 0.3
    }
  ];

  return {
    lapak: mockLapak,
    total: mockLapak.length,
    page: 1,
    limit: 12
  };
};

// Get detailed information about a specific lapak
export const getLapakDetail = async (lapakId: string): Promise<Lapak> => {
  try {
    const response = await apiClient.get(`/lapak/${lapakId}`);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch lapak detail:', error);
    
    if (error.status === 404) {
      throw new Error('Lapak tidak ditemukan');
    }
    
    throw new Error(error.message || 'Gagal mengambil detail lapak');
  }
};

// Create a new lapak - Updated to match API documentation
export const createLapak = async (lapakData: LapakCreate, images: File[]): Promise<Lapak> => {
  try {
    console.log('🚀 Calling API: POST /api/lapak/create', { lapakData, imageCount: images.length });
    
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Add lapak data
    Object.entries(lapakData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    // Add images
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    const response = await apiClient.post<Lapak>('/api/lapak/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ Lapak created successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creating lapak via API:', error);
    
    // For development/MVP, simulate creation as fallback
    console.warn('⚠️ Using mock creation as fallback');
    const mockLapak: Lapak = {
      id: `lapak_${Date.now()}`,
      seller_id: "demo_user_id",
      title: lapakData.title,
      description: lapakData.description,
      price: parseFloat(lapakData.price.toString()),
      unit: lapakData.unit,
      stock_quantity: lapakData.stock_quantity,
      image_urls: images.map((_, index) => `https://picsum.photos/400/300?random=${Date.now() + index}`),
      status: 'available',
      latitude: 0,
      longitude: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller: {
        id: "demo_seller_id",
        user_id: "demo_user_id",
        full_name: "Demo User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockLapak;
  }
};

// Analyze product image using AI
export const analyzeLapakImage = async (image: File): Promise<LapakAnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await apiClient.post('/lapak/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error: any) {
    console.error('Failed to analyze image:', error);
    
    if (error.status === 400) {
      throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, atau JPEG');
    } else if (error.status === 413) {
      throw new Error('Ukuran gambar terlalu besar. Maksimal 5MB');
    } else if (error.status === 503) {
      throw new Error('Layanan AI sedang tidak tersedia. Silakan coba lagi nanti.');
    }
    
    // Fallback response if AI analysis fails
    return {
      title: 'Produk Segar',
      description: 'Deskripsi produk akan diisi berdasarkan analisis gambar',
      suggested_price: 15000,
      unit: 'pcs',
      category: 'Lainnya'
    };
  }
};

// Update lapak information
export const updateLapak = async (lapakId: string, updates: Partial<LapakCreate>): Promise<Lapak> => {
  try {
    const response = await apiClient.put(`/lapak/${lapakId}`, updates);
    return response;
  } catch (error: any) {
    console.error('Failed to update lapak:', error);
    
    if (error.status === 400) {
      throw new Error('Data update tidak valid');
    } else if (error.status === 401) {
      throw new Error('Anda tidak memiliki akses untuk mengubah lapak ini');
    } else if (error.status === 404) {
      throw new Error('Lapak tidak ditemukan');
    }
    
    throw new Error(error.message || 'Gagal mengupdate lapak');
  }
};

// DELETE lapak
export const deleteLapak = async (lapakId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/lapak/${lapakId}`);
    return true;
  } catch (error: any) {
    console.error('Failed to delete lapak:', error);
    
    if (error.status === 401) {
      throw new Error('Anda tidak memiliki akses untuk menghapus lapak ini');
    } else if (error.status === 404) {
      throw new Error('Lapak tidak ditemukan');
    } else if (error.status === 409) {
      throw new Error('Tidak dapat menghapus lapak yang sedang dalam transaksi');
    }
    
    // For development/MVP, simulate deletion
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    
    throw new Error(error.message || 'Gagal menghapus lapak');
  }
};

// Helper function to generate WhatsApp contact URL
export const generateContactUrl = (phoneNumber: string, lapakTitle: string): string => {
  // Clean phone number and ensure it starts with 62
  let cleanPhone = phoneNumber.replace(/\s|-/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }
  
  const message = `Halo! Saya tertarik dengan lapak "${lapakTitle}" di Warung Warga. Bisakah kita diskusi lebih lanjut?`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Mock data untuk lapak
export function getMockLapakList(): LapakItem[] {
  return [
    {
      id: 'lapak-001',
      title: 'Nasi Gudeg Jogja Homemade',
      description: 'Nasi gudeg khas Jogja dengan bumbu autentik. Terdiri dari nasi, gudeg, ayam, telur, dan krecek. Dibuat dari resep turun temurun.',
      price: 25000,
      original_price: 30000,
      stock: 15,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Selatan',
      images: ['/images/gudeg.jpg'],
      seller: {
        name: 'Bu Siti',
        rating: 4.8,
        total_sales: 150,
        verified: true
      },
      tags: ['halal', 'homemade', 'tradisional'],
      status: 'available',
      created_at: '2025-01-10T08:00:00Z',
      updated_at: '2025-01-15T10:30:00Z',
      views: 342,
      favorites: 28
    },
    {
      id: 'lapak-002',
      title: 'Kue Lapis Legit Premium',
      description: 'Kue lapis legit dengan 20 layer. Terbuat dari butter asli dan bumbu rempah berkualitas tinggi. Cocok untuk acara spesial.',
      price: 85000,
      original_price: 120000,
      stock: 8,
      category: 'Kue & Dessert',
      location: 'Jakarta Barat',
      images: ['/images/lapis-legit.jpg'],
      seller: {
        name: 'Toko Kue Melati',
        rating: 4.9,
        total_sales: 89,
        verified: true
      },
      tags: ['premium', 'homemade', 'halal'],
      status: 'available',
      created_at: '2025-01-12T09:15:00Z',
      updated_at: '2025-01-15T11:45:00Z',
      views: 198,
      favorites: 42
    },
    {
      id: 'lapak-003',
      title: 'Sambal Matah Khas Bali',
      description: 'Sambal matah segar dengan serai, daun jeruk, dan cabai rawit. Tanpa pengawet, tahan 3 hari di kulkas.',
      price: 15000,
      original_price: 20000,
      stock: 25,
      category: 'Bumbu & Saus',
      location: 'Jakarta Pusat',
      images: ['/images/sambal-matah.jpg'],
      seller: {
        name: 'Pak Made',
        rating: 4.7,
        total_sales: 203,
        verified: true
      },
      tags: ['segar', 'tanpa-pengawet', 'pedas'],
      status: 'available',
      created_at: '2025-01-08T14:20:00Z',
      updated_at: '2025-01-15T09:10:00Z',
      views: 567,
      favorites: 89
    },
    {
      id: 'lapak-004',
      title: 'Sayur Organik Hidroponik Mix',
      description: 'Paket sayuran organik hidroponik: kangkung, pakcoy, selada, dan bayam. Segar dipetik hari ini, bebas pestisida.',
      price: 35000,
      original_price: 45000,
      stock: 12,
      category: 'Sayuran & Buah',
      location: 'Jakarta Timur',
      images: ['/images/sayur-organik.jpg'],
      seller: {
        name: 'GreenFarm Jakarta',
        rating: 4.8,
        total_sales: 156,
        verified: true
      },
      tags: ['organik', 'segar', 'hidroponik'],
      status: 'available',
      created_at: '2025-01-14T06:30:00Z',
      updated_at: '2025-01-15T07:00:00Z',
      views: 289,
      favorites: 67
    },
    {
      id: 'lapak-005',
      title: 'Keripik Pisang Aneka Rasa',
      description: 'Keripik pisang renyah tersedia 5 rasa: original, balado, keju, cokelat, dan abon. Kemasan 200gram.',
      price: 12000,
      original_price: 15000,
      stock: 30,
      category: 'Snack & Camilan',
      location: 'Jakarta Selatan',
      images: ['/images/keripik-pisang.jpg'],
      seller: {
        name: 'Snack Nusantara',
        rating: 4.6,
        total_sales: 412,
        verified: false
      },
      tags: ['renyah', 'aneka-rasa', 'kemasan-kecil'],
      status: 'available',
      created_at: '2025-01-09T11:45:00Z',
      updated_at: '2025-01-15T13:20:00Z',
      views: 745,
      favorites: 134
    },
    {
      id: 'lapak-006',
      title: 'Kopi Robusta Lampung 250g',
      description: 'Kopi robusta asli Lampung, roasting medium. Aroma kuat dan rasa yang bold. Kemasan zip lock untuk menjaga kesegaran.',
      price: 45000,
      original_price: 55000,
      stock: 20,
      category: 'Minuman',
      location: 'Jakarta Barat',
      images: ['/images/kopi-robusta.jpg'],
      seller: {
        name: 'Kopi Nusantara',
        rating: 4.9,
        total_sales: 267,
        verified: true
      },
      tags: ['kopi-asli', 'roasting-medium', 'kemasan-kedap-udara'],
      status: 'available',
      created_at: '2025-01-11T15:30:00Z',
      updated_at: '2025-01-15T16:45:00Z',
      views: 423,
      favorites: 98
    },
    {
      id: 'lapak-007',
      title: 'Rendang Daging Sapi Padang',
      description: 'Rendang daging sapi khas Padang dengan bumbu lengkap. Dimasak hingga empuk dan bumbu meresap. Porsi 500gram.',
      price: 65000,
      original_price: 80000,
      stock: 10,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Pusat',
      images: ['/images/rendang.jpg'],
      seller: {
        name: 'Masakan Minang Asli',
        rating: 4.8,
        total_sales: 98,
        verified: true
      },
      tags: ['halal', 'khas-padang', 'daging-empuk'],
      status: 'available',
      created_at: '2025-01-13T12:15:00Z',
      updated_at: '2025-01-15T14:30:00Z',
      views: 312,
      favorites: 76
    },
    {
      id: 'lapak-008',
      title: 'Madu Hutan Asli 500ml',
      description: 'Madu hutan asli dari pedesaan Sumatra. Murni tanpa campuran, khasiat tinggi untuk kesehatan. Kemasan botol kaca.',
      price: 75000,
      original_price: 90000,
      stock: 15,
      category: 'Makanan & Minuman Sehat',
      location: 'Jakarta Timur',
      images: ['/images/madu-hutan.jpg'],
      seller: {
        name: 'Madu Murni Indonesia',
        rating: 4.7,
        total_sales: 189,
        verified: true
      },
      tags: ['madu-asli', 'tanpa-campuran', 'kesehatan'],
      status: 'available',
      created_at: '2025-01-07T09:45:00Z',
      updated_at: '2025-01-15T11:15:00Z',
      views: 456,
      favorites: 112
    },
    {
      id: 'lapak-009',
      title: 'Bakso Ikan Tenggiri Homemade',
      description: 'Bakso ikan tenggiri buatan rumahan, kenyal dan segar. Dibuat tanpa pengawet kimia. Isi 20 buah per kemasan.',
      price: 28000,
      original_price: 35000,
      stock: 0,
      category: 'Makanan Beku',
      location: 'Jakarta Selatan',
      images: ['/images/bakso-ikan.jpg'],
      seller: {
        name: 'Frozen Food Segar',
        rating: 4.5,
        total_sales: 234,
        verified: false
      },
      tags: ['ikan-segar', 'tanpa-pengawet', 'homemade'],
      status: 'sold_out',
      created_at: '2025-01-06T13:20:00Z',
      updated_at: '2025-01-15T08:45:00Z',
      views: 289,
      favorites: 45
    },
    {
      id: 'lapak-010',
      title: 'Tempe Goreng Krispy Original',
      description: 'Tempe goreng krispy dengan tepung berbumbu rahasia. Renyah tahan lama, cocok untuk cemilan atau lauk.',
      price: 8000,
      original_price: 12000,
      stock: 40,
      category: 'Snack & Camilan',
      location: 'Jakarta Barat',
      images: ['/images/tempe-krispy.jpg'],
      seller: {
        name: 'Tempe Mas Budi',
        rating: 4.4,
        total_sales: 567,
        verified: false
      },
      tags: ['renyah', 'tahan-lama', 'protein-tinggi'],
      status: 'available',
      created_at: '2025-01-05T16:10:00Z',
      updated_at: '2025-01-15T17:25:00Z',
      views: 834,
      favorites: 156
    },
    {
      id: 'lapak-011',
      title: 'Abon Sapi Premium 250g',
      description: 'Abon sapi premium dari daging pilihan. Gurih dan lembut, cocok untuk sarapan atau bekal. Kemasan toples kedap udara.',
      price: 55000,
      original_price: 70000,
      stock: 18,
      category: 'Makanan Awetan',
      location: 'Jakarta Pusat',
      images: ['/images/abon-sapi.jpg'],
      seller: {
        name: 'Abon Nusantara',
        rating: 4.6,
        total_sales: 145,
        verified: true
      },
      tags: ['premium', 'daging-pilihan', 'tahan-lama'],
      status: 'available',
      created_at: '2025-01-04T10:30:00Z',
      updated_at: '2025-01-15T12:40:00Z',
      views: 367,
      favorites: 89
    },
    {
      id: 'lapak-012',
      title: 'Jus Buah Segar Mix Botol 500ml',
      description: 'Jus buah segar campuran jeruk, apel, dan wortel. Tanpa gula tambahan, tinggi vitamin C. Dibuat fresh order.',
      price: 18000,
      original_price: 25000,
      stock: 22,
      category: 'Minuman',
      location: 'Jakarta Timur',
      images: ['/images/jus-buah.jpg'],
      seller: {
        name: 'Fresh Juice Corner',
        rating: 4.3,
        total_sales: 298,
        verified: false
      },
      tags: ['segar', 'tanpa-gula-tambahan', 'vitamin-c'],
      status: 'available',
      created_at: '2025-01-15T07:45:00Z',
      updated_at: '2025-01-15T08:15:00Z',
      views: 245,
      favorites: 34
    },
    {
      id: 'lapak-013',
      title: 'Gado-gado Betawi Komplit',
      description: 'Gado-gado betawi lengkap dengan sayuran segar, tahu, tempe, telur rebus, dan bumbu kacang khas Betawi.',
      price: 22000,
      original_price: 28000,
      stock: 16,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Pusat',
      images: ['/images/gado-gado.jpg'],
      seller: {
        name: 'Warung Betawi Asli',
        rating: 4.7,
        total_sales: 189,
        verified: true
      },
      tags: ['khas-betawi', 'sayuran-segar', 'bumbu-kacang'],
      status: 'available',
      created_at: '2025-01-14T11:20:00Z',
      updated_at: '2025-01-15T15:30:00Z',
      views: 456,
      favorites: 78
    },
    {
      id: 'lapak-014',
      title: 'Kerupuk Udang Sidoarjo Original',
      description: 'Kerupuk udang asli Sidoarjo, renyah dan gurih. Terbuat dari udang segar pilihan. Kemasan 500gram.',
      price: 32000,
      original_price: 40000,
      stock: 27,
      category: 'Snack & Camilan',
      location: 'Jakarta Selatan',
      images: ['/images/kerupuk-udang.jpg'],
      seller: {
        name: 'Kerupuk Nusantara',
        rating: 4.8,
        total_sales: 167,
        verified: true
      },
      tags: ['udang-segar', 'renyah', 'khas-sidoarjo'],
      status: 'available',
      created_at: '2025-01-13T14:15:00Z',
      updated_at: '2025-01-15T16:20:00Z',
      views: 389,
      favorites: 95
    },
    {
      id: 'lapak-015',
      title: 'Martabak Manis Mini Cokelat Keju',
      description: 'Martabak manis mini dengan topping cokelat dan keju. Empuk dan manis, cocok untuk cemilan sore. Isi 6 potong.',
      price: 18000,
      original_price: 24000,
      stock: 14,
      category: 'Kue & Dessert',
      location: 'Jakarta Barat',
      images: ['/images/martabak-mini.jpg'],
      seller: {
        name: 'Martabak 88',
        rating: 4.5,
        total_sales: 234,
        verified: false
      },
      tags: ['empuk', 'manis', 'topping-lengkap'],
      status: 'available',
      created_at: '2025-01-12T18:30:00Z',
      updated_at: '2025-01-15T19:45:00Z',
      views: 567,
      favorites: 123
    },
    {
      id: 'lapak-016',
      title: 'Dendeng Balado Minang 200g',
      description: 'Dendeng balado khas Minang, pedas dan gurih. Daging sapi berkualitas tinggi dengan bumbu balado autentik.',
      price: 68000,
      original_price: 85000,
      stock: 11,
      category: 'Makanan Awetan',
      location: 'Jakarta Pusat',
      images: ['/images/dendeng-balado.jpg'],
      seller: {
        name: 'Masakan Minang Asli',
        rating: 4.8,
        total_sales: 98,
        verified: true
      },
      tags: ['pedas', 'khas-minang', 'daging-berkualitas'],
      status: 'available',
      created_at: '2025-01-11T13:45:00Z',
      updated_at: '2025-01-15T14:50:00Z',
      views: 278,
      favorites: 67
    },
    {
      id: 'lapak-017',
      title: 'Es Krim Durian Medan Premium',
      description: 'Es krim durian asli Medan dengan tekstur creamy. Dibuat dari durian pilihan tanpa pewarna buatan.',
      price: 35000,
      original_price: 45000,
      stock: 8,
      category: 'Kue & Dessert',
      location: 'Jakarta Timur',
      images: ['/images/es-krim-durian.jpg'],
      seller: {
        name: 'Durian King',
        rating: 4.6,
        total_sales: 156,
        verified: true
      },
      tags: ['durian-asli', 'creamy', 'tanpa-pewarna'],
      status: 'available',
      created_at: '2025-01-10T16:20:00Z',
      updated_at: '2025-01-15T17:35:00Z',
      views: 445,
      favorites: 98
    },
    {
      id: 'lapak-018',
      title: 'Roti Tawar Gandum Utuh 400g',
      description: 'Roti tawar gandum utuh, sehat dan bergizi. Tanpa pengawet buatan, tahan 3 hari. Cocok untuk diet sehat.',
      price: 15000,
      original_price: 20000,
      stock: 25,
      category: 'Roti & Kue',
      location: 'Jakarta Selatan',
      images: ['/images/roti-gandum.jpg'],
      seller: {
        name: 'Roti Sehat Indonesia',
        rating: 4.4,
        total_sales: 289,
        verified: false
      },
      tags: ['gandum-utuh', 'sehat', 'tanpa-pengawet'],
      status: 'available',
      created_at: '2025-01-15T06:30:00Z',
      updated_at: '2025-01-15T07:15:00Z',
      views: 234,
      favorites: 45
    },
    {
      id: 'lapak-019',
      title: 'Pecel Lele Sambal Terasi',
      description: 'Pecel lele goreng dengan sambal terasi pedas. Ikan lele segar dan sambal buatan sendiri. Porsi 2 ekor.',
      price: 24000,
      original_price: 30000,
      stock: 13,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Barat',
      images: ['/images/pecel-lele.jpg'],
      seller: {
        name: 'Warung Lele Bu Tini',
        rating: 4.7,
        total_sales: 178,
        verified: true
      },
      tags: ['ikan-segar', 'sambal-terasi', 'pedas'],
      status: 'available',
      created_at: '2025-01-09T17:45:00Z',
      updated_at: '2025-01-15T18:20:00Z',
      views: 356,
      favorites: 89
    },
    {
      id: 'lapak-020',
      title: 'Asinan Buah Segar Bowl',
      description: 'Asinan buah segar dalam bowl: pepaya, bengkoang, tahu, dengan bumbu rujak segar dan kerupuk.',
      price: 16000,
      original_price: 22000,
      stock: 19,
      category: 'Minuman',
      location: 'Jakarta Timur',
      images: ['/images/asinan-buah.jpg'],
      seller: {
        name: 'Asinan Pak Ujang',
        rating: 4.3,
        total_sales: 267,
        verified: false
      },
      tags: ['buah-segar', 'bumbu-rujak', 'kerupuk'],
      status: 'available',
      created_at: '2025-01-08T15:30:00Z',
      updated_at: '2025-01-15T16:45:00Z',
      views: 478,
      favorites: 112
    },
    {
      id: 'lapak-021',
      title: 'Nasi Liwet Solo Komplit',
      description: 'Nasi liwet khas Solo dengan ayam kampung, telur, tahu, tempe, dan sayur. Dibungkus daun pisang.',
      price: 28000,
      original_price: 35000,
      stock: 12,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Pusat',
      images: ['/images/nasi-liwet.jpg'],
      seller: {
        name: 'Warung Solo Rasa',
        rating: 4.8,
        total_sales: 134,
        verified: true
      },
      tags: ['khas-solo', 'ayam-kampung', 'daun-pisang'],
      status: 'available',
      created_at: '2025-01-07T12:15:00Z',
      updated_at: '2025-01-15T13:30:00Z',
      views: 389,
      favorites: 78
    },
    {
      id: 'lapak-022',
      title: 'Brownies Kukus Pandan Keju',
      description: 'Brownies kukus pandan dengan topping keju parut. Lembut dan wangi pandan alami. Kemasan kotak 20x20cm.',
      price: 42000,
      original_price: 55000,
      stock: 9,
      category: 'Kue & Dessert',
      location: 'Jakarta Selatan',
      images: ['/images/brownies-pandan.jpg'],
      seller: {
        name: 'Brownies Mama',
        rating: 4.6,
        total_sales: 167,
        verified: true
      },
      tags: ['lembut', 'pandan-alami', 'topping-keju'],
      status: 'available',
      created_at: '2025-01-06T11:45:00Z',
      updated_at: '2025-01-15T12:20:00Z',
      views: 298,
      favorites: 89
    },
    {
      id: 'lapak-023',
      title: 'Sate Ayam Madura 10 Tusuk',
      description: 'Sate ayam Madura dengan bumbu kacang khas. Daging ayam empuk dan bumbu meresap. Dilengkapi lontong.',
      price: 32000,
      original_price: 40000,
      stock: 17,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Barat',
      images: ['/images/sate-ayam.jpg'],
      seller: {
        name: 'Sate Madura Pak Kasim',
        rating: 4.9,
        total_sales: 245,
        verified: true
      },
      tags: ['khas-madura', 'daging-empuk', 'bumbu-kacang'],
      status: 'available',
      created_at: '2025-01-05T18:20:00Z',
      updated_at: '2025-01-15T19:15:00Z',
      views: 567,
      favorites: 134
    },
    {
      id: 'lapak-024',
      title: 'Keripik Singkong Balado Pedas',
      description: 'Keripik singkong dengan bumbu balado pedas. Renyah dan gurih, cocok untuk cemilan sambil nonton. Kemasan 250g.',
      price: 14000,
      original_price: 18000,
      stock: 31,
      category: 'Snack & Camilan',
      location: 'Jakarta Timur',
      images: ['/images/keripik-singkong.jpg'],
      seller: {
        name: 'Keripik Mama Ida',
        rating: 4.4,
        total_sales: 356,
        verified: false
      },
      tags: ['renyah', 'balado-pedas', 'cemilan'],
      status: 'available',
      created_at: '2025-01-04T14:30:00Z',
      updated_at: '2025-01-15T15:45:00Z',
      views: 623,
      favorites: 145
    },
    {
      id: 'lapak-025',
      title: 'Teh Herbal Jahe Merah 100g',
      description: 'Teh herbal jahe merah untuk kesehatan. Hangat dan menyegarkan, cocok diminum saat cuaca dingin. Kemasan zip lock.',
      price: 25000,
      original_price: 32000,
      stock: 21,
      category: 'Minuman',
      location: 'Jakarta Pusat',
      images: ['/images/teh-jahe.jpg'],
      seller: {
        name: 'Herbal Sehat Nusantara',
        rating: 4.5,
        total_sales: 198,
        verified: true
      },
      tags: ['herbal', 'kesehatan', 'jahe-merah'],
      status: 'available',
      created_at: '2025-01-03T09:15:00Z',
      updated_at: '2025-01-15T10:30:00Z',
      views: 334,
      favorites: 67
    },
    {
      id: 'lapak-026',
      title: 'Pizza Mini Cheese Lovers 6pcs',
      description: 'Pizza mini dengan extra cheese dan sosis. Crispy base dengan topping melimpah. Cocok untuk sharing.',
      price: 38000,
      original_price: 48000,
      stock: 7,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Selatan',
      images: ['/images/pizza-mini.jpg'],
      seller: {
        name: 'Pizza Corner',
        rating: 4.3,
        total_sales: 123,
        verified: false
      },
      tags: ['extra-cheese', 'crispy', 'sharing'],
      status: 'available',
      created_at: '2025-01-02T16:45:00Z',
      updated_at: '2025-01-15T17:20:00Z',
      views: 445,
      favorites: 98
    },
    {
      id: 'lapak-027',
      title: 'Opor Ayam Kampung Lebaran',
      description: 'Opor ayam kampung dengan bumbu khas lebaran. Kuah santan gurih dan ayam empuk. Porsi keluarga 1kg.',
      price: 58000,
      original_price: 75000,
      stock: 6,
      category: 'Makanan Siap Saji',
      location: 'Jakarta Barat',
      images: ['/images/opor-ayam.jpg'],
      seller: {
        name: 'Masakan Ibu Rumah',
        rating: 4.7,
        total_sales: 89,
        verified: true
      },
      tags: ['ayam-kampung', 'santan-gurih', 'porsi-keluarga'],
      status: 'available',
      created_at: '2025-01-01T10:30:00Z',
      updated_at: '2025-01-15T11:45:00Z',
      views: 267,
      favorites: 56
    },
    {
      id: 'lapak-028',
      title: 'Roti Buaya Betawi Mini 6pcs',
      description: 'Roti buaya khas Betawi dalam ukuran mini. Manis dan lembut, cocok untuk acara khusus atau oleh-oleh.',
      price: 45000,
      original_price: 60000,
      stock: 4,
      category: 'Roti & Kue',
      location: 'Jakarta Pusat',
      images: ['/images/roti-buaya.jpg'],
      seller: {
        name: 'Roti Betawi Heritage',
        rating: 4.8,
        total_sales: 67,
        verified: true
      },
      tags: ['khas-betawi', 'manis', 'acara-khusus'],
      status: 'available',
      created_at: '2024-12-30T13:20:00Z',
      updated_at: '2025-01-15T14:35:00Z',
      views: 189,
      favorites: 34
    },
    {
      id: 'lapak-029',
      title: 'Cireng Bumbu Rujak 15pcs',
      description: 'Cireng (aci digoreng) dengan bumbu rujak pedas manis. Kenyal di dalam, crispy di luar. Fresh dari wajan.',
      price: 12000,
      original_price: 16000,
      stock: 23,
      category: 'Snack & Camilan',
      location: 'Jakarta Timur',
      images: ['/images/cireng.jpg'],
      seller: {
        name: 'Cireng Abang Dedi',
        rating: 4.2,
        total_sales: 423,
        verified: false
      },
      tags: ['kenyal', 'crispy', 'bumbu-rujak'],
      status: 'available',
      created_at: '2024-12-29T15:45:00Z',
      updated_at: '2025-01-15T16:20:00Z',
      views: 678,
      favorites: 167
    },
    {
      id: 'lapak-030',
      title: 'Kue Cubit Rainbow 20pcs',
      description: 'Kue cubit warna-warni dengan berbagai topping: keju, cokelat, dan kacang. Manis dan empuk.',
      price: 20000,
      original_price: 28000,
      stock: 18,
      category: 'Kue & Dessert',
      location: 'Jakarta Selatan',
      images: ['/images/kue-cubit.jpg'],
      seller: {
        name: 'Kue Cubit Pelangi',
        rating: 4.4,
        total_sales: 289,
        verified: false
      },
      tags: ['warna-warni', 'berbagai-topping', 'empuk'],
      status: 'available',
      created_at: '2024-12-28T11:30:00Z',
      updated_at: '2025-01-15T12:15:00Z',
      views: 556,
      favorites: 134
    }
  ];
}

// Calculate lapak statistics
export const calculateLapakStats = (lapakList: LapakItem[]): LapakStats => {
  const activeLapak = lapakList.filter(item => item.status === 'available');
  
  const totalActiveLapak = activeLapak.length;
  const totalViews = lapakList.reduce((total, item) => total + item.views, 0);
  const totalSales = lapakList.reduce((total, item) => {
    // Simulate sales calculation
    return total + (item.price * Math.floor(Math.random() * 5));
  }, 0);

  return {
    totalActiveLapak,
    totalViews,
    totalSales
  };
};

// Fetch all lapak
export const getLapakList = async (): Promise<LapakItem[]> => {
  try {
    console.log('🚀 Calling API: GET /api/lapak');
    const response = await apiClient.get<LapakItem[]>('/api/lapak');
    console.log('✅ API Response received:', response);
    return response;
  } catch (error) {
    console.warn('⚠️ API call failed, using mock data:', error);
    return getMockLapakList();
  }
};

// Mock stats for development
export const getMockLapakStats = (): LapakStats => {
  const mockData = getMockLapakList();
  return calculateLapakStats(mockData);
}; 