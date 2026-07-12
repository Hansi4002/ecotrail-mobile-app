import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSpeciesLogs, addSpeciesLog, deleteSpeciesLog } from '../services/species';
import { useAuth } from './AuthContext';

const SpeciesContext = createContext();

export function SpeciesProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadLogs = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getSpeciesLogs();
    setLoading(false);
    if (result.success) {
      setLogs(result.data);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [user]);

  const createLog = async (speciesData, photoUri) => {
    const result = await addSpeciesLog(speciesData, photoUri);
    if (result.success) {
      await loadLogs();
    }
    return result;
  };

  const removeLog = async (id, photoUrl) => {
    const result = await deleteSpeciesLog(id, photoUrl);
    if (result.success) {
      await loadLogs();
    }
    return result;
  };

  return (
    <SpeciesContext.Provider value={{
      logs,
      loading,
      createLog,
      removeLog,
      loadLogs
    }}>
      {children}
    </SpeciesContext.Provider>
  );
}

export function useSpecies() {
  return useContext(SpeciesContext);
}