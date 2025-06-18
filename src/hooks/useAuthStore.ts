import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types for our auth state
interface User {
  id: string
  email: string
  full_name: string
  address?: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  login: (token: string, userData: User) => void
  logout: () => void
  setUser: (userData: User) => void
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (token: string, userData: User) => {
        set({
          token,
          user: userData,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      setUser: (userData: User) => {
        set((state) => ({
          user: userData,
          // Keep other state unchanged
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }))
      },
    }),
    {
      name: 'warung-warga-auth', // Key for localStorage
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 