# Deep Copy vs Shallow Copy in Modern JavaScript

In JavaScript, primitive values (numbers, strings, booleans, symbols, null, undefined) are copied by value, whereas objects (including arrays, functions, and plain objects) are referenced by memory address. Misunderstanding the boundary between shallow copies and deep copies is one of the most frequent causes of state mutation bugs.

---

## 1. References vs. Copies

```javascript
const userA = { name: 'Alice', score: 95 };
const userB = userA; // COPIES REFERENCE ONLY!

userB.score = 100;
console.log(userA.score); // 100! userA was mutated!
```

```
Variable Reference:
  userA ───┐
           ▼
     [ { name: 'Alice', score: 100 } in Heap Memory ]
           ▲
  userB ───┘
```

---

## 2. Shallow Copy: Methods and Limitations

A **shallow copy** creates a new outer object or array, but any nested objects or arrays inside it are still shared references.

### Methods for Shallow Copying
1. **Object Spread Operator:** `{ ...source }`
2. **Array Spread Operator:** `[ ...sourceArray ]`
3. **Object.assign():** `Object.assign({}, source)`
4. **Array.prototype.slice():** `sourceArray.slice()`

```javascript
const original = {
  title: 'Mastering JavaScript',
  author: { name: 'Sarah', country: 'Canada' } // Nested Object
};

// Shallow copy
const copy = { ...original };

copy.title = 'Advanced JavaScript'; // Safe! Only copy.title changes.
copy.author.country = 'Germany';    // DANGER! Mutates BOTH original and copy!

console.log(original.author.country); // 'Germany' (Shared reference!)
```

```
Shallow Copy Memory Map:
  original ──► [ Object 1: title: 'Mastering JS' ] ──┐
                                                     ▼
                                            [ Nested author object ]
                                                     ▲
  copy     ──► [ Object 2: title: 'Advanced JS'  ] ──┘
```

---

## 3. Deep Copying: Modern structuredClone()

A **deep copy** recursively duplicates every level of nested objects and arrays, ensuring complete isolation in memory.

### The Modern Standard: structuredClone()
Introduced natively in modern JavaScript (Node.js 17+ and all modern browsers):

```javascript
const order = {
  id: 'ORD-9812',
  items: [{ sku: 'KB-01', qty: 2 }],
  createdAt: new Date()
};

// TRUE DEEP COPY:
const deepClonedOrder = structuredClone(order);

deepClonedOrder.items[0].qty = 5;
console.log(order.items[0].qty); // 2! Original is completely untouched!
console.log(deepClonedOrder.createdAt instanceof Date); // true! Preserves Date objects!
```

### Features of structuredClone():
- Handles nested objects and arrays to any depth.
- Supports cyclic references (objects referencing themselves).
- Preserves `Date`, `RegExp`, `Map`, `Set`, and `ArrayBuffer` instances.
- *Limitation:* Does **not** clone functions or DOM nodes (throws `DataCloneError`).

---

## 4. The Legacy JSON Hack (and its gotchas)

```javascript
const legacyCopy = JSON.parse(JSON.stringify(original));
```

### Critical Pitfalls of JSON.parse(JSON.stringify()):
- Discards functions and methods.
- Converts `Date` objects into ISO strings.
- Converts `NaN` and `Infinity` to `null`.
- Throws errors on circular references.
- Strips `undefined` values and `Symbol` keys.

---

## 5. Summary Cheat Sheet

| Technique | Copy Depth | Preserves Dates/RegExp? | Handles Circular Refs? | Clones Functions? |
| :--- | :--- | :--- | :--- | :--- |
| `Object.assign({}, obj)` | Shallow | Yes (references) | N/A | Copies reference |
| `{ ...obj }` | Shallow | Yes (references) | N/A | Copies reference |
| `JSON.parse(JSON.stringify())` | Deep | No (converts to string) | Throws Error | Drops functions |
| `structuredClone(obj)` | Deep | Yes | Yes | Throws Error |

---

## Practice Quiz

### Q1: What happens when you modify a nested object property inside a shallow copy created with {...original}?
- A) It throws a ReferenceError
- B) It mutates the nested property in both the copy and the original object
- C) It updates the copy only
- D) It automatically triggers structuredClone
**Answer:** B
**Explanation:** A shallow copy only creates a new container at the top level; nested objects remain shared references in memory.

### Q2: What native modern JavaScript API provides true deep cloning out of the box?
- A) Object.deepClone()
- B) structuredClone()
- C) clone()
- D) Reflect.deepCopy()
**Answer:** B
**Explanation:** `structuredClone()` is the native browser and Node.js standard for performing deep copies of complex objects.

### Q3: What is a major limitation of using JSON.parse(JSON.stringify(obj)) to clone objects?
- A) It runs synchronously
- B) It loses Date types (converting them to strings), ignores undefined/functions, and crashes on circular references
- C) It cannot copy numbers
- D) It only works in Google Chrome
**Answer:** B
**Explanation:** The JSON serialization trick drops functions, converts Dates to strings, and throws a TypeError if circular references exist.

### Q4: Which of the following creates a shallow copy of an array?
- A) const copy = array;
- B) const copy = [...array];
- C) const copy = array.push();
- D) const copy = Object.keys(array);
**Answer:** B
**Explanation:** The spread operator `[...array]` creates a new array containing shallow copies of the items from `array`.

### Q5: What error occurs if you pass an object containing a function to structuredClone()?
- A) TypeError: Function cannot be called
- B) DataCloneError
- C) SyntaxError
- D) Warning: undefined returned
**Answer:** B
**Explanation:** `structuredClone()` throws a `DOMException` of type `DataCloneError` when attempting to clone non-serializable objects like functions or DOM nodes.
