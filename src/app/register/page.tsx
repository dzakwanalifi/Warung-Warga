'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { registerUser } from '@/lib/authService'

export default function RegisterPage() {
  const router = useRouter()
  
  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      setLoading(false)
      return
    }

    try {
      await registerUser(fullName, email, password)
      
      // Registration success
      setSuccess(true)
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-2u py-4u">
        <div className="w-full max-w-md text-center">
          <div className="card">
            <div className="text-center py-4u">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-3u">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-heading-1 font-bold text-success mb-2">
                Pendaftaran Berhasil!
              </h1>
              <p className="text-body-small text-text-secondary mb-4u">
                Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login...
              </p>
              <Link href="/login">
                <Button>
                  Lanjut ke Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2u py-4u">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4u">
          <h1 className="text-heading-1 font-bold text-primary mb-2">
            Daftar Warung Warga
          </h1>
          <p className="text-body-small text-text-secondary">
            Bergabung dengan komunitas jual beli dan borongan di sekitar Anda
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
              label="Nama Lengkap"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              disabled={loading}
            />

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
              placeholder="Minimal 6 karakter"
              required
              disabled={loading}
              helperText="Password harus minimal 6 karakter"
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password Anda"
              required
              disabled={loading}
            />

            <div className="pt-2u">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                disabled={!fullName || !email || !password || !confirmPassword}
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-3u pt-3u border-t border-border text-center">
            <p className="text-body-small text-text-secondary">
              Sudah punya akun?{' '}
              <Link 
                href="/login"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Masuk di sini
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