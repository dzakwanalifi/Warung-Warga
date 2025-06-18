'use client';

import Link from 'next/link'
import { useAuthStore } from '@/hooks/useAuthStore'
import { ClientOnly } from '@/components/ClientOnly'
import { ListingCard } from '@/components/ListingCard'
import { SkeletonGrid } from '@/components/SkeletonCard'
import { NoLapakFound, LocationRequired, ErrorState } from '@/components/EmptyState'
import { useState, useEffect } from 'react'
import { getNearbyLapak } from '@/lib/lapakService'
import { Lapak } from '@/lib/types'

// Authentication buttons component
function AuthButtons() {
  const { isAuthenticated, user, logoutAction, isHydrated } = useAuthStore();

  useEffect(() => {
    console.log('AuthButtons state:', { isAuthenticated, hasUser: !!user, isHydrated });
  }, [isAuthenticated, user, isHydrated]);

  // Don't show anything until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="flex items-center gap-2u">
        <div className="w-16 h-8 bg-border animate-pulse rounded-button"></div>
        <div className="w-16 h-8 bg-border animate-pulse rounded-button"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2u">
        <span className="text-caption text-text-secondary">
          Halo, {user.full_name}
        </span>
        <Link href="/profile">
          <button className="btn-ghost text-caption px-2u py-1">
            Profil
          </button>
        </Link>
        <button 
          onClick={logoutAction}
          className="btn-secondary text-caption px-2u py-1"
        >
          Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2u">
      <Link href="/login">
        <button className="btn-ghost text-caption px-2u py-1">
          Masuk
        </button>
      </Link>
      <Link href="/register">
        <button className="btn-primary text-caption px-2u py-1">
          Daftar
        </button>
      </Link>
    </div>
  );
}

