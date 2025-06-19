'use client';

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  Eye, 
  Palette, 
  Grid, 
  Sun,
  Target,
  TrendingUp,
  Loader2,
  Star,
  Sparkles,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyzeImages as analyzeImagesAPI } from '@/lib/lapakService';
import { EnhancedAnalysisResult, PhotoInsight } from '@/lib/types';

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'suggestion';
  category: 'quality' | 'visibility' | 'appeal' | 'optimization' | 'composition' | 'lighting';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
  photoSpecific?: boolean; // New field to indicate photo-specific insights
}

interface AIInsightsProps {
  images: File[];
  productName?: string;
  description?: string;
  onInsightClick?: (insight: AIInsight) => void;
}

// Convert backend PhotoInsight to frontend AIInsight
const convertPhotoInsight = (backendInsight: PhotoInsight, index: number): AIInsight => {
  return {
    id: `api-${index}`,
    type: backendInsight.type,
    category: backendInsight.category as any,
    title: backendInsight.title,
    description: backendInsight.description,
    confidence: backendInsight.confidence,
    actionable: backendInsight.actionable,
    photoSpecific: true
  };
};

const analyzeImages = async (images: File[], productName?: string): Promise<AIInsight[]> => {
  if (images.length === 0) {
    return [{
      id: 'no-images',
      type: 'warning',
      category: 'visibility',
      title: 'Foto Produk Diperlukan',
      description: 'Tambahkan foto untuk mendapatkan analisis AI yang komprehensif',
      confidence: 100,
      actionable: true
    }];
  }

  try {
    console.log(`🔍 Analyzing ${images.length} photo(s) with consolidated AI API...`);
    const analysisResult = await analyzeImagesAPI(images);

    const insights: AIInsight[] = [];

    // Convert backend insights to frontend format
    analysisResult.insights.forEach((insight, index) => {
      insights.push(convertPhotoInsight(insight, index));
    });

    // Add quality score insights
    const qualityScore = analysisResult.photo_quality.overall_score;
    if (qualityScore > 85) {
      insights.unshift({
        id: 'quality-excellent',
        type: 'success',
        category: 'quality',
        title: 'Kualitas Foto Excellent',
        description: `Foto memiliki kualitas sangat baik dengan skor ${qualityScore}/100. Pencahayaan, komposisi, dan ketajaman optimal.`,
        confidence: qualityScore,
        actionable: false,
        photoSpecific: true
      });
    } else if (qualityScore > 70) {
      insights.unshift({
        id: 'quality-good',
        type: 'success',
        category: 'quality',
        title: 'Kualitas Foto Baik',
        description: `Foto memiliki kualitas baik dengan skor ${qualityScore}/100. Beberapa aspek masih bisa ditingkatkan.`,
        confidence: qualityScore,
        actionable: true,
        photoSpecific: true
      });
    } else {
      insights.unshift({
        id: 'quality-needs-improvement',
        type: 'warning',
        category: 'quality',
        title: 'Kualitas Foto Perlu Ditingkatkan',
        description: `Foto memiliki skor ${qualityScore}/100. Perbaiki pencahayaan dan komposisi untuk hasil yang lebih baik.`,
        confidence: Math.max(qualityScore, 60),
        actionable: true,
        photoSpecific: true
      });
    }

    // Add specific quality metric insights
    const { lighting_score, composition_score, focus_score, background_score, color_vibrancy } = analysisResult.photo_quality;
    
    if (lighting_score < 60) {
      insights.push({
        id: 'lighting-improvement',
        type: 'suggestion',
        category: 'lighting',
        title: 'Perbaiki Pencahayaan',
        description: `Pencahayaan foto perlu diperbaiki (skor: ${lighting_score}/100). Gunakan cahaya alami atau lampu putih yang merata.`,
        confidence: 85,
        actionable: true,
        photoSpecific: true
      });
    }

    if (composition_score < 60) {
      insights.push({
        id: 'composition-improvement',
        type: 'suggestion',
        category: 'composition',
        title: 'Optimalkan Komposisi',
        description: `Komposisi foto bisa diperbaiki (skor: ${composition_score}/100). Coba posisikan produk menggunakan rule of thirds.`,
        confidence: 80,
        actionable: true,
        photoSpecific: true
      });
    }

    if (focus_score < 70) {
      insights.push({
        id: 'focus-improvement',
        type: 'warning',
        category: 'quality',
        title: 'Tingkatkan Ketajaman',
        description: `Ketajaman foto perlu diperbaiki (skor: ${focus_score}/100). Pastikan kamera fokus pada produk dan tangan tidak bergetar.`,
        confidence: 85,
        actionable: true,
        photoSpecific: true
      });
    }

    // Add recommendations as insights
    analysisResult.recommendations.forEach((recommendation, index) => {
      insights.push({
        id: `recommendation-${index}`,
        type: 'info',
        category: 'optimization',
        title: 'Rekomendasi AI',
        description: recommendation,
        confidence: 80,
        actionable: true,
        photoSpecific: true
      });
    });

    // Add insights based on number of photos
    if (images.length === 1) {
      insights.push({
        id: 'single-photo-tip',
        type: 'suggestion',
        category: 'visibility',
        title: 'Tambahkan Foto dari Sudut Lain',
        description: 'Foto dari berbagai sudut akan memberikan gambaran produk yang lebih lengkap kepada pembeli dan meningkatkan kepercayaan.',
        confidence: 90,
        actionable: true,
        photoSpecific: true
      });
    } else if (images.length > 3) {
      insights.push({
        id: 'multiple-photos-success',
        type: 'success',
        category: 'visibility',
        title: 'Variasi Foto Excellent',
        description: `${images.length} foto memberikan gambaran produk yang sangat lengkap dari berbagai perspektif. Ini akan meningkatkan kepercayaan pembeli secara signifikan.`,
        confidence: 95,
        actionable: false,
        photoSpecific: true
      });
    }

    return insights;

  } catch (error) {
    console.error('❌ Failed to analyze photos with consolidated API, using fallback insights:', error);
    
    // Fallback to basic insights if API fails
    return getFallbackInsights(images, productName);
  }
};

