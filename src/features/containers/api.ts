import { http } from '../../api/http';
import type { ApiResponse } from '../../types';
import type { Container, InspectData, ContainerActionRequest, ContainerStatsResponse } from './types';

export const containersApi = {
  getContainers: (hostId: number) =>
    http.get<ApiResponse<Container[]>>(`/docker/ps2/${hostId}`),

  startContainer: (data: ContainerActionRequest) =>
    http.post<ApiResponse<null>>('/docker/start2', data),

  stopContainer: (data: ContainerActionRequest) =>
    http.post<ApiResponse<null>>('/docker/stop2', data),

  inspectContainer: (hostId: number, containerId: string) =>
    http.get<ApiResponse<InspectData>>(`/docker/inspect2/${hostId}/${containerId}`),

  getStats: (hostId: number) =>
    http.get<ContainerStatsResponse>(`/docker/stat3/${hostId}`),
};
