# Crash Reporting & Telemetry Buffering in Modern JavaScript

Transmitting analytics events and crash telemetry to remote monitoring servers on every single user interaction creates high network overhead and drains mobile batteries. Conversely, sending telemetry when the user closes a tab often fails because standard `fetch()` calls are abruptly aborted. **Telemetry Buffering** and **`navigator.sendBeacon()`** solve both problems.

---

## 1. The Page Unload Problem

Historically, developers attempted to send telemetry during `window.onbeforeunload` or `window.onunload`:

```javascript
// ANTI-PATTERN: Fails on modern browsers!
window.addEventListener('unload', () => {
  // fetch() is CANCELLED immediately when the tab closes!
  fetch('/analytics', { method: 'POST', body: JSON.stringify(metrics) });
});
```

Because the tab is being terminated, the browser terminates all active HTTP connections, and the telemetry is lost.

---

## 2. The Solution: `navigator.sendBeacon()`

`navigator.sendBeacon(url, data)` sends small amounts of data asynchronously over HTTP POST. The browser **guarantees that the data is transmitted to the server**, even after the page has finished closing!

```javascript
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    const payload = JSON.stringify(bufferedEvents);
    const blob = new Blob([payload], { type: 'application/json' });

    // Browser schedules background transmission that survives tab closing!
    const success = navigator.sendBeacon('/api/telemetry', blob);
    if (success) {
      bufferedEvents = []; // Cleared successfully
    }
  }
});
```

> **Best Practice:** Use the **`visibilitychange`** event rather than `unload` or `beforeunload`. Mobile browsers frequently suspend background tabs without firing `unload`!

---

## 3. The `fetch()` with `keepalive: true` Alternative

Modern Fetch API supports `keepalive: true`, which keeps the HTTP request alive after the page is discarded:

```javascript
function sendFinalAnalytics(data) {
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    keepalive: true // Keeps connection alive even if tab closes!
  });
}
```

---

## 4. Implementing a Production Telemetry Buffer

To avoid spamming analytics endpoints with hundreds of tiny HTTP calls, buffer events in memory and flush them in batches based on **buffer size** or a **periodic timer**:

```javascript
class TelemetryBuffer {
  constructor(endpoint, maxBufferSize = 20, flushIntervalMs = 5000) {
    this.endpoint = endpoint;
    this.maxBufferSize = maxBufferSize;
    this.flushIntervalMs = flushIntervalMs;
    this.buffer = [];

    // Periodic flush timer
    this.timer = setInterval(() => this.flush(), this.flushIntervalMs);

    // Flush on page hidden / unload
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  track(eventName, properties = {}) {
    this.buffer.push({
      event: eventName,
      properties,
      timestamp: Date.now()
    });

    // Flush immediately if buffer reaches capacity threshold
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length === 0) return;

    const payload = JSON.stringify(this.buffer);
    this.buffer = []; // Clear buffer immediately to prevent duplicate sends

    // Attempt sendBeacon first, fallback to fetch with keepalive
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(err => console.warn('Telemetry flush failed:', err));
    }
  }
}

// Global instance
export const analytics = new TelemetryBuffer('/api/v1/telemetry');
```

---

## Practice Quiz

### Q1: Why do standard fetch() requests often fail when initiated inside a window 'unload' event?
- A) Unload events do not support JavaScript
- B) The browser immediately terminates active fetch connections when the page context is torn down
- C) Unload events require WebAssembly
- D) It violates CORS
**Answer:** B
**Explanation:** When a page unloads, standard in-flight network requests are abruptly cancelled by the browser to allow the process to terminate quickly.

### Q2: What is the primary guarantee of navigator.sendBeacon(url, data)?
- A) It guarantees that data is encrypted with AES-256
- B) The browser guarantees the HTTP POST request will be transmitted in the background even if the page or tab is closed immediately
- C) It renders data into the DOM
- D) It returns a synchronous response from the server
**Answer:** B
**Explanation:** `sendBeacon` offloads transmission to the browser process, ensuring delivery to the server even after the originating web page has completely closed.

### Q3: Which page lifecycle event is the recommended modern replacement for 'unload' and 'beforeunload' when saving state and flushing telemetry?
- A) window.onclose
- B) document.addEventListener('visibilitychange') checking document.visibilityState === 'hidden'
- C) document.onquit
- D) window.onexit
**Answer:** B
**Explanation:** The W3C and browser vendors recommend `visibilitychange` (`hidden`) because mobile operating systems often kill background tabs without firing `unload`.

### Q4: What fetch() option keeps an HTTP request alive after a page unloads, serving as an alternative to sendBeacon?
- A) { persist: true }
- B) { keepalive: true }
- C) { background: true }
- D) { daemon: true }
**Answer:** B
**Explanation:** Passing `{ keepalive: true }` in `fetch()` options instructs the browser to maintain the connection and complete transmission even if the document closes.

### Q5: What is the primary operational benefit of Telemetry Buffering?
- A) It formats text into Markdown
- B) It batches multiple events into a single consolidated HTTP request, reducing network connection overhead and saving mobile battery
- C) It stops garbage collection
- D) It prevents CORS errors
**Answer:** B
**Explanation:** Buffering groups individual events into batch payloads sent at intervals, minimizing HTTP overhead and reducing battery/radio usage on mobile devices.
