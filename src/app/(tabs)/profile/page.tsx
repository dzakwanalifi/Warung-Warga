'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getMockUserProfile, UserProfile } from '@/lib/userService';
import { formatDate } from '@/lib/utils';

function ProfileHeader({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="card p-4u mb-4u">
      <div className="flex items-center gap-4u">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-surface-secondary overflow-hidden border-4 border-white shadow-lg">
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          {userProfile.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2u mb-1u">
            <h2 className="text-heading-1 font-bold text-text-primary">
              {userProfile.name}
            </h2>
            {userProfile.verified && (
              <span className="px-2u py-1 bg-success/10 text-success text-caption rounded-button">
                Terverifikasi
              </span>
            )}
          </div>
          <p className="text-body-small text-text-secondary mb-1u">
            {userProfile.email}
          </p>
          <div className="flex items-center gap-1u text-caption text-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{userProfile.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStats({ userProfile }: { userProfile: UserProfile }) {
  const stats = [
    {
      label: 'Borongan Dibuat',
      value: userProfile.stats.totalBoronganCreated,
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      label: 'Borongan Diikuti',
      value: userProfile.stats.totalBoronganJoined,
      icon: (
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      label: 'Lapak Aktif',
      value: userProfile.stats.totalLapakCreated,
      icon: (
        <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      label: 'Total Transaksi',
      value: userProfile.stats.totalTransactions,
      icon: (
        <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="card p-4u mb-4u">
      <h3 className="text-heading-2 font-semibold text-text-primary mb-3u">
        Statistik Aktivitas
      </h3>
      <div className="grid grid-cols-2 gap-3u">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3u p-3u bg-surface-secondary rounded-button">
            {stat.icon}
            <div>
              <div className="text-heading-2 font-bold text-text-primary">
                {stat.value}
              </div>
              <div className="text-caption text-text-secondary">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Section */}
      <div className="mt-4u pt-4u border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2u">
            <div className="flex items-center gap-1u">
              {Array.from({ length: 5 }, (_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(userProfile.stats.rating) ? 'text-accent fill-current' : 'text-border'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-body-large font-medium text-text-primary ml-1u">
                {userProfile.stats.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-caption text-text-secondary">
              ({userProfile.stats.totalReviews} ulasan)
            </span>
          </div>
          <span className="text-caption text-text-secondary">
            Bergabung {formatDate(userProfile.joinedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const { logoutAction } = useAuthStore();

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Edit Profil',
      description: 'Ubah informasi pribadi',
      action: () => router.push('/profile/edit')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Riwayat Transaksi',
      description: 'Lihat aktivitas belanja',
      action: () => router.push('/profile/transactions')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Favorit',
      description: 'Lapak dan borongan favorit',
      action: () => router.push('/profile/favorites')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Pengaturan',
      description: 'Notifikasi dan preferensi',
      action: () => router.push('/profile/settings')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Bantuan',
      description: 'FAQ dan dukungan',
      action: () => router.push('/help')
    }
  ];

  const handleLogout = async () => {
    logoutAction();
    router.push('/login');
  };

  return (
    <div className="card p-4u mb-4u">
      <h3 className="text-heading-2 font-semibold text-text-primary mb-3u">
        Menu Profil
      </h3>
      <div className="space-y-1u">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center gap-3u p-3u rounded-button hover:bg-surface-secondary transition-colors text-left"
          >
            <div className="text-text-secondary">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="text-body-large font-medium text-text-primary">
                {item.label}
              </div>
              <div className="text-caption text-text-secondary">
                {item.description}
              </div>
            </div>
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3u p-3u rounded-button hover:bg-error/10 transition-colors text-left text-error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <div className="flex-1">
            <div className="text-body-large font-medium">
              Keluar
            </div>
            <div className="text-caption text-error/80">
              Logout dari akun Anda
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // For MVP, using mock data
        const profile = getMockUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="page-padding py-4u">
          <div className="animate-pulse space-y-4u">
            <div className="card p-4u">
              <div className="flex items-center gap-4u">
                <div className="w-20 h-20 bg-surface-secondary rounded-full"></div>
                <div className="flex-1 space-y-2u">
                  <div className="h-6 bg-surface-secondary rounded w-3/4"></div>
                  <div className="h-4 bg-surface-secondary rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="card p-4u">
              <div className="h-6 bg-surface-secondary rounded w-1/3 mb-3u"></div>
              <div className="grid grid-cols-2 gap-3u">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-16 bg-surface-secondary rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-heading-1 text-text-primary mb-2u">Gagal Memuat Profil</div>
          <div className="text-body-small text-text-secondary">Silakan coba lagi nanti</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <h1 className="text-heading-1 font-bold text-primary">
            Profil Saya
          </h1>
          <p className="text-body-small text-text-secondary">
            Kelola informasi dan aktivitas Anda
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="page-padding py-4u">
        <ProfileHeader userProfile={userProfile} />
        <ProfileStats userProfile={userProfile} />
        <ProfileMenu userProfile={userProfile} />
      </div>
    </div>
  );
} 