# Proxy & Reflect API Deep Dive in Modern JavaScript

Introduced in ECMAScript 2015 (ES6), the **`Proxy`** and **`Reflect`** APIs provide low-level metaprogramming capabilities in JavaScript. While standard objects only allow reading and writing properties, `Proxy` enables wrapping an object to intercept and redefine **13 fundamental language operations** (termed **Traps**).

---

## 1. The 13 Proxy Traps and Their Reflect Equivalents

Every trap in a Proxy handler mirrors a corresponding static method on the built-in `Reflect` object:

| Proxy Trap | Intercepts | Triggered By | Reflect Method |
| :--- | :--- | :--- | :--- |
| `get` | Property access | `obj.prop`, `obj['prop']` | `Reflect.get()` |
| `set` | Property assignment | `obj.prop = val` | `Reflect.set()` |
| `has` | The `in` operator | `'prop' in obj` | `Reflect.has()` |
| `deleteProperty` | Deleting a property | `delete obj.prop` | `Reflect.deleteProperty()` |
| `apply` | Function call | `fn(...args)`, `fn.apply()` | `Reflect.apply()` |
| `construct` | The `new` operator | `new MyClass()` | `Reflect.construct()` |
| `getPrototypeOf` | Getting prototype | `Object.getPrototypeOf()` | `Reflect.getPrototypeOf()` |
| `setPrototypeOf` | Setting prototype | `Object.setPrototypeOf()` | `Reflect.setPrototypeOf()` |
| `isExtensible` | Extensibility check | `Object.isExtensible()` | `Reflect.isExtensible()` |
| `preventExtensions`| Disabling extensions | `Object.preventExtensions()` | `Reflect.preventExtensions()`|
| `getOwnPropertyDescriptor` | Inspecting descriptors | `Object.getOwnPropertyDescriptor()` | `Reflect.getOwnPropertyDescriptor()`|
| `defineProperty` | Defining descriptors | `Object.defineProperty()` | `Reflect.defineProperty()` |
| `ownKeys` | Enumerating keys | `Object.keys()`, `Object.getOwnPropertyNames()` | `Reflect.ownKeys()` |

---

## 2. Why Reflect is Mandatory Inside Proxy Traps

A common beginner mistake is directly calling `target[prop]` inside a `get` trap:

```javascript
// ANTI-PATTERN: Breaks inheritance when prototype objects access getters!
get(target, prop) {
  return target[prop]; // 'this' inside getters will point to target, NOT receiver!
}

// CORRECT STANDARD PATTERN:
get(target, prop, receiver) {
  return Reflect.get(target, prop, receiver); // Correctly binds 'this' to the Proxy!
}
```

The `receiver` parameter guarantees that if a property is a getter that uses `this`, `this` correctly points to the **Proxy instance**, not the underlying raw target object!

---

## 3. Real-World Architectural Implementations

### 1. Reactive Data Binding (Vue 3 Reactivity Engine)
```javascript
function reactive(target, onChange) {
  return new Proxy(target, {
    set(target, prop, value, receiver) {
      const oldValue = target[prop];
      const result = Reflect.set(target, prop, value, receiver);

      if (oldValue !== value) {
        onChange(prop, value, oldValue); // Notify UI to re-render!
      }
      return result;
    }
  });
}

const state = reactive({ count: 0 }, (prop, val) => {
  console.log(`[Reactivity] Property "${prop}" changed to: ${val}`);
});

state.count = 1; // Logs: [Reactivity] Property "count" changed to: 1
```

### 2. Negative Array Indexing (Python-Style Arrays)
In JavaScript, `arr[-1]` returns `undefined`. We can implement Python-style negative indices using Proxy:

```javascript
function createSmartArray(...items) {
  return new Proxy(items, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        const index = Number(prop);
        if (!isNaN(index) && index < 0) {
          // Translate -1 to (length - 1)
          const resolvedIndex = target.length + index;
          return Reflect.get(target, resolvedIndex, receiver);
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

const list = createSmartArray('A', 'B', 'C', 'D');
console.log(list[-1]); // 'D' (Last element!)
console.log(list[-2]); // 'C'
```

---

## 4. Revocable Proxies (`Proxy.revocable()`)

A **Revocable Proxy** creates a proxy that can be completely disconnected and disabled at any time, instantly cutting off access:

```javascript
const sensitiveData = { apiKey: 'SECRET_4920' };
const { proxy, revoke } = Proxy.revocable(sensitiveData, {});

console.log(proxy.apiKey); // 'SECRET_4920'

// Revoke access when session ends:
revoke();

// Subsequent access throws TypeError!
// console.log(proxy.apiKey); // TypeError: Cannot perform 'get' on a proxy that has been revoked!
```

---

## Practice Quiz

### Q1: How many fundamental internal operation traps can be intercepted by a JavaScript Proxy?
- A) Exactly 3 (get, set, delete)
- B) Exactly 13
- C) Unlimited
- D) 50
**Answer:** B
**Explanation:** The ECMAScript specification defines exactly 13 internal traps that can be defined in a Proxy handler dictionary.

### Q2: Why is the receiver argument passed to Reflect.get(target, prop, receiver)?
- A) To encrypt the output
- B) To ensure that any getter functions on target execute with 'this' bound to the Proxy (the receiver) rather than the raw target object
- C) To make property access asynchronous
- D) To prevent memory leaks
**Answer:** B
**Explanation:** Passing `receiver` maintains proper prototype inheritance and ensures that accessor getters evaluate with `this` bound to the proxy wrapper.

### Q3: What happens when code attempts to access a property on a revoked Proxy (created via Proxy.revocable())?
- A) It returns undefined
- B) A TypeError is thrown immediately
- C) It returns null
- D) It calls the garbage collector
**Answer:** B
**Explanation:** Once `revoke()` is called on a revocable proxy, any subsequent operation performed on that proxy throws a `TypeError`.

### Q4: Which Proxy trap intercepts the "in" operator (e.g. 'prop' in obj)?
- A) has(target, prop)
- B) includes(target, prop)
- C) contains(target, prop)
- D) exists(target, prop)
**Answer:** A
**Explanation:** The `has` trap intercepts the `in` operator (e.g. `'title' in book`) and `Reflect.has()`.

### Q5: What modern frontend framework uses JavaScript Proxies as the core foundation of its fine-grained reactivity system?
- A) jQuery
- B) Vue.js 3
- C) React 15
- D) Backbone.js
**Answer:** B
**Explanation:** Vue 3 replaced `Object.defineProperty` with native JavaScript `Proxy` objects to power its reactive state observation engine.
