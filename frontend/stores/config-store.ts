import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ApiEnvironment = "local" | "prod";

export const API_URLS: Record<ApiEnvironment, string> = {
  local: "http://localhost:8080",
  prod: "https://opscoreapi.onrender.com",
};

const VALID_API_URLS = new Set(Object.values(API_URLS));

const normalizeApiUrl = (url: string): string =>
  VALID_API_URLS.has(url) ? url : API_URLS.local;

interface ConfigState {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      apiBaseUrl: API_URLS.local,
      setApiBaseUrl: (url) => set({ apiBaseUrl: normalizeApiUrl(url) }),
    }),
    {
      name: "opscore-config",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ apiBaseUrl: state.apiBaseUrl }),
    },
  ),
);

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("opscore-config");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { apiBaseUrl?: string } };
        const stored = parsed?.state?.apiBaseUrl;
        if (stored) return normalizeApiUrl(stored);
      }
    } catch {
      // ignore parse errors, fallback to store
    }
  }

  const state = useConfigStore.getState();
  return normalizeApiUrl(state.apiBaseUrl || API_URLS.local);
};
