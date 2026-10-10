---
id: python-default-vs-keyword-arguments
slug: default-vs-keyword-arguments
course: python-for-intermediate
chapter: "2: Functions Deep Dive"
topic: "2.2 Default vs Keyword Arguments"
title: "Default vs Keyword Arguments & The Mutable Default Trap"
description: "Master function argument semantics, definition-time evaluation, the infamous mutable default argument trap, the None sentinel pattern, and positional-only / delimiters."
difficulty: Intermediate
readingTime: 14
order: 7
keywords:
  - default arguments
  - keyword arguments
  - mutable default trap
  - sentinel pattern
  - positional only
  - function defaults
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Default vs Keyword Arguments & The Mutable Default Trap

In Python, function parameters can be supplied with default values to make arguments optional. While intuitive at first glance, parameter evaluation in Python operates under a crucial architectural mechanism that catches even experienced engineers off-guard: **Default arguments are evaluated exactly once at definition time (when the function is first loaded into memory), NOT every time the function is called.**

This mechanism leads to one of Python's most notorious bugs: the **Mutable Default Argument Trap**. In this lesson, you will master function parameter mechanics, inspect `__defaults__` in memory, implement the `None` sentinel pattern, and utilize positional-only (`/`) and keyword-only (`*`) markers.

---

## Real-World Analogy: The Shared Office Chai Thermos

Imagine a shared community chai thermos in a busy Indian office pantry:

```
+-------------------------------------------------------------------------+
|                  THE SHARED OFFICE CHAI THERMOS ANALOGY                 |
+-------------------------------------------------------------------------+
|                                                                         |
|  The Mutable Trap: def pour_chai(cup, tray=[]):                         |
|  ──> Python creates ONE single physical tray in RAM at compile time!    |
|                                                                         |
|  Employee 1 (Aman): Calls pour_chai("Masala Chai")                      |
|  ──> Puts cup on the shared tray: ['Masala Chai']                       |
|                                                                         |
|  Employee 2 (Priya): Calls pour_chai("Ginger Tea")                      |
|  ──> Expects a fresh tray, but receives Aman's leftover tray!           |
|  ──> Tray now holds: ['Masala Chai', 'Ginger Tea'] (Data Leakage!)      |
|                                                                         |
|  The Sentinel Fix: def pour_chai(cup, tray=None):                       |
|  ──> if tray is None: tray = []                                         |
|  ──> Every employee gets their own fresh, private, clean tray!          |
|                                                                         |
+-------------------------------------------------------------------------+
```

When you write `tray=[]` in the `def` header, Python binds a single list in heap memory when the file is imported. Every call that omits the parameter mutates that exact same list object.

---

## Under the Hood: The `__defaults__` Tuple

To understand why this occurs, inspect the function object's internal attribute `__defaults__`:

```python
def add_item(item, basket=[]):
    basket.append(item)
    return basket

# Python stores the default value in the function object itself!
print(add_item.__defaults__)  # ([],)

add_item("Apple")
print(add_item.__defaults__)  # (['Apple'],) <-- Mutated in-place!

add_item("Banana")
print(add_item.__defaults__)  # (['Apple', 'Banana'],) <-- Persists!
```

Because Python functions are first-class objects created when the `def` statement executes, the default value expression is evaluated once and attached to `func.__defaults__`.

---

## The Gold-Standard Sentinel Pattern

To safely supply a fresh mutable container (list, dictionary, set) on every call, use `None` as the default argument:

```
+------------------------------------+------------------------------------+
|  Anti-Pattern (Dangerous Mutation) |  Gold-Standard (Sentinel Pattern)  |
+------------------------------------+------------------------------------+
|  def log_event(msg, events=[]):    |  def log_event(msg, events=None):  |
|      events.append(msg)            |      if events is None:            |
|      return events                 |          events = []  # Fresh!     |
|                                    |      events.append(msg)            |
|                                    |      return events                 |
+------------------------------------+------------------------------------+
```

---

## Comprehensive Code Examples

### 1. The Mutable Default Trap Demonstrated and Fixed

```python
# ANTI-PATTERN: Shared mutable list
def append_student_bad(name, roster=[]):
    roster.append(name)
    return roster

print("--- Bad Pattern (Shared Mutation) ---")
batch1 = append_student_bad("Aarav")
print("Batch 1:", batch1)

batch2 = append_student_bad("Sneha")  # Expected only ['Sneha']!
print("Batch 2:", batch2)  # Sneha received Aarav's data!

# GOLD STANDARD: Sentinel Pattern
def append_student_good(name, roster=None):
    if roster is None:
        roster = []  # Fresh list allocated in RAM per invocation
    roster.append(name)
    return roster

print("\n--- Gold Standard (Isolated Invocations) ---")
fresh_batch1 = append_student_good("Aarav")
print("Fresh Batch 1:", fresh_batch1)

fresh_batch2 = append_student_good("Sneha")
print("Fresh Batch 2:", fresh_batch2)  # Clean and isolated!
```

