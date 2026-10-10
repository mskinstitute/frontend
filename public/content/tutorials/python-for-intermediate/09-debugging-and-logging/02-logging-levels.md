---
id: python-intermediate-logging-levels
slug: logging-levels
course: python-for-intermediate
chapter: "9: Debugging and Logging"
topic: "9.2 Logging Levels"
title: "Logging Levels in Python"
description: "Master logging levels in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 42
keywords:
  - python logging levels
  - python intermediate
  - python logging levels
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Logging Levels in Python

Python's `logging` module categorizes diagnostic and operational messages using a standardized **severity hierarchy**. By assigning appropriate severity levels to log messages, you can control the volume of logging output without altering your source code—viewing granular debug details during local development while filtering down to warnings and errors in production.

---

## 1. The Five Standard Logging Levels

Python defines five standard levels, each associated with an integer severity weight:

| Level Name | Numeric Value | When It Should Be Used |
| :--- | :---: | :--- |
| **`DEBUG`** | `10` | Detailed diagnostic information, variable state inspection, and function parameter tracking for developers. |
| **`INFO`** | `20` | Routine confirmation that operations and milestones are proceeding as expected (e.g. server booted, user signed in). |
| **`WARNING`** | `30` | Indication that something unexpected happened or a potential issue is emerging (e.g., deprecated API usage, low disk space), but execution continues normally. |
| **`ERROR`** | `40` | Due to a more serious problem, the software was unable to complete a specific task or transaction. |
| **`CRITICAL`** | `50` | A fatal event has occurred indicating the application or server itself may crash or be unable to continue executing. |

> **Threshold Rule:** Setting a logger's threshold to level **L** logs all messages with numeric value **$\ge$ L**, while silently suppressing everything below L.

---

## 2. Practical Examples for Every Level

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)-8s | %(message)s"
)

# 1. DEBUG: Granular details
logging.debug("Connecting to database socket at 192.168.1.50:5432 with timeout=3s")

# 2. INFO: High-level operational events
logging.info("Database connection established successfully. Pool size: 10")

# 3. WARNING: Potential hazards or degradations
logging.warning("Query response took 1,420ms (exceeds 500ms SLA target)")

# 4. ERROR: Business transaction failure
logging.error("Failed to charge credit card for Invoice #891: Card expired")

# 5. CRITICAL: Unrecoverable system failure
logging.critical("Database storage drive mounted as READ-ONLY! Shutting down write worker.")
```

---

## 3. Capturing Exception Tracebacks: `logger.exception()`

When catching runtime exceptions, standard `logging.error()` records only your text message. To automatically include the complete Python traceback without manually formatting it, use **`logger.exception()`** (or pass `exc_info=True` to `logger.error()`):

```python
import logging

logging.basicConfig(level=logging.INFO)

def compute_ratio(numerator, denominator):
    try:
        return numerator / denominator
    except ZeroDivisionError:
        # Automatically appends the complete stack traceback to the log!
        logging.exception("Division operation failed unexpectedly:")
        return None

compute_ratio(100, 0)
```

### Generated Output:
```text
ERROR:root:Division operation failed unexpectedly:
Traceback (most recent call last):
  File "app.py", line 7, in compute_ratio
    return numerator / denominator
ZeroDivisionError: division by zero
```

---

## 4. Dynamic Level Switching via Environment / CLI

In real-world applications, you configure the log level dynamically using environment variables or command-line flags:

```python
import logging
import os

# Read log level from environment variable, defaulting to INFO
env_level = os.getenv("APP_LOG_LEVEL", "INFO").upper()

numeric_level = getattr(logging, env_level, logging.INFO)

