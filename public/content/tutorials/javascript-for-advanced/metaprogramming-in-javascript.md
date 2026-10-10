# Metaprogramming in Modern JavaScript

**Metaprogramming** refers to writing code that reads, inspects, analyzes, or modifies other code (or itself) at runtime. Modern JavaScript provides three distinct levels of metaprogramming: **Introspection** (examining structure), **Self-Modification** (altering internal logic), and **Intercession** (intercepting fundamental language semantics).

---

## 1. The 3 Levels of Metaprogramming

```
┌─────────────────────────────────────────────────────────────┐
│                    METAPROGRAMMING LEVELS                   │
├──────────────────────┬──────────────────────────────────────┤
│ 1. Introspection     │ Code inspects its own structure      │
│                      │ (`typeof`, `instanceof`, `Reflect`)  │
├──────────────────────┼──────────────────────────────────────┤
│ 2. Self-Modification │ Code mutates its own properties/logic│
│                      │ (`Object.defineProperty`, prototypes)│
├──────────────────────┼──────────────────────────────────────┤
│ 3. Intercession      │ Code intercepts language operations  │
│                      │ (`Proxy`, Well-Known Symbols)        │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 2. Introspection via the `Reflect` API

Before ES6, introspection utilities were scattered across `Object` functions, operators, and functions. The `Reflect` API centralizes introspection into a unified namespace:

```javascript
const target = { a: 1 };

// Check if property exists:
console.log(Reflect.has(target, 'a')); // true (Cleaner than 'a' in target)

// Safe property deletion:
const wasDeleted = Reflect.deleteProperty(target, 'a');
console.log('Deleted successfully:', wasDeleted); // true

// Retrieve property keys including Symbols:
console.log(Reflect.ownKeys(target));
```

---

## 3. Safe Monkey Patching with Dynamic Intercession

Monkey patching (modifying built-in or third-party methods at runtime) is dangerous if done carelessly. Metaprogramming patterns allow safe method instrumentation:

```javascript
function profileAllMethods(instance) {
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(prototype)
    .filter(name => typeof prototype[name] === 'function' && name !== 'constructor');

  for (const method of methodNames) {
    const originalMethod = prototype[method];

    // Intercept method call with timing wrapper
    prototype[method] = function (...args) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const duration = (performance.now() - start).toFixed(3);

      console.log(`[Profiler] Method "${method}" executed in ${duration}ms`);
      return result;
    };
  }
}
```

---

## 4. Class Method Decorators (TC39 Stage 3 Standard)

Modern JavaScript decorators allow metadata annotation and method interception using `@decorator` syntax:

```javascript
// Method Decorator: Logs arguments and return values
function logged(target, context) {
  const methodName = String(context.name);

  return function (...args) {
    console.log(`Calling ${methodName} with args:`, args);
    const result = target.call(this, ...args);
    console.log(`${methodName} returned:`, result);
    return result;
  };
}

class PaymentService {
  // Annotating method with decorator
  @logged
  processPayment(amount, recipient) {
    return { status: 'PAID', amount, recipient };
  }
}
```

---

## 5. Ethical Guidelines: When to Avoid Metaprogramming

1. **Avoid Over-Magic:** Code that alters fundamental semantics (e.g. changing what `+` does) confuses team members and complicates debugging.
2. **V8 Optimization De-optimizations:** Aggressive prototype mutations and dynamic shape alterations can force the V8 JIT compiler to bail out of optimized assembly code into slow polymorphic modes.

---

## Practice Quiz

### Q1: What is "Metaprogramming" in computer science?
- A) Programming using WebAssembly
- B) Writing programs that read, analyze, modify, or generate other programs or alter their own behavior at runtime
- C) Writing database queries
- D) Compressing CSS
**Answer:** B
**Explanation:** Metaprogramming involves treating code as data, enabling programs to inspect, modify, or intercept language semantics dynamically.

### Q2: What are the three recognized levels of metaprogramming in JavaScript?
- A) HTML, CSS, JavaScript
- B) Introspection, Self-Modification, and Intercession
- C) Client, Server, Database
- D) Compile, Link, Execute
**Answer:** B
**Explanation:** Metaprogramming encompasses Introspection (inspecting types/keys), Self-Modification (altering prototypes), and Intercession (intercepting language operations via Proxy).

### Q3: How does Reflect.ownKeys(target) differ from Object.keys(target)?
- A) Reflect.ownKeys is asynchronous
- B) Reflect.ownKeys returns all own keys—including non-enumerable string properties AND Symbol keys—whereas Object.keys only returns enumerable string keys
- C) Object.keys returns Symbols
- D) Reflect.ownKeys only returns numbers
**Answer:** B
**Explanation:** `Reflect.ownKeys()` returns all own property identifiers, combining `Object.getOwnPropertyNames()` and `Object.getOwnPropertySymbols()`.

### Q4: What is "Monkey Patching"?
- A) An automated testing bot
- B) The technique of extending or modifying the runtime behavior of a program's classes or methods without altering the original source code
- C) A syntax error
- D) An animation effect
**Answer:** B
**Explanation:** Monkey patching dynamically overrides or wraps existing functions and prototypes at runtime to alter their behavior.

### Q5: Why should excessive runtime prototype modifications be avoided in performance-critical paths?
- A) They delete RAM
- B) Mutating object structures and prototypes breaks hidden classes (shapes) in the V8 engine, de-optimizing code from fast inline caches
- C) Browsers block prototypes
- D) Prototypes are deprecated
**Answer:** B
**Explanation:** Frequent prototype or property shape mutations invalidate V8's hidden classes and inline caches, dropping execution back into slower unoptimized paths.
