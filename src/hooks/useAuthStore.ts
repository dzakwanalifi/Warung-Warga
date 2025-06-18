import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  loginAction: (user: User, token: string) => void;
  logoutAction: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      loginAction: (user: User, token: string) => {
        console.log('Auth Store: loginAction called', { user: user.email, hasToken: !!token });
        
        // Store token in localStorage for API requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token);
        }
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Debug: log state after update
        const newState = get();
        console.log('Auth Store: State updated', { 
          isAuthenticated: newState.isAuthenticated, 
          userName: newState.user?.full_name 
        });
      },

      logoutAction: () => {
        console.log('Auth Store: logoutAction called');
        
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        console.log('Auth Store: Logged out successfully');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on client side
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        // Don't persist loading state and hydration state
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Zustand: Rehydration completed', state);
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
); 