# Higher-Order Functions & Currying in Modern JavaScript

In JavaScript, functions are **first-class citizens**—they can be assigned to variables, passed as arguments to other functions, and returned from functions. Leveraging Higher-Order Functions (HOFs) and Currying allows developers to construct modular, reusable, and composable functional programs.

---

## 1. What is a Higher-Order Function?

A **Higher-Order Function (HOF)** is any function that either:
1. Accepts one or more functions as arguments (e.g., `Array.prototype.map`, `addEventListener`).
2. Returns a new function as its result.

```javascript
// HOF returning a function (Function Factory)
function createMultiplier(multiplier) {
  return function (value) {
    return value * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

## 2. Understanding Currying

**Currying** is the mathematical technique of converting a function that takes multiple arguments:
`f(a, b, c)`
into a chain of functions that each take a single argument:
`f(a)(b)(c)`.

```
Standard Function:
  add(1, 2, 3) ──► 6

Curried Pipeline:
  curriedAdd(1) ──► returns fn(b) ──► (2) ──► returns fn(c) ──► (3) ──► 6
```

### Manual Currying vs Arrow Currying

```javascript
// Traditional verbose currying
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Modern concise ES6 arrow syntax:
const curryAdd = a => b => c => a + b + c;

console.log(curryAdd(10)(20)(30)); // 60
```

---

## 3. Practical Enterprise Applications of Currying

### 1. Configurable Logger Middleware

```javascript
const logger = level => prefix => message => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] [${prefix}]: ${message}`);
};

// Create specialized loggers by partial application:
const errorLogger = logger('error')('AuthService');
const debugLogger = logger('debug')('DatabasePool');

errorLogger('Token expired for user UID_948');
// [2026-03-15T...] [ERROR] [AuthService]: Token expired for user UID_948
```

### 2. Configurable Event Handlers in UI Frameworks

```javascript
// Useful in React or Vanilla JS to avoid repetitive inline arrow functions
const handleFieldChange = fieldName => event => {
  state[fieldName] = event.target.value;
  validateField(fieldName);
};

usernameInput.addEventListener('input', handleFieldChange('username'));
emailInput.addEventListener('input', handleFieldChange('email'));
```

---

## 4. Generic Auto-Currying Utility

A production-grade generic `curry()` implementation checks `fn.length` (the number of declared parameters) and accumulates arguments until satisfied:

```javascript
function curry(fn) {
  return function curried(...args) {
    // If enough arguments have been provided, execute the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // Otherwise, return a function that collects the remaining arguments
    return function (...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// Example usage:
function calculateVolume(length, width, height) {
  return length * width * height;
}

const curriedVolume = curry(calculateVolume);

console.log(curriedVolume(2)(3)(4));    // 24 (Step-by-step)
console.log(curriedVolume(2, 3)(4));    // 24 (Partial batches)
console.log(curriedVolume(2, 3, 4));    // 24 (All at once)
```

---

## Practice Quiz

### Q1: What defines a Higher-Order Function (HOF) in JavaScript?
- A) A function that runs inside a Web Worker thread
- B) A function that accepts another function as an argument or returns a function
- C) A function that contains at least three nested loops
- D) A function that cannot be garbage collected
**Answer:** B
**Explanation:** A higher-order function is defined as any function that takes one or more functions as arguments, returns a function, or both.

### Q2: What is the primary transformation performed by Currying?
- A) Compressing the function's bytecode
- B) Converting a multi-argument function f(a, b, c) into a chain of single-argument functions f(a)(b)(c)
- C) Making the function execute asynchronously
- D) Automatically caching the function's return values
**Answer:** B
**Explanation:** Currying transforms a function of arity $N$ into a series of $N$ unary functions, each receiving one argument.

### Q3: How does a generic auto-currying function determine when it has received enough arguments to execute the original function?
- A) By inspecting fn.length (the function's arity)
- B) By checking localStorage
- C) By setting a 1000ms timer
- D) By checking if arguments contain null
**Answer:** A
**Explanation:** In JavaScript, `function.length` returns the number of formal parameters declared in the function signature.

### Q4: Which of the following demonstrates ES6 arrow syntax for a curried function multiplying two numbers?
- A) const multiply = (a, b) => a * b;
- B) const multiply = a => b => a * b;
- C) const multiply = a(b) => a * b;
- D) const multiply = a => { a * b };
**Answer:** B
**Explanation:** `const multiply = a => b => a * b;` declares a function accepting `a` and returning an inner function accepting `b`, which yields `a * b`.

### Q5: What is a major architectural advantage of Currying in real-world applications?
- A) It eliminates the need for unit tests
- B) It enables partial application, allowing you to configure generic functions with fixed parameters for specific contexts
- C) It bypasses CORS policies
- D) It compiles JavaScript into WebAssembly
**Answer:** B
**Explanation:** Currying facilitates partial application: you can fix common parameters once (e.g. logging prefix or HTTP endpoint) and reuse the specialized function across the codebase.