**Expected Output:**
```text
--- Bad Pattern (Shared Mutation) ---
Batch 1: ['Aarav']
Batch 2: ['Aarav', 'Sneha']

--- Gold Standard (Isolated Invocations) ---
Fresh Batch 1: ['Aarav']
Fresh Batch 2: ['Sneha']
```

---

### 2. Positional-Only (`/`) vs Keyword-Only (`*`) Parameters

Introduced in Python 3.8 (PEP 570), the forward slash `/` indicates that parameters before it are **positional-only**, while the asterisk `*` indicates that parameters after it are **keyword-only**:

```python
# Syntax Structure:
# (positional_only, /, standard_args, *, keyword_only)

def configure_server(ip_address, port, /, protocol="HTTPS", *, timeout=30, debug_mode=False):
    return {
        "address": f"{protocol.lower()}://{ip_address}:{port}",
        "timeout": timeout,
        "debug": debug_mode
    }

# 1. Valid Call:
s1 = configure_server("192.168.1.1", 8080, "HTTP", timeout=60, debug_mode=True)
print("Configured Server:", s1)

# 2. What happens if we pass 'ip_address' as a keyword?
# configure_server(ip_address="192.168.1.1", port=8080)
# --> TypeError: configure_server() got some positional-only arguments passed as keyword arguments: 'ip_address, port'

# 3. What happens if we pass 'timeout' positionally?
# configure_server("192.168.1.1", 8080, "HTTP", 60)
# --> TypeError: configure_server() takes from 2 to 3 positional arguments but 4 were given
```

**Expected Output:**
```text
Configured Server: {'address': 'http://192.168.1.1:8080', 'timeout': 60, 'debug': True}
```

---

### 3. Dynamic Default Evaluation (The Datetime Trap)

Another classic pitfall is calling a function like `datetime.now()` in the parameter definition:

```python
from datetime import datetime
import time

# ANTI-PATTERN: Evaluates datetime.now() once when the module imports!
def log_transaction_bad(txn_id, created_at=datetime.now()):
    return f"TXN {txn_id} stamped at {created_at.strftime('%H:%M:%S')}"

# GOLD STANDARD: Evaluates datetime.now() inside the function at call time!
def log_transaction_good(txn_id, created_at=None):
    if created_at is None:
        created_at = datetime.now()
    return f"TXN {txn_id} stamped at {created_at.strftime('%H:%M:%S')}"

t1 = log_transaction_good("101")
print(t1)

time.sleep(1)  # Wait 1 second

t2 = log_transaction_good("102")
print(t2)  # Notice the timestamp updates accurately!
```

**Expected Output:**
```text
TXN 101 stamped at 15:04:47
TXN 102 stamped at 15:04:48
```

---

## Best Practices & Comparison: Do's and Don'ts

| Practice | Dangerous Anti-Pattern | Recommended Gold Standard |
| :--- | :--- | :--- |
| **Mutable Defaults** | `def fn(data=[]):` | `def fn(data=None): if data is None: data = []` |
| **Dict Defaults** | `def config(options={}):` | `def config(options=None): if options is None: options = {}` |
| **Timestamps** | `def stamp(time=datetime.now()):` | `def stamp(time=None): if time is None: time = datetime.now()` |
| **API Parameter Locks**| Exposing internal variable names blindly | Use `/` for positional-only to safely rename parameters later |
| **Flags & Booleans** | `def process(x, False, True):` (Cryptic!) | `def process(x, *, dry_run=False, verbose=True):` (Clear!) |

---

## Quick Revision Summary Cheat Sheet

- **Definition-Time Evaluation:** Default argument expressions execute once when the function is defined, not per call.
- **The Mutable Trap:** Using `[]`, `{}`, or `set()` as defaults leads to state sharing across independent invocations.
- **The Sentinel Idiom:** Set parameter to `None`, then instantiate `val = []` or `val = {}` inside the function body.
- **Positional-Only (`/`):** Parameters to the left of `/` cannot be called via `name=val`.
- **Keyword-Only (`*`):** Parameters to the right of `*` must be specified explicitly via `name=val`.

---

---

# Practice Challenge

### Scenario: Safe Multi-Tenant Banking Transaction Logger

