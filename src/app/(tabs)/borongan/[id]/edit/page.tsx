'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { getBoronganDetail, updateBorongan, type BoronganDetail, type BoronganItem } from '@/lib/boronganService';

export default function EditBoronganPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [borongan, setBorongan] = useState<BoronganDetail | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_quantity: '',
    price_per_unit: '',
    original_price_per_unit: '',
    deadline: '',
    status: 'active' as 'active' | 'completed' | 'cancelled'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadBorongan = async () => {
      try {
        setInitialLoading(true);
        const data = await getBoronganDetail(id);
        if (data) {
          setBorongan(data);
          
          // Populate form with existing data
          setFormData({
            title: data.title,
            description: data.description,
            target_quantity: data.target_quantity.toString(),
            price_per_unit: data.price_per_unit.toString(),
            original_price_per_unit: data.original_price_per_unit?.toString() || data.price_per_unit.toString(),
            deadline: data.deadline.split('T')[0], // Format for date input
            status: data.status
          });
        }
      } catch (error) {
        console.error('Error loading borongan:', error);
        alert('Gagal memuat data borongan');
        router.push('/borongan');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadBorongan();
    }
  }, [id, router]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Nama produk harus diisi';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Deskripsi harus diisi';
        }
        break;
      case 2:
        if (!formData.target_quantity || parseInt(formData.target_quantity) <= 0) {
          newErrors.target_quantity = 'Target kuantitas harus lebih dari 0';
        }
        if (!formData.price_per_unit || parseFloat(formData.price_per_unit) <= 0) {
          newErrors.price_per_unit = 'Harga per unit harus lebih dari 0';
        }
        if (!formData.original_price_per_unit || parseFloat(formData.original_price_per_unit) <= 0) {
          newErrors.original_price_per_unit = 'Harga asli harus lebih dari 0';
        }
        if (parseFloat(formData.price_per_unit) >= parseFloat(formData.original_price_per_unit)) {
          newErrors.price_per_unit = 'Harga borongan harus lebih murah dari harga asli';
        }
        break;
      case 3:
        if (!formData.deadline) {
          newErrors.deadline = 'Batas waktu harus diisi';
        } else {
          const deadlineDate = new Date(formData.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (deadlineDate <= today) {
            newErrors.deadline = 'Batas waktu harus di masa depan';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setLoading(true);
      
      const boronganData: Partial<BoronganItem> = {
        title: formData.title,
        description: formData.description,
        target_quantity: parseInt(formData.target_quantity),
        price_per_unit: parseFloat(formData.price_per_unit),
        original_price_per_unit: parseFloat(formData.original_price_per_unit),
        deadline: formData.deadline,
        status: formData.status
      };

      await updateBorongan(id, boronganData);
      
      alert(`Borongan "${formData.title}" berhasil diperbarui!`);
      router.push(`/borongan/${id}`);
    } catch (error: any) {
      console.error('Error updating borongan:', error);
      if (error.message) {
        alert(`Gagal memperbarui borongan: ${error.message}`);
      } else {
        alert('Gagal memperbarui borongan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Memuat data borongan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!borongan) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <p className="text-text-secondary">Borongan tidak ditemukan</p>
            <Button 
              onClick={() => router.push('/borongan')}
              className="mt-4"
            >
              Kembali ke Borongan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Info Produk', active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: 'Harga & Target', active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, title: 'Deadline', active: currentStep === 3, completed: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              onClick={() => router.back()}
              className="p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div>
              <h1 className="text-h3 font-semibold text-text-primary">Edit Borongan</h1>
              <p className="text-body-small text-text-secondary">Perbarui informasi borongan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.completed 
                        ? 'bg-success text-white' 
                        : step.active 
                        ? 'bg-primary text-white' 
                        : 'bg-surface border border-border text-text-secondary'
                      }
                    `}
                  >
                    {step.completed ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${step.active ? 'text-primary font-medium' : 'text-text-secondary'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step.completed ? 'bg-success' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-h4 font-semibold text-text-primary">Informasi Produk</h2>
            
            <div>
              <input
                type="text"
                placeholder="Nama produk (contoh: Beras Premium 5kg)"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.title ? 'border-error' : 'border-border'}`}
              />
              {errors.title && (
                <p className="text-error text-body-small mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Deskripsi produk yang akan di-borongan..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent resize-none
                  ${errors.description ? 'border-error' : 'border-border'}`}
                rows={4}
              />
              {errors.description && (
                <p className="text-error text-body-small mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-h4 font-semibold text-text-primary">Harga & Target</h2>
            
            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Target Kuantitas
              </label>
              <input
                type="number"
                placeholder="Jumlah minimal peserta"
                value={formData.target_quantity}
                onChange={(e) => handleInputChange('target_quantity', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.target_quantity ? 'border-error' : 'border-border'}`}
              />
              {errors.target_quantity && (
                <p className="text-error text-body-small mt-1">{errors.target_quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Harga Borongan per Unit
              </label>
              <input
                type="number"
                placeholder="Harga setelah diskon borongan"
                value={formData.price_per_unit}
                onChange={(e) => handleInputChange('price_per_unit', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.price_per_unit ? 'border-error' : 'border-border'}`}
              />
              {errors.price_per_unit && (
                <p className="text-error text-body-small mt-1">{errors.price_per_unit}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Harga Normal per Unit
              </label>
              <input
                type="number"
                placeholder="Harga sebelum diskon borongan"
                value={formData.original_price_per_unit}
                onChange={(e) => handleInputChange('original_price_per_unit', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.original_price_per_unit ? 'border-error' : 'border-border'}`}
              />
              {errors.original_price_per_unit && (
                <p className="text-error text-body-small mt-1">{errors.original_price_per_unit}</p>
              )}
            </div>

            {formData.price_per_unit && formData.original_price_per_unit && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <p className="text-body-small text-success font-medium">
                  Hemat: Rp {(parseFloat(formData.original_price_per_unit) - parseFloat(formData.price_per_unit)).toLocaleString()} per unit
                </p>
                <p className="text-body-small text-success">
                  Diskon: {(((parseFloat(formData.original_price_per_unit) - parseFloat(formData.price_per_unit)) / parseFloat(formData.original_price_per_unit)) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-h4 font-semibold text-text-primary">Batas Waktu</h2>
            
            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Batas Waktu Borongan
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.deadline ? 'border-error' : 'border-border'}`}
              />
              {errors.deadline && (
                <p className="text-error text-body-small mt-1">{errors.deadline}</p>
              )}
              <p className="text-body-small text-text-secondary mt-1">
                Tentukan kapan borongan ini akan berakhir
              </p>
            </div>

            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-3 border border-border rounded-input bg-white text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {/* Summary */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-body-regular font-medium text-text-primary mb-3">Ringkasan</h3>
              <div className="space-y-2 text-body-small">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Produk:</span>
                  <span className="text-text-primary font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Target:</span>
                  <span className="text-text-primary">{formData.target_quantity} unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Harga:</span>
                  <span className="text-text-primary">Rp {parseFloat(formData.price_per_unit || '0').toLocaleString()}/unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Deadline:</span>
                  <span className="text-text-primary">{formData.deadline ? new Date(formData.deadline).toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex-1"
            >
              Sebelumnya
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              className="flex-1"
            >
              Perbarui Borongan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 