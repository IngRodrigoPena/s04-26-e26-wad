// Exportar stores legacy de lib/stores (mantener compatibilidad)
export { useUsersStore } from "./users-store";
export { useCatalogsStore } from "./catalogs-store";
export { useIncidentsStore } from "./incidents-store";
export { useStoreInitializer } from "./use-store-initializer";

// Exportar stores nuevos desde stores/ (API real)
export { 
  useAuthStore,
  useIncidentsStore as useIncidentsStoreNew,
  useUsersStore as useUsersStoreNew,
} from "@/stores";

// Re-exportar i18n desde lib/store (legacy)
export { useI18nStore } from "../store";
export type { Language } from "../store";
