# Using console Methods in Modern JavaScript

While almost every developer knows `console.log()`, the browser and Node.js `console` API provides over 20 specialized methods designed for performance profiling, data tabularization, visual grouping, stack tracing, and assertion verification.

---

## 1. Beyond console.log: Informational Levels

Different console levels display with distinct colors, icons, and severity filtering in DevTools:

```javascript
console.log('Standard informational message.');
console.info('Tip / info notice (blue badge in some consoles).');
console.warn('Warning: API response missing optional field!');
console.error('Critical Error: Failed to commit transaction!');
```

---

## 2. Visualizing Complex Data: console.table()

When inspecting arrays of objects, `console.table()` formats the output as an interactive, sortable table:

```javascript
const engineers = [
  { id: 1, name: 'Alice', role: 'DevOps', salary: 110000 },
  { id: 2, name: 'Bob', role: 'Frontend', salary: 95000 },
  { id: 3, name: 'Charlie', role: 'Backend', salary: 105000 }
];

// Display entire dataset as a table:
console.table(engineers);

// Filter table to display specific columns only:
console.table(engineers, ['name', 'role']);
```

```
┌─────────┬───────────┬────────────┐
│ (index) │   name    │    role    │
├─────────┼───────────┼────────────┤
│    0    │  'Alice'  │  'DevOps'  │
│    1    │   'Bob'   │ 'Frontend' │
│    2    │ 'Charlie' │ 'Backend'  │
└─────────┴───────────┴────────────┘
```

---

## 3. Profiling Performance: console.time() & console.timeEnd()

Accurately benchmark the execution duration of code segments in milliseconds:

```javascript
console.time('DataProcessingTimer');

// Perform compute-intensive logic
const largeList = Array.from({ length: 1000000 }, (_, i) => i * 2);
const filtered = largeList.filter(n => n % 3 === 0);

console.timeEnd('DataProcessingTimer');
// Logs: DataProcessingTimer: 42.18ms
```

---

## 4. Organizing Logs: console.group() & console.groupCollapsed()

Avoid messy console clutter by grouping related logs into collapsible hierarchies:

```javascript
function processOrder(orderId) {
  console.groupCollapsed(`Order #${orderId} Processing Details`);
  
  console.log('Validating inventory...');
  console.log('Checking credit card authorization...');
  console.log('Packaging warehouse manifest...');
  
  console.groupEnd();
}

processOrder('ORD-991');
```

---

## 5. Assertions & Stack Traces

### console.assert()
Logs an error message **only** if an expression evaluates to `false` (does not halt execution):

```javascript
const userScore = 45;
// Logs error ONLY if userScore < 50
console.assert(userScore >= 50, `Score is below passing threshold! Value: ${userScore}`);
```

### console.trace()
Prints the complete call stack trace from where the method was invoked:

```javascript
function stepC() { console.trace('Tracing call origin'); }
function stepB() { stepC(); }
function stepA() { stepB(); }
stepA();
```

---

## Practice Quiz

### Q1: Which console method formats an array of objects as a clean, sortable tabular grid in DevTools?
- A) console.grid()
- B) console.table()
- C) console.format()
- D) console.display()
**Answer:** B
**Explanation:** `console.table()` renders tabular data as an interactive table with headers corresponding to property keys.

### Q2: What pair of console methods is used to measure how many milliseconds a block of code took to execute?
- A) console.start() and console.stop()
- B) console.benchmark() and console.result()
- C) console.time() and console.timeEnd()
- D) console.timer() and console.clock()
**Answer:** C
**Explanation:** `console.time('label')` starts a timer, and `console.timeEnd('label')` stops it and prints elapsed time in milliseconds.

### Q3: When does console.assert(condition, message) log an error?
- A) Whenever the condition evaluates to true
- B) Only when the condition evaluates to false (falsy)
- C) Every time it is called
- D) Only in production builds
**Answer:** B
**Explanation:** `console.assert()` is conditional; it remains silent if the assertion expression is truthy and logs an error only when it evaluates to false.

### Q4: Which method creates a collapsible group in the DevTools console that starts in a collapsed state?
- A) console.group()
- B) console.groupCollapsed()
- C) console.minimize()
- D) console.fold()
**Answer:** B
**Explanation:** `console.groupCollapsed()` creates a log group that is closed by default, keeping the console tidy until expanded by the developer.

### Q5: What does console.trace() output?
- A) The memory usage of the JavaScript heap
- B) A stack trace indicating the execution path that led to that function invocation
- C) The network waterfall of current HTTP requests
- D) All CSS styles applied to the document
**Answer:** B
**Explanation:** `console.trace()` outputs a call stack trace showing the nested function calls that led up to the point of invocation.
