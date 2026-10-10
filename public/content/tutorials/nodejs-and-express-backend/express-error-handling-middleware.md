# Global Error Handling Middleware & Custom AppError Classes

Uncaught exceptions and unhandled promise rejections can crash a Node.js production server, terminating all active client connections. Building a resilient backend requires a **centralized global error-handling architecture** with custom operational error classes.

---

## 1. Operational Errors vs Programmer Bugs

- **Operational Errors:** Predictable, unavoidable runtime errors (e.g., invalid user input, invalid login password, database duplicate key, file not found). These must be caught and returned as structured HTTP client errors (`4xx`).
- **Programmer Bugs:** Unintentional bugs in code (e.g., calling `.map()` on `undefined`, syntax errors, reading missing properties). These must be logged with full stack traces and returned as `500 Internal Server Error`.

---

## 2. Building a Custom `AppError` Class

```javascript
// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flag identifying predictable operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## 3. The `catchAsync` Wrapper Utility

Instead of polluting every controller with repetitive `try/catch` boilerplate, use an asynchronous higher-order function wrapper:

```javascript
// src/utils/catchAsync.js
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Catches rejected promises and forwards to next(err)
  };
};

// Usage in controllers:
export const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: user });
});
```

---

## 4. Centralized Global Error Handling Middleware

Place this middleware at the very end of all route definitions:

```javascript
// src/middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Development: Return rich debugging info and stack trace
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production: Leak zero implementation details for unhandled bugs
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('CRITICAL UNHANDLED ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on our end. Please try again later.'
      });
    }
  }
}
```

---

# Multiple Choice Questions

### 1. Why must the global error-handling middleware be declared with exactly four parameters `(err, req, res, next)`?
A. Because JavaScript mandates 4 parameters for all functions.
B. Express checks `fn.length === 4` to recognize the function as an error-handling middleware rather than a normal request middleware.
C. It allows Express to encrypt error messages.
D. The fourth parameter `next` is used only for logging.
**Answer:** B
**Explanation:** Express specifically checks the arity (`fn.length`) of the function; four parameters tell the internal router to invoke it when `next(err)` is triggered.
---

### 2. What is the danger of returning raw `err.stack` traces to clients in production environments?
A. It consumes too much network bandwidth.
B. It leaks sensitive architectural details, file paths, database schemas, and library versions to potential attackers.
C. It breaks JSON parsing in browsers.
D. Stack traces cannot be serialized to JSON.
**Answer:** B
**Explanation:** Stack traces reveal file system locations, internal logic, and dependencies, presenting a serious security vulnerability if exposed in production.
---

### 3. What does the `catchAsync` wrapper pattern accomplish in Express controllers?
A. It compiles async functions into C++ binaries.
B. It wraps async route handlers to automatically catch rejected promises and forward errors to `next(err)` without manual `try/catch` blocks.
C. It forces the database to run in memory.
D. It prevents users from refreshing the page.
**Answer:** B
**Explanation:** `catchAsync` wraps asynchronous controller functions and automatically attaches `.catch(next)`, eliminating repetitive `try/catch` boilerplate.
---

### 4. What is an "operational error" in backend architecture?
A. A hardware power outage in the server facility.
B. A known, expected runtime situation (such as a duplicate email, invalid login password, or missing document) that should be gracefully communicated to the client.
C. A syntax bug written by a programmer.
D. A corrupted operating system kernel.
**Answer:** B
**Explanation:** Operational errors represent normal, foreseeable failure conditions in an application (like 404 Not Found or 400 Bad Request) that can be handled gracefully.
---

### 5. Where should the global error middleware `app.use(errorHandler)` be mounted in the Express application?
A. At the very top of `app.js`, before all routes.
B. At the very bottom of `app.js`, after all routes and 404 catch-alls have been defined.
C. Inside each individual database schema file.
D. In the HTML header tag.
**Answer:** B
**Explanation:** The error handler must be registered last so that errors from any preceding middleware or route handlers flow down into it.
---
