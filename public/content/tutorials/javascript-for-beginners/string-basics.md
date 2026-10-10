# String Basics in JavaScript

Text is one of the most fundamental data formats in software. In JavaScript, strings represent sequences of UTF-16 character codes. Understanding string indexing, length, and immutability is essential for building web interfaces.

---

## 1. Creating Strings in JavaScript

JavaScript supports three different quotation delimiters for string literals:

```javascript
// 1. Single Quotes
const city = 'New Delhi';

// 2. Double Quotes
const country = "India";

// 3. Backticks (Template Literals - ES6)
const institute = `MSK Institute`;
```

### Escaping Special Characters (`\`):
If a string contains quotation marks inside it, escape them with a backslash `\`:
```javascript
const quote = "She said, \"JavaScript is amazing!\"";
const contraction = 'It\'s a sunny day';
```

### Useful Escape Sequences:
- `\n` : Newline (line break)
- `\t` : Tab indentation
- `\\` : Literal backslash

---

## 2. String Length & Zero-Based Indexing

Strings behave similarly to arrays: characters are indexed starting at **0**:

```
String:   "M   S   K"
Index:     0   1   2
```

```javascript
const school = "MSK Institute";

// Check total character count:
console.log(school.length); // 13 (Includes the space!)

// Accessing individual characters:
console.log(school[0]); // "M" (Bracket notation)
console.log(school.charAt(1)); // "S" (charAt method)

// Getting the last character:
console.log(school[school.length - 1]); // "e"

// Modern ES2022 .at() method (supports negative index!):
console.log(school.at(-1)); // "e" (Last character)
console.log(school.at(-2)); // "t" (Second to last)
```

---

## 3. The Golden Rule: Strings are Immutable!

> [!IMPORTANT]
> **Strings in JavaScript are 100% IMMUTABLE.** Once created in memory, individual characters inside a string **cannot be changed in place**!

```javascript
let str = "Hello";
str[0] = "J"; // Trying to change "H" to "J"

console.log(str); // "Hello"! (Unchanged! JavaScript silently ignores this assignment)
```

### How to "Change" a String:
To change a string, you must create and assign a **brand new string**:
```javascript
let str = "Hello";
str = "J" + str.slice(1);
console.log(str); // "Jello"
```

---

## 4. Iterating Through Strings

Because strings are iterable, you can loop through their characters using a `for` loop or `for...of`:

```javascript
const word = "CODE";

for (const char of word) {
  console.log(char);
}
// Outputs:
// C
// O
// D
// E
```

---

## Practice Quiz

### Q1: What index number represents the very first character of a string in JavaScript?
- A) 1
- B) 0 (zero-based indexing)
- C) -1
- D) Null
**Answer:** B
**Explanation:** JavaScript strings are zero-indexed; the first character is accessed at index `[0]`.

### Q2: What is the result of running `let s = "Hello"; s[0] = "Y"; console.log(s);`?
- A) `"Yello"`
- B) `"Hello"` (strings are immutable and cannot be modified in place)
- C) `TypeError`
- D) `undefined`
**Answer:** B
**Explanation:** Strings in JavaScript are immutable. Modifying an individual character via bracket index fails silently (or throws in strict mode), leaving the string untouched.

### Q3: How do you get the total number of characters in a string named `msg`?
- A) `msg.count()`
- B) `msg.size`
- C) `msg.length`
- D) `len(msg)`
**Answer:** C
**Explanation:** The `.length` property returns the number of UTF-16 code units in the string.

### Q4: Which modern method introduced in ES2022 allows accessing the last character of a string using negative indexing (e.g. `str.at(-1)`)?
- A) `.at()`
- B) `.charAt()`
- C) `.last()`
- D) `.end()`
**Answer:** A
**Explanation:** The `.at()` method supports negative integer indexing, where `-1` returns the last character.

### Q5: What escape sequence inserts a line break (new line) inside a string literal?
- A) `\b`
- B) `\t`
- C) `\n`
- D) `\r`
**Answer:** C
**Explanation:** `\n` represents the newline escape character in JavaScript string literals.
