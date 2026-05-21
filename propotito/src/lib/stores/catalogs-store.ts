"use client";

import { create } from "zustand";
import { 
  rolesApi, 
  areasApi, 
  statusApi, 
  prioritiesApi, 
  typesApi,
  companiesApi 
} from "@/api";
import type { RoleEntity as Role, Area, Status, PriorityLegacy as Priority, Type, Company } from "@/api/types";

interface CatalogsState {
  roles: Role[];
  areas: Area[];
  statuses: Status[];
  priorities: Priority[];
  types: Type[];
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAllCatalogs: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchAreas: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
  fetchPriorities: () => Promise<void>;
  fetchTypes: () => Promise<void>;
  fetchCompanies: () => Promise<void>;
  
  // Getters
  getRoleById: (id: string) => Role | undefined;
  getAreaById: (id: string) => Area | undefined;
  getStatusById: (id: string) => Status | undefined;
  getPriorityById: (id: string) => Priority | undefined;
  getTypeById: (id: string) => Type | undefined;
  getCompanyById: (id: string) => Company | undefined;
}

export const useCatalogsStore = create<CatalogsState>((set, get) => ({
  roles: [],
  areas: [],
  statuses: [],
  priorities: [],
  types: [],
  companies: [],
  isLoading: false,
  error: null,

  fetchAllCatalogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const [roles, areas, statuses, priorities, types, companies] = await Promise.all([
        rolesApi.getAll(),
        areasApi.getAll(),
        statusApi.getAll(),
        prioritiesApi.getAll(),
        typesApi.getAll(),
        companiesApi.getAll(),
      ]);
      
      set({ 
        roles, 
        areas, 
        statuses, 
        priorities, 
        types,
        companies,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar catálogos",
        isLoading: false 
      });
    }
  },

  fetchRoles: async () => {
    try {
      const roles = await rolesApi.getAll();
      set({ roles });
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  },

  fetchAreas: async () => {
    try {
      const areas = await areasApi.getAll();
      set({ areas });
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  },

  fetchStatuses: async () => {
    try {
      const statuses = await statusApi.getAll();
      set({ statuses });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  },

  fetchPriorities: async () => {
    try {
      const priorities = await prioritiesApi.getAll();
      set({ priorities });
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  },

  fetchTypes: async () => {
    try {
      const types = await typesApi.getAll();
      set({ types });
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  },

  fetchCompanies: async () => {
    try {
      const companies = await companiesApi.getAll();
      set({ companies });
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  },

  getRoleById: (id: string | number) => {
    return get().roles.find(role => String(role.id) === String(id));
  },

  getAreaById: (id: string | number) => {
    return get().areas.find(area => String(area.id) === String(id));
  },

  getStatusById: (id: string | number) => {
    return get().statuses.find(status => String(status.id) === String(id));
  },

  getPriorityById: (id: string | number) => {
    return get().priorities.find(priority => String(priority.id) === String(id));
  },

  getTypeById: (id: string | number) => {
    return get().types.find(type => String(type.id) === String(id));
  },

  getCompanyById: (id: string | number) => {
    return get().companies.find(company => String(company.id) === String(id));
  },
}));
