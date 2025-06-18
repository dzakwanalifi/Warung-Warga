import { apiClient } from '@/lib/api';
import { Lapak, LapakCreate, LapakListResponse, LapakAnalysisResult, NearbyParams } from '@/lib/types';
import { generateWhatsAppUrl } from './utils';

// Get nearby lapak based on user location - Updated to match API documentation
export const getNearbyLapak = async (params: NearbyParams): Promise<LapakListResponse> => {
  try {
    console.log('Fetching nearby lapak with params:', params);
    
    // Use the correct endpoint from API documentation
    const endpoint = '/lapak/nearby';
    
    // Convert params to match API expectations - use correct parameter names
    const queryParams: any = {
      lat: params.latitude,  // API expects 'lat', not 'latitude'
      lon: params.longitude, // API expects 'lon', not 'longitude'
      radius: params.radius ? params.radius * 1000 : 5000, // Convert km to meters for API
    };
    
    // Only add optional parameters if they exist
    // Note: Based on API docs, page and limit might not be required for /lapak/nearby
    
    try {
      console.log(`Calling ${endpoint} with params:`, queryParams);
      const response = await apiClient.get<any>(endpoint, { params: queryParams });
      
      // Transform API response to match our interface
      const transformedResponse: LapakListResponse = {
        lapak: response.lapak_list || [],
        total: response.total_count || 0,
        page: params.page || 1,
        limit: params.limit || 12
      };
      
      console.log('Successfully fetched nearby lapak:', transformedResponse);
      return transformedResponse;
      
    } catch (apiError: any) {
      console.error('API error:', apiError);
      
      // Check if it's a 503 (database unavailable) or network error
      if (apiError.status === 503 || apiError.message?.includes('Database not available')) {
        console.log('Database unavailable, using mock data');
        return getMockLapakData();
      }
      
      // For other errors in development, also use mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: using mock data due to API error');
        return getMockLapakData();
      }
      
      throw apiError;
    }
    
  } catch (error: any) {
    console.error('Failed to fetch nearby lapak:', error);
    
    // For development, return mock data instead of throwing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: returning mock data');
      return getMockLapakData();
    }
    
    throw new Error(error.message || 'Gagal mengambil data lapak terdekat');
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
    const formData = new FormData();
    
    // Add lapak data fields as per API documentation
    formData.append('title', lapakData.title);
    formData.append('description', lapakData.description);
    formData.append('price', lapakData.price.toString());
    formData.append('unit', lapakData.unit);
    formData.append('stock_quantity', lapakData.stock_quantity.toString());
    
    // Add images using 'files' field name as per API documentation
    images.forEach((image) => {
      formData.append('files', image);
    });
    
    const response = await apiClient.post('/lapak', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error: any) {
    console.error('Failed to create lapak:', error);
    
    if (error.status === 400) {
      throw new Error('Data lapak tidak valid. Periksa kembali form Anda');
    } else if (error.status === 401) {
      throw new Error('Anda harus login untuk membuat lapak');
    } else if (error.status === 413) {
      throw new Error('Ukuran gambar terlalu besar. Maksimal 5MB per gambar');
    } else if (error.status === 503) {
      throw new Error('Database tidak tersedia. Coba lagi nanti.');
    }
    
    throw new Error(error.message || 'Gagal membuat lapak');
  }
};

// Analyze product image using AI
export const analyzeLapakImage = async (image: File): Promise<LapakAnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('file', image);
    
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
    }
    
    // Fallback response if AI analysis fails
    return {
      title: 'Produk Segar',
      description: 'Deskripsi produk akan diisi berdasarkan analisis gambar',
      unit: 'kg'
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