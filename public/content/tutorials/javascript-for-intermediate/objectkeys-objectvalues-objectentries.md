# Object.keys, Object.values, Object.entries in Modern JavaScript

Iterating over and introspecting objects has evolved significantly from the error-prone `for...in` loops of early JavaScript. Modern standards provide static methods on `Object` that return standard arrays of an object's enumerable own properties, integrating seamlessly with array methods like `.map()`, `.filter()`, and `.forEach()`.

---

## 1. Object.keys()

`Object.keys(obj)` returns an array of a given object's own enumerable **property names (keys)**:

```javascript
const config = {
  theme: 'dark',
  version: '2.4.0',
  autoSave: true
};

const keys = Object.keys(config);
console.log(keys); // ['theme', 'version', 'autoSave']

// Checking if an object is empty
const isEmpty = Object.keys(config).length === 0;
```

---

## 2. Object.values()

`Object.values(obj)` returns an array of a given object's own enumerable **property values**:

```javascript
const monthlySales = {
  january: 12000,
  february: 15500,
  march: 18200
};

const revenues = Object.values(monthlySales);
console.log(revenues); // [12000, 15500, 18200]

const quarterTotal = revenues.reduce((sum, val) => sum + val, 0);
console.log('Q1 Revenue:', quarterTotal); // 45700
```

---

## 3. Object.entries()

`Object.entries(obj)` returns an array of a given object's own enumerable string-keyed **[key, value] pairs**:

```javascript
const userRoles = {
  alice: 'Admin',
  bob: 'Editor',
  charlie: 'Viewer'
};

const entries = Object.entries(userRoles);
console.log(entries);
// [
//   ['alice', 'Admin'],
//   ['bob', 'Editor'],
//   ['charlie', 'Viewer']
// ]
```

### Destructuring in Loops with for...of

```javascript
for (const [user, role] of Object.entries(userRoles)) {
  console.log(`User ${user} has role permission: ${role}`);
}
```

---

## 4. Reconstructing Objects with Object.fromEntries()

`Object.fromEntries()` performs the inverse of `Object.entries()`, transforming a list of key-value pairs back into an object. This enables filtering and transforming objects using standard array methods:

```
  Original Object
         │
         ▼
  Object.entries()  ───►  [ [k1, v1], [k2, v2] ]
                                │
                          .filter() / .map()
                                │
         ▲                      ▼
  Object.fromEntries() ◄── [ [k1, newVal1] ]
         │
  Transformed Object
```

```javascript
const inventory = {
  apples: 15,
  oranges: 0,
  bananas: 28,
  peaches: 0
};

// Filter out out-of-stock items (value > 0)
const inStockInventory = Object.fromEntries(
  Object.entries(inventory).filter(([_, count]) => count > 0)
);

console.log(inStockInventory);
// { apples: 15, bananas: 28 }
```

---

## 5. Why Object.keys() is Superior to for...in

```javascript
// AVOID: for...in iterates over inherited prototype properties!
for (const key in obj) {
  if (Object.hasOwn(obj, key)) { // Required boilerplate to prevent prototype leakage
    console.log(key);
  }
}

// PREFERRED: Object.keys() only returns own enumerable properties
Object.keys(obj).forEach(key => console.log(key));
```

---

## Practice Quiz

### Q1: What does Object.keys({ a: 1, b: 2 }) return?
- A) { 'a': 1, 'b': 2 }
- B) ['a', 'b']
- C) [1, 2]
- D) [['a', 1], ['b', 2]]
**Answer:** B
**Explanation:** `Object.keys()` returns an array containing the object's own enumerable string property names (keys).

### Q2: How do you verify if a plain JavaScript object is completely empty ({})?
- A) obj === {}
- B) Object.keys(obj).length === 0
- C) obj.isEmpty()
- D) obj.length === 0
**Answer:** B
**Explanation:** Plain objects do not have a `.length` property, and `obj === {}` checks memory reference equality. Checking `Object.keys(obj).length === 0` is the standard check.

### Q3: Which method is the inverse of Object.entries(), converting [ [key, val], ... ] pairs back into an object?
- A) Object.toObject()
- B) Object.fromEntries()
- C) Object.reconstruct()
- D) Object.parse()
**Answer:** B
**Explanation:** `Object.fromEntries()` transforms an iterable of key-value pairs into a new plain JavaScript object.

### Q4: What does Object.entries({ score: 100 }) return?
- A) ['score', 100]
- B) [['score', 100]]
- C) { key: 'score', value: 100 }
- D) 'score: 100'
**Answer:** B
**Explanation:** `Object.entries()` returns an array of 2-element tuples `[key, value]`, so single-property object yields `[['score', 100]]`.

### Q5: Why is Object.values() preferred over a manual for...in loop with obj[key]?
- A) It returns a standard Array directly, allowing method chaining (.map, .reduce) while ignoring prototype properties
- B) It runs in a GPU thread
- C) for...in does not work in modern browsers
- D) Object.values() sorts the values numerically automatically
**Answer:** A
**Explanation:** `Object.values()` returns an array of own enumerable values directly, eliminating prototype inheritance hazards and enabling immediate chaining with `.filter()` or `.reduce()`.
