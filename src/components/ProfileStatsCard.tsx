'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileStatsCardProps {
  totalListings: number;
  rating: number;
  totalGroupBuys: number;
  className?: string;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  totalListings,
  rating,
  totalGroupBuys,
  className
}) => {
  return (
    <div className={cn('card p-4u', className)}>
      <div className="flex items-center justify-between">
        {/* Total Listings */}
        <div className="flex-1 text-center">
          <div className="text-heading-2 text-primary font-bold">
            {totalListings}
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Lapak Aktif
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border mx-4u" />

        {/* Rating */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <div className="text-heading-2 text-primary font-bold">
              {rating.toFixed(1)}
            </div>
            <svg 
              className="w-5 h-5 text-accent fill-current" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Rating
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border mx-4u" />

        {/* Total Group Buys */}
        <div className="flex-1 text-center">
          <div className="text-heading-2 text-primary font-bold">
            {totalGroupBuys}
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Borongan
          </div>
        </div>
      </div>
    </div>
  );
}; 