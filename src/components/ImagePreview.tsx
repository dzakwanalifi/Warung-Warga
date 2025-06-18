'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  className
}) => {
  return (
    <div className={cn('relative group', className)}>
      {/* Image Container */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border bg-surface-secondary">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="96px"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Delete Button */}
      <button
        onClick={onRemove}
        className={cn(
          "absolute -top-2 -right-2 w-6 h-6 rounded-full",
          "bg-error text-white shadow-lg",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 transition-all duration-200",
          "hover:scale-110 hover:bg-error-hover",
          "focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-1"
        )}
        aria-label="Hapus gambar"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}; 