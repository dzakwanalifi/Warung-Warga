'use client';

import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  Eye, 
  Palette, 
  Sun,
  TrendingUp,
  Zap
} from 'lucide-react';
import { analyzeImages as analyzeImagesAPI } from '@/lib/lapakService';
import { EnhancedAnalysisResult, PhotoInsight } from '@/lib/types';

// Simplified interface for better UX
interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'suggestion';
  category: 'quality' | 'visibility' | 'appeal' | 'optimization' | 'composition' | 'lighting';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
  photoSpecific?: boolean;
}

interface AIInsightsProps {
  images: File[];
  productName?: string;
  description?: string;
  onInsightClick?: (insight: AIInsight) => void;
}

// Convert backend insight to frontend format
const convertPhotoInsight = (backendInsight: PhotoInsight, index: number): AIInsight => {
  return {
    id: `insight-${index}`,
    type: backendInsight.type as AIInsight['type'],
    category: backendInsight.category as AIInsight['category'],
    title: backendInsight.title,
    description: backendInsight.description,
    confidence: backendInsight.confidence,
    actionable: backendInsight.actionable,
    photoSpecific: true
  };
};

// Simplified analysis function that returns top 3 insights
const analyzeImagesForInsights = async (images: File[], productName?: string): Promise<AIInsight[]> => {
  try {
    const result: EnhancedAnalysisResult = await analyzeImagesAPI(images);
    
    if (result?.insights && result.insights.length > 0) {
      // Convert and prioritize insights
      const convertedInsights = result.insights.map(convertPhotoInsight);
      
      // Sort by confidence and actionable first, then take top 3
      const prioritizedInsights = convertedInsights
        .sort((a: AIInsight, b: AIInsight) => {
          // Prioritize actionable insights and higher confidence
          if (a.actionable && !b.actionable) return -1;
          if (!a.actionable && b.actionable) return 1;
          return b.confidence - a.confidence;
        })
        .slice(0, 3); // Limit to top 3 insights
      
      return prioritizedInsights;
    }
    
    return getFallbackInsights(images, productName);
  } catch (error) {
    console.error('Error analyzing images:', error);
    return getFallbackInsights(images, productName);
  }
};

// Simplified fallback insights (max 3)
const getFallbackInsights = (images: File[], productName?: string): AIInsight[] => {
  const baseInsights: AIInsight[] = [
    {
      id: 'quality-check',
      type: 'info',
      category: 'quality',
      title: 'Kualitas Foto Baik',
      description: 'Foto sudah cukup baik untuk menampilkan produk. Pastikan pencahayaan merata untuk hasil optimal.',
      confidence: 75,
      actionable: true,
      photoSpecific: true
    }
  ];

  // Add image count specific insight
  if (images.length === 1) {
    baseInsights.push({
      id: 'multiple-angles',
      type: 'suggestion',
      category: 'visibility',
      title: 'Tambahkan Foto dari Sudut Lain',
      description: 'Foto dari berbagai sudut akan memberikan gambaran produk yang lebih lengkap kepada pembeli.',
      confidence: 90,
      actionable: true,
      photoSpecific: true
    });
  } else {
    baseInsights.push({
      id: 'multiple-photos',
      type: 'success',
      category: 'visibility',
      title: 'Variasi Foto Tersedia',
      description: `Anda telah mengunggah ${images.length} foto yang memberikan gambaran produk dari berbagai perspektif.`,
      confidence: 85,
      actionable: false,
      photoSpecific: true
    });
  }

  // Add lighting suggestion
  baseInsights.push({
    id: 'lighting-tip',
    type: 'suggestion',
    category: 'lighting',
    title: 'Optimalkan Pencahayaan',
    description: 'Gunakan cahaya alami atau lampu putih untuk hasil foto yang lebih menarik.',
    confidence: 80,
    actionable: true,
    photoSpecific: true
  });

  return baseInsights.slice(0, 3); // Ensure max 3 insights
};

export function AIInsights({ images, productName, description, onInsightClick }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  // Don't auto-analyze - wait for user to click
  const handleAnalyzePhotos = async () => {
    if (images.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeImagesForInsights(images, productName);
      setInsights(analysisResult);
      setHasAnalyzed(true);
      
      // Set a simulated quality score based on insights
      const avgConfidence = analysisResult.reduce((sum, insight) => sum + insight.confidence, 0) / analysisResult.length;
      setQualityScore(Math.round(avgConfidence));
    } catch (error) {
      console.error('Analysis failed:', error);
      setInsights(getFallbackInsights(images, productName));
      setQualityScore(75);
      setHasAnalyzed(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      case 'suggestion': return Lightbulb;
      default: return Info;
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'lighting': return Sun;
      case 'composition': return Camera;
      case 'appeal': return TrendingUp;
      case 'visibility': return Eye;
      case 'optimization': return Zap;
      default: return Palette;
    }
  };

  const getTypeColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      case 'suggestion': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeBgColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'suggestion': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500">Upload foto untuk mendapatkan analisis AI</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with analyze button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Photo Analysis</h3>
          {qualityScore && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>•</span>
              <span>Skor: {qualityScore}/100</span>
            </div>
          )}
        </div>
        
        {!hasAnalyzed && (
          <button
            onClick={handleAnalyzePhotos}
            disabled={isAnalyzing || images.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Analisis Foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Description */}
      {!hasAnalyzed && (
        <p className="text-sm text-gray-600">
          Klik tombol untuk menganalisis kualitas foto dan mendapatkan saran perbaikan.
        </p>
      )}

      {/* Analysis Results */}
      {hasAnalyzed && (
        <div className="space-y-3">
          {qualityScore && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Kualitas Foto Keseluruhan</span>
                <span className="text-lg font-bold text-blue-600">{qualityScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${qualityScore}%` }}
                ></div>
              </div>
            </div>
          )}

          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            const CategoryIcon = getCategoryIcon(insight.category);
            
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${getTypeBgColor(insight.type)}`}
                onClick={() => onInsightClick?.(insight)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${insight.type === 'success' ? 'bg-green-100' : insight.type === 'warning' ? 'bg-amber-100' : insight.type === 'info' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    <IconComponent className={`h-4 w-4 ${getTypeColor(insight.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <CategoryIcon className="h-3 w-3 text-gray-500" />
                      <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>{insight.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{insight.description}</p>
                    {insight.actionable && (
                      <div className="mt-2">
                        <span className="text-xs text-blue-600 font-medium">Klik untuk melihat saran →</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>{insights.length} insight ditemukan</span>
              <span>•</span>
              <span>{insights.filter(i => i.actionable).length} dapat ditindaklanjuti</span>
              <span>•</span>
              <span>{images.length} analisis foto</span>
            </div>
          </div>

          {/* Re-analyze button */}
          <button
            onClick={() => {
              setHasAnalyzed(false);
              setInsights([]);
              setQualityScore(null);
            }}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
} 