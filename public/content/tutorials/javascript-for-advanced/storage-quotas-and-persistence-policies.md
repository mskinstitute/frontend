# Storage Quotas & Persistence Policies in Modern JavaScript

When web applications store hundreds of megabytes of media, offline databases, and application assets via IndexedDB and the Cache API, browsers enforce storage management policies. Understanding **Storage Quotas**, eviction algorithms, and requesting **Persistent Storage** ensures your app's offline data is never unexpectedly purged by the browser.

---

## 1. Storage Quotas: Best-Effort vs. Persistent

By default, all web storage (IndexedDB, Cache API, LocalStorage) operates in **Best-Effort mode**:
- **Best-Effort Storage:** If device disk space runs critically low, the browser's storage manager automatically **evicts (deletes) entire origin storage trees** without asking the user, using an LRU (Least Recently Used) policy!
- **Persistent Storage:** Data is guaranteed not to be deleted by automatic browser clearing. It can only be cleared if the user explicitly clears browser data.

```
Storage Mode:
  ├── Best-Effort (Default) ──► Low Disk Space? ──► Silently Deleted by Browser!
  └── Persistent Storage   ──► Low Disk Space? ──► PRESERVED! User must manually clear.
```

---

## 2. Inspecting Storage Quota with `navigator.storage.estimate()`

To monitor available space and consumption in bytes:

```javascript
async function checkStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const { quota, usage } = await navigator.storage.estimate();

    const usageMB = (usage / (1024 * 1024)).toFixed(2);
    const quotaMB = (quota / (1024 * 1024)).toFixed(2);
    const percentUsed = ((usage / quota) * 100).toFixed(1);

    console.log(`Storage: ${usageMB} MB used of ${quotaMB} MB available (${percentUsed}%)`);

    if (percentUsed > 80) {
      console.warn('Storage quota above 80%! Prompting user to clear old media.');
    }
  }
}
```

---

## 3. Requesting Persistent Storage: `navigator.storage.persist()`

To transition your origin from Best-Effort to Persistent storage, request persistence:

```javascript
async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    // Check if already persistent
    const isAlreadyPersistent = await navigator.storage.persisted();
    console.log('Already persistent:', isAlreadyPersistent);

    if (!isAlreadyPersistent) {
      // Request permission from browser/user
      const isGranted = await navigator.storage.persist();
      console.log(`Persistent storage granted: ${isGranted}`);
      
      if (isGranted) {
        console.log('Data is protected from automatic browser eviction.');
      } else {
        console.log('Operating in best-effort storage mode.');
      }
    }
  }
}
```

### Browser Granting Heuristics:
Browsers (Chrome, Firefox, Safari) may grant persistent storage automatically without a prompt if:
- The site is installed as a PWA (added to home screen).
- The user has bookmarked the site.
- The user has high engagement (frequent visits).
- Push notification permissions have been granted.

---

## 4. Handling Storage Overflows: QuotaExceededError

When attempting to store data beyond the allowed quota, operations throw a `QuotaExceededError` (`DOMException` code 22). Always catch this error defensively:

```javascript
try {
  await cache.put(request, largeResponse);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Disk quota exceeded! Purging non-essential caches.');
    purgeOldestCacheBucket();
  }
}
```

---

## Practice Quiz

### Q1: What happens to data stored in "Best-Effort" mode when the client device runs low on disk space?
- A) The device reboots
- B) The browser automatically purges storage for least recently used origins to reclaim disk space
- C) It compresses files into zip archives
- D) It prompts the user with a password screen
**Answer:** B
**Explanation:** Under default "best-effort" storage, browsers reserve the right to silently delete an origin's storage pool when local disk space drops below safety thresholds.

### Q2: Which method requests the browser to exempt an application from automatic storage eviction?
- A) navigator.storage.persist()
- B) window.requestStorage()
- C) document.setPermanent()
- D) localStorage.lock()
**Answer:** A
**Explanation:** `navigator.storage.persist()` requests that the origin's storage be converted to persistent mode, protecting it from automatic browser eviction.

### Q3: What function calculates current storage usage and maximum quota allocation in bytes?
- A) navigator.storage.estimate()
- B) window.getStorageSize()
- C) performance.storage()
- D) indexedDB.quota()
**Answer:** A
**Explanation:** `navigator.storage.estimate()` returns a Promise resolving to `{ quota, usage }` in bytes.

### Q4: What error is thrown when an IndexedDB or Cache API write exceeds available storage capacity?
- A) RangeError
- B) QuotaExceededError
- C) OutOfMemoryError
- D) StorageCapacityException
**Answer:** B
**Explanation:** When storage allocations exceed allowable origin quotas, browser storage APIs throw a `DOMException` named `QuotaExceededError`.

### Q5: How can a developer verify whether the current site has already been granted persistent storage?
- A) navigator.storage.persisted()
- B) window.isStoragePermanent
- C) document.persisted
- D) localStorage.isLocked
**Answer:** A
**Explanation:** `navigator.storage.persisted()` returns a Promise resolving to a boolean indicating whether the origin has persistent storage status.
