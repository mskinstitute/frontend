'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    // In development or on localhost, ensure SW is unregistered and caches are cleared
    // to prevent stale HTML from causing React hydration mismatches during development.
    const isDev =
      process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isDev) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      return;
    }

    const registerWorker = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New content available for MSK Institute PWA. Auto-updating...');
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('MSK Institute SW registration failed:', error);
        });
    };

    const scheduleRegistration = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => registerWorker(), { timeout: 3000 });
      } else {
        setTimeout(registerWorker, 2000);
      }
    };

    if (document.readyState === 'complete') {
      scheduleRegistration();
    } else {
      window.addEventListener('load', scheduleRegistration);
      return () => window.removeEventListener('load', scheduleRegistration);
    }
  }, []);

  return null;
}
