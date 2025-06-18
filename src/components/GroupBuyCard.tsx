'use client';

import React from 'react';
import Link from 'next/link';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import { BoronganItem } from '@/lib/boronganService';

interface GroupBuyCardProps {
  borongan: BoronganItem;
  className?: string;
}

export const GroupBuyCard: React.FC<GroupBuyCardProps> = ({
  borongan,
  className
}) => {
  const progress = Math.min((borongan.current_quantity / borongan.target_quantity) * 100, 100);
  const remainingQuantity = Math.max(borongan.target_quantity - borongan.current_quantity, 0);
  const savings = borongan.original_price_per_unit 
    ? borongan.original_price_per_unit - borongan.price_per_unit 
    : 0;

  return (
    <Link 
      href={`/borongan/${borongan.id}`}
      prefetch={true}
    >
      <div className={cn('card-group-buy hover:shadow-lg transition-all duration-200 cursor-pointer', className)}>
        <div className="p-4u">
          {/* Header */}
          <div className="flex items-start justify-between mb-3u">
            <div className="flex-1">
              <h3 className="text-body-large font-medium text-text-primary mb-1u line-clamp-2">
                {borongan.title}
              </h3>
              <p className="text-body-small text-text-secondary line-clamp-2">
                {borongan.description}
              </p>
            </div>
            {borongan.status === 'active' && (
              <div className="ml-2u">
                <span className="inline-flex items-center px-2u py-1 rounded-full text-caption bg-success/10 text-success">
                  ● Aktif
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-3u">
            <div className="flex items-center justify-between mb-1u">
              <span className="text-caption text-text-secondary">
                {borongan.current_quantity} dari {borongan.target_quantity}
              </span>
              <span className="text-caption font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            {remainingQuantity > 0 && (
              <p className="text-caption text-text-secondary mt-1u">
                Butuh {remainingQuantity} lagi
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-3u">
            <div>
              <div className="flex items-center gap-2u">
                <span className="text-body-large font-bold text-primary">
                  {formatCurrency(borongan.price_per_unit)}
                </span>
                {borongan.original_price_per_unit && (
                  <span className="text-body-small text-text-secondary line-through">
                    {formatCurrency(borongan.original_price_per_unit)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-caption text-accent">
                  Hemat {formatCurrency(savings)} per unit
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-caption text-text-secondary">
            <div className="flex items-center gap-1u">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{borongan.participants_count} peserta</span>
            </div>
            <div className="flex items-center gap-1u">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatRelativeTime(borongan.deadline)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}; 