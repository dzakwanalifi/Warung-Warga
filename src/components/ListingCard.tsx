import React from 'react';
import Link from 'next/link';
import { Lapak } from '@/lib/types';
import { formatCurrency, formatDistance, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  lapak: Lapak;
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ lapak, className }) => {
  // Get the first image or use placeholder
  const primaryImage = lapak.image_urls?.[0] || '/placeholder-product.jpg';
  
  // Format seller location
  const sellerLocation = lapak.seller.address || 'Lokasi tidak tersedia';
  
  // Status indicator
  const isAvailable = lapak.status === 'available' && lapak.stock_quantity > 0;
  
  return (
    <Link href={`/lapak/${lapak.id}`}>
      <div className={cn(
        'card-listing group overflow-hidden bg-surface',
        'hover:shadow-lg hover:-translate-y-1',
        'transition-all duration-300 ease-out',
        className
      )}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={primaryImage}
            alt={lapak.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-2u right-2u">
            {isAvailable ? (
              <span className="px-2u py-1u bg-success text-white text-caption rounded-full">
                Tersedia
              </span>
            ) : (
              <span className="px-2u py-1u bg-error text-white text-caption rounded-full">
                Habis
              </span>
            )}
          </div>
          
          {/* Distance Badge */}
          {lapak.distance && (
            <div className="absolute top-2u left-2u">
              <span className="px-2u py-1u bg-black/70 text-white text-caption rounded-full backdrop-blur-sm">
                {formatDistance(lapak.distance)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3u">
          {/* Title */}
          <h3 className="text-heading-3 text-text-primary font-semibold mb-1u line-clamp-2 group-hover:text-primary transition-colors">
            {lapak.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-1u mb-2u">
            <span className="text-heading-2 text-primary font-bold">
              {formatCurrency(lapak.price)}
            </span>
            <span className="text-body-small text-text-secondary">
              / {lapak.unit}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-body-small text-text-secondary mb-3u line-clamp-2">
            {lapak.description}
          </p>
          
          {/* Seller Info */}
          <div className="flex items-center gap-2u mb-2u">
            <div className="avatar avatar-sm bg-primary-light flex items-center justify-center">
              <span className="text-caption text-primary font-semibold">
                {lapak.seller.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-small text-text-primary font-medium truncate">
                {lapak.seller.full_name}
              </p>
              <p className="text-caption text-text-secondary truncate">
                {sellerLocation}
              </p>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2u border-t border-border">
            <div className="flex items-center gap-1u">
              <span className="text-caption text-text-secondary">Stok:</span>
              <span className="text-caption text-text-primary font-medium">
                {lapak.stock_quantity} {lapak.unit}
              </span>
            </div>
            {lapak.created_at && (
              <span className="text-caption text-text-secondary">
                {formatRelativeTime(lapak.created_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard; 