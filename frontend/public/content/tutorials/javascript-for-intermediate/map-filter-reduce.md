# map, filter, reduce in Modern JavaScript

Functional array processing is one of the most transformative paradigms in modern JavaScript. Rather than writing imperative `for` loops with mutating variables, `map`, `filter`, and `reduce` express data transformations declaratively, producing cleaner, bug-free, and highly testable code.

---

## 1. Array.prototype.map()

`map()` creates a **new array** populated with the results of calling a provided function on every element in the calling array. It **never mutates** the original array and always maintains a 1:1 length ratio.

```
Input Array:   [ 10,  20,  30 ]
Transformation:      (x * 2)
Output Array:  [ 20,  40,  60 ]
```

```javascript
const products = [
  { id: 1, name: 'Mechanical Keyboard', price: 120 },
  { id: 2, name: 'Ergonomic Mouse', price: 85 },
  { id: 3, name: 'UltraWide Monitor', price: 450 }
];

// Extract just product names and discounted prices
const discountedProducts = products.map(product => ({
  id: product.id,
  name: product.name,
  discountedPrice: product.price * 0.9
}));

console.log(discountedProducts);
```

---

## 2. Array.prototype.filter()

`filter()` creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test implemented by the provided callback function (evaluates to truthy).

```
Input Array:   [ 120,  85,  450 ]
Predicate:          (price < 100)
Output Array:  [  85 ]
```

```javascript
const transactions = [
  { id: 'tx_1', amount: 250, status: 'completed' },
  { id: 'tx_2', amount: 1200, status: 'pending' },
  { id: 'tx_3', amount: 75, status: 'completed' },
  { id: 'tx_4', amount: 540, status: 'failed' }
];

// Keep only completed transactions
const completedTx = transactions.filter(tx => tx.status === 'completed');
console.log(`Found ${completedTx.length} completed transactions.`);
```

---

## 3. Array.prototype.reduce()

`reduce()` executes a user-supplied "reducer" callback function on each element of the array, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements is a **single value** (number, string, object, or aggregated array).

```
Syntax: array.reduce((accumulator, currentValue, currentIndex, array) => { ... }, initialValue)
```

```
Accumulator: [ 0 ] + 250 -> [ 250 ] + 75 -> [ 325 ] (Final Total)
```

### Computing Aggregates (Sum)

```javascript
const totalCompletedRevenue = completedTx.reduce((acc, tx) => acc + tx.amount, 0);
console.log(`Total Revenue: $${totalCompletedRevenue}`);
```

### Grouping Data with reduce()

```javascript
const inventory = [
  { name: 'Apples', category: 'Fruit' },
  { name: 'Carrots', category: 'Vegetable' },
  { name: 'Bananas', category: 'Fruit' },
  { name: 'Broccoli', category: 'Vegetable' }
];

const groupedByCategory = inventory.reduce((acc, item) => {
  const cat = item.category;
  if (!acc[cat]) {
    acc[cat] = [];
  }
  acc[cat].push(item.name);
  return acc;
}, {});

console.log(groupedByCategory);
// {
//   Fruit: ['Apples', 'Bananas'],
//   Vegetable: ['Carrots', 'Broccoli']
// }
```

---

## 4. Method Chaining: The Declarative Pipeline

Because `map` and `filter` return new arrays, you can chain them into functional data pipelines:

```javascript
const orders = [
  { customer: 'Alice', items: 3, total: 150, refunded: false },
  { customer: 'Bob', items: 1, total: 40, refunded: true },
  { customer: 'Charlie', items: 5, total: 320, refunded: false }
];

const averageValidOrderSize = orders
  .filter(order => !order.refunded)
  .map(order => order.total)
  .reduce((sum, total, _, arr) => sum + (total / arr.length), 0);

console.log(`Average Order: $${averageValidOrderSize.toFixed(2)}`);
```

---

## Practice Quiz

### Q1: What will Array.prototype.map() return if the original array has 5 elements?
- A) A single aggregated number
- B) A new array with exactly 5 elements
- C) An array with 0 to 5 elements depending on condition
- D) The original array modified in-place
**Answer:** B
**Explanation:** `map()` always returns a brand-new array with the exact same length as the source array, transforming each element.

### Q2: What happens if you omit the initialValue parameter in Array.prototype.reduce()?
- A) reduce() throws a SyntaxError
- B) The accumulator defaults to 0
- C) The accumulator takes the first array element as its initial value and iteration starts at index 1
- D) The accumulator defaults to undefined
**Answer:** C
**Explanation:** If no `initialValue` is supplied, the first element of the array is used as the initial accumulator, and iteration begins at index 1.

### Q3: Which method should you choose to remove invalid or falsy elements from an array?
- A) .map()
- B) .filter()
- C) .forEach()
- D) .slice()
**Answer:** B
**Explanation:** `filter()` evaluates each element against a predicate function and retains only those for which the callback returns truthy.

### Q4: What does the code [1, 2, 3, 4].filter(x => x % 2 === 0).map(x => x * 10) return?
- A) [10, 20, 30, 40]
- B) [20, 40]
- C) [2, 4]
- D) [60]
**Answer:** B
**Explanation:** `filter` keeps even numbers `[2, 4]`, and `map` multiplies each by 10, resulting in `[20, 40]`.

### Q5: Can reduce() return a complex object or array instead of a primitive number?
- A) No, reduce can only output numbers or strings
- B) Yes, by supplying an initial object `{}` or array `[]` as the initialValue
- C) Yes, but only in strict mode
- D) No, you must use Object.assign() instead
**Answer:** B
**Explanation:** `reduce()` can produce any data structure (objects, arrays, Maps, sets) by passing an appropriate initial value (e.g. `{}` or `[]`).
