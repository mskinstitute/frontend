# Logical Operators & Short-Circuit Evaluation

Logical operators are used to combine multiple boolean conditions and make complex decisions in programs. In JavaScript, logical operators have a powerful feature called **short-circuit evaluation** that allows them to return actual values rather than just booleans.

---

## 1. The Three Core Logical Operators

| Operator | Name | Syntax | Description |
|:---:|---|:---:|---|
| **`&&`** | Logical AND | `A && B` | Returns `true` ONLY if **both** operands are truthy |
| **`||`** | Logical OR | `A || B` | Returns `true` if **at least one** operand is truthy |
| **`!`** | Logical NOT | `!A` | Inverts the boolean truthiness of operand |

---

## 2. Truth Tables

### Logical AND (`&&`):
```javascript
console.log(true && true);   // true
console.log(true && false);  // false
console.log(false && true);  // false
console.log(false && false); // false
```

### Logical OR (`||`):
```javascript
console.log(true || true);   // true
console.log(true || false);  // true
console.log(false || true);  // true
console.log(false || false); // false
```

### Logical NOT (`!`):
```javascript
console.log(!true);  // false
console.log(!false); // true

// Double NOT (!!) - Converts ANY value to its strict boolean equivalent:
console.log(!!"Hello"); // true
console.log(!!0);       // false
console.log(!!null);    // false
```

---

## 3. Short-Circuit Evaluation: How JS Actually Evaluates

In JavaScript, `&&` and `||` do **not** simply return `true` or `false`. They return the **value of the actual operand that decided the outcome**!

### How Logical AND (`&&`) Short-Circuits:
- Evaluates from left to right.
- If it encounters a **falsy** value, it **stops immediately** and returns that falsy value!
- If all values are truthy, it returns the **last** value.

```javascript
console.log("Apple" && "Banana"); // "Banana" (Both truthy, returns last)
console.log(null && "Banana");    // null (Short-circuits on null!)
console.log(0 && "Orange");       // 0 (Short-circuits on 0!)
```

### Practical React & UI Guard Pattern:
```javascript
// Only render user avatar if user is logged in
isLoggedIn && renderAvatar();
```

---

### How Logical OR (`||`) Short-Circuits:
- Evaluates from left to right.
- If it encounters a **truthy** value, it **stops immediately** and returns that truthy value!
- If all values are falsy, it returns the **last** value.

```javascript
console.log("Default" || "Fallback"); // "Default" (First truthy)
console.log("" || "Anonymous");       // "Anonymous" (Empty string is falsy)
console.log(null || undefined || "Guest"); // "Guest"
```

### Practical Default Fallback Pattern:
```javascript
const displayName = inputName || "Guest User";
```

---

## 4. The Modern Nullish Coalescing Operator (`??`) (ES2020)

Notice a flaw with `||`: what if a valid value is `0` or empty string `""`?
```javascript
let score = 0; // Valid game score!
let finalScore = score || 10;
console.log(finalScore); // 10! (Bug! 0 was treated as falsy!)
```

### The Fix: Nullish Coalescing (`??`)
`??` checks **strictly for `null` or `undefined`**, treating `0` and `""` as valid truthy values!
```javascript
let score = 0;
let finalScore = score ?? 10;
console.log(finalScore); // 0! (Preserves 0 perfectly!)
```

---

## Practice Quiz

### Q1: What does the expression `true && false` evaluate to?
- A) `true`
- B) `false`
- C) `null`
- D) `undefined`
**Answer:** B
**Explanation:** The Logical AND (`&&`) operator requires both operands to be truthy to return true.

### Q2: What is the output of `"Hello" && "World"` in JavaScript?
- A) `true`
- B) `"World"`
- C) `"Hello"`
- D) `false`
**Answer:** B
**Explanation:** With `&&`, if the first operand is truthy, execution continues and returns the second operand (`"World"`).

### Q3: What is the output of `"" || "Default Name"`?
- A) `""`
- B) `"Default Name"`
- C) `true`
- D) `false`
**Answer:** B
**Explanation:** An empty string `""` is falsy. Logical OR (`||`) moves past the falsy value and returns the truthy alternative `"Default Name"`.

### Q4: How does the Nullish Coalescing operator (`??`) differ from the Logical OR operator (`||`)?
- A) `??` only falls back if the left-hand side is `null` or `undefined`, preserving valid values like `0` and `false`
- B) `??` only works with numbers
- C) `??` converts text to uppercase
- D) There is no difference
**Answer:** A
**Explanation:** `||` falls back on any falsy value (`0`, `""`, `false`, `null`, `undefined`), while `??` only falls back on nullish values (`null` and `undefined`).

### Q5: What does the double exclamation mark (`!!`) do when prefixed before a variable (e.g. `!!user`)?
- A) Throws a syntax error
- B) Explicitly casts any value to its corresponding boolean (`true` or `false`)
- C) Compares the variable to zero
- D) Deletes the variable
**Answer:** B
**Explanation:** `!` inverts the truthiness to a boolean, and the second `!` inverts it back, safely casting any value into its boolean equivalent.
