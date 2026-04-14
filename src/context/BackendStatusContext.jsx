import React, { createContext, useContext, useEffect, useState } from 'react';
import { registerBackendStatusReporter, clearBackendStatusReporter } from '../api/axios';

const BackendStatusContext = createContext({
  isBackendAvailable: true,
  setBackendAvailable: () => {},
});

export const BackendStatusProvider = ({ children }) => {
  const [isBackendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    registerBackendStatusReporter(setBackendAvailable);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    let isCancelled = false;

    fetch(apiUrl, { method: 'GET', cache: 'no-store' })
      .then(() => {
        if (!isCancelled) {
          setBackendAvailable(true);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setBackendAvailable(false);
        }
      });

    return () => {
      isCancelled = true;
      clearBackendStatusReporter();
    };
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isBackendAvailable, setBackendAvailable }}>
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => {
  const context = useContext(BackendStatusContext);
  if (!context) {
    throw new Error('useBackendStatus must be used within BackendStatusProvider');
  }
  return context;
};
