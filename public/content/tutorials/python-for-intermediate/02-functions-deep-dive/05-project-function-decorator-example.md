---
id: python-project-function-decorator-example
slug: project-function-decorator-example
course: python-for-intermediate
chapter: "2: Functions Deep Dive"
topic: "2.5 Project: Function Decorator Example"
title: "Project: Production Decorators (Retry, Cache, and Rate-Limiter)"
description: "Build an industrial-grade Decorator Suite featuring parameterized retry mechanisms, in-memory memoization caching, and sliding-window rate limiting."
difficulty: Intermediate
readingTime: 16
order: 10
keywords:
  - project
  - decorators project
  - decorators with arguments
  - retry decorator
  - memoization
  - rate limiter
  - production python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Production Decorators (Retry, Cache, and Rate-Limiter)

Welcome to the Chapter 2 Capstone Project! In modern microservices and backend web engineering, decorators provide non-invasive resilience, security, and performance optimizations.

In this project, you will build a production-grade **UPI Banking Resilience Decorator Suite** incorporating three industry-standard patterns:
1. **Decorators with Arguments:** The three-tier closure pattern (`def decorator_factory(param): def decorator(func): def wrapper(...)`).
2. **Exponential Retry Decorator (`@retry_on_failure`):** Automatically retries transient network or database errors with exponential backoff.
3. **Memoization Cache Decorator (`@memoize`):** Eliminates redundant compute and database queries by caching return values in memory.
4. **Sliding-Window Rate Limiter (`@rate_limit`):** Protects sensitive financial APIs against high-frequency abuse.

---

## Real-World Analogy: The UPI Payment Gateway Shield

Imagine the payment processing pipeline powering Indian UPI transactions (PhonePe, Google Pay, Paytm):

```
+-------------------------------------------------------------------------+
|                  UPI PAYMENT GATEWAY RESILIENCE SHIELD                  |
+-------------------------------------------------------------------------+
|                                                                         |
|  Incoming Customer Payment: UPI ₹500 via HDFC Bank                     |
|                               │                                         |
|                               ▼                                         |
|  1. @rate_limit(max_per_sec=3) ──> Blocks automated bots & spamming     |
|                               │ (Allowed)                               |
|                               ▼                                         |
|  2. @memoize_cache             ──> Instantly returns cached bank IFSC &  |
|                                    branch coordinates without DB hit    |
|                               │ (Not cached yet)                        |
|                               ▼                                         |
|  3. @retry_on_failure(3)      ──> If cellular tower drops packet,       |
|                                    silently retries bank switch 3 times |
|                               │ (Success!)                              |
|                               ▼                                         |
|  Core Banking Service: process_payment() Executes Successfully!         |
|                                                                         |
+-------------------------------------------------------------------------+
```

By wrapping our core payment function with these modular decorators, the business logic remains clean, readable, and 100% focused on financial accounting, while the decorators handle reliability and defense.

---

## Three-Tier Architecture: Decorators That Accept Arguments

When a decorator needs configuration parameters (e.g. `@retry(max_attempts=3)`), it requires **three levels of nested functions**:

```
+-------------------------------------------------------------------------+
|                 THREE-TIER PARAMETERIZED DECORATOR PATTERN              |
+-------------------------------------------------------------------------+
|                                                                         |
|  def retry(max_attempts=3):          <-- 1. Decorator Factory (takes cfg)|
|      def actual_decorator(func):     <-- 2. Decorator (takes function)  |
|          @wraps(func)                                                   |
|          def wrapper(*args, **kwargs):<-- 3. Wrapper Closure (at call)   |
|              # Execution logic using max_attempts and func              |
|              return func(*args, **kwargs)                               |
|          return wrapper                                                 |
|      return actual_decorator                                            |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## Complete Production-Grade Implementation

Here is the complete, modular, runnable code for the Decorator Suite:

```python
"""
MSK Python Capstone: Industrial Resilience Decorator Suite
Author: MSK Institute
"""
import time
from functools import wraps

