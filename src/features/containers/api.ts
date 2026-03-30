import { http } from '../../api/http';
import type { ApiResponse } from '../../types';
import type { Container, InspectData, ContainerActionRequest, ContainerStatsResponse } from './types';

const AGENT_ID = 1;
const isAws = import.meta.env.VITE_OPR_MODE === 'aws';

export const containersApi = {
  getContainers: (hostId: number) =>
    isAws
      ? http.get<ApiResponse<Container[]>>(`/docker/ps2/${AGENT_ID}/${hostId}`)
      : http.get<ApiResponse<Container[]>>(`/docker/ps2/${hostId}`),

  startContainer: (data: ContainerActionRequest) =>
    isAws
      ? http.post<ApiResponse<null>>('/docker/start2', { ...data, agentId: AGENT_ID })
      : http.post<ApiResponse<null>>('/docker/start2', data),

  stopContainer: (data: ContainerActionRequest) =>
    isAws
      ? http.post<ApiResponse<null>>('/docker/stop2', { ...data, agentId: AGENT_ID })
      : http.post<ApiResponse<null>>('/docker/stop2', data),

  inspectContainer: (hostId: number, containerId: string) =>
    isAws
      ? http.get<ApiResponse<InspectData>>(`/docker/inspect2/${AGENT_ID}/${hostId}/${containerId}`)
      : http.get<ApiResponse<InspectData>>(`/docker/inspect2/${hostId}/${containerId}`),

  getStats: (hostId: number) =>
    isAws
      ? http.get<ContainerStatsResponse>(`/docker/stat3/${AGENT_ID}/${hostId}`)
      : http.get<ContainerStatsResponse>(`/docker/stat3/${hostId}`),
};
