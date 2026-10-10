# Edge CDN Deployment with Cloudflare, Vercel, and Netlify

Deploying frontend applications to traditional origin servers in a single geographic region introduces latency for global users. Modern deployment architectures deploy static React assets to **Global Edge Content Delivery Networks (CDNs)** with Points of Presence (PoPs) distributed across hundreds of global cities. Platforms like **Cloudflare Pages**, **Vercel**, and **Netlify** combine global asset delivery with **Edge Middleware** for ultra-low latency routing and authentication.

---

## 1. Global Edge Architecture

```
Traditional Single-Region Origin (US-East):
User in Tokyo ────────────────────────(250ms roundtrip)────────────────────────► US-East Server

Modern Edge CDN (300+ Edge Nodes):
User in Tokyo ──(5ms)──► Tokyo Edge Node (Cloudflare/Vercel)
User in London ──(8ms)──► London Edge Node
User in Sydney ──(6ms)──► Sydney Edge Node
```

Every user downloads assets and receives responses from an edge server physically adjacent to their location.

---

## 2. Comparing Modern Edge Platforms

| Feature | Cloudflare Pages | Vercel | Netlify |
| :--- | :--- | :--- | :--- |
| **Edge Network** | 310+ global data centers | AWS global infrastructure + Cloudflare | Multi-cloud edge network |
| **Pricing Model** | Unlimited bandwidth on free tier | Generous, then tiered bandwidth | Metered build minutes & bandwidth |
| **Edge Compute** | Cloudflare Workers (V8 isolates) | Edge Middleware (V8 isolates) | Netlify Edge Functions (Deno) |
| **Ecosystem Sweet Spot** | High-traffic SPAs & static sites | Next.js & React Server Components | Jamstack, form processing |

---

## 3. Edge Middleware for Geolocation Routing & Security

Edge middleware runs lightweight JavaScript at the edge node **before** the request reaches the asset or origin. This allows instant geo-redirects, A/B tests, and header injections in <5ms:

```ts
// middleware.ts (Vercel Edge Middleware)
import { next } from "@vercel/edge";

export const config = {
  matcher: "/",
};

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Read geographic headers injected automatically by the Edge CDN
  const country = request.headers.get("x-vercel-ip-country") || "US";

  // Instant geo-redirection performed at the edge without touching origin
  if (country === "DE" && !url.pathname.startsWith("/de")) {
    return Response.redirect(new URL("/de", request.url));
  }

  const response = next();

  // Inject Enterprise Security Headers at the Edge
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}
```

---

## 4. Configuring SPA Routing on Cloudflare Pages (`_redirects`)

Static sites deployed to Cloudflare Pages require a `_redirects` file in the build output to handle client-side SPA routing:

```
# public/_redirects
/*    /index.html   200
```
This instructs Cloudflare's edge network to rewrite any unknown URL path to `/index.html` with an HTTP 200 status, allowing React Router to render the appropriate view client-side.

---

## 5. Preview Deployments & Instant Rollbacks

A major architectural advantage of modern platforms is **Atomic Preview Deployments**:
- Every Pull Request automatically builds into an isolated staging URL (e.g. `https://pr-142.enterprise-app.pages.dev`).
- QA engineers and stakeholders can test changes in production-identical environments before merging.
- If a production bug occurs, rollback is instantaneous: switching the production pointer takes 0 seconds with zero downtime.

---

## Practice Quiz

### Q1: How do Edge CDNs deliver sub-50ms Time to First Byte (TTFB) to users worldwide?
- A) By speeding up the user's home internet connection
- B) By caching and serving static assets from hundreds of geographically distributed Points of Presence (PoPs) located physically close to end users
- C) By compressing all files into ZIP archives
- D) By disabling HTTPS
**Answer:** B
**Explanation:** Edge CDNs replicate assets across hundreds of global data centers, allowing users to connect to a nearby edge server and minimizing latency.

### Q2: What is Edge Middleware?
- A) Desktop software installed on developer laptops
- B) Lightweight serverless code executed at CDN edge nodes in V8 isolates before requests reach assets, enabling sub-millisecond redirects, auth checks, and headers
- C) Database indexing software
- D) A CSS framework
**Answer:** B
**Explanation:** Edge middleware executes minimal serverless code at the CDN edge before requests resolve, allowing routing, A/B testing, and security headers to execute with zero origin latency.

### Q3: What does the rule /* /index.html 200 in a Cloudflare Pages _redirects file do?
- A) It redirects all traffic to Google
- B) It rewrites all URL paths to serve index.html with a 200 OK status, enabling React Router client-side routing to work on page refresh
- C) It blocks all incoming traffic with a 200 error
- D) It deletes index.html
**Answer:** B
**Explanation:** Cloudflare's 200 rewrite rule serves index.html for all subpaths without a 301/302 redirect, allowing the client-side SPA router to initialize smoothly.

### Q4: Why are V8 isolates faster than traditional Docker containers or Node.js serverless functions for Edge Compute?
- A) Isolates start in milliseconds (<5ms) with virtually zero cold-start latency and negligible memory overhead compared to booting container runtimes
- B) Isolates run on quantum computers
- C) Isolates do not use JavaScript
- D) Isolates are built in assembly
**Answer:** A
**Explanation:** V8 isolates execute JavaScript contexts inside existing running processes without booting operating systems or Node runtimes, eliminating cold-start latency.

### Q5: What is the primary benefit of pull-request Preview Deployments provided by platforms like Vercel and Cloudflare Pages?
- A) They make tests run slower
- B) Every branch generates a unique live URL reflecting production builds, allowing stakeholders to test changes before merging to main
- C) They automatically charge the customer's credit card
- D) They bypass code review
**Answer:** B
**Explanation:** Preview deployments automatically publish isolated live staging URLs for every pull request, allowing visual QA, cross-browser testing, and stakeholder validation before release.
