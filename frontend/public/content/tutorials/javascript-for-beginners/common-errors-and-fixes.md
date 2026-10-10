# Common JavaScript Errors and Fixes

Every JavaScript developer encounters runtime errors. Understanding how to read error messages and trace stack traces transforms frustrating debugging into quick, routine fixes.

---

## 1. Reading an Error Message and Stack Trace

When an unhandled error occurs, the console prints:

```text
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
    at app.js:14:5
```

### Decoding the Trace:
1. **Error Name**: `TypeError` (The category of error).
2. **Message**: `Cannot read properties of null (reading 'addEventListener')` (What went wrong).
3. **File & Line**: `app.js:14:5` (The error occurred in `app.js` on **line 14**, column 5).

---

## 2. The Big 5 JavaScript Errors

### 1. `TypeError: Cannot read properties of null / undefined`
- **Cause**: Attempting to access a property or call a method on a variable that evaluates to `null` or `undefined`.
- **Example**:
  ```javascript
  const btn = document.querySelector("#wrong-id"); // Returns null!
  btn.addEventListener("click", () => {}); // 💥 TypeError!
  ```
- **Fix**: Check that the selector matches your HTML, or use optional chaining (`?.`):
  ```javascript
  btn?.addEventListener("click", () => {});
  ```

---

### 2. `ReferenceError: x is not defined`
- **Cause**: Trying to use a variable that was never declared, or accessing a block-scoped variable outside its scope.
- **Example**:
  ```javascript
  console.log(totalScore); // 💥 ReferenceError! (Variable never declared)
  ```
- **Fix**: Verify variable spelling and ensure it is declared with `const` or `let` in accessible scope.

---

### 3. `SyntaxError: Unexpected token ...`
- **Cause**: Breaking JavaScript grammar rules: unclosed quotes, missing commas, missing parentheses or curly braces.
- **Example**:
  ```javascript
  const user = { name: "Sumit" age: 25 }; // 💥 SyntaxError: Missing comma!
  ```
- **Fix**: Check matching braces and commas; enable Prettier in VS Code to highlight syntax errors instantly.

---

### 4. `TypeError: Assignment to constant variable`
- **Cause**: Trying to reassign a variable declared with `const`.
- **Example**:
  ```javascript
  const count = 0;
  count = 1; // 💥 TypeError!
  ```
- **Fix**: Change declaration to `let` if the variable must be reassigned.

---

### 5. `RangeError: Maximum call stack size exceeded`
- **Cause**: Infinite recursion! A function calls itself repeatedly without ever reaching a base case.
- **Example**:
  ```javascript
  function loop() {
    loop(); // 💥 RangeError: Stack overflow!
  }
  loop();
  ```
- **Fix**: Always define an explicit termination base case in recursive functions.

---

## 3. Defensive Programming: Handling Errors with `try...catch`

When dealing with operations that might fail unpredictably (like parsing external JSON or making network requests):

```javascript
try {
  const data = JSON.parse(malformedString);
  console.log("Parsed data:", data);
} catch (error) {
  console.error("Failed to parse JSON gracefully:", error.message);
} finally {
  console.log("Cleanup operations executed.");
}
```

---

## Practice Quiz

### Q1: What causes `TypeError: Cannot read properties of undefined`?
- A) You typed too many variables
- B) You attempted to access a property (like `.length` or `.name`) on a value that is `undefined`
- C) The browser is out of memory
- D) The HTML file was deleted
**Answer:** B
**Explanation:** This error occurs when dot notation or bracket notation is used on `undefined` (or `null`), which have no properties.

### Q2: What causes a `ReferenceError: myVar is not defined`?
- A) The variable has a numeric value
- B) The variable was used without ever being declared in the current or parent scopes
- C) The variable was declared with `const`
- D) The computer lost internet connection
**Answer:** B
**Explanation:** JavaScript throws a `ReferenceError` when you attempt to reference an identifier that does not exist in scope.

### Q3: What causes `RangeError: Maximum call stack size exceeded`?
- A) An infinite loop in a `for` statement
- B) Infinite recursion where functions repeatedly call each other without a terminating base case, overflowing the Call Stack
- C) An array with 10 elements
- D) Too many CSS files
**Answer:** B
**Explanation:** When functions recursively call without returning, stack frames accumulate until the browser's maximum stack memory limit is reached.

### Q4: Which operator introduced in ES2020 safely prevents `Cannot read properties of null` errors by short-circuiting to `undefined` if the reference is nullish?
- A) Ternary operator (`?:`)
- B) Optional Chaining (`?.`)
- C) Spread operator (`...`)
- D) Modulus operator (`%`)
**Answer:** B
**Explanation:** Optional chaining (`user?.profile?.avatar`) safely returns `undefined` if `user` or `profile` is null or undefined, without throwing an exception.

### Q5: What block in a `try...catch...finally` statement is guaranteed to run regardless of whether an error occurred or was caught?
- A) The `catch` block
- B) The `try` block
- C) The `finally` block
- D) The `throw` block
**Answer:** C
**Explanation:** The `finally` block executes unconditionally after the `try` and `catch` blocks complete.
