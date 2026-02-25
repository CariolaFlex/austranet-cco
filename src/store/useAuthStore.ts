// ============================================================
// Austranet CCO - Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from 'firebase/auth';
import { Usuario, RolUsuario } from '@/types';

interface AuthState {
  // State
  user: Usuario | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: Usuario | null) => void;
  setFirebaseUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Computed helpers
  isAdmin: () => boolean;
  hasRole: (roles: RolUsuario[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = user !== null;
          state.error = null;
        }),

      setFirebaseUser: (firebaseUser) =>
        set((state) => {
          state.firebaseUser = firebaseUser;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.firebaseUser = null;
          state.isAuthenticated = false;
          state.error = null;
        }),

      // Permission helpers
      isAdmin: () => {
        const { user } = get();
        return user?.rol === 'admin';
      },

      hasRole: (roles: RolUsuario[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.rol);
      },
    })),
    {
      name: 'austranet-cco-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
              nombre: state.user.nombre,
              rol: state.user.rol,
              activo: state.user.activo,
              creadoEn: state.user.creadoEn,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
