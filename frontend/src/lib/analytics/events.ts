'use client';

/**
 * MSK Institute — High-Level Type-Safe Telemetry Events
 *
 * Implements Google's recommended GA4 event model alongside MSK-specific business events:
 * - view_item_list (Course catalog impression)
 * - select_item (Course card click)
 * - view_item (Course page detail view)
 * - batch_view (Live batch view)
 * - batch_cta_click (Live batch CTA action)
 * - whatsapp_click (Outbound WhatsApp inquiry)
 * - phone_click (Telephone CTA click)
 * - email_click (Email CTA click)
 * - form_view / form_start / generate_lead (Lead capture funnel)
 * - demo_request (Free trial demo booking)
 * - enrollment_start / enrollment_submit (Cohort registration)
 * - search (Internal search execution)
 * - resource_download (PDFs, notes, cheatsheets)
 * - certificate_verify (Safe certificate lookup)
 */

import { pushToDataLayer, shouldDedupe } from './dataLayer';
import { getAttributionContext } from './attribution';
import { getActivePageContext } from './page-context';
import {
  CtaLocation,
  CourseItemParam,
  ViewItemListPayload,
  SelectItemPayload,
  ViewItemPayload,
  BatchViewPayload,
  BatchCtaClickPayload,
  WhatsAppClickPayload,
  PhoneClickPayload,
  EmailClickPayload,
  GenerateLeadPayload,
  ResourceDownloadPayload,
  SearchEventPayload,
  CertificateVerifyPayload,
} from './types';

// ============================================================================
// 1. Pageview & Navigation
// ============================================================================

