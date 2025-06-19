'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Camera, 
  Eye,
  Star,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'suggestion';
  category: 'quality' | 'visibility' | 'appeal' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
}

interface AIInsightsProps {
  images: File[];
  productName?: string;
  description?: string;
  onInsightClick?: (insight: AIInsight) => void;
}

// Mock AI analysis function
const analyzeImages = async (images: File[], productName?: string): Promise<AIInsight[]> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const insights: AIInsight[] = [];
  const imageCount = images.length;
  const hasProductName = productName && productName.trim().length > 0;
  
  // Generate insights based on image count and product name availability
  if (imageCount === 0) {
    insights.push({
      id: 'no-images',
      type: 'warning',
      category: 'visibility',
      title: 'Foto Produk Diperlukan',
      description: 'Tambahkan foto untuk mendapatkan analisis AI yang komprehensif',
      confidence: 100,
      actionable: true
    });
    return insights;
  }

  // Basic image quality insights (always available)
  insights.push({
    id: 'image-quality',
    type: 'success',
    category: 'quality',
    title: 'Kualitas Foto Baik',
    description: `${imageCount} foto terunggah dengan kualitas yang memadai untuk menampilkan produk`,
    confidence: 85,
    actionable: false
  });

  // Image count based insights
  if (imageCount === 1) {
    insights.push({
      id: 'more-angles',
      type: 'suggestion',
      category: 'visibility',
      title: 'Tambahkan Sudut Pandang Lain',
      description: 'Foto dari berbagai sudut dapat meningkatkan kepercayaan pembeli hingga 40%',
      confidence: 90,
      actionable: true
    });
  } else if (imageCount >= 2) {
    insights.push({
      id: 'good-coverage',
      type: 'success',
      category: 'visibility',
      title: 'Cakupan Visual Lengkap',
      description: `${imageCount} foto memberikan gambaran produk yang komprehensif`,
      confidence: 95,
      actionable: false
    });
  }

  if (!hasProductName) {
    // Generic insights when product name is not available
    insights.push({
      id: 'generic-appeal',
      type: 'info',
      category: 'appeal',
      title: 'Siap untuk Analisis Mendalam',
      description: 'Tambahkan nama produk untuk mendapatkan rekomendasi yang lebih spesifik dan personal',
      confidence: 80,
      actionable: true
    });

    insights.push({
      id: 'generic-optimization',
      type: 'suggestion',
      category: 'optimization',
      title: 'Potensi Optimisasi Tersedia',
      description: 'Dengan informasi produk lengkap, AI dapat memberikan saran optimisasi yang lebih baik',
      confidence: 75,
      actionable: true
    });
  } else {
    // Product name specific insights
    const nameWords = productName.toLowerCase().split(' ');
    
    // Analyze product characteristics
    const isOrganic = nameWords.some(word => ['organik', 'organic', 'alami', 'natural'].includes(word));
    const isFresh = nameWords.some(word => ['segar', 'fresh', 'baru'].includes(word));
    const isPremium = nameWords.some(word => ['premium', 'super', 'grade', 'kualitas'].includes(word));
    const isHomemade = nameWords.some(word => ['rumahan', 'buatan', 'homemade', 'tradisional'].includes(word));
    const isLarge = nameWords.some(word => ['besar', 'jumbo', 'large', 'xl'].includes(word));
    
    // Product type detection
    const isRice = nameWords.some(word => ['beras', 'rice'].includes(word));
    const isVegetable = nameWords.some(word => ['sayur', 'vegetable', 'kangkung', 'bayam', 'sawi', 'cabai', 'tomat'].includes(word));
    const isFruit = nameWords.some(word => ['buah', 'fruit', 'apel', 'jeruk', 'pisang', 'mangga', 'anggur'].includes(word));
    const isDrink = nameWords.some(word => ['jus', 'juice', 'minuman', 'drink', 'kopi', 'teh'].includes(word));
    const isCake = nameWords.some(word => ['kue', 'cake', 'roti', 'cookies'].includes(word));
    const isSpice = nameWords.some(word => ['bumbu', 'rempah', 'garam', 'gula', 'merica'].includes(word));

    // Product-specific appeal insights
    if (isFresh || isVegetable || isFruit) {
      insights.push({
        id: 'freshness-appeal',
        type: 'success',
        category: 'appeal',
        title: 'Emphasize Kesegaran',
        description: 'Produk segar memiliki daya tarik tinggi. Pastikan foto menunjukkan kondisi produk yang prima',
        confidence: 95,
        actionable: true
      });
    } else if (isCake || nameWords.some(word => ['kue', 'makanan'].includes(word))) {
      insights.push({
        id: 'food-appeal',
        type: 'suggestion',
        category: 'appeal',
        title: 'Tingkatkan Food Appeal',
        description: 'Foto makanan dengan pencahayaan yang baik dapat meningkatkan minat beli hingga 60%',
        confidence: 88,
        actionable: true
      });
    } else if (isDrink) {
      insights.push({
        id: 'drink-appeal',
        type: 'suggestion',
        category: 'appeal',
        title: 'Tampilkan Kesegaran Minuman',
        description: 'Foto dengan efek segar (condensation, es) membuat minuman terlihat lebih menarik',
        confidence: 85,
        actionable: true
      });
    }

    // Characteristic-based insights
    if (isOrganic) {
      insights.push({
        id: 'organic-highlight',
        type: 'success',
        category: 'appeal',
        title: 'Highlight Aspek Organik',
        description: 'Produk organik memiliki nilai premium. Tekankan sertifikasi dan kealamian produk',
        confidence: 92,
        actionable: true
      });
    }

    if (isHomemade) {
      insights.push({
        id: 'homemade-appeal',
        type: 'success',
        category: 'appeal',
        title: 'Autentisitas Rumahan',
        description: 'Produk rumahan memiliki daya tarik personal. Ceritakan proses pembuatan yang unik',
        confidence: 88,
        actionable: true
      });
    }

    if (isPremium) {
      insights.push({
        id: 'premium-positioning',
        type: 'info',
        category: 'optimization',
        title: 'Posisi Premium Detected',
        description: 'Produk premium memerlukan presentasi yang berkelas. Fokus pada kualitas dan eksklusivitas',
        confidence: 90,
        actionable: true
      });
    }

    // Optimization insights
    if (imageCount >= 2) {
      insights.push({
        id: 'market-potential',
        type: 'success',
        category: 'optimization',
        title: 'Potensi Pasar Tinggi',
        description: 'Dengan foto berkualitas dan informasi lengkap, produk ini memiliki potensi penjualan yang baik',
        confidence: 87,
        actionable: false
      });
    }
  }

  // Actionable recommendations
  if (imageCount < 3) {
    insights.push({
      id: 'add-detail-shots',
      type: 'suggestion',
      category: 'visibility',
      title: 'Tambahkan Foto Detail',
      description: 'Foto close-up, kemasan, dan detail produk dapat meningkatkan konversi penjualan',
      confidence: 83,
      actionable: true
    });
  }

  return insights;
};

