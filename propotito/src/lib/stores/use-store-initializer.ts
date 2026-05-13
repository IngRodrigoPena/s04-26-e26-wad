"use client";

import { useEffect } from "react";
import { useCatalogsStore } from "./catalogs-store";
import { useIncidentsStore } from "./incidents-store";
import { useUsersStore } from "./users-store";

export function useStoreInitializer() {
  const fetchCatalogs = useCatalogsStore(state => state.fetchAllCatalogs);
  const fetchIncidents = useIncidentsStore(state => state.fetchIncidents);
  const fetchUsers = useUsersStore(state => state.fetchUsers);

  useEffect(() => {
    fetchCatalogs();
    fetchIncidents();
    fetchUsers();
  }, [fetchCatalogs, fetchIncidents, fetchUsers]);
}
