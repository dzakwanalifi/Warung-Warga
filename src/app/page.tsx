'use client'

import { useAuthStore } from '@/hooks/useAuthStore'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function Home() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <main className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto px-2u py-3u">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-heading-1 font-bold text-primary">
                Warung Warga
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <span className="text-body-small text-text-secondary">
                    Halo, {user?.full_name}
                  </span>
                  <Link href="/profil">
                    <Button variant="ghost" size="sm">
                      Profil
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center px-2u py-5u">
        <div className="text-center max-w-2xl">
          <h1 className="text-display font-bold text-primary mb-2u">
            Warung Warga
          </h1>
          <p className="text-body-large text-text-secondary mb-4u">
            Platform jual beli dan borongan bareng untuk warga sekitar
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-3u">
              <p className="text-body-small text-success">
                ✅ Selamat datang kembali, {user?.full_name}!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2u max-w-md mx-auto">
                <Link href="/lapak">
                  <Button variant="secondary" className="w-full">
                    📦 Jelajahi Lapak
                  </Button>
                </Link>
                <Link href="/borongan">
                  <Button variant="secondary" className="w-full">
                    🛒 Lihat Borongan
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3u">
              <p className="text-body-small text-text-secondary">
                Masuk untuk mulai berjualan dan berbelanja dengan tetangga sekitar
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2u justify-center">
                <Link href="/register">
                  <Button className="w-full sm:w-auto">
                    Daftar Sekarang
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Sudah Punya Akun
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-2u py-4u">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3u">
          {/* Lapak Warga */}
          <div className="card">
            <h2 className="text-heading-2 font-semibold text-primary mb-2">
              📦 Lapak Warga
            </h2>
            <p className="text-body-small text-text-secondary mb-3u">
              Jual beli produk dengan tetangga di sekitar Anda. Mulai dari makanan rumahan hingga kebutuhan sehari-hari.
            </p>
            <div className="flex flex-wrap gap-1 text-caption text-text-secondary">
              <span className="bg-primary-light px-2 py-1 rounded">Hiperlokal</span>
              <span className="bg-primary-light px-2 py-1 rounded">Mudah</span>
              <span className="bg-primary-light px-2 py-1 rounded">Terpercaya</span>
            </div>
          </div>

          {/* Borongan Bareng */}
          <div className="card">
            <h2 className="text-heading-2 font-semibold text-primary mb-2">
              🛒 Borongan Bareng
            </h2>
            <p className="text-body-small text-text-secondary mb-3u">
              Gabung dengan tetangga untuk membeli dalam jumlah besar dan dapatkan harga lebih murah.
            </p>
            <div className="flex flex-wrap gap-1 text-caption text-text-secondary">
              <span className="bg-accent text-white px-2 py-1 rounded">Hemat</span>
              <span className="bg-accent text-white px-2 py-1 rounded">Komunitas</span>
              <span className="bg-accent text-white px-2 py-1 rounded">Efisien</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-2xl mx-auto px-2u py-3u">
        <div className="card bg-primary-light">
          <div className="text-center">
            <h3 className="text-heading-2 font-semibold text-primary mb-2">
              🚀 Status Development
            </h3>
            <p className="text-body-small text-text-secondary mb-2">
              ✅ Backend API: Production Ready
            </p>
            <p className="text-body-small text-text-secondary mb-2">
              🔄 Frontend: Authentication & User Management Complete
            </p>
            <p className="text-caption text-text-secondary">
              Backend API tersedia di: 
              <a 
                href="https://warungwarga-api.azurewebsites.net/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover ml-1"
              >
                warungwarga-api.azurewebsites.net
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 