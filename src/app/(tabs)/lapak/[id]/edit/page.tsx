'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { getLapakDetail, updateLapak } from '@/lib/lapakService';
import { Lapak, LapakCreate } from '@/lib/types';

export default function EditLapakPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [lapak, setLapak] = useState<Lapak | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: '',
    stock_quantity: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadLapak = async () => {
      try {
        setInitialLoading(true);
        const data = await getLapakDetail(id);
        if (data) {
          setLapak(data);
          
          // Populate form with existing data
          setFormData({
            title: data.title,
            description: data.description,
            price: data.price.toString(),
            unit: data.unit,
            stock_quantity: data.stock_quantity.toString()
          });
        }
      } catch (error) {
        console.error('Error loading lapak:', error);
        alert('Gagal memuat data lapak');
        router.push('/lapak');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadLapak();
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
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'Harga harus lebih dari 0';
        }
        if (!formData.unit.trim()) {
          newErrors.unit = 'Satuan harus diisi';
        }
        if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
          newErrors.stock_quantity = 'Stok tidak boleh negatif';
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
    if (!validateStep(2)) return;

    try {
      setLoading(true);
      
      const lapakData: Partial<LapakCreate> = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        unit: formData.unit,
        stock_quantity: parseInt(formData.stock_quantity)
      };

      await updateLapak(id, lapakData);
      
      alert(`Lapak "${formData.title}" berhasil diperbarui!`);
      router.push(`/lapak/${id}`);
    } catch (error: any) {
      console.error('Error updating lapak:', error);
      if (error.message) {
        alert(`Gagal memperbarui lapak: ${error.message}`);
      } else {
        alert('Gagal memperbarui lapak. Silakan coba lagi.');
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
            <p className="text-text-secondary">Memuat data lapak...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lapak) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center">
            <p className="text-text-secondary">Lapak tidak ditemukan</p>
            <Button 
              onClick={() => router.push('/lapak')}
              className="mt-4"
            >
              Kembali ke Lapak
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Info Produk', active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, title: 'Harga & Stok', active: currentStep === 2, completed: false }
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
              <h1 className="text-h3 font-semibold text-text-primary">Edit Lapak</h1>
              <p className="text-body-small text-text-secondary">Perbarui informasi lapak</p>
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
                placeholder="Nama produk (contoh: Sayur Bayam Segar)"
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
                placeholder="Deskripsi produk yang dijual..."
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
            <h2 className="text-h4 font-semibold text-text-primary">Harga & Stok</h2>
            
            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Harga per Unit
              </label>
              <input
                type="number"
                placeholder="Harga produk"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.price ? 'border-error' : 'border-border'}`}
              />
              {errors.price && (
                <p className="text-error text-body-small mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Satuan
              </label>
              <input
                type="text"
                placeholder="Satuan (contoh: kg, buah, ikat)"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.unit ? 'border-error' : 'border-border'}`}
              />
              {errors.unit && (
                <p className="text-error text-body-small mt-1">{errors.unit}</p>
              )}
            </div>

            <div>
              <label className="block text-body-small font-medium text-text-primary mb-2">
                Stok Tersedia
              </label>
              <input
                type="number"
                placeholder="Jumlah stok yang tersedia"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                className={`w-full p-3 border rounded-input bg-white text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.stock_quantity ? 'border-error' : 'border-border'}`}
              />
              {errors.stock_quantity && (
                <p className="text-error text-body-small mt-1">{errors.stock_quantity}</p>
              )}
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
                  <span className="text-text-secondary">Harga:</span>
                  <span className="text-text-primary">Rp {parseFloat(formData.price || '0').toLocaleString()}/{formData.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Stok:</span>
                  <span className="text-text-primary">{formData.stock_quantity} {formData.unit}</span>
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
          
          {currentStep < 2 ? (
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
              Perbarui Lapak
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 