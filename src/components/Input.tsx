import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const inputClasses = `input-field w-full ${error ? 'input-error' : ''} ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-label text-text-primary font-medium"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="text-caption text-error mt-1">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-caption text-text-secondary mt-1">
          {helperText}
        </p>
      )}
    </div>
  )
} 