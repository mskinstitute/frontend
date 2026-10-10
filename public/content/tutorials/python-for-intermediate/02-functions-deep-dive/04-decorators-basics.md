---
id: python-decorators-basics
slug: decorators-basics
course: python-for-intermediate
chapter: "2: Functions Deep Dive"
topic: "2.4 Decorators Basics"
title: "Python Decorators: Core Mechanics, @ Syntax, and functools.wraps"
description: "Master Python decorators, understanding first-class functions, the @ syntactic sugar, wrapper closures, functools.wraps metadata preservation, and decorator chaining."
difficulty: Intermediate
readingTime: 14
order: 9
keywords:
  - decorators
  - functools wraps
  - wrapper function
  - syntactic sugar
  - meta programming
  - function chaining
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Python Decorators: Core Mechanics, @ Syntax, and functools.wraps

Decorators are one of Python's most celebrated and signature design patterns. They allow you to modify or extend the behavior of a function or method **without permanently altering its underlying source code**.

From web frameworks like FastAPI and Flask (`@app.get("/")`, `@login_required`) to testing suites (`@pytest.mark.parametrize`), decorators are ubiquitous across modern Python. In this lesson, you will master decorator architecture from first principles, understand the `@` syntax, preserve metadata with `functools.wraps`, and chain multiple decorators.

---

## Real-World Analogy: The Diwali Gift Wrap & VIP Security Escort

Imagine giving a box of Kaju Katli sweets to a colleague for Diwali:

```
+-------------------------------------------------------------------------+
|                  THE FESTIVE GIFT WRAPPING ANALOGY                      |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. Original Core Function:                                             |
|     ──> Pure box of delicious Kaju Katli sweets                         |
|                                                                         |
|  2. Decorator Wrapper:                                                  |
|     ──> Wraps the box in sparkling golden paper                         |
|     ──> Attaches a greeting ribbon and barcode                          |
|     ──> Inspects freshness before opening, seals safely afterward       |
|                                                                         |
|  3. The Experience:                                                     |
|     ──> The recipient still enjoys the original sweets, but with extra  |
|         security, beauty, and metadata attached!                       |
|                                                                         |
+-------------------------------------------------------------------------+
```

Alternatively, think of a **VIP Security Escort**: The dignitary's car (`original_function`) drives the same road, but the police escort vehicle clears traffic before arrival and logs security confirmation after departure.

---

## The Core Concept: What Does `@` Actually Mean?

The `@decorator` syntax is nothing more than elegant **syntactic sugar**.

```python
@my_decorator
def greet():
    print("Hello!")

# The interpreter translates the above @ syntax into this exact line:
greet = my_decorator(greet)
```

A decorator is simply a callable that takes a function as its input, wraps it inside an inner function, and returns the modified wrapper function.

---

## Standard Decorator Architecture

Here is the canonical gold-standard blueprint for any Python decorator:

```python
from functools import wraps

def my_decorator(target_func):
    """Outer function receives the target function to decorate."""
    @wraps(target_func)  # Crucial: preserves __name__ and __doc__!
    def wrapper(*args, **kwargs):
        # 1. PRE-EXECUTION LOGIC (security check, timer start, logging)
        print(f"[PRE] Preparing to run {target_func.__name__}...")
        
        # 2. INVOKE ORIGINAL FUNCTION
        result = target_func(*args, **kwargs)
        
        # 3. POST-EXECUTION LOGIC (timer end, cleanup, audit)
        print(f"[POST] Finished running {target_func.__name__} successfully.")
        
        # 4. RETURN RESULT
        return result
        
    return wrapper  # Return the wrapper closure
```

---

## Why `functools.wraps` Is Mandatory

When you wrap a function, the wrapper takes its place. Without `@wraps(target_func)`:
- `func.__name__` becomes `"wrapper"` instead of `"greet"`.
- `func.__doc__` is erased or replaced by the wrapper's docstring.
- Debuggers, stack traces, and IDE autocompletion show confusing names!

`@wraps(target_func)` automatically copies over the original name, docstring, parameter annotations, and module metadata.

---

## Comprehensive Code Examples

### 1. Building an Execution Timer Decorator

Benchmarking code performance is a classic use case for decorators:

```python
import time
from functools import wraps

def benchmark_timer(func):
    """Measures and logs elapsed execution time of any function."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        elapsed = end_time - start_time
        print(f"[PERF] '{func.__name__}' executed in {elapsed * 1000:.3f} ms")
        return result
    return wrapper

@benchmark_timer
def compute_prime_sum(limit):
    """Calculates sum of all numbers up to limit."""
    return sum(x for x in range(limit) if x % 2 != 0)

# Run decorated function
total = compute_prime_sum(1000000)
print(f"Total calculated: {total}")

# Verify that metadata was preserved by @wraps
print("Function Name :", compute_prime_sum.__name__)
print("Docstring     :", compute_prime_sum.__doc__)
```

