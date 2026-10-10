'use client';

/**
 * W3C Badging API utility
 * Sets an unread badge on the installed PWA desktop taskbar or mobile home screen icon.
 */

interface NavigatorWithBadging {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
}

export function isBadgingSupported(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as unknown as NavigatorWithBadging;
  return typeof nav.setAppBadge === 'function';
}

export async function setAppBadge(count?: number): Promise<boolean> {
  if (!isBadgingSupported()) return false;
  try {
    const nav = navigator as unknown as NavigatorWithBadging;
    if (nav.setAppBadge) {
      if (typeof count === 'number' && count > 0) {
        await nav.setAppBadge(count);
      } else {
        await nav.setAppBadge();
      }
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Could not set app badge:', err);
    return false;
  }
}

export async function clearAppBadge(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  try {
    const nav = navigator as unknown as NavigatorWithBadging;
    if (nav.clearAppBadge) {
      await nav.clearAppBadge();
      return true;
    }
  } catch (err) {
    console.warn('Could not clear app badge:', err);
    return false;
  }
  return false;
}

