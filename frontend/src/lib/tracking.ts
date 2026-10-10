'use client';

/**
 * MSK Institute — Tracking Adapter (Re-exports from unified @/lib/analytics)
 *
 * Provides backward-compatible tracking functions mapped to the
 * centralized, privacy-safe analytics architecture.
 */

export * from './analytics';

import {
  pushToDataLayer,
  trackPageView as dlTrackPageView,
  trackCourseView as dlTrackCourseView,
  trackBatchView as dlTrackBatchView,
  trackWhatsAppClick as dlTrackWhatsAppClick,
  trackPhoneClick as dlTrackPhoneClick,
  trackEmailClick as dlTrackEmailClick,
  trackFormStart as dlTrackFormStart,
  trackFormSubmit as dlTrackFormSubmit,
  trackGenerateLead as dlTrackGenerateLead,
  trackDemoRequest as dlTrackDemoRequest,
  trackEnrollmentStart as dlTrackEnrollmentStart,
  trackEnrollmentSubmit as dlTrackEnrollmentSubmit,
  trackTutorialView as dlTrackTutorialView,
  trackCertificateVerify as dlTrackCertificateVerify,
  trackResourceDownload as dlTrackResourceDownload,
  trackCourseEnquiry as dlTrackCourseEnquiry,
  trackCourseRegister as dlTrackCourseRegister,
  trackBatchRegister as dlTrackBatchRegister,
  trackFileDownload as dlTrackFileDownload,
} from './dataLayer';

export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  'G-6CQ1F72VS0';

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WTZ5VP6M';

// Track standard Pageviews
export function pageview(url: string, title?: string) {
  dlTrackPageView(url, title);
}

// Track generic custom events (sanitized through dataLayer)
export function trackEvent(action: string, params: Record<string, any> = {}) {
  pushToDataLayer(action, params);
}

// Specialized Conversion & Telemetry Trackers
export function trackLeadSubmission(formType: string, details: Record<string, any> = {}) {
  dlTrackGenerateLead(formType, details);
}

export function trackDemoBooking(courseTitle: string, details: Record<string, any> = {}) {
  dlTrackFormSubmit('demo_booking', { course_name: courseTitle });
  dlTrackGenerateLead('demo_booking', {
    course_name: courseTitle,
    preferred_date: details.preferred_date || '',
  });
  dlTrackDemoRequest({
    courseName: courseTitle,
    preferredDate: details.preferred_date || '',
  });
}

export function trackBatchEnrollment(batchId: string, batchTitle: string, details: Record<string, any> = {}) {
  dlTrackFormSubmit('batch_enrollment', {
    batch_id: batchId,
    batch_name: batchTitle,
  });
  dlTrackEnrollmentSubmit({
    batchId,
    batchName: batchTitle,
    courseName: details.course || batchTitle,
    coursePrice: details.price || 0,
    courseMode: details.mode || 'ONLINE',
  });
  dlTrackGenerateLead('batch_enrollment', {
    batch_id: batchId,
    batch_name: batchTitle,
    course_name: details.course || batchTitle,
    course_mode: details.mode || 'ONLINE',
    course_price: details.price || 0,
  });
  dlTrackBatchRegister({
    batchId,
    batchName: batchTitle,
    courseName: details.course || batchTitle,
    courseMode: details.mode || 'ONLINE',
    coursePrice: details.price || 0,
  });
}

export function trackCertificateVerification(certificateId: string, isValid: boolean) {
  dlTrackCertificateVerify(isValid, certificateId);
}

export function trackPwaInstall() {
  pushToDataLayer('pwa_app_installed', {
    platform: typeof window !== 'undefined' ? window.navigator.platform : 'unknown',
    installed_at: new Date().toISOString(),
  });
}

export function trackContactClick(channel: 'call' | 'whatsapp' | 'email' | 'maps', targetValue?: string) {
  switch (channel) {
    case 'whatsapp':
      dlTrackWhatsAppClick({ ctaLocation: 'contact_section', buttonText: 'WhatsApp Contact' });
      break;
    case 'call':
      dlTrackPhoneClick({ ctaLocation: 'contact_section', buttonText: 'Phone Contact' });
      break;
    case 'email':
      dlTrackEmailClick({ ctaLocation: 'contact_section', buttonText: 'Email Contact' });
      break;
    case 'maps':
      pushToDataLayer('outbound_click', {
        destination: 'google_maps',
        link_url: 'https://maps.google.com/?q=MSK+Institute+Shikohabad',
      });
      break;
  }
}

export function trackNoteDownload(noteTitle: string, isPaid: boolean) {
  if (isPaid) {
    dlTrackFormSubmit('paid_note_inquiry', { note_title: noteTitle });
    dlTrackGenerateLead('paid_note_inquiry', { note_title: noteTitle });
  } else {
    dlTrackResourceDownload({
      fileName: noteTitle,
      downloadType: 'notes',
    });
  }
}

export function trackCourseViewDetail(courseId: string, courseTitle: string) {
  dlTrackCourseView({
    id: courseId,
    slug: courseId,
    title: courseTitle,
  });
}

// Retrieve local telemetry events for Admin dashboard
export function getLocalAnalyticsEvents(): Array<{
  event: string;
  params: Record<string, any>;
  timestamp: string;
  url: string;
}> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('msk_analytics_events');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
