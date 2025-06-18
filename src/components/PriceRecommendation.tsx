'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target,
  Lightbulb,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';

interface PriceRecommendation {
  id: string;
  price: number;
  confidence: number;
  reason: string;
  trend: 'up' | 'down' | 'stable';
  marketPosition: 'competitive' | 'premium' | 'budget';
}

interface MarketData {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  competitorCount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface PriceRecommendationProps {
  productName: string;
  category: string;
  description?: string;
  currentPrice?: string;
  onPriceSelect?: (price: number) => void;
}

// Mock market analysis function
const analyzeMarket = async (productName: string, category: string): Promise<{ recommendations: PriceRecommendation[], marketData: MarketData }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate mock market data based on category
  const categoryMultipliers: Record<string, { base: number, variance: number }> = {
    'makanan': { base: 15000, variance: 8000 },
    'sayuran': { base: 8000, variance: 4000 },
    'buah': { base: 12000, variance: 6000 },
    'minuman': { base: 5000, variance: 3000 },
    'kue': { base: 20000, variance: 10000 },
    'produk-kebun': { base: 10000, variance: 5000 },
    'lainnya': { base: 15000, variance: 8000 }
  };

  const multiplier = categoryMultipliers[category] || categoryMultipliers['lainnya'];
  const basePrice = multiplier.base;
  const variance = multiplier.variance;

  const marketData: MarketData = {
    averagePrice: basePrice,
    minPrice: basePrice - variance,
    maxPrice: basePrice + variance,
    competitorCount: Math.floor(Math.random() * 15) + 5,
    trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any
  };

  const recommendations: PriceRecommendation[] = [
    {
      id: 'competitive',
      price: Math.round(marketData.averagePrice * 0.95),
      confidence: 88,
      reason: 'Harga kompetitif yang menarik untuk pembeli namun tetap menguntungkan',
      trend: 'stable',
      marketPosition: 'competitive'
    },
    {
      id: 'premium',
      price: Math.round(marketData.averagePrice * 1.15),
      confidence: 75,
      reason: 'Harga premium untuk produk berkualitas tinggi dengan nilai tambah',
      trend: 'up',
      marketPosition: 'premium'
    },
    {
      id: 'budget',
      price: Math.round(marketData.averagePrice * 0.85),
      confidence: 92,
      reason: 'Harga terjangkau untuk menarik lebih banyak pembeli dan penjualan cepat',
      trend: 'down',
      marketPosition: 'budget'
    }
  ];

  return { recommendations, marketData };
};

