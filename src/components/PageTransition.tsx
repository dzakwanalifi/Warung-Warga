'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Handle route change start
    const handleRouteStart = () => {
      setIsTransitioning(true);
    };

    // Handle route change complete
    const handleRouteComplete = () => {
      setIsTransitioning(false);
      setDisplayChildren(children);
    };

    // Listen to route changes
    const originalPush = router.push;
    router.push = (...args) => {
      handleRouteStart();
      return originalPush.apply(router, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router, children]);

  useEffect(() => {
    setDisplayChildren(children);
    setIsTransitioning(false);
  }, [pathname, children]);

  return (
    <div className="relative">
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-200">
          <div className="bg-white rounded-lg shadow-lg p-4u flex items-center gap-3u">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-text-secondary">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Page content */}
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        {displayChildren}
      </div>
    </div>
  );
};

// Hook for programmatic navigation with smooth transitions
export const useSmoothRouter = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = async (url: string) => {
    setIsNavigating(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    router.push(url);
    
    // Reset after navigation
    setTimeout(() => setIsNavigating(false), 300);
  };

  return { navigate, isNavigating };
}; 