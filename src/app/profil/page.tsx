'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuthStore } from '@/hooks/useAuthStore'
import { getCurrentUser } from '@/lib/authService'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, setUser } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Protected route logic
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Load fresh user data
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err: any) {
        setError(err.message)
        // If unauthorized, logout and redirect
        if (err.message.includes('Sesi tidak valid')) {
          logout()
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [isAuthenticated, router, logout, setUser])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-body-small text-text-secondary">Memuat profil...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-2u py-3u">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold text-text-primary">
                Profil Saya
              </h1>
              <p className="text-body-small text-text-secondary">
                Kelola informasi akun Anda
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
            >
              ← Beranda
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-2u py-4u">
        {error && (
          <div className="bg-red-50 border border-error rounded-input p-3u mb-3u">
            <p className="text-body-small text-error">{error}</p>
          </div>
        )}

        {/* Profile Information Card */}
        <div className="card mb-3u">
          <h2 className="text-heading-2 font-semibold text-text-primary mb-3u">
            Informasi Akun
          </h2>
          
          <div className="space-y-2u">
            <Input
              label="Nama Lengkap"
              value={user.full_name}
              disabled
              className="bg-border"
            />
            
            <Input
              label="Email"
              value={user.email}
              disabled
              className="bg-border"
            />
            
            <Input
              label="Alamat"
              value={user.address || 'Belum diatur'}
              disabled
              className="bg-border"
            />
            
            {user.latitude && user.longitude && (
              <div className="grid grid-cols-2 gap-2u">
                <Input
                  label="Latitude"
                  value={user.latitude.toString()}
                  disabled
                  className="bg-border"
                />
                <Input
                  label="Longitude"
                  value={user.longitude.toString()}
                  disabled
                  className="bg-border"
                />
              </div>
            )}
          </div>

          <div className="mt-3u pt-3u border-t border-border">
            <p className="text-caption text-text-secondary mb-2">
              <strong>Bergabung:</strong> {new Date(user.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-caption text-text-secondary">
              <strong>Terakhir diperbarui:</strong> {new Date(user.updated_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-3u">
          <h2 className="text-heading-2 font-semibold text-text-primary mb-3u">
            Aksi Cepat
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2u">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/lapak')}
            >
              📦 Lapak Saya
            </Button>
            
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.push('/borongan')}
            >
              🛒 Borongan Saya
            </Button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-heading-2 font-semibold text-text-primary mb-3u">
            Pengaturan Akun
          </h2>
          
          <div className="space-y-2u">
            <Button
              variant="secondary"
              className="w-full"
              disabled
            >
              ✏️ Edit Profil (Segera Hadir)
            </Button>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              🚪 Keluar
            </Button>
          </div>

          <div className="mt-3u pt-3u border-t border-border">
            <p className="text-caption text-text-secondary text-center">
              Dengan keluar, Anda harus login kembali untuk mengakses akun Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 