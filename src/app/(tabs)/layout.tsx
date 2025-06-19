'use client';

import React, { memo } from 'react';
import { BottomNavBar } from '@/components/BottomNavBar';

// Memoized layout component to prevent unnecessary re-renders
const TabsLayoutComponent = memo(function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Main content area with adequate bottom padding to account for fixed bottom nav + safe area */}
      <main className="min-h-screen pb-24 sm:pb-20 transition-all duration-200">
        <div className="relative overflow-hidden">
          {children}
        </div>
      </main>
      
      {/* Fixed bottom navigation - memoized to prevent re-renders */}
      <BottomNavBar />
    </>
  );
});

export default TabsLayoutComponent; 