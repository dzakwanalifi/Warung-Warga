'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ProfileStatsCard } from '@/components/ProfileStatsCard';
import { ProfileMenuButton } from '@/components/ProfileMenuButton';
import { Tabs } from '@/components/Tabs';
import { ListingCard } from '@/components/ListingCard';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { logoutUser } from '@/lib/authService';
import { Lapak, GroupBuy } from '@/lib/types';

export default function ProfilPage() {
  const { user, isAuthenticated, logoutAction } = useAuthStore();
  const [activeTab, setActiveTab] = useState('lapak');
  const [isLoading, setIsLoading] = useState(false);
  const [userLapak, setUserLapak] = useState<Lapak[]>([]);
  const [userBorongan, setUserBorongan] = useState<GroupBuy[]>([]);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // Mock stats data - in real app, this would come from API
  const statsData = {
    totalListings: userLapak.length,
    rating: 4.8,
    totalGroupBuys: userBorongan.length,
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await logoutUser();
      logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Here you would fetch data based on the tab
    // For now, we'll use mock data
  };

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading user's listings
    setIsLoading(true);
    setTimeout(() => {
      // Mock lapak data
      setUserLapak([
        {
          id: '1',
          seller_id: user?.id || '',
          title: 'Sayur Segar dari Kebun',
          description: 'Sayuran segar langsung dari kebun organik',
          price: 15000,
          unit: 'ikat',
          stock_quantity: 20,
          image_urls: ['/api/placeholder/300/200'],
          status: 'available' as const,
          latitude: -6.2,
          longitude: 106.8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          seller: {
            id: user?.id || '',
            user_id: user?.id || '',
            full_name: user?.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      ]);

      // Mock borongan data (empty for now)
      setUserBorongan([]);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const tabs = [
    { id: 'lapak', label: 'Lapak Saya', count: userLapak.length },
    { id: 'borongan', label: 'Borongan Saya', count: userBorongan.length },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center page-padding">
        <div className="text-center">
          <div className="mb-4u">
            <svg className="w-16 h-16 text-text-secondary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-heading-2 text-text-primary mb-2u">Masuk Diperlukan</h2>
          <p className="text-body-regular text-text-secondary mb-4u">
            Silakan masuk untuk mengakses profil Anda
          </p>
          <Link href="/login">
            <Button variant="primary">Masuk Sekarang</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 pb-2u">
        <div className="page-padding pt-4u">
          {/* Avatar Section */}
          <div className="text-center mb-4u">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3u">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Edit Button */}
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            
            <h1 className="text-heading-2 text-text-primary font-bold">
              {user?.full_name}
            </h1>
            <p className="text-body-regular text-text-secondary">
              📧 {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="page-padding -mt-2u">
        {/* Stats Card */}
        <ProfileStatsCard
          totalListings={statsData.totalListings}
          rating={statsData.rating}
          totalGroupBuys={statsData.totalGroupBuys}
          className="mb-4u"
        />

        {/* Navigation Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="mb-4u"
        />

        {/* Tab Content */}
        <div className="mb-6u">
          {isLoading ? (
            <SkeletonGrid count={3} />
          ) : (
            <>
              {activeTab === 'lapak' && (
                <div className="space-y-3u">
                  {userLapak.length > 0 ? (
                    userLapak.map((lapak) => (
                      <ListingCard key={lapak.id} lapak={lapak} />
                    ))
                  ) : (
                    <EmptyState
                      title="Belum Ada Lapak"
                      description="Anda belum memiliki lapak. Mulai berjualan sekarang!"
                      action={
                        <Button variant="primary">
                          Buka Lapak Pertama
                        </Button>
                      }
                      icon={
                        <svg className="w-16 h-16 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                    />
                  )}
                </div>
              )}

              {activeTab === 'borongan' && (
                <div className="space-y-3u">
                  {userBorongan.length > 0 ? (
                    userBorongan.map((borongan) => (
                      <div key={borongan.id} className="card p-4u">
                        <h3 className="text-heading-3 text-text-primary">{borongan.title}</h3>
                        <p className="text-body-regular text-text-secondary">{borongan.description}</p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="Belum Ada Borongan"
                      description="Anda belum berpartisipasi dalam borongan apapun. Cari borongan menarik!"
                      action={
                        <Button variant="primary">
                          Cari Borongan
                        </Button>
                      }
                      icon={
                        <svg className="w-16 h-16 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Menu Actions */}
        <div className="space-y-3u mb-6u">
          <ProfileMenuButton
            icon={
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            }
            title="Edit Profil"
            subtitle="Ubah informasi personal dan lokasi"
            onClick={() => console.log('Edit profile clicked')}
          />

          <ProfileMenuButton
            icon={
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Pengaturan"
            subtitle="Notifikasi, privasi, dan preferensi"
            onClick={() => console.log('Settings clicked')}
            iconBgColor="bg-secondary/10"
          />

          <ProfileMenuButton
            icon={
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Bantuan & Dukungan"
            subtitle="FAQ, hubungi kami, dan panduan"
            onClick={() => console.log('Help clicked')}
            iconBgColor="bg-accent/10"
          />
        </div>

        {/* Logout Button */}
        <div className="pb-6u">
          <Button
            variant="outline"
            fullWidth
            loading={isLogoutLoading}
            onClick={handleLogout}
            className="border-error text-error hover:bg-error/10"
          >
            {isLogoutLoading ? 'Sedang Logout...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
} 