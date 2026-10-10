# Middleware.ts: Route Protection, Redirects, Cookies & Geolocation

Next.js **Middleware** enables running code on the edge before a request is completed. Located at the root of the project as `middleware.ts`, it allows intercepting incoming HTTP traffic to perform **route authentication protection**, **URL redirects/rewrites**, **header manipulation**, and **geolocation routing**.

---

## 1. Middleware Execution Model

Middleware runs on the lightweight Vercel Edge Runtime before cached content or route handlers execute:
```text
Client Request ---> [ Middleware.ts ] ---> (Redirect? Rewrite? Set Cookie?) ---> Target Page / Route
```

---

## 2. Basic Middleware and Route Matching

Create `middleware.ts` in your project root (or inside `src/`):

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect unauthenticated user to login page with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Add custom response header for tracking
  const response = NextResponse.next();
  response.headers.set('x-msk-trace-id', crypto.randomUUID());

  return response;
}

// MATCHING CONFIGURATION: Specify exactly which paths trigger middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|images|robots.txt).*)',
  ],
};
```

---

## 3. URL Rewrites vs Redirects

- **Redirect (`NextResponse.redirect(url)`):** Returns an HTTP 307/308 status code, updating the user's browser address bar to the new URL.
- **Rewrite (`NextResponse.rewrite(url)`):** Serves content from a different destination URL while **preserving the original URL** in the user's browser address bar (useful for multi-tenant subdomains or A/B testing).

---

# Multiple Choice Questions

### 1. Where must the `middleware.ts` file be located in a Next.js application?
A. Inside `public/`
B. At the root of the project (or inside the `src/` directory if using `src`)
C. Inside `app/api/middleware/`
D. Inside `.next/`
**Answer:** B
**Explanation:** Next.js expects `middleware.ts` to be placed at the root level of your project or directly under the `src` folder.
---

### 2. What is the fundamental difference between `NextResponse.redirect()` and `NextResponse.rewrite()`?
A. Redirect only works on desktop browsers.
B. Redirect sends an HTTP redirect that changes the URL in the browser address bar, whereas Rewrite proxies content from another URL while keeping the browser address bar unchanged.
C. Rewrite is deprecated in Next.js 15.
D. There is no difference.
**Answer:** B
**Explanation:** A redirect changes the browser's URL, while a rewrite serves internal content from a different destination behind the scenes without changing the visible URL.
---

### 3. Why is defining a `matcher` array in `export const config` recommended for Middleware?
A. To prevent TypeScript compilation errors.
B. To restrict middleware execution strictly to relevant application paths and avoid running on static assets, images, and favicons on every single request.
C. Matchers encrypt the database connection.
D. Next.js will not start without a matcher.
**Answer:** B
**Explanation:** Specifying a matcher avoids unnecessary middleware overhead for static files (`_next/static`, images, icons), improving application performance.
---

### 4. How can you inspect cookies sent by the client inside `middleware.ts`?
A. `request.cookies.get('cookieName')`
B. `document.cookie`
C. `window.getCookies()`
D. `request.body.cookie`
**Answer:** A
**Explanation:** The `NextRequest` object provides a `cookies` helper with methods like `.get()`, `.getAll()`, and `.has()`.
---

### 5. On which runtime environment does Next.js Middleware execute by default?
A. Node.js Full Server with C++ Addons
B. The lightweight Vercel Edge Runtime (a strict subset of Web APIs designed for instant global execution)
C. Client Browser JavaScript
D. Python Virtual Environment
**Answer:** B
**Explanation:** Middleware executes on the Edge Runtime, an optimized Web-standard runtime providing sub-millisecond cold starts across global CDN edges.
---
