'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function startGlobalLoader(message = 'Loading page... Please wait') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('msk-start-loading', { detail: { message } }));
  }
}

export function stopGlobalLoader() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('msk-stop-loading'));
  }
}

function NavigationLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading page... Please wait');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUrlRef = useRef<string | null>(null);
  const currentPathRef = useRef<string>('');

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const startLoader = useCallback((msg = 'Loading page... Please wait') => {
    clearTimers();
    setLoadingMessage(msg);
    setIsLoading(true);
    setProgress(15);

    // Incrementally advance progress bar so user visualizes active progress
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + Math.random() * 12 + 8;
        if (prev < 70) return prev + Math.random() * 6 + 3;
        if (prev < 88) return prev + Math.random() * 2 + 0.5;
        return prev;
      });
    }, 180);
  }, [clearTimers]);

  const finishLoader = useCallback(() => {
    clearTimers();
    setProgress(100);

    hideTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      pendingUrlRef.current = null;
    }, 300);
  }, [clearTimers]);

  // When pathname or searchParams change, mark transition complete
  useEffect(() => {
    const fullCurrentPath = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;
    currentPathRef.current = fullCurrentPath;

    if (isLoading) {
      finishLoader();
    }
  }, [pathname, searchParams, finishLoader, isLoading]);

  // Intercept all internal navigation link clicks to start loader immediately and prevent multiple rapid clicks
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      // Don't intercept modified clicks (Cmd+click, Ctrl+click, middle click, etc.)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, javascript, downloads, or target="_blank"
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(anchor.href, window.location.href);
        const isSameOrigin = url.origin === window.location.origin;
        if (!isSameOrigin) return;

        // Ignore hash anchor jumps on the exact same page
        const isSamePath = url.pathname === window.location.pathname && url.search === window.location.search;
        if (isSamePath && url.hash) {
          return;
        }

        const targetUrlString = url.pathname + url.search;

        // If clicking the current exact URL with no hash, do nothing
        if (isSamePath) {
          return;
        }

        // MULTI-CLICK GUARD: If user already clicked this exact destination and it's loading, block duplicate click!
        if (isLoading && pendingUrlRef.current === targetUrlString) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        pendingUrlRef.current = targetUrlString;
        startLoader('Loading page... Please wait');
      } catch {
        // Fallback for invalid URLs: ignore
      }
    };

    // Custom programmatic loading events
    const handleCustomStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || 'Loading... Please wait';
      startLoader(msg);
    };

    const handleCustomStop = () => {
      finishLoader();
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('msk-start-loading', handleCustomStart);
    window.addEventListener('msk-stop-loading', handleCustomStop);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('msk-start-loading', handleCustomStart);
      window.removeEventListener('msk-stop-loading', handleCustomStop);
      clearTimers();
    };
  }, [isLoading, startLoader, finishLoader, clearTimers]);

  return (
    <>
      {/* Top Fixed Gradient Progress Bar */}
      <div
        className={`fixed top-0 left-0 right-0 h-[3.5px] z-[99999] pointer-events-none transition-opacity duration-300 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-secondary via-amber-400 to-secondary transition-all duration-200 ease-out relative"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 12px rgba(255, 107, 0, 0.8), 0 0 4px rgba(255, 174, 0, 0.9)',
          }}
        >
          {/* Subtle glowing trailing sparkler */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/60 blur-xs" />
        </div>
      </div>

      {/* Floating Pill Badge: Informs student that loading is underway so they don't click again */}
      <div
        className={`fixed top-4 right-4 sm:right-6 z-[99999] pointer-events-none transition-all duration-300 ${
          isLoading
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-2xl border border-white/15 backdrop-blur-md">
          <div className="w-3.5 h-3.5 border-2 border-secondary/40 border-t-secondary rounded-full animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      </div>
    </>
  );
}

export default function GlobalNavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderContent />
    </Suspense>
  );
}
