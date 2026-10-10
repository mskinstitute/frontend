'use client';

/**
 * MSK Institute — Analytics Page Context Manager
 *
 * Infers and maintains the active page context (page_type, course_id, batch_id, etc.)
 * across App Router navigation.
 */

import { PageContext, PageType } from './types';
import { pushToDataLayer } from './dataLayer';

let activePageContext: PageContext = {
  page_type: 'other',
};

/**
 * Derive page_type from the current URL pathname
 */
export function derivePageType(pathname: string): PageType {
  if (pathname === '/') return 'home';
  if (pathname === '/courses') return 'courses_catalog';
  if (pathname.startsWith('/courses/')) return 'course';
  if (pathname === '/live-batches') return 'live_batches';
  if (pathname.startsWith('/live-batches/')) return 'batch';
  if (pathname === '/blogs') return 'blogs_catalog';
  if (pathname.startsWith('/blogs/')) return 'blog';
  if (pathname === '/tutorials') return 'tutorials_catalog';
  if (pathname.startsWith('/tutorials/')) return 'tutorial';
  if (pathname === '/study-material') return 'study_material';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/careers') return 'careers';
  if (pathname.startsWith('/tools')) return 'tools';
  if (pathname === '/verify-certificate') return 'verify_certificate';
  if (pathname === '/playground') return 'playground';
  if (pathname === '/privacy-policy') return 'privacy_policy';
  if (pathname === '/terms') return 'terms';
  if (pathname === '/disclaimer') return 'disclaimer';
  if (pathname === '/locations') return 'locations_directory';
  if (pathname.startsWith('/locations/')) return 'location';
  if (pathname === '/admin') return 'admin';
  return 'other';
}

/**
 * Set the current page context and push to dataLayer
 */
export function setPageContext(context: Partial<PageContext>): PageContext {
  activePageContext = {
    ...activePageContext,
    ...context,
  };

  pushToDataLayer('page_context', {
    ...activePageContext,
  });

  return activePageContext;
}

/**
 * Get active page context
 */
export function getActivePageContext(): PageContext {
  return activePageContext;
}
