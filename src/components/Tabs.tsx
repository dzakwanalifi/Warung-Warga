'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn('flex bg-surface-secondary rounded-button p-1u', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-1 px-3u py-2u text-body-small font-medium rounded-button transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            {
              'bg-surface text-primary shadow-sm': activeTab === tab.id,
              'text-text-secondary hover:text-text-primary': activeTab !== tab.id,
            }
          )}
        >
          <span className="flex items-center justify-center gap-1u">
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-xs rounded-full',
                {
                  'bg-primary text-white': activeTab === tab.id,
                  'bg-border text-text-secondary': activeTab !== tab.id,
                }
              )}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}; 