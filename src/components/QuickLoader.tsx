'use client';

import React from 'react';

interface QuickLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuickLoader: React.FC<QuickLoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

// Optimized page transition loader
export const PageTransitionLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4u flex items-center gap-3u">
        <QuickLoader size="sm" />
        <span className="text-sm text-text-secondary">Memuat halaman...</span>
      </div>
    </div>
  );
}; 