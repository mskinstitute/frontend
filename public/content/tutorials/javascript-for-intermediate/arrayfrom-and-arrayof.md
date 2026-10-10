# Array.from & Array.of in Modern JavaScript

ES6 introduced static factory methods on the `Array` constructor—`Array.from()` and `Array.of()`—to resolve long-standing quirks with the legacy `Array()` constructor and simplify conversion of array-like and iterable objects.

---

## 1. The Pitfall of the Array Constructor

The legacy `new Array()` constructor behaves inconsistently depending on the number and type of arguments:

```javascript
new Array(1, 2, 3); // [1, 2, 3] (Creates 3-element array)
new Array(5);       // [ <5 empty slots> ] (Creates sparse array with length 5, NO elements!)
```

This unpredictability caused subtle bugs. ES6 introduced `Array.of()` and `Array.from()` as standard solutions.

---

## 2. Array.of(): Predictable Array Instantiation

`Array.of()` creates a new `Array` instance with a variable number of arguments, regardless of number or type:

```javascript
Array.of(5);          // [5] - Array containing number 5!
Array.of(1, 2, 3, 4); // [1, 2, 3, 4]
Array.of(undefined);  // [undefined]
```

---

## 3. Array.from(): Converting Iterables and Array-Likes

`Array.from()` creates a new, shallow-copied `Array` instance from an **iterable object** (Map, Set, String) or an **array-like object** (an object with a `.length` property and indexed elements, such as DOM NodeLists or `arguments`).

```
  Array-Like or Iterable                Array.from(target, mapFn)
┌─────────────────────────┐                        │
│ NodeList, Set, Map,     │ ───────────────────────┼───► Real JavaScript Array
│ or { length: 5 }        │                        │     with .map, .filter, etc.
└─────────────────────────┘
```

### Converting a Set to an Array (Removing Duplicates)

```javascript
const tags = ['javascript', 'react', 'javascript', 'css', 'react'];
const uniqueTags = Array.from(new Set(tags));
console.log(uniqueTags); // ['javascript', 'react', 'css']
```

### Converting DOM NodeLists

```javascript
const buttonNodes = document.querySelectorAll('button');
const buttons = Array.from(buttonNodes);
// Now you can safely use .filter() or .slice()
```

---

## 4. Built-in Mapping Function

`Array.from()` accepts a second optional parameter: a `mapFn` that executes on every element during conversion. This avoids allocating an intermediate array.

```javascript
// Syntax: Array.from(arrayLike, (element, index) => transformedElement)

const prices = Array.from(
  document.querySelectorAll('.price-tag'),
  el => parseFloat(el.textContent.replace('$', ''))
);
```

### Generating Number Ranges (Range Generator)

```javascript
// Create an array containing numbers 1 through 10
const range1To10 = Array.from({ length: 10 }, (_, index) => index + 1);
console.log(range1To10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Generate alphabet letters A to Z
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
console.log(alphabet); // ['A', 'B', 'C', ..., 'Z']
```

---

## Practice Quiz

### Q1: What is the result of Array.of(4)?
- A) An empty array with length 4: [empty × 4]
- B) An array with one element: [4]
- C) A TypeError
- D) [0, 1, 2, 3]
**Answer:** B
**Explanation:** `Array.of(4)` always creates an array containing the exact elements passed as arguments, so it returns `[4]`.

### Q2: What is the primary difference between Array(3) and Array.of(3)?
- A) Array(3) creates an array with 3 empty slots, whereas Array.of(3) creates [3]
- B) Array.of(3) creates an immutable array
- C) Array(3) is asynchronous
- D) Array.of(3) throws an error if given numbers
**Answer:** A
**Explanation:** `Array(3)` creates a sparse array with length 3 containing empty slots, while `Array.of(3)` creates a single-element array `[3]`.

### Q3: What is the output of Array.from('CODE')?
- A) ['CODE']
- B) ['C', 'O', 'D', 'E']
- C) { 0: 'C', 1: 'O', 2: 'D', 3: 'E' }
- D) 4
**Answer:** B
**Explanation:** Strings are iterable; `Array.from('CODE')` iterates through each character and returns an array of individual letters.

### Q4: How can you generate an array of numbers [0, 1, 2, 3, 4] using Array.from()?
- A) Array.from(5)
- B) Array.from({ length: 5 }, (_, i) => i)
- C) Array.from([5])
- D) Array.from({ count: 5 })
**Answer:** B
**Explanation:** Providing an object with `{ length: 5 }` creates an array-like structure with 5 items, and the mapping callback `(_, i) => i` assigns each index to its value.

### Q5: Why is Array.from(nodeList, mapFn) more efficient than Array.from(nodeList).map(mapFn)?
- A) It runs in a background service worker
- B) It avoids allocating an intermediate array in memory before mapping
- C) It compiles the DOM elements into binary buffers
- D) It bypasses browser security sandboxing
**Answer:** B
**Explanation:** Providing the mapping function directly to `Array.from()` maps items during collection creation, avoiding the overhead of creating and garbage-collecting an intermediate array.
