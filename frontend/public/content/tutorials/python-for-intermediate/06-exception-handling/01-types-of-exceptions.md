---
id: python-intermediate-types-of-exceptions
slug: types-of-exceptions
course: python-for-intermediate
chapter: "6: Exception Handling"
topic: "6.1 Types of Exceptions"
title: "Types of Exceptions in Python"
description: "Master types of exceptions in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 26
keywords:
  - python types of exceptions
  - python intermediate
  - python types of exceptions
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Types of Exceptions in Python

Errors in Python fall into two broad categories: **Syntax Errors** (detected by the parser before code execution begins) and **Exceptions** (anomalies detected during execution at runtime). When an exception is not intercepted, Python halts program execution and displays a traceback.

---

## 1. Syntax Errors vs. Runtime Exceptions

```python
# 1. SYNTAX ERROR: Discovered before runtime (parsing phase)
# if True print("Hello")  <-- Missing colon ':'

# 2. RUNTIME EXCEPTION: Syntactically valid, but fails during execution
denominator = 0
# result = 100 / denominator  <-- ZeroDivisionError at runtime
```

---

## 2. The Python Built-in Exception Hierarchy

All built-in exceptions form an inheritance tree rooted at `BaseException`. Understanding this hierarchy prevents bugs where catching a broad exception inadvertently intercepts system-level termination signals.

```text
BaseException
 ├── SystemExit                 # Raised by sys.exit()
 ├── KeyboardInterrupt          # Triggered when user presses Ctrl+C
 ├── GeneratorExit              # Raised when generator close() is called
 └── Exception                  # Root for all non-system-exiting exceptions
      ├── ArithmeticError
      │    ├── ZeroDivisionError
      │    ├── OverflowError
      │    └── FloatingPointError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── TypeError
      ├── ValueError
      ├── AttributeError
      ├── NameError
      │    └── UnboundLocalError
      ├── ImportError
      │    └── ModuleNotFoundError
      └── OSError
           ├── FileNotFoundError
           └── PermissionError
```

> **Critical Rule:** Never write `except BaseException:`. Doing so catches `KeyboardInterrupt` and `SystemExit`, making it impossible to stop your program using `Ctrl+C`.

---

## 3. Deep Dive into Common Exceptions

### 1. `TypeError` vs. `ValueError`

- **`TypeError`**: An operation or function is applied to an object of **inappropriate type**.
  ```python
  # TypeError: can only concatenate str (not "int") to str
  greeting = "Level: " + 5
  ```
- **`ValueError`**: The type is correct, but the **content / value is invalid**.
  ```python
  # ValueError: invalid literal for int() with base 10: 'abc'
  num = int("abc")  # Expects string of digits
  ```

### 2. `LookupError`: `IndexError` vs. `KeyError`

- **`IndexError`**: Attempting to access an index outside the boundaries of a sequence (list, tuple).
  ```python
  items = [10, 20, 30]
  # IndexError: list index out of range
  val = items[5]
  ```
- **`KeyError`**: Looking up a dictionary key that does not exist.
  ```python
  user = {"name": "Sita"}
  # KeyError: 'email'
  email = user["email"]
  ```

### 3. `AttributeError`

Occurs when attempting to access a method or attribute that does not exist on that object type:
```python
num = 42
# AttributeError: 'int' object has no attribute 'lower'
num.lower()
```

### 4. `NameError` vs. `UnboundLocalError`

- **`NameError`**: Referencing a variable or function name that has not been defined in any local, enclosing, or global scope.
  ```python
  # NameError: name 'undefined_variable' is not defined
  print(undefined_variable)
  ```
- **`UnboundLocalError`**: Referencing a local variable before it has been assigned inside a function.
  ```python
  counter = 0
  def increment():
      # UnboundLocalError: local variable 'counter' referenced before assignment
      counter += 1
  ```

### 5. `ModuleNotFoundError`

A specialized subclass of `ImportError` raised when Python cannot resolve an `import` target:
```python
# ModuleNotFoundError: No module named 'non_existent_engine'
import non_existent_engine
```

