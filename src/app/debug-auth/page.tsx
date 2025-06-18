'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/Button';

export default function DebugAuthPage() {
  const { user, token, isAuthenticated, isLoading, isHydrated, loginAction, logoutAction } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [localStorage_token, setLocalStorageToken] = useState<string | null>(null);
  const [zustandState, setZustandState] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    // Check localStorage
    const token = localStorage.getItem('access_token');
    setLocalStorageToken(token);
    
    // Check zustand persistent storage
    const authStorage = localStorage.getItem('auth-storage');
    setZustandState(authStorage || 'null');
  }, []);

  // Test login with dummy data
  const testLogin = () => {
    const dummyUser = {
      id: 'test-id',
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const dummyToken = 'test-token-123';
    
    console.log('Testing login with:', { dummyUser, dummyToken });
    loginAction(dummyUser, dummyToken);
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4u">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-heading-1 mb-4u">Debug Authentication State</h1>
        
        {/* Current Auth State */}
        <div className="card mb-4u">
          <div className="p-4u">
            <h2 className="text-heading-2 mb-3u">Current Auth State</h2>
            <div className="grid grid-cols-2 gap-4u">
              <div>
                <strong>isAuthenticated:</strong> 
                <span className={isAuthenticated ? 'text-success' : 'text-error'}>
                  {isAuthenticated ? ' TRUE' : ' FALSE'}
                </span>
              </div>
              <div>
                <strong>isLoading:</strong> 
                <span className={isLoading ? 'text-warning' : 'text-text-primary'}>
                  {isLoading ? ' TRUE' : ' FALSE'}
                </span>
              </div>
              <div>
                <strong>isHydrated:</strong> 
                <span className={isHydrated ? 'text-success' : 'text-warning'}>
                  {isHydrated ? ' TRUE' : ' FALSE'}
                </span>
              </div>
              <div>
                <strong>has User:</strong> 
                <span className={user ? 'text-success' : 'text-error'}>
                  {user ? ' TRUE' : ' FALSE'}
                </span>
              </div>
              <div>
                <strong>has Token:</strong> 
                <span className={token ? 'text-success' : 'text-error'}>
                  {token ? ' TRUE' : ' FALSE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Data */}
        {user && (
          <div className="card mb-4u">
            <div className="p-4u">
              <h2 className="text-heading-2 mb-3u">User Data</h2>
              <pre className="text-body-small bg-surface-secondary p-2u rounded-button overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Token Info */}
        <div className="card mb-4u">
          <div className="p-4u">
            <h2 className="text-heading-2 mb-3u">Token Information</h2>
            <div className="space-y-2u">
              <div>
                <strong>Zustand Token:</strong>
                <p className="text-body-small font-mono bg-surface-secondary p-2u rounded-button">
                  {token || 'null'}
                </p>
              </div>
              <div>
                <strong>localStorage Token:</strong>
                <p className="text-body-small font-mono bg-surface-secondary p-2u rounded-button">
                  {localStorage_token || 'null'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zustand Storage */}
        <div className="card mb-4u">
          <div className="p-4u">
            <h2 className="text-heading-2 mb-3u">Zustand Persistent Storage</h2>
            <pre className="text-body-small bg-surface-secondary p-2u rounded-button overflow-auto">
              {zustandState}
            </pre>
          </div>
        </div>

        {/* Test Actions */}
        <div className="card mb-4u">
          <div className="p-4u">
            <h2 className="text-heading-2 mb-3u">Test Actions</h2>
            <div className="flex gap-2u">
              <Button onClick={testLogin} variant="primary">
                Test Login
              </Button>
              <Button onClick={logoutAction} variant="secondary">
                Test Logout
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time State Monitor */}
        <div className="card">
          <div className="p-4u">
            <h2 className="text-heading-2 mb-3u">Real-time State Monitor</h2>
            <p className="text-body-small text-text-secondary mb-2u">
              This will update automatically when auth state changes:
            </p>
            <div className="bg-surface-secondary p-2u rounded-button">
              <div className="text-body-small">
                Auth: <strong>{isAuthenticated ? 'LOGGED IN' : 'LOGGED OUT'}</strong>
                {user && <span> | User: <strong>{user.full_name}</strong></span>}
                {isLoading && <span> | <strong>LOADING...</strong></span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 