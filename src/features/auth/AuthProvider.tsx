import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from './store';
import { authApi } from './api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const { refreshToken, setAccessToken, clearAuth } = useAuthStore();

  useEffect(() => {
    async function initializeAuth() {
      if (!refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authApi.renewAccessToken({ refresh_token: refreshToken });
        setAccessToken(response.access_token);
      } catch {
        // refresh token 만료 또는 유효하지 않으면 로그아웃
        clearAuth();
      } finally {
        setIsInitializing(false);
      }
    }

    initializeAuth();
  }, []);

  if (isInitializing) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
}
