# Microtasks vs Macrotasks (Event Loop Deep Dive)

Mastering the JavaScript Event Loop requires understanding the boundary between the **Microtask Queue (Job Queue)** and the **Macrotask Queue (Task Queue)**. Misunderstanding task scheduling leads to subtle race conditions, delayed rendering frames, and interface freezes.

---

## 1. The Two Asynchronous Queues

JavaScript categorizes asynchronous callbacks into two distinct queues with vastly different execution priorities:

```
┌──────────────────────────────────────────────────────────────┐
│                    THE EVENT LOOP CYCLE                      │
├──────────────────────────────────────────────────────────────┤
│  1. Execute one MACROTASK from the Task Queue                │
│  2. Execute ALL MICROTASKS in the Microtask Queue            │
│     (until the microtask queue is COMPLETELY EMPTY!)         │
│  3. Perform UI Render / Repaint (if necessary, ~16ms/60fps)  │
│  4. Repeat cycle!                                            │
└──────────────────────────────────────────────────────────────┘
```

| Queue Type | APIs & Triggers | Drain Behavior |
| :--- | :--- | :--- |
| **Microtask Queue** | `Promise.then/catch/finally`, `queueMicrotask()`, `process.nextTick` (Node), `MutationObserver` | **Drained completely** to zero items before moving to rendering or next macrotask |
| **Macrotask Queue** | `setTimeout`, `setInterval`, `setImmediate` (Node), I/O events, UI clicks/keyboard events | Executes **one single task**, then cedes control to microtasks and rendering |

---

## 2. Execution Order Tracing

Analyze this classic interview test case:

```javascript
console.log('1. Script Start (Sync)');

setTimeout(() => {
  console.log('2. setTimeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise 1 (Microtask)');
}).then(() => {
  console.log('4. Promise 2 (Microtask)');
});

queueMicrotask(() => {
  console.log('5. queueMicrotask (Microtask)');
});

console.log('6. Script End (Sync)');
```

### Execution Step-by-Step:
1. **Synchronous code runs first:**
   - Logs `1. Script Start (Sync)`
   - Schedules `setTimeout` callback in **Macrotask Queue**.
   - Schedules Promise 1 in **Microtask Queue**.
   - Schedules `queueMicrotask` in **Microtask Queue**.
   - Logs `6. Script End (Sync)`
2. **Call Stack is now empty! Event Loop checks Microtask Queue:**
   - Runs Promise 1 -> logs `3. Promise 1 (Microtask)` -> schedules Promise 2 in Microtask Queue!
   - Runs `queueMicrotask` -> logs `5. queueMicrotask (Microtask)`.
   - Runs Promise 2 -> logs `4. Promise 2 (Microtask)`.
   - *Microtask Queue is now completely empty.*
3. **Event Loop checks Macrotask Queue:**
   - Runs `setTimeout` callback -> logs `2. setTimeout (Macrotask)`.

*Final Console Output Order:*
`1` -> `6` -> `3` -> `5` -> `4` -> `2`

---

## 3. Microtask Starvation (UI Freeze)

Because the engine **must drain the entire Microtask Queue** before rendering or moving to the next macrotask, recursively scheduling microtasks will **freeze the browser completely**:

```javascript
// DANGER: Freezes browser tab completely! UI never repaints!
function infiniteMicrotask() {
  Promise.resolve().then(infiniteMicrotask);
}
// infiniteMicrotask(); // Call stack never yields to UI paint!
```

---

## 4. When to Use queueMicrotask()

The `queueMicrotask()` standard API allows you to schedule a function to run asynchronously after the current synchronous function finishes, but **before** browser rendering or timer macrotasks:

```javascript
function trackTelemetry(event) {
  // Enqueue telemetry without blocking current synchronous work,
  // but ensure it executes before the next render frame:
  queueMicrotask(() => {
    sendBeacon('/analytics', event);
  });
}
```

---

## Practice Quiz

### Q1: What is the execution priority between the Microtask Queue and the Macrotask Queue?
- A) Macrotasks always execute before microtasks
- B) Microtasks always execute before the next macrotask and before browser repainting
- C) They alternate randomly
- D) They run concurrently on separate CPU threads
**Answer:** B
**Explanation:** After synchronous execution or each macrotask, the Event Loop drains the entire Microtask Queue completely before moving on to rendering or the next macrotask.

### Q2: Which of the following schedules a callback in the Microtask Queue?
- A) setTimeout(fn, 0)
- B) setInterval(fn, 1000)
- C) Promise.prototype.then()
- D) requestAnimationFrame(fn)
**Answer:** C
**Explanation:** Promise resolution callbacks (`.then()`, `.catch()`, `.finally()`) and `queueMicrotask()` are enqueued into the Microtask Queue.

### Q3: What happens if microtasks recursively enqueue new microtasks indefinitely?
- A) The engine switches to macrotasks after 5 calls
- B) The application starves the Event Loop, freezing the browser UI and preventing repainting
- C) It throws a RangeError immediately
- D) The browser tab reboots
**Answer:** B
**Explanation:** Because the Event Loop guarantees draining the microtask queue to completion before rendering or executing other tasks, infinite microtask recursion causes "microtask starvation," freezing the UI.

### Q4: How many macrotasks does the Event Loop execute before checking the microtask queue?
- A) Exactly one
- B) All available macrotasks
- C) Up to 10
- D) Zero
**Answer:** A
**Explanation:** The Event Loop processes exactly one macrotask from the Task Queue, then immediately proceeds to drain the Microtask Queue completely before considering another macrotask.

### Q5: What standard Web API allows developers to explicitly enqueue a callback into the microtask queue without creating a dummy Promise?
- A) window.nextTick()
- B) queueMicrotask(fn)
- C) setMicrotask(fn)
- D) EventLoop.enqueue(fn)
**Answer:** B
**Explanation:** `queueMicrotask(callback)` is the standardized browser and Node.js API for directly scheduling functions into the microtask queue.
