---
id: basic-error-handling-try-except
slug: basic-error-handling-try-except
course: python-for-beginners
chapter: "15: File Handling & Basic Error Handling"
topic: "15.5 Basic Error Handling with try-except"
title: "Python Basic Error Handling: try, except, else & finally"
description: "Prevent Python crashes using try-except blocks. Learn to catch ValueError, ZeroDivisionError, and FileNotFoundError safely with practical examples and quiz."
difficulty: Beginner
readingTime: 12
order: 5
keywords:
  - python try except tutorial
  - python basic error handling
  - python exception handling beginners
  - python FileNotFoundError ValueError
  - handle errors in python file handling
  - python else finally block
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.0.0
---

**In Python, `try` and `except` blocks catch runtime errors (called exceptions) so your program handles invalid input or missing files gracefully instead of crashing with a traceback.** You place risky code inside `try:`, and write recovery instructions inside one or more `except ErrorType:` blocks.

Up to now, if a user typed `"abc"` when your calculator expected a number—or if your script tried to open a file that did not exist—Python immediately terminated the program. Real-world projects (like the Contact Book, Quiz App, and Expense Tracker in Chapter 16) rely on `try/except` to stay reliable.

---

## Syntax Errors vs. Runtime Exceptions

Before writing `try/except`, understand the difference between the two kinds of errors in Python:

| Error Category | When It Happens | Can `try/except` Catch It? | Example |
| :--- | :--- | :--- | :--- |
| **Syntax Error** | Before the program runs (parsing stage) | No — must fix the code | `if x == 5 print(x)` (missing `:`) |
| **Runtime Exception** | While valid Python code is executing | Yes — catch with `try/except` | `10 / 0` (`ZeroDivisionError`), `int("hi")` (`ValueError`) |

---

## Core `try / except` Syntax

```python
try:
    age = int(input("Enter your age: "))
    print(f"In 5 years, you will be {age + 5}.")
except ValueError:
    print("Invalid input! Please enter a whole number like 18.")
```

**How execution flows:**
- If the user types `19`, the `try` block succeeds and the `except` block is completely skipped.
- If the user types `nineteen`, `int("nineteen")` raises a `ValueError`, execution jumps immediately to `except ValueError:`, and the program finishes cleanly without crashing.

---

## Catching Specific Exceptions You Will Meet Often

Always catch the **specific exception** you expect rather than catching everything blindly. Here are the 5 most common exceptions in beginner projects:

| Exception Type | Common Trigger | Example |
| :--- | :--- | :--- |
| `ValueError` | Right type, invalid value | `int("hello")` |
| `ZeroDivisionError` | Dividing or modulo by zero | `100 / 0` |
| `FileNotFoundError` | Opening a missing file in `'r'` mode | `open("missing.txt", "r")` |
| `KeyError` | Looking up a missing dictionary key | `student["grade"]` |
| `IndexError` | Accessing an out-of-range list index | `items[10]` on a 3-item list |

### Handling Multiple Exceptions Cleanly

```python
try:
    total_marks = float(input("Enter total marks: "))
    subjects = int(input("Enter number of subjects: "))
    average = total_marks / subjects
except ValueError:
    print("Please enter valid numeric values only.")
except ZeroDivisionError:
    print("Number of subjects cannot be zero.")
else:
    # Runs ONLY if no exception occurred inside try
    print(f"Average Marks: {average:.2f}")
finally:
    # ALWAYS runs, whether an error occurred or not
    print("Calculation attempt completed.")
```

---

## Combining `try/except` with File Handling (`with open()`)

File operations are one of the top places where runtime exceptions happen because external files can be moved, renamed, or deleted.

```python
filename = "expenses.txt"

try:
    with open(filename, "r", encoding="utf-8") as file:
        records = file.readlines()
        print(f"Loaded {len(records)} saved expense entries.")
except FileNotFoundError:
    print(f"'{filename}' not found yet. Starting with a fresh expense log.")
    records = []
except PermissionError:
    print(f"Permission denied while trying to read '{filename}'.")
```

