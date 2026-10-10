/**
 * MSK Institute — Analytics & Telemetry Types
 *
 * Provides strict TypeScript schemas for Google Tag Manager (GTM)
 * and Google Analytics 4 (GA4) dataLayer events.
 */

export type PageType =
  | 'home'
  | 'courses_catalog'
  | 'course'
  | 'live_batches'
  | 'batch'
  | 'blogs_catalog'
  | 'blog'
  | 'tutorials_catalog'
  | 'tutorial'
  | 'study_material'
  | 'contact'
  | 'careers'
  | 'tools'
  | 'verify_certificate'
  | 'playground'
  | 'privacy_policy'
  | 'terms'
  | 'disclaimer'
  | 'admin'
  | 'location'
  | 'locations_directory'
  | 'other';

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'floating_button'
  | 'course_card'
  | 'course_page'
  | 'batch_card'
  | 'batch_page'
  | 'syllabus'
  | 'footer'
  | 'modal'
  | 'mobile_nav'
  | 'contact_section'
  | 'sidebar';

export type StandardAnalyticsEvent =
  | 'page_view'
  | 'page_context'
  | 'view_item_list'
  | 'select_item'
  | 'view_item'
  | 'batch_view'
  | 'batch_cta_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'form_view'
  | 'form_start'
  | 'generate_lead'
  | 'demo_request'
  | 'enrollment_start'
  | 'enrollment_submit'
  | 'search'
  | 'resource_download'
  | 'file_download'
  | 'certificate_verify'
  | 'branch_view'
  | 'branch_cta_click'
  | 'share';

export interface PageContext {
  page_type: PageType;
  page_title?: string;
  page_path?: string;
  course_id?: string;
  course_slug?: string;
  course_name?: string;
  batch_id?: string;
  batch_name?: string;
  branch_id?: string;
  branch_slug?: string;
  branch_name?: string;
  article_id?: string;
  article_slug?: string;
  article_category?: string;
  tutorial_slug?: string;
  topic_slug?: string;
}

export interface UtmAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  first_seen?: string;
}

export interface CourseItemParam {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
  index?: number;
}

export interface ViewItemListPayload {
  item_list_id?: string;
  item_list_name: string;
  items: CourseItemParam[];
}

export interface SelectItemPayload {
  item_list_id?: string;
  item_list_name: string;
  items: CourseItemParam[];
}

export interface ViewItemPayload {
  currency?: string;
  value?: number;
  items: CourseItemParam[];
  course_id?: string;
  course_slug?: string;
  course_name?: string;
  course_category?: string;
  course_duration?: string;
  course_mode?: string;
}

export interface BatchViewPayload {
  batch_id: string;
  batch_name: string;
  course_id?: string;
  course_slug?: string;
  course_name?: string;
  batch_status?: string;
  batch_start_date?: string;
  mode?: string;
  price?: number | string;
  page_type?: PageType;
  branch_id?: string;
  branch_slug?: string;
  branch_name?: string;
}

export interface BatchCtaClickPayload {
  batch_id: string;
  batch_name: string;
  course_name?: string;
  cta_location: CtaLocation;
  cta_text?: string;
  branch_id?: string;
  branch_slug?: string;
}

export interface WhatsAppClickPayload {
  button_text?: string;
  course_id?: string;
  course_slug?: string;
  course_name?: string;
  batch_id?: string;
  page_type?: PageType;
  cta_location: CtaLocation;
  link_url?: string;
  branch_id?: string;
  branch_slug?: string;
}

export interface PhoneClickPayload {
  button_text?: string;
  course_id?: string;
  course_slug?: string;
  batch_id?: string;
  page_type?: PageType;
  cta_location: CtaLocation;
  branch_id?: string;
  branch_slug?: string;
}

export interface EmailClickPayload {
  button_text?: string;
  course_id?: string;
  course_slug?: string;
  page_type?: PageType;
  cta_location: CtaLocation;
  branch_id?: string;
  branch_slug?: string;
}

export interface FormEventPayload {
  form_name: string;
  form_type?: string;
  course_id?: string;
  course_slug?: string;
  batch_id?: string;
  page_type?: PageType;
  branch_id?: string;
  branch_slug?: string;
  [key: string]: any;
}

export interface GenerateLeadPayload {
  form_name: string;
  lead_type?: string;
  course_name?: string;
  course_id?: string;
  batch_id?: string;
  batch_name?: string;
  branch_id?: string;
  branch_slug?: string;
  preferred_date?: string;
  lead_source?: string;
  lead_medium?: string;
  lead_campaign?: string;
  [key: string]: any;
}

export interface ResourceDownloadPayload {
  resource_id?: string;
  resource_title: string;
  resource_type: 'notes' | 'cheatsheet' | 'brochure' | 'syllabus' | 'offline_guide' | 'other';
  topic?: string;
  file_extension?: string;
  page_type?: PageType;
}

export interface SearchEventPayload {
  search_term: string;
  search_category?: string;
  results_count?: number;
}

export interface CertificateVerifyPayload {
  is_valid: boolean;
  page_type?: PageType;
}

export interface BranchViewPayload {
  branch_id: string;
  branch_slug: string;
  branch_name: string;
  city: string;
  state?: string;
  status: string;
}

export interface BranchCtaClickPayload {
  branch_id: string;
  branch_slug: string;
  cta_type: 'direction' | 'whatsapp' | 'phone' | 'email' | 'course_click' | 'batch_click';
  button_text: string;
}

