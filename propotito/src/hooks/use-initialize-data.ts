import { useEffect } from 'react';
import { useUsersStore, useIncidentsStore, useCatalogsStore } from '@/lib/stores';

export function useInitializeData() {
  const fetchUsers = useUsersStore(state => state.fetchUsers);
  const fetchIncidents = useIncidentsStore(state => state.fetchIncidents);
  const fetchCatalogs = useCatalogsStore(state => state.fetchAllCatalogs);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchUsers(),
        fetchIncidents(),
        fetchCatalogs(),
      ]);
    };

    initializeData();
  }, [fetchUsers, fetchIncidents, fetchCatalogs]);
}
