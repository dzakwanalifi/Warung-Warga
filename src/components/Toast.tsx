'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        const handleClose = () => {
          onClose(id);
        };
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, id]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5" />;
      case 'error': return <X className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success': return 'bg-success border-success text-white';
      case 'error': return 'bg-error border-error text-white';
      case 'warning': return 'bg-warning border-warning text-white';
      case 'info': return 'bg-info border-info text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed bottom-24 left-4u right-4u mx-auto max-w-sm z-50',
      'transform transition-all duration-300 ease-in-out'
    )}>
      <div className={cn(
        'rounded-card shadow-lg border-2 p-4u',
        getColorClasses()
      )}>
        <div className="flex items-start gap-3u">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-body-large font-medium">{title}</h4>
            {message && (
              <p className="text-body-small mt-1u opacity-90">{message}</p>
            )}
          </div>
          
          <button
            onClick={() => onClose(id)}
            className="flex-shrink-0 p-1u rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ bottom: `${24 + index * 80}px` }}
          className="absolute left-4u right-4u pointer-events-auto"
        >
          <Toast {...toast} onClose={onRemove} />
        </div>
      ))}
    </div>
  );
};

// Toast Hook for easy usage
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>>([]);

  const addToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, duration?: number) =>
    addToast('success', title, message, duration);

  const error = (title: string, message?: string, duration?: number) =>
    addToast('error', title, message, duration);

  const warning = (title: string, message?: string, duration?: number) =>
    addToast('warning', title, message, duration);

  const info = (title: string, message?: string, duration?: number) =>
    addToast('info', title, message, duration);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}; 