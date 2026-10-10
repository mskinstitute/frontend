# Call Stack, Callback Queue, Microtask Queue & Libuv Workers

To master backend performance and debug tricky race conditions in Node.js, every developer must understand the exact priority mechanism governing asynchronous execution: the **Call Stack**, the **Microtask Queue**, the **Callback Queue (Macrotask Queue)**, and the **Libuv Worker Thread Pool**.

---

## 1. Execution Priority Hierarchy

When multiple asynchronous operations complete simultaneously, Node.js uses a strict order of precedence:

1. **Synchronous Code on Call Stack:** Runs immediately until the call stack is completely empty.
2. **Microtask Queue 1 (`process.nextTick`):** Runs before ANY other asynchronous queue, immediately after the current operation finishes.
3. **Microtask Queue 2 (Promises / `queueMicrotask`):** Promise `.then()`, `.catch()`, and `async/await` continuations.
4. **Macrotask / Timer Queue (`setTimeout`, `setInterval`):** Evaluated during the Timers phase of the Event Loop.
5. **Check Queue (`setImmediate`):** Executed during the Check phase of the Event Loop.

```text
[Call Stack] -> [process.nextTick queue] -> [Promise Microtasks] -> [Event Loop Phases]
```

---

## 2. Priority Demonstration in Code

```javascript
console.log('1. Synchronous');

setTimeout(() => {
  console.log('5. setTimeout (Timer Macrotask)');
}, 0);

setImmediate(() => {
  console.log('6. setImmediate (Check Macrotask)');
});

Promise.resolve().then(() => {
  console.log('3. Promise.then (Microtask Queue)');
});

process.nextTick(() => {
  console.log('2. process.nextTick (Microtask Queue - Priority 1)');
});

console.log('4. Synchronous end');
```

**Actual Execution Order:**
```text
1. Synchronous
4. Synchronous end
2. process.nextTick (Microtask Queue - Priority 1)
3. Promise.then (Microtask Queue)
5. setTimeout (Timer Macrotask)
6. setImmediate (Check Macrotask)
```

---

## 3. The Libuv Worker Thread Pool

While network I/O (HTTP sockets, TCP) uses non-blocking OS kernel polling (epoll/kqueue), certain operations cannot be performed asynchronously by operating system kernels. Node.js sends these to the **Libuv Thread Pool**:

- **File System Operations:** `fs.readFile`, `fs.writeFile`
- **Cryptography:** `crypto.pbkdf2`, `crypto.scrypt`, `crypto.randomBytes`
- **Compression:** `zlib.deflate`, `zlib.gzip`
- **DNS Lookups:** `dns.lookup`

The default size of this thread pool is **4 threads**, but it can be scaled for heavy workloads using the environment variable:

```bash
# Linux / macOS
export UV_THREADPOOL_SIZE=16

# Windows PowerShell
$env:UV_THREADPOOL_SIZE=16
```

---

# Multiple Choice Questions

### 1. Which asynchronous task queue has the highest priority and executes immediately after the current call stack clears, before Promise resolutions?
A. Timers Queue
B. `process.nextTick` Queue
C. I/O Polling Queue
D. Check Queue (`setImmediate`)
**Answer:** B
**Explanation:** The `process.nextTick` queue is processed with absolute priority immediately after the call stack empties, preceding even Promise microtasks.
---

### 2. What is the default number of worker threads in the Libuv thread pool in Node.js?
A. 1
B. 2
C. 4
D. 64
**Answer:** C
**Explanation:** By default, Node.js allocates 4 worker threads in the Libuv thread pool (controllable via `UV_THREADPOOL_SIZE` up to 1024).
---

### 3. Which of the following operations is offloaded to the Libuv worker thread pool rather than using OS-level non-blocking kernel sockets?
A. Incoming TCP connection handling
B. HTTP server listening on port 3000
C. Cryptographic hashing via `crypto.pbkdf2`
D. WebSockets ping/pong frames
**Answer:** C
**Explanation:** Cryptographic operations, file system calls, and DNS lookups rely on Libuv's thread pool because operating systems do not provide non-blocking asynchronous APIs for them.
---

### 4. What is the danger of recursively calling `process.nextTick()` inside its own callback?
A. It causes a syntax error.
B. It starves the Event Loop, preventing I/O operations and timers from ever running.
C. It clears all database tables.
D. It terminates the Node.js runtime with exit code 0.
**Answer:** B
**Explanation:** Because Node.js processes the nextTick queue continuously until completely empty, an infinite or recursive nextTick loop starves I/O and locks the entire event loop.
---

### 5. Between `setTimeout(fn, 0)` and `setImmediate(fn)`, which is explicitly designed to execute immediately after the I/O polling phase completes?
A. `setTimeout`
B. `setImmediate`
C. `setInterval`
D. `requestAnimationFrame`
**Answer:** B
**Explanation:** `setImmediate()` is specifically placed in the "Check" phase of the event loop to run right after the I/O polling phase completes.
---
