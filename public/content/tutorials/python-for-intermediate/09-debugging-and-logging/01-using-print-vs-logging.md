---
id: python-intermediate-using-print-vs-logging
slug: using-print-vs-logging
course: python-for-intermediate
chapter: "9: Debugging and Logging"
topic: "9.1 Using print vs logging"
title: "Using print vs logging in Python"
description: "Master using print vs logging in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 41
keywords:
  - python using print vs logging
  - python intermediate
  - python using print vs logging
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Using print() vs. Logging in Python

When beginning their programming journey, almost all developers rely on `print()` statements to inspect variables and track program execution. While `print()` is convenient for quick one-line script checks, it quickly breaks down in production-grade software. Python's built-in **`logging`** module offers a professional, configurable alternative designed specifically for monitoring, diagnostics, and audit tracking.

---

## 1. Why `print()` Fails in Production

Using `print()` for debugging introduces several critical defects into software architecture:

1. **No Severity Distinction**: An urgent database connection timeout looks identical to a routine informational message.
2. **Difficult to Turn Off**: When moving to production, developers must search and manually comment out or delete dozens of `print()` lines.
3. **No Contextual Metadata**: `print()` lacks automatic timestamps, filenames, line numbers, and thread identifiers.
4. **Output Destination Locked**: `print()` sends text exclusively to standard output (`sys.stdout`), whereas servers require structured log files, syslog daemons, or centralized monitoring services (e.g. Datadog, AWS CloudWatch).

---

## 2. Introducing Python's Built-in `logging` Module

Python provides the `logging` standard library module out of the box—no installation required.

### Basic Setup with `logging.basicConfig`

```python
import logging

# Configure global logging format and destination
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] (%(filename)s:%(lineno)d) - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

def process_order(order_id: str, amount: float):
    logging.info(f"Initiating checkout for Order #{order_id}")
    
    if amount <= 0:
        logging.error(f"Invalid order amount ₹{amount:.2f} for Order #{order_id}")
        return False
        
    logging.info(f"Payment processed successfully for Order #{order_id}")
    return True

process_order("ORD-104", 450.0)
process_order("ORD-105", -20.0)
```

### Output Produced:
```text
2026-09-12 15:45:01 [INFO] (app.py:10) - Initiating checkout for Order #ORD-104
2026-09-12 15:45:01 [INFO] (app.py:16) - Payment processed successfully for Order #ORD-104
2026-09-12 15:45:01 [INFO] (app.py:10) - Initiating checkout for Order #ORD-105
2026-09-12 15:45:01 [ERROR] (app.py:13) - Invalid order amount ₹-20.00 for Order #ORD-105
```

---

## 3. Writing Logs Directly to a File

By simply providing the `filename` argument, all log events are automatically appended to disk without modifying any of your business logic:

```python
import logging

logging.basicConfig(
    filename="app.log",
    filemode="a",  # 'a' for append, 'w' for overwrite on restart
    level=logging.WARNING,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("This info message will NOT be written because level is WARNING.")
logging.warning("Disk usage exceeds 85%.")
logging.error("Failed to connect to Redis cache.")
```

---

## 4. Modern Modular Logging: `getLogger(__name__)`

In multi-file modular applications, avoid calling the root `logging.info()` directly. Instead, instantiate a named logger per module using the module's `__name__`:

```python
import logging

# Instantiates a module-scoped logger
logger = logging.getLogger(__name__)

def database_query(query: str):
    logger.debug(f"Executing query: {query}")
    logger.info("Query returned 45 records.")
```

This pattern enables configuring distinct log levels for individual packages (e.g. keep your core database module at `DEBUG` while keeping external HTTP libraries at `WARNING`).

---

## 5. Architectural Comparison: `print()` vs. `logging`

