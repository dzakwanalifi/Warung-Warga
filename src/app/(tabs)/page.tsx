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

// Enhanced Header with Profile Access
function ModernHeader() {
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  if (!isHydrated) {
    return (
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="page-padding py-4u">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-32 bg-white/20 animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-white/20 animate-pulse rounded mt-1u"></div>
            </div>
            <div className="h-8 w-20 bg-white/20 animate-pulse rounded-button"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="page-padding py-4u">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-2 font-bold">
              Warung Warga
            </h1>
            <p className="text-caption opacity-90">
              {isAuthenticated && user ? `Halo, ${user.full_name?.split(' ')[0]}!` : 'Belanja lokal, hemat bareng'}
            </p>
          </div>
          
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3u">
              {/* Notification Button */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2u hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a50 50 0 00-.1-3.8C16.3 6.2 14 4 11.5 4S6.7 6.2 6.6 9.7c0 1.3 0 2.6-.1 3.8L3 17h5m7 0v1a3 3 0 11-6 0v-1m7 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold">3</span>
                </span>
              </button>
              
              {/* Profile Button */}
              <Link href="/profile">
                <div className="flex items-center gap-2u p-1u hover:bg-white/10 rounded-button transition-colors">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-caption font-bold">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2u">
              <Link href="/login">
                <button className="btn-ghost text-white border-white/30 hover:bg-white/10 text-caption px-3u py-2u">
                  Masuk
                </button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="mt-4u">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari produk atau lapak..."
              className="w-full bg-white/10 border border-white/20 rounded-button px-4u py-3u text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button className="absolute right-3u top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Enhanced Quick Actions
function QuickActionsSection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="page-padding py-4u">
      <h2 className="text-heading-2 text-text-primary mb-3u">Apa yang ingin Anda lakukan?</h2>
      
      <div className="grid grid-cols-2 gap-3u mb-4u">
        {/* Jelajahi Lapak */}
        <Link href="/lapak">
          <div className="card p-4u text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-2 border-transparent hover:border-primary/20">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3u">
              <span className="text-2xl">🏪</span>
            </div>
            <h3 className="text-body-large font-medium text-text-primary mb-1u">
              Jelajahi Lapak
            </h3>
            <p className="text-caption text-text-secondary">
              Produk segar dari tetangga
            </p>
          </div>
        </Link>

        {/* Borongan Bareng */}
        <Link href="/borongan">
          <div className="card p-4u text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border-2 border-transparent hover:border-accent/20">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3u">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-body-large font-medium text-text-primary mb-1u">
              Borongan Bareng
            </h3>
            <p className="text-caption text-text-secondary">
              Belanja bareng, hemat bareng
            </p>
          </div>
        </Link>
      </div>

      {/* Additional Quick Actions */}
      {isAuthenticated && (
        <div className="grid grid-cols-3 gap-2u">
          <Link href="/lapak/buat">
            <div className="card p-3u text-center hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2u">
                <span className="text-lg">➕</span>
              </div>
              <p className="text-caption font-medium text-text-primary">Buka Lapak</p>
            </div>
          </Link>
          
          <Link href="/borongan/buat">
            <div className="card p-3u text-center hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2u">
                <span className="text-lg">📋</span>
              </div>
              <p className="text-caption font-medium text-text-primary">Buat Borongan</p>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className="card p-3u text-center hover:shadow-md transition-all duration-200">
              <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-2u">
                <span className="text-lg">👤</span>
              </div>
              <p className="text-caption font-medium text-text-primary">Profil Saya</p>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}

// Compact Nearby Lapak Section
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
      setError('Geolocation tidak didukung');
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
      },
      (error) => {
        setLocationPermission('denied');
        setError('Izinkan akses lokasi untuk melihat lapak terdekat');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000
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
        radius: 5,
        limit: 4
      });
      
      if (response.lapak.length > 0 && response.lapak[0].id?.startsWith('mock-')) {
        setUsingMockData(true);
      }
      
      setLapakList(response.lapak || []);
    } catch (err: any) {
      setError('Gagal memuat lapak terdekat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyLapak(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

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
      <section className="page-padding mb-6u">
        <div className="flex items-center justify-between mb-3u">
          <h3 className="text-heading-2">Lapak Terdekat</h3>
          <div className="h-4 w-16 bg-border animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3u">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-card h-40 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  // Location permission denied
  if (locationPermission === 'denied') {
    return (
      <section className="page-padding mb-6u">
        <h3 className="text-heading-2 mb-3u">Lapak Terdekat</h3>
        <div className="card p-4u text-center bg-gradient-to-br from-warning/5 to-warning/10">
          <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3u">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 className="text-body-large font-medium mb-2u">Izinkan Akses Lokasi</h4>
          <p className="text-body-small text-text-secondary mb-3u">
            Untuk melihat lapak terdekat, kami perlu mengakses lokasi Anda
          </p>
          <button onClick={requestLocation} className="btn-primary text-caption">
            Izinkan Lokasi
          </button>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !error.includes('lokasi')) {
    return (
      <section className="page-padding mb-6u">
        <h3 className="text-heading-2 mb-3u">Lapak Terdekat</h3>
        <div className="card p-4u text-center">
          <p className="text-body-small text-error mb-3u">{error}</p>
          <button onClick={handleRetry} className="btn-secondary text-caption">
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  // No data state
  if (lapakList.length === 0) {
    return (
      <section className="page-padding mb-6u">
        <h3 className="text-heading-2 mb-3u">Lapak Terdekat</h3>
        <div className="card p-4u text-center bg-gradient-to-br from-surface-secondary/30 to-surface-secondary/10">
          <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-3u">
            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h4 className="text-body-large font-medium mb-2u">Belum Ada Lapak</h4>
          <p className="text-body-small text-text-secondary mb-3u">
            Belum ada lapak di area Anda
          </p>
          <Link href="/lapak/buat">
            <button className="btn-primary text-caption">
              Buka Lapak Pertama
            </button>
          </Link>
        </div>
      </section>
    );
  }

  // Success state with data
  return (
    <section className="page-padding mb-6u">
      {/* Development Mode Notice */}
      {usingMockData && process.env.NODE_ENV === 'development' && (
        <div className="mb-3u p-3u bg-accent/10 border border-accent/20 rounded-card">
          <div className="flex items-center gap-2u">
            <span className="text-lg">🚧</span>
            <div>
              <p className="text-caption font-medium text-accent">Mode Demo</p>
              <p className="text-caption text-text-secondary">
                Data contoh untuk keperluan demo
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3u">
        <h3 className="text-heading-2">Lapak Terdekat</h3>
        <Link 
          href="/lapak" 
          className="text-caption text-primary font-medium flex items-center gap-1u hover:gap-2u transition-all"
        >
          Semua
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3u">
        {lapakList.map((lapak) => (
          <ListingCard key={lapak.id} lapak={lapak} className="compact hover:scale-[1.02] transition-transform" />
        ))}
      </div>
    </section>
  );
}

// Feature Highlights Section
function FeatureHighlights() {
  return (
    <section className="page-padding py-6u bg-gradient-to-br from-surface-secondary/20 to-surface-secondary/5">
      <h3 className="text-heading-2 text-text-primary mb-4u text-center">
        Kenapa Pilih Warung Warga?
      </h3>
      
      <div className="grid grid-cols-1 gap-4u">
        <div className="card p-4u flex items-center gap-4u overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
            <span className="text-2xl">🌱</span>
          </div>
          <div className="relative z-10">
            <h4 className="text-body-large font-semibold text-text-primary mb-1u">Produk Segar Lokal</h4>
            <p className="text-caption text-text-secondary">Langsung dari tetangga, segar dan berkualitas setiap hari</p>
          </div>
        </div>
        
        <div className="card p-4u flex items-center gap-4u overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
            <span className="text-2xl">💰</span>
          </div>
          <div className="relative z-10">
            <h4 className="text-body-large font-semibold text-text-primary mb-1u">Harga Lebih Murah</h4>
            <p className="text-caption text-text-secondary">Belanja bareng dapat harga grosir, hemat hingga 30%</p>
          </div>
        </div>
        
        <div className="card p-4u flex items-center gap-4u overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
            <span className="text-2xl">🤝</span>
          </div>
          <div className="relative z-10">
            <h4 className="text-body-large font-semibold text-text-primary mb-1u">Komunitas Solid</h4>
            <p className="text-caption text-text-secondary">Membangun ekonomi tetangga bersama-sama</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// New Community Success Stories Section
function CommunitySection() {
  const successStories = [
    {
      id: 1,
      name: "Ibu Sari",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1d2?w=60&h=60&fit=crop&crop=face",
      story: "Berkat Warung Warga, saya bisa jual hasil kebun dan dapat tambahan penghasilan.",
      achievement: "Penjualan +150%",
      bg: "from-green-100 to-green-50"
    },
    {
      id: 2,
      name: "Pak Ahmad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      story: "Dengan borongan beras, kami hemat 25% dari harga supermarket.",
      achievement: "Hemat 25%",
      bg: "from-blue-100 to-blue-50"
    },
    {
      id: 3,
      name: "Maya Dewi",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      story: "Bergabung komunitas ini membuat belanja jadi lebih mudah dan murah.",
      achievement: "Member Aktif",
      bg: "from-purple-100 to-purple-50"
    }
  ];

  return (
    <section className="page-padding py-6u">
      <h3 className="text-heading-2 text-text-primary mb-4u text-center">
        Cerita Sukses Komunitas
      </h3>
      
      <div className="space-y-3u">
        {successStories.map((story) => (
          <div key={story.id} className={`card p-4u bg-gradient-to-r ${story.bg} border-l-4 border-primary`}>
            <div className="flex items-start gap-3u">
              <img 
                src={story.avatar} 
                alt={story.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2u">
                  <h4 className="text-body-large font-semibold text-text-primary">{story.name}</h4>
                  <span className="text-caption bg-white/80 px-2u py-1u rounded-full font-medium text-primary">
                    {story.achievement}
                  </span>
                </div>
                <p className="text-body-small text-text-secondary italic">&ldquo;{story.story}&rdquo;</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// New Statistics Section
function StatsSection() {
  const stats = [
    { label: "Anggota Aktif", value: "2,847", icon: "👥" },
    { label: "Produk Terjual", value: "15,632", icon: "📦" },
    { label: "Total Hemat", value: "Rp 45M", icon: "💰" },
    { label: "Lapak Aktif", value: "156", icon: "🏪" }
  ];

  return (
    <section className="page-padding py-6u bg-gradient-to-br from-primary/5 to-accent/5">
      <h3 className="text-heading-2 text-text-primary mb-4u text-center">
        Warung Warga dalam Angka
      </h3>
      
      <div className="grid grid-cols-2 gap-3u">
        {stats.map((stat, index) => (
          <div key={index} className="card p-4u text-center bg-white/80 backdrop-blur-sm">
            <div className="text-2xl mb-2u">{stat.icon}</div>
            <div className="text-heading-2 font-bold text-primary mb-1u">{stat.value}</div>
            <div className="text-caption text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header with Profile Access */}
      <ClientOnly>
        <ModernHeader />
      </ClientOnly>

      {/* Quick Actions Section */}
      <ClientOnly>
        <QuickActionsSection />
      </ClientOnly>

      {/* Nearby Lapak Section */}
      <ClientOnly>
        <NearbyLapakSection />
      </ClientOnly>

      {/* Feature Highlights */}
      <FeatureHighlights />

      {/* Statistics Section */}
      <StatsSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Call to Action for Non-Authenticated Users */}
      <ClientOnly>
        <div className="page-padding py-6u">
          <div className="card p-6u text-center bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="text-4xl mb-3u">🎯</div>
            <h3 className="text-heading-2 text-text-primary mb-2u">
              Bergabung dengan Warung Warga
            </h3>
            <p className="text-body-small text-text-secondary mb-4u">
              Mulai belanja hemat dan jual produk segar ke tetangga sekitar
            </p>
            <div className="flex flex-col gap-2u">
              <Link href="/register">
                <button className="btn-primary w-full">
                  📝 Daftar Sekarang - Gratis!
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-secondary w-full">
                  🔑 Masuk ke Akun
                </button>
              </Link>
            </div>
            <p className="text-caption text-text-secondary mt-3u">
              Sudah 2,847+ tetangga yang bergabung!
            </p>
          </div>
        </div>
      </ClientOnly>

      {/* Bottom Spacing for BottomNavBar */}
      <div className="h-20"></div>
    </div>
  )
} 