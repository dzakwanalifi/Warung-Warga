'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileMenuButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  iconBgColor?: string;
  className?: string;
  disabled?: boolean;
}

export const ProfileMenuButton: React.FC<ProfileMenuButtonProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  iconBgColor = 'bg-primary/10',
  className,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center p-4u bg-surface border border-border rounded-card',
        'transition-all duration-200 hover:bg-surface-secondary hover:border-primary/20',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {/* Icon Container */}
      <div className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full mr-3u',
        iconBgColor
      )}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="text-body-regular text-text-primary font-medium">
          {title}
        </div>
        {subtitle && (
          <div className="text-caption text-text-secondary mt-0.5">
            {subtitle}
          </div>
        )}
      </div>

      {/* Chevron Right */}
      <svg 
        className="w-5 h-5 text-text-secondary" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5l7 7-7 7" 
        />
      </svg>
    </button>
  );
}; 