logging.basicConfig(
    level=numeric_level,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

logging.debug("This only appears if APP_LOG_LEVEL=DEBUG")
logging.info("Application initialized.")
```

---

## 5. Summary Hierarchy Diagram

```text
Level           Numeric Value       Production Setting
-------------------------------------------------------
CRITICAL        50                  Always recorded
ERROR           40                  Always recorded
WARNING         30                  Standard Production Threshold (Default)
INFO            20                  Staging / Operational Audits
DEBUG           10                  Local Development & Troubleshooting
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Calling `logging.basicConfig()` Multiple Times
`logging.basicConfig()` only does work the first time it is invoked. Subsequent calls are silently ignored unless `force=True` is set (Python 3.8+).

### 2. Misusing Log Severity Levels
- Use `DEBUG` for fine-grained diagnostic details.
- Use `INFO` for general operational confirmation.
- Use `WARNING` for unexpected but recoverable events.
- Use `ERROR` for failures affecting a specific operation.
- Use `CRITICAL` for application-wide fatal crashes.

---

---

## 💻 Try It Yourself: Multi-Handler Logger (Console + File)

### Scenario
Create a logger that prints `INFO` and higher messages to the console while simultaneously recording detailed `DEBUG` and higher messages to a persistent `app.log` file.

### Complete Solution
```python
import logging

logger = logging.getLogger("AppLogger")
logger.setLevel(logging.DEBUG)

# File handler (records everything)
file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
file_fmt = logging.Formatter("%(asctime)s [%(levelname)s] (%(filename)s:%(lineno)d) - %(message)s")
file_handler.setFormatter(file_fmt)

# Console handler (records only INFO and above)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_fmt = logging.Formatter("[%(levelname)s] %(message)s")
console_handler.setFormatter(console_fmt)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

logger.debug("Database connection pool initialized with 5 workers.")
logger.info("Server started on http://localhost:8000")
logger.warning("Disk space usage is at 82%.")
```

### Expected Output
```text
[INFO] Server started on http://localhost:8000
[WARNING] Disk space usage is at 82%.
```

---

## Practice Quiz

### 1. What is the default logging level if no level is explicitly configured in `logging.basicConfig()`?
A. `DEBUG`
B. `INFO`
C. `WARNING`
D. `ERROR`
**Answer:** C
**Explanation:** By default, Python's logging module initializes with a threshold of `WARNING` (numeric value 30).
---

### 2. Which logging level has the lowest numeric severity value?
A. `CRITICAL`
B. `INFO`
C. `DEBUG`
D. `NOTSET`
**Answer:** C
**Explanation:** Among standard operational logging levels, `DEBUG` has the lowest numeric value (10). (`NOTSET` is 0, but disables level filtering rather than serving as an operational logging level).
---

### 3. What method automatically records an `ERROR` level message along with the full exception traceback?
A. `logging.dump_trace()`
B. `logging.exception()`
C. `logging.traceback()`
D. `logging.critical_stack()`
**Answer:** B
**Explanation:** `logging.exception()` logs a message at `ERROR` level and automatically captures and appends the active exception traceback.
---

### 4. If the active logging level is set to `logging.ERROR`, which of the following statements will be emitted?
A. `logging.debug("Check")`
B. `logging.info("Loaded")`
C. `logging.warning("Slow network")`
D. `logging.critical("System failure")`
**Answer:** D
**Explanation:** A threshold of `ERROR` (40) only emits messages of severity $\ge 40$, which includes `ERROR` (40) and `CRITICAL` (50).
---

### 5. Why should passwords and sensitive API keys never be logged, even at the `DEBUG` level?
A. Debug logs execute slowly
B. Log files are frequently ingested into centralized monitoring systems where unauthorized staff could access credentials
C. The `logging` module fails if a string contains special symbols
D. Strings longer than 10 characters cause memory leaks
**Answer:** B
**Explanation:** Logs are often exported, indexed, and accessible to teams. Logging sensitive credentials introduces severe security and compliance vulnerabilities.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Basic Debugging with pdb** (9: Debugging and Logging).

👉 **[Continue to Next Lesson: Basic Debugging with pdb →](/tutorials/python-for-intermediate/basic-debugging-with-pdb)**
