'use client';

import { useEffect } from 'react';

/**
 * Google Tag Manager (GTM) Container Loader
 *
 * Configured via environment variable:
 * NEXT_PUBLIC_GTM_ID="GTM-XXXXXXXX"
 *
 * Defers GTM script injection until first user interaction (scroll, pointerdown,
 * touchstart, keydown) or a 5.5s idle fallback so GTM/gtag never blocks initial
 * mobile hydration or Total Blocking Time (TBT). Queued window.dataLayer events
 * pushed by AnalyticsTracker are replayed automatically once GTM boots.
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WTZ5VP6M';

// Verify if GTM ID is a valid production container ID
export const isGtmConfigured = Boolean(
  GTM_ID &&
  GTM_ID.startsWith('GTM-') &&
  GTM_ID !== 'GTM-XXXXXXXX' &&
  !GTM_ID.includes('XXXX')
);

export default function GoogleTagManager() {
  useEffect(() => {
    if (!isGtmConfigured || !GTM_ID || typeof window === 'undefined') {
      return;
    }

    let loaded = false;

    const loadGtm = () => {
      if (loaded) return;
      loaded = true;
      cleanup();

      const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

      if (document.getElementById('gtm-external-script')) return;
      const script = document.createElement('script');
      script.id = 'gtm-external-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(script);
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    const cleanup = () => {
      events.forEach((evt) => window.removeEventListener(evt, loadGtm));
      clearTimeout(fallbackTimer);
    };

    events.forEach((evt) => window.addEventListener(evt, loadGtm, { passive: true, once: true }));
    const fallbackTimer = setTimeout(loadGtm, 5500);

    return cleanup;
  }, []);

  return null;
}

/**
 * GTM Noscript Iframe for body injection
 */
export function GoogleTagManagerNoScript() {
  if (!isGtmConfigured || !GTM_ID) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
