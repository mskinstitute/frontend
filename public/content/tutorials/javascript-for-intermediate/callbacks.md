# Callbacks in Modern JavaScript

JavaScript is a single-threaded runtime environment driven by a non-blocking Event Loop. In order to perform long-running tasks (such as network requests, timer delays, or file I/O) without freezing the user interface, JavaScript relies on **asynchronous callbacks**.

---

## 1. What is a Callback Function?

A **callback** is simply a function passed into another function as an argument, intended to be executed ("called back") at a designated time or after an asynchronous operation completes.

### Synchronous vs. Asynchronous Callbacks

```javascript
// 1. Synchronous Callback: Executes immediately during caller execution
const numbers = [1, 2, 3];
numbers.forEach((num) => console.log(`Sync: ${num}`));

// 2. Asynchronous Callback: Defers execution until an event completes
console.log('Task A: Start timer');
setTimeout(() => {
  console.log('Task B: Timer callback executed after 1000ms');
}, 1000);
console.log('Task C: Script continues uninterrupted');
```

*Execution Output Order:*
1. `Task A: Start timer`
2. `Task C: Script continues uninterrupted`
3. `Task B: Timer callback executed after 1000ms`

---

## 2. The JavaScript Event Loop & Callback Queue

How does JavaScript manage asynchronous callbacks with only a single thread?

```
┌──────────────────────────────────────────────────────────┐
│                   CALL STACK (Single Thread)             │
│  console.log('A') ──► setTimeout(...) ──► console.log('C')│
└─────────────────────────────┬────────────────────────────┘
                              │ Registers Web API Timer
                              ▼
┌──────────────────────────────────────────────────────────┐
│              WEB APIs (Browser Background Engine)        │
│                Timer countdown (1000ms)                  │
└─────────────────────────────┬────────────────────────────┘
                              │ Timer expires
                              ▼
┌──────────────────────────────────────────────────────────┐
│              CALLBACK / TASK QUEUE (FIFO)                │
│             [ () => console.log('B') ]                   │
└─────────────────────────────┬────────────────────────────┘
                              │ Event Loop pushes when Call Stack is empty!
                              ▼
                     [ Executes Callback ]
```

1. Functions execute on the **Call Stack**.
2. Asynchronous operations (`setTimeout`, `fetch`) are delegated to browser **Web APIs**.
3. Upon completion, the callback is placed into the **Callback Queue** (Task Queue).
4. The **Event Loop** constantly monitors the Call Stack. When the Call Stack is empty, it pushes the queued callback onto the stack.

---

## 3. The Classic Problem: "Callback Hell" (Pyramid of Doom)

When multiple dependent asynchronous operations must execute sequentially, nesting callbacks leads to unmaintainable, deeply indented code:

```javascript
// ANTI-PATTERN: Callback Hell
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      processPayment(details.amount, (err, receipt) => {
        if (err) return handleError(err);
        console.log('Transaction finalized:', receipt);
      });
    });
  });
});
```

### Pitfalls of Callback Hell:
- Deeply nested indentation ("Pyramid of Doom").
- Repetitive, scattered error handling in every callback.
- High cognitive load and severe difficulty tracking control flow.
- Lack of native return values or composite operations.

---

## 4. Modern Solution: Evolution to Promises

To solve Callback Hell, ES6 introduced **Promises**, which flatten nested callbacks into linear chains (`.then().catch()`), later elevated by ES2017 `async/await`.

---

## Practice Quiz

### Q1: What is a callback function in JavaScript?
- A) A function that can only be declared inside an HTML tag
- B) A function passed as an argument to another function to be executed later
- C) A native C++ system call
- D) A recursive function that calls itself until stack overflow
**Answer:** B
**Explanation:** A callback is any function passed as an argument to another function to be invoked either immediately (synchronously) or later (asynchronously).

### Q2: What is the primary role of the JavaScript Event Loop?
- A) To compile JavaScript into native machine code
- B) To monitor the Call Stack and push callbacks from the Task Queue when the stack is empty
- C) To enforce strict variable typing
- D) To render CSS animations at 60 FPS
**Answer:** B
**Explanation:** The Event Loop continuously checks if the Call Stack is empty; when clear, it transfers the earliest task from the Callback Queue onto the stack.

### Q3: What is "Callback Hell"?
- A) A memory leak caused by infinite loops
- B) Deeply nested callback structures that make code difficult to read and debug
- C) A security vulnerability in Node.js
- D) An error when a callback returns undefined
**Answer:** B
**Explanation:** Callback Hell refers to heavily nested, Pyramid-of-Doom callbacks used for sequential asynchronous operations, which obscures error handling and code structure.

### Q4: In what order will console.log('1'), setTimeout(() => console.log('2'), 0), and console.log('3') print?
- A) 1, 2, 3
- B) 2, 1, 3
- C) 1, 3, 2
- D) 3, 1, 2
**Answer:** C
**Explanation:** Even with a 0ms delay, `setTimeout` places its callback into the Web API queue. Synchronous code (`1` then `3`) completes on the call stack first, after which the event loop executes `2`.

### Q5: What standard Node.js convention was historically used for callback arguments?
- A) (result, error) => {}
- B) (error, result) => {} ("Error-First Callback")
- C) (promise, resolve) => {}
- D) (data, status) => {}
**Answer:** B
**Explanation:** The "error-first callback" pattern (where the first parameter is reserved for an error object or null) was the universal Node.js convention before Promises.
