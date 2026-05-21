import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi } from '@/api';
import type { LoginRequestDTO, UserResponseDTO } from '@/api/auth/types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponseDTO | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequestDTO) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: UserResponseDTO) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (credentials: LoginRequestDTO) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          
          // Guardar token
          authApi.setToken(response.token);
          
          set({
            isAuthenticated: true,
            token: response.token,
            loading: false,
            error: null,
          });

          // Después del login, obtener datos del usuario actual
          try {
            const currentUser = await usersApi.me();
            set({ user: currentUser });
          } catch (e) {
            console.error('Error fetching user data:', e);
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error al iniciar sesión',
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        authApi.removeToken();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const currentUser = await usersApi.me();
          set({ user: currentUser });
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      },

      setUser: (user: UserResponseDTO) => {
        set({ user });
      },
    }),
    {
      name: 'opscore-auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);