// Nearby Lapak Section Component
function NearbyLapakSection() {
  const [lapakList, setLapakList] = useState<Lapak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [usingMockData, setUsingMockData] = useState(false);

  // Get user location
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationPermission('granted');
        console.log('Location obtained:', { latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationPermission('denied');
        setError('Tidak dapat mengakses lokasi. Izinkan akses lokasi untuk melihat lapak terdekat.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  };

  // Fetch nearby lapak
  const fetchNearbyLapak = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      setError(null);
      setUsingMockData(false);
      
      const response = await getNearbyLapak({
        latitude,
        longitude,
        radius: 10, // 10km radius
        limit: 12 // Show 12 lapak on homepage
      });
      
      // Check if we got mock data (in development mode)
      if (response.lapak.length > 0 && response.lapak[0].id?.startsWith('mock-')) {
        setUsingMockData(true);
      }
      
      setLapakList(response.lapak || []);
    } catch (err: any) {
      console.error('Failed to fetch nearby lapak:', err);
      setError(err.message || 'Gagal memuat lapak terdekat');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to get location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Effect to fetch lapak when location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyLapak(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  // Retry function
  const handleRetry = () => {
    if (userLocation) {
      fetchNearbyLapak(userLocation.latitude, userLocation.longitude);
    } else {
      requestLocation();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mb-5u">
        <div className="flex items-center justify-between mb-4u">
          <h3 className="text-heading-1">Lapak Terdekat</h3>
          <div className="h-4 w-24 bg-border animate-pulse rounded"></div>
        </div>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  // Location permission denied
  if (locationPermission === 'denied' || (error && error.includes('lokasi'))) {
    return (
      <div className="mb-5u">
        <h3 className="text-heading-1 mb-4u">Lapak Terdekat</h3>
        <LocationRequired onEnableLocation={requestLocation} />
      </div>
    );
  }

  // Error state (but not location related)
  if (error && !error.includes('lokasi')) {
    return (
      <div className="mb-5u">
        <h3 className="text-heading-1 mb-4u">Lapak Terdekat</h3>
        <ErrorState onRetry={handleRetry} message={error} />
      </div>
    );
  }

  // No data state
  if (lapakList.length === 0 && !usingMockData) {
    return (
      <div className="mb-5u">
        <h3 className="text-heading-1 mb-4u">Lapak Terdekat</h3>
        <NoLapakFound 
          onCreateNew={() => {
            // Navigate to create lapak page
            window.location.href = '/lapak/buat';
          }} 
        />
      </div>
    );
  }

  // Success state with data
  return (
    <div className="mb-5u">
      {/* Development Mode Notice */}
      {usingMockData && process.env.NODE_ENV === 'development' && (
        <div className="mb-4u p-3u bg-accent/10 border border-accent/20 rounded-card">
          <div className="flex items-center gap-2u">
            <span className="text-lg">🚧</span>
            <div>
              <p className="text-body-small font-medium text-accent">Mode Pengembangan</p>
              <p className="text-caption text-text-secondary">
                Menampilkan data contoh karena backend API belum tersedia. Data ini hanya untuk demo.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4u">
        <h3 className="text-heading-1">Lapak Terdekat</h3>
        <Link 
          href="/lapak" 
          className="text-body-small text-primary hover:underline flex items-center gap-1u"
        >
          Lihat Semua
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4u">
        {lapakList.map((lapak) => (
          <ListingCard key={lapak.id} lapak={lapak} />
        ))}
      </div>
      
      {/* Show more button if there are more lapak */}
      {lapakList.length >= 12 && (
        <div className="text-center mt-4u">
          <Link href="/lapak">
            <button className="btn-secondary">
              Lihat Lebih Banyak Lapak
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-card border-b border-border">
        <div className="page-padding py-4u">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 text-primary font-bold">
                Warung Warga
              </h1>
              <p className="text-caption text-text-secondary">
                Solusi Belanja Hyperlocal
              </p>
            </div>
            <ClientOnly>
              <AuthButtons />
            </ClientOnly>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="page-padding py-5u">
        <div className="text-center mb-5u">
          <h2 className="text-display mb-2u">
            Temukan Produk Lokal di{' '}
            <span className="text-primary">Sekitar Anda</span>
          </h2>
          <p className="text-body-large text-text-secondary max-w-2xl mx-auto mb-4u">
            Platform untuk membeli produk segar dari tetangga dan berpartisipasi 
            dalam pembelian kolektif untuk mendapatkan harga yang lebih baik.
          </p>
          <div className="flex flex-col sm:flex-row gap-2u justify-center">
            <Link href="/lapak">
              <button className="btn-primary">
                Jelajahi Lapak Terdekat
              </button>
            </Link>
            <Link href="/borongan">
              <button className="btn-secondary">
                Lihat Borongan Bareng
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4u mb-5u">
          {/* Lapak Warga Card */}
          <Link href="/lapak">
            <div className="card-listing">
              <div className="p-4u">
                <div className="flex items-center gap-2u mb-2u">
                  <div className="w-8 h-8 bg-primary rounded-button flex items-center justify-center">
                    <span className="text-white text-label">🏪</span>
                  </div>
                  <h3 className="text-heading-2">Lapak Warga</h3>
                </div>
                <p className="text-body-small text-text-secondary mb-3u">
                  Beli produk segar langsung dari tetangga di sekitar Anda. 
                  Temukan makanan, sayuran, dan kebutuhan sehari-hari dengan mudah.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-accent">Tersedia 24/7</span>
                  <span className="text-body-small text-primary">
                    Lihat Semua →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Borongan Bareng Card */}
          <Link href="/borongan">
            <div className="card-listing">
              <div className="p-4u">
                <div className="flex items-center gap-2u mb-2u">
                  <div className="w-8 h-8 bg-accent rounded-button flex items-center justify-center">
                    <span className="text-white text-label">🤝</span>
                  </div>
                  <h3 className="text-heading-2">Borongan Bareng</h3>
                </div>
                <p className="text-body-small text-text-secondary mb-3u">
                  Gabung dengan tetangga untuk membeli dalam jumlah besar dan 
                  dapatkan harga yang lebih murah untuk semua.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-primary">Hemat hingga 30%</span>
                  <span className="text-body-small text-primary">
                    Gabung Sekarang →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Nearby Lapak Section */}
        <ClientOnly>
          <NearbyLapakSection />
        </ClientOnly>

        {/* Quick Actions */}
        <div className="card mb-5u">
          <div className="p-4u">
            <h3 className="text-heading-2 mb-3u">Mulai Berjualan</h3>
            <p className="text-body-small text-text-secondary mb-4u">
              Punya produk segar untuk dijual? Buka lapak Anda dan jangkau pembeli di sekitar.
            </p>
            <div className="flex flex-col sm:flex-row gap-2u">
              <Link href="/lapak/buat">
                <button className="btn-primary flex-1 sm:flex-none">
                  🏪 Buka Lapak Baru
                </button>
              </Link>
              <Link href="/borongan/buat">
                <button className="btn-secondary flex-1 sm:flex-none">
                  🤝 Buat Borongan Bareng
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-5u">
        <div className="page-padding py-4u text-center">
          <p className="text-caption text-text-secondary">
            Warung Warga - Membangun komunitas melalui perdagangan lokal
          </p>
          <p className="text-caption text-text-secondary mt-1u">
            Fase 2: Fitur Lapak Warga ✅ Complete
          </p>
          {/* Debug Link for Development */}
          <div className="mt-2u">
            <Link 
              href="/debug-auth" 
              className="text-caption text-primary hover:underline"
            >
              🔧 Debug Auth State
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 