---
id: python-constants-python-convention
slug: constants-python-convention
course: python-for-beginners
chapter: 2
topic: 2.5
title: Constants (Python Convention)
description: Master Python constant naming conventions, PEP 8 uppercase standards, module-level constant files, and compile-time immutability hints using typing.Final.
difficulty: Beginner
readingTime: 12
order: 10
keywords:
  - python constants
  - pep 8 constants
  - typing final
  - all caps convention
  - config module
  - immutable values
lastUpdated: 2026-09-30
author: MSK Team
version: 1.1.0
---
# Constants in Python: The ALL_CAPS Convention

## What is a Constant?

A **constant** is a value that we **intend to keep unchanged** while a program is running.

For example:

```python
PI = 3.14159
MAX_LOGIN_ATTEMPTS = 3
DEFAULT_TIMEOUT = 30
```

Python does **not** have a special `const` keyword like some other programming languages.

Instead, Python uses a **naming convention**:

> If a value is intended to remain constant, write its name in **ALL_CAPS**.

For example:

```python
MAX_USERS = 100
```

The uppercase name tells other programmers:

> "This value is intended to stay the same. Please don't change it."

### Important

Python does **not** automatically prevent this:

```python
MAX_USERS = 100

MAX_USERS = 500
```

The second assignment is allowed by Python.

So:

**ALL_CAPS is a convention, not a runtime restriction.**

---

# Real-World Analogy

Think about a railway station.

### Values that normally stay fixed

```text
Station Code = NDLS
```

The station code is a fixed piece of information.

In Python:

```python
STATION_CODE = "NDLS"
```

### Values that can change

A train's current platform can change:

```text
Platform 1 → Platform 3 → Platform 5
```

In Python:

```python
current_platform = 3
```

Notice the naming difference:

```python
STATION_CODE = "NDLS"       # Constant convention
current_platform = 3        # Normal variable
```

This naming style helps programmers quickly understand how a value is intended to be used.

---

# 1. The ALL_CAPS Convention

According to the Python style guide **PEP 8**, constants are normally written using:

**UPPERCASE LETTERS + UNDERSCORES**

This style is sometimes called:

```text
SCREAMING_SNAKE_CASE
```

### Examples

```python
PI = 3.14159

MAX_USERS = 100

DEFAULT_TIMEOUT = 30

COMPANY_NAME = "MSK Institute"

CURRENCY_SYMBOL = "₹"
```

For names containing multiple words, use underscores:

```python
MAX_LOGIN_ATTEMPTS = 3
DEFAULT_TIMEOUT_SECONDS = 30
MAX_FILE_SIZE_MB = 25
```

### Avoid this

```python
maxLoginAttempts = 3
Maximum_Login_Attempts = 3
maximum_login_attempts = 3
```

For a constant, the preferred style is:

```python
MAX_LOGIN_ATTEMPTS = 3
```

---

# 2. Constants vs Normal Variables

Let's compare them.

| Type     | Example              | Meaning                       |
| -------- | -------------------- | ----------------------------- |
| Constant | `MAX_USERS = 100`    | Intended to remain unchanged  |
| Variable | `current_users = 45` | Can change during the program |
| Constant | `PI = 3.14159`       | Fixed value                   |
| Variable | `score = 80`         | Can change                    |

Example:

```python
MAX_ATTEMPTS = 3

attempts_used = 1

print("Maximum attempts:", MAX_ATTEMPTS)
print("Attempts used:", attempts_used)
```

Later, the variable can change:

```python
attempts_used = 2
```

But we normally don't change:

```python
MAX_ATTEMPTS
```

---

# 3. Why Do We Use Constants?

Constants make programs easier to read and maintain.

Imagine you have this code:

```python
price = amount * 0.18
```

What does `0.18` mean?

A new programmer may not know.

Instead, create a meaningful constant:

```python
GST_RATE = 0.18

price = amount * GST_RATE
```

Now the code is much easier to understand.

### Another example

Instead of:

```python
if password_attempts > 3:
    print("Account locked")
```

Use:

