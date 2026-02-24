import { http } from '../../api/http';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  RenewAccessTokenRequest,
  RenewAccessTokenResponse,
} from './types';

export const authApi = {
  login: (data: LoginRequest) =>
    http.post<LoginResponse>('/auth/login', data, { skipAuth: true }),

  logout: (data: LogoutRequest) =>
    http.post<void>('/auth/logout', data),

  register: (data: RegisterRequest) =>
    http.post<RegisterResponse>('/auth/user', data, { skipAuth: true }),

  renewAccessToken: (data: RenewAccessTokenRequest) =>
    http.post<RenewAccessTokenResponse>('/auth/token/renew_access', data, { skipAuth: true }),
};
