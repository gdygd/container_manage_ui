import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import { useAuthStore } from './store';
import type { LoginRequest, RegisterRequest } from './types';
import { createApiError } from '../../api/error';

export { useAuthStore };

export function useLogin() {
  const { setAuth } = useAuthStore();

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
          // API 에러 무시, 로컬 상태는 항상 클리어
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
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  return {
    isAuthenticated,
    user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
