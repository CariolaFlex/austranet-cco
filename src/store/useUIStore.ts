// ============================================================
// Austranet CCO - UI Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Theme = 'light' | 'dark' | 'system';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;

  // Theme
  theme: Theme;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string;

  // Notifications
  notifications: Notification[];

  // Command palette
  commandPaletteOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;

  setTheme: (theme: Theme) => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;

  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'system',
      globalLoading: false,
      loadingMessage: '',
      notifications: [],
      commandPaletteOpen: false,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),

      setSidebarCollapsed: (collapsed) =>
        set((state) => {
          state.sidebarCollapsed = collapsed;
        }),

      toggleMobileSidebar: () =>
        set((state) => {
          state.sidebarMobileOpen = !state.sidebarMobileOpen;
        }),

      setMobileSidebarOpen: (open) =>
        set((state) => {
          state.sidebarMobileOpen = open;
        }),

      // Theme actions
      setTheme: (theme) =>
        set((state) => {
          state.theme = theme;
        }),

      // Loading actions
      setGlobalLoading: (loading, message = '') =>
        set((state) => {
          state.globalLoading = loading;
          state.loadingMessage = message;
        }),

      // Notification actions
      addNotification: (notification) =>
        set((state) => {
          const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          state.notifications.push({ ...notification, id });
        }),

      removeNotification: (id) =>
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }),

      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
        }),

      // Command palette actions
      openCommandPalette: () =>
        set((state) => {
          state.commandPaletteOpen = true;
        }),

      closeCommandPalette: () =>
        set((state) => {
          state.commandPaletteOpen = false;
        }),

      toggleCommandPalette: () =>
        set((state) => {
          state.commandPaletteOpen = !state.commandPaletteOpen;
        }),
    })),
    {
      name: 'austranet-cco-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
