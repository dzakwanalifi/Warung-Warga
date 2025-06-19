'use client';

import React, { memo, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  isSpecial?: boolean; // For the prominent "Jual" button
  badge?: number;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Beranda',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.47 3.84a.75.75 0 01.06 1.06L9.07 7.24a.75.75 0 11-1.12-1.0l1.47-1.64-.53-.56a.75.75 0 011.06-1.06l.53.56zm1.06 0a.75.75 0 01.53.22l.53.56a.75.75 0 11-1.06 1.06l-.53-.56-1.47 1.64a.75.75 0 11-1.12 1.0L11.47 4.9a.75.75 0 01.06-1.06zm0 0" />
        <path fillRule="evenodd" d="M8.5 6.5c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h7c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1h-7zm0-1.5A2.5 2.5 0 006 7.5v8A2.5 2.5 0 008.5 18h7a2.5 2.5 0 002.5-2.5v-8A2.5 2.5 0 0015.5 5h-7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/borongan',
    label: 'Borongan',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    href: '/lapak/buat',
    label: 'Jual',
    icon: (
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
    ),
    isSpecial: true,
  },
  {
    href: '/lapak',
    label: 'Lapak',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H7a1 1 0 01-1-1V7zm8 0a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1V7zM6 12a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1zm8 0a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1z" />
      </svg>
    ),
  },
  {
    href: '/profil',
    label: 'Profil',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    activeIcon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

// Memoized nav item component to prevent unnecessary re-renders
const NavItem = memo(({ item, isActive }: { item: NavItem; isActive: boolean }) => {
  if (item.isSpecial) {
    // Special prominent "Jual" button
    return (
      <Link key={item.href} href={item.href} prefetch={true}>
        <div className="flex flex-col items-center space-y-1">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
            "bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105",
            "border-2 border-primary-hover transform-gpu" // Added transform-gpu for better animation performance
          )}>
            {item.icon}
          </div>
          <span className="text-caption font-medium text-primary">
            {item.label}
          </span>
        </div>
      </Link>
    );
  }

  // Regular nav items
  return (
    <Link key={item.href} href={item.href} prefetch={true}>
      <div className="flex flex-col items-center space-y-1u py-1u px-2u transition-all duration-200 hover:bg-surface-secondary rounded-button transform-gpu">
        <div className={cn(
          "transition-colors duration-200",
          isActive ? "text-primary" : "text-text-secondary"
        )}>
          {isActive && item.activeIcon ? item.activeIcon : item.icon}
        </div>
        <span className={cn(
          "text-caption font-medium transition-colors duration-200",
          isActive ? "text-primary" : "text-text-secondary"
        )}>
          {item.label}
        </span>
      </div>
    </Link>
  );
});

NavItem.displayName = 'NavItem';

// Memoized bottom nav bar component
export const BottomNavBar = memo(() => {
  const pathname = usePathname();
  const [isJualMenuOpen, setIsJualMenuOpen] = useState(false);

  const toggleJualMenu = () => {
    setIsJualMenuOpen(!isJualMenuOpen);
  };

  const closeJualMenu = () => {
    setIsJualMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Special overlay menu for "Jual" button */}
      <div 
        className={`
          fixed inset-0 bg-black/50 z-40
          ${isJualMenuOpen ? 'block' : 'hidden'}
        `}
        onClick={closeJualMenu}
      >
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-surface rounded-card shadow-xl border border-border p-4u min-w-48">
            <div className="space-y-2u">
              <Link href="/lapak/buat" onClick={closeJualMenu}>
                <button className="w-full flex items-center gap-3u p-3u rounded-button hover:bg-surface-secondary transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-button flex items-center justify-center">
                    <span className="text-lg">🏪</span>
                  </div>
                  <div className="text-left">
                    <p className="text-body-small font-medium text-text-primary">Buka Lapak</p>
                    <p className="text-caption text-text-secondary">Jual produk segar</p>
                  </div>
                </button>
              </Link>
              
              <Link href="/borongan/buat" onClick={closeJualMenu}>
                <button className="w-full flex items-center gap-3u p-3u rounded-button hover:bg-surface-secondary transition-colors">
                  <div className="w-8 h-8 bg-accent/10 rounded-button flex items-center justify-center">
                    <span className="text-lg">🤝</span>
                  </div>
                  <div className="text-left">
                    <p className="text-body-small font-medium text-text-primary">Buat Borongan</p>
                    <p className="text-caption text-text-secondary">Ajak belanja bareng</p>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30 shadow-lg">
        <div className="grid grid-cols-5 h-16 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            // Special handling for "Jual" button
            if (item.label === 'Jual') {
              return (
                <button
                  key={item.label}
                  onClick={toggleJualMenu}
                  className="flex flex-col items-center justify-center p-2 transition-all duration-200 hover:bg-surface-secondary"
                >
                  {isJualMenuOpen ? item.activeIcon : item.icon}
                  <span className="text-xs font-medium text-primary mt-1">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeJualMenu}
                className={`
                  flex flex-col items-center justify-center p-2
                  transition-all duration-200 hover:bg-surface-secondary
                  ${active ? 'text-primary' : 'text-text-secondary'}
                `}
              >
                <div className="relative">
                  {active ? item.activeIcon : item.icon}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`
                  text-xs font-medium mt-1
                  ${active ? 'text-primary' : 'text-text-secondary'}
                `}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Enhanced safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-surface min-h-[env(safe-area-inset-bottom)] pb-1" />
      </nav>
    </>
  );
});

BottomNavBar.displayName = 'BottomNavBar'; 