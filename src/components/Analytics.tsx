'use client';

import Script from 'next/script';
import GoogleTagManager, { isGtmConfigured } from './GoogleTagManager';
import AnalyticsTracker from './AnalyticsTracker';
import { GA_TRACKING_ID } from '@/lib/tracking';

/**
 * Unified Analytics & Google Tag Manager Integration
 *
 * Connected Production Properties:
 * - Google Tag Manager Web Container: GTM-WTZ5VP6M
 * - Google Analytics 4 / Google Tag: G-6CQ1F72VS0 (GT-WKT4G778)
 *
 * Strategy (Zero-Duplicate Telemetry & Deduplication Guarantee):
 * 1. Global dataLayer & gtag function initialized beforeInteractive.
 * 2. When GTM is configured (GTM-WTZ5VP6M), GA4 tags are dispatched via GTM to prevent dual tracking.
 * 3. Fallback direct Google Tag (gtag.js: G-6CQ1F72VS0) only mounts if GTM container is unconfigured.
 * 4. AnalyticsTracker provides route-change page_view tracking and global event delegation.
 */

export default function Analytics() {
  const measurementId = GA_TRACKING_ID || 'G-6CQ1F72VS0';
  const shouldInjectDirectGtag = !isGtmConfigured;

  return (
    <>
      {/* 1. Global dataLayer & gtag initialization script */}
      <Script
        id="datalayer-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
          `,
        }}
      />

      {/* 2. Google Tag Manager (GTM-WTZ5VP6M) */}
      <GoogleTagManager />

      {/* 3. Direct Google Tag fallback (G-6CQ1F72VS0) - Only active when GTM is not present */}
      {shouldInjectDirectGtag && (
        <>
          <Script
            id="google-tag-js"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
          <Script
            id="google-tag-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('js', new Date());
                gtag('config', '${measurementId}', {
                  send_page_view: false,
                });
              `,
            }}
          />
        </>
      )}

      {/* 4. Global Interactive Event & Route Tracker */}
      <AnalyticsTracker />
    </>
  );
}
