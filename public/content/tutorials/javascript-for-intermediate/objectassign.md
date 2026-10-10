# Object.assign() in Modern JavaScript

`Object.assign()` copies all enumerable own properties from one or more source objects to a target object. It returns the modified target object. Prior to the ES2018 object spread operator, `Object.assign()` was the primary mechanism for object cloning and merging.

---

## 1. Syntax and Core Mechanics

```javascript
Object.assign(target, ...sources);
```

- **`target`**: The target object to receive properties. **This object is mutated in-place!**
- **`...sources`**: One or more source objects containing properties to copy.
- **Return Value**: The mutated target object.

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };

const returnedTarget = Object.assign(target, source);

console.log(target);         // { a: 1, b: 2, c: 3 } (Mutated!)
console.log(returnedTarget === target); // true (Same object reference!)
```

---

## 2. Non-Mutating Cloning & Merging

To avoid mutating existing objects, always pass an empty object `{}` as the first argument (`target`):

```javascript
const defaultSettings = {
  theme: 'light',
  fontSize: 14,
  notifications: true
};

const userCustomizations = {
  theme: 'dark',
  fontSize: 16
};

// Merging safely into a new object:
const appConfig = Object.assign({}, defaultSettings, userCustomizations);

console.log(appConfig);
// { theme: 'dark', fontSize: 16, notifications: true }
console.log(defaultSettings.theme); // 'light' (Untouched!)
```

```
           Source 1: defaultSettings ────┐
                                         ├──► Target: {} ──► Resulting Config
           Source 2: userCustomizations ─┘
```

---

## 3. Precedence and Overwriting Order

Properties are copied from left to right. Later sources overwrite earlier sources if keys collide:

```javascript
const o1 = { x: 1, y: 1 };
const o2 = { y: 2, z: 2 };
const o3 = { z: 3 };

const merged = Object.assign({}, o1, o2, o3);
console.log(merged); // { x: 1, y: 2, z: 3 }
```

---

## 4. Object.assign() vs. Object Spread Operator ({ ...obj })

Both achieve shallow cloning and property merging, but there are important nuances:

| Feature | `Object.assign(target, source)` | Object Spread `{ ...source }` |
| :--- | :--- | :--- |
| **In-place Mutation** | Can mutate target directly (`Object.assign(existing, source)`) | Always creates a brand-new object |
| **Setters Triggered** | Invokes setters on the target object | Does not trigger setters on target (defines own properties) |
| **Readability** | Functional method call | Compact, idiomatic modern syntax |
| **Prototypes** | Does not copy prototype chain | Does not copy prototype chain |

```javascript
// Functional equivalent of Object.assign({}, a, b):
const mergedViaSpread = { ...defaultSettings, ...userCustomizations };
```

---

## 5. Important Limitation: Shallow Copying Only

Like the spread operator, `Object.assign()` does not perform deep copies:

```javascript
const base = { config: { debug: true } };
const clone = Object.assign({}, base);

clone.config.debug = false;
console.log(base.config.debug); // false! Both share the same nested config reference.
```

---

## Practice Quiz

### Q1: What does Object.assign(target, source) do to the target object?
- A) It freezes target to prevent modifications
- B) It mutates target directly by copying source properties into it
- C) It creates a deep copy and deletes target
- D) It leaves target untouched and returns a Symbol
**Answer:** B
**Explanation:** `Object.assign()` directly mutates the first argument (`target`) by assigning source properties to it and returning it.

### Q2: How can you use Object.assign() to clone an object without mutating the original?
- A) Object.assign(original)
- B) Object.assign({}, original)
- C) Object.assign(null, original)
- D) Object.assign(true, original)
**Answer:** B
**Explanation:** Providing a fresh empty object `{}` as the first argument ensures properties are copied into a new object without mutating `original`.

### Q3: If sourceA has { timeout: 1000 } and sourceB has { timeout: 5000 }, what is the timeout value in Object.assign({}, sourceA, sourceB)?
- A) 1000
- B) 5000
- C) [1000, 5000]
- D) undefined
**Answer:** B
**Explanation:** Properties from subsequent source objects overwrite existing keys from earlier objects from left to right.

### Q4: Does Object.assign() perform a deep copy of nested objects?
- A) Yes, up to 10 levels deep
- B) No, it performs only a shallow copy
- C) Yes, if the target is {}
- D) Only in Node.js environments
**Answer:** B
**Explanation:** `Object.assign()` only copies top-level properties; nested object references are copied as references.

### Q5: What is the modern syntactic equivalent of Object.assign({}, objA, objB)?
- A) objA + objB
- B) { ...objA, ...objB }
- C) [objA, objB]
- D) Object.merge(objA, objB)
**Answer:** B
**Explanation:** The object spread syntax `{ ...objA, ...objB }` provides a concise and declarative equivalent for creating a new merged object.