---

## 4. Multi-Catch and Inheritance Polymorphism

Because exceptions are standard Python classes, catching a parent class catches all derived subclasses:

```python
def safe_lookup(collection, key):
    try:
        return collection[key]
    except LookupError as err:
        # Catches BOTH IndexError (for lists) AND KeyError (for dicts)!
        print(f"Lookup failure ({type(err).__name__}): {err}")
        return None

print(safe_lookup([1, 2, 3], 9))       # Lookup failure (IndexError)
print(safe_lookup({"id": 101}, "age"))  # Lookup failure (KeyError)
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Catching `BaseException` Blindly
Catching `BaseException` catches `KeyboardInterrupt` (Ctrl+C) and `SystemExit`, making your script unkillable from the terminal! Always inherit from and catch `Exception`.

### 2. Confusing `ValueError` with `TypeError`
- `TypeError`: An argument is of the wrong type (e.g. passing a string to `math.sqrt()`).
- `ValueError`: An argument is of the right type but inappropriate value (e.g. `math.sqrt(-1)`).

---

---

## 💻 Try It Yourself: Robust User Input Validator

### Scenario
Write a script that prompts the user for their age. Handle both `ValueError` (if non-numeric string is entered) and custom range validation without crashing.

### Complete Solution
```python
def parse_age(input_str: str) -> int:
    try:
        age = int(input_str)
        if age < 0 or age > 120:
            raise ValueError(f"Age {age} is out of realistic human range (0-120).")
        return age
    except ValueError as err:
        print(f"Validation Error: {err}")
        return -1

print("Test 1 ('25'):", parse_age("25"))
print("Test 2 ('abc'):", parse_age("abc"))
print("Test 3 ('150'):", parse_age("150"))
```

### Expected Output
```text
Test 1 ('25'): 25
Validation Error: invalid literal for int() with base 10: 'abc'
Test 2 ('abc'): -1
Validation Error: Age 150 is out of realistic human range (0-120).
Test 3 ('150'): -1
```

---

## Practice Quiz

### 1. Which base class sits at the very top of Python's exception hierarchy?
A. `Exception`
B. `RootError`
C. `BaseException`
D. `SystemError`
**Answer:** C
**Explanation:** `BaseException` is the common base class for all built-in exceptions in Python.
---

### 2. What exception is raised by `int("ninety-nine")`?
A. `TypeError`
B. `ValueError`
C. `CastError`
D. `ParsingError`
**Answer:** B
**Explanation:** Passing a string to `int()` satisfies the expected type, but the content cannot be parsed as an integer literal, raising a `ValueError`.
---

### 3. Both `IndexError` and `KeyError` inherit directly from which intermediate class?
A. `CollectionError`
B. `LookupError`
C. `IndexableException`
D. `KeyIndexError`
**Answer:** B
**Explanation:** `LookupError` is the base class for exceptions raised when a key or index used on a mapping or sequence is invalid.
---

### 4. Why should developers avoid writing `except BaseException:` in normal application code?
A. It consumes too much CPU cache
B. It intercepts user termination signals like `KeyboardInterrupt` (Ctrl+C) and `SystemExit`
C. It only catches syntax errors
D. Python 3 removed `BaseException`
**Answer:** B
**Explanation:** Catching `BaseException` intercepts `KeyboardInterrupt` and `SystemExit`, preventing normal script termination via `Ctrl+C` or `sys.exit()`.
---

### 5. What exception is triggered when invoking `(5).append(10)`?
A. `TypeError`
B. `AttributeError`
C. `ValueError`
D. `MethodNotFoundError`
**Answer:** B
**Explanation:** Integers do not have an `append` attribute or method, so Python raises an `AttributeError`.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Try-Except-Else-Finally** (6: Exception Handling).

👉 **[Continue to Next Lesson: Try-Except-Else-Finally →](/tutorials/python-for-intermediate/try-except-else-finally)**
