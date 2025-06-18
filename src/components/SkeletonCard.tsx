import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div className={cn('card bg-surface overflow-hidden animate-pulse', className)}>
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-3u">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded mb-2u"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3u"></div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3u"></div>
        
        {/* Description */}
        <div className="h-3 bg-gray-200 rounded mb-2u"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-3u"></div>
        
        {/* Seller Info */}
        <div className="flex items-center gap-2u mb-3u">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-1u"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-2u border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
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