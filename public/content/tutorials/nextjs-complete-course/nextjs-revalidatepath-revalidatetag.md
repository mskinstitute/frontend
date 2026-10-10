# On-Demand Cache Revalidation with revalidatePath and revalidateTag

Static caching delivers blazing speed, but modern web applications require instant updates when content changes. Next.js provides two fundamental on-demand revalidation APIs: **`revalidatePath`** (invalidating specific route URLs) and **`revalidateTag`** (invalidating data associated with semantic cache tags across the entire application).

---

## 1. Path-Based Revalidation: `revalidatePath()`

`revalidatePath` allows purging cached data and server-rendered HTML for a specific route:

```typescript
import { revalidatePath } from 'next/cache';

// Purge cache for a specific page:
revalidatePath('/courses/tailwind-css-mastery');

// Purge cache for all dynamic routes under a folder:
revalidatePath('/courses/[slug]', 'page');

// Purge cache for an entire layout and all its nested children:
revalidatePath('/admin', 'layout');
```

---

## 2. Tag-Based Revalidation: `revalidateTag()` (Semantic Granularity)

While `revalidatePath` targets a URL, a single piece of data (e.g. a course's title and price) might be displayed on multiple pages: the Homepage, the Course Catalog, the Checkout Page, and the User Dashboard.

Revalidating paths one-by-one is fragile. **`revalidateTag`** associates data with a tag, purging every occurrence across all pages in a single call!

```typescript
// 1. Fetching with cache tags in Server Components:
const courseData = await fetch('https://api.example.com/courses/10', {
  next: { tags: ['courses', 'course-10'] }
});
```

```typescript
// 2. Invalidate everywhere in a Server Action or Webhook:
import { revalidateTag } from 'next/cache';

export async function updateCoursePriceAction(courseId: string, newPrice: number) {
  await updatePriceInDb(courseId, newPrice);

  // Invalidate EVERY component and page that cached 'course-10'!
  revalidateTag(`course-${courseId}`);
}
```

---

## 3. Comparison: When to Use Which?

| Feature | `revalidatePath` | `revalidateTag` |
| :--- | :--- | :--- |
| **Scope** | Targets a specific URL path or route layout | Targets semantic data entities across the entire site |
| **Use Case** | Form submission updating a single specific view | CMS webhooks, product price updates, user profile edits |
| **Granularity** | Coarse-grained (entire page or layout) | Fine-grained (exact data payload) |

---

# Multiple Choice Questions

### 1. What does `revalidatePath('/blog')` do?
A. It deletes the blog posts from MongoDB.
B. It invalidates the cached server render for `/blog`, ensuring the next visitor receives fresh data and HTML.
C. It redirects the user to `/blog`.
D. It restarts the web server.
**Answer:** B
**Explanation:** `revalidatePath()` purges the cache for the specified path, prompting Next.js to re-render fresh content on the subsequent request.
---

### 2. If a single product entity is displayed on 5 different pages across your website, what is the most efficient revalidation strategy?
A. Manually call `revalidatePath` for all 5 individual URLs.
B. Tag the data with `next: { tags: ['product-123'] }` during fetch and call `revalidateTag('product-123')` on update.
C. Rebuild the entire website from scratch.
D. Delete all browser cookies.
**Answer:** B
**Explanation:** Tag-based revalidation (`revalidateTag`) purges all cached entries associated with the tag across all routes in one unified operation.
---

### 3. In what environments can `revalidatePath` and `revalidateTag` be executed?
A. In the browser console.
B. Only on the server (inside Server Actions, Route Handlers, or server-side functions).
C. Inside Client Components `useEffect`.
D. Inside CSS stylesheets.
**Answer:** B
**Explanation:** Cache revalidation APIs are server-only functions provided by `next/cache` and cannot execute in client browser environments.
---

### 4. What does passing `'layout'` as the second argument to `revalidatePath('/dashboard', 'layout')` accomplish?
A. It revalidates the `/dashboard` route and all nested child routes beneath it.
B. It switches the site to dark mode.
C. It downloads the dashboard HTML to the client's desktop.
D. It creates a new layout file.
**Answer:** A
**Explanation:** Passing `'layout'` instructs Next.js to invalidate the layout and every child segment descending from that path.
---

### 5. How quickly do cache revalidations take effect?
A. After 24 hours.
B. Immediately on demand on the next request.
C. Only after git commit.
D. After 30 days.
**Answer:** B
**Explanation:** On-demand revalidation takes effect immediately; subsequent requests receive fresh data without waiting for time-based TTL expiration.
---
