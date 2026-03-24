import { create } from 'zustand';
import type { Host } from './types';

interface HostsState {
  hosts: Host[];
  setHosts: (hosts: Host[]) => void;
}

export const useHostsStore = create<HostsState>((set) => ({
  hosts: [],
  setHosts: (hosts) => set({ hosts }),
}));
