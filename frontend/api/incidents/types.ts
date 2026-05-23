// ──────────────────────────────────────────────
// Incident API types — enums & DTOs
// ──────────────────────────────────────────────

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum IncidentStatus {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export enum IncidentType {
  MACHINE_FAILURE = "MACHINE_FAILURE",
  QUALITY_ISSUE = "QUALITY_ISSUE",
  ACCIDENT = "ACCIDENT",
  NETWORK = "NETWORK",
  HARDWARE = "HARDWARE",
  SOFTWARE = "SOFTWARE",
  SECURITY = "SECURITY",
  ACCESS = "ACCESS",
  OTHER = "OTHER",
}

// ── DTOs ──────────────────────────────────────

export interface IncidentRequestDTO {
  title: string;
  description: string;
  type: IncidentType;
  priority: Priority;
  isFalseAlarm?: boolean;
  areaId?: number;
  reportedById?: number;
  assignedToId?: number;
  supervisorId?: number;
}

export interface IncidentResponseDTO {
  id: number;
  title: string;
  description: string;
  type: IncidentType;
  status: IncidentStatus;
  priority: Priority;
  isFalseAlarm: boolean;
  areaId?: number;
  areaName?: string;
  reportedById?: number;
  reportedByName?: string;
  assignedToId?: number;
  assignedToName?: string;
  supervisorId?: number;
  supervisorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentRequestDTO {
  technicianId: number;
  supervisorId?: number;
}

// ── UI config helpers ─────────────────────────

export const incidentStatusConfig: Record<
  IncidentStatus,
  { label: string; color: string }
> = {
  [IncidentStatus.OPEN]: { label: "Abierto", color: "text-destructive" },
  [IncidentStatus.ASSIGNED]: { label: "Asignado", color: "text-chart-3" },
  [IncidentStatus.IN_PROGRESS]: { label: "En Progreso", color: "text-chart-2" },
  [IncidentStatus.ON_HOLD]: { label: "En Espera", color: "text-chart-4" },
  [IncidentStatus.RESOLVED]: { label: "Resuelto", color: "text-emerald-500" },
  [IncidentStatus.CLOSED]: { label: "Cerrado", color: "text-muted-foreground" },
  [IncidentStatus.CANCELED]: { label: "Cancelado", color: "text-destructive" },
};

export const priorityConfig: Record<
  Priority,
  { label: string; color: string }
> = {
  [Priority.LOW]: { label: "Baja", color: "bg-blue-400" },
  [Priority.MEDIUM]: { label: "Media", color: "bg-yellow-400" },
  [Priority.HIGH]: { label: "Alta", color: "bg-orange-500" },
  [Priority.CRITICAL]: { label: "Crítica", color: "bg-red-600" },
};
