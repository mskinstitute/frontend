# How JavaScript Works in Browser

To write clean, bug-free JavaScript, you need a solid mental model of what happens behind the scenes when a browser downloads, parses, and executes your code.

---

## 1. The Browser Execution Architecture

Every modern web browser contains two primary components for web pages:
1. **The Rendering Engine** (e.g. Blink in Chrome, Gecko in Firefox, WebKit in Safari): Parses HTML into the **DOM** (Document Object Model) and CSS into the **CSSOM** (CSS Object Model).
2. **The JavaScript Engine** (e.g. V8 in Chrome & Node.js, SpiderMonkey in Firefox, JavaScriptCore in Safari): Reads, compiles, and executes JavaScript code.

```
+-----------------------------------------------------------------------------+
|                          JAVASCRIPT RUNTIME ENVIRONMENT                     |
+-----------------------------------------------------------------------------+
|   [ Call Stack ]                      [ Memory Heap ]                       |
|   Tracks function execution           Stores variables, objects, &          |
|   frames (LIFO)                       allocated memory data                 |
+-----------------------------------------------------------------------------+
|   [ Web APIs ] (Provided by the Browser, NOT JavaScript itself!)            |
|   DOM Events, setTimeout(), fetch(), LocalStorage, console.log              |
+-----------------------------------------------------------------------------+
|   [ Callback Queue ]                  [ Event Loop ]                        |
|   Holds finished async tasks          Continuously checks if Call Stack is  |
|   ready to execute                    empty; pushes callbacks to Stack!     |
+-----------------------------------------------------------------------------+
```

---

## 2. The Three Pillars of the JS Runtime

### 1. The Call Stack
JavaScript is a **single-threaded** programming language, meaning it has only **one call stack** and can execute only **one task at a time**.
- When you invoke a function, a new execution frame is pushed onto the stack.
- When the function finishes and returns, its frame is popped off the top of the stack.

### 2. The Memory Heap
An unstructured pool of computer RAM where objects, arrays, and functions are allocated and stored. Unused memory is automatically freed by the engine's **Garbage Collector**.

### 3. The Event Loop & Web APIs
If JavaScript is single-threaded, how can it fetch data from an API without freezing the entire browser screen?
- Heavy asynchronous tasks (`fetch`, `setTimeout`, DOM click events) are delegated to the browser's **Web APIs**.
- When the timer or network request completes, the Web API pushes the callback into the **Callback Queue**.
- The **Event Loop** constantly monitors: *"Is the Call Stack currently empty?"* As soon as the call stack is clear, the Event Loop takes the first task from the queue and pushes it onto the Call Stack!

---

## 3. How JavaScript is Linked to HTML Documents

There are three ways to embed JavaScript into an HTML page:

### A. External Script (Recommended Best Practice)
Separate your logic into a `.js` file:
```html
<!-- In index.html -->
<script src="app.js"></script>
```

### B. Internal Script Tag
Inside an HTML `<script>` block:
```html
<script>
  console.log("Inline script executed!");
</script>
```

### C. Inline HTML Event Attribute (Deprecated / Avoid)
```html
<button onclick="alert('Clicked!')">Click Me</button>
```

---

## 4. Modern Script Loading: `defer` vs `async`

Where should you place `<script>` tags in your HTML?

```
Parsing HTML:   =====[ Script Download ]======[ Script Execution ]======> HTML resumes
                (Without defer, HTML parsing is paused while JS downloads!)
```

### The Modern Solution: Use `defer` in the `<head>`!
```html
<head>
  <script src="app.js" defer></script>
</head>
```
- **`defer`**: Downloads JavaScript in the background *while* HTML parsing continues. Executes scripts only *after* the full HTML document is parsed, preserving script execution order.
- **`async`**: Downloads in the background, but interrupts HTML parsing and executes immediately as soon as download completes (great for independent analytics scripts like Google Analytics).

---

## Practice Quiz

### Q1: Is JavaScript a single-threaded or multi-threaded language by default?
- A) Multi-threaded with 16 parallel cores
- B) Single-threaded (has only one Call Stack and executes one command at a time)
- C) It has no threads
- D) Dual-threaded
**Answer:** B
**Explanation:** Standard JavaScript execution is single-threaded, processing synchronous operations sequentially on a single call stack.

### Q2: What is the primary role of the JavaScript Event Loop?
- A) Compressing CSS files
- B) Continuously checking if the Call Stack is empty, and pushing pending callbacks from the Callback Queue onto the Call Stack
- C) Restarting the computer on error
- D) Encrypting user passwords
**Answer:** B
**Explanation:** The Event Loop bridges asynchronous Web API callbacks with the single-threaded Call Stack by moving tasks from the queue to the stack when the stack becomes empty.

### Q3: Where are functions and execution contexts pushed and popped in JavaScript?
- A) The Memory Heap
- B) The Call Stack
- C) LocalStorage
- D) The Hard Disk
**Answer:** B
**Explanation:** The Call Stack manages execution contexts using Last-In, First-Out (LIFO) mechanics when functions are invoked and return.

### Q4: Why is adding the `defer` attribute to external `<script>` tags in `<head>` considered best practice?
- A) It prevents the script from downloading on mobile phones
- B) It downloads the script asynchronously in the background without blocking HTML parsing, and executes in order after the DOM is built
- C) It encrypts the JavaScript code
- D) It deletes console logs
**Answer:** B
**Explanation:** `defer` ensures non-blocking downloads and guarantees that your script will not execute until the DOM tree is completely constructed.

### Q5: Which of the following features is provided by the Browser Web APIs rather than core ECMAScript?
- A) `setTimeout()` and DOM events
- B) Variables declared with `let`
- C) Mathematical addition (`+`)
- D) `for` loops
**Answer:** A
**Explanation:** Timers (`setTimeout`), DOM manipulation, and `fetch` are browser-provided Web APIs exposed to JavaScript, not core language syntax.
