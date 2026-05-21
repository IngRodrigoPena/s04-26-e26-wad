"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { incidentsApi } from "@/api";
import { Priority, IncidentStatus } from "@/api/incidents/types";
import type { Incident } from "@/lib/store";

// Helper functions to map API types to legacy format
function mapPriorityToLegacy(p: Priority): Incident["prioridad"] {
  const map: Record<Priority, Incident["prioridad"]> = {
    LOW: "baja",
    MEDIUM: "media",
    HIGH: "alta",
    CRITICAL: "critica",
  };
  return map[p] || "media";
}

function mapStatusToLegacy(s: IncidentStatus): Incident["estado"] {
  const map: Record<IncidentStatus, Incident["estado"]> = {
    OPEN: "abierto",
    ASSIGNED: "asignado",
    IN_PROGRESS: "en_proceso",
    ON_HOLD: "en_espera",
    RESOLVED: "cerrado",
    CLOSED: "cerrado",
    CANCELED: "cancelado",
  };
  return map[s] || "abierto";
}

// Helper function to map API response to legacy Incident format
function mapApiToLegacy(apiInc: any): Incident {
  return {
    id: String(apiInc.id),
    tipo: "otro" as Incident["tipo"],
    area: "produccion" as Incident["area"],
    prioridad: mapPriorityToLegacy(apiInc.priority) as Incident["prioridad"],
    titulo: apiInc.title,
    descripcion: apiInc.description,
    estado: mapStatusToLegacy(apiInc.status) as Incident["estado"],
    reportadoPor: "",
    reportadoPorNombre: "",
    fechaCreacion: apiInc.createdAt,
    fechaCierre: apiInc.resolvedAt,
    // Additional fields for dashboard compatibility
    id_status: String(apiInc.status),
    id_type: "otro",
    id_area: "produccion",
    id_priority: String(apiInc.priority),
    title: apiInc.title,
    opening_date: apiInc.createdAt,
  };
}

interface IncidentsState {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  
  fetchIncidents: () => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  createIncident: (incident: Partial<Incident>) => Promise<Incident>;
  addIncident: (incident: Partial<Incident>) => Promise<Incident>; // Alias para compatibilidad
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
    abiertos: number;
    enProceso: number;
    cerrados: number;
    // Alias para compatibilidad con componentes
    porPrioridad: Record<string, number>;
    porTipo: Record<string, number>;
    porArea: Record<string, number>;
    tiempoPromedioResolucion: number;
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
          const apiIncidents = await incidentsApi.getAll();
          // Mapear incidentes del API al formato legacy
          const incidents = apiIncidents.map(apiInc => ({
            id: String(apiInc.id),
            tipo: "otro" as Incident["tipo"],
            area: "produccion" as Incident["area"],
            prioridad: mapPriorityToLegacy(apiInc.priority),
            titulo: apiInc.title,
            descripcion: apiInc.description,
            estado: mapStatusToLegacy(apiInc.status),
            reportadoPor: "",
            reportadoPorNombre: "",
            fechaCreacion: apiInc.createdAt,
    fechaCierre: undefined,
            // Campos adicionales para compatibilidad con dashboard
            id_status: String(apiInc.status),
            id_type: "otro",
            id_area: "produccion",
            id_priority: String(apiInc.priority),
            title: apiInc.title,
            opening_date: apiInc.createdAt,
          }));
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

      createIncident: async (incidentData: any) => {
        set({ isLoading: true, error: null });
        try {
          const apiIncident = await incidentsApi.create(incidentData);
          const newIncident = mapApiToLegacy(apiIncident);
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

      // Alias para compatibilidad
      addIncident: async (incidentData) => {
        return get().createIncident(incidentData);
      },

      updateIncident: async (id: string, data: Partial<Incident>) => {
        set({ isLoading: true, error: null });
        try {
          // Update incident locally since API doesn't have update method
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? { ...incident, ...data } : incident
            ),
            isLoading: false
          }));
          return get().getIncidentById(id)!;
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
          // Assign incident locally since API doesn't have assign method
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? { 
                ...incident, 
                asignadoA: technicalId,
                asignadoANombre: "Técnico Asignado"
              } : incident
            ),
            isLoading: false
          }));
          return get().getIncidentById(id)!;
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
          // Close incident locally since API doesn't have close method
          let closedIncident: Incident | undefined;
          set(state => {
            const updated = state.incidents.map(incident => 
              incident.id === id ? { 
                ...incident, 
                estado: "cerrado" as const,
                solucion: solution,
                causaRaiz: rootCause,
                fechaCierre: new Date().toISOString()
              } : incident
            );
            closedIncident = updated.find(i => i.id === id);
            return { incidents: updated, isLoading: false };
          });
          return closedIncident!;
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
          // Delete incident locally since API doesn't have delete method
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
          const key = inc.id_status || "unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byPriority = incidents.reduce((acc, inc) => {
          const key = inc.id_priority || "unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byType = incidents.reduce((acc, inc) => {
          const key = inc.id_type || "unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byArea = incidents.reduce((acc, inc) => {
          const key = inc.id_area || "unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const closedIncidents = incidents.filter(inc => inc.close_date);
        const avgResolutionTimeMinutes = closedIncidents.length > 0
          ? closedIncidents.reduce((acc, inc) => {
              const openTime = new Date(inc.opening_date || inc.fechaCreacion || inc.createdAt || Date.now()).getTime();
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
          // Alias en español para compatibilidad
          abiertos: byStatus["abierto"] || 0,
          enProceso: byStatus["en_proceso"] || 0,
          cerrados: (byStatus["cerrado"] || 0) + (byStatus["resuelto"] || 0),
          // Alias para compatibilidad con componentes
          porPrioridad: byPriority,
          porTipo: byType,
          porArea: byArea,
          tiempoPromedioResolucion: avgResolutionTimeMinutes,
        };
      },
    }),
    {
      name: "propotito-incidents-v2",
    }
  )
);
