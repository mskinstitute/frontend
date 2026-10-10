# Comments and Best Practices in JavaScript

Writing code that works is only the first step; writing code that is readable, maintainable, and understandable by your teammates (and future you) separates junior coders from seasoned software engineers.

---

## 1. Comment Types in JavaScript

JavaScript provides two primary syntax options for adding comments that are ignored by the JS engine:

### A. Single-Line Comments (`//`)
Use for brief explanations of a single line:
```javascript
// Calculate total cart price with GST tax rate of 18%
const taxRate = 0.18;
const totalWithTax = subtotal * (1 + taxRate); // Inline comment
```

### B. Multi-Line Block Comments (`/* ... */`)
Use for longer architectural notes or temporary code disabling:
```javascript
/*
  The following authentication algorithm validates:
  1. Token signature using HMAC-SHA256
  2. Expiration timestamp (exp claim)
  3. User active status in PostgreSQL database
*/
function verifySessionToken(token) {
  // ...
}
```

---

## 2. Professional Documentation: JSDoc Comments (`/** ... */`)

Top engineering teams use **JSDoc** comments. JSDoc allows code editors (like VS Code) to display rich tooltips, type hints, and autocompletion:

```javascript
/**
 * Calculates the final discounted price for an enrolled student.
 * 
 * @param {number} originalPrice - The standard catalog price in INR.
 * @param {number} discountPercent - Discount percentage (e.g., 20 for 20%).
 * @returns {number} The final rounded price after discount.
 */
function calculateCourseDiscount(originalPrice, discountPercent) {
  const discountAmount = originalPrice * (discountPercent / 100);
  return Math.round(originalPrice - discountAmount);
}
```

When you hover your mouse over `calculateCourseDiscount` anywhere in your codebase, VS Code will display the parameters and return types automatically!

---

## 3. When NOT to Write Comments (Code Smells)

> [!TIP]
> **Golden Rule of Clean Code**: Good code is self-documenting. Comments should explain **WHY** something is done, not **WHAT** is done.

### ❌ Bad: Redundant Comments
```javascript
// Set age to 25
let age = 25;

// If user is greater than 18
if (age > 18) {
  // Allow entry
  allowEntry();
}
```

### ❌ Bad: Using Comments to Explain Cryptic Variable Names
```javascript
let d = 86400; // number of seconds in a day
```

### ✅ Clean & Self-Documenting:
```javascript
const SECONDS_IN_A_DAY = 86400;
```

---

## 4. Essential JavaScript Naming Conventions

Follow standard JavaScript community conventions:

| Identifier Type | Convention | Example |
|---|---|---|
| **Variables & Properties** | `camelCase` | `userName`, `totalAmount`, `isModalOpen` |
| **Functions & Methods** | `camelCase` (Verb-based) | `getUserProfile()`, `calculateTotal()`, `fetchCourses()` |
| **Booleans** | Prefix with `is`, `has`, `can` | `isLoading`, `hasPermission`, `canSubmit` |
| **Classes & Components** | `PascalCase` | `UserCard`, `PaymentGateway`, `ShoppingCart` |
| **Global Constants** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `DEFAULT_TIMEOUT_MS` |

---

## 5. Enable Strict Mode: `"use strict"`

Strict Mode eliminates silent errors in JavaScript by converting them to throw runtime exceptions:

```javascript
"use strict";

// Without strict mode, mistyping a variable creates an accidental global!
// With strict mode, this throws ReferenceError: userName is not defined
userName = "Sumit";
```

> [!NOTE]
> All modern ES6 modules (`import`/`export`) and React/Next.js components run in strict mode automatically.

---

## Practice Quiz

### Q1: What is the syntax for a single-line comment in JavaScript?
- A) `<!-- Comment -->`
- B) `# Comment`
- C) `// Comment`
- D) `/* Comment`
**Answer:** C
**Explanation:** `//` starts a single-line comment in JavaScript, ignoring all text following it until the end of the line.

### Q2: What is the primary purpose of writing JSDoc comments (`/** ... */`)?
- A) To compress JavaScript files
- B) To provide rich, structured documentation of function parameters, types, and return values that modern IDEs render as interactive tooltips
- C) To make code execute faster
- D) To prevent variable assignment
**Answer:** B
**Explanation:** JSDoc annotations specify parameter and return types, enabling editors like VS Code to provide intelligent autocomplete and documentation tooltips.

### Q3: According to clean code principles, what should comments primarily explain?
- A) Every single line of code in detail
- B) **Why** a non-obvious business decision or complex algorithm was implemented, rather than stating what the syntax already shows
- C) The operating system version
- D) Personal opinions about coworkers
**Answer:** B
**Explanation:** Clean code is self-documenting for "what" is happening; comments should be reserved for explaining "why" a particular approach or workaround was chosen.

### Q4: What casing convention is standard in JavaScript for functions and variable names?
- A) `kebab-case`
- B) `snake_case`
- C) `camelCase` (e.g. `calculateTotalPrice`)
- D) `PascalCase`
**Answer:** C
**Explanation:** Standard JavaScript style guides (Airbnb, Google) use `camelCase` for variable, function, and method names.

### Q5: What does adding `"use strict";` at the top of a JavaScript file enforce?
- A) It prevents using internet connections
- B) It enforces strict parsing and error handling, disallowing undeclared variables and silent errors
- C) It doubles RAM consumption
- D) It changes the language to TypeScript
**Answer:** B
**Explanation:** Strict mode catches silent errors, prevents accidental global variable leaks, and disables insecure legacy JavaScript features.
