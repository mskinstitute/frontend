---
id: python-intermediate-creating-custom-exceptions
slug: creating-custom-exceptions
course: python-for-intermediate
chapter: "6: Exception Handling"
topic: "6.4 Creating Custom Exceptions"
title: "Creating Custom Exceptions in Python"
description: "Master creating custom exceptions in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 29
keywords:
  - python creating custom exceptions
  - python intermediate
  - python creating custom exceptions
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Creating Custom Exceptions in Python

While Python's standard library provides dozens of built-in exceptions, production systems frequently encounter domain-specific error conditions that standard exceptions like `ValueError` or `RuntimeError` cannot clearly describe. By creating **Custom Exceptions**, you provide descriptive, domain-aligned error types that make debugging, automated recovery, and API design vastly more intuitive.

---

## 1. Defining a Basic Custom Exception

A custom exception is simply a class that inherits from the built-in `Exception` class (or one of its subclasses):

```python
class InsufficientFundsError(Exception):
    """Raised when an account balance is insufficient for a withdrawal."""
    pass

def process_withdrawal(balance: float, amount: float):
    if amount > balance:
        raise InsufficientFundsError(
            f"Cannot withdraw ₹{amount:,.2f}. Current balance is only ₹{balance:,.2f}."
        )
    return balance - amount

try:
    process_withdrawal(500, 1200)
except InsufficientFundsError as err:
    print(f"Transaction Aborted: {err}")
```

> **Naming Convention:** Always end custom exception class names with `Error` (e.g., `ValidationError`, `DatabaseTimeoutError`) in accordance with PEP 8.

---

## 2. Designing Exception Hierarchies

In enterprise applications, libraries, and frameworks, best practice dictates defining a common application base exception. All other custom exceptions in that module inherit from this base. This allows callers to catch the top-level parent to intercept *any* error from the module, or catch individual children for targeted handling.

```text
ECommerceError (Base)
 ├── UserAuthenticationError
 ├── CartValidationError
 │    ├── OutOfStockError
 │    └── MaxQuantityExceededError
 └── PaymentProcessingError
```

### Implementing the Hierarchy

```python
class ECommerceError(Exception):
    """Base exception for all errors in the e-commerce domain."""
    pass

class CartValidationError(ECommerceError):
    """Raised when cart items violate purchasing rules."""
    pass

class OutOfStockError(CartValidationError):
    """Raised when an inventory count cannot satisfy demand."""
    pass

class PaymentProcessingError(ECommerceError):
    """Raised when billing gateway fails."""
    pass
```

### Catching at Different Levels

```python
try:
    # Business logic here
    raise OutOfStockError("Item SKU-981 is sold out.")
except CartValidationError as err:
    # Catches OutOfStockError AND MaxQuantityExceededError
    print(f"Cart issue: {err}")
except ECommerceError as err:
    # Catches ANY other e-commerce error
    print(f"General store issue: {err}")
```

---

## 3. Adding Rich Metadata and Custom Attributes

Custom exceptions can store structured attributes—such as HTTP status codes, item IDs, timestamps, or validation failure lists—enabling upstream handlers to programmatically inspect the error without parsing error message strings:

```python
class InventoryError(Exception):
    def __init__(self, sku: str, requested_qty: int, available_qty: int):
        self.sku = sku
        self.requested_qty = requested_qty
        self.available_qty = available_qty
        self.deficit = requested_qty - available_qty
        
        message = (
            f"SKU '{sku}': Requested {requested_qty} units, "
            f"but only {available_qty} are in stock (Shortfall: {self.deficit})."
        )
        super().__init__(message)

def reserve_stock(sku: str, qty: int):
    stock_levels = {"SKU-A": 10, "SKU-B": 2}
    available = stock_levels.get(sku, 0)
    
    if qty > available:
        raise InventoryError(sku, qty, available)
    
    print(f"Reserved {qty} units of {sku}.")

try:
    reserve_stock("SKU-B", 5)
except InventoryError as err:
    # Programmatic recovery using structured attributes
    print(f"Log: Stock shortage for item {err.sku}")
    print(f"Suggest ordering remaining {err.deficit} units from supplier.")
```

---

## 4. Best Practices Summary

