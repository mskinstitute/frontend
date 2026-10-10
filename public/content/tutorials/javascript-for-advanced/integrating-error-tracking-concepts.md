# Integrating Error Tracking Concepts in Modern JavaScript

In production applications, users rarely report bugs—they simply abandon the site when something breaks. **Application Error Tracking & Performance Monitoring (APM)** systems (such as Sentry, Datadog, Bugsnag, and Rollbar) automatically capture, group, and alert on runtime crashes in real-time, complete with stack traces, breadcrumbs, and environment metadata.

---

## 1. How Modern Error Trackers Work

```
  Runtime Crash Occurs in Browser
                 │
  Global Handlers Catch Error (window.onerror / unhandledrejection)
                 │
  Enrich with Metadata:
  ├── 1. Stack Trace (Mapped via uploaded Source Maps)
  ├── 2. Breadcrumbs (Last 20 clicks, console logs, and API calls)
  ├── 3. User Identity (UID, email, tenant)
  └── 4. Environment (Browser version, OS, git commit release)
                 │
  Compressed HTTP POST Dispatch (Non-blocking via sendBeacon / fetch)
                 │
                 ▼
  Sentry / Monitoring Platform (Alerts Slack & PagerDuty!)
```

---

## 2. What are Breadcrumbs?

**Breadcrumbs** are a trail of user actions and telemetry events recorded before a crash occurs. When an exception is thrown, the breadcrumb trail explains *how the user got there*:

```json
[
  { "category": "ui.click", "message": "button#checkout clicked", "timestamp": 171000 },
  { "category": "navigation", "from": "/cart", "to": "/payment", "timestamp": 171005 },
  { "category": "fetch", "url": "/api/v1/charge", "status": 500, "timestamp": 171008 },
  { "level": "error", "message": "TypeError: Cannot read property 'receipt' of undefined" }
]
```

---

## 3. Building an In-House Mini-Sentry SDK

Understanding how monitoring SDKs operate under the hood:

```javascript
class MiniErrorTracker {
  constructor(config) {
    this.endpoint = config.endpoint;
    this.release = config.release || '1.0.0';
    this.user = null;
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 20;

    this.init();
  }

  init() {
    // 1. Intercept UI clicks for breadcrumbs
    document.addEventListener('click', (e) => {
      const tag = e.target.tagName.toLowerCase();
      const id = e.target.id ? `#${e.target.id}` : '';
      this.addBreadcrumb('ui.click', `Clicked ${tag}${id}`);
    });

    // 2. Global error catching
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message));
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason);
    });
  }

  setUser(user) {
    this.user = user;
  }

  addBreadcrumb(category, message) {
    if (this.breadcrumbs.length >= this.maxBreadcrumbs) {
      this.breadcrumbs.shift(); // Evict oldest
    }
    this.breadcrumbs.push({
      category,
      message,
      timestamp: Date.now()
    });
  }

  captureException(error) {
    const payload = {
      name: error?.name || 'Error',
      message: error?.message || String(error),
      stack: error?.stack,
      release: this.release,
      user: this.user,
      url: window.location.href,
      userAgent: navigator.userAgent,
      breadcrumbs: [...this.breadcrumbs]
    };

    // Send asynchronously without blocking main thread
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(this.endpoint, blob);
  }
}
```

---

## 4. Linking Source Maps with Release Tags

For monitoring services to de-obfuscate minified stack traces back to original TypeScript/ES6 lines:
1. Every application build is tagged with a unique **Release Hash** (e.g. Git commit SHA: `release: "git_a98f12"`).
2. The CI/CD pipeline uploads `.map` files directly to Sentry tagged with that exact release hash.
3. When a client crashes, Sentry matches the crash release hash to the uploaded source map and displays the exact TypeScript line number!

---

## Practice Quiz

### Q1: What are "Breadcrumbs" in error tracking systems like Sentry?
- A) Cookies stored on the client
- B) A chronological trail of recent user actions, console logs, and network requests leading up to a crash
- C) CSS layout markers
- D) Deleted database records
**Answer:** B
**Explanation:** Breadcrumbs record recent interactions (clicks, route changes, API requests) prior to a crash, providing the context required to reproduce bugs.

### Q2: Why is tagging each production build with a unique Release identifier (e.g. Git commit hash) critical for error monitoring?
- A) To compress HTML files
- B) To allow the monitoring platform to match minified production stack traces with the exact source map files uploaded for that specific release
- C) It is required by SSL certificates
- D) To restart the server
**Answer:** B
**Explanation:** Release identifiers correlate client crash reports with the corresponding source maps and git commits, enabling automated source reconstruction.

### Q3: What browser API is ideal for transmitting crash reports when an error occurs immediately before page unload?
- A) navigator.sendBeacon()
- B) XMLHttpRequest synchronous
- C) window.postMessage()
- D) WebSockets
**Answer:** A
**Explanation:** `navigator.sendBeacon()` queues data to be transmitted asynchronously by the browser even if the page is currently unmounting or closing.

### Q4: Why should personally identifiable information (PII) like passwords and credit card numbers be sanitized before sending to error trackers?
- A) To prevent crashes
- B) To comply with data privacy regulations (GDPR, HIPAA, PCI-DSS) and prevent leaking sensitive user data into third-party monitoring servers
- C) To make logs shorter
- D) Trackers do not accept numbers
**Answer:** B
**Explanation:** Compliance laws require scrubbing sensitive personal data (passwords, tokens, health info) from telemetry payloads before transmission.

### Q5: In an error monitoring platform, what is "Error Grouping" (Fingerprinting)?
- A) Merging identical CSS files
- B) Consolidating thousands of identical crash reports caused by the same root stack trace into a single actionable incident ticket
- C) Grouping users by geographical region
- D) Encrypting errors
**Answer:** B
**Explanation:** Grouping (fingerprinting) analyzes stack traces and error types to roll up thousands of identical individual crash events into a single incident dashboard item.