**Expected Output:**
```text
[PERF] 'compute_prime_sum' executed in 45.120 ms
Total calculated: 250000000000
Function Name : compute_prime_sum
Docstring     : Calculates sum of all numbers up to limit.
```

---

### 2. Authorization Role Checker (Security Decorator)

In web applications, decorators verify that a user possesses necessary administrative credentials before granting access:

```python
from functools import wraps

# Simulated session state
CURRENT_USER = {"username": "vikram_admin", "role": "ADMIN"}

def require_admin(func):
    """Guards function execution by enforcing ADMIN role authorization."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        if CURRENT_USER.get("role") != "ADMIN":
            print(f"[SECURITY 403] Access Denied! User '{CURRENT_USER.get('username')}' is not an ADMIN.")
            return None
        return func(*args, **kwargs)
    return wrapper

@require_admin
def delete_database_record(record_id):
    print(f"[SUCCESS] Database Record #{record_id} purged permanently.")
    return True

# Admin user executes command
delete_database_record(4092)

# Demote user to guest and attempt execution
CURRENT_USER["role"] = "GUEST"
delete_database_record(4092)
```

**Expected Output:**
```text
[SUCCESS] Database Record #4092 purged permanently.
[SECURITY 403] Access Denied! User 'vikram_admin' is not an ADMIN.
```

---

### 3. Chaining Multiple Decorators: The Onion Peeling Order

When multiple decorators are applied to a single function, they execute in a specific order:

```python
from functools import wraps

def bold(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<b>{func(*args, **kwargs)}</b>"
    return wrapper

def italic(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return f"<i>{func(*args, **kwargs)}</i>"
    return wrapper

@bold
@italic
def format_announcement(msg):
    return msg

# Evaluated as: bold(italic(format_announcement))
# 'italic' wraps first, then 'bold' wraps outside!
print(format_announcement("Diwali Festive Sale!"))
```

**Expected Output:**
```text
<b><i>Diwali Festive Sale!</i></b>
```

> [!NOTE]
> **Chaining Order Rule:**
> Decorators stack bottom-up at definition time (`italic` wraps first, then `bold`), but execute top-down at runtime (`bold`'s wrapper runs before `italic`'s wrapper).

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad / Error-Prone Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Metadata Preservation** | Writing wrappers without `@wraps` | Always apply `@wraps(func)` to inner wrapper |
| **Parameter Handling** | Rigid parameters: `def wrapper(a, b):` | Universal forwarding: `def wrapper(*args, **kwargs):` |
| **Return Values** | Forgetting to `return result` from wrapper | Always capture and return the original function's result |
| **Side-Effects** | Executing code at decoration time instead of call time | Put runtime logic inside `wrapper`, not outer decorator |
| **Complex Nesting** | 5 chained decorators on 1 function | Avoid excessive decorator stacking; combine logic if possible |

---

## Quick Revision Summary Cheat Sheet

- **Definition:** A callable that takes a function, extends its behavior via a closure wrapper, and returns the modified callable.
- **Syntactic Sugar:** `@dec` directly translates to `fn = dec(fn)`.
- **`*args, **kwargs`:** Enables the wrapper to accept any arbitrary positional and keyword arguments.
- **`@functools.wraps`:** Essential helper that preserves the original function's identity, docstring, and annotations.
- **Chaining:** Stacks bottom-to-top at decoration time, runs top-to-bottom at execution time.

---

---

# Practice Challenge

### Scenario: Indian Retail Banking Transaction Audit Trail Decorator

Build an enterprise audit decorator `@audit_transaction` for an online banking portal:
1. Captures the account ID from the first positional argument.
2. Formats a log message: `"[AUDIT START] <function_name> invoked for Account: <account_id>"`.
3. Invokes the original transaction function.
4. If an exception occurs, logs `"[AUDIT FAILED] <error_type>: <error_message>"` and re-raises the exception.
5. If successful, logs `"[AUDIT SUCCESS] Transaction completed successfully"`.
6. Uses `@wraps` to preserve function identity.

### Starter Code
```python
from functools import wraps

def audit_transaction(func):
    # TODO: Implement audit wrapper with error handling and metadata preservation
    pass
```

