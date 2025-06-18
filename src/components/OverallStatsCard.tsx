'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface OverallStatsCardProps {
  totalActiveBorongan: number;
  totalParticipants: number;
  totalSavings: number;
  className?: string;
}

export const OverallStatsCard: React.FC<OverallStatsCardProps> = ({
  totalActiveBorongan,
  totalParticipants,
  totalSavings,
  className
}) => {
  return (
    <div className={cn('card p-4u', className)}>
      <div className="flex items-center justify-between">
        {/* Total Active Borongan */}
        <div className="flex-1 text-center">
          <div className="text-heading-2 text-primary font-bold">
            {totalActiveBorongan}
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Borongan Aktif
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border mx-4u" />

        {/* Total Participants */}
        <div className="flex-1 text-center">
          <div className="text-heading-2 text-primary font-bold">
            {totalParticipants}
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Total Peserta
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border mx-4u" />

        {/* Total Savings */}
        <div className="flex-1 text-center">
          <div className="text-heading-2 text-primary font-bold text-sm">
            {formatCurrency(totalSavings)}
          </div>
          <div className="text-caption text-text-secondary mt-0.5">
            Total Hemat
          </div>
        </div>
      </div>
    </div>
  );
}; 