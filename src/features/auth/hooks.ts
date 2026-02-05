import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import type { AuthState, User, LoginRequest, RegisterRequest } from './types';
import { createApiError } from '../../api/error';

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
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
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        }),

      clearAuth: () => set(initialState),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.user, response.access_token, response.refresh_token);
    },
  });
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        try {
          await authApi.logout({ refresh_token: refreshToken });
        } catch {
          // Ignore logout API errors
        }
      }
    },
    onSettled: () => {
      clearAuth();
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onError: (error) => createApiError(error),
  });
}

export function useAuth() {
  const { isAuthenticated, user, accessToken, refreshToken } = useAuthStore();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  return {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    register: registerMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
