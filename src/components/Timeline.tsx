'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  icon?: React.ComponentType<{ className?: string }>;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const getStatusColor = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return 'text-success bg-success/10 border-success';
    case 'current':
      return 'text-accent bg-accent/10 border-accent';
    case 'failed':
      return 'text-error bg-error/10 border-error';
    case 'pending':
    default:
      return 'text-text-secondary bg-surface-secondary border-border';
  }
};

const getStatusIcon = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'current':
      return Clock;
    case 'failed':
      return AlertCircle;
    case 'pending':
    default:
      return Clock;
  }
};

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={cn('space-y-6u', className)}>
      {items.map((item, index) => {
        const Icon = item.icon || getStatusIcon(item.status);
        const statusColors = getStatusColor(item.status);
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative">
            {/* Connector Line */}
            {!isLast && (
              <div className="absolute left-4u top-8u w-0.5 h-12u bg-border"></div>
            )}

            {/* Timeline Item */}
            <div className="flex gap-4u">
              {/* Icon */}
              <div className={cn(
                'flex items-center justify-center w-8u h-8u rounded-full border-2 flex-shrink-0',
                statusColors
              )}>
                <Icon className="w-4u h-4u" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-primary">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-text-secondary mt-1u">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-text-secondary ml-4u flex-shrink-0">
                    {item.date}
                  </time>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 