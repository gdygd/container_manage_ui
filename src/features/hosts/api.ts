import { http } from '../../api/http';
import type { ApiResponse } from '../../types';
import type { Host } from './types';

const AGENT_ID = 1;
const isAws = import.meta.env.VITE_OPR_MODE === 'aws';

export const hostsApi = {
  getHosts: () => 
    isAws
      ? http.get<ApiResponse<Host[]>>(`/docker/hosts/${AGENT_ID}`)
      : http.get<ApiResponse<Host[]>>('/docker/hosts')
};
