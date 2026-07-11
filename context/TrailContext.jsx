import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTrails, addTrail, updateTrail, deleteTrail } from '../services/trails';
import { useAuth } from './AuthContext';

const TrailContext = createContext();

export function TrailProvider({ children }) {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load trails
  const loadTrails = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getTrails();
    setLoading(false);
    if (result.success) {
      setTrails(result.data);
    }
  };

  useEffect(() => {
    loadTrails();
  }, [user]);

  // Create trail
  const createTrail = async (trailData) => {
    const result = await addTrail(trailData);
    if (result.success) {
      await loadTrails();
    }
    return result;
  };

  // Update trail
  const editTrail = async (id, trailData) => {
    const result = await updateTrail(id, trailData);
    if (result.success) {
      await loadTrails();
    }
    return result;
  };

  // Delete trail
  const removeTrail = async (id) => {
    const result = await deleteTrail(id);
    if (result.success) {
      await loadTrails();
    }
    return result;
  };

  return (
    <TrailContext.Provider value={{
      trails,
      loading,
      createTrail,
      editTrail,
      removeTrail,
      loadTrails
    }}>
      {children}
    </TrailContext.Provider>
  );
}

export function useTrails() {
  return useContext(TrailContext);
}