```python
MAX_LOGIN_ATTEMPTS = 3

if password_attempts > MAX_LOGIN_ATTEMPTS:
    print("Account locked")
```

The second version clearly explains what `3` means.

---

# 4. What is a Magic Number?

A **magic number** is a number used directly in code without explaining what it represents.

Example:

```python
total = price * 1.18
```

What is `1.18`?

It might represent an 18% tax, but the code doesn't tell us.

A better approach is:

```python
GST_RATE = 0.18

total = price * (1 + GST_RATE)
```

Now the purpose is clear.

### Remember

> **Give important fixed values meaningful names instead of scattering unexplained numbers throughout your code.**

---

# 5. Using `typing.Final`

Python also provides `Final` from the `typing` module.

It can be used to tell **static type checkers and IDEs**:

> "This name is intended to be assigned only once."

Example:

```python
from typing import Final

MAX_LOGIN_ATTEMPTS: Final[int] = 3
```

If you later write:

```python
MAX_LOGIN_ATTEMPTS = 5
```

Python itself does not necessarily stop the program at runtime.

However, tools such as static type checkers can report that the `Final` variable is being reassigned.

### Simple way to remember

```text
ALL_CAPS
   ↓
Human-readable convention

Final
   ↓
Static checking hint
```

So:

```python
from typing import Final

MAX_USERS: Final[int] = 100
```

means:

> "This value is intended to be final, and type-checking tools should warn if I try to reassign it."

---

# 6. A Simple `Final` Example

```python
from typing import Final

APP_NAME: Final[str] = "MSK Learning"

MAX_STUDENTS: Final[int] = 100

IS_PRODUCTION: Final[bool] = False

print(APP_NAME)
print(MAX_STUDENTS)
print(IS_PRODUCTION)
```

### Output

```text
MSK Learning
100
False
```

The important part is:

```python
MAX_STUDENTS: Final[int] = 100
```

Here:

* `MAX_STUDENTS` → variable name
* `Final[int]` → tells static tools this should not be reassigned
* `100` → value

---

# 7. Where Should Constants Be Stored?

In a small Python program, constants can simply be placed near the top of the file:

```python
MAX_USERS = 100
DEFAULT_TIMEOUT = 30
COMPANY_NAME = "MSK Institute"
```

In a larger project, shared constants are often placed in a separate file.

For example:

```text
my_project/
│
├── constants.py
├── config.py
├── main.py
└── users.py
```

The exact file name depends on the project's design.

Common names include:

```text
constants.py
config.py
settings.py
```

---

# 8. Creating a `constants.py` File

### File: `constants.py`

```python
from typing import Final

COMPANY_NAME: Final[str] = "MSK Institute"

CURRENCY: Final[str] = "INR"

MAX_LOGIN_ATTEMPTS: Final[int] = 3

DEFAULT_TIMEOUT: Final[int] = 30
```

Now another file can use these values.

### File: `main.py`

```python
import constants

print(constants.COMPANY_NAME)
print(constants.CURRENCY)
print(constants.MAX_LOGIN_ATTEMPTS)
```

### Output

```text
MSK Institute
INR
3
```

This approach prevents you from repeatedly writing the same values in many files.

---

# 9. Why Centralize Constants?

Imagine you use this value in five different places:

```python
MAX_LOGIN_ATTEMPTS = 3
```

If you write the value separately in five files, changing it later can become difficult.

Instead, keep it in one place:

```python
MAX_LOGIN_ATTEMPTS = 3
```

Then import it where needed.

This creates a **single source of truth**.

### Simple idea

```text
                 constants.py
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       main.py     users.py    login.py
```

All parts of the application can use the same constant.

---

# 10. Constants with Collections

Constants can also contain collections.

For example:

```python
ALLOWED_ROLES = ["ADMIN", "MANAGER", "INSTRUCTOR"]
```

The name is uppercase, but the list itself can still be changed:

```python
ALLOWED_ROLES.append("STUDENT")

print(ALLOWED_ROLES)
```

Output:

