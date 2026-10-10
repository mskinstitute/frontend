# Object.freeze, Object.seal & Immutability in Modern JavaScript

In state management systems (Redux, Zustand) and security configurations, accidental object mutation causes hard-to-track bugs. Modern JavaScript provides varying levels of object locking: `Object.preventExtensions()`, `Object.seal()`, and `Object.freeze()`.

---

## 1. The Immutability Spectrum

```
           ┌────────────────────────────────────────────────────────┐
           │ Level 1: Object.preventExtensions(obj)                 │
           │   • CANNOT add new properties                          │
           │   • CAN modify existing properties                     │
           │   • CAN delete existing properties                     │
           ├────────────────────────────────────────────────────────┤
           │ Level 2: Object.seal(obj)                              │
           │   • CANNOT add new properties                          │
           │   • CANNOT delete existing properties                  │
           │   • CAN modify existing property values                │
           ├────────────────────────────────────────────────────────┤
           │ Level 3: Object.freeze(obj)                            │
           │   • CANNOT add new properties                          │
           │   • CANNOT delete existing properties                  │
           │   • CANNOT modify existing property values (Read-Only) │
           └────────────────────────────────────────────────────────┘
```

---

## 2. Property Descriptors Explained

Under the hood, these methods configure internal **Property Descriptors**:

```javascript
const user = { name: 'Sarah' };

// Inspect property descriptor
console.log(Object.getOwnPropertyDescriptor(user, 'name'));
// { value: 'Sarah', writable: true, enumerable: true, configurable: true }
```

- **`writable`**: If `false`, value cannot be reassigned.
- **`configurable`**: If `false`, property cannot be deleted and descriptors cannot be modified.
- **`enumerable`**: If `false`, hidden from `for...in` and `Object.keys()`.

```javascript
// Object.freeze() sets:
// 1. Object extensible = false
// 2. All own properties: writable = false, configurable = false
```

---

## 3. Strict Mode Enforcement

In non-strict mode, attempting to mutate a frozen object fails silently. In **strict mode (`'use strict'`)**, it throws a **`TypeError`**:

```javascript
'use strict';

const appConfig = Object.freeze({
  apiEndpoint: 'https://api.example.com',
  timeout: 5000
});

// appConfig.timeout = 10000;
// TypeError: Cannot assign to read only property 'timeout' of object '#<Object>'
```

---

## 4. The Critical Gotcha: Object.freeze is SHALLOW!

`Object.freeze()` only freezes top-level properties. Nested objects remain mutable references!

```javascript
const enterpriseSettings = Object.freeze({
  appName: 'MasterPortal',
  database: {
    host: 'localhost', // NESTED OBJECT!
    port: 5432
  }
});

// DANGER: Nested mutation succeeds!
enterpriseSettings.database.port = 3306; 
console.log(enterpriseSettings.database.port); // 3306!
```

### The Solution: Recursive Deep Freeze Utility

```javascript
function deepFreeze(obj) {
  // Retrieve all own property names
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];
    if (value && typeof value === 'object') {
      deepFreeze(value); // Recursive call
    }
  }

  return Object.freeze(obj);
}

const safeSettings = deepFreeze({
  database: { port: 5432 }
});

// safeSettings.database.port = 3306; // TypeError: Cannot assign to read only property!
```

---

## Practice Quiz

### Q1: What is the primary difference between Object.seal() and Object.freeze()?
- A) Object.seal() allows existing properties to be modified, whereas Object.freeze() makes all existing properties strictly read-only
- B) Object.freeze() allows adding new keys
- C) Object.seal() is asynchronous
- D) There is no difference
**Answer:** A
**Explanation:** `Object.seal()` prevents adding and deleting properties but permits modifying existing property values; `Object.freeze()` prevents modifications, additions, and deletions.

### Q2: What happens when code attempts to mutate a frozen object in strict mode ('use strict')?
- A) It fails silently
- B) It throws a TypeError
- C) It triggers a browser prompt
- D) It creates a clone
**Answer:** B
**Explanation:** In strict mode, modifying read-only properties on a frozen object throws a `TypeError: Cannot assign to read only property`.

### Q3: Does calling Object.freeze(obj) prevent modifications to nested objects (e.g. obj.nested.key = val)?
- A) Yes, Object.freeze is always recursive
- B) No, Object.freeze is shallow; nested object references remain mutable unless deepFreeze is implemented
- C) Only in Node.js
- D) Yes, if the object has fewer than 10 keys
**Answer:** B
**Explanation:** `Object.freeze()` is shallow; inner objects must be frozen recursively to achieve deep immutability.

### Q4: Which method checks whether an object has been sealed?
- A) Object.isSealed(obj)
- B) Object.isLocked(obj)
- C) obj.sealed
- D) Reflect.sealed(obj)
**Answer:** A
**Explanation:** `Object.isSealed(obj)` returns a boolean indicating whether the object is sealed.

### Q5: What property descriptor controls whether a property can be deleted with the delete operator?
- A) writable
- B) configurable
- C) enumerable
- D) extensible
**Answer:** B
**Explanation:** When `configurable: false`, the property cannot be deleted via the `delete` operator and its descriptor attributes cannot be altered.