# -------------------------------------------------------------
# Decorator 1: In-Memory Memoization Cache
# -------------------------------------------------------------
def memoize(func):
    """Caches deterministic function results using an in-memory dictionary."""
    cache = {}

    @wraps(func)
    def wrapper(*args):
        # Arguments serve as composite hash key
        if args in cache:
            print(f"[CACHE HIT] Returning cached result for {func.__name__}{args}")
            return cache[args]
        
        print(f"[CACHE MISS] Computing new result for {func.__name__}{args}")
        result = func(*args)
        cache[args] = result
        return result

    return wrapper

# -------------------------------------------------------------
# Decorator 2: Parameterized Retry on Failure
# -------------------------------------------------------------
def retry_on_failure(max_retries=3, delay_seconds=0.1, allowed_exceptions=(Exception,)):
    """Retries a failing function up to max_retries times before propagating error."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_retries:
                try:
                    return func(*args, **kwargs)
                except allowed_exceptions as err:
                    attempts += 1
                    print(f"[RETRY WARNING] Attempt {attempts}/{max_retries} failed for '{func.__name__}': {err}")
                    if attempts >= max_retries:
                        print(f"[RETRY EXHAUSTED] Max retries reached. Raising exception.")
                        raise err
                    time.sleep(delay_seconds)
        return wrapper
    return decorator

# -------------------------------------------------------------
# Decorator 3: Sliding-Window Rate Limiter
# -------------------------------------------------------------
def rate_limiter(max_calls=3, period_seconds=1.0):
    """Limits the number of function executions within a specified time window."""
    def decorator(func):
        invocation_timestamps = []

        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal invocation_timestamps
            current_time = time.time()
            
            # Prune timestamps older than the sliding window
            invocation_timestamps = [t for t in invocation_timestamps if current_time - t <= period_seconds]
            
            if len(invocation_timestamps) >= max_calls:
                raise PermissionError(
                    f"Rate limit exceeded for '{func.__name__}'! Allowed: {max_calls} calls per {period_seconds}s."
                )
            
            invocation_timestamps.append(current_time)
            return func(*args, **kwargs)
        return wrapper
    return decorator


# -------------------------------------------------------------
# Demonstration & Verification
# -------------------------------------------------------------

# Test Service 1: IFSC Branch Lookup (Demonstrating Memoization)
@memoize
def fetch_bank_branch(ifsc_code):
    """Simulates a heavy remote database lookup for bank IFSC codes."""
    time.sleep(0.05)  # Simulate network latency
    mock_db = {
        "SBIN000101": {"bank": "State Bank of India", "branch": "Connaught Place, New Delhi"},
        "HDFC000452": {"bank": "HDFC Bank", "branch": "Bandra West, Mumbai"}
    }
    return mock_db.get(ifsc_code, {"error": "Invalid IFSC"})

# Test Service 2: Unstable UPI Server Connection (Demonstrating Retry)
flaky_counter = 0

@retry_on_failure(max_retries=3, delay_seconds=0.05, allowed_exceptions=(ConnectionError,))
def connect_to_npci_switch(vpa_id):
    """Simulates a network call that fails twice before succeeding."""
    global flaky_counter
    flaky_counter += 1
    if flaky_counter < 3:
        raise ConnectionError("NPCI Central Switch timeout: Packet dropped on cellular link")
    return f"CONNECTED to NPCI for VPA '{vpa_id}' on attempt {flaky_counter}"

# Test Service 3: Fast Withdrawal API (Demonstrating Rate Limiting)
@rate_limiter(max_calls=2, period_seconds=0.5)
def send_otp(phone_number):
    return f"OTP sent to +91 {phone_number}"


if __name__ == "__main__":
    print("=== 1. Testing Memoization Cache Decorator ===")
    print(fetch_bank_branch("SBIN000101"))
    # Second call should hit the cache immediately!
    print(fetch_bank_branch("SBIN000101"))

    print("\n=== 2. Testing Retry Mechanism Decorator ===")
    connection_status = connect_to_npci_switch("user@oksbi")
    print(f"Final Status: {connection_status}")

    print("\n=== 3. Testing Sliding-Window Rate Limiter ===")
    print(send_otp("9876543210"))
    print(send_otp("9876543210"))
    try:
        # Third call within 0.5s window must be blocked
        print(send_otp("9876543210"))
    except PermissionError as e:
        print(f"[BLOCKED AS EXPECTED] {e}")
```

---

## Expected Output

```text
=== 1. Testing Memoization Cache Decorator ===
[CACHE MISS] Computing new result for fetch_bank_branch('SBIN000101',)
{'bank': 'State Bank of India', 'branch': 'Connaught Place, New Delhi'}
[CACHE HIT] Returning cached result for fetch_bank_branch('SBIN000101',)
{'bank': 'State Bank of India', 'branch': 'Connaught Place, New Delhi'}

=== 2. Testing Retry Mechanism Decorator ===
[RETRY WARNING] Attempt 1/3 failed for 'connect_to_npci_switch': NPCI Central Switch timeout: Packet dropped on cellular link
[RETRY WARNING] Attempt 2/3 failed for 'connect_to_npci_switch': NPCI Central Switch timeout: Packet dropped on cellular link
Final Status: CONNECTED to NPCI for VPA 'user@oksbi' on attempt 3

=== 3. Testing Sliding-Window Rate Limiter ===
OTP sent to +91 9876543210
OTP sent to +91 9876543210
[BLOCKED AS EXPECTED] Rate limit exceeded for 'send_otp'! Allowed: 2 calls per 0.5s.
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Bad Implementation | Gold-Standard Implementation |
| :--- | :--- | :--- |
| **Parameterized Decorators** | Trying to pass arguments to a 2-tier decorator | Use 3-tier pattern: Factory $\to$ Decorator $\to$ Wrapper |
| **Retry Interception** | Catching all exceptions (`except:`) blindly | Catch only transient network errors (`allowed_exceptions=(...)`) |
| **Cache Keys** | Using unhashable objects as cache keys | Normalize arguments to tuples or immutable representations |
| **Cache Growth** | Allowing unbounded cache memory growth | Use LRU (Least Recently Used) cache or bounded dictionary size |
| **Rate Limiting** | Static counters that never reset | Sliding-window timestamp pruning with `time.time()` |

---

## Quick Revision Summary Cheat Sheet

- **Parameterized Decorator:** `def factory(config): def dec(func): def wrapper(*args, **kw): ...`
- **Memoization:** Storing `cache[args] = func(*args)` avoids expensive re-computation of pure functions.
- **Resilience:** `@retry_on_failure` turns fragile network calls into fault-tolerant distributed operations.
- **Security:** `@rate_limiter` uses timestamp filtering to prevent denial-of-service and brute-force attacks.
- **Composition:** Multiple decorators can be stacked together to create resilient, cached, and secure endpoints.

---

---

# Practice Challenge

### Scenario: Structured Execution Logger Decorator with File Output

Build a logging decorator `@log_to_file(filepath="app_audit.log")` that:
1. Accepts an optional `filepath` argument (defaulting to `"app_audit.log"`).
2. Intercepts function execution and records:
   - Current ISO timestamp.
   - Function name.
   - Arguments passed (`args` and `kwargs`).
   - Function return value or exception raised.
3. Appends the log record to the specified file using the `with open(filepath, "a")` context manager.
4. Preserves function metadata using `@wraps`.

### Starter Code
```python
from functools import wraps
from datetime import datetime

def log_to_file(filepath="app_audit.log"):
    # TODO: Implement 3-tier parameterized decorator with file appending
    pass
```

### Complete Solution
```python
import os
from functools import wraps
from datetime import datetime

def log_to_file(filepath="app_audit.log"):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            try:
                result = func(*args, **kwargs)
                log_entry = f"[{timestamp}] SUCCESS: {func.__name__} args={args} kwargs={kwargs} -> {result}\n"
                with open(filepath, "a", encoding="utf-8") as f:
                    f.write(log_entry)
                return result
            except Exception as err:
                log_entry = f"[{timestamp}] ERROR: {func.__name__} args={args} kwargs={kwargs} -> {type(err).__name__}: {err}\n"
                with open(filepath, "a", encoding="utf-8") as f:
                    f.write(log_entry)
                raise err
        return wrapper
    return decorator

# Test Service
AUDIT_LOG = "test_audit.log"
if os.path.exists(AUDIT_LOG):
    os.remove(AUDIT_LOG)

@log_to_file(filepath=AUDIT_LOG)
def transfer_upi(sender, receiver, amount):
    if amount <= 0:
        raise ValueError("Transfer amount must be positive!")
    return f"TXN-{int(amount * 100)}"

# Run valid transaction
t1 = transfer_upi("arjun@sbi", "priya@hdfc", 1500.0)
print("Transfer 1:", t1)

# Run invalid transaction
try:
    transfer_upi("arjun@sbi", "priya@hdfc", -50.0)
except ValueError:
    print("Caught expected ValueError on negative transfer.")

# Verify log file content
print("\n--- Generated Audit Log File ---")
with open(AUDIT_LOG, "r", encoding="utf-8") as f:
    print(f.read().strip())
```

### Expected Output
```text
Transfer 1: TXN-150000
Caught expected ValueError on negative transfer.

--- Generated Audit Log File ---
[2026-09-12 15:05:00] SUCCESS: transfer_upi args=('arjun@sbi', 'priya@hdfc', 1500.0) kwargs={} -> TXN-150000
[2026-09-12 15:05:00] ERROR: transfer_upi args=('arjun@sbi', 'priya@hdfc', -50.0) kwargs={} -> ValueError: Transfer amount must be positive!
```

---

## Practice Quiz

### 1. How many levels of nested functions are required to implement a decorator that accepts configuration arguments, like @retry(max_retries=5)?
A. 1
B. 2
C. 3
D. 4
**Answer:** C
**Explanation:** A parameterized decorator requires 3 tiers: (1) An outer Factory function accepting configuration parameters, (2) an intermediate Decorator function accepting the target function, and (3) an inner Wrapper closure executing at call-time.

---

### 2. In the memoization decorator, why can args be used directly as a dictionary cache key?
A. Because all function arguments in Python are automatically converted to strings
B. Because `*args` packs positional arguments into an immutable `tuple`, which is hashable
C. Because Python dictionaries accept mutable lists as keys
D. Because memoization only works with numbers
**Answer:** B
**Explanation:** In Python, `*args` produces an immutable `tuple`. As long as the arguments passed into the function are hashable, tuples can serve directly as dictionary keys.

---

### 3. What is the danger of writing an unconstrained retry decorator with while True and no maximum attempt limit?
A. The computer screen turns black
B. If a service is permanently offline, the program enters an infinite loop, starving CPU threads and preventing recovery
C. Python deletes the file after 100 loops
D. Memory is automatically wiped
**Answer:** B
**Explanation:** Unbounded retries cause thread starvation and runaway CPU utilization if an external dependency suffers an outage. Production retry logic must enforce a strict `max_retries` ceiling.

---

### 4. How does the sliding-window rate limiter prune expired request timestamps?
A. By deleting the dictionary
B. By using a list comprehension: `[t for t in timestamps if current_time - t <= period_seconds]`
C. By resetting the computer's system clock
D. By terminating the thread
**Answer:** B
**Explanation:** Filtering timestamps by `current_time - t <= period_seconds` removes all historical invocations that occurred outside the active time window, keeping only recent active calls.

---

### 5. What will happen if you apply both @memoize and @retry_on_failure to a function?
A. A SyntaxError is raised
B. The decorators compose together, providing both caching and retry capabilities according to their stacking order
C. The function is deleted
D. Python runs them in random sequence
**Answer:** B
**Explanation:** Python decorators compose cleanly. Stacking `@memoize` above `@retry_on_failure` first checks the cache; if not found, it invokes the retrying wrapper to fetch the value safely.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Creating and Importing Modules** (3: Modules and Packages).

👉 **[Continue to Next Lesson: Creating and Importing Modules →](/tutorials/python-for-intermediate/creating-and-importing-modules)**
