'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  showImage?: boolean;
  showDescription?: boolean;
  variant?: 'default' | 'compact' | 'wide';
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  showDescription = true,
  variant = 'default',
  className = ''
}) => {
  const getSkeletonSize = () => {
    switch (variant) {
      case 'compact':
        return 'h-32';
      case 'wide':
        return 'h-48';
      default:
        return 'h-40';
    }
  };

  return (
    <div className={`bg-surface rounded-lg shadow-card overflow-hidden animate-pulse ${className}`}>
      {showImage && (
        <div className={`bg-border ${getSkeletonSize()}`}></div>
      )}
      
      <div className="p-4u space-y-3u">
        {/* Title Skeleton */}
        <div className="space-y-2u">
          <div className="h-5 bg-border rounded w-3/4"></div>
          {variant === 'wide' && (
            <div className="h-4 bg-border rounded w-1/2"></div>
          )}
        </div>

        {/* Description Skeleton */}
        {showDescription && (
          <div className="space-y-2u">
            <div className="h-3 bg-border rounded w-full"></div>
            <div className="h-3 bg-border rounded w-5/6"></div>
            {variant !== 'compact' && (
              <div className="h-3 bg-border rounded w-2/3"></div>
            )}
          </div>
        )}

        {/* Price/Meta Info Skeleton */}
        <div className="flex justify-between items-center pt-2u">
          <div className="space-y-1u">
            <div className="h-5 bg-border rounded w-20"></div>
            <div className="h-3 bg-border rounded w-16"></div>
          </div>
          <div className="h-8 bg-border rounded w-16"></div>
        </div>

        {/* Progress Bar (for borongan cards) */}
        {variant === 'wide' && (
          <div className="pt-3u border-t border-border">
            <div className="flex justify-between text-xs mb-2u">
              <div className="h-3 bg-border rounded w-12"></div>
              <div className="h-3 bg-border rounded w-16"></div>
            </div>
            <div className="h-2 bg-border rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, className }) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4u',
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonCard; 