export function PriceRecommendation({ 
  productName, 
  category, 
  description, 
  currentPrice,
  onPriceSelect 
}: PriceRecommendationProps) {
  const [recommendations, setRecommendations] = useState<PriceRecommendation[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    if (productName && category) {
      setIsAnalyzing(true);
      setIsVisible(true);
      
      analyzeMarket(productName, category).then(({ recommendations, marketData }) => {
        setRecommendations(recommendations);
        setMarketData(marketData);
        setIsAnalyzing(false);
      });
    } else {
      setIsVisible(false);
    }
  }, [productName, category]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return BarChart3;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'premium': return 'text-accent border-accent/20 bg-accent/5';
      case 'competitive': return 'text-primary border-primary/20 bg-primary/5';
      case 'budget': return 'text-success border-success/20 bg-success/5';
      default: return 'text-text-secondary border-border bg-surface';
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'premium': return 'Premium';
      case 'competitive': return 'Kompetitif';
      case 'budget': return 'Terjangkau';
      default: return '';
    }
  };

  const handleSelectPrice = (recommendation: PriceRecommendation) => {
    setSelectedRecommendation(recommendation.id);
    onPriceSelect?.(recommendation.price);
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
            Rekomendasi Harga AI
          </h3>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2u text-sm text-text-secondary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Menganalisis pasar...
          </div>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="space-y-3u">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3u p-4u bg-surface-secondary rounded-button">
                <div className="w-8 h-8 bg-border rounded-full"></div>
                <div className="flex-1 space-y-2u">
                  <div className="h-5 bg-border rounded w-1/2"></div>
                  <div className="h-4 bg-border rounded w-3/4"></div>
                  <div className="h-3 bg-border rounded w-full"></div>
                </div>
                <div className="w-16 h-8 bg-border rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Market Summary */}
      {!isAnalyzing && marketData && (
        <div className="p-3u bg-info/10 border border-info/20 rounded-button">
          <div className="flex items-center gap-2u mb-2u">
            <BarChart3 className="h-4 w-4 text-info" />
            <h4 className="text-sm font-medium text-text-primary">
              Analisis Pasar
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3u text-center">
            <div>
              <p className="text-xs text-text-secondary">Harga Rata-rata</p>
              <p className="text-sm font-semibold text-text-primary">
                {formatPrice(marketData.averagePrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Rentang Harga</p>
              <p className="text-xs text-text-primary">
                {formatPrice(marketData.minPrice)} - {formatPrice(marketData.maxPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Kompetitor</p>
              <p className="text-sm font-semibold text-text-primary">
                {marketData.competitorCount} penjual
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Tren Pasar</p>
              <div className="flex items-center justify-center gap-1u">
                {marketData.trend === 'increasing' && <TrendingUp className="h-3 w-3 text-success" />}
                {marketData.trend === 'decreasing' && <TrendingDown className="h-3 w-3 text-error" />}
                {marketData.trend === 'stable' && <BarChart3 className="h-3 w-3 text-warning" />}
                <span className="text-xs text-text-primary capitalize">
                  {marketData.trend}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Recommendations */}
      {!isAnalyzing && recommendations.length > 0 && (
        <div className="space-y-3u">
          <h4 className="text-sm font-medium text-text-primary flex items-center gap-1u">
            <Target className="h-4 w-4" />
            Pilihan Harga Optimal
          </h4>
          
          {recommendations.map((recommendation) => {
            const TrendIcon = getTrendIcon(recommendation.trend);
            const isSelected = selectedRecommendation === recommendation.id;
            const isCurrentPrice = currentPrice && Math.abs(Number(currentPrice) - recommendation.price) < 1000;
            
            return (
              <div
                key={recommendation.id}
                className={cn(
                  'p-4u border rounded-button transition-colors cursor-pointer',
                  'hover:shadow-sm',
                  isSelected 
                    ? 'border-primary bg-primary/10 shadow-sm' 
                    : 'border-border bg-surface hover:border-primary/30',
                  isCurrentPrice && 'ring-2 ring-accent/20'
                )}
                onClick={() => handleSelectPrice(recommendation)}
              >
                <div className="flex items-start justify-between gap-3u">
                  <div className="flex-1">
                    <div className="flex items-center gap-2u mb-2u">
                      <div className={cn(
                        'px-2u py-1u rounded-full text-xs font-medium border',
                        getPositionColor(recommendation.marketPosition)
                      )}>
                        {getPositionLabel(recommendation.marketPosition)}
                      </div>
                      <div className="flex items-center gap-1u">
                        <TrendIcon className="h-3 w-3 text-text-secondary" />
                        <span className="text-xs text-text-secondary">
                          {recommendation.confidence}% akurat
                        </span>
                      </div>
                      {isCurrentPrice && (
                        <div className="px-2u py-1u bg-accent/10 border border-accent/20 rounded-full">
                          <span className="text-xs text-accent font-medium">
                            Harga Saat Ini
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2u mb-2u">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(recommendation.price)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-3u">
                      {recommendation.reason}
                    </p>

                    {/* Confidence Bar */}
                    <div className="flex items-center gap-2u">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 rounded-full"
                          style={{ width: `${recommendation.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={isSelected ? "primary" : "secondary"}
                    size="small"
                    onClick={() => handleSelectPrice(recommendation)}
                  >
                    {isSelected ? 'Terpilih' : 'Pilih'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      {!isAnalyzing && recommendations.length > 0 && (
        <div className="p-3u bg-warning/10 border border-warning/20 rounded-button">
          <div className="flex items-start gap-2u">
            <Lightbulb className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-1u">
                Tips Penetapan Harga
              </h4>
              <ul className="text-sm text-text-secondary space-y-1u">
                <li>• Mulai dengan harga kompetitif untuk menarik pembeli pertama</li>
                <li>• Naikkan harga setelah mendapat ulasan positif</li>
                <li>• Pertimbangkan biaya bahan dan waktu dalam penetapan harga</li>
                <li>• Monitor respons pasar dan sesuaikan jika diperlukan</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {!isAnalyzing && recommendations.length > 0 && (
        <div className="border-t border-border pt-3u">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4u">
              <span>{recommendations.length} opsi harga tersedia</span>
              <span>Analisis {marketData?.competitorCount || 0} kompetitor</span>
            </div>
            <div className="flex items-center gap-1u">
              <Sparkles className="w-3 h-3" />
              <span>AI Price Analysis</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 