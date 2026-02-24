import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: (user, accessToken, refreshToken) =>
        set({ isAuthenticated: true, user, accessToken, refreshToken }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      // accessToken은 in-memory만 → persist 제외
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,        
      }),
    }
  )
);