```text
['ADMIN', 'MANAGER', 'INSTRUCTOR', 'STUDENT']
```

Why?

Because a list is **mutable**.

### Mutable means:

> The contents can be changed after the object is created.

---

# 11. Using a Tuple for Fixed Values

If you have a collection of values that should not be changed, a tuple can be a better choice:

```python
ALLOWED_ROLES = (
    "ADMIN",
    "MANAGER",
    "INSTRUCTOR"
)
```

A tuple cannot be changed using methods such as `.append()`.

For example:

```python
ALLOWED_ROLES.append("STUDENT")
```

will raise an error because tuples do not have an `append()` method.

### Another example

```python
HTTP_METHODS = (
    "GET",
    "POST",
    "PUT",
    "DELETE"
)
```

These values are intended to be a fixed collection.

---

# 12. Important: `Final` Does Not Make Objects Immutable

This is a very important concept.

Consider:

```python
from typing import Final

COLORS: Final = ["red", "blue"]
```

`Final` tells static type checkers that the **name should not be reassigned**.

But the list itself is still mutable.

This can still happen:

```python
COLORS.append("green")
```

So:

```text
Final
 ↓
Prevents/reports reassignment of the name

Final
 ↓
Does NOT automatically make a list or dictionary immutable
```

For a fixed collection, consider using an immutable type such as a tuple:

```python
COLORS: Final = ("red", "blue")
```

---

# 13. Constant Naming Best Practices

### Good examples

```python
MAX_USERS = 100

DEFAULT_TIMEOUT = 30

COMPANY_NAME = "MSK Institute"

CURRENCY_SYMBOL = "₹"

PI = 3.14159
```

### Avoid

```python
max_users = 100
companyName = "MSK Institute"
DefaultTimeout = 30
```

For constants, use:

```text
UPPERCASE_WITH_UNDERSCORES
```

---

# 14. Constants vs Variables — Quick Comparison

| Constant                            | Variable                      |
| ----------------------------------- | ----------------------------- |
| `MAX_USERS = 100`                   | `current_users = 45`          |
| Usually ALL_CAPS                    | Usually `snake_case`          |
| Intended to remain unchanged        | Can change                    |
| Often configuration or fixed values | Usually stores changing data  |
| Can use `Final` for static checking | Usually does not need `Final` |

Example:

```python
MAX_USERS = 100

current_users = 50

current_users = 75
```

Here:

* `MAX_USERS` → intended fixed limit
* `current_users` → changing value

---

# 15. Common Mistakes

## Mistake 1: Thinking ALL_CAPS makes a value truly constant

```python
MAX_USERS = 100

MAX_USERS = 200
```

Python allows this.

Remember:

> ALL_CAPS is a convention.

---

## Mistake 2: Thinking `Final` is a runtime lock

```python
from typing import Final

MAX_USERS: Final = 100
```

`Final` is mainly useful for static analysis.

It does not turn the variable into a special runtime constant.

---

## Mistake 3: Using magic numbers

Instead of:

```python
if age >= 18:
    print("Adult")
```

you can use:

```python
ADULT_AGE = 18

if age >= ADULT_AGE:
    print("Adult")
```

The meaning is clearer.

---

## Mistake 4: Assuming `Final` makes a list immutable

```python
from typing import Final

NAMES: Final = ["Amit", "Rahul"]
```

The list can still be modified.

For fixed values, consider:

```python
NAMES: Final = ("Amit", "Rahul")
```

---

# 16. A Complete Beginner Example

Let's combine the concepts.

```python
from typing import Final

# Constants
SHOP_NAME: Final[str] = "MSK Store"
CURRENCY: Final[str] = "INR"

GST_RATE: Final[float] = 0.18
FREE_SHIPPING_LIMIT: Final[float] = 999.0
SHIPPING_FEE: Final[float] = 70.0


def calculate_total(price: float) -> float:

    tax = price * GST_RATE

    if price >= FREE_SHIPPING_LIMIT:
        shipping = 0
    else:
        shipping = SHIPPING_FEE

    return price + tax + shipping


price = 500

total = calculate_total(price)

print("Shop:", SHOP_NAME)
print("Price:", CURRENCY, price)
print("Final Total:", CURRENCY, total)
```

