import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { reportsApi } from '@/api';
import type { Report } from '@/api/types';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  
  fetchReports: () => Promise<void>;
  getReportById: (id: string) => Report | undefined;
  getReportsByIncidentId: (incidentId: string) => Report[];
  createReport: (report: Partial<Report>) => Promise<Report>;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      loading: false,
      error: null,

      fetchReports: async () => {
        set({ loading: true, error: null });
        try {
          const reports = await reportsApi.getAll();
          set({ reports, loading: false });
        } catch (error) {
          set({ error: 'Error al cargar reportes', loading: false });
        }
      },

      getReportById: (id: string) => {
        return get().reports.find(report => report.id === id);
      },

      getReportsByIncidentId: (incidentId: string) => {
        return get().reports.filter(report => report.id_incident === incidentId);
      },

      createReport: async (reportData: Partial<Report>) => {
        set({ loading: true, error: null });
        try {
          const newReport = await reportsApi.create(reportData);
          set(state => ({
            reports: [...state.reports, newReport],
            loading: false,
          }));
          return newReport;
        } catch (error) {
          set({ error: 'Error al crear reporte', loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'reports-storage',
      partialize: (state) => ({
        reports: state.reports,
      }),
    }
  )
);
