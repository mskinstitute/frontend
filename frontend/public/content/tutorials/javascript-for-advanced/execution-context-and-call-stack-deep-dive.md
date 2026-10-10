# Execution Context & Call Stack Deep Dive in Modern JavaScript

To understand how JavaScript executes code, handles hoisting, resolves scopes, and maintains asynchronous call stacks, one must understand the internal mechanics of the **Execution Context**.

---

## 1. What is an Execution Context?

An **Execution Context (EC)** is an abstract environment created by the JavaScript engine to evaluate and execute code. There are three types:
1. **Global Execution Context (GEC):** Created once when the script loads. Sets up `window` (browser) or `global` (Node.js) and `this`.
2. **Function Execution Context (FEC):** Created anew whenever a function is invoked.
3. **Eval Execution Context:** Created by code evaluated inside `eval()` (rarely used).

---

## 2. The Two Phases of Execution Context

Every Execution Context is created in **two distinct phases**:

```
           ┌──────────────────────────────────────────────┐
           │        EXECUTION CONTEXT LIFECYCLE           │
           ├──────────────────────────────────────────────┤
           │  1. CREATION PHASE (Memory Allocation)       │
           │     • Hoisting: allocate variables/functions │
           │     • var initialized as undefined           │
           │     • let/const registered in TDZ            │
           │     • Scope chain & 'this' determined        │
           ├──────────────────────────────────────────────┤
           │  2. EXECUTION PHASE (Line-by-Line Run)       │
           │     • Code executed sequentially             │
           │     • Values assigned to variables           │
           │     • Functions invoked (pushes new FEC)     │
           └──────────────────────────────────────────────┘
```

---

## 3. Hoisting & The Temporal Dead Zone (TDZ)

During the Creation Phase, declarations are registered in memory before code executes:
- **Function Declarations:** Fully hoisted into memory. Can be called before their definition!
- **`var`:** Hoisted and initialized with `undefined`.
- **`let` and `const`:** Hoisted but **uninitialized**. They enter the **Temporal Dead Zone (TDZ)** from the start of the block until their declaration line is executed.

```javascript
console.log(myVar); // undefined (var is hoisted and initialized)
// console.log(myLet); // ReferenceError: Cannot access 'myLet' before initialization (TDZ!)

var myVar = 10;
let myLet = 20; // TDZ ends here for myLet!
```

---

## 4. The Call Stack (LIFO: Last In, First Out)

The **Call Stack** is the data structure that manages execution contexts during runtime:

```javascript
function alpha() {
  beta();
  console.log('alpha completed');
}

function beta() {
  gamma();
  console.log('beta completed');
}

function gamma() {
  console.log('gamma executed');
}

alpha();
```

```
Call Stack Progression:
  1. [ Global Context ]
  2. [ Global Context ] -> [ alpha() ]
  3. [ Global Context ] -> [ alpha() ] -> [ beta() ]
  4. [ Global Context ] -> [ alpha() ] -> [ beta() ] -> [ gamma() ]
  5. gamma() returns  -> Pops off stack
  6. beta() returns   -> Pops off stack
  7. alpha() returns  -> Pops off stack
  8. Only Global Context remains
```

---

## 5. Stack Overflow

If functions call each other recursively without a termination condition, the Call Stack exceeds its memory allocation limit, triggering a `RangeError: Maximum call stack size exceeded`:

```javascript
function infiniteCrash() {
  infiniteCrash(); // No base case!
}
infiniteCrash(); // Crash! Stack Overflow
```

---

## Practice Quiz

### Q1: What are the two distinct phases every Execution Context undergoes?
- A) Compilation and Minification
- B) Creation Phase (Memory Allocation) and Execution Phase (Code Evaluation)
- C) Parsing and Garbage Collection
- D) Rendering and Painting
**Answer:** B
**Explanation:** Every execution context is first initialized during the Creation Phase (allocating memory for variables and functions) before running line-by-line in the Execution Phase.

### Q2: Why does calling a function declaration before its line of definition work in JavaScript?
- A) It is evaluated in a background service worker
- B) Function declarations are hoisted with their complete function bodies during the Creation Phase
- C) JavaScript reads files backwards
- D) Because of strict mode
**Answer:** B
**Explanation:** In the Creation Phase, function declarations are completely hoisted into memory with their bodies intact, making them callable anywhere in their scope.

### Q3: What is the "Temporal Dead Zone" (TDZ)?
- A) A period when the CPU sleeps to save power
- B) The region of code between the start of a block and the declaration line of a let or const variable where accessing it throws a ReferenceError
- C) The delay between an HTTP request and response
- D) A deprecated garbage collection algorithm
**Answer:** B
**Explanation:** The TDZ is the temporal span from block entry until variable declaration; referencing a `let` or `const` variable within this zone throws a `ReferenceError`.

### Q4: What data structure order does the JavaScript Call Stack follow?
- A) FIFO (First In First Out)
- B) LIFO (Last In First Out)
- C) Round Robin
- D) Priority Heap
**Answer:** B
**Explanation:** The Call Stack operates as a Last In, First Out (LIFO) structure: the most recently invoked function is pushed on top and must return before previous functions resume.

### Q5: What error is thrown when recursive function calls exceed the Call Stack capacity?
- A) TypeError: Memory exhausted
- B) RangeError: Maximum call stack size exceeded
- C) SyntaxError: Recursion depth reached
- D) SystemCrashError
**Answer:** B
**Explanation:** When the call stack limit is breached by unbounded recursion, the engine raises `RangeError: Maximum call stack size exceeded`.
