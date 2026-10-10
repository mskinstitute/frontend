# Defensive Programming & Invariants in Modern JavaScript

In dynamic, weakly-typed environments like JavaScript, unexpected inputs and state mutations can corrupt application behavior without immediate warnings. **Defensive Programming** is an engineering methodology designed to ensure software robustness through input sanitization, assertion checks, and the enforcement of **Invariants**—conditions that must always remain true throughout execution.

---

## 1. What is an Invariant?

An **Invariant** is a fundamental condition or business rule that must hold true at specific boundaries:
- *Preconditions:* Requirements that must be true before a function begins execution.
- *Postconditions:* Guarantees that must hold true when a function returns.
- *Class Invariants:* State conditions that must remain valid throughout an object's lifetime.

```
                  ┌──────────────────────────────┐
                  │ Preconditions Verified       │ (Throws if violated)
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │ Core Business Operation      │
                  └──────────────┬───────────────┘
                                 │
                  ┌──────────────▼───────────────┐
                  │ Postconditions Verified      │ (Guarantees integrity)
                  └──────────────────────────────┘
```

---

## 2. Implementing Assertions & Invariant Guards

```javascript
// Generic invariant utility (similar to React/Node invariant modules)
function invariant(condition, message) {
  if (!condition) {
    const error = new Error(`[Invariant Violation] ${message}`);
    error.name = 'InvariantViolation';
    throw error;
  }
}

class BankAccount {
  #balance;

  constructor(initialDeposit) {
    // Precondition check
    invariant(typeof initialDeposit === 'number' && initialDeposit >= 0, 
      'Initial deposit must be a non-negative number.');
    this.#balance = initialDeposit;
  }

  withdraw(amount) {
    // Precondition
    invariant(typeof amount === 'number' && amount > 0, 
      'Withdrawal amount must be a positive number.');
    invariant(amount <= this.#balance, 
      `Insufficient funds. Available: ${this.#balance}, requested: ${amount}`);

    this.#balance -= amount;

    // Postcondition / Class Invariant: Balance can NEVER be negative!
    invariant(this.#balance >= 0, 'Fatal: Account balance corrupted to negative value!');
    return this.#balance;
  }
}
```

---

## 3. Type Guards & Runtime Input Sanitization

Do not trust external data from user inputs, URL parameters, or third-party APIs:

```javascript
// Robust runtime type guard
function isValidUser(payload) {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    typeof payload.id === 'string' &&
    payload.id.trim().length > 0 &&
    typeof payload.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  );
}

function processUserData(rawData) {
  if (!isValidUser(rawData)) {
    throw new TypeError('Invalid user payload format received.');
  }
  // Safely proceed knowing rawData is clean
}
```

---

## 4. Defensive Copying (Preventing External Mutation)

When a function accepts an object or returns internal state, callers can mutate internal references unless defensive copying is applied:

```javascript
class ReportGenerator {
  #tags;

  constructor(tags) {
    // DEFENSIVE COPY on intake:
    this.#tags = [...tags]; // Clones array so caller cannot mutate internal list!
  }

  getTags() {
    // DEFENSIVE COPY on output:
    return [...this.#tags]; // Prevents caller: report.getTags().push('hacked')
  }
}
```

---

## Practice Quiz

### Q1: What is an "Invariant" in software engineering?
- A) A variable that changes every second
- B) A condition or business rule that must always evaluate to true throughout the lifetime of a program or component
- C) A CSS transition effect
- D) An asynchronous callback
**Answer:** B
**Explanation:** An invariant is a condition that must remain true across execution; any invariant violation indicates an invalid system state.

### Q2: What is the purpose of an invariant(condition, message) assertion function?
- A) To compress JavaScript bundles
- B) To immediately fail fast and throw an exception if a critical assumption or precondition is violated
- C) To log warnings without halting
- D) To convert variables to numbers
**Answer:** B
**Explanation:** Invariant assertions enforce "fail-fast" behavior, halting execution immediately if core assumptions are violated to prevent cascading state corruption.

### Q3: What is "Defensive Copying"?
- A) Copying files to a backup server every night
- B) Duplicating input or output arrays/objects to prevent external callers from mutating internal state
- C) Backing up localStorage
- D) Using Git branches
**Answer:** B
**Explanation:** Defensive copying duplicates objects/arrays upon receiving or returning them, ensuring that external code cannot mutate internal private state via shared references.

### Q4: Which of the following represents a "Precondition" check?
- A) Verifying that an input amount is greater than zero before performing a bank transfer
- B) Checking database integrity after writing data
- C) Formatting a response object before returning
- D) Cleaning up event listeners in finally
**Answer:** A
**Explanation:** Preconditions are criteria that must be verified as true *before* a function begins executing its primary logic.

### Q5: Why is defensive programming especially critical in JavaScript compared to Java or Rust?
- A) JavaScript runs slower
- B) JavaScript is dynamically typed without compile-time type enforcement, allowing invalid types and shapes to slip into runtime functions
- C) JavaScript does not have classes
- D) JavaScript cannot throw errors
**Answer:** B
**Explanation:** Because JavaScript is dynamically typed, runtime type-checking and assertion guards are required to intercept invalid data that static compilers would catch in typed languages.
