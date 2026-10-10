# Next.js App Router and Server-First Paradigms

## 1. The Evolution of Next.js: Pages vs App Router
Next.js (created by Vercel) is the most popular meta-framework for React. 

In Next.js 13+, the architecture transitioned from the legacy **Pages Router** (`/pages`) to the modern **App Router** (`/app`), built from the ground up around **React Server Components (RSC)**.

```
Legacy Pages Router (/pages):
- Component-level SSR via getServerSideProps
- Entire page bundled for client
- Rigid layout nesting

Modern App Router (/app):
- React Server Components by default (0 KB JS)
- File-system conventions (layout.jsx, page.jsx, loading.jsx, error.jsx)
- Native streaming, nested layouts, and Server Actions
```

## 2. File-System Routing Conventions in App Router
In the App Router, routes are defined by folder structures containing standardized file names:

```
app/
├── layout.jsx      # Root layout (wraps all pages with <html> and <body>)
├── page.jsx        # Home page route ("/")
├── loading.jsx     # Instant loading skeleton (wrapped in <Suspense>)
├── error.jsx       # Client-side Error Boundary (must be 'use client')
├── not-found.jsx   # Custom 404 page
└── courses/
    ├── page.jsx    # Courses catalog route ("/courses")
    └── [slug]/
        └── page.jsx # Dynamic route ("/courses/:slug")
```

## 3. Server Actions: Zero-API Mutations
One of the most revolutionary features of the modern server-first paradigm is **Server Actions**. 

Instead of creating an API route (`/api/submit`), writing a controller, validating JSON, and sending a client `fetch()`, you define an **asynchronous server function** called directly by a form:

```jsx
// app/courses/create/page.jsx (Server Component)
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default function CreateCoursePage() {
  // Server Action function running STRICTLY on server!
  async function createCourseAction(formData) {
    'use server'; // Marks this function as an RPC Server Action!

    const title = formData.get('title');
    const price = Number(formData.get('price'));

    // 1. Direct database insert
    await db.course.create({ data: { title, price } });

    // 2. Revalidate server cache for the catalog
    revalidatePath('/courses');

    // 3. Redirect user
    redirect('/courses');
  }

  return (
    <form action={createCourseAction} className="admin-form">
      <h2>Add New Course</h2>
      <input type="text" name="title" placeholder="Title" required />
      <input type="number" name="price" placeholder="Price" required />
      <button type="submit">Publish Track</button>
    </form>
  );
}
```
When submitted, Next.js executes an automated Remote Procedure Call (RPC) to the server action, validates data, mutates the database, purges server cache, and redirects—**even if JavaScript is disabled in the user's browser!**

## 4. Automatic Static Optimization & Caching
Next.js App Router includes a multi-tiered caching architecture:
- **Request Memoization:** Multiple identical `fetch()` calls in different server components are automatically deduplicated.
- **Data Cache:** `fetch('/api/data', { next: { revalidate: 3600 } })` caches responses on disk for 1 hour across all users.
- **Full Route Cache:** Static pages are pre-rendered into HTML at build time and cached globally on edge CDNs.

---

## Practice Quiz

### Q1: What is the default component type for files created in the Next.js App Router (`/app`)?
- A) Client Components
- B) React Server Components (RSC)
- C) Web Workers
- D) Redux Slices
**Answer:** B
**Explanation:** In the Next.js App Router, all components inside the `/app` directory are React Server Components by default unless marked with `'use client'`.

### Q2: What standardized file name defines the visible route content for a folder in the App Router?
- A) `index.jsx`
- B) `page.jsx`
- C) `route.jsx`
- D) `view.jsx`
**Answer:** B
**Explanation:** In the App Router, `page.jsx` defines the unique UI route corresponding to that folder segment.

### Q3: What is a "Server Action" in Next.js?
- A) A shell command run in the terminal
- B) An asynchronous function marked with `'use server'` that runs on the server and can be invoked directly from client forms or event handlers without manual API endpoints
- C) A CSS animation trigger
- D) A database backup schedule
**Answer:** B
**Explanation:** Server Actions provide server-side Remote Procedure Calls (RPC) invoked directly from forms or buttons, eliminating the need for manual API route creation.

### Q4: What file in the App Router provides an automatic Suspense fallback while a page's server components are fetching data?
- A) `fallback.jsx`
- B) `loading.jsx`
- C) `spinner.jsx`
- D) `skeleton.jsx`
**Answer:** B
**Explanation:** `loading.jsx` is automatically wrapped around `page.jsx` inside a React `<Suspense>` boundary to display instant loading skeletons during navigation.

### Q5: What function is used to invalidate the server-side cache for a path after executing a mutation?
- A) `revalidatePath('/courses')`
- B) `clearCache()`
- C) `cache.delete()`
- D) `router.reload()`
**Answer:** A
**Explanation:** `revalidatePath('/path')` instructs Next.js to purge the cached server render for that route and re-generate it with fresh data.
