# Node.js Architecture, V8 Engine & Single-Threaded Event Loop

**Node.js** is an open-source, cross-platform JavaScript runtime environment built on Google Chrome's **V8 JavaScript engine**. Node.js executes JavaScript outside the browser, enabling developers to build scalable, high-performance network applications, microservices, and backend APIs using a single programming language across the entire stack.

---

## 1. What Makes Node.js Unique?

Traditional server environments (like Apache with PHP or Java servlets) historically spawned a new operating system thread for each incoming client request. A server handling 10,000 concurrent requests would require 10,000 threads, quickly exhausting server RAM and spending tremendous CPU cycles on thread context switching.

In contrast, Node.js operates on a **single-threaded, non-blocking, event-driven architecture**:
1. **Google V8 Engine:** Written in C++, it parses and compiles modern JavaScript directly into machine code at runtime with Just-In-Time (JIT) compilation.
2. **Single-Threaded Execution:** JavaScript application code runs on a single main thread, avoiding multithreaded race conditions and locking deadlocks.
3. **Libuv C Library:** Handles all low-level asynchronous I/O operations (file system, network sockets, DNS, database pooling) using native OS kernel notifications (epoll on Linux, kqueue on macOS, IOCP on Windows) and an internal C thread pool.

---

## 2. The Architectural Diagram

![Node.js Event Loop Architecture](/images/tutorials/nodejs-and-express-backend/nodejs-event-loop-architecture.svg)

---

## 3. How the Event Loop Works

The Event Loop is the heart of Node.js. It continuously monitors the Call Stack and task queues, orchestrating when asynchronous callbacks are pushed to the stack for execution.

The Event Loop cycles through several distinct phases in each "tick":

| Phase | Responsibility | Example Tasks |
| :--- | :--- | :--- |
| **Timers** | Executes callbacks scheduled by `setTimeout()` and `setInterval()` | Delayed notifications, interval timers |
| **Pending Callbacks** | Executes I/O callbacks deferred to the next loop iteration | System-level network socket error callbacks |
| **Idle, Prepare** | Used internally by Node.js for diagnostics and runtime housekeeping | Internal Libuv operations |
| **Poll** | Retrieves new I/O events and executes their callbacks | Incoming HTTP requests, file read buffers |
| **Check** | Executes callbacks registered by `setImmediate()` | Code explicitly deferred until after poll phase |
| **Close Callbacks** | Handles resource cleanup and teardown | `socket.on('close', ...)` |

---

## 4. Practical Code Example: Non-Blocking Execution

```javascript
const fs = require('fs');

console.log('1. Start program execution');

// Asynchronous non-blocking file read handled by Libuv
fs.readFile(__filename, 'utf8', (err, data) => {
  if (err) throw err;
  console.log('3. Asynchronous file read callback completed (' + data.length + ' bytes)');
});

console.log('2. End program (Call stack clear)');
```

**Output:**
```text
1. Start program execution
2. End program (Call stack clear)
3. Asynchronous file read callback completed (1842 bytes)
```

The main thread never waits for disk or network I/O. It delegates the I/O to Libuv and immediately continues processing subsequent synchronous statements.

---

# Multiple Choice Questions

### 1. Which core component of Node.js is responsible for compiling JavaScript code into native machine code?
A. Libuv
B. Google V8 Engine
C. Apache HTTP Core
D. OpenSSL
**Answer:** B
**Explanation:** Google's V8 engine, written in C++, parses, optimizes, and compiles JavaScript into machine code using JIT compilation.
---

### 2. Why is Node.js considered non-blocking despite executing JavaScript on a single thread?
A. It spawns an entirely new operating system process for every single function called.
B. It offloads asynchronous I/O operations (network, disk, timers) to the underlying Libuv library and OS kernel.
C. It pauses all other programs running on the operating system until the script finishes.
D. It automatically converts all synchronous code into Web Workers.
**Answer:** B
**Explanation:** Node.js delegates asynchronous I/O operations to Libuv, which utilizes OS kernel primitives or its internal thread pool, allowing the main JS thread to keep processing other requests.
---

### 3. In which phase of the Node.js Event Loop are callbacks registered via `setImmediate()` executed?
A. Timers phase
B. Poll phase
C. Check phase
D. Close phase
**Answer:** C
**Explanation:** The Check phase immediately follows the Poll phase and is dedicated specifically to executing callbacks scheduled with setImmediate().
---

### 4. What happens when CPU-intensive synchronous calculations (such as an infinite loop or heavy image compression) are run on the main Node.js thread?
A. Node.js automatically balances the calculation across 16 CPU cores.
B. The Event Loop is blocked, preventing any other incoming requests or callbacks from being processed.
C. Node.js reboots the operating system.
D. The calculation runs in the background with zero latency.
**Answer:** B
**Explanation:** Because JavaScript execution is single-threaded, a long-running CPU-bound synchronous loop blocks the Event Loop, halting all incoming network requests and timer executions until it finishes.
---

### 5. What is Libuv in the Node.js architecture?
A. A front-end React rendering engine.
B. A multi-platform C library that provides the event loop, asynchronous I/O abstraction, and worker thread pool.
C. A database driver specifically designed for PostgreSQL.
D. A CSS-in-JS styling tool.
**Answer:** B
**Explanation:** Libuv is the foundational C library behind Node.js that abstracts asynchronous I/O across platforms and manages the thread pool and event loop.
---
