'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { ListingCard } from '@/components/ListingCard';
import { EmptyState } from '@/components/EmptyState';
import { getMyLapak } from '@/lib/lapakService';
import { Lapak } from '@/lib/types';
import { useToast, ToastContainer } from '@/components/Toast';

export default function LapakPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userLapak, setUserLapak] = useState<Lapak[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold_out: 0,
    totalViews: 0
  });
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'sold_out' | 'inactive'>('all');

  // Fetch user's lapaks
  const fetchMyLapak = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getMyLapak({
        page: 1,
        limit: 50, // Get more items to show comprehensive view
        ...(selectedStatus !== 'all' && { status: selectedStatus as any })
      });

      setUserLapak(response.lapak);
      
      // Calculate stats
      const available = response.lapak.filter(lapak => lapak.status === 'available').length;
      const sold_out = response.lapak.filter(lapak => lapak.status === 'sold_out').length;
      
      setStats({
        total: response.total,
        available,
        sold_out,
        totalViews: 0 // We don't have views data yet
      });

    } catch (error: any) {
      console.error('Failed to fetch my lapaks:', error);
      toast.error('Gagal memuat lapak', error.message || 'Terjadi kesalahan saat memuat data lapak Anda');
      setUserLapak([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Wait for auth hydration before fetching data
  useEffect(() => {
    if (isHydrated) {
      fetchMyLapak();
    }
  }, [isAuthenticated, user, isHydrated, selectedStatus]);

  // Filter status options
  const statusFilters = [
    { key: 'all', label: 'Semua', count: stats.total },
    { key: 'available', label: 'Tersedia', count: stats.available },
    { key: 'sold_out', label: 'Habis', count: stats.sold_out }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Simplified Mobile Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold text-primary">
                Lapak Saya
              </h1>
              <p className="text-caption text-text-secondary">
                Kelola produk dan lihat performa
              </p>
            </div>
            <Link href="/lapak/buat">
              <button className="w-10 h-10 rounded-button bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="page-padding py-4u">
        {!isAuthenticated ? (
          /* Not Logged In */
          <div className="text-center py-8u">
            <div className="w-16 h-16 mx-auto mb-4u bg-surface-secondary rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-heading-2 mb-2u">Masuk untuk Melihat Lapak</h3>
            <p className="text-body-small text-text-secondary mb-4u max-w-sm mx-auto">
              Masuk ke akun Anda untuk melihat dan mengelola produk lapak.
            </p>
            <Link href="/login">
              <button className="btn-primary">
                Masuk Sekarang
              </button>
            </Link>
          </div>
        ) : isLoading ? (
          <div>
            {/* Stats Skeleton */}
            <div className="grid grid-cols-3 gap-2u mb-4u">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-3u animate-pulse">
                  <div className="h-6 bg-surface-secondary rounded mb-2"></div>
                  <div className="h-4 bg-surface-secondary rounded w-16"></div>
                </div>
              ))}
            </div>
            
            <div className="mb-4u">
              <div className="h-6 bg-surface-secondary rounded w-32 mb-3u animate-pulse"></div>
              <div className="flex gap-2u mb-4u">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-surface-secondary rounded w-20 animate-pulse"></div>
                ))}
              </div>
            </div>
            <SkeletonGrid count={4} />
          </div>
        ) : userLapak.length === 0 ? (
          /* Empty State */
          <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2u mb-4u">
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-primary">0</div>
                <div className="text-caption text-text-secondary">Produk</div>
              </div>
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-accent">0</div>
                <div className="text-caption text-text-secondary">Terjual</div>
              </div>
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-success">0</div>
                <div className="text-caption text-text-secondary">Rating</div>
              </div>
            </div>

            {/* Call to Action */}
            <EmptyState
              icon={
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🏪</span>
                </div>
              }
              title="Mulai Berjualan"
              description="Tambahkan produk pertama Anda dan mulai mendapatkan penghasilan dari tetangga sekitar."
              action={
                <div className="space-y-3u">
                  <Link href="/lapak/buat">
                    <button className="btn-primary">
                      🚀 Tambah Produk Pertama
                    </button>
                  </Link>
                  <div className="text-center">
                    <Link href="/panduan/jual" className="text-primary text-body-small underline">
                      Lihat panduan berjualan
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        ) : (
          /* Has Products */
          <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2u mb-4u">
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-primary">{stats.total}</div>
                <div className="text-caption text-text-secondary">Produk</div>
              </div>
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-accent">{stats.available}</div>
                <div className="text-caption text-text-secondary">Tersedia</div>
              </div>
              <div className="card text-center p-3u">
                <div className="text-heading-1 font-bold text-success">{stats.sold_out}</div>
                <div className="text-caption text-text-secondary">Habis</div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-4u">
              <h3 className="text-heading-2 mb-3u">Produk Anda</h3>
              <div className="flex gap-2u mb-4u overflow-x-auto">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedStatus(filter.key as any)}
                    className={`
                      flex items-center gap-1u px-3u py-2u rounded-button border transition-all duration-200 whitespace-nowrap
                      ${selectedStatus === filter.key
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-surface text-text-secondary hover:border-primary/50'
                      }
                    `}
                  >
                    <span className="text-body-small">{filter.label}</span>
                    {filter.count > 0 && (
                      <span className={`
                        text-caption px-1.5u py-0.5u rounded-full text-xs
                        ${selectedStatus === filter.key
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary text-text-secondary'
                        }
                      `}>
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4u">
              {userLapak.map((lapak) => (
                <ListingCard
                  key={lapak.id}
                  lapak={lapak}
                  className="hover:shadow-lg transition-shadow duration-200"
                />
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {stats.total > userLapak.length && (
              <div className="text-center mt-6u">
                <button 
                  onClick={() => {
                    // TODO: Implement load more functionality
                    toast.info('Fitur load more akan segera hadir');
                  }}
                  className="btn-secondary"
                >
                  Muat Lebih Banyak ({stats.total - userLapak.length} lainnya)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="card mt-6u">
          <div className="p-4u">
            <h3 className="text-heading-2 mb-3u">Tips Sukses Berjualan</h3>
            <div className="space-y-3u">
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-primary/10 rounded-button flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-label">📸</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Foto Produk Menarik</h4>
                  <p className="text-body-small text-text-secondary">
                    Gunakan foto berkualitas dengan pencahayaan yang baik untuk menarik pembeli.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-accent/10 rounded-button flex items-center justify-center flex-shrink-0">
                  <span className="text-accent text-label">💰</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Harga Kompetitif</h4>
                  <p className="text-body-small text-text-secondary">
                    Riset harga di area sekitar untuk menentukan harga yang tepat dan menarik.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3u">
                <div className="w-8 h-8 bg-success/10 rounded-button flex items-center justify-center flex-shrink-0">
                  <span className="text-success text-label">⚡</span>
                </div>
                <div>
                  <h4 className="text-body-large font-medium mb-1u">Respon Cepat</h4>
                  <p className="text-body-small text-text-secondary">
                    Tanggapi pertanyaan pembeli dengan cepat untuk meningkatkan kepercayaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
} 