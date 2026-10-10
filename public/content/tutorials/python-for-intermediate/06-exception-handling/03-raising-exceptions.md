---
id: python-intermediate-raising-exceptions
slug: raising-exceptions
course: python-for-intermediate
chapter: "6: Exception Handling"
topic: "6.3 Raising Exceptions"
title: "Raising Exceptions in Python"
description: "Master raising exceptions in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 28
keywords:
  - python raising exceptions
  - python intermediate
  - python raising exceptions
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Raising Exceptions in Python

While Python automatically raises exceptions when illegal runtime operations occur (like dividing by zero or indexing out of bounds), professional Python developers also intentionally trigger exceptions using the `raise` statement. Raising exceptions allows functions to reject invalid parameters, signal invariant violations, and propagate contextual error messages up the execution call stack.

---

## 1. The `raise` Statement

The `raise` keyword stops normal sequential execution and signals an exception. You can raise any instance or subclass of `BaseException` (almost always a subclass of `Exception`).

```python
def set_user_age(age: int):
    if not isinstance(age, int):
        raise TypeError(f"Age must be an integer, received {type(age).__name__}.")
    if age < 0 or age > 130:
        raise ValueError(f"Age {age} is out of realistic physiological range (0-130).")
    
    print(f"User age recorded: {age}")

set_user_age(28)

try:
    set_user_age(-5)
except ValueError as err:
    print(f"Validation failed: {err}")
```

---

## 2. Re-raising Exceptions (Propagating After Logging)

Sometimes an `except` block needs to log diagnostic information, clean up temporary data, or execute metrics tracking, but still allow the exception to propagate to caller functions. 

A bare `raise` statement inside an `except` clause re-raises the active exception currently being handled:

```python
import logging

def execute_remote_query(query: str):
    try:
        # Simulate network failure
        raise ConnectionResetError("Connection lost to database cluster.")
    except ConnectionResetError as err:
        # 1. Log the failure locally
        print(f"[AUDIT LOG] Database operation failed: {err}")
        
        # 2. Re-raise the active exception without losing original traceback!
        raise

try:
    execute_remote_query("SELECT * FROM orders")
except ConnectionResetError:
    print("Caller caught re-raised connection error.")
```

---

## 3. Exception Chaining: `raise ... from ...`

When building modular software or library wrappers, you often want to transform a low-level implementation error into a meaningful domain-level exception while preserving the original diagnostic cause.

Python supports **Exception Chaining** using the `from` clause:

```python
class PaymentGatewayError(Exception):
    """Raised when a payment processor transaction fails."""
    pass

def charge_card(card_token: str, amount: float):
    try:
        # Low level network or crypto failure
        raise TimeoutError("Socket read timed out after 10000ms.")
    except TimeoutError as original_error:
        # Wrap the raw socket error inside a domain-specific PaymentGatewayError
        raise PaymentGatewayError("Payment could not be completed.") from original_error
```

When Python prints the traceback for this, it explicitly shows:
```text
The above exception was the direct cause of the following exception:
PaymentGatewayError: Payment could not be completed.
```
The original error is preserved in the `__cause__` attribute of the new exception.

---

## 4. Suppressing Context with `raise ... from None`

If the low-level exception exposes sensitive internal details (like database credentials, internal server IPs, or confusing library internals) that would confuse API consumers, suppress the chain using `from None`:

```python
def parse_security_pin(raw_pin: str) -> int:
    try:
        return int(raw_pin)
    except ValueError:
        # Hide the underlying ValueError traceback completely
        raise ValueError("PIN must consist of 4 to 6 numeric digits.") from None
```

Now, the traceback will *only* show `ValueError: PIN must consist of 4 to 6 numeric digits.` without the secondary "During handling of the above exception..." message.

---

## 5. Defensive Programming Best Practices

