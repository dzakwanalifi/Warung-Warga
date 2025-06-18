'use client';

import React from 'react';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopNavigationProps {
  title?: string;
  subtitle?: string;
  showShareButton?: boolean;
  showFavoriteButton?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  subtitle,
  showShareButton = false,
  showFavoriteButton = false,
  backgroundColor = 'bg-surface',
  titleColor = 'text-text-primary',
  iconColor = 'text-text-primary',
  onShare,
  onFavorite,
  isFavorited = false
}) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={`${backgroundColor} shadow-sm border-b sticky top-0 z-40`}>
      <div className="px-4u py-3u">
        <div className="flex items-center gap-3u">
          <button
            onClick={handleBack}
            className={`p-2u rounded-full hover:bg-surface-secondary transition-colors ${iconColor}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            {title && (
              <h1 className={`text-lg font-semibold ${titleColor}`}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>

          {showShareButton && (
            <button
              onClick={onShare}
              className={`p-2u rounded-full hover:bg-surface-secondary transition-colors ${iconColor}`}
            >
              <Share2 className="h-5 w-5" />
            </button>
          )}

          {showFavoriteButton && (
            <button
              onClick={onFavorite}
              className={`p-2u rounded-full hover:bg-surface-secondary transition-colors ${
                isFavorited ? 'text-error' : iconColor
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 