'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/Button';
import { ClientOnly } from '@/components/ClientOnly';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logoutAction } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated (only after mounting)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show loading if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-body-large text-text-secondary">
            Memuat profil...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutAction();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-card border-b border-border">
        <div className="page-padding py-4u">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 text-primary font-bold">
                Profil Saya
              </h1>
              <p className="text-caption text-text-secondary">
                Kelola informasi akun Anda
              </p>
            </div>
            <Link href="/">
              <button className="btn-ghost text-caption px-2u py-1">
                ← Beranda
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-padding py-5u">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="card mb-5u">
            <div className="p-4u">
              <h2 className="text-heading-2 mb-4u">Informasi Akun</h2>
              
              <div className="space-y-3u">
                <div>
                  <label className="text-label block mb-1u text-text-secondary">
                    Nama Lengkap
                  </label>
                  <p className="text-body-large text-text-primary">
                    {user.full_name}
                  </p>
                </div>
                
                <div>
                  <label className="text-label block mb-1u text-text-secondary">
                    Email
                  </label>
                  <p className="text-body-large text-text-primary">
                    {user.email}
                  </p>
                </div>
                
                <div>
                  <label className="text-label block mb-1u text-text-secondary">
                    Bergabung Sejak
                  </label>
                  <p className="text-body-large text-text-primary">
                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3u">
            <Button
              variant="outline"
              fullWidth
              onClick={() => alert('Fitur edit profil akan segera hadir!')}
            >
              Edit Profil
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={handleLogout}
            >
              Keluar dari Akun
            </Button>
          </div>

          {/* Status Info */}
          <div className="card mt-5u">
            <div className="p-4u text-center">
              <h3 className="text-heading-2 mb-2u">Status Akun</h3>
              <div className="flex items-center justify-center gap-2u">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-body-small text-success">
                  Akun Aktif
                </span>
              </div>
              <p className="text-caption text-text-secondary mt-2u">
                Anda dapat mulai berbelanja dan berpartisipasi dalam borongan
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 