A banking system in Mumbai records customer transactions. A junior developer wrote the following flawed function:
```python
def record_transaction(account_id, amount, txn_type="Credit", audit_log=[]):
    audit_log.append(f"{txn_type} ₹{amount} for {account_id}")
    return audit_log
```
Because of the mutable default argument trap, transactions from different bank customers are leaking into each other's audit logs!

Your task:
1. Refactor `record_transaction` using the **Sentinel Pattern** (`audit_log=None`).
2. Add positional-only constraints so that `account_id` and `amount` must be passed positionally.
3. Add a keyword-only constraint so that `txn_type` must be passed as a keyword argument (`*, txn_type="Credit"`).
4. Demonstrate that two independent transactions for different customers maintain completely separate, isolated audit logs.

### Starter Code
```python
# Refactor this flawed implementation
def record_transaction(account_id, amount, txn_type="Credit", audit_log=[]):
    audit_log.append(f"{txn_type} ₹{amount} for {account_id}")
    return audit_log
```

### Complete Solution
```python
# Refactored Gold-Standard Implementation
def record_transaction(account_id, amount, /, *, txn_type="Credit", audit_log=None):
    # Sentinel pattern: guarantee fresh list per call
    if audit_log is None:
        audit_log = []
    
    entry = f"{txn_type.upper()} of ₹{amount:,.2f} on Account [{account_id}]"
    audit_log.append(entry)
    return audit_log

# Test customer 1: Aarav
aarav_log = record_transaction("SBIN-101", 5000.0, txn_type="Credit")
print("Aarav's Initial Log:", aarav_log)

# Test customer 2: Priya (Must NOT contain Aarav's transaction!)
priya_log = record_transaction("HDFC-999", 12500.0, txn_type="Debit")
print("Priya's Private Log:", priya_log)

# Append subsequent transaction to Aarav's existing log explicitly
record_transaction("SBIN-101", 1200.0, txn_type="Debit", audit_log=aarav_log)
print("Aarav's Updated Log:", aarav_log)
```

### Expected Output
```text
Aarav's Initial Log: ['CREDIT of ₹5,000.00 on Account [SBIN-101]']
Priya's Private Log: ['DEBIT of ₹12,500.00 on Account [HDFC-999]']
Aarav's Updated Log: ['CREDIT of ₹5,000.00 on Account [SBIN-101]', 'DEBIT of ₹1,200.00 on Account [SBIN-101]']
```

---

## Practice Quiz

### 1. When is a default argument expression like def func(x=[]): evaluated in Python?
A. Every time the function is called
B. Exactly once, when the def statement is first executed by the interpreter
C. Only when an error occurs
D. When the program exits
**Answer:** B
**Explanation:** Python evaluates default parameter expressions once at function definition time, storing them in the function's `__defaults__` tuple.

---

### 2. What is the output of the following code snippet?
```python
def add(item, box=[]):
    box.append(item)
    return len(box)

print(add(1), add(2), add(3))
```
A. `1 1 1`
B. `1 2 3`
C. `3 3 3`
D. `TypeError`
**Answer:** B
**Explanation:** Because `box=[]` is created once, each invocation appends to the same list. On call 1, `box` has 1 item; on call 2, it has 2 items; on call 3, it has 3 items. The output is `1 2 3`.

---

### 3. What is the recommended idiom to avoid the mutable default argument trap?
A. Use a tuple as default: `box=()`
B. Set the default to `None` and initialize the mutable object inside the function body if the argument is `None`
C. Pass an empty string
D. Delete the function after each use
**Answer:** B
**Explanation:** The `None` sentinel pattern (`def func(param=None): if param is None: param = []`) ensures a brand-new list is allocated dynamically in memory on every call where no argument is passed.

---

### 4. Given def calculate(a, b, /, c, *, d):, how can argument 'a' be passed?
A. Only as a keyword argument: `calculate(a=1, ...)`
B. Only positionally: `calculate(1, ...)`
C. Either positionally or as keyword
D. It cannot be passed
**Answer:** B
**Explanation:** In Python parameter syntax, all parameters preceding the slash `/` are positional-only. Passing `a` as a keyword argument raises a `TypeError`.

---

### 5. Why should datetime.now() NOT be written directly as a default argument: def create_record(timestamp=datetime.now())?
A. Because datetime objects cannot be default arguments
B. Because it freezes the timestamp to the exact millisecond when the script was launched, rather than recording the actual time of each record creation
C. Because it consumes 100% CPU
D. Because datetime.now() is an asynchronous coroutine
**Answer:** B
**Explanation:** Since default expressions evaluate at import/definition time, `timestamp` will hold the static timestamp of when the function was compiled, failing to capture the time of future function calls.
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Closures** (2: Functions Deep Dive).

👉 **[Continue to Next Lesson: Closures →](/tutorials/python-for-intermediate/closures)**
