# Reporting Client Errors to Monitoring Services

## 1. Why Client-Side Telemetry Is Essential
In production environments, web applications run on thousands of unpredictable user machines with varying browser versions, ad blockers, unstable networks, and unique operating systems.

If a bug causes a component to crash for a user in production:
- You cannot inspect their browser console.
- Users rarely report bugs; they simply leave the website.
- Backend server logs show nothing because the failure occurred on the client.

Professional software engineering requires **Client-Side Telemetry and Application Performance Monitoring (APM)** using platforms like **Sentry**, **Datadog**, or **LogRocket**.

```
User Encounters Crash
         │
         ▼
[ErrorBoundary catches error]
         │
         ▼
[Telemetry Agent (e.g. Sentry)]
 ├─ Captures error stack trace & component stack
 ├─ Attaches user metadata (browser, OS, screen size, user ID)
 ├─ Records recent "breadcrumbs" (clicks, route changes, network calls)
 └─ Sends payload asynchronously to APM ingest servers
```

## 2. Sentry Integration Architecture
Sentry is the most widely adopted error tracking solution in the React ecosystem.

### Installation
```bash
npm install @sentry/react
```

### Initializing Sentry in `src/main.jsx`:
```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.jsx';

Sentry.init({
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0', // Data Source Name from Sentry dashboard
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
  replaysOnErrorSampleRate: 1.0 // Record video replay of session whenever an error occurs!
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 3. Capturing Errors with Sentry's Error Boundary
Sentry provides a drop-in Error Boundary that automatically transmits stack traces, component stacks, and environmental context directly to your cloud dashboard:

```jsx
import React from 'react';
import * as Sentry from '@sentry/react';

function ErrorFallback({ error, resetError }) {
  return (
    <div className="error-card">
      <h2>Oops! An error occurred.</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  );
}

export default function SafeApplication() {
  return (
    <Sentry.ErrorBoundary
      fallback={ErrorFallback}
      showDialog // Optional: Shows a modal prompting user to submit feedback!
    >
      <MainApplicationContent />
    </Sentry.ErrorBoundary>
  );
}
```

## 4. Enriching Errors with User Context and Breadcrumbs
To make debugging actionable, attach contextual information:

```javascript
// When a user signs in:
Sentry.setUser({
  id: 'usr-401',
  email: 'student@mskinstitute.com',
  role: 'enterprise_learner'
});

// Manual breadcrumbs for critical business actions:
Sentry.addBreadcrumb({
  category: 'checkout',
  message: 'User initiated payment for Full-Stack Track',
  level: 'info'
});

// Manual exception capture in try...catch:
try {
  processPayment();
} catch (err) {
  Sentry.captureException(err, {
    tags: { section: 'payment-modal' },
    extra: { orderId: 'ord-883' }
  });
}
```

---

## Practice Quiz

### Q1: Why are client-side error monitoring services (like Sentry or Datadog) necessary in production web applications?
- A) To turn off the user's internet connection
- B) Because client-side JavaScript crashes occur on user machines and are completely invisible in backend server logs unless captured and reported by telemetry
- C) To make CSS animations smoother
- D) To bypass browser firewalls
**Answer:** B
**Explanation:** Unhandled client exceptions run in the user's local browser sandbox; without client telemetry, developers have zero visibility into production frontend crashes.

### Q2: What is a "Breadcrumb" in telemetry services like Sentry?
- A) A cookie stored on the computer
- B) A chronological log of user interactions, route navigations, and network requests leading up to a crash
- C) A CSS border property
- D) An invalid JavaScript variable
**Answer:** B
**Explanation:** Breadcrumbs record the trail of events (clicks, route transitions, console logs) preceding an error, helping engineers recreate the exact steps that caused the bug.

### Q3: What is a "DSN" (Data Source Name) in Sentry configuration?
- A) The user's credit card number
- B) The unique endpoint URL that directs error telemetry from your React app to your specific Sentry project dashboard
- C) A domain name registrar
- D) An SQL password
**Answer:** B
**Explanation:** The DSN (Data Source Name) configures the Sentry client with the exact public API endpoint and authentication keys for your tracking project.

### Q4: How can you capture a caught exception manually in Sentry?
- A) `Sentry.sendAlert()`
- B) `Sentry.captureException(error)`
- C) `console.log(error)`
- D) `window.report(error)`
**Answer:** B
**Explanation:** `Sentry.captureException(err)` manually packages and transmits an error object, stack trace, and context to Sentry servers.

### Q5: What is "Session Replay" in modern frontend monitoring?
- A) Playing music during form submissions
- B) A video-like reconstruction of the user's screen and interactions preceding a crash to observe exactly what they experienced
- C) Refreshing the page automatically
- D) Replaying audio recordings
**Answer:** B
**Explanation:** Session Replay provides a privacy-sanitized visual reproduction of the user's DOM interactions and clicks leading directly to the error.
