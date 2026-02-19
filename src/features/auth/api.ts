import { http } from '../../api/http';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
} from './types';

export const authApi = {
  login: (data: LoginRequest) =>
      http.post<LoginResponse>('/auth/login', data),  

  logout: (data: LogoutRequest) =>
    http.post<void>('/auth/logout', data),

  register: (data: RegisterRequest) =>
    http.post<RegisterResponse>('/auth/user', data),
};