1. **Always include informative error messages**: Avoid `raise ValueError()`. Prefer `raise ValueError(f"Expected positive price, got {price}")`.
2. **Choose the most appropriate built-in exception**:
   - Bad argument type: `TypeError`
   - Bad argument value/range: `ValueError`
   - Feature not ready: `NotImplementedError`
   - State violation: `RuntimeError`
3. **Never raise strings**: In modern Python, `raise "Error"` is a fatal `TypeError`. You must raise an `Exception` instance or class.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Raising String Literals
In modern Python, you must raise an instance or subclass of `BaseException`. Writing `raise "Error"` results in an immediate `TypeError`.

### 2. Losing Original Exception Tracebacks
When re-raising or transforming an exception, use `raise NewException(...) from err` to preserve the causal chain for easier debugging.

---

---

## 💻 Try It Yourself: Inventory Stock Guard

### Scenario
Write a function `dispense_item(inventory, item_name, count)` that raises `KeyError` if the item is not in stock and `ValueError` if the requested count exceeds available stock.

### Complete Solution
```python
def dispense_item(inventory: dict, item: str, count: int):
    if item not in inventory:
        raise KeyError(f"Item '{item}' is not tracked in inventory.")
    if count <= 0:
        raise ValueError("Requested count must be positive.")
    if count > inventory[item]:
        raise ValueError(f"Insufficient stock for '{item}'. Requested: {count}, Available: {inventory[item]}")
    
    inventory[item] -= count
    print(f"Dispensed {count}x '{item}'. Remaining: {inventory[item]}")

stock = {"Laptops": 5, "Mice": 20}
try:
    dispense_item(stock, "Laptops", 3)
    dispense_item(stock, "Keyboards", 1)
except (KeyError, ValueError) as err:
    print(f"Error caught: {err}")
```

### Expected Output
```text
Dispensed 3x 'Laptops'. Remaining: 2
Error caught: 'Item \'Keyboards\' is not tracked in inventory.'
```

---

## Practice Quiz

### 1. Which keyword is used in Python to intentionally trigger an exception?
A. `throw`
B. `fire`
C. `raise`
D. `emit`
**Answer:** C
**Explanation:** In Python, the `raise` keyword is used to trigger exceptions (unlike Java/JavaScript which use `throw`).
---

### 2. What happens when a bare `raise` is executed inside an `except` block?
A. It resets all global variables
B. It re-raises the active exception being handled, preserving the traceback
C. It raises a `RuntimeError`
D. It silently suppresses the error
**Answer:** B
**Explanation:** A bare `raise` re-propagates the active exception that was caught by the current `except` block.
---

### 3. How do you explicitly chain a new exception to an underlying causal exception?
A. `raise NewError(msg).with_cause(old_err)`
B. `raise NewError(msg) from old_err`
C. `raise NewError(msg) -> old_err`
D. `raise NewError(msg) under old_err`
**Answer:** B
**Explanation:** Python's `raise NewException from original_exception` syntax chains the two exceptions, setting the `__cause__` attribute.
---

### 4. What is the effect of writing `raise CustomError("Failed") from None`?
A. It causes Python to enter an infinite loop
B. It suppresses the original exception's traceback context from being displayed
C. It deletes the error log
D. It returns `None` instead of raising an error
**Answer:** B
**Explanation:** `from None` explicitly suppresses the previous exception context (`__context__`), showing only the newly raised exception in tracebacks.
---

### 5. What error is raised if a programmer attempts to execute `raise "Invalid Input"`?
A. `ValueError`
B. `TypeError`
C. `SyntaxError`
D. `StringException`
**Answer:** B
**Explanation:** In Python 3, exceptions must inherit from `BaseException`. Raising a string or any non-exception object raises a `TypeError: exceptions must derive from BaseException`.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Creating Custom Exceptions** (6: Exception Handling).

👉 **[Continue to Next Lesson: Creating Custom Exceptions →](/tutorials/python-for-intermediate/creating-custom-exceptions)**
