'use client';

/**
 * MSK Institute — Marketing Attribution & First-Party Session Storage
 *
 * Captures campaign parameters (UTM tags, referrer, landing page) on initial entry
 * and stores them in sessionStorage for downstream conversion attribution (leads, enrollments, WhatsApp).
 *
 * Guarantees:
 * - Never modifies canonical URLs.
 * - Never alters browser history or routing.
 * - Does not store sensitive data.
 * - Survives Next.js client-side navigation.
 */

import { UtmAttribution } from './types';

const ATTRIBUTION_STORAGE_KEY = 'msk_attribution_session';

let memoryAttributionCache: UtmAttribution | null = null;

/**
 * Parses query parameters from window.location on arrival
 */
export function captureAttribution(): UtmAttribution {
  if (typeof window === 'undefined') return {};

  try {
    const existingRaw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (existingRaw) {
      const parsed = JSON.parse(existingRaw) as UtmAttribution;
      memoryAttributionCache = parsed;
      return parsed;
    }
  } catch {
    if (memoryAttributionCache) return memoryAttributionCache;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const utmTerm = urlParams.get('utm_term');

  // Derive organic or social referral if no UTM parameters exist
  let derivedSource = utmSource || undefined;
  let derivedMedium = utmMedium || undefined;

  if (!derivedSource && document.referrer) {
    try {
      const refUrl = new URL(document.referrer);
      const refHost = refUrl.hostname.toLowerCase();
      if (!refHost.includes('mskinstitute.in')) {
        if (refHost.includes('google.')) {
          derivedSource = 'google';
          derivedMedium = 'organic';
        } else if (refHost.includes('instagram.')) {
          derivedSource = 'instagram';
          derivedMedium = 'social';
        } else if (refHost.includes('facebook.')) {
          derivedSource = 'facebook';
          derivedMedium = 'social';
        } else if (refHost.includes('youtube.')) {
          derivedSource = 'youtube';
          derivedMedium = 'social';
        } else if (refHost.includes('linkedin.')) {
          derivedSource = 'linkedin';
          derivedMedium = 'social';
        } else if (refHost.includes('whatsapp') || refHost.includes('wa.me')) {
          derivedSource = 'whatsapp';
          derivedMedium = 'chat';
        } else {
          derivedSource = refHost;
          derivedMedium = 'referral';
        }
      }
    } catch {
      // Ignore URL parse errors
    }
  }

  const attribution: UtmAttribution = {
    utm_source: derivedSource,
    utm_medium: derivedMedium,
    utm_campaign: utmCampaign || undefined,
    utm_content: utmContent || undefined,
    utm_term: utmTerm || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname,
    first_seen: new Date().toISOString(),
  };

  memoryAttributionCache = attribution;

  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // SessionStorage may be restricted in private browsing
  }

  return attribution;
}

/**
 * Returns the active session attribution for inclusion in conversion events
 */
export function getAttributionContext(): Record<string, string> {
  const attr = memoryAttributionCache || (typeof window !== 'undefined' ? captureAttribution() : {});
  const clean: Record<string, string> = {};

  if (attr.utm_source) clean.lead_source = attr.utm_source;
  if (attr.utm_medium) clean.lead_medium = attr.utm_medium;
  if (attr.utm_campaign) clean.lead_campaign = attr.utm_campaign;
  if (attr.utm_content) clean.lead_content = attr.utm_content;
  if (attr.utm_term) clean.lead_term = attr.utm_term;
  if (attr.landing_page) clean.landing_page = attr.landing_page;

  return clean;
}