export function AIInsights({ images, productName, description, onInsightClick }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      setIsAnalyzing(true);
      setIsVisible(true);
      
      analyzeImages(images, productName).then(results => {
        setInsights(results);
        setIsAnalyzing(false);
      });
    } else {
      setInsights([]);
      setIsVisible(false);
    }
  }, [images, productName]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      case 'suggestion': return TrendingUp;
      default: return Info;
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'quality': return Star;
      case 'visibility': return Eye;
      case 'appeal': return Target;
      case 'optimization': return TrendingUp;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      case 'suggestion': return 'text-primary';
      default: return 'text-text-secondary';
    }
  };

  const getTypeBgColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return 'bg-success/10 border-success/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'info': return 'bg-info/10 border-info/20';
      case 'suggestion': return 'bg-primary/10 border-primary/20';
      default: return 'bg-surface border-border';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-surface rounded-card shadow-card p-4u space-y-4u">
      {/* Header */}
      <div className="flex items-center gap-2u">
        <div className="flex items-center gap-2u">
          <Sparkles className={cn(
            'h-5 w-5 text-primary',
            isAnalyzing && 'animate-pulse'
          )} />
          <h3 className="text-heading-2 font-semibold text-primary">
            AI Insights
          </h3>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center gap-2u text-sm text-text-secondary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Menganalisis...
          </div>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="space-y-3u">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3u p-3u bg-surface-secondary rounded-button">
                <div className="w-5 h-5 bg-border rounded"></div>
                <div className="flex-1 space-y-2u">
                  <div className="h-4 bg-border rounded w-3/4"></div>
                  <div className="h-3 bg-border rounded w-full"></div>
                </div>
                <div className="w-8 h-4 bg-border rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights List */}
      {!isAnalyzing && insights.length > 0 && (
        <div className="space-y-3u">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const CategoryIcon = getCategoryIcon(insight.category);
            
            return (
              <div
                key={insight.id}
                className={cn(
                  'border rounded-button p-3u transition-colors cursor-pointer hover:shadow-sm',
                  getTypeBgColor(insight.type),
                  insight.actionable && 'hover:border-primary/40'
                )}
                onClick={() => insight.actionable && onInsightClick?.(insight)}
              >
                <div className="flex items-start gap-3u">
                  {/* Icon */}
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full',
                    insight.type === 'success' && 'bg-success/20',
                    insight.type === 'warning' && 'bg-warning/20',
                    insight.type === 'info' && 'bg-info/20',
                    insight.type === 'suggestion' && 'bg-primary/20'
                  )}>
                    <Icon className={cn('w-4 h-4', getTypeColor(insight.type))} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2u mb-1u">
                      <CategoryIcon className="w-4 h-4 text-text-secondary" />
                      <h4 className="text-sm font-medium text-text-primary">
                        {insight.title}
                      </h4>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <div className="mt-2u">
                        <span className="text-xs text-primary font-medium">
                          Klik untuk melihat saran →
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confidence */}
                  <div className="flex items-center gap-1u">
                    <div className="text-xs text-text-secondary">
                      {insight.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isAnalyzing && insights.length === 0 && images.length > 0 && (
        <div className="text-center py-6u">
          <Camera className="w-8 h-8 text-text-secondary mx-auto mb-2u" />
          <p className="text-sm text-text-secondary">
            Tidak ada insight yang tersedia untuk saat ini
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {!isAnalyzing && insights.length > 0 && (
        <div className="border-t border-border pt-3u">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4u">
              <span>{insights.length} insight ditemukan</span>
              <span>{insights.filter(i => i.actionable).length} dapat ditindaklanjuti</span>
            </div>
            <div className="flex items-center gap-1u">
              <Sparkles className="w-3 h-3" />
              <span>AI Analysis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 