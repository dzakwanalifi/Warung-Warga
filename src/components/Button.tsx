import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary/20',
    outline: 'border border-primary text-primary hover:bg-primary/10 focus:ring-primary/20',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary/20',
  };

  const sizeStyles = {
    small: 'px-2u py-1u text-body-small',
    medium: 'px-3u py-2u text-body-regular',
    large: 'px-4u py-3u text-body-large',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-button',
        'focus:outline-none focus:ring-2',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        {
          'w-full': fullWidth,
        },
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}; 