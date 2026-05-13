import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usersApi, rolesApi, companiesApi, areasApi } from '@/api';
import type { User, Role, Company, Area } from '@/api/types';

interface UsersState {
  users: User[];
  roles: Role[];
  companies: Company[];
  areas: Area[];
  loading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  fetchAreas: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getRoleById: (id: string) => Role | undefined;
  getAreaById: (id: string) => Area | undefined;
  createUser: (user: Partial<User>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      roles: [],
      companies: [],
      areas: [],
      loading: false,
      error: null,

      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          const users = await usersApi.getAll();
          set({ users, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar usuarios', loading: false });
        }
      },

      fetchRoles: async () => {
        set({ loading: true, error: null });
        try {
          const roles = await rolesApi.getAll();
          set({ roles, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar roles', loading: false });
        }
      },

      fetchCompanies: async () => {
        set({ loading: true, error: null });
        try {
          const companies = await companiesApi.getAll();
          set({ companies, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar empresas', loading: false });
        }
      },

      fetchAreas: async () => {
        set({ loading: true, error: null });
        try {
          const areas = await areasApi.getAll();
          set({ areas, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar áreas', loading: false });
        }
      },

      getUserById: (id: string) => {
        return get().users.find(user => user.id === id);
      },

      getRoleById: (id: string) => {
        return get().roles.find(role => role.id === id);
      },

      getAreaById: (id: string) => {
        return get().areas.find(area => area.id === id);
      },

      createUser: async (userData: Partial<User>) => {
        set({ loading: true, error: null });
        try {
          const newUser = await usersApi.create(userData);
          set(state => ({
            users: [...state.users, newUser],
            loading: false,
          }));
          return newUser;
        } catch (error) {
          set({ error: 'Error al crear usuario', loading: false });
          throw error;
        }
      },

      updateUser: async (id: string, data: Partial<User>) => {
        set({ loading: true, error: null });
        try {
          const updatedUser = await usersApi.update(id, data);
          set(state => ({
            users: state.users.map(user => 
              user.id === id ? updatedUser : user
            ),
            loading: false,
          }));
          return updatedUser;
        } catch (error) {
          set({ error: 'Error al actualizar usuario', loading: false });
          throw error;
        }
      },

      deleteUser: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await usersApi.delete(id);
          set(state => ({
            users: state.users.filter(user => user.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: 'Error al eliminar usuario', loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'users-storage',
      partialize: (state) => ({
        users: state.users,
        roles: state.roles,
        companies: state.companies,
        areas: state.areas,
      }),
    }
  )
);
