'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuthStore';
import { getCurrentUser } from '@/lib/authService';

export default function TestLoginPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Test API connection and endpoints
  const testAPIConnection = async () => {
    setIsLoading(true);
    setCurrentTest('API Connection');
    setError(null);
    
    try {
      const response = await fetch('https://warungwarga-api.azurewebsites.net/');
      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      setError(`API Connection Error: ${err.message}`);
    }
    
    setIsLoading(false);
  };

  // Test API info endpoint
  const testAPIInfo = async () => {
    setIsLoading(true);
    setCurrentTest('API Info');
    setError(null);
    
    try {
      const response = await fetch('https://warungwarga-api.azurewebsites.net/info');
      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      setError(`API Info Error: ${err.message}`);
    }
    
    setIsLoading(false);
  };

  // Test database status
  const testDBStatus = async () => {
    setIsLoading(true);
    setCurrentTest('Database Status');
    setError(null);
    
    try {
      const response = await fetch('https://warungwarga-api.azurewebsites.net/db-status');
      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      setError(`Database Status Error: ${err.message}`);
    }
    
    setIsLoading(false);
  };

  // Test nearby lapak endpoint
  const testNearbyLapak = async () => {
    setIsLoading(true);
    setCurrentTest('Nearby Lapak Test');
    setError(null);
    
    try {
      // Test the nearby lapak endpoint with correct parameter names
      const params = {
        lat: -6.200000,    // Backend API expects 'lat'
        lon: 106.816666,   // Backend API expects 'lon'
        radius: 5000       // 5km in meters
      };
      
      console.log('Testing nearby lapak with params:', params);
      
      const response = await apiClient.get('/lapak/nearby', { params });
      
      console.log('Nearby lapak response:', response);
      
      // Set response with success message
      setApiResponse({
        ...response,
        _testResult: `✅ Success: Found ${response.lapak?.length || 0} lapak nearby`,
        _testParams: params
      });
      
    } catch (error: any) {
      console.error('Nearby lapak test failed:', error);
      setError(`Nearby Lapak Error: ${error.message}`);
      // Still set response to see error details
      setApiResponse(error);
    }
    
    setIsLoading(false);
  };

  // Test login with hardcoded credentials
  const testLogin = async () => {
    setIsLoading(true);
    setCurrentTest('Login Test');
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/login', {
        email: 'test@warungwarga.com',
        password: 'TestPassword123!'
      });
      setApiResponse(response);
    } catch (err: any) {
      setError(`Login Error: ${err.message}`);
      // Still set response to see error details
      setApiResponse(err);
    }
    
    setIsLoading(false);
  };

  // Test borongan creation with authentication
  const testBoronganCreation = async () => {
    setIsLoading(true);
    setCurrentTest('Borongan Creation Test');
    setError(null);
    
    try {
      // First, try to get authentication status
      const token = localStorage.getItem('access_token');
      console.log('Testing borongan creation with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
      // Test borongan creation
      const boronganData = {
        title: "Test Borongan",
        description: "Test description for debugging",
        target_quantity: 10,
        price_per_unit: 15000,
        unit: "kg",
        pickup_point_address: "Test Address",
        product_type: "test"
      };
      
      console.log('Testing borongan creation with data:', boronganData);
      
      const response = await apiClient.post('/borongan/', boronganData);
      
      console.log('Borongan creation response:', response);
      
      setApiResponse({
        ...response,
        _testResult: '✅ Success: Borongan created successfully',
        _testData: boronganData
      });
      
    } catch (error: any) {
      console.error('Borongan creation test failed:', error);
      setError(`Borongan Creation Error: ${error.message}`);
      setApiResponse(error);
    }
    
    setIsLoading(false);
  };

  // Test get current user
  const testGetCurrentUser = async () => {
    setIsLoading(true);
    setCurrentTest('Get Current User Test');
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      console.log('Testing get current user with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
      const response = await apiClient.get('/users/me');
      
      console.log('Get current user response:', response);
      
      setApiResponse({
        ...response,
        _testResult: '✅ Success: Current user retrieved',
        _testToken: token ? 'Token Present' : 'Token Missing'
      });
      
    } catch (error: any) {
      console.error('Get current user test failed:', error);
      setError(`Get Current User Error: ${error.message}`);
      setApiResponse(error);
    }
    
    setIsLoading(false);
  };

  // Test lapak creation
  const testLapakCreation = async () => {
    setIsLoading(true);
    setCurrentTest('Lapak Creation Test');
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      console.log('Testing lapak creation with token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }
      
      // Create test lapak data
      const lapakData = {
        title: 'Test Produk API',
        description: 'Ini adalah produk test dari API testing page',
        price: 25000,
        unit: 'pcs',
        stock_quantity: 10
      };
      
      console.log('Sending lapak data:', lapakData);
      
      const formData = new FormData();
      Object.entries(lapakData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      const response = await apiClient.post('/lapak', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Lapak creation response:', response);
      
      setApiResponse({
        ...response,
        _testResult: '✅ Success: Lapak created successfully',
        _testData: lapakData
      });
      
    } catch (error: any) {
      console.error('Lapak creation test failed:', error);
      setError(`Lapak Creation Error: ${error.message}`);
      setApiResponse(error);
    }
    
    setIsLoading(false);
  };

  const testAuthenticationFlow = async () => {
    setIsLoading(true);
    setError('');
    setCurrentTest('Authentication Flow Test');
    
    try {
      // Check localStorage token
      const token = localStorage.getItem('access_token');
      console.log('🔑 Token in localStorage:', token ? 'EXISTS' : 'MISSING');
      
      if (!token) {
        setError('No token found in localStorage. Please login first.');
        return;
      }
      
      // Test getCurrentUser API call
      console.log('🚀 Testing getCurrentUser API...');
      const user = await getCurrentUser();
      console.log('✅ getCurrentUser successful:', user);
      
      // Check Zustand store state
      const authStore = useAuthStore.getState();
      console.log('🏪 Zustand auth store state:', {
        isAuthenticated: authStore.isAuthenticated,
        hasUser: !!authStore.user,
        isHydrated: authStore.isHydrated
      });
      
      if (!authStore.isAuthenticated || !authStore.user) {
        console.log('🔄 Updating Zustand store with current user...');
        authStore.loginAction(user, token);
      }
      
      setApiResponse({
        _testResult: '✅ Success: Authentication test successful! User session is valid.',
        _tokenStatus: token ? 'Token Present' : 'Token Missing',
        _userInfo: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        },
        _zustandState: {
          isAuthenticated: authStore.isAuthenticated,
          hasUser: !!authStore.user,
          isHydrated: authStore.isHydrated
        }
      });
    } catch (error: any) {
      console.error('❌ Authentication test failed:', error);
      setError(`Authentication failed: ${error.message}`);
      
      // Clear invalid session
      localStorage.removeItem('access_token');
      const authStore = useAuthStore.getState();
      authStore.logoutAction();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background page-padding py-5u">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-heading-1 mb-4u">🧪 API Testing Page</h1>
        <p className="text-body-large text-text-secondary mb-5u">
          Test koneksi dengan backend API Warung Warga untuk memastikan semua endpoint berfungsi dengan baik.
        </p>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2u mb-5u">
          <button
            onClick={testAPIConnection}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading && currentTest === 'API Connection' ? 'Testing...' : '🌐 Test API'}
          </button>
          
          <button
            onClick={testAPIInfo}
            disabled={isLoading}
            className="btn-secondary"
          >
            {isLoading && currentTest === 'API Info' ? 'Testing...' : '📊 API Info'}
          </button>
          
          <button
            onClick={testDBStatus}
            disabled={isLoading}
            className="btn-secondary"
          >
            {isLoading && currentTest === 'Database Status' ? 'Testing...' : '🗄️ DB Status'}
          </button>
          
          <button
            onClick={testNearbyLapak}
            disabled={isLoading}
            className="btn-secondary"
          >
            {isLoading && currentTest === 'Nearby Lapak Test' ? 'Testing...' : '🏪 Nearby Lapak'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="btn-secondary"
          >
            {isLoading && currentTest === 'Login Test' ? 'Testing...' : '🔐 Test Login'}
          </button>
        </div>

        {/* Authentication-Required Tests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2u mb-5u">
          <button
            onClick={testAuthenticationFlow}
            disabled={isLoading}
            className="btn-warning"
          >
            {isLoading && currentTest === 'Authentication Flow Test' ? 'Testing...' : '🔐 Auth Flow Test'}
          </button>
          
          <button
            onClick={testGetCurrentUser}
            disabled={isLoading}
            className="btn-outline"
          >
            {isLoading && currentTest === 'Get Current User Test' ? 'Testing...' : '👤 Get Current User'}
          </button>
          
          <button
            onClick={testBoronganCreation}
            disabled={isLoading}
            className="btn-outline"
          >
            {isLoading && currentTest === 'Borongan Creation Test' ? 'Testing...' : '📦 Test Borongan'}
          </button>
          
          <button
            onClick={testLapakCreation}
            disabled={isLoading}
            className="btn-outline"
          >
            {isLoading && currentTest === 'Lapak Creation Test' ? 'Testing...' : '🏪 Test Lapak'}
          </button>
        </div>

        {/* Current Test Info */}
        {isLoading && (
          <div className="card mb-4u">
            <div className="p-4u">
              <div className="flex items-center gap-2u">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-body-large">Testing {currentTest}...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="card mb-4u">
            <div className="p-4u">
              <h3 className="text-heading-2 text-error mb-2u">❌ Error</h3>
              <p className="text-body-small text-error">{error}</p>
            </div>
          </div>
        )}

        {/* API Response Display */}
        {apiResponse && (
          <div className="card">
            <div className="p-4u">
              <h3 className="text-heading-2 mb-2u">✅ API Response ({currentTest})</h3>
              <div className="bg-border rounded-input p-3u overflow-auto">
                <pre className="text-caption whitespace-pre-wrap">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* API Documentation Reference */}
        <div className="card mt-5u">
          <div className="p-4u">
            <h3 className="text-heading-2 mb-2u">📚 API Reference</h3>
            <div className="text-body-small text-text-secondary space-y-1u">
              <p><strong>Production URL:</strong> https://warungwarga-api.azurewebsites.net</p>
              <p><strong>Interactive Docs:</strong> <a href="https://warungwarga-api.azurewebsites.net/docs" target="_blank" className="text-primary hover:underline">Swagger UI</a></p>
              <p><strong>Total Endpoints:</strong> 19 fully functional endpoints</p>
              <p><strong>Status:</strong> Production Ready with Real Routers Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 