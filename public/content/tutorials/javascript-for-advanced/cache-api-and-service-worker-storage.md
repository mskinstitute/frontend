# Cache API & Service Worker Storage in Modern JavaScript

In Progressive Web Applications (PWAs) and offline-capable web systems, network requests cannot be left to standard HTTP browser caching alone. The **Cache API** (`caches`) provides a programmatic storage mechanism for `Request` and `Response` object pairs, controlled directly by JavaScript and Service Workers.

---

## 1. What is the Cache API?

The `Cache` interface provides a persistent, asynchronous key-value store where:
- **Keys** are HTTP `Request` objects (or URL strings).
- **Values** are HTTP `Response` objects.

```
  Browser Fetch Request
           │
           ▼
  Service Worker Intercepts
           │
     ┌─────┴────────────────┐
     ▼                      ▼
Cache API (caches.match)   Live Network (fetch)
(Offline Instant Return)   (Slow / Online Only)
```

---

## 2. Core API Operations

```javascript
const CACHE_NAME = 'app-shell-v2';

// 1. Open or create a cache bucket
const cache = await caches.open(CACHE_NAME);

// 2. Add resources (Fetches and stores automatically)
await cache.addAll([
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.svg'
]);

// 3. Match resource from cache
const cachedResponse = await cache.match('/styles/main.css');
if (cachedResponse) {
  console.log('Serving from Cache API:', cachedResponse.status);
}

// 4. Delete obsolete cache buckets during Service Worker activate
const keys = await caches.keys();
await Promise.all(
  keys
    .filter(key => key !== CACHE_NAME)
    .map(oldKey => caches.delete(oldKey))
);
```

---

## 3. Top Caching Strategies

### 1. Cache First (Offline-First / Assets)
Ideal for static fonts, images, and immutable versioned JS bundles. Check cache first; only hit network if absent.

```javascript
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, fresh.clone()); // Clone before caching!
  return fresh;
}
```

### 2. Network First (Dynamic Data)
Ideal for account balances or live inventory. Try network; fallback to cache if offline.

```javascript
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}
```

### 3. Stale-While-Revalidate (Fastest & Fresh)
Return cached response immediately (instant load), while asynchronously fetching the network in the background to update the cache for next time!

---

## 4. The Critical Gotcha: Cloning Responses

A `Response` body stream can **only be read once**! If you store a response in the Cache API and return it to the browser, you **must clone it first**:

```javascript
// DANGER: Fails without cloning!
// cache.put(request, response);
// return response; // TypeError: response body stream already read!

// CORRECT PATTERN:
cache.put(request, response.clone());
return response;
```

---

## Practice Quiz

### Q1: What types of objects are paired as keys and values inside the Cache API?
- A) Strings and Numbers
- B) HTTP Request objects as keys and HTTP Response objects as values
- C) DOM Nodes and CSS Rules
- D) SQL Queries and Tables
**Answer:** B
**Explanation:** The Cache API specifically stores pairs of HTTP `Request` objects (or URLs) mapped to their corresponding HTTP `Response` objects.

### Q2: Why must a Response object be cloned (response.clone()) before being stored in cache.put()?
- A) To compress the data
- B) Because response streams can only be read once; consuming it for the cache would make it unreadable for the browser
- C) To encrypt the payload
- D) It is required by TypeScript
**Answer:** B
**Explanation:** `Response` body streams are single-use; calling `response.clone()` duplicates the stream so one copy can be stored while the other is returned to the client.

### Q3: Which caching strategy returns cached assets immediately for instant speed while silently updating the cache in the background?
- A) Network Only
- B) Stale-While-Revalidate
- C) Cache Only
- D) Network First
**Answer:** B
**Explanation:** The Stale-While-Revalidate pattern immediately serves the existing cached response and dispatches a background fetch to update the cache for future requests.

### Q4: In which Service Worker lifecycle event are outdated cache buckets typically purged?
- A) install
- B) activate
- C) fetch
- D) message
**Answer:** B
**Explanation:** The `activate` event is the standard place to clean up old cache versions (`caches.delete()`) after a new service worker version takes control.

### Q5: Can the Cache API be accessed from the main window thread or only inside Service Workers?
- A) Only in Service Workers
- B) In both window scripts and Service Workers (window.caches is available in secure contexts)
- C) Only in Node.js
- D) Only over HTTP without SSL
**Answer:** B
**Explanation:** The Cache API is exposed on the global `caches` object in both window contexts and worker contexts under secure origins (HTTPS or localhost).
