# Core File Conventions: page.tsx, layout.tsx, template.tsx & not-found.tsx

Next.js uses a **special file system convention** inside the `app` directory. Naming files with reserved conventions (`page`, `layout`, `template`, `loading`, `error`, `not-found`) automatically wires up routing, nested layouts, state persistence, and error boundaries.

---

## 1. The Core File Hierarchy

```text
app/
 ├── layout.tsx         # Root Layout (wraps entire application: <html> & <body>)
 ├── page.tsx           # Homepage (/)
 ├── not-found.tsx      # Global 404 handler
 ├── courses/
 │    ├── layout.tsx    # Nested Layout for /courses/*
 │    ├── loading.tsx   # Loading skeleton for /courses/*
 │    ├── page.tsx      # Courses Catalog (/courses)
 │    └── [slug]/
 │         ├── page.tsx # Course Detail (/courses/:slug)
 │         └── error.tsx# Local Error Boundary
```

---

## 2. `layout.tsx`: Nested & Persistent Layouts

A layout is UI that is shared between multiple routes. Layouts **preserve state**, **remain interactive**, and **do not re-render** when navigating between sibling routes!

```tsx
// app/layout.tsx (Root Layout - Required)
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'MSK Institute | Premier Tech Education',
  description: 'Learn full-stack web development and data analytics.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## 3. `template.tsx` vs `layout.tsx`

While `layout.tsx` preserves state across navigation, **`template.tsx`** creates a brand-new instance for each child route on navigation:
- DOM elements are recreated.
- State is not preserved.
- Effects (like `useEffect`) re-sync.
- Ideal for: Page entrance/exit animations (Framer Motion) or logging per-page views.

---

## 4. `not-found.tsx`: Custom 404 Pages

Next.js renders `not-found.tsx` when an invalid URL is visited, or when the `notFound()` function is programmatically triggered:

```tsx
// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getCourseBySlug } from '@/lib/db';

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound(); // Programmatically invokes closest not-found.tsx!
  }

  return <div><h1>{course.title}</h1></div>;
}
```

---

# Multiple Choice Questions

### 1. Which file is strictly required in the root of the `app/` directory and must contain the `<html>` and `<body>` tags?
A. `app/index.tsx`
B. `app/layout.tsx` (Root Layout)
C. `app/template.tsx`
D. `app/root.tsx`
**Answer:** B
**Explanation:** The Root Layout (`app/layout.tsx`) is mandatory for all Next.js App Router applications and must define the top-level `<html>` and `<body>` tags.
---

### 2. What is the fundamental behavioral difference between `layout.tsx` and `template.tsx` during client-side navigation?
A. Layouts are only used on mobile devices.
B. Layouts preserve component state and avoid re-rendering across page transitions, whereas templates remount and re-instantiate state on every navigation.
C. Templates do not support CSS.
D. Layouts can only be written in JavaScript.
**Answer:** B
**Explanation:** Layouts persist across page transitions without losing state; templates re-render and mount fresh instances on each route change.
---

### 3. How do you programmatically trigger the `not-found.tsx` component when an entity does not exist in the database?
A. `throw new Error('404')`
B. `import { notFound } from 'next/navigation'; notFound();`
C. `res.status(404).send()`
D. `window.location.href = '/404'`
**Answer:** B
**Explanation:** Calling `notFound()` from `next/navigation` halts rendering and displays the closest matching `not-found.tsx` file.
---

### 4. What prop must every `layout.tsx` component accept and render?
A. `params`
B. `children: React.ReactNode`
C. `query: Record<string, string>`
D. `state: object`
**Answer:** B
**Explanation:** A layout wraps child segments and pages, requiring the `{ children }` prop to position the nested content.
---

### 5. Can a sub-folder (e.g. `app/dashboard/settings/`) have its own nested `layout.tsx`?
A. No, only one layout is permitted per project.
B. Yes, layouts nest hierarchically; the child layout is wrapped inside the parent layouts.
C. Only if configured in `next.config.js`.
D. Only when using Docker.
**Answer:** B
**Explanation:** App Router layouts nest hierarchically, with child layouts rendering inside their respective parent layouts.
---
