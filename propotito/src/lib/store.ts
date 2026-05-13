"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: "operario" | "supervisor" | "gerente";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "propotito-auth",
    }
  )
);

// Tipos para el sistema de incidentes
export type IncidentStatus = "abierto" | "en_proceso" | "cerrado";
export type IncidentType = "falla_maquina" | "accidente" | "desviacion_calidad" | "otro";
export type IncidentPriority = "baja" | "media" | "alta" | "critica";
export type IncidentArea = "produccion" | "mantenimiento" | "calidad" | "seguridad" | "logistica";

export interface Incident {
  id: string;
  tipo: IncidentType;
  area: IncidentArea;
  prioridad: IncidentPriority;
  titulo: string;
  descripcion: string;
  estado: IncidentStatus;
  reportadoPor: string;
  reportadoPorNombre: string;
  asignadoA?: string;
  asignadoANombre?: string;
  solucion?: string;
  causaRaiz?: string;
  fechaCreacion: string;
  fechaAsignacion?: string;
  fechaCierre?: string;
  tiempoResolucion?: number; // en minutos
  ubicacion?: string;
  imagenes?: string[];
}

interface IncidentState {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, "id" | "fechaCreacion" | "estado">) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  assignIncident: (id: string, tecnicoId: string, tecnicoNombre: string) => void;
  closeIncident: (id: string, solucion: string, causaRaiz?: string) => void;
  getIncidentsByStatus: (status: IncidentStatus) => Incident[];
  getIncidentsByArea: (area: IncidentArea) => Incident[];
  getIncidentStats: () => {
    total: number;
    abiertos: number;
    enProceso: number;
    cerrados: number;
    tiempoPromedioResolucion: number;
    porTipo: Record<IncidentType, number>;
    porArea: Record<IncidentArea, number>;
    porPrioridad: Record<IncidentPriority, number>;
  };
}

export const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: [],
      
      addIncident: (incident) => {
        const newIncident: Incident = {
          ...incident,
          id: `INC-${Date.now()}`,
          estado: "abierto",
          fechaCreacion: new Date().toISOString(),
        };
        set((state) => ({ incidents: [...state.incidents, newIncident] }));
      },

      updateIncident: (id, updates) => {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, ...updates } : inc
          ),
        }));
      },

      assignIncident: (id, tecnicoId, tecnicoNombre) => {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  estado: "en_proceso" as IncidentStatus,
                  asignadoA: tecnicoId,
                  asignadoANombre: tecnicoNombre,
                  fechaAsignacion: new Date().toISOString(),
                }
              : inc
          ),
        }));
      },

      closeIncident: (id, solucion, causaRaiz) => {
        set((state) => ({
          incidents: state.incidents.map((inc) => {
            if (inc.id === id) {
              const fechaCierre = new Date().toISOString();
              const tiempoResolucion = Math.floor(
                (new Date(fechaCierre).getTime() -
                  new Date(inc.fechaCreacion).getTime()) /
                  60000
              );
              return {
                ...inc,
                estado: "cerrado" as IncidentStatus,
                solucion,
                causaRaiz,
                fechaCierre,
                tiempoResolucion,
              };
            }
            return inc;
          }),
        }));
      },

      getIncidentsByStatus: (status) => {
        return get().incidents.filter((inc) => inc.estado === status);
      },

      getIncidentsByArea: (area) => {
        return get().incidents.filter((inc) => inc.area === area);
      },

      getIncidentStats: () => {
        const incidents = get().incidents;
        const cerrados = incidents.filter((inc) => inc.estado === "cerrado");
        
        const tiempoPromedioResolucion =
          cerrados.length > 0
            ? cerrados.reduce((acc, inc) => acc + (inc.tiempoResolucion || 0), 0) /
              cerrados.length
            : 0;

        const porTipo = incidents.reduce((acc, inc) => {
          acc[inc.tipo] = (acc[inc.tipo] || 0) + 1;
          return acc;
        }, {} as Record<IncidentType, number>);

        const porArea = incidents.reduce((acc, inc) => {
          acc[inc.area] = (acc[inc.area] || 0) + 1;
          return acc;
        }, {} as Record<IncidentArea, number>);

        const porPrioridad = incidents.reduce((acc, inc) => {
          acc[inc.prioridad] = (acc[inc.prioridad] || 0) + 1;
          return acc;
        }, {} as Record<IncidentPriority, number>);

        return {
          total: incidents.length,
          abiertos: incidents.filter((inc) => inc.estado === "abierto").length,
          enProceso: incidents.filter((inc) => inc.estado === "en_proceso").length,
          cerrados: cerrados.length,
          tiempoPromedioResolucion,
          porTipo,
          porArea,
          porPrioridad,
        };
      },
    }),
    {
      name: "propotito-incidents",
    }
  )
);

// Tipos para i18n
export type Language = "es" | "en" | "pt";

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "es",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "propotito-i18n",
    }
  )
);