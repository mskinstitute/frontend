# Custom Error Hierarchies & Prototypes in Modern JavaScript

In enterprise architectures, generic exceptions like `Error("something broke")` make debugging difficult. Designing a domain-specific **Custom Error Hierarchy** enables precise error categorization, structured error codes, telemetry metadata, and robust prototype chain restoration across transpilers.

---

## 1. Designing an Enterprise Error Hierarchy

A well-structured system categorizes errors into clear inheritance tiers:

```
                      ┌───────────────┐
                      │ built-in Error│
                      └───────┬───────┘
                              │ extends
                      ┌───────▼───────┐
                      │ AppBaseError  │ (Captures timestamp, code, HTTP status)
                      └───────┬───────┘
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ ValidationError│ │ AuthError    │   │ DatabaseError│
    └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 2. Implementing the Base Application Error

```javascript
class AppBaseError extends Error {
  constructor(message, options = {}) {
    // Pass message and options (supports ES2022 cause) to super
    super(message, options);

    // Explicitly configure error name to match class name
    this.name = this.constructor.name;
    this.statusCode = options.statusCode || 500;
    this.errorCode = options.errorCode || 'INTERNAL_ERROR';
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes operational vs programmer bugs

    // Capture clean stack trace omitting constructor frame (V8 engine)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };
  }
}
```

---

## 3. Creating Domain-Specific Specialized Subclasses

```javascript
class ValidationError extends AppBaseError {
  constructor(message, validationErrors = []) {
    super(message, { statusCode: 400, errorCode: 'VALIDATION_FAILED' });
    this.validationErrors = validationErrors;
  }
}

class AuthenticationError extends AppBaseError {
  constructor(message = 'Authentication credentials invalid or missing.') {
    super(message, { statusCode: 401, errorCode: 'UNAUTHORIZED' });
  }
}

class EntityNotFoundError extends AppBaseError {
  constructor(entityName, id) {
    super(`Resource ${entityName} with ID '${id}' was not found.`, {
      statusCode: 404,
      errorCode: 'RESOURCE_NOT_FOUND'
    });
    this.entityName = entityName;
    this.id = id;
  }
}
```

---

## 4. The Transpiler Prototype Chain Pitfall (TypeScript & Babel)

When compiling ES6 classes down to ES5, subclassing built-in classes like `Error` can break `instanceof` checks because the prototype chain is not linked properly.

### Solution: Explicit Prototype Restoration
```javascript
class SafeCustomError extends Error {
  constructor(msg) {
    super(msg);
    // Explicitly restore prototype chain:
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

---

## 5. Operational vs. Programmer Errors

In production servers (Node.js/Express):
- **Operational Errors:** Known runtime failure conditions (e.g. invalid password, file not found, network timeout). Can be handled gracefully (`isOperational: true`).
- **Programmer Errors:** Bugs in code (e.g. calling `undefined()`, passing wrong types). Require logging to Sentry and restarting the worker process to avoid corrupted state.

---

## Practice Quiz

### Q1: What does V8's Error.captureStackTrace(this, constructor) achieve?
- A) It prevents errors from being caught in catch blocks
- B) It generates a clean stack trace on the error instance while omitting internal constructor calls from the trace
- C) It logs the error directly to the database
- D) It encrypts the stack trace
**Answer:** B
**Explanation:** `Error.captureStackTrace(target, constructorOpt)` captures the current call stack while omitting the constructor function itself from the trace, keeping logs clean.

### Q2: Why is Object.setPrototypeOf(this, new.target.prototype) sometimes required when subclassing Error?
- A) To make errors async
- B) Because ES5 transpilation can break the prototype chain when extending native built-in classes, causing instanceof checks to fail
- C) To freeze the error object
- D) It is mandatory in HTML5
**Answer:** B
**Explanation:** In transpiled environments (like Babel or older TypeScript targets), the prototype chain for native built-ins like `Error` is broken unless explicitly restored.

### Q3: What is the benefit of defining an isOperational: true flag on custom application errors?
- A) It increases download speed
- B) It allows error-handling middleware to distinguish between expected runtime issues (e.g., bad inputs) and fatal bugs that require process restarts
- C) It stops memory leaks
- D) It disables stack traces
**Answer:** B
**Explanation:** Distinguishing operational errors (expected runtime failures) from unhandled programmer bugs (logic errors) prevents servers from crashing on routine validation failures.

### Q4: How does setting this.name = this.constructor.name inside a base error class improve debugging?
- A) It compiles the error to C++
- B) It ensures that logs and stack traces display the actual subclass name (e.g. 'ValidationError') instead of generic 'Error'
- C) It encrypts the error name
- D) It makes the class abstract
**Answer:** B
**Explanation:** Setting `this.name = this.constructor.name` ensures that printed stack traces and JSON logs display the specific subclass identifier.

### Q5: How can a custom error class support serializing structured error responses to JSON?
- A) By implementing a toJSON() method on the class
- B) By overriding the constructor
- C) By setting window.json = error
- D) Errors cannot be serialized
**Answer:** A
**Explanation:** `JSON.stringify(error)` automatically checks for and calls an object's `.toJSON()` method if present, producing clean API response payloads.
