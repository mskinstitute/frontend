'use client';

import toast from 'react-hot-toast';

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  courseInterest?: string;
  message?: string;
  batchId?: string;
  source?: string;
  [key: string]: unknown;
}

const DB_NAME = 'msk_offline_db';
const STORE_NAME = 'pending_leads';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueLeadOffline(leadData: LeadPayload): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = {
      data: leadData,
      timestamp: new Date().toISOString(),
    };
    const req = store.add(item);
    req.onsuccess = async () => {
      resolve(req.result as number);

      // Register Background Sync if supported (Chromium / Android)
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const reg = await navigator.serviceWorker.ready;
          const syncReg = reg as unknown as { sync?: { register: (tag: string) => Promise<void> } };
          if (syncReg.sync) {
            await syncReg.sync.register('sync-leads');
          }
        } catch (err) {
          console.warn('Could not register background sync tag:', err);
        }
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingLeadsCount(): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

export async function flushPendingLeads(): Promise<number> {
  if (typeof window === 'undefined' || !navigator.onLine) return 0;

  try {
    const db = await openDB();
    const leads = await new Promise<{ id: number; data: LeadPayload }[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (leads.length === 0) return 0;

    let syncedCount = 0;

    for (const lead of leads) {
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead.data),
        });

        if (res.ok) {
          // Delete from queue
          await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(lead.id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
          syncedCount++;
        }
      } catch (err) {
        console.warn('Failed to sync lead item:', err);
      }
    }

    if (syncedCount > 0) {
      toast.success(
        `Internet reconnected! ${syncedCount} queued inquiry was submitted successfully.`,
        { icon: '🚀', duration: 5000 }
      );
    }

    return syncedCount;
  } catch (err) {
    console.warn('Error flushing pending leads:', err);
    return 0;
  }
}

// Global auto-sync listener when browser reconnects to internet
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushPendingLeads().catch(() => null);
  });
}

/**
 * Universal lead submission with automatic offline caching and background sync
 */
export async function submitLeadWithOfflineSupport(leadData: LeadPayload): Promise<{
  success: boolean;
  offline: boolean;
  message: string;
}> {
  // If definitely offline, queue immediately
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    await queueLeadOffline(leadData);
    return {
      success: true,
      offline: true,
      message: 'You appear to be offline. Your inquiry is safely saved on your device and will submit automatically as soon as internet connects!',
    };
  }

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return {
      success: true,
      offline: false,
      message: 'Inquiry submitted successfully! Our admissions counselor will contact you soon.',
    };
  } catch (err) {
    console.warn('Online submission failed, falling back to offline queue:', err);
    await queueLeadOffline(leadData);
    return {
      success: true,
      offline: true,
      message: 'Network connection was interrupted. Your inquiry is saved locally and will auto-submit when connection stabilizes.',
    };
  }
}
