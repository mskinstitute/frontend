# Streaming UI with loading.tsx and Suspense Boundaries

In traditional SSR architectures, the server must fetch all data for every component on the page before sending a single byte of HTML to the browser. If one slow database query takes 3 seconds, the user stares at a blank white screen for 3 seconds. Next.js 15 solves this completely with **Streaming Server-Side Rendering** and **React Suspense**.

---

## 1. How Streaming Works

Streaming allows the server to break down the page's HTML into smaller chunks and stream them progressively over the network as they become ready:

```text
1. Immediate: Server streams initial shell (Navbar, Layout, Skeletons)
2. 50ms later: Fast component (User Profile) streams in
3. 800ms later: Slow component (Course Analytics) streams in and replaces skeleton!
```

---

## 2. Instant Loading UI with `loading.tsx`

Creating a `loading.tsx` file inside any route segment automatically wraps that segment and its children in a `<React.Suspense>` boundary behind the scenes:

```tsx
// app/courses/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
```

The user sees this skeleton UI instantly while the server processes the database query in `page.tsx`!

---

## 3. Granular Streaming with `<Suspense>` Boundaries

Instead of blocking the entire page with a single route-level `loading.tsx`, you can stream independent components with their own `<Suspense>` fallbacks:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import UserProfileCard from '@/components/UserProfileCard'; // Fast component
import HeavyAnalyticsFeed from '@/components/HeavyAnalyticsFeed'; // Slow 2-second query
import CardSkeleton from '@/components/skeletons/CardSkeleton';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Fast component renders immediately */}
      <UserProfileCard />

      {/* Slow component streams in progressively without blocking the rest of the UI! */}
      <Suspense fallback={<CardSkeleton title="Loading Analytics..." />}>
        <HeavyAnalyticsFeed />
      </Suspense>
    </div>
  );
}
```

---

# Multiple Choice Questions

### 1. What problem does Streaming SSR solve compared to traditional monolithic Server-Side Rendering?
A. It compiles TypeScript into Java.
B. It eliminates the "all-or-nothing" bottleneck where slow backend data queries block the entire HTML response, streaming ready components to the browser immediately.
C. It allows users to run servers without internet.
D. It forces all components to render on the client.
**Answer:** B
**Explanation:** Streaming SSR delivers initial page shells and skeletons immediately, streaming slow data chunks progressively as they resolve.
---

### 2. Under the hood, what React primitive is automatically wrapped around `page.tsx` when a `loading.tsx` file is present in the same folder?
A. `React.memo()`
B. `<React.Suspense fallback={<Loading />}>`
C. `<React.StrictMode>`
D. `React.useContext()`
**Answer:** B
**Explanation:** Next.js automatically creates a `<React.Suspense>` boundary around `page.tsx` and passes the component in `loading.tsx` as the fallback prop.
---

### 3. What happens to the skeleton fallback UI when the streaming asynchronous component finishes data fetching?
A. The browser refreshes the page.
B. React automatically swaps out the fallback skeleton and seamlessly paints the rendered component in its place.
C. The skeleton is displayed at the bottom of the footer.
D. It throws a state mismatch warning.
**Answer:** B
**Explanation:** Once the asynchronous chunk arrives from the server, React replaces the fallback skeleton with the rendered component without a full page reload.
---

### 4. Why is streaming beneficial for First Contentful Paint (FCP) and Time to First Byte (TTFB)?
A. Because TTFB is measured as soon as the server streams the initial HTML shell, which occurs within milliseconds.
B. Streaming compresses fonts into WebP.
C. Streaming deletes unused CSS classes.
D. Streaming disables SSL encryption.
**Answer:** A
**Explanation:** The server responds immediately with the layout and skeleton headers, driving TTFB and FCP down to fractions of a second.
---

### 5. Can multiple independent `<Suspense>` boundaries be used within a single page?
A. No, React only supports 1 Suspense boundary per domain.
B. Yes, components can be wrapped in independent Suspense boundaries to load concurrently at their own speed.
C. Only if written in JavaScript.
D. Only on desktop browsers.
**Answer:** B
**Explanation:** Multiple `<Suspense>` boundaries allow granular concurrency, so quick sections render immediately while slow sections display skeletons until ready.
---
