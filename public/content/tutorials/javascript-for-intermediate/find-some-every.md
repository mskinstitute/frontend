# find, some, every in Modern JavaScript

While `filter()` scans an entire array and returns all matching elements in a new list, modern JavaScript provides specialized iteration methods—`find()`, `findIndex()`, `some()`, and `every()`—designed for targeted search and predicate evaluation with built-in early exit (short-circuiting).

---

## 1. Array.prototype.find() & findIndex()

### find()
Returns the **first element** that satisfies the testing function. If no match is found, it returns `undefined`. Iteration stops immediately upon the first match!

```javascript
const users = [
  { id: 101, username: 'dev_sarah', role: 'admin' },
  { id: 102, username: 'coder_mike', role: 'editor' },
  { id: 103, username: 'jordan_ux', role: 'admin' }
];

const firstAdmin = users.find(user => user.role === 'admin');
console.log(firstAdmin); // { id: 101, username: 'dev_sarah', role: 'admin' }

const nonExistent = users.find(user => user.id === 999);
console.log(nonExistent); // undefined
```

### findIndex()
Returns the index of the first matching element, or `-1` if not found.

```javascript
const itemIndex = users.findIndex(user => user.id === 102);
if (itemIndex !== -1) {
  users.splice(itemIndex, 1); // Efficient deletion
}
```

---

## 2. Array.prototype.some()

`some()` tests whether **at least one element** in the array passes the provided test function. It returns a boolean (`true` or `false`) and **short-circuits immediately** upon finding the first match.

```
[ false, false, TRUE, ...rest skipped! ]  ===>  Returns true
```

```javascript
const cart = [
  { item: 'Laptop', price: 999, outOfStock: false },
  { item: 'Mouse Pad', price: 15, outOfStock: true },
  { item: 'Monitor', price: 300, outOfStock: false }
];

// Check if any item cannot be fulfilled
const hasOutOfStockItems = cart.some(product => product.outOfStock);

if (hasOutOfStockItems) {
  console.warn('Cannot proceed: Some items in your cart are currently out of stock.');
}
```

---

## 3. Array.prototype.every()

`every()` tests whether **all elements** in the array pass the provided test function. It returns `true` only if every element satisfies the condition. It **short-circuits immediately to `false`** the moment a single failing element is encountered.

```
[ true, true, FALSE, ...rest skipped! ]  ===>  Returns false
```

```javascript
const uploadedFiles = [
  { name: 'doc1.pdf', sizeMb: 2.1, type: 'application/pdf' },
  { name: 'report.pdf', sizeMb: 4.8, type: 'application/pdf' },
  { name: 'archive.zip', sizeMb: 45.0, type: 'application/zip' }
];

// Validate that ALL files are PDFs under 10MB
const isValidBatch = uploadedFiles.every(file => 
  file.type === 'application/pdf' && file.sizeMb <= 10.0
);

console.log('Batch valid for upload:', isValidBatch); // false (archive.zip fails)
```

---

## 4. Comparison & Performance Matrix

| Method | Return Type | Short-Circuits On | Use Case |
| :--- | :--- | :--- | :--- |
| `find()` | Element or `undefined` | First `true` match | Retrieving a specific object by unique key/ID |
| `findIndex()` | Number (`-1` to `N-1`) | First `true` match | Locating index for updates or deletion |
| `some()` | Boolean (`true`/`false`)| First `true` match | Checking for flags, permissions, or warnings |
| `every()` | Boolean (`true`/`false`)| First `false` match | Comprehensive validation checks across datasets |

---

## Practice Quiz

### Q1: What does Array.prototype.find() return if no element in the array satisfies the test condition?
- A) null
- B) -1
- C) undefined
- D) An empty array []
**Answer:** C
**Explanation:** When no elements satisfy the provided callback test, `find()` returns `undefined`.

### Q2: What is the primary performance advantage of some() and every() over filter()?
- A) They run in a multi-threaded web worker
- B) They short-circuit and stop iterating as soon as the outcome is guaranteed
- C) They mutate the array in-place without memory allocation
- D) They bypass the JavaScript Event Loop
**Answer:** B
**Explanation:** `some()` stops iterating as soon as a single match is found, and `every()` stops as soon as a single failure is encountered, avoiding unnecessary scans.

### Q3: What does [10, 20, 30].some(x => x > 25) evaluate to?
- A) true
- B) false
- C) 30
- D) [30]
**Answer:** A
**Explanation:** Because 30 is greater than 25, `some()` finds at least one true value and immediately returns `true`.

### Q4: What does an empty array [].every(x => x > 10) return?
- A) false
- B) undefined
- C) true (vacuous truth)
- D) TypeError
**Answer:** C
**Explanation:** In mathematics and JavaScript, `every()` on an empty array returns `true` for any condition (vacuous truth), because no element violates the condition.

### Q5: What does users.findIndex(u => u.id === 500) return if no user has id 500?
- A) undefined
- B) null
- C) -1
- D) 0
**Answer:** C
**Explanation:** `findIndex()` returns `-1` when no element satisfies the predicate function.
