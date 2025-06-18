'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ClientOnly } from '@/components/ClientOnly';
import { useAuthStore } from '@/hooks/useAuthStore';
import { loginUser } from '@/lib/authService';
import { isValidEmail } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate individual fields on blur
    if (field === 'email' && formData.email && !isValidEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }));
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
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      // Call login service
      const authResponse = await loginUser(formData.email, formData.password);
      
      console.log('Login successful:', authResponse);
      
      // Use auth store to manage session (client-side only)
      if (typeof window !== 'undefined') {
        const { loginAction } = useAuthStore.getState();
        loginAction(authResponse.user, authResponse.session.access_token);
      }
      
      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      // Handle login error
      setErrors(prev => ({
        ...prev,
        general: error.message || 'Login gagal. Silakan coba lagi.',
      }));
    } finally {
      // Always turn off loading
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center page-padding py-5u">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5u">
          <h1 className="text-heading-1 text-primary mb-1u">
            Masuk ke Warung Warga
          </h1>
          <p className="text-body-small text-text-secondary">
            Selamat datang kembali! Silakan masuk ke akun Anda
          </p>
        </div>

        {/* Login Form */}
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
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              onBlur={() => handleInputBlur('password')}
              error={touched.password ? errors.password : ''}
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
              {isLoading ? 'Sedang Masuk...' : 'Masuk'}
            </Button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center mt-4u">
          <p className="text-body-small text-text-secondary">
            Belum punya akun?{' '}
            <Link 
              href="/register" 
              className="text-primary hover:underline font-medium"
            >
              Daftar di sini
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

        {/* Auth Redirect Handler - Only on Client */}
        <ClientOnly>
          <AuthRedirectHandler />
        </ClientOnly>
      </div>
    </div>
  );
}

// Separate component for handling authentication redirects
function AuthRedirectHandler() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return null;
} 