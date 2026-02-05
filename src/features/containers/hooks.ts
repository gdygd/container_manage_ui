import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { containersApi } from './api';
import type { ContainerActionRequest } from './types';

export const containerKeys = {
  all: ['containers'] as const,
  lists: () => [...containerKeys.all, 'list'] as const,
  list: (host: string) => [...containerKeys.lists(), host] as const,
  details: () => [...containerKeys.all, 'detail'] as const,
  detail: (host: string, id: string) => [...containerKeys.details(), host, id] as const,
};

export function useContainers(host: string) {
  return useQuery({
    queryKey: containerKeys.list(host),
    queryFn: () => containersApi.getContainers(host),
    enabled: !!host,
    select: (data) => data.data,
  });
}

export function useContainerInspect(host: string, containerId: string | null) {
  return useQuery({
    queryKey: containerKeys.detail(host, containerId ?? ''),
    queryFn: () => containersApi.inspectContainer(host, containerId!),
    enabled: !!host && !!containerId,
    select: (data) => data.data,
  });
}

export function useStartContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerActionRequest) => containersApi.startContainer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: containerKeys.list(variables.host) });
    },
  });
}

export function useStopContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerActionRequest) => containersApi.stopContainer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: containerKeys.list(variables.host) });
    },
  });
}
