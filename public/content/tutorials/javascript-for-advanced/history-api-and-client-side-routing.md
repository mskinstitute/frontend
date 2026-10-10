# History API & Client-Side Routing in Modern JavaScript

Single Page Applications (SPAs) like React, Vue, and Next.js do not reload the entire HTML page when navigating between views. Instead, they intercept navigation and manipulate the browser's session history using the **HTML5 History API** (`pushState`, `replaceState`, and `popstate`), creating seamless transitions while preserving bookmarkable URLs.

---

## 1. The History API Methods

The `window.history` object exposes three primary routing primitives:

1. **`history.pushState(state, title, url)`:** Pushes a new entry onto the browser's history stack and updates the URL bar **without triggering a page reload**.
2. **`history.replaceState(state, title, url)`:** Overwrites the *current* history entry (ideal for query parameter updates or redirects).
3. **`window.onpopstate`:** Fires when the user clicks the browser's **Back** or **Forward** navigation buttons.

```
  User clicks navigation link
               │
      e.preventDefault()
               │
      history.pushState({ view: 'settings' }, '', '/settings')
               │
      URL bar updates to /settings (Zero page reload!)
               │
      Render Settings View Component into DOM
```

---

## 2. Building a Lightweight Client-Side Router

```javascript
class ClientRouter {
  constructor(routes, outletSelector = '#app-root') {
    this.routes = routes;
    this.outlet = document.querySelector(outletSelector);

    this.init();
  }

  init() {
    // 1. Intercept internal anchor clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault(); // Stop default browser page refresh!
        this.navigate(link.getAttribute('href'));
      }
    });

    // 2. Handle browser Back/Forward navigation
    window.addEventListener('popstate', (e) => {
      this.resolveRoute(window.location.pathname, e.state);
    });

    // 3. Resolve initial page load
    this.resolveRoute(window.location.pathname);
  }

  navigate(url, state = {}) {
    // Push state and update browser URL bar
    history.pushState(state, '', url);
    this.resolveRoute(url, state);
  }

  resolveRoute(path, state = {}) {
    const routeHandler = this.routes[path] || this.routes['/404'];
    this.outlet.innerHTML = routeHandler(state);
  }
}
```

### Route Table & Usage:
```javascript
const routes = {
  '/': () => '<h1>Home Page</h1><p>Welcome to our SPA!</p>',
  '/products': () => '<h1>Product Catalog</h1><p>Browse our collection.</p>',
  '/settings': () => '<h1>User Settings</h1><p>Configure preferences.</p>',
  '/404': () => '<h1>404 Not Found</h1><p>Page does not exist.</p>'
};

// Mount router
const router = new ClientRouter(routes);
```

---

## 3. Server Configuration: The "SPA Fallback" Rewrite

A critical production gotcha: If a user refreshes the page while at `https://mysite.com/settings`, the browser sends an HTTP GET request to the web server for `/settings`.

If the server is not configured to rewrite all routes to `index.html`, it will return a **404 Not Found**!

### Production Server Rule (Nginx / Cloudflare / Netlify):
All non-file requests must rewrite to `index.html`:
```nginx
# Nginx SPA Configuration
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Practice Quiz

### Q1: What does history.pushState(state, title, url) do?
- A) Reloads the browser from the server
- B) Adds an entry to the browser's session history and updates the address bar URL without triggering a page reload
- C) Clears the cache
- D) Submits an HTTP POST request
**Answer:** B
**Explanation:** `history.pushState()` updates the browser's URL and history stack client-side without performing an HTTP round-trip or reloading the page.

### Q2: When does the window popstate event fire?
- A) Every time history.pushState() is called
- B) When the user navigates the session history using the browser's Back or Forward buttons
- C) Whenever a form is submitted
- D) When the window is resized
**Answer:** B
**Explanation:** `popstate` is dispatched when the active history entry changes due to user action (clicking Back/Forward or calling `history.back()`/`history.forward()`).

### Q3: Why does history.pushState() NOT fire the popstate event?
- A) It is a bug in JavaScript
- B) By specification, popstate only fires on user-initiated history navigation (like clicking Back/Forward), not programmatic additions
- C) pushState runs in a Web Worker
- D) It only fires in Safari
**Answer:** B
**Explanation:** The W3C specification reserves `popstate` for history traversal; calls to `pushState()` or `replaceState()` do not dispatch `popstate`.

### Q4: What server-side configuration is mandatory for client-side SPA routing to work on page refresh?
- A) Disable HTTPS
- B) Configure an SPA fallback rule (e.g. try_files $uri /index.html) so all deep route URLs return the main index.html file
- C) Block all GET requests
- D) Clear cookies on every visit
**Answer:** B
**Explanation:** Without an SPA fallback rule, requesting `/products` directly returns a server 404 because no physical `products.html` file exists on the server.

### Q5: How does history.replaceState() differ from history.pushState()?
- A) replaceState reloads the page
- B) replaceState modifies the current history entry in place instead of creating a new entry on the history stack
- C) replaceState deletes cookies
- D) replaceState is asynchronous
**Answer:** B
**Explanation:** `replaceState()` overwrites the current session history record, preventing the user from navigating back to the replaced state.
