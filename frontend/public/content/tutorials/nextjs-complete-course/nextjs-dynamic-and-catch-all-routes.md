# Dynamic Routes ([id]), Catch-All Routes ([...slug]) & Route Groups ((group))

In the Next.js App Router, advanced routing patterns are defined using folder naming syntax: **Square Brackets `[param]`** for dynamic segments, **Ellipses `[...slug]`** for catch-all routes, and **Parentheses `(group)`** for organizing code without affecting the URL path.

---

## 1. Dynamic Route Segments: `[param]`

When a URL segment is dynamic (such as a blog post slug or user ID):
- Folder: `app/blog/[slug]/page.tsx`
- URL: `/blog/learn-nextjs` -> `{ slug: 'learn-nextjs' }`

```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  // In Next.js 15, params is an asynchronous Promise!
  const { slug } = await params;

  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold">Article: {slug}</h1>
    </article>
  );
}
```

---

## 2. Catch-All & Optional Catch-All Routes

### 1. Catch-All: `[...slug]`
Matches any number of subsequent path segments and returns them as a string array:
- Folder: `app/docs/[...slug]/page.tsx`
- Matches: `/docs/getting-started` -> `{ slug: ['getting-started'] }`
- Matches: `/docs/api/v2/authentication` -> `{ slug: ['api', 'v2', 'authentication'] }`
- *Does NOT match `/docs` itself.*

### 2. Optional Catch-All: `[[...slug]]` (Double Brackets)
Matches all sub-segments **AND** matches the parent route itself:
- Matches: `/docs` -> `{ slug: undefined }`
- Matches: `/docs/components/button` -> `{ slug: ['components', 'button'] }`

---

## 3. Route Groups: `(groupName)`

Route Groups allow organizing folders and sharing specific layouts **without affecting the URL path**:

```text
app/
 ├── (marketing)/
 │    ├── layout.tsx   # Marketing layout (Hero header, pricing navbar)
 │    ├── about/page.tsx   -> URL: /about
 │    └── pricing/page.tsx -> URL: /pricing
 └── (dashboard)/
      ├── layout.tsx   # Authenticated layout (Sidebar, profile dropdown)
      └── analytics/page.tsx -> URL: /analytics
```

Notice that neither `(marketing)` nor `(dashboard)` appears in the browser URL!

---

# Multiple Choice Questions

### 1. In Next.js 15, how should route `params` and search `searchParams` be consumed inside an async Server Component `page.tsx`?
A. Directly as synchronous objects `props.params.slug`.
B. As asynchronous Promises that must be unwrapped using `await params`.
C. By reading `window.location.search`.
D. Through the `useRouter` hook only.
**Answer:** B
**Explanation:** In Next.js 15, `params` and `searchParams` are delivered as Promises to support concurrent asynchronous streaming; they must be resolved with `await params`.
---

### 2. Which folder naming pattern matches both `/shop` AND any deeply nested path like `/shop/clothing/jackets/winter`?
A. `app/shop/[slug]/`
B. `app/shop/[...slug]/`
C. `app/shop/[[...slug]]/` (Optional Catch-All)
D. `app/shop/(slug)/`
**Answer:** C
**Explanation:** Double square brackets `[[...slug]]` denote an Optional Catch-All route that matches both the root path and all nested sub-segments.
---

### 3. What is the primary purpose of Route Groups named with parentheses, such as `app/(auth)/login/page.tsx`?
A. It forces the page to load over HTTPS.
B. It organizes routes and custom layouts without adding the folder name `(auth)` into the browser URL path.
C. It restricts the page to authenticated users only.
D. It disables server-side caching.
**Answer:** B
**Explanation:** Wrapping a folder name in parentheses creates a Route Group, which groups routes and layouts without introducing that folder name into the public URL.
---

### 4. Given the route `app/tutorials/[...slug]/page.tsx`, what will `(await params).slug` evaluate to when a user visits `/tutorials/web/react/hooks`?
A. `"web/react/hooks"` (as a single string)
B. `['web', 'react', 'hooks']` (as an array of strings)
C. `{ category: 'web', library: 'react' }`
D. `null`
**Answer:** B
**Explanation:** Catch-all routes `[...slug]` parse matching segments into an array of path strings.
---

### 5. What happens if two different Route Groups define the same URL path (e.g. `(marketing)/about/page.tsx` and `(admin)/about/page.tsx`)?
A. Next.js picks the first one alphabetically.
B. Next.js throws a build error indicating conflicting route definitions for the same URL path.
C. Both pages merge together into one HTML file.
D. The page redirects to Google.
**Answer:** B
**Explanation:** Because Route Groups do not affect the URL path, having duplicate paths across groups causes an unambiguous routing collision error during build.
---
