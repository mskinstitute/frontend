'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';

export default function PwaUpdateToast() {
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Listen for NEW_VERSION broadcast from service worker activate event
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_VERSION') {
        setShowUpdateToast(true);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    // Also check if a service worker is already waiting to activate
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setShowUpdateToast(true);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdateToast(true);
            }
          });
        }
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    } else {
      window.location.reload();
    }
  };

  if (!showUpdateToast) {
    return null;
  }

  return (
    <aside
      aria-label="App update available"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9990] max-w-sm w-[calc(100vw-2rem)] bg-primary text-white p-4 rounded-2xl shadow-2xl border border-white/20 animate-slideUp"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-secondary text-white flex-shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Update Available
            </h3>
            <button
              onClick={() => setShowUpdateToast(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Dismiss update alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-blue-100/90 mt-1 leading-snug">
            A new version of MSK Institute is ready with faster tutorials and course updates.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-light text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-75"
            >
              <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Updating...' : 'Update Now'}</span>
            </button>
            <button
              onClick={() => setShowUpdateToast(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
