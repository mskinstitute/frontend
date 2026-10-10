# Iterating over Arrays and Objects in JavaScript

Iterating (looping) through data collections is one of the most frequent tasks in frontend and backend engineering. Modern JavaScript provides specialized iteration constructs tailored specifically for arrays and objects.

---

## 1. Iterating Over Arrays

### A. The Modern `for...of` Loop (Recommended for Values)
Iterates directly over the **values** of any iterable (Arrays, Strings, Sets):
```javascript
const colors = ["Red", "Green", "Blue"];

for (const color of colors) {
  console.log(color);
}
// "Red", "Green", "Blue"
```

### B. The Array `.forEach()` Method
Functional iteration taking a callback:
```javascript
colors.forEach((color, index) => {
  console.log(`Index ${index}: ${color}`);
});
```

---

## 2. Iterating Over Objects: The Holy Trinity of Static Methods

Because objects are not directly iterable with `for...of`, modern JavaScript provides three static methods on `Object`:

```
const course = { title: "Next.js", price: 499, level: "Advanced" };

Object.keys(course)    --> ["title", "price", "level"]          (Array of keys)
Object.values(course)  --> ["Next.js", 499, "Advanced"]        (Array of values)
Object.entries(course) --> [["title", "Next.js"], ["price", 499], ["level", "Advanced"]]
```

### 1. `Object.keys()`: Looping through keys
```javascript
for (const key of Object.keys(course)) {
  console.log(`Key: ${key}, Value: ${course[key]}`);
}
```

### 2. `Object.values()`: Looping through values directly
```javascript
for (const val of Object.values(course)) {
  console.log(`Value: ${val}`);
}
```

### 3. `Object.entries()` with Array Destructuring (Most Elegant!):
```javascript
for (const [key, value] of Object.entries(course)) {
  console.log(`${key.toUpperCase()}: ${value}`);
}
// TITLE: Next.js
// PRICE: 499
// LEVEL: Advanced
```

---

## 3. The `for...in` Loop (Object Keys & Caution)

The `for...in` loop iterates over all enumerable property keys of an object:

```javascript
const car = { make: "Toyota", model: "Corolla", year: 2024 };

for (const key in car) {
  console.log(`${key}: ${car[key]}`);
}
```

> [!WARNING]
> **Avoid using `for...in` on Arrays!**
> `for...in` iterates over property names (as strings, like `"0"`, `"1"`), does not guarantee numerical order, and can traverse prototype chain properties. For arrays, always use `for...of` or standard `for` loops!

---

## 4. Summary Matrix: Which Loop Should You Use?

| Data Structure | Best Modern Choice | Alternative |
|---|---|---|
| **Array** | `for...of` or `.forEach()` | Standard `for (let i = 0; ...)` |
| **Object** | `Object.entries()` with `for...of` | `Object.keys()` or `for...in` |
| **String** | `for...of` | Standard `for` loop |

---

## Practice Quiz

### Q1: Which loop syntax directly iterates over the elements/values of an array without needing an index counter?
- A) `for...in`
- B) `for...of`
- C) `while...true`
- D) `loop...each`
**Answer:** B
**Explanation:** `for (const item of array)` directly yields each value in the iterable array cleanly and concisely.

### Q2: What does `Object.entries(user)` return?
- A) A string of all keys
- B) An array of `[key, value]` pairs for all own enumerable properties of `user`
- C) A boolean
- D) The count of properties
**Answer:** B
**Explanation:** `Object.entries()` transforms an object into an array of two-element `[key, value]` sub-arrays.

### Q3: Why should you avoid using `for...in` to iterate through arrays?
- A) It is not supported in Chrome
- B) It iterates over property keys as strings, does not guarantee index order, and may traverse prototype properties
- C) It deletes the array
- D) It only works on even indices
**Answer:** B
**Explanation:** `for...in` is designed for inspecting object properties; using it on arrays can introduce ordering bugs and string index coercion.

### Q4: What does `Object.keys({ a: 1, b: 2 })` return?
- A) `[1, 2]`
- B) `["a", "b"]`
- C) `{ a: true, b: true }`
- D) `2`
**Answer:** B
**Explanation:** `Object.keys()` returns an array containing only the property names (keys) as strings.

### Q5: Can you break out of an `array.forEach()` loop using the `break` keyword?
- A) Yes, `break` works everywhere
- B) No, `break` is not valid inside a callback function; use a standard `for` or `for...of` loop if early termination is needed
- C) Only with a label
- D) Only in strict mode
**Answer:** B
**Explanation:** `forEach()` executes a callback for every element; it cannot be interrupted with `break` or `continue`.
