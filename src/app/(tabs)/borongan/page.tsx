'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { OverallStatsCard } from '@/components/OverallStatsCard';
import { GroupBuyCard } from '@/components/GroupBuyCard';
import { getBoronganList, calculateBoronganStats, getMockBoronganStats, BoronganItem, BoronganStats } from '@/lib/boronganService';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function BoronganPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [boronganList, setBoronganList] = useState<BoronganItem[]>([]);
  const [stats, setStats] = useState<BoronganStats>(getMockBoronganStats());
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // For MVP, we'll use mock stats but attempt to fetch real data
        const data = await getBoronganList();
        setBoronganList(data);
        
        // Calculate stats from real data if available, otherwise use mock
        if (data.length > 0) {
          setStats(calculateBoronganStats(data));
        }
      } catch (error) {
        console.error('Error fetching borongan data:', error);
        // Use mock data as fallback
        setStats(getMockBoronganStats());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold text-primary">
                Borongan Bareng
              </h1>
              <p className="text-body-small text-text-secondary">
                Belanja bareng tetangga, hemat bersama
              </p>
            </div>
            {/* Navigation to Borongan Saya */}
            {isAuthenticated && (
              <Link href="/borongan/saya" prefetch={true}>
                <button className="flex items-center gap-2u px-3u py-2u bg-surface-secondary text-text-primary rounded-button text-label transition-all duration-200 hover:bg-border border border-border">
                  <User className="w-4 h-4" />
                  Borongan Saya
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="page-padding py-4u space-y-4u">
        {/* Community Stats Card */}
        <OverallStatsCard
          totalActiveBorongan={stats.totalActiveBorongan}
          totalParticipants={stats.totalParticipants}
          totalSavings={stats.totalSavings}
        />

        {/* Section Header with Action */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading-2 font-semibold text-text-primary">
            Borongan Terbaru
          </h2>
          <Link href="/borongan/buat" prefetch={true}>
            <button className="flex items-center gap-2u px-3u py-2u bg-primary text-white rounded-button text-label transition-all duration-200 hover:bg-primary-hover">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Borongan
            </button>
          </Link>
        </div>

        {/* Borongan List */}
        {isLoading ? (
          <div>
            <SkeletonGrid count={4} />
          </div>
        ) : boronganList.length > 0 ? (
          <div className="space-y-3u">
            {boronganList.map((borongan) => (
              <GroupBuyCard key={borongan.id} borongan={borongan} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-8u">
            <div className="w-16 h-16 mx-auto mb-4u bg-surface-secondary rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-heading-2 mb-2u">Belum Ada Borongan</h3>
            <p className="text-body-small text-text-secondary mb-4u max-w-sm mx-auto">
              Belum ada borongan aktif di area Anda. Mulai borongan pertama atau coba lagi nanti.
            </p>
            <Link href="/borongan/buat" prefetch={true}>
              <button className="btn-primary">
                Buat Borongan Pertama
              </button>
            </Link>
          </div>
        )}

        {/* Information Section */}
        <div className="card mt-6u">
          <div className="p-4u">
            <h3 className="text-heading-2 mb-3u">Apa itu Borongan Bareng?</h3>
            <div className="space-y-3u">
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-lg">💰</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Hemat Lebih Banyak</h4>
                  <p className="text-body-small text-text-secondary">
                    Beli dalam jumlah besar untuk mendapat harga grosir yang lebih murah.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent text-lg">🤝</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Gotong Royong</h4>
                  <p className="text-body-small text-text-secondary">
                    Bergabung dengan tetangga untuk mencapai target minimum pembelian.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-success text-lg">✅</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Aman & Terpercaya</h4>
                  <p className="text-body-small text-text-secondary">
                    Sistem pembayaran escrow melindungi uang Anda sampai barang diterima.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 