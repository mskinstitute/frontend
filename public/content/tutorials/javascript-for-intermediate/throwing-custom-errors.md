# Throwing Custom Errors in Modern JavaScript

While JavaScript provides standard error primitives (`TypeError`, `ReferenceError`), real-world enterprise applications require domain-specific errors (e.g., `ValidationError`, `AuthenticationError`, `DatabaseConnectionError`). Creating custom error classes allows upstream consumers to distinguish between different failure modes and handle them accordingly.

---

## 1. The throw Statement

You can throw any expression in JavaScript, but **you should always throw instances of Error (or classes extending Error)** to ensure stack traces are preserved:

```javascript
// ANTI-PATTERN: Throwing raw strings or numbers loses stack traces!
// throw "Password too short"; 

// BEST PRACTICE:
throw new Error("Password must be at least 8 characters long.");
```

---

## 2. Creating Custom Error Classes

In modern ES6+, inherit from the built-in `Error` superclass:

```javascript
class ValidationError extends Error {
  constructor(message, fieldName = null) {
    super(message); // Call super constructor with error message
    this.name = 'ValidationError';
    this.fieldName = fieldName;
    this.date = new Date();
  }
}

class InsufficientFundsError extends Error {
  constructor(balance, required) {
    super(`Transaction rejected: Available balance $${balance}, required $${required}`);
    this.name = 'InsufficientFundsError';
    this.balance = balance;
    this.required = required;
  }
}
```

```
       built-in Error
             ▲
             │ extends
     ValidationError
     (custom properties: fieldName, date)
```

---

## 3. Differentiating Errors with instanceof

When catching errors, use `instanceof` to route different errors to specific recovery routines:

```javascript
function withdrawFunds(account, amount) {
  if (amount <= 0) {
    throw new ValidationError('Withdrawal amount must be greater than zero.', 'amount');
  }
  if (account.balance < amount) {
    throw new InsufficientFundsError(account.balance, amount);
  }
  account.balance -= amount;
  return account.balance;
}

try {
  withdrawFunds(userAccount, 500);
} catch (error) {
  if (error instanceof ValidationError) {
    // Highlight input field in Red on the UI
    showFieldHighlight(error.fieldName, error.message);
  } else if (error instanceof InsufficientFundsError) {
    // Show 'Add Funds' modal
    openDepositModal(error.required - error.balance);
  } else {
    // Unrecognized runtime crash (rethrow or send to Sentry)
    console.error('Unexpected crash:', error);
    throw error;
  }
}
```

---

## 4. Error Chaining with { cause } (ES2022)

Often, a low-level error (like a disk failure or database timeout) causes a higher-level business error. ES2022 introduced the `{ cause }` option to chain the original root error:

```javascript
async function loadUserData(userId) {
  try {
    return await api.get(`/users/${userId}`);
  } catch (originalNetworkError) {
    // Wrap low-level error inside a domain error while preserving cause!
    throw new Error(`Failed to load profile for user ${userId}`, {
      cause: originalNetworkError
    });
  }
}

// In consumer:
try {
  await loadUserData(42);
} catch (err) {
  console.log(err.message);       // 'Failed to load profile for user 42'
  console.log(err.cause.message); // 'ETIMEDOUT: Connection to server timed out'
}
```

---

## Practice Quiz

### Q1: Why should you extend the built-in Error class instead of throwing plain strings?
- A) Plain strings cannot be caught in catch blocks
- B) Extending Error preserves stack traces, error names, and allows instanceof type checks
- C) Plain strings slow down browser rendering
- D) Plain strings are deprecated in ES6
**Answer:** B
**Explanation:** Instances of `Error` capture call stack traces, provide standard properties (`name`, `message`), and allow type discrimination using `instanceof`.

### Q2: What keyword must be called inside the constructor of a custom class extending Error?
- A) this.init()
- B) super(message)
- C) Object.create(Error)
- D) Error.call(this)
**Answer:** B
**Explanation:** Subclasses must invoke `super(message)` to execute the parent `Error` constructor and initialize the message and internal stack trace.

### Q3: How do you identify which specific custom error was caught in a catch block?
- A) typeof error === 'ValidationError'
- B) error instanceof ValidationError
- C) error.isClass('ValidationError')
- D) error.type == ValidationError
**Answer:** B
**Explanation:** The `instanceof` operator tests whether the prototype property of a constructor appears anywhere within the prototype chain of an object.

### Q4: What feature was introduced in ES2022 to preserve the original underlying error when throwing a higher-level error?
- A) Error.prototype.parent
- B) The { cause: originalError } options parameter in new Error()
- C) throw with multiple arguments
- D) Async Error Wrapper
**Answer:** B
**Explanation:** ES2022 allows passing an options object with a `cause` property: `new Error('Higher level message', { cause: lowLevelError })`.

### Q5: What should you do in a catch block if the caught error is not an expected domain error?
- A) Suppress it silently
- B) Re-throw it with throw error so upstream handlers or global loggers can capture it
- C) Convert it to null
- D) Clear the localStorage
**Answer:** B
**Explanation:** If an error is not of a recognized or recoverable type, re-throwing it prevents silent failures and lets global monitoring catch it.
