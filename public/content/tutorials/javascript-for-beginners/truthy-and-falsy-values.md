# Truthy & Falsy Values in JavaScript

In JavaScript, every single value has an inherent boolean truth value. When any non-boolean value is evaluated in a boolean context (like an `if` condition or logical operator), JavaScript automatically coerces it into either `true` (**truthy**) or `false` (**falsy**).

---

## 1. The Falsy Values in JavaScript

Out of the billions of values possible in JavaScript, there are only **8 falsy values**. Everything else in the entire language is **truthy**!

```
+-----------------------------------------------------------------------------+
|                      THE 8 FALSY VALUES IN JAVASCRIPT                       |
+-----------------------------------------------------------------------------+
| 1. false                  : The boolean literal false                       |
| 2. 0                      : The number zero                                 |
| 3. -0                     : Negative zero                                   |
| 4. 0n                     : BigInt zero                                     |
| 5. "" (or '' or ``)       : Empty string with zero length                   |
| 6. null                   : The null primitive                              |
| 7. undefined              : The undefined primitive                         |
| 8. NaN                    : "Not a Number" invalid arithmetic result        |
+-----------------------------------------------------------------------------+
```

If a value is NOT on this exact list of 8, it is **100% TRUTHY**!

---

## 2. Common Truthy Surprises

Beginners frequently get tripped up by values that seem "empty" or "zero-like" in English, but are completely truthy in JavaScript:

| Value | Truthiness | Why is it Truthy? |
|---|:---:|---|
| **`"0"`** | **Truthy!** | It is a string containing a character (length = 1) |
| **`"false"`** | **Truthy!** | It is a non-empty string |
| **`" "`** (whitespace)| **Truthy!** | Contains space character (length = 1) |
| **`[]`** (Empty Array)| **Truthy!** | All objects and arrays in JS are truthy! |
| **`{}`** (Empty Object)| **Truthy!**| All objects in JS are truthy! |
| **`function(){}`** | **Truthy!** | Functions are objects, always truthy |

### The Empty Array Trap:
```javascript
const items = [];

// ❌ BAD: [] is truthy, so this will ALWAYS execute!
if (items) {
  console.log("Items exist!"); // Runs even when array is empty!
}

// ✅ CORRECT: Check the length!
if (items.length > 0) {
  console.log("Items exist!");
}
```

---

## 3. Explicit Boolean Conversion

You can inspect the truthiness of any value in the console using two methods:

```javascript
// Method 1: Boolean() function
console.log(Boolean(""));     // false
console.log(Boolean("hello"));// true
console.log(Boolean(0));      // false
console.log(Boolean([]));     // true

// Method 2: Double NOT (!!) operator
console.log(!!null);          // false
console.log(!!123);           // true
```

---

## 4. Truthy Values in Conditional Logic

```javascript
function greetUser(username) {
  if (username) {
    console.log(`Welcome back, ${username}!`);
  } else {
    console.log("Welcome, Guest!");
  }
}

greetUser("Sumit"); // "Welcome back, Sumit!"
greetUser("");      // "Welcome, Guest!" (empty string is falsy)
greetUser(null);    // "Welcome, Guest!" (null is falsy)
```

---

## Practice Quiz

### Q1: How many falsy values exist in modern JavaScript?
- A) Only 1 (`false`)
- B) Exactly 8 (`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`)
- C) 50
- D) Infinite
**Answer:** B
**Explanation:** Modern JavaScript has exactly 8 falsy values; any value that is not one of these 8 evaluates to true in a boolean context.

### Q2: What is the truthiness of an empty array `[]` in an `if` condition?
- A) Falsy
- B) Truthy (all arrays and objects in JavaScript are truthy)
- C) `undefined`
- D) `NaN`
**Answer:** B
**Explanation:** All objects and arrays (even empty ones like `[]` or `{}`) evaluate to truthy in JavaScript. To check if an array is empty, check `arr.length === 0`.

### Q3: What does `Boolean("0")` evaluate to?
- A) `false`
- B) `true` (non-empty strings are always truthy)
- C) `0`
- D) `null`
**Answer:** B
**Explanation:** `"0"` is a string of length 1. Only empty strings (`""`) are falsy; all non-empty strings are truthy.

### Q4: Which of the following values is FALSY?
- A) `[]`
- B) `" "` (a single space)
- C) `NaN`
- D) `{}`
**Answer:** C
**Explanation:** `NaN` (Not-a-Number) is one of the 8 falsy values.

### Q5: How do you safely test whether an array named `users` actually has elements in it?
- A) `if (users)`
- B) `if (users.length > 0)`
- C) `if (users === true)`
- D) `if (users.hasItems)`
**Answer:** B
**Explanation:** Because `[]` is truthy, checking `if (users)` always passes. Checking `users.length > 0` correctly verifies that the array contains elements.
