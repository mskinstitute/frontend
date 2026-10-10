'use client';

import toast from 'react-hot-toast';

export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    toast('Push notifications are not supported on this browser.', { icon: 'ℹ️' });
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Notifications enabled! You will receive live class & batch alerts.', {
        icon: '🔔',
      });
      // Send a welcoming test notification via active service worker
      sendLocalTestNotification('Welcome to MSK Institute!', {
        body: 'You are subscribed to live class reminders, batch alerts, and new course updates.',
        icon: '/brand/icon-192x192.png',
        badge: '/brand/android-icon-96x96.png',
      });
    } else if (permission === 'denied') {
      toast('Notifications were blocked. You can re-enable them in site settings.', {
        icon: '🔕',
      });
    }
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

export async function sendLocalTestNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/brand/icon-192x192.png',
      badge: '/brand/android-icon-96x96.png',
      ...options,
    });
    return true;
  } catch (err) {
    console.warn('Failed to display local notification:', err);
    return false;
  }
}
