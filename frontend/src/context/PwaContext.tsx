'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { trackPwaInstall, trackEvent } from '@/lib/tracking';
import { requestNotificationPermission } from '@/lib/pushNotifications';
import { setAppBadge, clearAppBadge } from '@/lib/badging';

// Define the BeforeInstallPromptEvent interface
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

interface PwaContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isNativePromptAvailable: boolean;
  isInstalled: boolean;
  isRunningStandalone: boolean;
  isIOS: boolean;
  isInstalling: boolean;
  isInstallModalOpen: boolean;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  installApp: () => Promise<boolean>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  setBadge: (count?: number) => Promise<boolean>;
  clearBadge: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isRunningStandalone, setIsRunningStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const openInstallModal = useCallback(() => setIsInstallModalOpen(true), []);
  const closeInstallModal = useCallback(() => setIsInstallModalOpen(false), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if prompt was already captured by inline head script
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    // Comprehensive check for currently running inside standalone app window
    const checkDisplayMode = () => {
      const isStandaloneMedia =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches;

      const isIosStandalone =
        // @ts-expect-error iOS Safari navigator.standalone check
        window.navigator.standalone === true;

      const isAndroidApp =
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa');

      const runningInAppWindow = Boolean(isStandaloneMedia || isIosStandalone || isAndroidApp);
      setIsRunningStandalone(runningInAppWindow);

      // Persisted check: consider installed if running in app window or marked installed
      const isPersistedInstalled = localStorage.getItem('msk_pwa_installed') === 'true';
      setIsInstalled(runningInAppWindow || (isPersistedInstalled && runningInAppWindow));

      return runningInAppWindow;
    };

    checkDisplayMode();

    // Check iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIOS(isIosDevice);

    // Capture beforeinstallprompt event (Chrome, Android, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.deferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    // Custom event dispatched from early inline script
    const handleEarlyPromptReady = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
      }
    };

    // Capture appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      window.deferredPrompt = null;
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
      try {
        localStorage.setItem('msk_pwa_installed', 'true');
      } catch {
        // ignore storage errors
      }
      trackPwaInstall();
      toast.success('MSK Institute App installed successfully! Launch it anytime from your desktop or app drawer.', {
        icon: '🎉',
        duration: 6000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-prompt-ready', handleEarlyPromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen to display mode changes dynamically
    const standaloneMedia = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsRunningStandalone(true);
        setIsInstalled(true);
        try {
          localStorage.setItem('msk_pwa_installed', 'true');
        } catch {
          // ignore storage errors
        }
      }
    };

    if (standaloneMedia.addEventListener) {
      standaloneMedia.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-prompt-ready', handleEarlyPromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (standaloneMedia.removeEventListener) {
        standaloneMedia.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, []);

  const installApp = useCallback(async (): Promise<boolean> => {
    trackEvent('pwa_install_button_clicked');

    // 1. If already running inside installed standalone app window
    if (isRunningStandalone) {
      toast('MSK Institute App is already running in app mode.', { icon: '📱' });
      return true;
    }

    setIsInstalling(true);

    // 2. Try to get native prompt (state, global, or wait up to 800ms)
    let activePrompt = deferredPrompt || (typeof window !== 'undefined' ? window.deferredPrompt : null);

    if (!activePrompt && typeof window !== 'undefined') {
      activePrompt = await new Promise<BeforeInstallPromptEvent | null>((resolve) => {
        let timer: NodeJS.Timeout;

        const onReady = () => {
          clearTimeout(timer);
          window.removeEventListener('pwa-prompt-ready', onReady);
          resolve(window.deferredPrompt || null);
        };

        timer = setTimeout(() => {
          window.removeEventListener('pwa-prompt-ready', onReady);
          resolve(window.deferredPrompt || null);
        }, 800);

        window.addEventListener('pwa-prompt-ready', onReady);
      });
    }

    setIsInstalling(false);

    // 3. If native prompt is available:
    // Calling .prompt() triggers the browser's native App Install prompt
    // This installs as a real standalone app (NOT a browser shortcut)
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choiceResult = await activePrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          window.deferredPrompt = null;
          setDeferredPrompt(null);
          setIsInstalled(true);
          try {
            localStorage.setItem('msk_pwa_installed', 'true');
          } catch {
            // ignore
          }
          trackPwaInstall();
          setIsInstallModalOpen(false);
          toast.success('Installing MSK Institute App...', { icon: '⚡' });
          return true;
        } else {
          trackEvent('pwa_install_dismissed');
          return false;
        }
      } catch (err) {
        console.warn('Native PWA prompt error:', err);
      }
    }

    // 4. If native prompt is not directly available (already dismissed, iOS Safari, or desktop manual):
    // Open the comprehensive Install App Modal that guides the user to install as an App, NOT a browser shortcut!
    setIsInstallModalOpen(true);
    return false;
  }, [deferredPrompt, isRunningStandalone]);

  const isNativePromptAvailable = Boolean(deferredPrompt || (typeof window !== 'undefined' && window.deferredPrompt));
  const isInstallable = !isRunningStandalone;

  return (
    <PwaContext.Provider
      value={{
        deferredPrompt,
        isInstallable,
        isNativePromptAvailable,
        isInstalled,
        isRunningStandalone,
        isIOS,
        isInstalling,
        isInstallModalOpen,
        openInstallModal,
        closeInstallModal,
        installApp,
        requestNotificationPermission,
        setBadge: setAppBadge,
        clearBadge: clearAppBadge,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
}
