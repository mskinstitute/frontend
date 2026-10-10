# Web Workers & Multithreading in Modern JavaScript

While JavaScript is famous for its single-threaded Event Loop, modern browsers provide true hardware-level multithreading via the **Web Workers API**. Web Workers run scripts in background threads, enabling CPU-intensive operations (image processing, cryptographic hashing, 3D physics, big-data filtering) without blocking the main UI thread.

---

## 1. Main Thread vs. Worker Thread

```
┌──────────────────────────────────────────────┐
│             MAIN THREAD                      │
│  • Manages DOM, Layout, CSS, and UI events   │
│  • Freezes if heavy calculation runs here!   │
└──────────────────────┬───────────────────────┘
                       │ postMessage(data)
                       ▼
┌──────────────────────────────────────────────┐
│         DEDICATED WEB WORKER THREAD          │
│  • Runs in true parallel operating thread    │
│  • NO direct access to DOM or window         │
│  • Has its own global: self / DedicatedWorker│
└──────────────────────────────────────────────┘
```

### What Workers CANNOT Access:
- The DOM (`document.querySelector`, `window`)
- `parent` object
- Local DOM nodes

### What Workers CAN Access:
- `fetch()` and `XMLHttpRequest`
- `IndexedDB`
- `WebSockets`
- `crypto.subtle`
- `setTimeout`, `setInterval`

---

## 2. Spawning and Communicating with a Worker

### 1. The Worker Script (`worker.js`)
```javascript
// worker.js: Runs in isolated background thread
self.addEventListener('message', (event) => {
  const { numbers } = event.data;
  console.log('[Worker] Received array of size:', numbers.length);

  // Intensive CPU computation (e.g. prime number filtering)
  const primes = numbers.filter(isPrime);

  // Send results back to main thread
  self.postMessage({ primes, count: primes.length });
});

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}
```

### 2. The Main Script (`app.js`)
```javascript
// app.js: Spawns worker from main thread
const worker = new Worker('worker.js');

// Listen for results
worker.addEventListener('message', (event) => {
  console.log('[Main] Primes computed in background:', event.data.count);
  hideSpinner();
});

// Listen for worker errors
worker.addEventListener('error', (err) => {
  console.error('[Main] Worker error:', err.message);
});

// Dispatch heavy workload to background thread
const dataPayload = Array.from({ length: 5000000 }, (_, i) => i + 1);
worker.postMessage({ numbers: dataPayload });

// Terminate worker when no longer needed
// worker.terminate();
```

---

## 3. High-Performance Zero-Copy: Transferable Objects

By default, data passed via `postMessage()` is cloned using the **Structured Clone Algorithm** (deep copy), which can be slow for 500MB video buffers or typed arrays.

**Transferable Objects** transfer memory ownership **instantly with zero copy** ($O(1)$ transfer time). The sender relinquishes ownership:

```javascript
const buffer = new ArrayBuffer(1024 * 1024 * 64); // 64MB Buffer

// Transfer ownership to worker (Zero-copy transfer!)
worker.postMessage({ buffer }, [buffer]);

// In main thread: buffer.byteLength is now 0! It has been moved to worker.
console.log('Buffer transferred:', buffer.byteLength === 0); // true!
```

---

## 4. Modern Inline Workers with Blob URLs

When building components with Vite or Webpack, you can create Workers dynamically from string literals:

```javascript
const workerCode = `
  self.onmessage = (e) => {
    self.postMessage(e.data * 2);
  };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const inlineWorker = new Worker(workerUrl);
```

---

## Practice Quiz

### Q1: What is the primary advantage of offloading heavy computations to a Web Worker?
- A) It bypasses browser memory limits
- B) It executes in a separate background thread, preventing the main thread and UI from freezing
- C) It can modify the DOM twice as fast
- D) It automatically optimizes database queries
**Answer:** B
**Explanation:** Web Workers execute in background operating system threads, preventing long-running CPU calculations from locking up user interactions, scrolling, and animations.

### Q2: Can a Web Worker directly manipulate DOM elements via document.getElementById()?
- A) Yes, always
- B) No, Web Workers have no access to the window, document, or DOM tree
- C) Only if granted permission in manifest
- D) Yes, in Chrome only
**Answer:** B
**Explanation:** Web Workers operate in an isolated global scope (`DedicatedWorkerGlobalScope`) without access to `window`, `document`, or DOM elements.

### Q3: What method communicates data between the main thread and a Web Worker?
- A) window.send()
- B) postMessage()
- C) worker.dispatch()
- D) worker.emit()
**Answer:** B
**Explanation:** `postMessage()` is the standard API used to transmit messages and payloads between the main thread and worker threads.

### Q4: What happens to an ArrayBuffer when it is sent to a Worker as a Transferable Object?
- A) It is cloned into a new memory location
- B) Ownership of the underlying memory buffer is transferred instantly with zero copying; the original buffer becomes neutered (0 bytes)
- C) It is compressed into a zip archive
- D) It is converted to JSON
**Answer:** B
**Explanation:** Transferable objects transfer ownership of the underlying allocation instantly ($O(1)$) without memory duplication, detaching the original buffer in the sender thread.

### Q5: How do you immediately terminate an active Web Worker from the main thread?
- A) worker.close()
- B) worker.terminate()
- C) worker.kill()
- D) delete worker
**Answer:** B
**Explanation:** Calling `worker.terminate()` from the parent thread halts the worker thread immediately without waiting for its current task to complete.
