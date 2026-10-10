# The Next.js 15 Caching System: Request Memoization & Data Cache

Next.js features an enterprise-grade multi-tier caching architecture designed to optimize latency and minimize database load. In **Next.js 15**, caching defaults are engineered to be **uncached by default for `fetch` requests**, ensuring developers have complete, explicit control over caching behaviors.

---

## 1. The Four Caching Layers in Next.js

1. **Request Memoization (React Component Tree):** Deduplicates identical `fetch(url)` calls made across multiple components during a single server render pass.
2. **Data Cache (Persistent Cross-Request Cache):** Stores data fetch results across user requests and deployments.
3. **Full Route Cache (Server):** Caches the rendered HTML and React Server Component Payload of static routes on the server.
4. **Router Cache (Client Browser):** In-memory cache in the browser that stores previously visited route segments for instant back/forward navigation.

---

## 2. Explicit Caching with `fetch()` in Next.js 15

In Next.js 15, `fetch` requests are **no longer cached by default** (defaulting to `cache: 'no-store'`). Developers explicitly define caching strategies:

### 1. Force Cache (Static Data)
Ideal for blog articles, course listings, or product catalogs that rarely change:
```typescript
// Cached persistently across all users and requests
const staticData = await fetch('https://api.example.com/courses', {
  cache: 'force-cache'
});
```

### 2. Time-Based Revalidation (ISR - Incremental Static Regeneration)
Cache data for a specific duration (e.g. 60 seconds), then automatically revalidate in the background when requested:
```typescript
const freshData = await fetch('https://api.example.com/prices', {
  next: { revalidate: 60 } // Cache for 60 seconds
});
```

### 3. No-Store (Dynamic Real-Time Data)
Always fetch fresh data directly from the upstream source on every request:
```typescript
const liveUserData = await fetch('https://api.example.com/user/wallet', {
  cache: 'no-store'
});
```

---

## 3. On-Demand Cache Invalidation with Tags

Next.js provides cache tagging for fine-grained, instantaneous cache purging:

```typescript
// Fetch with a cache tag
const res = await fetch('https://api.example.com/products/10', {
  next: { tags: ['products', 'product-10'] }
});
```

When an admin updates product 10 in a dashboard, you can purge the cache on-demand instantly using `revalidateTag('product-10')`!

---

# Multiple Choice Questions

### 1. What is the default caching behavior of the native `fetch()` API in Next.js 15?
A. Aggressively cached forever (`force-cache`).
B. Uncached by default (`no-store`), ensuring dynamic real-time data unless explicitly configured.
C. Stored in browser `localStorage`.
D. Cached for exactly 5 minutes.
**Answer:** B
**Explanation:** Next.js 15 changed the default fetch caching policy to uncached (`no-store`), giving developers explicit control over caching strategies.
---

### 2. What is Request Memoization in Next.js and React?
A. Compressing requests into zip files.
B. Automatically deduplicating identical `GET fetch()` requests across different components during a single server render, executing only one network call.
C. Memorizing user passwords.
D. Storing data on disk for 10 years.
**Answer:** B
**Explanation:** Request memoization is a React feature that ensures identical fetch calls with the same URL and options made during a single render pass share the same promise.
---

### 3. How do you configure a `fetch` call to cache data and automatically revalidate it every 10 minutes?
A. `{ next: { revalidate: 600 } }`
B. `{ cache: '10m' }`
C. `{ timer: 600 }`
D. `{ expireAfter: 600000 }`
**Answer:** A
**Explanation:** Passing `next: { revalidate: 600 }` sets time-based revalidation in seconds (600 seconds = 10 minutes).
---

### 4. Which function clears the cached data associated with a specific cache tag across all servers?
A. `clearCacheTag('tag')`
B. `revalidateTag('tag')`
C. `deleteTag('tag')`
D. `purge('tag')`
**Answer:** B
**Explanation:** `revalidateTag('tag')` from `next/cache` invalidates all cached entries tagged with that identifier.
---

### 5. Where does the Client-Side Router Cache live?
A. On an AWS S3 bucket.
B. In the browser's temporary memory for the duration of the user's active session.
C. In MongoDB.
D. Inside the server CPU cache.
**Answer:** B
**Explanation:** The Router Cache is an in-memory client-side cache stored in browser memory, enabling instant back/forward navigation.
---
