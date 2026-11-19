import { LiveBatch } from '@/types';
import { BUSINESS_CONFIG } from '@/config/business';

/**
 * Safely parse a live batch's start timestamp in milliseconds.
 * Supports startDateTime ISO strings or startDate YYYY-MM-DD + schedule time strings.
 */
export function parseBatchStartTimestamp(batch: LiveBatch): number {
  if (batch.startDateTime) {
    const ts = new Date(batch.startDateTime).getTime();
    if (!isNaN(ts)) return ts;
  }

  if (batch.startDate) {
    let timePart = '09:00 AM';
    if (batch.schedule) {
      const match = batch.schedule.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (match) timePart = match[1];
    }
    const [hVal, mVal] = timePart.split(':');
    const [mins, ampm] = (mVal || '00 AM').trim().split(' ');
    let hours = parseInt(hVal, 10) || 9;
    const minutes = parseInt(mins, 10) || 0;
    if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const [year, month, day] = batch.startDate.split('-').map(Number);
    if (year && month && day) {
      // Treat batch schedules deterministically as Indian Standard Time (IST, UTC+5:30)
      // so SSR (UTC) and client browsers (IST or global) produce identical timestamps.
      const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
      return Date.UTC(year, month - 1, day, hours, minutes, 0) - istOffsetMs;
    }
    const d = new Date(batch.startDate).getTime();
    if (!isNaN(d)) return d;
  }

  return 0;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Standardize upcoming cohort date helper:
 * Displays the next upcoming cohort date (currently "December 1, 2026")
 * or "Rolling Admissions" if a cohort date has already expired/passed.
 */
export function getUpcomingCohortDate(dateStr?: string, startTs?: number): string {
  if (!dateStr && !startTs) {
    return BUSINESS_CONFIG.stats.nextCohortDate;
  }

  const now = Date.now();

  // If timestamp is provided or can be parsed
  let ts = startTs || 0;
  if (!ts && dateStr) {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      if (year && month && day) {
        ts = new Date(year, month - 1, day).getTime();
      } else {
        ts = new Date(dateStr).getTime();
      }
    } catch {}
  }

  if (ts > 0 && ts < now) {
    return 'Rolling Admissions';
  }

  if (dateStr && dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2].slice(0, 2), 10);
      if (!isNaN(year) && monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
        return `${day} ${MONTH_NAMES[monthIndex]} ${year}`;
      }
    }
  }

  return BUSINESS_CONFIG.stats.nextCohortDate;
}
