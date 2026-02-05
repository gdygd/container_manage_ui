import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_BASE_URL } from '../api/config';

interface User {
  username: string;
  email: string;
  password_changed_at: string;
  created_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
}

interface RegisterData {
  username: string;
  password: string;
  full_name: string;
  email: string;
}

interface LoginResponse {
  session_id: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, user: null, accessToken: null, refreshToken: null };
      }
    }
    return { isAuthenticated: false, user: null, accessToken: null, refreshToken: null };
  });

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Login failed' };
      }
    } catch {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  const logout = async () => {
    if (authState.refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ refresh_token: authState.refreshToken }),
        });
      } catch {
        // Ignore logout API errors
      }
    }
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch {
      return { success: false, message: 'Failed to connect to server' };
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
