# Comparison Operators: Strict vs. Loose Equality

Comparison operators test the relationship between two values and return a Boolean (`true` or `false`). Master the difference between **loose equality (`==`)** and **strict equality (`===`)** to eliminate subtle bugs.

---

## 1. Overview of Comparison Operators

| Operator | Meaning | Example | Result |
|:---:|---|---|:---:|
| **`===`** | Strict Equality (Same value AND same type) | `5 === 5` | `true` |
| **`!==`** | Strict Inequality (Different value OR different type) | `5 !== "5"` | `true` |
| **`==`** | Loose Equality (Type coerces before comparison) | `5 == "5"` | `true` (Caution!) |
| **`!=`** | Loose Inequality (Type coerces before comparison) | `5 != "5"` | `false` |
| **`>`** | Greater Than | `10 > 5` | `true` |
| **`<`** | Less Than | `3 < 7` | `true` |
| **`>=`** | Greater Than or Equal To | `10 >= 10` | `true` |
| **`<=`** | Less Than or Equal To | `4 <= 9` | `true` |

---

## 2. Strict Equality (`===`) vs. Loose Equality (`==`)

### The Trap of Loose Equality (`==`):
When using `==`, JavaScript uses complex implicit type conversion (coercion) before comparing:
```javascript
console.log(5 == "5");         // true (String "5" converted to number 5)
console.log(0 == false);       // true (false converted to 0)
console.log("" == false);      // true (empty string converted to 0)
console.log(null == undefined);// true (special specification rule)
console.log([] == 0);          // true (empty array coerced to empty string, then 0!)
```

### The Safety of Strict Equality (`===`):
Strict equality **never** coerces types. If the types differ, it immediately returns `false`:
```javascript
console.log(5 === "5");         // false (Number vs String)
console.log(0 === false);       // false (Number vs Boolean)
console.log("" === false);      // false (String vs Boolean)
console.log(null === undefined);// false (Null vs Undefined)
```

> [!IMPORTANT]
> **Universal Professional Rule**: **ALWAYS use `===` and `!==`.** Never use `==` or `!=`. Every reputable company linter (ESLint, Airbnb, Google) enforces this rule strictly.

---

## 3. Relational Comparisons with Strings

When comparing strings using `>`, `<`, `>=`, `<=`, JavaScript compares character codes alphabetically (lexicographically) using their ASCII/Unicode numerical values:

```javascript
console.log("b" > "a"); // true (Unicode 98 > 97)
console.log("apple" < "banana"); // true ('a' comes before 'b')
console.log("10" < "2"); // true! (Lexicographically, '1' comes before '2'!)
```

> [!WARNING]
> Always parse strings to numbers with `Number()` or `parseInt()` before performing mathematical range comparisons!

---

## 4. Comparing Objects and Arrays

Remember: Objects and Arrays are compared by **memory reference**, NOT by internal contents!

```javascript
const listA = [1, 2, 3];
const listB = [1, 2, 3];

console.log(listA === listB); // false! (They reside at different memory addresses in heap!)

const listC = listA;
console.log(listA === listC); // true! (They share the exact same memory reference!)
```

---

## Practice Quiz

### Q1: What does strict equality (`===`) check in JavaScript?
- A) Checks if two variables have the same name
- B) Checks if both the value AND the data type are identical without performing type coercion
- C) Checks if the computer has enough memory
- D) Checks if values were defined in the same file
**Answer:** B
**Explanation:** Strict equality (`===`) checks both identity of type and equality of value, never converting types automatically.

### Q2: What is the result of `0 == false` vs `0 === false`?
- A) `true` and `true`
- B) `true` and `false`
- C) `false` and `true`
- D) `false` and `false`
**Answer:** B
**Explanation:** With loose equality `==`, `false` is coerced to number `0`, giving `true`. With strict equality `===`, a number and a boolean have different types, giving `false`.

### Q3: Why does `[10] === [10]` evaluate to `false`?
- A) The numbers are formatted differently
- B) Arrays are reference types; two separately defined array literals occupy different memory locations in the heap
- C) Arrays cannot be compared in JavaScript
- D) Bracket notation is invalid
**Answer:** B
**Explanation:** In JavaScript, non-primitive reference types (objects, arrays, functions) are compared by their memory reference pointers, not structural contents.

### Q4: Which operator checks whether value $A$ is NOT strictly equal to value $B$?
- A) `<>`
- B) `!==`
- C) `!=`
- D) `=!`
**Answer:** B
**Explanation:** `!==` is the strict inequality operator, returning true if operands are either of different types or different values.

### Q5: What is the output of `"100" > "20"`?
- A) `true`
- B) `false` (lexicographical string comparison compares '1' with '2')
- C) `NaN`
- D) `TypeError`
**Answer:** B
**Explanation:** Because both operands are strings, JavaScript compares characters alphabetically. The character `'1'` (ASCII 49) is less than `'2'` (ASCII 50), so `"100" > "20"` returns `false`.