export function trackPageView(url: string, title?: string): void {
  if (shouldDedupe(`page_view:${url}`)) return;
  pushToDataLayer('page_view', {
    page_path: url,
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
}

// ============================================================================
// 2. Course Catalog & Detail Events (GA4 Recommended: view_item_list, select_item, view_item)
// ============================================================================

/**
 * Course List Impression (view_item_list)
 */
export function trackCourseListImpression(
  items: CourseItemParam[],
  listName = 'All Courses Catalog'
): void {
  if (items.length === 0) return;
  const key = `view_item_list:${listName}:${items.length}`;
  if (shouldDedupe(key, 2000)) return;

  const payload: ViewItemListPayload = {
    item_list_name: listName,
    items: items.slice(0, 50), // Cap at 50 for GA4 payload safety
  };

  pushToDataLayer('view_item_list', payload);
}

/**
 * Course Selection (select_item)
 */
export function trackCourseSelection(
  item: CourseItemParam,
  listName = 'All Courses Catalog'
): void {
  const payload: SelectItemPayload = {
    item_list_name: listName,
    items: [item],
  };

  pushToDataLayer('select_item', payload);
}

/**
 * Course Detail View (view_item & backward-compatible course_view)
 */
export function trackCourseView(course: {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  duration?: string;
  price?: number | string;
  mode?: string;
  courseId?: string;
  courseSlug?: string;
  courseName?: string;
  courseCategory?: string;
  courseDuration?: string;
  coursePrice?: number | string;
  courseMode?: string;
}): void {
  const courseId = course.id || course.courseId || course.slug || course.courseSlug || 'unknown';
  const slug = course.slug || course.courseSlug || courseId;
  const title = course.title || course.courseName || 'Course';
  const category = course.category || course.courseCategory || 'Computer Training';
  const duration = course.duration || course.courseDuration || '';
  const mode = course.mode || course.courseMode || 'BOTH';
  const rawPrice = course.price ?? course.coursePrice ?? 0;
  const numPrice = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice) || 0;

  if (shouldDedupe(`course_view:${courseId}`)) return;

  // 1. GA4 Recommended view_item event
  const viewItemPayload: ViewItemPayload = {
    currency: 'INR',
    value: numPrice,
    items: [
      {
        item_id: courseId,
        item_name: title,
        item_category: category,
        price: numPrice,
      },
    ],
    course_id: courseId,
    course_slug: slug,
    course_name: title,
    course_category: category,
    course_duration: duration,
    course_mode: mode,
  };

  pushToDataLayer('view_item', viewItemPayload);

  // 2. Also emit custom course_view for existing dashboard compatibility
  pushToDataLayer('course_view', {
    course_id: courseId,
    course_slug: slug,
    course_name: title,
    course_category: category,
    course_duration: duration,
    course_price: numPrice,
    course_mode: mode,
  });
}

// ============================================================================
// 3. Live Batch Events (batch_view, batch_cta_click)
// ============================================================================

export function trackBatchView(payload: BatchViewPayload | {
  batch_id?: string;
  batchId?: string;
  batch_name?: string;
  batchName?: string;
  course_id?: string;
  courseId?: string;
  course_slug?: string;
  courseSlug?: string;
  course_name?: string;
  courseName?: string;
  batch_status?: string;
  batchStatus?: string;
  batch_start_date?: string;
  batchStartDate?: string;
  price?: number | string;
  coursePrice?: number | string;
  mode?: string;
  courseMode?: string;
}): void {
  const batchId = (payload as any).batch_id || (payload as any).batchId || '';
  const batchName = (payload as any).batch_name || (payload as any).batchName || '';
  const courseName = (payload as any).course_name || (payload as any).courseName || batchName;
  const courseId = (payload as any).course_id || (payload as any).courseId || '';
  const courseSlug = (payload as any).course_slug || (payload as any).courseSlug || '';
  const batchStatus = (payload as any).batch_status || (payload as any).batchStatus || 'OPEN';
  const batchStartDate = (payload as any).batch_start_date || (payload as any).batchStartDate || '';
  const price = (payload as any).price ?? (payload as any).coursePrice ?? 0;
  const mode = (payload as any).mode || (payload as any).courseMode || 'BOTH';

  if (shouldDedupe(`batch_view:${batchId}`)) return;

  pushToDataLayer('batch_view', {
    batch_id: batchId,
    batch_name: batchName,
    course_id: courseId,
    course_slug: courseSlug,
    course_name: courseName,
    batch_status: batchStatus,
    batch_start_date: batchStartDate,
    course_price: price,
    mode: mode,
    page_type: 'batch',
  });
}

export function trackBatchCtaClick(payload: BatchCtaClickPayload): void {
  pushToDataLayer('batch_cta_click', {
    batch_id: payload.batch_id,
    batch_name: payload.batch_name,
    course_name: payload.course_name || payload.batch_name,
    cta_location: payload.cta_location,
    cta_text: payload.cta_text || 'Join Live Batch',
    page_type: getActivePageContext().page_type || 'batch',
  });
}

// ============================================================================
// 4. Contact & Outbound Communication CTAs (WhatsApp, Phone, Email)
// ============================================================================

export function trackWhatsAppClick(params: {
  buttonText?: string;
  courseId?: string;
  courseSlug?: string;
  courseName?: string;
  batchId?: string;
  ctaLocation?: CtaLocation;
  linkUrl?: string;
}): void {
  const location = params.ctaLocation || 'floating_button';
  const dedupeKey = `whatsapp_click:${location}:${params.courseSlug || params.batchId || ''}`;
  if (shouldDedupe(dedupeKey)) return;

  const pageContext = getActivePageContext();
  const attribution = getAttributionContext();

  const payload: WhatsAppClickPayload = {
    button_text: params.buttonText || 'WhatsApp',
    course_id: params.courseId || pageContext.course_id || '',
    course_slug: params.courseSlug || pageContext.course_slug || '',
    course_name: params.courseName || pageContext.course_name || '',
    batch_id: params.batchId || pageContext.batch_id || '',
    branch_id: pageContext.branch_id || '',
    branch_slug: pageContext.branch_slug || '',
    page_type: pageContext.page_type,
    cta_location: location,
    link_url: params.linkUrl || '',
    ...attribution,
  };

  pushToDataLayer('whatsapp_click', payload);
}

export function trackPhoneClick(params: {
  buttonText?: string;
  courseId?: string;
  courseSlug?: string;
  batchId?: string;
  ctaLocation?: CtaLocation;
} = {}): void {
  const location = params.ctaLocation || 'header';
  if (shouldDedupe(`phone_click:${location}`)) return;

  const pageContext = getActivePageContext();
  const attribution = getAttributionContext();

  const payload: PhoneClickPayload = {
    button_text: params.buttonText || 'Call Us',
    course_id: params.courseId || pageContext.course_id || '',
    course_slug: params.courseSlug || pageContext.course_slug || '',
    batch_id: params.batchId || pageContext.batch_id || '',
    branch_id: pageContext.branch_id || '',
    branch_slug: pageContext.branch_slug || '',
    page_type: pageContext.page_type,
    cta_location: location,
    ...attribution,
  };

  pushToDataLayer('phone_click', payload);
}

export function trackEmailClick(params: {
  buttonText?: string;
  courseId?: string;
  courseSlug?: string;
  ctaLocation?: CtaLocation;
} = {}): void {
  const location = params.ctaLocation || 'footer';
  if (shouldDedupe(`email_click:${location}`)) return;

  const pageContext = getActivePageContext();

  const payload: EmailClickPayload = {
    button_text: params.buttonText || 'Email Us',
    course_id: params.courseId || pageContext.course_id || '',
    course_slug: params.courseSlug || pageContext.course_slug || '',
    branch_id: pageContext.branch_id || '',
    branch_slug: pageContext.branch_slug || '',
    page_type: pageContext.page_type,
    cta_location: location,
  };

  pushToDataLayer('email_click', payload);
}

// ============================================================================
// 5. Form Funnel & Conversions (form_view, form_start, generate_lead)
// ============================================================================

const activeForms = new Set<string>();

export function trackFormView(formName: string, formType = 'lead_capture'): void {
  if (shouldDedupe(`form_view:${formName}`)) return;
  const pageContext = getActivePageContext();

  pushToDataLayer('form_view', {
    form_name: formName,
    form_type: formType,
    page_type: pageContext.page_type,
    course_slug: pageContext.course_slug || '',
    batch_id: pageContext.batch_id || '',
  });
}

export function trackFormStart(formName: string, formType = 'lead_capture'): void {
  if (activeForms.has(formName)) return;
  activeForms.add(formName);

  const pageContext = getActivePageContext();

  pushToDataLayer('form_start', {
    form_name: formName,
    form_type: formType,
    page_type: pageContext.page_type,
    course_slug: pageContext.course_slug || '',
    batch_id: pageContext.batch_id || '',
  });
}

export function trackFormSubmit(formName: string, additionalParams: Record<string, any> = {}): void {
  pushToDataLayer('form_submit', {
    form_name: formName,
    ...additionalParams,
  });
}

/**
 * Primary Conversion Event: generate_lead
 * Fires ONLY upon verified server/application completion. Never fires on button click or validation error.
 */
export function trackGenerateLead(formName: string, details: Record<string, any> = {}): void {
  activeForms.delete(formName);

  // Deduplicate lead conversions by form name within 2 seconds
  if (shouldDedupe(`generate_lead:${formName}`, 2000)) return;

  const attribution = getAttributionContext();
  const pageContext = getActivePageContext();

  const payload: GenerateLeadPayload = {
    form_name: formName,
    page_type: pageContext.page_type,
    course_slug: pageContext.course_slug || details.course_slug || '',
    course_name: pageContext.course_name || details.course_name || '',
    batch_id: pageContext.batch_id || details.batch_id || '',
    batch_name: pageContext.batch_name || details.batch_name || '',
    branch_id: pageContext.branch_id || details.branch_id || '',
    branch_slug: pageContext.branch_slug || details.branch_slug || '',
    ...attribution,
    ...details,
  };

  pushToDataLayer('generate_lead', payload);
}

// ============================================================================
// 6. Specialized Funnel Trackers (demo_request, enrollment_start, enrollment_submit)
// ============================================================================

export function trackDemoRequest(details: { courseName?: string; preferredDate?: string } = {}): void {
  if (shouldDedupe('demo_request', 1500)) return;

  const attribution = getAttributionContext();
  pushToDataLayer('demo_request', {
    course_name: details.courseName || '',
    preferred_date: details.preferredDate || '',
    ...attribution,
  });

  // Also trigger primary generate_lead conversion
  trackGenerateLead('demo_booking', {
    lead_type: 'demo_request',
    course_name: details.courseName,
    preferred_date: details.preferredDate,
  });
}

export function trackEnrollmentStart(params: {
  batchId?: string;
  batchName?: string;
  courseName?: string;
} = {}): void {
  if (shouldDedupe(`enrollment_start:${params.batchId || 'general'}`)) return;

  pushToDataLayer('enrollment_start', {
    batch_id: params.batchId || '',
    batch_name: params.batchName || '',
    course_name: params.courseName || '',
  });
}

export function trackEnrollmentSubmit(params: {
  batchId?: string;
  batchName?: string;
  courseName?: string;
  coursePrice?: number | string;
  courseMode?: string;
} = {}): void {
  if (shouldDedupe(`enrollment_submit:${params.batchId || 'general'}`, 1500)) return;

  const attribution = getAttributionContext();
  pushToDataLayer('enrollment_submit', {
    batch_id: params.batchId || '',
    batch_name: params.batchName || '',
    course_name: params.courseName || '',
    course_price: params.coursePrice || 0,
    course_mode: params.courseMode || '',
    ...attribution,
  });
}

// ============================================================================
// 7. Internal Search & Content Engagement
// ============================================================================

export function trackSearch(searchTerm: string, resultsCount = 0, searchCategory = 'all'): void {
  const cleanTerm = searchTerm.trim().toLowerCase();
  if (!cleanTerm || shouldDedupe(`search:${cleanTerm}`, 2000)) return;

  const payload: SearchEventPayload = {
    search_term: cleanTerm,
    search_category: searchCategory,
    results_count: resultsCount,
  };

  pushToDataLayer('search', payload);
}

export function trackResourceDownload(params: {
  fileName: string;
  downloadType: 'notes' | 'cheatsheet' | 'brochure' | 'syllabus' | 'offline_guide' | 'other';
  resourceId?: string;
  topic?: string;
  fileExtension?: string;
}): void {
  const ext = params.fileExtension || params.fileName.split('.').pop() || 'pdf';
  const pageContext = getActivePageContext();

  const payload: ResourceDownloadPayload = {
    resource_id: params.resourceId || params.fileName,
    resource_title: params.fileName,
    resource_type: params.downloadType,
    topic: params.topic || pageContext.course_name || '',
    file_extension: ext,
    page_type: pageContext.page_type,
  };

  // Push standard resource_download event
  pushToDataLayer('resource_download', payload);

  // Also push generic file_download for GTM/GA4 enhanced measurement
  pushToDataLayer('file_download', {
    file_name: params.fileName,
    file_extension: ext,
    download_type: params.downloadType,
  });

  // Specific event for notes
  if (params.downloadType === 'notes') {
    pushToDataLayer('note_download', { file_name: params.fileName });
  }
}

export function trackTutorialView(params: {
  tutorialSlug: string;
  topicSlug?: string;
  title?: string;
  courseName?: string;
}): void {
  if (shouldDedupe(`tutorial_view:${params.tutorialSlug}:${params.topicSlug || ''}`)) return;

  pushToDataLayer('tutorial_view', {
    tutorial_slug: params.tutorialSlug,
    topic_slug: params.topicSlug || '',
    lesson_title: params.title || '',
    course_name: params.courseName || '',
    page_type: 'tutorial',
  });
}

export function trackCertificateVerify(isValid: boolean, certId?: string): void {
  const payload: CertificateVerifyPayload = {
    is_valid: isValid,
    page_type: 'verify_certificate',
  };

  pushToDataLayer('certificate_verify', payload);
}

// ============================================================================
// 8. Multi-Branch & Location Engagement (Phase 5)
// ============================================================================

export function trackBranchView(params: {
  branchId: string;
  branchSlug: string;
  branchName: string;
  city: string;
  state?: string;
  status: string;
}): void {
  const dedupeKey = `branch_view:${params.branchSlug}`;
  if (shouldDedupe(dedupeKey)) return;

  pushToDataLayer('branch_view', {
    branch_id: params.branchId,
    branch_slug: params.branchSlug,
    branch_name: params.branchName,
    city: params.city,
    state: params.state || 'Uttar Pradesh',
    branch_status: params.status,
    page_type: 'location',
  });
}

export function trackBranchCtaClick(params: {
  branchSlug: string;
  branchId?: string;
  ctaType: 'direction' | 'whatsapp' | 'phone' | 'email' | 'course_click' | 'batch_click';
  buttonText: string;
}): void {
  pushToDataLayer('branch_cta_click', {
    branch_slug: params.branchSlug,
    branch_id: params.branchId || '',
    cta_type: params.ctaType,
    button_text: params.buttonText,
    page_type: 'location',
  });
}

