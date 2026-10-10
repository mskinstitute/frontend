'use client';

/**
 * MSK Institute — Global Analytics & Telemetry Tracker
 *
 * 1. Captures attribution (UTM tags, referrer, landing page) on user arrival.
 * 2. Injects structured page_type context and fires trackPageView on SPA transitions.
 * 3. Provides global event delegation for:
 *    - WhatsApp CTAs (wa.me, api.whatsapp.com, web.whatsapp.com) with cta_location
 *    - Telephone links (tel:) with cta_location
 *    - Email links (mailto:) with cta_location
 *    - Document & resource downloads (.pdf, notes, cheatsheets, syllabi)
 *
 * Zero PII is emitted to analytics.
 */

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackPageView,
  trackWhatsAppClick,
  trackPhoneClick,
  trackEmailClick,
  trackResourceDownload,
  captureAttribution,
  derivePageType,
  setPageContext,
  pushToDataLayer,
  CtaLocation,
} from '@/lib/analytics';

function inferCtaLocation(el: HTMLElement): CtaLocation {
  if (el.closest('header') || el.closest('nav')) return 'header';
  if (el.closest('footer')) return 'footer';
  if (el.closest('aside') || el.closest('[aria-label*="WhatsApp"]')) return 'floating_button';
  if (el.closest('.course-card') || el.closest('[data-analytics="course-card"]')) return 'course_card';
  if (el.closest('.batch-card') || el.closest('[data-analytics="batch-card"]')) return 'batch_card';
  if (el.closest('[role="dialog"]') || el.closest('.modal-interactive')) return 'modal';
  if (el.closest('[data-section="hero"]') || el.closest('#hero')) return 'hero';
  if (el.closest('.contact-section')) return 'contact_section';
  if (el.closest('.mobile-nav')) return 'mobile_nav';
  return 'sidebar';
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // 1. Capture first-party attribution (UTMs, referrer)
      captureAttribution();

      // 2. Infer and broadcast page context
      const pageType = derivePageType(pathname);
      const title = typeof document !== 'undefined' ? document.title : '';

      setPageContext({
        page_type: pageType,
        page_path: pathname,
        page_title: title,
      });

      // 3. Emit SPA page_view
      const query = searchParams?.toString();
      const url = pathname + (query ? `?${query}` : '');
      trackPageView(url, title);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  useEffect(() => {
    // Global delegation for click events
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const buttonText = (
        target.textContent ||
        target.getAttribute('aria-label') ||
        target.getAttribute('title') ||
        ''
      ).trim();
      const ctaLocation = inferCtaLocation(target);

      // 1. WhatsApp Links
      if (
        href.includes('wa.me') ||
        href.includes('api.whatsapp.com') ||
        href.includes('web.whatsapp.com')
      ) {
        trackWhatsAppClick({
          buttonText: buttonText || 'WhatsApp Contact',
          ctaLocation,
          linkUrl: href.split('?')[0], // Strip message queries to preserve privacy
        });
        return;
      }

      // 2. Telephone Links
      if (href.startsWith('tel:')) {
        trackPhoneClick({
          buttonText: buttonText || 'Phone Contact',
          ctaLocation,
        });
        return;
      }

      // 3. Email Links
      if (href.startsWith('mailto:')) {
        trackEmailClick({
          buttonText: buttonText || 'Email Contact',
          ctaLocation,
        });
        return;
      }

      // 4. Google Maps & Direction Links
      if (href.includes('maps.google.com') || href.includes('google.com/maps')) {
        pushToDataLayer('outbound_click', {
          destination: 'google_maps',
          link_url: href,
          cta_location: ctaLocation,
          button_text: buttonText || 'Google Maps',
        });
        return;
      }

      // 4. File / Document Downloads
      if (
        target.hasAttribute('download') ||
        /\.(pdf|zip|tar|gz|docx?|xlsx?|pptx?|epub)$/i.test(href)
      ) {
        const fileName = target.getAttribute('download') || href.split('/').pop() || 'document';
        const isNote = href.includes('note') || href.includes('study-material');
        const isCheatsheet = href.includes('cheatsheet');
        const isSyllabus = href.includes('syllabus') || href.includes('curriculum');
        const isBrochure = href.includes('brochure');

        const downloadType = isNote
          ? 'notes'
          : isCheatsheet
          ? 'cheatsheet'
          : isSyllabus
          ? 'syllabus'
          : isBrochure
          ? 'brochure'
          : 'other';

        trackResourceDownload({
          fileName,
          downloadType,
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
