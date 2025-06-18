'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SkeletonGrid } from '@/components/SkeletonCard';

export default function LapakPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userLapak, setUserLapak] = useState([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
              <button className="w-10 h-10 rounded-button bg-primary text-white flex items-center justify-center">
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
        {!user ? (
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
            <h3 className="text-heading-2 mb-3u">Produk Anda</h3>
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
            <div className="text-center py-8u">
              <div className="w-16 h-16 mx-auto mb-4u bg-surface-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-heading-2 mb-2u">Mulai Berjualan</h3>
              <p className="text-body-small text-text-secondary mb-4u max-w-sm mx-auto">
                Tambahkan produk pertama Anda dan mulai mendapatkan penghasilan dari tetangga sekitar.
              </p>
              <Link href="/lapak/buat">
                <button className="btn-primary mb-3u">
                  🚀 Tambah Produk Pertama
                </button>
              </Link>
              <div className="text-center">
                <Link href="/panduan/jual" className="text-primary text-body-small underline">
                  Lihat panduan berjualan
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Has Products - Will implement later */
          <div>Products will be shown here</div>
        )}

        {/* Tips Section */}
        <div className="card mt-4u">
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
    </div>
  );
} 