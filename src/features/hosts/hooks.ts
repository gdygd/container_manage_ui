import { useQuery } from '@tanstack/react-query';
import { hostsApi } from './api';

export const hostKeys = {
  all: ['hosts'] as const,
  list: () => [...hostKeys.all, 'list'] as const,
};

export function useHosts() {
  return useQuery({
    queryKey: hostKeys.list(),
    queryFn: () => hostsApi.getHosts(),
    select: (data) => data.data,
  });
}
