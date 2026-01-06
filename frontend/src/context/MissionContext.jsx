import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const MissionContext = createContext();

export const useMissions = () => useContext(MissionContext);

export const MissionProvider = ({ children }) => {
  const { api, user } = useAuth();
  const [progress, setProgress] = useState({}); // { mission_bruteforce: 'completed' }

  const fetchProgress = async () => {
    if (!user) return;
    try {
      const res = await api.get('/lab/progress');
      // Convert array to object map
      const map = {};
      res.data.forEach(p => map[p.mission_id] = p.status);
      setProgress(map);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return (
    <MissionContext.Provider value={{ progress, refreshProgress: fetchProgress }}>
      {children}
    </MissionContext.Provider>
  );
};
