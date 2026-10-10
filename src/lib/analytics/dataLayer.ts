'use client';

/**
 * MSK Institute — Production DataLayer & Telemetry Dispatcher
 *
 * Implements a privacy-first, zero-PII Google Tag Manager (GTM)
 * and Google Analytics 4 (GA4) dataLayer standard.
 */

import { StandardAnalyticsEvent } from './types';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (command: string, ...args: any[]) => void;
  }
}

// Disallowed PII keys in analytics payloads
const PII_KEYS = new Set([
  'name',
  'fullname',
  'full_name',
  'student_name',
  'phone',
  'mobile',
  'telephone',
  'phone_number',
  'mobile_number',
  'email',
  'email_address',
  'password',
  'query',
  'message',
  'whatsapp_message',
  'applicant_statement',
  'note',
  'card',
  'upi',
  'token',
  'aadhaar',
  'address',
  'street',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}$/;

/**
 * Recursively sanitize parameters to eliminate PII.
 */
export function sanitizeAnalyticsParams(params: Record<string, any> = {}): Record<string, any> {
  const clean: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();

    // Skip disallowed PII keys
    if (PII_KEYS.has(lowerKey)) {
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Drop if value matches an email pattern
      if (EMAIL_REGEX.test(trimmed)) {
        continue;
      }
      // Drop if value matches a phone number pattern
      if (PHONE_REGEX.test(trimmed.replace(/\s+/g, ''))) {
        continue;
      }
      clean[key] = trimmed;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      clean[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? sanitizeAnalyticsParams(item) : item
      );
    } else if (typeof value === 'object') {
      clean[key] = sanitizeAnalyticsParams(value);
    }
  }

  return clean;
}

// Memory deduplication cache for event triggers (prevents double fires on React re-renders)
const eventDedupeCache = new Map<string, number>();

export function shouldDedupe(eventKey: string, windowMs = 400): boolean {
  const now = Date.now();
  const lastTime = eventDedupeCache.get(eventKey);
  if (lastTime && now - lastTime < windowMs) {
    return true;
  }
  eventDedupeCache.set(eventKey, now);
  if (eventDedupeCache.size > 100) {
    const oldestKey = eventDedupeCache.keys().next().value;
    if (oldestKey) eventDedupeCache.delete(oldestKey);
  }
  return false;
}

/**
 * Core dataLayer pusher
 */
export function pushToDataLayer(event: StandardAnalyticsEvent | string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  try {
    const sanitized = sanitizeAnalyticsParams(params);
    const payload = {
      event,
      ...sanitized,
      page_location: window.location.href,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    // 1. Safe push to GTM dataLayer without overwriting
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    // 2. Also dispatch to window.gtag if directly loaded
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', event, sanitized);
      } catch {
        // Ignore gtag invocation failure
      }
    }

    // 3. Local offline log for in-browser review on /admin
    try {
      const raw = localStorage.getItem('msk_analytics_events');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        event,
        params: sanitized,
        timestamp: payload.timestamp,
        url: window.location.pathname,
      });
      localStorage.setItem('msk_analytics_events', JSON.stringify(list.slice(0, 100)));
    } catch {
      // Ignore storage errors in private browsing
    }
  } catch (err) {
    // Analytics failure must NEVER break the application
    console.warn('MSK Analytics non-critical error:', err);
  }
}
