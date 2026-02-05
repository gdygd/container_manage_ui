import { http } from '../../api/http';
import type { ApiResponse } from '../../types';
import type { Host } from './types';

export const hostsApi = {
  getHosts: () => http.get<ApiResponse<Host[]>>('/docker/hosts'),
};
