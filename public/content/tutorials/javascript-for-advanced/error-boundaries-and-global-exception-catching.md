# Error Boundaries & Global Exception Catching in Modern JavaScript

Even with disciplined `try...catch` handling, unanticipated exceptions slip through in complex frontend and backend systems. Establishing **Global Exception Catching** and **Error Boundary Patterns** ensures that a single crash in an isolated widget does not bring down the entire application or leave users staring at a frozen white screen.

---

## 1. Browser Global Exception Catching Architecture

Browsers provide two primary global handlers:

```
┌─────────────────────────────────────────────────────────────┐
│                    GLOBAL EXCEPTION SYSTEM                  │
├──────────────────────────────┬──────────────────────────────┤
│ window.onerror / 'error'     │ Synchronous JS exceptions,   │
│                              │ DOM event errors             │
├──────────────────────────────┼──────────────────────────────┤
│ window.onunhandledrejection  │ Uncaught Promise rejections, │
│                              │ unhandled async/await errors │
└──────────────────────────────┴──────────────────────────────┘
```

### Implementing Global Listeners:

```javascript
// 1. Capture synchronous runtime exceptions
window.addEventListener('error', (event) => {
  console.error('[Global Error]:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });

  // Report to telemetry service
  telemetryReporter.sendCrashReport(event.error);
});

// 2. Capture unhandled Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]:', event.reason);

  // Prevent default red console error if desired:
  // event.preventDefault();
  
  telemetryReporter.sendPromiseCrash(event.reason);
});
```

---

## 2. Cross-Origin Script Errors ("Script error.")

When loading scripts from CDNs without CORS headers, cross-origin security restrictions obscure error messages, producing an unhelpful `Script error.` with line number 0.

### The Fix: Add `crossorigin="anonymous"`
```html
<!-- In HTML: Enable CORS header on script tag -->
<script src="https://cdn.example.com/lib.js" crossorigin="anonymous"></script>
```
*And ensure the CDN responds with HTTP header: `Access-Control-Allow-Origin: *`.*

---

## 3. Vanilla JS Error Boundary Pattern

While popular in React, the Error Boundary pattern can be implemented in Vanilla JavaScript to wrap interactive components:

```javascript
class UIErrorBoundary {
  constructor(containerElement, fallbackRenderFn) {
    this.container = containerElement;
    this.fallbackRender = fallbackRenderFn;
  }

  wrap(componentFunction) {
    return async (...args) => {
      try {
        await componentFunction(...args);
      } catch (error) {
        console.error(`[ErrorBoundary] Caught crash in component:`, error);
        
        // Render user-friendly fallback UI instead of crashing whole page!
        this.container.innerHTML = this.fallbackRender(error);
        
        // Report telemetry
        telemetryReporter.sendCrashReport(error);
      }
    };
  }
}

// Usage:
const chartContainer = document.querySelector('#crypto-chart');
const boundary = new UIErrorBoundary(chartContainer, (err) => `
  <div class="card card-error">
    <h4>Unable to display Chart</h4>
    <p>${err.message}</p>
    <button onclick="location.reload()">Retry</button>
  </div>
`);

const safeRenderChart = boundary.wrap(async () => {
  // Risky 3rd-party rendering logic
  renderComplexFinancialChart();
});

safeRenderChart();
```

---

## Practice Quiz

### Q1: What event captures unhandled Promise rejections in modern browsers?
- A) window.onerror
- B) window.addEventListener('unhandledrejection')
- C) document.onreject
- D) window.addEventListener('promisefail')
**Answer:** B
**Explanation:** The `unhandledrejection` window event fires whenever a Promise is rejected without a `.catch()` or `try...catch` handler.

### Q2: Why does window.onerror sometimes report the vague message "Script error." on line 0?
- A) The script has a syntax error
- B) The script was loaded from a different origin (CDN) without proper CORS headers (crossorigin="anonymous")
- C) The browser is out of memory
- D) The script ran inside a Web Worker
**Answer:** B
**Explanation:** To prevent cross-origin data leakage, browsers mask error details from third-party domain scripts as "Script error." unless CORS is configured.

### Q3: What is the primary purpose of an Error Boundary?
- A) To prevent all runtime errors from occurring
- B) To isolate component failures and display a graceful fallback UI without crashing the rest of the application
- C) To restart the operating system
- D) To block network requests
**Answer:** B
**Explanation:** Error boundaries catch failures in specific UI subtrees, rendering fallback interfaces while keeping the surrounding application functional.

### Q4: How do you prevent the browser from logging its default red error message for an unhandled rejection?
- A) return false
- B) event.preventDefault() inside the 'unhandledrejection' listener
- C) console.clear()
- D) event.stopPropagation()
**Answer:** B
**Explanation:** Calling `event.preventDefault()` inside an `unhandledrejection` event handler suppresses the browser's default unhandled rejection console log.

### Q5: In Node.js, what process event is triggered by unhandled exceptions?
- A) process.on('uncaughtException')
- B) process.on('error')
- C) process.on('crash')
- D) process.on('exception')
**Answer:** A
**Explanation:** Node.js emits `uncaughtException` on the global `process` object when an unhandled exception bubbles all the way to the top of the event loop.
