# Next.js 15 Overview & App Router vs Pages Router Architecture

**Next.js** is the leading React framework for the web, maintained by Vercel. With **Next.js 15**, the framework establishes the modern era of full-stack web engineering by building natively on **React Server Components (RSC)**, streaming HTML rendering, and the revolutionary **App Router** directory architecture.

---

## 1. What is Next.js?

While vanilla React is a client-side rendering (CSR) library that ships an empty HTML `div id="root"` and executes JavaScript in the user's browser, Next.js executes components on the server first. This delivers:
- **Instant First Contentful Paint (FCP):** Pre-rendered HTML is delivered immediately over the network.
- **Flawless SEO:** Search engine crawlers (Googlebot, Bing) index real HTML content rather than blank pages.
- **Zero-Bundle-Size Server Components:** Heavy npm libraries (date-fns, markdown parsers, syntax highlighters) stay on the server and are never downloaded by the client browser.

---

## 2. Visual Architecture

![Next.js App Router RSC Workflow](/images/tutorials/nextjs-complete-course/nextjs-app-router-rsc-workflow.svg)

---

## 3. App Router (`app/`) vs Legacy Pages Router (`pages/`)

| Feature | Legacy Pages Router (`pages/`) | Modern App Router (`app/`) |
| :--- | :--- | :--- |
| **Component Default** | Client Components (rendered on client after hydration) | **React Server Components (RSC)** by default |
| **Routing Model** | File-path based (`pages/about.js`) | Folder-hierarchy based (`app/about/page.tsx`) |
| **Layouts** | Cumbersome `getLayout` patterns | Native, nested, persistent `layout.tsx` hierarchy |
| **Data Fetching** | `getServerSideProps`, `getStaticProps` | Async Server Components with native `fetch()` & Server Actions |
| **Streaming UI** | Not supported out of the box | Built-in via React Suspense & `loading.tsx` |
| **Bundle Size** | Larger client bundles | Drastically smaller client bundles due to RSC |

---

## 4. Why App Router is the Future of React

The App Router aligns directly with React core team's vision:
1. **Colocation of Concerns:** Styles, tests, utility components, and data fetching live together inside the feature folder.
2. **Streaming and Concurrency:** Slow backend queries stream data chunks to the client progressively without holding up the entire page render.
3. **Seamless Full-Stack Workflows:** Server Actions allow mutating database records directly from form elements without creating manual REST endpoints.

---

# Multiple Choice Questions

### 1. What is the default component rendering model in the Next.js 15 App Router (`app/` directory)?
A. Client-Side Rendering only
B. React Server Components (RSC)
C. Static HTML generation with no JavaScript
D. WebAssembly execution
**Answer:** B
**Explanation:** All components inside the `app` directory are React Server Components by default, executing exclusively on the server unless opted-out with `'use client'`.
---

### 2. How did data fetching work in the legacy Next.js Pages Router compared to the App Router?
A. Pages router used `localStorage`; App router uses cookies.
B. Pages router used special page-level functions like `getServerSideProps` and `getStaticProps`, whereas the App router uses standard async React Server Components and `fetch()`.
C. Pages router required Python scripts.
D. There is no difference in data fetching.
**Answer:** B
**Explanation:** The App Router replaces legacy `getServerSideProps`/`getStaticProps` with standard `async/await` components and native `fetch` cache extensions.
---

### 3. What is a key performance benefit of React Server Components (RSC)?
A. They allow running React on smartwatches.
B. Their JavaScript dependencies and source code remain on the server and are never downloaded into the client's browser bundle.
C. They disable HTML tags.
D. They automatically compress JPEG images into PNG.
**Answer:** B
**Explanation:** RSC executes on the server and outputs pure HTML and virtual DOM wire format; the npm libraries imported exclusively in Server Components add 0 KB to the browser's JavaScript bundle.
---

### 4. In the App Router, what file must be present inside a directory (e.g. `app/courses/`) to make that route publicly accessible via URL?
A. `index.html`
B. `page.tsx` (or `page.js`)
C. `route.js`
D. `view.tsx`
**Answer:** B
**Explanation:** In Next.js App Router, a `page.tsx` file defines the unique public UI for a given folder route segment.
---

### 5. Why does Next.js pre-rendering provide superior SEO compared to vanilla Single-Page React Apps?
A. Next.js pays search engines for higher rankings.
B. Next.js delivers fully formed HTML containing all text and metadata in the initial HTTP response, which search engine bots can index immediately without running heavy client JS.
C. Next.js disables CSS styling.
D. Next.js forces users to open Google Chrome.
**Answer:** B
**Explanation:** Search engine web crawlers receive immediate, semantic HTML rather than an empty `<div id="root">`, ensuring complete indexing of page content.
---
