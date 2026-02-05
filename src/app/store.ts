import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'containers' | 'stats' | 'events' | 'hosts';

interface AppState {
  currentView: ViewType;
  showDetail: boolean;
  sidebarCollapsed: boolean;
}

interface AppActions {
  setCurrentView: (view: ViewType) => void;
  toggleDetail: () => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      currentView: 'containers',
      showDetail: false,
      sidebarCollapsed: false,

      setCurrentView: (view) => set({ currentView: view }),
      toggleDetail: () => set((state) => ({ showDetail: !state.showDetail })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
