// public/sw.js - MSK Institute Progressive Web App Service Worker
const CACHE_VERSION = 'v-2.1.5';
const STATIC_CACHE = `msk-static-${CACHE_VERSION}`;
const CONTENT_CACHE = `msk-content-${CACHE_VERSION}`;
const OFFLINE_LESSONS_CACHE = 'msk-offline-lessons';

const urlsToCache = [
  '/',
  '/?source=pwa',
  '/courses',
  '/live',
  '/live-batches',
  '/study-material',
  '/blogs',
  '/verify-certificate',
  '/offline.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/logo.jpg',
  '/brand/icon-192x192.png',
  '/brand/icon-512x512.png',
  '/brand/maskable-icon-512x512.png',
  '/brand/android-icon-192x192.png',
  '/brand/android-icon-512x512.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png'
];

// Install: pre-cache critical shell assets & activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        urlsToCache.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('Pre-caching notice for:', url, err);
          })
        )
      );
    })
  );
});

// Activate: purge stale caches and notify client windows
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, CONTENT_CACHE, OFFLINE_LESSONS_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
     .then(() => {
       return self.clients.matchAll({ type: 'window' }).then((clients) => {
         clients.forEach((client) => {
           client.postMessage({ type: 'NEW_VERSION' });
         });
       });
     })
  );
});

// Multi-Tier Fetch Strategy:
// 1. HTML Navigations: Network-First with cache & offline fallback (prevents React hydration mismatches)
// 2. Static assets (_next/static, images, fonts): Cache-First
// 3. Raw Content assets (/content/, markdown files): Stale-While-Revalidate
// 4. APIs: Network-Only
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;
  if (url.pathname.includes('/_next/webpack-hmr')) return;

  // 1. API calls: Network-only
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 2. HTML Page Navigations: Network-First with cache & offline fallback
  // CRITICAL: Must be Network-First so client always receives the fresh SSR HTML
  // matching current client JS bundles, completely preventing hydration mismatches.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            const isContentRoute =
              url.pathname.startsWith('/tutorials/') ||
              url.pathname.startsWith('/blogs/') ||
              url.pathname.startsWith('/study-material');
            const targetCache = isContentRoute ? CONTENT_CACHE : STATIC_CACHE;
            caches.open(targetCache).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Check explicit offline lessons cache first
          const offlineLessonCache = await caches.open(OFFLINE_LESSONS_CACHE);
          const savedLesson = await offlineLessonCache.match(event.request);
          if (savedLesson) return savedLesson;

          const contentCache = await caches.open(CONTENT_CACHE);
          const cachedContent = await contentCache.match(event.request);
          if (cachedContent) return cachedContent;

          const staticCache = await caches.open(STATIC_CACHE);
          const cachedStatic = await staticCache.match(event.request);
          if (cachedStatic) return cachedStatic;

          const fallback = await caches.match('/offline.html');
          return fallback || new Response('Offline - MSK Institute', { headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 3. Static Assets (scripts, stylesheets, brand images): Cache-First
  const isStaticAsset =
    url.pathname.includes('/_next/static/') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. Raw Content & Markdown Files (non-navigation): Stale-While-Revalidate
  const isContentAsset =
    url.pathname.startsWith('/content/') ||
    url.pathname.endsWith('.md') ||
    url.pathname.startsWith('/data/');

  if (isContentAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CONTENT_CACHE).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(async () => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/offline.html');
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Background Sync: Flush offline queued admission leads
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(flushPendingLeadsInWorker());
  }
});

async function flushPendingLeadsInWorker() {
  try {
    // Open IndexedDB inside service worker
    const db = await openLeadsDatabase();
    const leads = await getAllPendingLeads(db);

    for (const lead of leads) {
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead.data),
        });
        if (res.ok) {
          await deletePendingLead(db, lead.id);
        }
      } catch (err) {
        console.warn('Sync lead attempt failed:', err);
      }
    }
  } catch (err) {
    console.warn('Background sync worker error:', err);
  }
}

function openLeadsDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('msk_offline_db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pending_leads')) {
        db.createObjectStore('pending_leads', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllPendingLeads(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending_leads', 'readonly');
    const store = tx.objectStore('pending_leads');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function deletePendingLead(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pending_leads', 'readwrite');
    const store = tx.objectStore('pending_leads');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Web Push Notifications: Display native push notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'MSK Institute', body: event.data ? event.data.text() : 'New update available!' };
  }

  const title = data.title || 'MSK Institute';
  const options = {
    body: data.body || 'Upcoming live class or new coding tutorial published.',
    icon: data.icon || '/brand/icon-192x192.png',
    badge: data.badge || '/brand/android-icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/live-batches',
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click: Focus existing app window or open URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Skip Waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
