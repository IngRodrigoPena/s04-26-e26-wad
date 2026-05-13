"use client";

import { create } from "zustand";
import { usersApi } from "@/api";
import type { User } from "@/api/types";

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  createUser: (user: Omit<User, "id" | "created_at" | "updated_at">) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  
  // Filters
  getUsersByRole: (roleId: string) => User[];
  getUsersByArea: (areaId: string) => User[];
  getUsersByCompany: (companyId: string) => User[];
  getActiveUsers: () => User[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersApi.getAll();
      set({ users, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar usuarios",
        isLoading: false 
      });
    }
  },

  getUserById: (id: string) => {
    return get().users.find(user => user.id === id);
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await usersApi.create(userData);
      set(state => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
      return newUser;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al crear usuario",
        isLoading: false 
      });
      throw error;
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await usersApi.update(id, data);
      set(state => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        isLoading: false
      }));
      return updatedUser;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al actualizar usuario",
        isLoading: false 
      });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await usersApi.delete(id);
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al eliminar usuario",
        isLoading: false 
      });
      throw error;
    }
  },

  getUsersByRole: (roleId: string) => {
    return get().users.filter(user => user.id_role === roleId);
  },

  getUsersByArea: (areaId: string) => {
    return get().users.filter(user => user.id_area === areaId);
  },

  getUsersByCompany: (companyId: string) => {
    return get().users.filter(user => user.id_company === companyId);
  },

  getActiveUsers: () => {
    return get().users.filter(user => user.is_active);
  },
}));
