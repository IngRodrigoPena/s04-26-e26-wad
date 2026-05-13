"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { incidentsApi } from "@/api";
import type { Incident } from "@/api/types";

interface IncidentsState {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  
  fetchIncidents: () => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  createIncident: (incident: Partial<Incident>) => Promise<Incident>;
  updateIncident: (id: string, data: Partial<Incident>) => Promise<Incident>;
  assignIncident: (id: string, technicalId: string, supervisorId: string) => Promise<Incident>;
  closeIncident: (id: string, solution: string, rootCause: string) => Promise<Incident>;
  deleteIncident: (id: string) => Promise<boolean>;
  
  getIncidentsByStatus: (statusId: string) => Incident[];
  getIncidentsByPriority: (priorityId: string) => Incident[];
  getIncidentsByType: (typeId: string) => Incident[];
  getIncidentsByArea: (areaId: string) => Incident[];
  getIncidentsByTechnical: (technicalId: string) => Incident[];
  getIncidentsBySupervisor: (supervisorId: string) => Incident[];
  getActiveIncidents: () => Incident[];
  
  getIncidentStats: () => {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    byArea: Record<string, number>;
    avgResolutionTime: number;
  };
}

export const useIncidentsStore = create<IncidentsState>()(
  persist(
    (set, get) => ({
      incidents: [],
      isLoading: false,
      error: null,

      fetchIncidents: async () => {
        set({ isLoading: true, error: null });
        try {
          const incidents = await incidentsApi.getAll();
          set({ incidents, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al cargar incidentes",
            isLoading: false 
          });
        }
      },

      getIncidentById: (id: string) => {
        return get().incidents.find(incident => incident.id === id);
      },

      createIncident: async (incidentData) => {
        set({ isLoading: true, error: null });
        try {
          const newIncident = await incidentsApi.create(incidentData);
          set(state => ({ 
            incidents: [...state.incidents, newIncident],
            isLoading: false 
          }));
          return newIncident;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al crear incidente",
            isLoading: false 
          });
          throw error;
        }
      },

      updateIncident: async (id: string, data: Partial<Incident>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.update(id, data);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            isLoading: false
          }));
          return updatedIncident;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al actualizar incidente",
            isLoading: false 
          });
          throw error;
        }
      },

      assignIncident: async (id: string, technicalId: string, supervisorId: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.assign(id, technicalId, supervisorId);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            isLoading: false
          }));
          return updatedIncident;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al asignar incidente",
            isLoading: false 
          });
          throw error;
        }
      },

      closeIncident: async (id: string, solution: string, rootCause: string) => {
        set({ isLoading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.close(id, solution, rootCause);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            isLoading: false
          }));
          return updatedIncident;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al cerrar incidente",
            isLoading: false 
          });
          throw error;
        }
      },

      deleteIncident: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await incidentsApi.delete(id);
          set(state => ({
            incidents: state.incidents.filter(incident => incident.id !== id),
            isLoading: false
          }));
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Error al eliminar incidente",
            isLoading: false 
          });
          throw error;
        }
      },

      getIncidentsByStatus: (statusId: string) => {
        return get().incidents.filter(incident => incident.id_status === statusId);
      },

      getIncidentsByPriority: (priorityId: string) => {
        return get().incidents.filter(incident => incident.id_priority === priorityId);
      },

      getIncidentsByType: (typeId: string) => {
        return get().incidents.filter(incident => incident.id_type === typeId);
      },

      getIncidentsByArea: (areaId: string) => {
        return get().incidents.filter(incident => incident.id_area === areaId);
      },

      getIncidentsByTechnical: (technicalId: string) => {
        return get().incidents.filter(incident => incident.id_technical === technicalId);
      },

      getIncidentsBySupervisor: (supervisorId: string) => {
        return get().incidents.filter(incident => incident.id_supervisor === supervisorId);
      },

      getActiveIncidents: () => {
        return get().incidents.filter(incident => incident.is_active);
      },

      getIncidentStats: () => {
        const incidents = get().incidents;
        
        const byStatus = incidents.reduce((acc, inc) => {
          acc[inc.id_status] = (acc[inc.id_status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byPriority = incidents.reduce((acc, inc) => {
          acc[inc.id_priority] = (acc[inc.id_priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byType = incidents.reduce((acc, inc) => {
          acc[inc.id_type] = (acc[inc.id_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byArea = incidents.reduce((acc, inc) => {
          acc[inc.id_area] = (acc[inc.id_area] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const closedIncidents = incidents.filter(inc => inc.close_date);
        const avgResolutionTimeMinutes = closedIncidents.length > 0
          ? closedIncidents.reduce((acc, inc) => {
              const openTime = new Date(inc.opening_date).getTime();
              const closeTime = new Date(inc.close_date!).getTime();
              return acc + (closeTime - openTime);
            }, 0) / closedIncidents.length / (1000 * 60)
          : 0;

        return {
          total: incidents.length,
          byStatus,
          byPriority,
          byType,
          byArea,
          avgResolutionTime: avgResolutionTimeMinutes,
        };
      },
    }),
    {
      name: "propotito-incidents-v2",
    }
  )
);