| Feature | `print()` | Python `logging` Module |
| :--- | :--- | :--- |
| **Intended Purpose** | Displaying text directly to user | Diagnostic records, error auditing, monitoring |
| **Categorization** | None | 5 Standard Levels (`DEBUG` to `CRITICAL`) |
| **Metadata** | Manual string formatting | Automatic timestamp, file, function, line number |
| **Redirection** | Only stdout | Files, sockets, HTTP endpoints, email alerts |
| **Toggling** | Manual deletion/commenting | Single configuration flag (`level=...`) |
| **Performance** | Synchronous blocking I/O | Highly optimized, can be asynchronous/buffered |

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Leaving `print()` in Production Code
`print()` writes unformatted text to standard output without timestamps, severity levels, or source line numbers, and cannot be filtered or redirected without editing code.

### 2. String Concatenation in Logging Calls
Do not format strings using f-strings inside logger calls if the log level is disabled. Use parameterized logging: `logger.info("Processed %s items", count)` to save formatting overhead when logs are suppressed.

---

---

## 💻 Try It Yourself: Transitioning from Print to Logging

### Scenario
Refactor a script that uses multiple `print()` statements into a clean logging script that records timestamped messages with severity levels.

### Complete Solution
```python
import logging

# Configure basic logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

def process_payment(account_id, amount):
    logging.info("Initiating payment of ₹%s for account %s", amount, account_id)
    if amount <= 0:
        logging.error("Invalid transaction amount: ₹%s", amount)
        return False
    logging.info("Payment of ₹%s processed successfully.", amount)
    return True

process_payment("ACC-101", 500)
process_payment("ACC-102", -50)
```

### Expected Output
```text
2026-10-01 14:00:00 [INFO] Initiating payment of ₹500 for account ACC-101
2026-10-01 14:00:00 [INFO] Payment of ₹500 processed successfully.
2026-10-01 14:00:00 [INFO] Initiating payment of ₹-50 for account ACC-102
2026-10-01 14:00:00 [ERROR] Invalid transaction amount: ₹-50
```

---

## Practice Quiz

### 1. What is the primary disadvantage of using `print()` statements for debugging in production applications?
A. `print()` only supports ASCII characters
B. `print()` cannot be toggled off globally, lacks timestamps/severity, and clutters stdout
C. `print()` is deprecated in Python 3.12
D. `print()` causes memory leaks
**Answer:** B
**Explanation:** `print()` lacks severity categorization, automatic timestamps, and file routing, and requires manual code deletion before shipping to production.
---

### 2. Which function in the `logging` module is used to establish baseline formatting and logging levels?
A. `logging.init()`
B. `logging.configure()`
C. `logging.basicConfig()`
D. `logging.setup()`
**Answer:** C
**Explanation:** `logging.basicConfig(**kwargs)` configures the root logger with formatting strings, log levels, and destination filenames.
---

### 3. What does `%(asctime)s` represent inside a logging format string?
A. The execution duration of the current function
B. Human-readable creation time of the log record
C. System CPU clock cycles
D. The timezone offset
**Answer:** B
**Explanation:** `%(asctime)s` inserts the timestamp when the `LogRecord` was created.
---

### 4. What is the recommended way to create a module-level logger in modular Python applications?
A. `logger = logging.new()`
B. `logger = logging.getLogger(__name__)`
C. `logger = logging.RootLogger()`
D. `logger = logging.create_stream()`
**Answer:** B
**Explanation:** `logging.getLogger(__name__)` creates or retrieves a logger identified by the current module path, facilitating hierarchical configuration.
---

### 5. If `logging.basicConfig(level=logging.WARNING)` is set, which of the following log calls will NOT produce any output?
A. `logging.warning("Disk full")`
B. `logging.error("Crash detected")`
C. `logging.info("User logged in")`
D. `logging.critical("Power outage")`
**Answer:** C
**Explanation:** `logging.INFO` is of lower severity than `WARNING`, so all `INFO` and `DEBUG` calls are suppressed.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Logging Levels** (9: Debugging and Logging).

👉 **[Continue to Next Lesson: Logging Levels →](/tutorials/python-for-intermediate/logging-levels)**
