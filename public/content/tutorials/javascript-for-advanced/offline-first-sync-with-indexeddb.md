# Capstone Part 3: Offline-First Sync with IndexedDB

In modern enterprise web development, an application should never show a dinosaur game or crash when the user loses Wi-Fi. In this capstone lesson, you will build an **Offline-First Synchronization Engine** that persists state locally to IndexedDB, queues optimistic mutations while offline, and synchronizes with the remote cloud when the network recovers.

---

## 1. Offline-First Architecture

```
  UI Action (User edits dashboard)
               │
               ▼
  1. Optimistic Local Update (Instant UI feedback!)
  2. Write to IndexedDB local database
  3. Enqueue mutation in "Outbox" Store
               │
      Is Device Online?
      ┌────────┴────────┐
     YES                NO
      │                  │
      ▼                  ▼
  Send to Server     Wait for window 'online' event!
      │                  │
      └──────◄───────────┘
```

---

## 2. Implementing the Offline Sync Queue Manager

```javascript
class OfflineSyncManager {
  constructor(db, apiEndpoint) {
    this.db = db;
    this.apiEndpoint = apiEndpoint;
    this.isSyncing = false;

    this.initNetworkListeners();
  }

  initNetworkListeners() {
    // Listen for network restoration
    window.addEventListener('online', () => {
      console.log('[Network] Internet connection restored! Triggering sync...');
      this.syncOutbox();
    });

    window.addEventListener('offline', () => {
      console.warn('[Network] Device went offline. Mutations queued locally.');
    });
  }

  // Enqueue an action to be executed remotely
  async queueMutation(mutation) {
    const record = {
      id: 'mut_' + crypto.randomUUID(),
      type: mutation.type,
      payload: mutation.payload,
      createdAt: Date.now(),
      retryCount: 0
    };

    // Save to IndexedDB 'outbox' store
    await this.writeToStore('outbox', record);

    // If currently online, trigger sync immediately
    if (navigator.onLine) {
      this.syncOutbox();
    }
  }

  async syncOutbox() {
    if (this.isSyncing || !navigator.onLine) return;
    this.isSyncing = true;

    try {
      const pendingMutations = await this.getAllFromStore('outbox');
      console.log(`[Sync] Processing ${pendingMutations.length} pending mutations...`);

      for (const mutation of pendingMutations) {
        try {
          // Dispatch to remote server
          const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mutation)
          });

          if (response.ok) {
            // Success! Remove from outbox
            await this.deleteFromStore('outbox', mutation.id);
            console.log(`[Sync] Mutation ${mutation.id} synced successfully.`);
          } else if (response.status >= 400 && response.status < 500) {
            // Client error (unrecoverable): discard to prevent outbox blocking
            await this.deleteFromStore('outbox', mutation.id);
          }
        } catch (netErr) {
          console.warn('[Sync] Network error during batch; halting sync until online.');
          break; // Stop loop; will retry on next 'online' event
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  // IndexedDB Promise Helpers
  writeToStore(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      tx.objectStore(storeName).put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  getAllFromStore(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  deleteFromStore(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([storeName], 'readwrite');
      tx.objectStore(storeName).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
```

---

## 3. Background Sync API (PWA Standard)

Modern Service Workers support the **Background Sync API**, allowing the browser to wake up in the background and drain the outbox even after the user has completely closed the website:

```javascript
// Register Background Sync in Service Worker
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('outbox-sync');
    console.log('Background Sync registered!');
  }
}

// Inside sw.js (Service Worker):
self.addEventListener('sync', (event) => {
  if (event.tag === 'outbox-sync') {
    event.waitUntil(drainOfflineOutbox());
  }
});
```

---

## Practice Quiz

### Q1: What is an "Optimistic UI Update"?
- A) Predicting stock market increases
- B) Updating the local user interface immediately assuming the network request will succeed, reverting only if the server returns an error
- C) Disabling error handlers
- D) Relying entirely on HTTP 200 responses
**Answer:** B
**Explanation:** Optimistic UI updates update the interface instantly on user action without waiting for network round-trips, delivering zero-latency user feedback.

### Q2: What event fires on the window object when a device regains internet access?
- A) window.onconnect
- B) window.addEventListener('online')
- C) document.onnetwork
- D) window.addEventListener('networkresume')
**Answer:** B
**Explanation:** The browser fires the `online` event on `window` whenever network connectivity transitions from disconnected to connected.

### Q3: Why is an "Outbox" Object Store used in IndexedDB for offline synchronization?
- A) To store email drafts
- B) To queue pending create/update/delete mutations in persistent storage so they survive browser crashes and can replay when connectivity returns
- C) To hold CSS styles
- D) To prevent garbage collection
**Answer:** B
**Explanation:** An IndexedDB outbox queue holds state mutations made while offline, guaranteeing they persist on disk until successfully synced to the cloud.

### Q4: What is the primary benefit of the Service Worker Background Sync API?
- A) It runs faster than WebSockets
- B) It allows the browser to process and drain queued offline mutations in the background even if the user has navigated away or closed the tab
- C) It bypasses CORS
- D) It compiles JavaScript into binary code
**Answer:** B
**Explanation:** The Background Sync API allows the browser to postpone synchronization until network connectivity is stable and execute it in a background service worker.

### Q5: What should happen to a queued mutation in the outbox if the server returns HTTP 400 Bad Request?
- A) It should be retried infinitely every second
- B) It should be pruned/discarded from the queue to prevent blocking subsequent valid mutations (poison pill prevention)
- C) The browser should reload
- D) The entire database should be wiped
**Answer:** B
**Explanation:** Unrecoverable client errors (4xx) must be pruned from the outbox to avoid "poison pill" scenarios where a broken request blocks all subsequent queued tasks.
