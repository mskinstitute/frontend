# try...catch in Modern JavaScript

Errors in software applications are inevitable—from unexpected user inputs to malformed JSON payloads and network failures. Rather than letting unhandled exceptions crash your entire application, the `try...catch` statement allows developers to intercept runtime errors and recover gracefully.

---

## 1. Syntax & Core Flow

```javascript
try {
  // Code that may throw an exception
  const data = JSON.parse(rawString);
  processData(data);
} catch (error) {
  // Executes ONLY if an exception is thrown inside the try block
  console.error('Failed to parse data:', error.message);
}
```

```
           try Block Executing
                   │
         Did an error occur?
         ┌─────────┴─────────┐
        YES                  NO
         │                   │
         ▼                   ▼
    catch (err)        Execution continues
         │             normally after try
         ▼
  Execution resumes
```

---

## 2. The Error Object

When an exception occurs, JavaScript instantiates an `Error` object passed to the `catch` block with three primary properties:
- **`error.name`**: The error classification type (e.g., `ReferenceError`, `TypeError`, `SyntaxError`).
- **`error.message`**: A human-readable description of what went wrong.
- **`error.stack`**: A detailed stack trace of function calls indicating the exact file and line number.

```javascript
try {
  const result = undefinedVariable + 10;
} catch (err) {
  console.log('Error Name:', err.name);       // 'ReferenceError'
  console.log('Error Message:', err.message); // 'undefinedVariable is not defined'
  console.log('Stack Trace:', err.stack);
}
```

---

## 3. Standard Built-in Error Types

| Error Type | Triggered When... | Example |
| :--- | :--- | :--- |
| `TypeError` | Operation executed on inappropriate type | `null.toUpperCase()` |
| `ReferenceError`| Accessing an undeclared variable | `console.log(foo)` |
| `SyntaxError` | Invalid JavaScript or malformed JSON | `JSON.parse('{bad_json}')` |
| `RangeError` | Numeric value falls outside allowable range | `new Array(-1)` |
| `URIError` | Malformed URI passed to `decodeURIComponent()`| `decodeURIComponent('%')` |

---

## 4. Optional Catch Binding (ES2019)

In earlier versions of JavaScript, you were required to declare an error parameter: `catch (e)`. In ES2019+, if the error details are not needed, you can omit the parameter completely:

```javascript
// Modern concise syntax:
try {
  return JSON.parse(cachedData);
} catch {
  // Error variable omitted because we only care that it failed
  return null;
}
```

---

## 5. Limitations: try...catch CANNOT Catch Asynchronous Callback Errors!

A classic pitfall: `try...catch` is synchronous. It cannot catch errors thrown inside asynchronous callbacks (like `setTimeout` or event listeners) because the `try` block finishes executing before the callback is fired!

```javascript
// FAILS TO CATCH!
try {
  setTimeout(() => {
    throw new Error('Boom!'); // CRASHES! try block has already completed!
  }, 1000);
} catch (err) {
  console.log('This will NEVER be reached!');
}
```

*(Note: To catch errors in asynchronous code, use `.catch()` on Promises or wrap `await` expressions inside `try...catch`).*

---

## Practice Quiz

### Q1: What happens when an error is thrown inside a try block?
- A) The browser shuts down
- B) Code immediately ceases execution in the try block and control jumps to the catch block
- C) The code in the try block is retried 3 times
- D) The entire script file is re-parsed
**Answer:** B
**Explanation:** When an exception is thrown, execution in the `try` block halts immediately, and control transfers directly to the corresponding `catch` block.

### Q2: What type of error is thrown when calling a method on null or undefined (e.g., null.trim())?
- A) SyntaxError
- B) ReferenceError
- C) TypeError
- D) RangeError
**Answer:** C
**Explanation:** Attempting to perform an operation on a value of an incompatible type (such as calling a method on `null`) triggers a `TypeError`.

### Q3: What feature introduced in ES2019 allows catch blocks to omit the error parameter?
- A) Silent Catch
- B) Optional Catch Binding
- C) Nullish Coalescing
- D) Void Error
**Answer:** B
**Explanation:** Optional Catch Binding allows developers to write `try { ... } catch { ... }` without declaring an unused variable `(error)`.

### Q4: Why can a synchronous try...catch NOT catch an error thrown inside a setTimeout callback?
- A) setTimeout runs in WebAssembly
- B) The try...catch statement finishes executing and leaves the Call Stack before the asynchronous callback is executed by the Event Loop
- C) setTimeout suppresses all errors
- D) setTimeout operates in a separate browser tab
**Answer:** B
**Explanation:** The synchronous `try...catch` block finishes executing on the Call Stack immediately. The callback is executed later by the Event Loop, long after the `try` context has exited.

### Q5: Which property of an Error object provides the line-by-line sequence of function calls that led to the exception?
- A) error.path
- B) error.stack
- C) error.traceback
- D) error.history
**Answer:** B
**Explanation:** `error.stack` returns a formatted string showing the call stack history, including file names and line numbers where the failure originated.