1. **Subclass `Exception`, not `BaseException`:** Inheriting from `BaseException` bypasses standard `except Exception:` handlers and interrupts system signals.
2. **Document with Docstrings:** Document what scenario triggers the custom exception.
3. **Keep them Lightweight:** Only add custom attributes when callers will realistically need them for recovery or auditing.
4. **Preserve `super().__init__()`:** Always pass the formatted string message to the parent constructor so `str(err)` and tracebacks display the message cleanly.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Not Inheriting from `Exception`
Always inherit custom exceptions from `Exception` (or an application-level base exception), never directly from `BaseException`.

### 2. Over-Complicating Custom Exceptions
Keep custom exceptions lightweight. They exist to categorize domain failures cleanly, so a descriptive name and message are usually all you need.

---

---

## 💻 Try It Yourself: Custom Authentication Exception Hierarchy

### Scenario
Create an `AuthError` base exception, with subclasses `UserNotFoundError` and `InvalidCredentialsError`. Write a simple login verification function demonstrating both.

### Complete Solution
```python
class AuthError(Exception):
    """Base exception for authentication failures."""
    pass

class UserNotFoundError(AuthError):
    pass

class InvalidPasswordError(AuthError):
    pass

USERS_DB = {"aarav": "securepass123"}

def authenticate(username, password):
    if username not in USERS_DB:
        raise UserNotFoundError(f"User '{username}' does not exist.")
    if USERS_DB[username] != password:
        raise InvalidPasswordError("Incorrect password provided.")
    return f"Welcome back, {username}!"

for u, p in [("aarav", "securepass123"), ("priya", "pass"), ("aarav", "wrong")]:
    try:
        print(authenticate(u, p))
    except AuthError as err:
        print(f"[{err.__class__.__name__}] {err}")
```

### Expected Output
```text
Welcome back, aarav!
[UserNotFoundError] User 'priya' does not exist.
[InvalidPasswordError] Incorrect password provided.
```

---

## Practice Quiz

### 1. Which class should your custom exception inherit from directly or indirectly in modern Python?
A. `BaseException`
B. `Exception`
C. `SystemError`
D. `object`
**Answer:** B
**Explanation:** Custom exceptions should inherit from `Exception`. Subclassing `BaseException` is reserved strictly for system-exiting signals like `KeyboardInterrupt`.
---

### 2. What is the PEP 8 recommended naming convention for custom exception classes?
A. Snake_case ending in `_exception` (e.g. `auth_failure_exception`)
B. PascalCase ending with `Error` (e.g. `AuthenticationError`)
C. UPPERCASE acronyms (e.g. `AUTH_ERROR`)
D. Lowercase without suffixes (e.g. `autherror`)
**Answer:** B
**Explanation:** PEP 8 dictates PascalCase for class names and advises ending exception names with `Error` if the exception involves an error condition.
---

### 3. What is the primary benefit of creating an application-level base exception (e.g. `AppError(Exception)`)?
A. It compiles the application into machine code
B. Callers can catch all module-specific errors with a single `except AppError:` block
C. It allows functions to return multiple values simultaneously
D. It prevents the code from using memory
**Answer:** B
**Explanation:** A common base exception allows callers to intercept all domain-specific exceptions originating from that module with a single broad handler.
---

### 4. How can callers access custom metadata (e.g. `err.status_code`) stored on an exception instance?
A. By inspecting Python's global namespace
B. By assigning instance attributes inside the custom exception's `__init__` method
C. Custom exceptions cannot store attributes
D. By calling `eval()` on the traceback string
**Answer:** B
**Explanation:** Custom exceptions are standard Python classes; you can assign arbitrary attributes to `self` in `__init__` and access them on the caught instance.
---

### 5. Why should custom exceptions pass a message to `super().__init__(message)`?
A. To format the exception into an HTML table
B. To ensure `str(err)` and Python tracebacks automatically display the message
C. To force the operating system to log the event
D. To terminate child threads
**Answer:** B
**Explanation:** Passing the error message to `super().__init__(message)` initializes the base exception's string representation, ensuring clear traceback and log outputs.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project: Error-Handled Calculator** (6: Exception Handling).

👉 **[Continue to Next Lesson: Project: Error-Handled Calculator →](/tutorials/python-for-intermediate/project-error-handled-calculator)**
