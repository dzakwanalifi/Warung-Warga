import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={cn('space-y-1u', className)}>
      {label && (
        <label className="block text-body-small font-medium text-text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          'w-full px-3u py-2u border rounded-input',
          'text-body-regular text-text-primary',
          'placeholder:text-text-secondary',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'transition-colors duration-200',
          {
            'border-error focus:ring-error/20 focus:border-error': error,
            'border-border': !error,
            'bg-surface-secondary cursor-not-allowed': disabled,
            'bg-surface-primary': !disabled,
          }
        )}
      />
      
      {error && (
        <p className="text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}; 