### Output

```text
Shop: MSK Store
Price: INR 500
Final Total: INR 660.0
```

Notice how the important fixed values are clearly named:

```python
GST_RATE
FREE_SHIPPING_LIMIT
SHIPPING_FEE
```

This makes the program easier to understand and maintain.

---

# Quick Revision Summary

```text
PYTHON CONSTANTS CHEAT SHEET

1. Python has no built-in `const` keyword.

2. Constants are usually written in ALL_CAPS:

   MAX_USERS = 100

3. ALL_CAPS is a naming convention, not runtime protection.

4. `Final` can tell static type checkers that a name
   should not be reassigned:

   MAX_USERS: Final[int] = 100

5. `Final` does not automatically make lists or dictionaries immutable.

6. Use immutable collections such as tuples when appropriate:

   COLORS = ("red", "blue")

7. Shared constants can be stored in:

   constants.py
   config.py
   settings.py

8. Meaningful constants help avoid magic numbers.
```

---

## Practice Quiz

### 1. Which naming style is normally used for constants in Python?
A. `maxUsers`
B. `MaxUsers`
C. `MAX_USERS`
D. `max_users`
**Answer:** C

---

### 2. Does Python have a built-in `const` keyword?
A. Yes
B. No
C. Only on Windows
D. Only in Python 3.12+
**Answer:** B

---

### 3. What does `Final` mainly provide?
A. It automatically encrypts the value.
B. It makes every Python object immutable.
C. It gives static type checkers information that a name should not be reassigned.
D. It converts the variable into a string.
**Answer:** C

---

### 4. Which is a good example of a constant?
A. `current_score = 75`
B. `current_page = 2`
C. `MAX_LOGIN_ATTEMPTS = 3`
D. `student_name = "Rahul"`
**Answer:** C

---

### 5. Which collection is immutable?
A. List
B. Dictionary
C. Set
D. Tuple
**Answer:** D

---

# Hands-On Practice Challenge

## Challenge 10: Store Configuration Values

Create a Python program for a small online store.

### Requirements

Create these constants:

```python
STORE_NAME
CURRENCY
GST_RATE
FREE_SHIPPING_LIMIT
SHIPPING_FEE
```

Use ALL_CAPS naming.

Then create a function:

```python
calculate_total(price)
```

The function should:

1. Calculate GST.
2. Give free shipping when the price is at least `FREE_SHIPPING_LIMIT`.
3. Otherwise add `SHIPPING_FEE`.
4. Return the final amount.

### Example

```python
from typing import Final

STORE_NAME: Final[str] = "MSK Store"
CURRENCY: Final[str] = "INR"

GST_RATE: Final[float] = 0.18
FREE_SHIPPING_LIMIT: Final[float] = 999.0
SHIPPING_FEE: Final[float] = 70.0


def calculate_total(price: float) -> float:
    tax = price * GST_RATE

    if price >= FREE_SHIPPING_LIMIT:
        shipping = 0
    else:
        shipping = SHIPPING_FEE

    return price + tax + shipping


price = 500

total = calculate_total(price)

print("Store:", STORE_NAME)
print("Final Amount:", CURRENCY, total)
```

### Your Task

Try changing:

```python
price = 500
```

to:

```python
price = 1500
```

Observe how the shipping amount changes.

---

# What You Learned

In this lesson, you learned:

* What a constant is
* Why Python does not have a `const` keyword
* The `ALL_CAPS` naming convention
* PEP 8 constant naming
* What `Final` does
* Why `Final` is not the same as runtime immutability
* What magic numbers are
* Why constants improve code readability
* How to organize shared constants
* Why tuples can be useful for fixed collections
---

## 🚀 What's Next?

In the next lesson, we will continue your Python learning journey with **Data Types Overview** (3: Data Types).

👉 **[Continue to Next Lesson: Data Types Overview →](/tutorials/python-for-beginners/data-types-overview)**