### Complete Solution
```python
from functools import wraps

def audit_transaction(func):
    @wraps(func)
    def wrapper(account_id, *args, **kwargs):
        print(f"[AUDIT START] '{func.__name__}' initiated for Account: {account_id}")
        try:
            result = func(account_id, *args, **kwargs)
            print(f"[AUDIT SUCCESS] Transaction completed successfully.")
            return result
        except Exception as err:
            print(f"[AUDIT FAILED] {type(err).__name__}: {err}")
            raise err
    return wrapper

@audit_transaction
def withdraw_cash(account_id, amount):
    """Processes cash withdrawal with minimum balance safety."""
    current_balance = 10000.0  # Simulated balance
    if amount > current_balance:
        raise ValueError(f"Insufficient funds! Requested ₹{amount:,} but balance is ₹{current_balance:,}")
    return f"Dispensed ₹{amount:,}. Remaining: ₹{current_balance - amount:,}"

# Test 1: Successful Transaction
print("--- Test 1: Valid Withdrawal ---")
tx1 = withdraw_cash("SBIN-9901", 4000.0)
print("Result:", tx1)

# Test 2: Failed Transaction (Catches and logs failure)
print("\n--- Test 2: Insufficient Funds ---")
try:
    withdraw_cash("SBIN-9901", 15000.0)
except ValueError:
    print("[TEST PASSED] Exception was accurately intercepted and logged by audit decorator.")
```

### Expected Output
```text
--- Test 1: Valid Withdrawal ---
[AUDIT START] 'withdraw_cash' initiated for Account: SBIN-9901
[AUDIT SUCCESS] Transaction completed successfully.
Result: Dispensed ₹4,000.0. Remaining: ₹6,000.0

--- Test 2: Insufficient Funds ---
[AUDIT START] 'withdraw_cash' initiated for Account: SBIN-9901
[AUDIT FAILED] ValueError: Insufficient funds! Requested ₹15,000.0 but balance is ₹10,000.0
[TEST PASSED] Exception was accurately intercepted and logged by audit decorator.
```

---

## Practice Quiz

### 1. What is the expression @my_decorator above def my_func(): equivalent to in standard Python?
A. `my_func = my_decorator(my_func)`
B. `my_decorator = my_func()`
C. `my_func() + my_decorator()`
D. `import my_decorator`
**Answer:** A
**Explanation:** The `@decorator` syntax is syntactic sugar that passes the declared function into the decorator and rebinds the function's name to the returned wrapper: `my_func = my_decorator(my_func)`.

---

### 2. Why should @functools.wraps(func) be applied to the inner wrapper function?
A. It compiles the function to C code
B. It preserves the original function's metadata such as `__name__` and `__doc__`, preventing them from being overwritten by the wrapper
C. It allows functions to run without arguments
D. It prevents the function from ever raising exceptions
**Answer:** B
**Explanation:** Without `@functools.wraps(func)`, inspecting `func.__name__` returns `"wrapper"`, and docstrings are lost. `@wraps` copies the original function's introspection attributes onto the wrapper.

---

### 3. If a function is decorated with both @decorator_one and @decorator_two:
```python
@decorator_one
@decorator_two
def action(): pass
```
In what order are the decorators applied?
A. `decorator_two(decorator_one(action))`
B. `decorator_one(decorator_two(action))`
C. Randomly depending on system memory
D. Simultaneously in parallel threads
**Answer:** B
**Explanation:** Decorators apply from bottom to top (innermost to outermost). `action` is first wrapped by `decorator_two`, and the resulting wrapper is then passed to `decorator_one`.

---

### 4. What happens if a wrapper function omits return result after calling the target function?
A. The target function automatically returns `True`
B. Any caller of the decorated function will receive `None` instead of the target function's actual return value
C. Python throws a SyntaxError
D. The operating system reboots
**Answer:** B
**Explanation:** In Python, functions without an explicit `return` return `None`. If the wrapper does not return the result of `func(*args, **kwargs)`, callers receive `None` regardless of what the original function computed.

---

### 5. Why do wrapper functions typically declare def wrapper(*args, **kwargs):?
A. Because Python prohibits any other parameter names
B. To enable the decorator to wrap any function regardless of its parameter signature or arity
C. To convert inputs into hexadecimal numbers
D. To disable type checking
**Answer:** B
**Explanation:** Using `*args, **kwargs` makes the wrapper universal, allowing it to intercept, forward, and return calls for functions with zero parameters, multiple positional parameters, or complex keyword arguments.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Project: Function Decorator Example** (2: Functions Deep Dive).

👉 **[Continue to Next Lesson: Project: Function Decorator Example →](/tutorials/python-for-intermediate/project-function-decorator-example)**
