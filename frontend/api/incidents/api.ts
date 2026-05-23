import apiClient from "../client";
import type { IncidentRequestDTO, IncidentResponseDTO } from "./types";

/**
 * Incidentes API
 * Todos los endpoints requieren autenticación (JWT via interceptor)
 */
export const incidentsApi = {
  /** GET /incidents — listar todos */
  getAll: async (): Promise<IncidentResponseDTO[]> => {
    const response = await apiClient.get("/incidents");
    return response.data;
  },

  /** GET /incidents/{id} — obtener por ID */
  getById: async (id: number): Promise<IncidentResponseDTO> => {
    const response = await apiClient.get(`/incidents/${id}`);
    return response.data;
  },

  /** POST /incidents — crear nuevo */
  create: async (
    data: IncidentRequestDTO,
  ): Promise<IncidentResponseDTO> => {
    const response = await apiClient.post("/incidents", data);
    return response.data;
  },

  /** PATCH /incidents/{id}/start */
  start: async (id: number): Promise<IncidentResponseDTO> => {
    const response = await apiClient.patch(`/incidents/${id}/start`);
    return response.data;
  },

  /** PATCH /incidents/{id}/hold */
  hold: async (id: number, reason?: string): Promise<IncidentResponseDTO> => {
    const response = await apiClient.patch(`/incidents/${id}/hold`, {
      reason,
    });
    return response.data;
  },

  /** PATCH /incidents/{id}/resolve */
  resolve: async (
    id: number,
    resolution?: string,
  ): Promise<IncidentResponseDTO> => {
    const response = await apiClient.patch(`/incidents/${id}/resolve`, {
      resolution,
    });
    return response.data;
  },

  /** PATCH /incidents/{id}/close */
  close: async (id: number, notes?: string): Promise<IncidentResponseDTO> => {
    const response = await apiClient.patch(`/incidents/${id}/close`, {
      notes,
    });
    return response.data;
  },

  /** PATCH /incidents/{id}/cancel */
  cancel: async (
    id: number,
    reason?: string,
  ): Promise<IncidentResponseDTO> => {
    const response = await apiClient.patch(`/incidents/${id}/cancel`, {
      reason,
    });
    return response.data;
  },
};
