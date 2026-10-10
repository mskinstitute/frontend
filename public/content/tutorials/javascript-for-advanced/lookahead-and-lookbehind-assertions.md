# Lookahead & Lookbehind Assertions in Modern JavaScript

Regular expressions are central to input validation and string manipulation. Advanced pattern matching often requires verifying what precedes or follows a pattern **without actually including those characters in the matched result**. These zero-width assertions are known as **Lookahead** and **Lookbehind** assertions.

---

## 1. The 4 Lookaround Assertions

| Type | Syntax | Meaning | Example Match |
| :--- | :--- | :--- | :--- |
| **Positive Lookahead** | `X(?=Y)` | Match `X` only if followed immediately by `Y` | `/\d+(?=px)/` matches `400` in `"400px"` |
| **Negative Lookahead** | `X(?!Y)` | Match `X` only if NOT followed by `Y` | `/\d+(?!px)/` matches `400` in `"400kg"` |
| **Positive Lookbehind** | `(?<=Y)X` | Match `X` only if preceded immediately by `Y` | `/(?<=\$)\d+/` matches `50` in `"$50"` |
| **Negative Lookbehind** | `(?<!Y)X` | Match `X` only if NOT preceded by `Y` | `/(?<!\$)\d+/` matches `50` in `"€50"` |

> **Zero-Width Guarantee:** Lookarounds are zero-width: they test conditions in the text, but **do not consume or include the matched lookaround characters** in the returned match string!

---

## 2. Practical Examples

### 1. Extracting Monetary Amounts without Currency Symbols
```javascript
const invoice = "Prices: $120, €45, ¥3000, $500";

// Positive Lookbehind: Match digits preceded by $
const usdPrices = invoice.match(/(?<=\$)\d+/g);
console.log(usdPrices); // ['120', '500'] (Dollar signs are NOT in results!)
```

### 2. Matching File Names by Extension
```javascript
const files = "photo.png, invoice.pdf, backup.zip, avatar.png";

// Positive Lookahead: Find base name of png files
const pngBases = files.match(/\b\w+(?=\.png)/g);
console.log(pngBases); // ['photo', 'avatar']
```

---

## 3. The Power of Multiple Lookaheads: Password Validation

In password validation, requiring at least one lowercase letter, one uppercase letter, one digit, and a minimum length is cumbersome with standard regex. **Chained Lookaheads** validate all conditions simultaneously from the start of the string:

```javascript
function validateEnterprisePassword(password) {
  // (?=.*[a-z]) -> Must contain lowercase
  // (?=.*[A-Z]) -> Must contain uppercase
  // (?=.*\d)     -> Must contain number
  // (?=.*[@$!%*?&]) -> Must contain special character
  // [A-Za-z\d@$!%*?&]{8,} -> Minimum 8 chars
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

console.log(validateEnterprisePassword('Weak123'));        // false (No special char, < 8)
console.log(validateEnterprisePassword('SuperSecret123!')); // true
```

---

## 4. Lookbehind Browser Compatibility (ES2018)

Positive lookbehind `(?<=...)` and negative lookbehind `(?<!...)` were formalized in ES2018 and are supported across all modern browsers and Node.js environments.

---

## Practice Quiz

### Q1: What does the positive lookahead syntax X(?=Y) assert?
- A) Matches X only if preceded by Y
- B) Matches X only if followed immediately by Y, without including Y in the match result
- C) Replaces X with Y
- D) Checks if X and Y are identical
**Answer:** B
**Explanation:** Positive lookahead `X(?=Y)` matches `X` only when followed by `Y`, without consuming or capturing `Y`.

### Q2: What will "100px 200em 300px".match(/\d+(?=px)/g) return?
- A) ['100px', '300px']
- B) ['100', '300']
- C) ['px', 'px']
- D) ['200']
**Answer:** B
**Explanation:** The lookahead checks for `"px"` but does not consume it, returning strictly the matched digit sequences `['100', '300']`.

### Q3: Which lookaround assertion tests that a pattern is NOT preceded by a specific string?
- A) Negative Lookahead (?!Y)
- B) Negative Lookbehind (?<!Y)
- C) Positive Lookbehind (?<=Y)
- D) Positive Lookahead (?=Y)
**Answer:** B
**Explanation:** Negative Lookbehind `(?<!Y)X` asserts that `X` is not immediately preceded by `Y`.

### Q4: Why are Lookarounds termed "Zero-Width Assertions"?
- A) Because they match only empty strings
- B) Because they test a condition in the text without moving the regex match index or including the characters in the match result
- C) Because they have 0 bytes of memory
- D) They only work in CSS
**Answer:** B
**Explanation:** Zero-width assertions match a position in the string rather than consuming characters, leaving the match pointer at the tested boundary.

### Q5: How do multiple lookaheads at the start of a regex (/^(?=.*[A-Z])(?=.*\d)/) behave?
- A) They run sequentially on different strings
- B) They act like an AND condition, validating that the upcoming string satisfies all lookahead assertions simultaneously
- C) They cause syntax errors
- D) The second overrides the first
**Answer:** B
**Explanation:** Multiple consecutive lookaheads evaluate against the exact same starting position, functioning as a logical AND validation.
