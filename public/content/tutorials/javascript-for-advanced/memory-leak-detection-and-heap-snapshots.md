# Memory Leak Detection & Heap Snapshots in Modern JavaScript

In long-running Single Page Applications (SPAs) and Node.js microservices, unresolved memory allocations degrade application speed and eventually crash the browser tab or server with an `Out of Memory` error. Profiling the **V8 Heap** and analyzing **Heap Snapshots** in Chrome DevTools is essential for senior engineers.

---

## 1. Common Causes of JavaScript Memory Leaks

### 1. Detached DOM Elements
An element is removed from the DOM tree, but a JavaScript reference still points to it in a variable or array:

```javascript
// DANGER: Detached DOM Leak
const elementCache = [];

function removeButton() {
  const btn = document.querySelector('#btn-leak');
  elementCache.push(btn); // Retaining reference in array!
  btn.remove(); // Removed from DOM tree, BUT CANNOT BE GARBAGE COLLECTED!
}
```

### 2. Forgotten Timers & Callbacks
```javascript
// Timer callback retains 'largeData' in its closure indefinitely!
const largeData = new Array(1000000).fill('leak');
setInterval(() => {
  console.log('Heartbeat...');
}, 1000); // If never clearInterval(), largeData may stay in memory!
```

### 3. Accidental Global Variables
In non-strict mode, assigning to an undeclared variable attaches it to `window`, preventing garbage collection:
```javascript
function leakGlobal() {
  leakedData = new Array(1000000); // window.leakedData (Never freed!)
}
```

---

## 2. Taking & Comparing Heap Snapshots

1. Open DevTools -> **Memory** tab.
2. Select **Heap snapshot** -> Click **Take snapshot**.
3. Perform the suspicious action (e.g. open modal and close it 10 times).
4. Take **Snapshot 2**.
5. Change view dropdown from **Summary** to **Comparison** between Snapshot 1 and Snapshot 2.

```
DevTools Memory Panel:
  [ Snapshot 1: 14.2 MB ]
           │ (User opens & closes modal 5 times)
  [ Snapshot 2: 38.6 MB ] ──► +24.4 MB Delta! (Clear Memory Leak!)
```

---

## 3. Interpreting Retainers and Shallow vs. Retained Size

In the Memory Inspector:
- **Shallow Size:** The memory directly held by the object itself (typically small, e.g. 32 bytes for the pointer map).
- **Retained Size:** The total memory freed if this object is deleted (includes all referenced child objects and buffers).
- **Retainer Tree:** The path of references keeping the object alive from the **GC Root** (window / global).

```
  GC Root (window)
     └── appState
           └── listeners[]
                 └── modalElement (Detached HTMLDivElement) ◄── Identifies Retainer!
```

---

## 4. Best Practices to Prevent Leaks

1. **Unregister Listeners:** Always detach listeners when DOM elements are unmounted (`removeEventListener` or `AbortController`).
2. **Use WeakRef & WeakMap:** Weak collections allow keys to be garbage-collected if no other references exist.
3. **Nullify Large Buffers:** Explicitly set large arrays or buffers to `null` once processing is complete.

---

## Practice Quiz

### Q1: What is a "Detached DOM Tree" in memory profiling?
- A) A tree structure stored in CSS
- B) DOM elements that have been removed from the visible document but are still referenced by JavaScript variables in memory
- C) A Virtual DOM tree
- D) A Web Worker DOM
**Answer:** B
**Explanation:** Detached DOM nodes are elements removed from the active DOM hierarchy that cannot be garbage-collected because active JavaScript variables or closures still reference them.

### Q2: What is the difference between "Shallow Size" and "Retained Size" in a Heap Snapshot?
- A) Shallow size is for strings; retained size is for numbers
- B) Shallow size is the memory allocated for the object itself; retained size is the total memory freed if the object and its dependent graph are collected
- C) Shallow size is measured in kilobytes; retained size in megabytes
- D) They are strictly identical
**Answer:** B
**Explanation:** Shallow size is the memory directly consumed by the object container, while retained size includes the entire graph of child objects that would become eligible for garbage collection upon its deletion.

### Q3: How do you identify which variable is keeping an object alive in a Heap Snapshot?
- A) Inspect the Network Tab
- B) Inspect the "Retainers" panel at the bottom of the Memory tab, tracing the reference chain up to the GC Root
- C) Look at localStorage
- D) Check package.json
**Answer:** B
**Explanation:** The Retainers panel displays the path of active references connecting the highlighted object to a Garbage Collection Root (like `window`).

### Q4: Why can setInterval cause memory leaks if not cleared?
- A) It compiles code into C++
- B) Its callback closure keeps all variables referenced within its scope alive in memory until clearInterval() is called
- C) It stops the garbage collector from running anywhere
- D) It modifies the HTML doctype
**Answer:** B
**Explanation:** `setInterval` callbacks remain active in the event loop indefinitely, preventing any variables captured in their lexical scope from being garbage-collected.

### Q5: What collection type should you use to store metadata about DOM elements without preventing their garbage collection?
- A) Array
- B) Map
- C) WeakMap
- D) Set
**Answer:** C
**Explanation:** `WeakMap` holds weak references to its object keys; if a DOM element has no other references, the garbage collector can reclaim it even if it is a key in a `WeakMap`.
