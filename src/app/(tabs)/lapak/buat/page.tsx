'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Camera, MapPin, Package, DollarSign, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { ToastContainer, useToast } from '@/components/Toast';
import { AIInsights } from '@/components/AIInsights';
import { PriceRecommendation } from '@/components/PriceRecommendation';
import { cn } from '@/lib/utils';

// Category options
const CATEGORIES = [
  { id: 'makanan', label: 'Makanan', icon: '🍽️' },
  { id: 'minuman', label: 'Minuman', icon: '🥤' },
  { id: 'sayuran', label: 'Sayuran', icon: '🥬' },
  { id: 'buah', label: 'Buah', icon: '🍎' },
  { id: 'produk-kebun', label: 'Produk Kebun', icon: '🌱' },
  { id: 'kue', label: 'Kue & Jajanan', icon: '🧁' },
  { id: 'lainnya', label: 'Lainnya', icon: '📦' }
];

interface FormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  location: string;
}

export default function BukaLapakPage() {
  const router = useRouter();
  const toast = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    location: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleInputChange('category', categoryId);
  };

  // Generate AI description
  const handleGenerateAIDescription = async () => {
    if (images.length === 0) {
      toast.warning('Foto Diperlukan', 'Mohon unggah setidaknya satu foto produk terlebih dahulu');
      return;
    }

    if (!formData.title.trim()) {
      toast.warning('Nama Produk Diperlukan', 'Mohon isi nama produk terlebih dahulu untuk hasil AI yang lebih akurat');
      return;
    }

    setIsGeneratingDescription(true);
    toast.info('Menganalisis Produk', 'AI sedang menganalisis foto dan membuat deskripsi menarik...');

    try {
      // TODO: Implement actual AI analysis API call
      // For now, simulate with mock response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDescription = `${formData.title} segar dan berkualitas tinggi, dibuat dengan bahan-bahan pilihan terbaik. Produk ini sangat cocok untuk kebutuhan sehari-hari dan telah terjamin kualitasnya. Tersedia dalam kondisi segar dan siap konsumsi. Dijual langsung oleh penjual terpercaya di lingkungan sekitar Anda.`;
      
      setFormData(prev => ({ ...prev, description: mockDescription }));
      toast.success('Deskripsi AI Berhasil!', 'Deskripsi produk telah dibuat otomatis. Anda bisa mengeditnya sesuai kebutuhan.');
    } catch (error) {
      console.error('Error generating AI description:', error);
      toast.error('Gagal Membuat Deskripsi', 'Terjadi kesalahan saat menganalisis dengan AI. Silakan coba lagi.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Handle AI insight clicks
  const handleInsightClick = (insight: any) => {
    toast.info(insight.title, insight.description);
  };

  // Handle price recommendation selection
  const handlePriceSelect = (price: number) => {
    setFormData(prev => ({ ...prev, price: price.toString() }));
    toast.success('Harga Dipilih', `Harga produk diubah menjadi ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)}`);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Nama produk wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi produk wajib diisi';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Harga wajib diisi';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Harga harus berupa angka yang valid';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stok wajib diisi';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) <= 0) {
      newErrors.stock = 'Stok harus berupa angka yang valid';
    }

    if (!selectedCategory) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi';
    }

    if (images.length === 0) {
      toast.warning('Foto Produk Diperlukan', 'Mohon unggah setidaknya satu foto produk untuk melanjutkan');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    toast.info('Menyimpan Produk', 'Sedang menambahkan produk ke lapak Anda...');

    try {
      // TODO: Implement actual API call to create lapak
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Produk Berhasil Ditambahkan!', 'Produk Anda telah tersedia di lapak dan dapat dilihat oleh tetangga.');
      
      // Delay before navigation to show success message
      setTimeout(() => {
        router.push('/lapak');
      }, 1500);
    } catch (error) {
      console.error('Error creating lapak:', error);
      toast.error('Gagal Menambahkan Produk', 'Terjadi kesalahan saat menyimpan. Silakan periksa koneksi dan coba lagi.');
    } finally {
      setIsSubmitting(false);
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
                Buka Lapak
              </h1>
              <p className="text-caption text-text-secondary">
                Tambahkan produk baru ke lapak Anda
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="page-padding py-4u">
        <form onSubmit={handleSubmit} className="space-y-6u max-w-2xl mx-auto">
          {/* Image Upload Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-3u">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Foto Produk</h2>
            </div>
            <ImageUploader
              onImagesChange={setImages}
              maxImages={5}
              disabled={isSubmitting}
            />
          </div>

          {/* AI Insights Section */}
          {images.length > 0 && (
            <AIInsights
              images={images}
              productName={formData.title}
              description={formData.description}
              onInsightClick={handleInsightClick}
            />
          )}

          {/* Product Details Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-4u">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Detail Produk</h2>
            </div>

            <div className="space-y-4u">
              {/* Product Name */}
              <div>
                <label className="block text-body-large font-medium text-text-primary mb-2u">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={cn(
                    'input-field',
                    errors.title && 'input-error'
                  )}
                  placeholder="Contoh: Sayur Bayam Segar"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-caption text-error mt-1u">{errors.title}</p>
                )}
              </div>

              {/* Description with AI Feature */}
              <div>
                <div className="flex items-center justify-between mb-2u">
                  <label className="text-body-large font-medium text-text-primary">
                    Deskripsi *
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={handleGenerateAIDescription}
                    disabled={isGeneratingDescription || isSubmitting}
                    className={cn(
                      'flex items-center gap-1u transition-all duration-200',
                      isGeneratingDescription 
                        ? 'text-accent animate-pulse' 
                        : 'text-primary hover:text-primary-hover'
                    )}
                  >
                    <Sparkles className={cn(
                      'h-4 w-4',
                      isGeneratingDescription && 'animate-spin'
                    )} />
                    {isGeneratingDescription ? 'Membuat...' : 'Buat dengan AI'}
                  </Button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={cn(
                    'input-field min-h-24',
                    errors.description && 'input-error'
                  )}
                  placeholder="Deskripsikan produk Anda dengan detail..."
                  rows={4}
                  disabled={isSubmitting || isGeneratingDescription}
                />
                {errors.description && (
                  <p className="text-caption text-error mt-1u">{errors.description}</p>
                )}
                <p className="text-caption text-text-secondary mt-1u">
                  ✨ Gunakan fitur AI untuk membuat deskripsi menarik berdasarkan foto produk
                </p>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4u">
                <div>
                  <label className="block text-body-large font-medium text-text-primary mb-2u">
                    <DollarSign className="h-4 w-4 inline mr-1u" />
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={cn(
                      'input-field',
                      errors.price && 'input-error'
                    )}
                    placeholder="15000"
                    min="0"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-caption text-error mt-1u">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-body-large font-medium text-text-primary mb-2u">
                    Stok *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={cn(
                      'input-field',
                      errors.stock && 'input-error'
                    )}
                    placeholder="10"
                    min="1"
                    disabled={isSubmitting}
                  />
                  {errors.stock && (
                    <p className="text-caption text-error mt-1u">{errors.stock}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Price Recommendation Section */}
          {formData.title && selectedCategory && (
            <PriceRecommendation
              productName={formData.title}
              category={selectedCategory}
              description={formData.description}
              currentPrice={formData.price}
              onPriceSelect={handlePriceSelect}
            />
          )}

          {/* Category Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-4u">
              <Tag className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Kategori</h2>
            </div>

            <div className="flex flex-wrap gap-2u">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={isSubmitting}
                  className={cn(
                    'flex items-center gap-2u px-3u py-2u rounded-button border transition-all duration-200',
                    'hover:border-primary hover:bg-primary/5',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    selectedCategory === category.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface text-text-secondary'
                  )}
                >
                  <span>{category.icon}</span>
                  <span className="text-body-small">{category.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-caption text-error mt-2u">{errors.category}</p>
            )}
          </div>

          {/* Location Section */}
          <div className="card p-4u">
            <div className="flex items-center gap-2u mb-3u">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-heading-2 font-semibold">Lokasi</h2>
            </div>

            <div>
              <label className="block text-body-large font-medium text-text-primary mb-2u">
                Alamat/Lokasi Pickup *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={cn(
                  'input-field',
                  errors.location && 'input-error'
                )}
                placeholder="Contoh: Jl. Kenangan No. 15, RT 02/RW 05"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="text-caption text-error mt-1u">{errors.location}</p>
              )}
              <p className="text-caption text-text-secondary mt-1u">
                Berikan alamat yang jelas agar pembeli mudah menemukan lokasi Anda
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3u">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Menyimpan...' : 'Tambah ke Lapak'}
            </Button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </div>
  );
} 