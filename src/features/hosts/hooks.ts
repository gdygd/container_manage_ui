import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hostsApi } from './api';
import { useHostsStore } from './store';

export const hostKeys = {
  all: ['hosts'] as const,
  list: () => [...hostKeys.all, 'list'] as const,
};

export function useHosts() {
  const setHosts = useHostsStore((state) => state.setHosts);

  const query = useQuery({
    queryKey: hostKeys.list(),
    queryFn: () => hostsApi.getHosts(),
    select: (data) => data.data,
  });

  useEffect(() => {
    if (query.data) {
      setHosts(query.data);
    }
  }, [query.data, setHosts]);

  return query;
}
