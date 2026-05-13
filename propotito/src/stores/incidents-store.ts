import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { incidentsApi, statusApi, prioritiesApi, typesApi } from '@/api';
import type { Incident, Status, Priority, Type } from '@/api/types';

interface IncidentsState {
  incidents: Incident[];
  statuses: Status[];
  priorities: Priority[];
  types: Type[];
  loading: boolean;
  error: string | null;
  
  fetchIncidents: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
  fetchPriorities: () => Promise<void>;
  fetchTypes: () => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getStatusById: (id: string) => Status | undefined;
  getPriorityById: (id: string) => Priority | undefined;
  getTypeById: (id: string) => Type | undefined;
  createIncident: (incident: Partial<Incident>) => Promise<Incident>;
  updateIncident: (id: string, data: Partial<Incident>) => Promise<Incident>;
  assignIncident: (id: string, technicalId: string, supervisorId: string) => Promise<Incident>;
  closeIncident: (id: string, solution: string, rootCause: string) => Promise<Incident>;
  deleteIncident: (id: string) => Promise<void>;
  getIncidentStats: () => {
    total: number;
    abiertos: number;
    enProceso: number;
    cerrados: number;
    porArea: Record<string, number>;
    porTipo: Record<string, number>;
    porPrioridad: Record<string, number>;
    tiempoPromedioResolucion: number;
  };
}

export const useIncidentsStore = create<IncidentsState>()(
  persist(
    (set, get) => ({
      incidents: [],
      statuses: [],
      priorities: [],
      types: [],
      loading: false,
      error: null,

      fetchIncidents: async () => {
        set({ loading: true, error: null });
        try {
          const incidents = await incidentsApi.getAll();
          set({ incidents, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar incidentes', loading: false });
        }
      },

      fetchStatuses: async () => {
        set({ loading: true, error: null });
        try {
          const statuses = await statusApi.getAll();
          set({ statuses, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar estados', loading: false });
        }
      },

      fetchPriorities: async () => {
        set({ loading: true, error: null });
        try {
          const priorities = await prioritiesApi.getAll();
          set({ priorities, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar prioridades', loading: false });
        }
      },

      fetchTypes: async () => {
        set({ loading: true, error: null });
        try {
          const types = await typesApi.getAll();
          set({ types, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar tipos', loading: false });
        }
      },

      getIncidentById: (id: string) => {
        return get().incidents.find(incident => incident.id === id);
      },

      getStatusById: (id: string) => {
        return get().statuses.find(status => status.id === id);
      },

      getPriorityById: (id: string) => {
        return get().priorities.find(priority => priority.id === id);
      },

      getTypeById: (id: string) => {
        return get().types.find(type => type.id === id);
      },

      createIncident: async (incidentData: Partial<Incident>) => {
        set({ loading: true, error: null });
        try {
          const newIncident = await incidentsApi.create(incidentData);
          set(state => ({
            incidents: [...state.incidents, newIncident],
            loading: false,
          }));
          return newIncident;
        } catch (error) {
          set({ error: 'Error al crear incidente', loading: false });
          throw error;
        }
      },

      updateIncident: async (id: string, data: Partial<Incident>) => {
        set({ loading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.update(id, data);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            loading: false,
          }));
          return updatedIncident;
        } catch (error) {
          set({ error: 'Error al actualizar incidente', loading: false });
          throw error;
        }
      },

      assignIncident: async (id: string, technicalId: string, supervisorId: string) => {
        set({ loading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.assign(id, technicalId, supervisorId);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            loading: false,
          }));
          return updatedIncident;
        } catch (error) {
          set({ error: 'Error al asignar incidente', loading: false });
          throw error;
        }
      },

      closeIncident: async (id: string, solution: string, rootCause: string) => {
        set({ loading: true, error: null });
        try {
          const updatedIncident = await incidentsApi.close(id, solution, rootCause);
          set(state => ({
            incidents: state.incidents.map(incident => 
              incident.id === id ? updatedIncident : incident
            ),
            loading: false,
          }));
          return updatedIncident;
        } catch (error) {
          set({ error: 'Error al cerrar incidente', loading: false });
          throw error;
        }
      },

      deleteIncident: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await incidentsApi.delete(id);
          set(state => ({
            incidents: state.incidents.filter(incident => incident.id !== id),
            loading: false,
          }));
        } catch (error) {
          set({ error: 'Error al eliminar incidente', loading: false });
          throw error;
        }
      },

      getIncidentStats: () => {
        const incidents = get().incidents;
        const total = incidents.length;
        const abiertos = incidents.filter(i => i.id_status === 'status-001').length;
        const enProceso = incidents.filter(i => i.id_status === 'status-002').length;
        const cerrados = incidents.filter(i => i.id_status === 'status-003').length;

        const porArea: Record<string, number> = {};
        const porTipo: Record<string, number> = {};
        const porPrioridad: Record<string, number> = {};

        incidents.forEach(incident => {
          porArea[incident.id_area] = (porArea[incident.id_area] || 0) + 1;
          porTipo[incident.id_type] = (porTipo[incident.id_type] || 0) + 1;
          porPrioridad[incident.id_priority] = (porPrioridad[incident.id_priority] || 0) + 1;
        });

        const incidentesCerrados = incidents.filter(i => i.close_date);
        const tiempoPromedioResolucion = incidentesCerrados.length > 0
          ? incidentesCerrados.reduce((acc, incident) => {
              const opening = new Date(incident.opening_date).getTime();
              const closing = new Date(incident.close_date!).getTime();
              return acc + (closing - opening) / (1000 * 60);
            }, 0) / incidentesCerrados.length
          : 0;

        return {
          total,
          abiertos,
          enProceso,
          cerrados,
          porArea,
          porTipo,
          porPrioridad,
          tiempoPromedioResolucion,
        };
      },
    }),
    {
      name: 'incidents-storage',
      partialize: (state) => ({
        incidents: state.incidents,
        statuses: state.statuses,
        priorities: state.priorities,
        types: state.types,
      }),
    }
  )
);