// Fallback function when API is not available
const getFallbackInsights = (images: File[], productName?: string): AIInsight[] => {
  const insights: AIInsight[] = [];
  const imageCount = images.length;

  // Basic insights when API is not available
  insights.push({
    id: 'api-unavailable',
    type: 'info',
    category: 'quality',
    title: 'Analisis Foto Standar',
    description: 'Layanan AI analisis sedang tidak tersedia. Menggunakan analisis standar berdasarkan jumlah foto yang diunggah.',
    confidence: 70,
    actionable: false,
    photoSpecific: true
  });

  if (imageCount === 1) {
    insights.push({
      id: 'single-photo-fallback',
      type: 'suggestion',
      category: 'visibility',
      title: 'Tambahkan Lebih Banyak Foto',
      description: 'Foto dari berbagai sudut akan memberikan gambaran produk yang lebih lengkap kepada pembeli.',
      confidence: 85,
      actionable: true,
      photoSpecific: true
    });
  } else if (imageCount >= 3) {
    insights.push({
      id: 'multiple-photos-fallback',
      type: 'success',
      category: 'visibility',
      title: 'Variasi Foto Baik',
      description: `${imageCount} foto memberikan gambaran produk dari berbagai perspektif. Ini akan meningkatkan kepercayaan pembeli.`,
      confidence: 80,
      actionable: false,
      photoSpecific: true
    });
  }

  // Generic photo tips
  insights.push({
    id: 'lighting-tip',
    type: 'suggestion',
    category: 'lighting',
    title: 'Tips Pencahayaan',
    description: 'Gunakan cahaya alami atau lampu putih yang merata untuk hasil foto yang lebih baik.',
    confidence: 75,
    actionable: true,
    photoSpecific: true
  });

  insights.push({
    id: 'background-tip',
    type: 'suggestion',
    category: 'composition',
    title: 'Tips Background',
    description: 'Background yang bersih dan polos akan membuat produk lebih menonjol.',
    confidence: 75,
    actionable: true,
    photoSpecific: true
  });

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
      case 'composition': return Layers;
      case 'lighting': return Sun;
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

  const photoSpecificInsights = insights.filter(i => i.photoSpecific);
  const generalInsights = insights.filter(i => !i.photoSpecific);

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
            AI Photo Analysis
          </h3>
        </div>
        
        {isAnalyzing && (
          <div className="flex items-center gap-2u text-sm text-text-secondary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Menganalisis foto...
          </div>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="space-y-3u">
          {[1, 2, 3, 4].map((i) => (
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
                      {insight.photoSpecific && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          Photo AI
                        </span>
                      )}
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
              {photoSpecificInsights.length > 0 && (
                <span className="text-primary">{photoSpecificInsights.length} analisis foto</span>
              )}
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