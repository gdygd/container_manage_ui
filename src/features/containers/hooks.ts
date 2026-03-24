import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { containersApi } from './api';
import type { ContainerActionRequest } from './types';

export const containerKeys = {
  all: ['containers'] as const,
  lists: () => [...containerKeys.all, 'list'] as const,
  list: (hostId: number) => [...containerKeys.lists(), hostId] as const,
  details: () => [...containerKeys.all, 'detail'] as const,
  detail: (hostId: number, id: string) => [...containerKeys.details(), hostId, id] as const,
  stats: () => [...containerKeys.all, 'stats'] as const,
  stat: (hostId: number) => [...containerKeys.stats(), hostId] as const,
};

export function useContainers(hostId: number | null) {
  return useQuery({
    queryKey: containerKeys.list(hostId ?? 0),
    queryFn: () => containersApi.getContainers(hostId!),
    enabled: hostId !== null,
    select: (data) => data.data,
  });
}

export function useContainerInspect(hostId: number | null, containerId: string | null) {
  return useQuery({
    queryKey: containerKeys.detail(hostId ?? 0, containerId ?? ''),
    queryFn: () => containersApi.inspectContainer(hostId!, containerId!),
    enabled: hostId !== null && !!containerId,
    select: (data) => data.data,
  });
}

export function useStartContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerActionRequest) => containersApi.startContainer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: containerKeys.list(variables.hostId) });
    },
  });
}

export function useStopContainer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContainerActionRequest) => containersApi.stopContainer(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: containerKeys.list(variables.hostId) });
    },
  });
}

export function useContainerStats(hostId: number | null, refetchInterval?: number) {
  return useQuery({
    queryKey: containerKeys.stat(hostId ?? 0),
    queryFn: () => containersApi.getStats(hostId!),
    enabled: hostId !== null,
    select: (data) => {
      if (!data.data) return [];
      return Object.values(data.data);
    },
    refetchInterval: refetchInterval ?? 5000,
  });
}
