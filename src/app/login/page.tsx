'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAuthStore } from '@/hooks/useAuthStore'
import { loginUser } from '@/lib/authService'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser(email, password)
      
      // Login success - save to store
      login(response.access_token, response.user)
      
      // Redirect to home page
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2u py-4u">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4u">
          <h1 className="text-heading-1 font-bold text-primary mb-2">
            Masuk ke Warung Warga
          </h1>
          <p className="text-body-small text-text-secondary">
            Masuk untuk mengakses lapak dan borongan di sekitar Anda
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-2u">
            {error && (
              <div className="bg-red-50 border border-error rounded-input p-3u">
                <p className="text-body-small text-error">{error}</p>
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukkan.email@example.com"
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              required
              disabled={loading}
            />

            <div className="pt-2u">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                disabled={!email || !password}
              >
                {loading ? 'Masuk...' : 'Masuk'}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-3u pt-3u border-t border-border text-center">
            <p className="text-body-small text-text-secondary">
              Belum punya akun?{' '}
              <Link 
                href="/register"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-3u">
          <Link 
            href="/"
            className="text-body-small text-text-secondary hover:text-primary"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  )
} 