Notice how using `with open(...)` guarantees the file is closed automatically, while `except FileNotFoundError:` gives first-time users a smooth experience instead of a scary red traceback.

---

## Common Beginner Mistakes & Best Practices

### 1. Avoid Bare `except:` Clauses

```python
# ❌ BAD PRACTICE: Hides typos, bugs, and even Ctrl+C (KeyboardInterrupt)
try:
    result = int(user_text)
except:
    print("Something went wrong")

# ✅ GOOD PRACTICE: Catch specific exceptions and optionally log the message
try:
    result = int(user_text)
except ValueError as err:
    print(f"Could not convert input to integer: {err}")
```

### 2. Keep the `try` Block Small and Focused

Only wrap the lines that can actually raise the expected exception. Wrapping 50 lines of unrelated code in a single `try:` block makes debugging much harder.

### 3. Validate Repeatedly Inside a `while` Loop

A classic CLI pattern combines `while True:` with `try/except` to re-prompt until valid input arrives:

```python
while True:
    try:
        marks = int(input("Enter marks (0-100): "))
        if 0 <= marks <= 100:
            break
        print("Marks must be between 0 and 100.")
    except ValueError:
        print("Please enter digits only.")

print(f"Recorded marks: {marks}")
```

---

## Try It Yourself: Hands-On Practice

1. **Easy:** Write a safe division function `safe_divide(a, b)` that returns `None` and prints a friendly message if `b == 0`.
2. **Medium:** Write a script that asks for a filename, reads and prints its line count using `with open()`, and handles `FileNotFoundError` gracefully.
3. **Challenge:** Build a validated menu selector (`1. Add Contact`, `2. View Contacts`, `3. Exit`) that keeps asking until the user enters `1`, `2`, or `3` without ever crashing on letters or symbols.

---

## Practice Quiz

### 1. Which block in Python runs ONLY when the `try` block completes with NO exceptions?
A. `except`
B. `finally`
C. `else`
D. `catch`
**Answer:** C
**Explanation:** The `else` block executes only if the `try` block finishes without raising any exception, keeping normal follow-up code separate from error-prone code.

---

### 2. Which exception is raised when you try to open a non-existent file in read (`"r"`) mode?
A. `ValueError`
B. `FileNotFoundError`
C. `KeyError`
D. `IndexError`
**Answer:** B
**Explanation:** Opening a file that does not exist in `"r"` mode raises `FileNotFoundError` (a subclass of `OSError`).

---

### 3. When does the `finally` block execute?
A. Only when an exception occurs
B. Only when no exception occurs
C. Always, whether an exception was raised or not
D. Only inside `while` loops
**Answer:** C
**Explanation:** The `finally` block always executes after `try`/`except`/`else`, making it ideal for cleanup actions like closing connections or printing completion logs.

---

### 4. Why should you avoid writing a bare `except:` without specifying an exception type?
A. Python 3 removed `except` completely
B. It can silently hide programming bugs and even catch system interrupts like `KeyboardInterrupt`
C. It runs slower than `if/else` by 100x
D. It only works with file handling
**Answer:** B
**Explanation:** A bare `except:` catches `BaseException` subclasses including `KeyboardInterrupt` (Ctrl+C) and `SystemExit`, and masks unexpected bugs like `NameError`.

---

### 5. What happens when `int("25a")` runs inside a `try` block with `except ValueError:`?
A. The program crashes with a traceback
B. Python converts `"25a"` into `25`
C. Control jumps to the `except ValueError:` block and the program continues running
D. Python raises `ZeroDivisionError`
**Answer:** C
**Explanation:** `int("25a")` raises `ValueError`, which matches `except ValueError:`, allowing your recovery code to execute cleanly.

---

## What's Next?

With file handling and error handling under your belt, you are ready to build real portfolio projects in Chapter 16—starting with **[Project 1: Contact Book →](/tutorials/python-for-beginners/contact-book)**!
