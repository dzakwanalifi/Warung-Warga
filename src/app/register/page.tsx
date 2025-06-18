'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/hooks/useAuthStore';
import { registerUser } from '@/lib/authService';
import { isValidEmail } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const { loginAction, isAuthenticated, setLoading, isLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Ensure client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated (only after mounting)
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/');
    }
  }, [mounted, isAuthenticated, router]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };

    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Nama lengkap minimal 2 karakter';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time password confirmation validation
    if (field === 'confirmPassword' && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Password tidak cocok' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate individual fields on blur
    if (field === 'fullName' && formData.fullName && formData.fullName.length < 2) {
      setErrors(prev => ({ ...prev, fullName: 'Nama lengkap minimal 2 karakter' }));
    }
    
    if (field === 'email' && formData.email && !isValidEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }));
    }
    
    if (field === 'password' && formData.password && formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password minimal 6 karakter' }));
    }
    
    if (field === 'confirmPassword' && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Password tidak cocok' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Set loading state for instant feedback
    setLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      // Call register service
      const authResponse = await registerUser(
        formData.fullName,
        formData.email,
        formData.password
      );
      
      // Store user data and token
      loginAction(authResponse.user, authResponse.session.access_token);
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      // Handle registration error
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Registrasi gagal. Silakan coba lagi.',
      }));
    } finally {
      // Always turn off loading
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center page-padding py-5u">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5u">
          <h1 className="text-heading-1 text-primary mb-1u">
            Bergabung dengan Warung Warga
          </h1>
          <p className="text-body-small text-text-secondary">
            Daftar untuk mulai berbelanja dan berpartisipasi dalam komunitas
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="p-4u space-y-4u">
            {/* General Error */}
            {errors.general && (
              <div className="bg-error/10 border border-error/20 rounded-button p-3u">
                <p className="text-body-small text-error text-center">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Full Name Input */}
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              onBlur={() => handleInputBlur('fullName')}
              error={touched.fullName ? errors.fullName : ''}
              required
              disabled={isLoading}
            />

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              onBlur={() => handleInputBlur('email')}
              error={touched.email ? errors.email : ''}
              required
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="Buat password (min. 6 karakter)"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              onBlur={() => handleInputBlur('password')}
              error={touched.password ? errors.password : ''}
              required
              disabled={isLoading}
            />

            {/* Confirm Password Input */}
            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ketik ulang password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              onBlur={() => handleInputBlur('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : ''}
              required
              disabled={isLoading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4u">
          <p className="text-body-small text-text-secondary">
            Sudah punya akun?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-3u">
          <Link 
            href="/" 
            className="text-caption text-text-secondary hover:text-primary"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
} 