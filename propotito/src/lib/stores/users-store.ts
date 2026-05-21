"use client";

import { create } from "zustand";
import { usersApi } from "@/api";
import type { UserResponseDTO, CreateUserRequestDTO } from "@/api/types";

type User = UserResponseDTO;

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  createUser: (user: CreateUserRequestDTO) => Promise<User>;
  // Nota: updateUser y deleteUser no están disponibles en el API actual
  // updateUser: (id: string, data: Partial<User>) => Promise<User>;
  // deleteUser: (id: string) => Promise<boolean>;
  
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
      set({ users: users as User[], isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar usuarios",
        isLoading: false 
      });
    }
  },

  getUserById: (id: string) => {
    return get().users.find(user => String(user.id) === id);
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await usersApi.create(userData);
      set(state => ({ 
        users: [...state.users, newUser as User],
        isLoading: false 
      }));
      return newUser as User;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al crear usuario",
        isLoading: false 
      });
      throw error;
    }
  },

  // Nota: updateUser y deleteUser no están disponibles en el API actual

  getUsersByRole: (roleId: string) => {
    return get().users.filter(user => user.role === roleId);
  },

  getUsersByArea: (areaId: string) => {
    // Campo no disponible en UserResponseDTO
    return [];
  },

  getUsersByCompany: (companyId: string) => {
    // Campo no disponible en UserResponseDTO
    return [];
  },

  getActiveUsers: () => {
    return get().users.filter(user => user.active);
  },
}));
