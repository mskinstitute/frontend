'use client';

import Script from 'next/script';

/**
 * Google Tag Manager (GTM) Container Loader
 *
 * Configured via environment variable:
 * NEXT_PUBLIC_GTM_ID="GTM-XXXXXXXX"
 *
 * Adheres to Next.js App Router guidelines with strategy="afterInteractive"
 * to maintain Core Web Vitals (LCP, INP, CLS).
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
  if (!isGtmConfigured || !GTM_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
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
