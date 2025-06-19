'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Package, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/Button';
import { useToast, ToastContainer } from '@/components/Toast';
import { cn } from '@/lib/utils';
import { getMyBorongan, BoronganItem } from '@/lib/boronganService';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function BoronganSayaPage() {
  const router = useRouter();
  const toast = useToast();
  const [myBorongan, setMyBorongan] = useState<BoronganItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  // Fetch user's borongan on component mount
  useEffect(() => {
    if (!isHydrated) return; // Wait for Zustand hydration

    const fetchMyBorongan = async () => {
      // We are ignoring some dependencies in the array below to prevent an infinite loop.
      // This is often caused by custom hooks returning new object/function references on every render.

      // Check authentication
      if (!isAuthenticated) {
        toast.error('Anda harus login terlebih dahulu');
        router.push('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getMyBorongan();
        setMyBorongan(data);
      } catch (error: any) {
        console.error('Error fetching my borongan:', error);
        toast.error('Gagal memuat data borongan Anda');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBorongan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isAuthenticated]);

  // Show loading state
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-surface border-b border-border sticky top-0 z-40">
          <div className="page-padding py-4u">
            <div className="flex items-center gap-3u">
              <Button
                variant="ghost"
                size="small"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-heading-1 font-bold text-primary">
                  Borongan Saya
                </h1>
                <p className="text-caption text-text-secondary">
                  Kelola semua borongan yang Anda buat
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <div className="page-padding py-8u">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Memuat borongan Anda...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-heading-2 mb-2u">Akses Ditolak</h3>
          <p className="text-text-secondary mb-4u">Anda harus login untuk melihat borongan Anda</p>
          <Button onClick={() => router.push('/login')}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hari ini';
    if (diffInDays === 1) return 'Kemarin';
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return `${Math.floor(diffInDays / 30)} bulan lalu`;
  };

  // Calculate progress percentage
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'completed':
        return 'text-info bg-info/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-text-secondary bg-surface';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <div className="flex items-center gap-3u">
            <Button
              variant="ghost"
              size="small"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-heading-1 font-bold text-primary">
                Borongan Saya
              </h1>
              <p className="text-caption text-text-secondary">
                Kelola semua borongan yang Anda buat
              </p>
            </div>
            <Button
              onClick={() => router.push('/borongan/buat')}
              size="small"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Buat Baru
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="page-padding py-6u">
        {myBorongan.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12u">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4u">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-heading-2 font-semibold mb-2u">
              Belum Ada Borongan
            </h3>
            <p className="text-text-secondary mb-6u max-w-md mx-auto">
              Anda belum membuat borongan apapun. Mulai buat borongan pertama Anda untuk mengajak warga lain berbelanja bersama.
            </p>
            <Button
              onClick={() => router.push('/borongan/buat')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Buat Borongan Pertama
            </Button>
          </div>
        ) : (
          /* Borongan List */
          <div className="space-y-4u">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4u">
              <div className="card p-4u text-center">
                <div className="text-heading-1 font-bold text-primary">
                  {myBorongan.length}
                </div>
                <div className="text-caption text-text-secondary">Total Borongan</div>
              </div>
              <div className="card p-4u text-center">
                <div className="text-heading-1 font-bold text-success">
                  {myBorongan.filter(b => b.status === 'active').length}
                </div>
                <div className="text-caption text-text-secondary">Aktif</div>
              </div>
              <div className="card p-4u text-center">
                <div className="text-heading-1 font-bold text-info">
                  {myBorongan.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-caption text-text-secondary">Selesai</div>
              </div>
              <div className="card p-4u text-center">
                <div className="text-heading-1 font-bold text-primary">
                  {myBorongan.reduce((total, b) => total + b.participants_count, 0)}
                </div>
                <div className="text-caption text-text-secondary">Total Peserta</div>
              </div>
            </div>

            {/* Borongan Cards */}
            <div className="space-y-4u">
              {myBorongan.map((borongan) => {
                const progress = calculateProgress(borongan.current_quantity, borongan.target_quantity);
                
                return (
                  <div
                    key={borongan.id}
                    className="card p-4u hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/borongan/${borongan.id}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3u">
                      <div className="flex-1">
                        <h3 className="text-heading-3 font-semibold mb-1u">
                          {borongan.title}
                        </h3>
                        <p className="text-body-small text-text-secondary line-clamp-2">
                          {borongan.description}
                        </p>
                      </div>
                      <span className={cn(
                        'px-2u py-1u rounded-full text-caption font-medium',
                        getStatusColor(borongan.status)
                      )}>
                        {getStatusLabel(borongan.status)}
                      </span>
                    </div>

                    {/* Price and Target */}
                    <div className="flex items-center gap-4u mb-3u">
                      <div className="flex items-center gap-1u text-primary">
                        <span className="text-heading-3 font-bold">
                          {formatCurrency(borongan.price_per_unit)}
                        </span>
                        <span className="text-caption">/{borongan.unit}</span>
                      </div>
                      <div className="flex items-center gap-1u text-text-secondary">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-caption">
                          Target: {borongan.target_quantity} {borongan.unit}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-3u">
                      <div className="flex items-center justify-between mb-1u">
                        <span className="text-caption text-text-secondary">Progress</span>
                        <span className="text-caption font-medium">
                          {borongan.current_quantity} / {borongan.target_quantity} {borongan.unit}
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1u">
                        <span className="text-caption text-success">
                          {progress.toFixed(0)}% tercapai
                        </span>
                        <span className="text-caption text-text-secondary">
                          {borongan.participants_count} peserta
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-caption text-text-secondary">
                      <div className="flex items-center gap-1u">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(borongan.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1u">
                        <Users className="h-3 w-3" />
                        <span>{borongan.participants_count} bergabung</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
} 