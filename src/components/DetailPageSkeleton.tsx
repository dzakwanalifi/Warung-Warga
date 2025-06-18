'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const DetailPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-surface shadow-sm border-b sticky top-0 z-40">
        <div className="px-4u py-3u">
          <div className="flex items-center gap-3u">
            <div className="p-2u">
              <ArrowLeft className="h-5 w-5 text-border" />
            </div>
            <div className="flex-1">
              <div className="h-5 bg-border rounded w-2/3 mb-1u"></div>
              <div className="h-4 bg-border rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-border rounded-full w-16"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4u py-6u max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6u">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6u">
            {/* Image Skeleton */}
            <div className="bg-surface rounded-lg shadow-card p-0 overflow-hidden">
              <div className="aspect-video bg-border rounded-t-lg"></div>
            </div>

            {/* Product Info Skeleton */}
            <div className="bg-surface rounded-lg shadow-card p-4u space-y-4u">
              <div className="flex items-center gap-2u mb-4u">
                <div className="h-5 w-5 bg-border rounded"></div>
                <div className="h-6 bg-border rounded w-32"></div>
              </div>
              <div className="space-y-3u">
                <div className="h-6 bg-border rounded w-3/4"></div>
                <div className="h-4 bg-border rounded w-full"></div>
                <div className="h-4 bg-border rounded w-5/6"></div>
              </div>
              <div className="bg-surface-secondary rounded-lg p-4u">
                <div className="flex justify-between">
                  <div className="space-y-2u">
                    <div className="h-8 bg-border rounded w-24"></div>
                    <div className="h-4 bg-border rounded w-16"></div>
                  </div>
                  <div className="space-y-2u">
                    <div className="h-6 bg-border rounded w-20"></div>
                    <div className="h-4 bg-border rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Skeleton */}
            <div className="bg-surface rounded-lg shadow-card p-4u">
              <div className="flex items-center gap-2u mb-4u">
                <div className="h-5 w-5 bg-border rounded"></div>
                <div className="h-6 bg-border rounded w-28"></div>
              </div>
              <div className="flex items-center gap-3u">
                <div className="w-12 h-12 bg-border rounded-full"></div>
                <div className="flex-1 space-y-2u">
                  <div className="h-5 bg-border rounded w-32"></div>
                  <div className="h-4 bg-border rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6u">
            {/* Countdown Skeleton */}
            <div className="bg-surface rounded-lg shadow-card p-4u">
              <div className="text-center space-y-3u">
                <div className="h-5 bg-border rounded w-20 mx-auto"></div>
                <div className="flex justify-center gap-2u">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-2u border border-border rounded">
                      <div className="h-8 bg-border rounded w-8 mb-1u"></div>
                      <div className="h-3 bg-border rounded w-8"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Skeleton */}
            <div className="bg-surface rounded-lg shadow-card p-4u space-y-4u">
              <div className="flex items-center gap-2u">
                <div className="h-5 w-5 bg-border rounded"></div>
                <div className="h-6 bg-border rounded w-28"></div>
              </div>
              <div className="space-y-2u">
                <div className="flex justify-between">
                  <div className="h-4 bg-border rounded w-16"></div>
                  <div className="h-4 bg-border rounded w-12"></div>
                </div>
                <div className="h-3 bg-border rounded-full w-full"></div>
              </div>
              <div className="h-12 bg-border rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 