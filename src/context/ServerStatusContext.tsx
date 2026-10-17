'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

interface ServerStatusContextType {
  isServerOnline: boolean;
  isChecking: boolean;
  hasChecked: boolean;
  checkServerStatus: () => Promise<boolean>;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  isServerOnline: false,
  isChecking: true,
  hasChecked: false,
  checkServerStatus: async () => false,
});

export function ServerStatusProvider({ children }: { children: React.ReactNode }) {
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const checkServerStatus = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      // 1. Primary check via Next.js internal route handler (zero-CORS)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('/api/server-status', {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const online = Boolean(data.online);
        setIsServerOnline(online);
        return online;
      }
      setIsServerOnline(false);
      return false;
    } catch {
      // 2. Direct browser fallback ping to API_BASE_URL if route handler fails
      try {
        const directController = new AbortController();
        const directTimeoutId = setTimeout(() => directController.abort(), 2000);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const directRes = await fetch(`${apiUrl}/`, {
          signal: directController.signal,
          mode: 'cors',
        });
        clearTimeout(directTimeoutId);
        const online = directRes.ok;
        setIsServerOnline(online);
        return online;
      } catch {
        setIsServerOnline(false);
        return false;
      }
    } finally {
      setIsChecking(false);
      setHasChecked(true);
    }
  }, []);

  useEffect(() => {
    // Initial verification on mount
    checkServerStatus();

    // Heartbeat check every 30 seconds
    const interval = setInterval(() => {
      checkServerStatus();
    }, 30000);

    // Refresh immediately on window/tab focus
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkServerStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkServerStatus]);

  const value = useMemo(
    () => ({
      isServerOnline,
      isChecking,
      hasChecked,
      checkServerStatus,
    }),
    [isServerOnline, isChecking, hasChecked, checkServerStatus]
  );

  return <ServerStatusContext.Provider value={value}>{children}</ServerStatusContext.Provider>;
}

export function useServerStatus(): ServerStatusContextType {
  return useContext(ServerStatusContext);
}
