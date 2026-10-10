'use client';

import { useEffect } from 'react';
import { trackBatchView } from '@/lib/dataLayer';
import { LiveBatch } from '@/types';

/**
 * Client component to fire `batch_view` on mounting a live batch detail page
 * with real parameters from the website data source.
 */
export default function BatchViewTracker({
  batch,
  courseTitle,
  courseMode,
}: {
  batch: LiveBatch;
  courseTitle?: string;
  courseMode?: string;
}) {
  useEffect(() => {
    if (batch) {
      trackBatchView({
        batchId: batch.id,
        batchName: batch.title,
        courseName: courseTitle || batch.courseTitle || batch.title,
        batchStartDate: batch.startDate,
        coursePrice: batch.price,
        courseMode: courseMode || 'ONLINE',
      });
    }
  }, [batch, courseTitle, courseMode]);

  return null;
}
