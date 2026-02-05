import { http } from '../../api/http';
import type { ApiResponse } from '../../types';
import type { Container, InspectData, ContainerActionRequest, ContainerStatsResponse } from './types';

export const containersApi = {
  getContainers: (host: string) =>
    http.get<ApiResponse<Container[]>>(`/docker/ps2/${host}`),

  startContainer: (data: ContainerActionRequest) =>
    http.post<ApiResponse<null>>('/docker/start2', data),

  stopContainer: (data: ContainerActionRequest) =>
    http.post<ApiResponse<null>>('/docker/stop2', data),

  inspectContainer: (host: string, containerId: string) =>
    http.get<ApiResponse<InspectData>>(`/docker/inspect2/${host}/${containerId}`),

  getStats: (host: string) =>
    http.get<ContainerStatsResponse>(`/docker/stat3/${host}`),
};
