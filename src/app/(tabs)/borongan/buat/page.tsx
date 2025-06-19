'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin, Users, Package, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ClientOnly } from '@/components/ClientOnly';
import { createBorongan } from '@/lib/boronganService';

interface BoronganForm {
  title: string;
  description: string;
  product_type: string;
  target_quantity: number;
  unit: string;
  target_price: number;
  original_price: number;
  deadline: string;
  location: string;
  pickup_location: string;
  min_participants: number;
  max_participants: number;
  terms_conditions: string[];
}

const PRODUCT_TYPES = [
  { id: 'makanan-pokok', label: 'Makanan Pokok', icon: '🍚' },
  { id: 'sayuran-buah', label: 'Sayuran & Buah', icon: '🥬' },
  { id: 'daging-ikan', label: 'Daging & Ikan', icon: '🐟' },
  { id: 'bumbu-rempah', label: 'Bumbu & Rempah', icon: '🌶️' },
  { id: 'minuman', label: 'Minuman', icon: '🥤' },
  { id: 'snack', label: 'Snack & Camilan', icon: '🍪' },
  { id: 'lainnya', label: 'Lainnya', icon: '📦' }
];

const UNITS = [
  'kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'box', 'karton'
];

function MultiStepForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BoronganForm>({
    title: '',
    description: '',
    product_type: '',
    target_quantity: 10,
    unit: 'kg',
    target_price: 0,
    original_price: 0,
    deadline: '',
    location: '',
    pickup_location: '',
    min_participants: 5,
    max_participants: 50,
    terms_conditions: [
      'Pembayaran dilakukan di muka saat bergabung',
      'Barang dapat diambil setelah target tercapai',
      'Batas waktu pengambilan 3 hari setelah notifikasi'
    ]
  });

  const handleInputChange = (field: keyof BoronganForm, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare borongan data for API
      const boronganData = {
        title: formData.title,
        description: formData.description,
        target_quantity: formData.target_quantity,
        price_per_unit: formData.target_price,
        original_price_per_unit: formData.original_price > 0 ? formData.original_price : undefined,
        deadline: formData.deadline,
        status: 'active' as const,
        created_by: 'current-user-id' // TODO: Get from auth store
      };
      
      // Create borongan using service
      const newBorongan = await createBorongan(boronganData);
      
      alert(`Borongan "${newBorongan.title}" berhasil dibuat!`);
      router.push('/borongan');
    } catch (error) {
      console.error('Error creating borongan:', error);
      alert(error instanceof Error ? error.message : 'Gagal membuat borongan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.length >= 5 && formData.description.length >= 10 && formData.product_type !== '';
      case 2:
        return formData.target_quantity > 0 && formData.target_price > 0 && formData.unit !== '';
      case 3:
        return formData.deadline !== '' && formData.location !== '' && formData.pickup_location !== '';
      case 4:
        return formData.min_participants > 0 && formData.max_participants >= formData.min_participants;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addTermCondition = () => {
    setFormData(prev => ({
      ...prev,
      terms_conditions: [...prev.terms_conditions, '']
    }));
  };

  const updateTermCondition = (index: number, value: string) => {
    const newTerms = [...formData.terms_conditions];
    newTerms[index] = value;
    setFormData(prev => ({ ...prev, terms_conditions: newTerms }));
  };

  const removeTermCondition = (index: number) => {
    const newTerms = formData.terms_conditions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, terms_conditions: newTerms }));
  };

  const renderStep1 = () => (
    <div className="space-y-6u">
      <div className="text-center mb-6u">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3u">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-heading-1 font-bold text-text-primary mb-2u">
          Info Produk
        </h2>
        <p className="text-body-small text-text-secondary">
          Ceritakan tentang produk yang ingin dibeli bersama
        </p>
      </div>

      <div className="space-y-4u">
        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Nama Produk *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Contoh: Beras Premium Organik 25kg"
            className="input-field"
            required
          />
          <p className="text-caption text-text-secondary mt-1u">
            Minimal 5 karakter
          </p>
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Kategori Produk *
          </label>
          <div className="grid grid-cols-2 gap-2u">
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleInputChange('product_type', type.id)}
                className={`p-3u rounded-button border-2 transition-all duration-200 ${
                  formData.product_type === type.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background text-text-secondary hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1u">{type.icon}</div>
                  <div className="text-caption font-medium">{type.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Deskripsi Produk *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Jelaskan detail produk: kualitas, asal, keunggulan, dll."
            rows={4}
            className="input-field resize-none"
            required
          />
          <p className="text-caption text-text-secondary mt-1u">
            Minimal 10 karakter ({formData.description.length}/10)
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6u">
      <div className="text-center mb-6u">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3u">
          <Target className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-heading-1 font-bold text-text-primary mb-2u">
          Target & Harga
        </h2>
        <p className="text-body-small text-text-secondary">
          Tentukan jumlah dan harga yang diinginkan
        </p>
      </div>

      <div className="space-y-4u">
        <div className="grid grid-cols-2 gap-3u">
          <div>
            <label className="block text-label font-medium text-text-primary mb-2u">
              Target Kuantitas *
            </label>
            <input
              type="number"
              value={formData.target_quantity}
              onChange={(e) => handleInputChange('target_quantity', parseInt(e.target.value) || 0)}
              min="1"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-label font-medium text-text-primary mb-2u">
              Satuan *
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="input-field"
              required
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Harga Target per {formData.unit} *
          </label>
          <input
            type="number"
            value={formData.target_price}
            onChange={(e) => handleInputChange('target_price', parseInt(e.target.value) || 0)}
            min="0"
            placeholder="Harga yang diinginkan"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Harga Normal per {formData.unit} (Opsional)
          </label>
          <input
            type="number"
            value={formData.original_price}
            onChange={(e) => handleInputChange('original_price', parseInt(e.target.value) || 0)}
            min="0"
            placeholder="Harga normal di pasaran"
            className="input-field"
          />
          <p className="text-caption text-text-secondary mt-1u">
            Untuk menunjukkan potensi penghematan
          </p>
        </div>

        {formData.target_price > 0 && formData.original_price > formData.target_price && (
          <div className="bg-success/10 rounded-button p-3u">
            <div className="flex items-center gap-2u">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success">💰</span>
              </div>
              <div>
                <p className="text-label font-medium text-success">
                  Potensi Hemat: Rp {(formData.original_price - formData.target_price).toLocaleString()}
                </p>
                <p className="text-caption text-text-secondary">
                  Per {formData.unit} dibanding harga normal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6u">
      <div className="text-center mb-6u">
        <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3u">
          <MapPin className="w-8 h-8 text-info" />
        </div>
        <h2 className="text-heading-1 font-bold text-text-primary mb-2u">
          Waktu & Lokasi
        </h2>
        <p className="text-body-small text-text-secondary">
          Tentukan batas waktu dan lokasi pengambilan
        </p>
      </div>

      <div className="space-y-4u">
        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Batas Waktu Borongan *
          </label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="input-field"
            required
          />
          <p className="text-caption text-text-secondary mt-1u">
            Waktu maksimal untuk mencapai target
          </p>
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Area/Wilayah *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Contoh: Jakarta Selatan, Kemang"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Lokasi Pengambilan *
          </label>
          <textarea
            value={formData.pickup_location}
            onChange={(e) => handleInputChange('pickup_location', e.target.value)}
            placeholder="Alamat lengkap tempat pengambilan barang"
            rows={3}
            className="input-field resize-none"
            required
          />
        </div>

        {formData.deadline && (
          <div className="bg-warning/10 rounded-button p-3u">
            <div className="flex items-center gap-2u">
              <Calendar className="w-5 h-5 text-warning" />
              <div>
                <p className="text-label font-medium text-warning">
                  Batas Waktu: {new Date(formData.deadline).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6u">
      <div className="text-center mb-6u">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3u">
          <Users className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-heading-1 font-bold text-text-primary mb-2u">
          Peserta & Ketentuan
        </h2>
        <p className="text-body-small text-text-secondary">
          Atur jumlah peserta dan syarat ketentuan
        </p>
      </div>

      <div className="space-y-4u">
        <div className="grid grid-cols-2 gap-3u">
          <div>
            <label className="block text-label font-medium text-text-primary mb-2u">
              Min. Peserta *
            </label>
            <input
              type="number"
              value={formData.min_participants}
              onChange={(e) => handleInputChange('min_participants', parseInt(e.target.value) || 0)}
              min="1"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-label font-medium text-text-primary mb-2u">
              Maks. Peserta *
            </label>
            <input
              type="number"
              value={formData.max_participants}
              onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 0)}
              min={formData.min_participants}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-label font-medium text-text-primary mb-2u">
            Syarat & Ketentuan
          </label>
          <div className="space-y-2u">
            {formData.terms_conditions.map((term, index) => (
              <div key={index} className="flex gap-2u">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => updateTermCondition(index, e.target.value)}
                  placeholder="Masukkan syarat atau ketentuan"
                  className="input-field flex-1"
                />
                {formData.terms_conditions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTermCondition(index)}
                    className="px-3u py-2u text-error hover:bg-error/10 rounded-button transition-colors duration-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTermCondition}
              className="text-primary hover:bg-primary/10 px-3u py-2u rounded-button transition-colors duration-200 text-sm"
            >
              + Tambah Ketentuan
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-card p-4u">
          <h3 className="text-heading-2 font-semibold mb-3u">Ringkasan Borongan</h3>
          <div className="space-y-2u text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Produk:</span>
              <span className="font-medium">{formData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Target:</span>
              <span className="font-medium">{formData.target_quantity} {formData.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Harga:</span>
              <span className="font-medium">Rp {formData.target_price.toLocaleString()}/{formData.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Peserta:</span>
              <span className="font-medium">{formData.min_participants}-{formData.max_participants} orang</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Lokasi:</span>
              <span className="font-medium">{formData.location}</span>
            </div>
            {formData.original_price > formData.target_price && (
              <div className="flex justify-between text-success">
                <span>Hemat:</span>
                <span className="font-medium">Rp {(formData.original_price - formData.target_price).toLocaleString()}/{formData.unit}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="page-padding py-4u">
          <div className="flex items-center gap-3u">
            <button
              onClick={() => currentStep === 1 ? router.back() : prevStep()}
              className="p-2u hover:bg-primary/10 rounded-button transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div className="flex-1">
              <h1 className="text-heading-1 font-bold text-primary">
                Buat Borongan Baru
              </h1>
              <p className="text-body-small text-text-secondary">
                Langkah {currentStep} dari 4
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-surface border-b border-border">
        <div className="page-padding py-3u">
          <div className="flex items-center gap-2u">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step < currentStep
                    ? 'bg-success text-white'
                    : step === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-border text-text-secondary'
                }`}>
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-4u h-1 mx-2u rounded transition-colors duration-200 ${
                    step < currentStep ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="page-padding py-6u">
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex gap-3u mt-8u">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary flex-1 flex items-center justify-center gap-2u"
              >
                <ArrowLeft className="w-4 h-4" />
                Sebelumnya
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="btn-primary flex-1 flex items-center justify-center gap-2u disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2u disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Buat Borongan
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BuatBoronganPage() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  // Redirect if not authenticated
  if (isHydrated && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center page-padding">
        <div className="card p-6u text-center max-w-md">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4u">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-heading-2 mb-2u">Login Diperlukan</h2>
          <p className="text-body-small text-text-secondary mb-4u">
            Anda perlu login untuk membuat borongan bareng
          </p>
          <div className="flex flex-col gap-2u">
            <Link href="/login">
              <button className="btn-primary w-full">
                Masuk ke Akun
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-secondary w-full">
                Daftar Akun Baru
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="page-padding py-4u">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded mb-4u"></div>
            <div className="space-y-4u">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-border rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <MultiStepForm />
    </ClientOnly>
  );
} 