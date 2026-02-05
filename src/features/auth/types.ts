export interface User {
  username: string;
  email: string;
  password_changed_at: string;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  session_id: string;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
  full_name: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface LogoutRequest {
  refresh_token: string;
}
