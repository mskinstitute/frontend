import { LiveBatch } from '@/types';

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
      const d = new Date(year, month - 1, day, hours, minutes, 0);
      return d.getTime();
    }
    const d = new Date(batch.startDate).getTime();
    if (!isNaN(d)) return d;
  }

  return 0;
}
