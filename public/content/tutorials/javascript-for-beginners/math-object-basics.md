# Math Object Basics in JavaScript

Unlike `Date` or `Array`, the **`Math`** object in JavaScript is not a constructor (you never call `new Math()`). It is a built-in static object containing mathematical constants and functions for rounding, geometric calculations, and numerical transformations.

---

## 1. Built-in Mathematical Constants

```javascript
console.log(Math.PI); // 3.141592653589793 (Ratio of circumference to diameter)
console.log(Math.E);  // 2.718281828459045 (Euler's constant)
console.log(Math.SQRT2); // 1.4142135623730951 (Square root of 2)
```

---

## 2. Rounding Functions (The Essential Four)

| Method | Behavior | Example | Result |
|---|---|---|:---:|
| **`Math.round(x)`** | Standard rounding (Rounds to nearest integer; 0.5 rounds up) | `Math.round(4.5)` | `5` |
| **`Math.floor(x)`** | Always rounds **DOWN** toward negative infinity | `Math.floor(4.9)` | `4` |
| **`Math.ceil(x)`** | Always rounds **UP** toward positive infinity | `Math.ceil(4.1)` | `5` |
| **`Math.trunc(x)`** | Simply strips the decimal fraction (truncates) | `Math.trunc(-4.9)` | `-4` |

```javascript
// Comparing negative rounding:
console.log(Math.floor(-3.2)); // -4 (Down toward negative infinity)
console.log(Math.trunc(-3.2)); // -3 (Just removes .2)
```

---

## 3. Min, Max, and Absolute Values

### A. `Math.abs(x)`: Absolute (Non-negative) Value
```javascript
console.log(Math.abs(-25)); // 25
console.log(Math.abs(25));  // 25
```

### B. `Math.min()` and `Math.max()`:
Finds the lowest or highest value from a list of arguments:
```javascript
console.log(Math.min(10, 4, 88, 2, 50)); // 2
console.log(Math.max(10, 4, 88, 2, 50)); // 88

// Tip: Use spread operator (...) with Arrays!
const testScores = [84, 92, 78, 99, 65];
console.log(Math.max(...testScores)); // 99
```

---

## 4. Powers and Square Roots

```javascript
// Power (x raised to y):
console.log(Math.pow(3, 4)); // 81 (Equivalent to 3 ** 4)

// Square Root:
console.log(Math.sqrt(64));  // 8

// Cube Root (ES6):
console.log(Math.cbrt(27));  // 3
```

---

## Practice Quiz

### Q1: What is the result of `Math.floor(7.9)`?
- A) 8
- B) 7
- C) 7.5
- D) 0
**Answer:** B
**Explanation:** `Math.floor()` rounds down to the nearest integer, returning 7.

### Q2: What is the result of `Math.ceil(2.1)`?
- A) 2
- B) 3
- C) 2.5
- D) 2.1
**Answer:** B
**Explanation:** `Math.ceil()` rounds up to the next highest integer, returning 3.

### Q3: How do you find the maximum value in an array `[12, 45, 9]` using `Math.max`?
- A) `Math.max([12, 45, 9])`
- B) `Math.max(...[12, 45, 9])`
- C) `[12, 45, 9].max()`
- D) `Math.max.array([12, 45, 9])`
**Answer:** B
**Explanation:** `Math.max()` expects numbers as individual arguments. Using the spread operator (`...`) unpacks the array elements into individual arguments.

### Q4: What does `Math.abs(-42)` return?
- A) `-42`
- B) `42`
- C) `0`
- D) `NaN`
**Answer:** B
**Explanation:** `Math.abs()` returns the absolute value, converting negative numbers to positive and leaving positive numbers unchanged.

### Q5: Can you instantiate the Math object with `new Math()`?
- A) Yes, always
- B) No, `Math` is a static namespace object and cannot be invoked as a constructor
- C) Only in Node.js
- D) Only when calculating logarithms
**Answer:** B
**Explanation:** `Math` has no constructor; all properties and methods are static and called directly on `Math`.
