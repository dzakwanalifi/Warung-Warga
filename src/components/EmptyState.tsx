import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada data',
  description = 'Data yang Anda cari tidak ditemukan.',
  action,
  icon,
  className
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9a2 2 0 01-2 2h-2m0 0v2a2 2 0 002 2h2a2 2 0 002-2v-2" />
    </svg>
  );

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12u px-4u text-center',
      className
    )}>
      <div className="mb-4u">
        {icon || defaultIcon}
      </div>
      <h3 className="text-heading-3 text-text-primary mb-2u">
        {title}
      </h3>
      <p className="text-body text-text-secondary mb-6u max-w-md">
        {description}
      </p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
};

// Specialized Empty States
export const NoLapakFound: React.FC<{ onCreateNew?: () => void; className?: string }> = ({ 
  onCreateNew, 
  className 
}) => {
  return (
    <EmptyState
      title="Belum ada lapak di sekitar"
      description="Belum ada lapak yang tersedia di area Anda. Jadilah yang pertama membuka lapak!"
      icon={
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4u">
          <span className="text-3xl">🏪</span>
        </div>
      }
      action={
        onCreateNew && (
          <button onClick={onCreateNew} className="btn-primary">
            🏪 Buka Lapak Pertama
          </button>
        )
      }
      className={className}
    />
  );
};

export const LocationRequired: React.FC<{ 
  onRequestLocation?: () => void; 
  onEnableLocation?: () => void; 
  className?: string 
}> = ({ 
  onRequestLocation, 
  onEnableLocation, 
  className 
}) => {
  const handleClick = onEnableLocation || onRequestLocation;
  
  return (
    <EmptyState
      title="Izin lokasi diperlukan"
      description="Untuk menampilkan lapak terdekat, kami memerlukan akses ke lokasi Anda."
      icon={
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4u">
          <span className="text-3xl">📍</span>
        </div>
      }
      action={
        handleClick && (
          <button onClick={handleClick} className="btn-primary">
            📍 Izinkan Akses Lokasi
          </button>
        )
      }
      className={className}
    />
  );
};

export const ErrorState: React.FC<{ 
  onRetry?: () => void; 
  message?: string; 
  className?: string 
}> = ({ 
  onRetry, 
  message, 
  className 
}) => {
  return (
    <EmptyState
      title="Terjadi kesalahan"
      description={message || "Gagal memuat data. Silakan coba lagi."}
      icon={
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4u">
          <span className="text-3xl">⚠️</span>
        </div>
      }
      action={
        onRetry && (
          <button onClick={onRetry} className="btn-secondary">
            🔄 Coba Lagi
          </button>
        )
      }
      className={className}
    />
  );
};

export default EmptyState; 