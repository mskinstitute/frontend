# Common String Methods in JavaScript

JavaScript provides a rich library of built-in methods on strings to search, extract, replace, format, and split text. Because strings are immutable, **all string methods return a new string** without modifying the original.

---

## 1. Case Transformation & Trimming

```javascript
const rawInput = "   sumit sharma   ";

// 1. Convert to Uppercase
console.log(rawInput.toUpperCase()); // "   SUMIT SHARMA   "

// 2. Convert to Lowercase
console.log(rawInput.toLowerCase()); // "   sumit sharma   "

// 3. Trim whitespace from both ends (Essential for form inputs!)
const cleanInput = rawInput.trim();
console.log(cleanInput); // "sumit sharma"

// Trim only start or only end:
console.log(rawInput.trimStart());
console.log(rawInput.trimEnd());
```

---

## 2. Searching in Strings

### A. `.includes()` (ES6)
Checks if a substring exists; returns `true` or `false` (case-sensitive):
```javascript
const email = "student@mskinstitute.com";
console.log(email.includes("@")); // true
console.log(email.includes("yahoo")); // false
```

### B. `.startsWith()` and `.endsWith()` (ES6)
```javascript
const filename = "report_q3_final.pdf";
console.log(filename.startsWith("report")); // true
console.log(filename.endsWith(".pdf"));     // true
```

### C. `.indexOf()` and `.lastIndexOf()`
Returns the starting index of substring, or `-1` if not found:
```javascript
const phrase = "Learn JavaScript at MSK";
console.log(phrase.indexOf("JavaScript")); // 6
console.log(phrase.indexOf("Python"));     // -1
```

---

## 3. Extracting Substrings: `.slice()`

The `.slice(startIndex, endIndex)` method extracts a portion of a string:
- `startIndex`: Index where extraction begins (inclusive).
- `endIndex` (optional): Index where extraction ends (**exclusive**).
- Supports negative indices to count backward from the end!

```javascript
const text = "JavaScript";

console.log(text.slice(0, 4));  // "Java" (indices 0, 1, 2, 3)
console.log(text.slice(4));     // "Script" (from index 4 to the end)
console.log(text.slice(-6));    // "Script" (last 6 characters)
```

---

## 4. Replacing Text: `.replace()` and `.replaceAll()`

```javascript
const message = "JavaScript is slow. JavaScript is hard.";

// .replace() only replaces the FIRST occurrence:
console.log(message.replace("JavaScript", "Python"));
// Output: "Python is slow. JavaScript is hard."

// .replaceAll() (ES2021) replaces ALL occurrences:
console.log(message.replaceAll("JavaScript", "JS"));
// Output: "JS is slow. JS is hard."
```

---

## 5. Splitting Strings into Arrays: `.split()`

`.split(delimiter)` splits a string into an array of substrings based on a separator:

```javascript
// Split by comma:
const tags = "react,javascript,frontend,css";
const tagList = tags.split(",");
console.log(tagList); // ["react", "javascript", "frontend", "css"]

// Split by space (words):
const sentence = "Welcome to MSK Institute";
const words = sentence.split(" ");
console.log(words); // ["Welcome", "to", "MSK", "Institute"]

// Split into individual characters:
const letters = "MSK".split("");
console.log(letters); // ["M", "S", "K"]
```

---

## Practice Quiz

### Q1: What does `str.trim()` do?
- A) Deletes all vowels
- B) Removes leading and trailing whitespace from both ends of a string
- C) Cuts the string in half
- D) Capitalizes every word
**Answer:** B
**Explanation:** `trim()` removes whitespace (spaces, tabs, newlines) from the beginning and end of a string.

### Q2: What is returned by `"Frontend".slice(0, 5)`?
- A) `"Front"`
- B) `"Fronte"`
- C) `"Frontend"`
- D) `"onten"`
**Answer:** A
**Explanation:** `.slice(0, 5)` extracts from index 0 up to (but not including) index 5, capturing indices 0, 1, 2, 3, 4 (`"Front"`).

### Q3: If `str = "apple,banana,orange"`, what does `str.split(",")` return?
- A) `"apple banana orange"`
- B) `["apple", "banana", "orange"]`
- C) `3`
- D) `false`
**Answer:** B
**Explanation:** `.split(",")` splits the string by comma delimiters into an array of string items.

### Q4: What does `"coding".includes("od")` evaluate to?
- A) `true`
- B) `false`
- C) `1`
- D) `undefined`
**Answer:** A
**Explanation:** `.includes()` returns `true` because the exact substring `"od"` exists inside `"coding"`.

### Q5: What is the output of `"hello".indexOf("z")`?
- A) `0`
- B) `false`
- C) `-1`
- D) `null`
**Answer:** C
**Explanation:** When a searched substring is not found in the string, `.indexOf()` returns `-1`.
