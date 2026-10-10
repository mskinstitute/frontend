'use client';

/**
 * MSK Institute — DataLayer Adapter (Re-exports from unified @/lib/analytics)
 *
 * Preserves 100% backward compatibility for existing component imports
 * while redirecting to the centralized, type-safe analytics engine.
 */

export * from './analytics';

import {
  trackCourseView as anTrackCourseView,
  trackBatchView as anTrackBatchView,
  trackCertificateVerify as anTrackCertificateVerify,
  trackResourceDownload as anTrackResourceDownload,
  pushToDataLayer,
} from './analytics';

export function trackCourseEnquiry(data: Partial<{ courseId: string; courseName: string; courseCategory: string; coursePrice: number | string; courseMode: string }>): void {
  pushToDataLayer('course_enquiry', {
    course_id: data.courseId || '',
    course_name: data.courseName || '',
    course_category: data.courseCategory || '',
    course_price: data.coursePrice || 0,
    course_mode: data.courseMode || '',
  });
}

export function trackCourseRegister(data: Partial<{ courseId: string; courseName: string; courseCategory: string; coursePrice: number | string; courseMode: string }>): void {
  pushToDataLayer('course_register', {
    course_id: data.courseId || '',
    course_name: data.courseName || '',
    course_category: data.courseCategory || '',
    course_price: data.coursePrice || 0,
    course_mode: data.courseMode || '',
  });
}

export function trackBatchRegister(data: { batchId: string; batchName: string; courseName?: string; batchStartDate?: string; coursePrice?: number | string; courseMode?: string }): void {
  pushToDataLayer('batch_register', {
    batch_id: data.batchId,
    batch_name: data.batchName,
    course_name: data.courseName || data.batchName,
    batch_start_date: data.batchStartDate || '',
    course_price: data.coursePrice || 0,
    course_mode: data.courseMode || 'ONLINE',
  });
}

export function trackFileDownload(params: {
  fileName: string;
  fileExtension?: string;
  downloadType: 'brochure' | 'notes' | 'cheatsheet' | 'syllabus' | 'offline_guide' | 'other';
}): void {
  anTrackResourceDownload({
    fileName: params.fileName,
    fileExtension: params.fileExtension,
    downloadType: params.downloadType,
  });
}
