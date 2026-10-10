---
id: python-advanced-str-repr-len
slug: str-repr-len
course: python-for-advanced
chapter: "2: Magic Methods & Operator Overloading"
topic: "2.2 __str__, __repr__, __len__"
title: "__str__, __repr__, __len__ in Python"
description: "Master __str__, __repr__, __len__ in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 9
order: 7
keywords:
  - python str repr len
  - python advanced
  - python __str__, __repr__, __len__
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# `__str__`, `__repr__`, and `__len__`

In Python, the way objects display themselves to developers and end users—as well as how their size is evaluated—is governed by foundational dunder methods: `__repr__`, `__str__`, and `__len__`. Implementing these methods thoughtfully ensures that your custom data structures integrate seamlessly with logging frameworks, interactive debuggers, formatted strings, and built-in Python functions.

---

## 1. `__repr__` vs `__str__`: The Core Distinction

Python provides two distinct string representation mechanisms. While they appear similar on the surface, they serve fundamentally different audiences and purposes.

```
                         String Conversion Request
                                     │
              ┌──────────────────────┴──────────────────────┐
              ▼                                             ▼
          str(obj)                                      repr(obj)
     or print(obj), f"{obj}"                       or interactive REPL,
              │                                      f"{obj!r}", logger
              │                                             │
      Does __str__ exist?                                   │
       ┌──────┴──────┐                                      │
      YES            NO                                     ▼
       │              └─────────► Fallback to ──────► Call __repr__
       ▼                                                    │
  Call __str__                                              ▼
  (Informal / User-facing)                          (Formal / Unambiguous /
                                                     Executable code)
```

### Purpose Comparison

| Feature | `__repr__` (Representation) | `__str__` (String) |
| :--- | :--- | :--- |
| **Audience** | Software engineers, maintainers, debuggers | End users, reports, UI displays |
| **Goal** | Unambiguous; ideally valid Python code to recreate the object | Readable, clean, human-friendly presentation |
| **Fallback** | Defaults to `<ClassName object at 0x...>` if unhandled | Falls back to `__repr__` automatically if omitted |
| **Invocation** | `repr(x)`, REPL output, interactive debugger, `%r`, `!r` | `str(x)`, `print(x)`, `f"{x}"`, `format(x)` |

### Practical Rule of Thumb
> **Always implement `__repr__` first.** If you only implement `__repr__`, Python uses it as the default fallback for `__str__`. If you only implement `__str__`, the object will still display the unhelpful `<ClassName object at 0x...>` in lists, dictionaries, tracebacks, and interactive shells.

---

## 2. Implementing `__repr__` and `__str__`

Here is an architectural pattern for implementing both methods in a domain entity:

```python
from datetime import datetime
from typing import Optional

class UserAccount:
    """Represents a registered user profile in an identity system."""

    def __init__(self, user_id: int, username: str, email: str, created_at: Optional[datetime] = None) -> None:
        self.user_id = user_id
        self.username = username
        self.email = email
        self.created_at = created_at or datetime.now()

    def __repr__(self) -> str:
        """Formal representation: unambiguous and mirrors constructor call."""
        return (
            f"{self.__class__.__name__}("
            f"user_id={self.user_id!r}, "
            f"username={self.username!r}, "
            f"email={self.email!r}, "
            f"created_at={self.created_at!r})"
        )

    def __str__(self) -> str:
        """Informal representation: human-readable label."""
        return f"{self.username} <{self.email}> [ID: {self.user_id}]"

# Instantiating the user
user = UserAccount(101, "alovelace", "ada@computing.org")

# 1. str() and print() invoke __str__
print("Output of print(user):", user)
print("Output of str(user):  ", str(user))

# 2. repr() invokes __repr__
print("Output of repr(user): ", repr(user))

# 3. Inside collections (lists, dicts), Python always renders __repr__
account_list = [user]
print("Inside list representation:", account_list)

# 4. Using the !r conversion flag in formatted f-strings
print(f"User in debug log: {user!r}")
```

---

## 3. The `__len__` Protocol and Truthiness

The `__len__` method hooks into the built-in `len(object)` function. It is part of the **Sequence Protocol** and the **Mapping Protocol**.

```
                           Evaluation of: bool(obj)
                                     │
                             Does __bool__ exist?
                                ┌────┴────┐
                               YES        NO
                                │          └──────► Does __len__ exist?
                                ▼                    ┌─────┴─────┐
                           Call __bool__()          YES          NO
                                                     │            ▼
                                                     ▼         Default:
                                               len(obj) != 0    True
```

### Strict Requirements for `__len__`
1. Must return a **non-negative integer** (`int >= 0`).
2. Returning a negative integer raises a `ValueError: __len__() should return >= 0`.
3. Returning a non-integer (such as a float or string) raises a `TypeError: 'float' object cannot be interpreted as an integer`.
4. If a class does not define `__bool__`, Python evaluates truthiness using `__len__()`: if `len(obj) == 0`, the object is evaluated as `False`; otherwise, it evaluates to `True`.

```python
class TaskQueue:
    """A prioritized task buffer demonstrating __len__ and truthiness fallback."""

    def __init__(self) -> None:
        self._tasks: list[dict[str, str]] = []

    def push(self, task_name: str, priority: str = "NORMAL") -> None:
        self._tasks.append({"task": task_name, "priority": priority})

    def pop(self) -> dict[str, str]:
        if not self._tasks:
            raise IndexError("Queue is empty.")
        return self._tasks.pop(0)

    def __len__(self) -> int:
        """Returns the total number of pending tasks."""
        return len(self._tasks)

    def __repr__(self) -> str:
        return f"TaskQueue(count={len(self._tasks)})"

# Demonstrating __len__ and implicit truthiness
queue = TaskQueue()

print(f"Initial queue length: {len(queue)}")
print(f"Is queue truthy? {bool(queue)}")  # False because len(queue) == 0

queue.push("Process batch payments", "HIGH")
queue.push("Send invoice emails", "NORMAL")

print(f"Populated queue length: {len(queue)}")
print(f"Is queue truthy? {bool(queue)}")  # True because len(queue) > 0

# Idiomatic conditional check
if queue:
    print(f"Dispatching task: {queue.pop()['task']}")
```

---

## 4. Complementary Methods: `__format__` and `__bytes__`

In addition to standard string rendering, Python provides specialized representations:

### `__format__(self, format_spec: str)`
Called by `format(obj, spec)` or f-string specifiers `f"{obj:spec}"`.

```python
class CurrencyAmount:
    def __init__(self, amount: float, currency_code: str = "USD") -> None:
        self.amount = amount
        self.currency_code = currency_code

    def __format__(self, format_spec: str) -> str:
        if format_spec == "symbol":
            symbol = "$" if self.currency_code == "USD" else "€"
            return f"{symbol}{self.amount:,.2f}"
        elif format_spec == "code":
            return f"{self.amount:,.2f} {self.currency_code}"
        return f"{self.amount:{format_spec}} {self.currency_code}"

balance = CurrencyAmount(15420.50, "USD")
print(f"Formatted as symbol: {balance:symbol}")
print(f"Formatted as code:   {balance:code}")
print(f"Standard formatting: {balance:.1f}")
```

---

## 5. Architectural Comparison Summary

| Method | Built-in Caller | Type Constraint | Primary Use Case |
| :--- | :--- | :--- | :--- |
| `__repr__` | `repr(x)` | Must return `str` | Debugging, inspection, recreating the object |
| `__str__` | `str(x)`, `print(x)` | Must return `str` | User-friendly UI / logging strings |
| `__len__` | `len(x)` | Must return `int >= 0` | Size measurement, truthiness fallback |
| `__format__` | `format(x, spec)` | Must return `str` | Custom formatting specifications |
| `__bytes__` | `bytes(x)` | Must return `bytes` | Binary serialization |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Returning Non-Strings from `__str__` or `__repr__`
Special methods like `__str__` and `__repr__` MUST return a string. Returning an integer, list, or `None` raises an immediate `TypeError`.

### 2. Returning Negative Values from `__len__`
`len()` enforces that `__len__()` must return a non-negative integer $ge 0$. Returning a negative integer raises a `ValueError`.

---

---

## 💻 Try It Yourself: Custom Playing Card Deck with __repr__ and __len__

### Scenario
Create a `CardDeck` class representing a standard 52-card deck. Implement `__len__`, `__getitem__`, and `__repr__`.

### Complete Solution
```python
class CardDeck:
    ranks = [str(n) for n in range(2, 11)] + list("JQKA")
    suits = ["Spades", "Diamonds", "Clubs", "Hearts"]

    def __init__(self):
        self._cards = [(rank, suit) for suit in self.suits for rank in self.ranks]

    def __len__(self) -> int:
        return len(self._cards)

    def __getitem__(self, position):
        return self._cards[position]

    def __repr__(self) -> str:
        return f"CardDeck(total_cards={len(self)})"

deck = CardDeck()
print(deck)
print("Total cards:", len(deck))
print("First card:", deck[0])
print("Last card:", deck[-1])
```

### Expected Output
```text
CardDeck(total_cards=52)
Total cards: 52
First card: ('2', 'Spades')
Last card: ('A', 'Hearts')
```

---

## Practice Quiz

### 1.
What happens when you execute `print(obj)` on an instance of a class that defines `__repr__` but DOES NOT define `__str__`?
A. Python raises an `AttributeError` indicating missing `__str__`.
B. Python falls back to executing `__repr__`.
C. Python prints the default memory pointer address.
D. Python outputs an empty string.

**Answer:** B

**Explanation:** In Python's Data Model, if `__str__` is not implemented on a class, calls to `str(obj)` and `print(obj)` automatically fall back to invoking `__repr__`.

---

### 2.
Which of the following describes the ideal standard design guideline for `__repr__`?
A. It should return a translated string localized to the user's operating system language.
B. It should return an unambiguous string that, whenever feasible, is valid Python code capable of recreating the object.
C. It must return a unique memory address integer.
D. It should only display private attributes prefixed with double underscores.

**Answer:** B

**Explanation:** The canonical Python convention for `__repr__` is to be unambiguous and, whenever practical, match the expression that could be passed to `eval()` or executed in Python code to recreate the object.

---

### 3.
When an instance is contained inside a standard Python list, how is each item displayed when the entire list is printed via `print([item1, item2])`?
A. Using `item.__str__()`
B. Using `item.__repr__()`
C. Using `item.__format__()`
D. Using `item.__bytes__()`

**Answer:** B

**Explanation:** Python collection containers (such as lists, tuples, sets, and dictionaries) render their enclosed elements using each element's `__repr__` method, not `__str__`.

---

### 4.
What will happen if a custom `__len__` method returns a negative integer like `-5`?
A. Python converts it to an absolute value (`5`).
B. Python treats the object as having length `0`.
C. Python raises a runtime `ValueError`.
D. Python raises an `OverflowError`.

**Answer:** C

**Explanation:** Python strictly enforces that `__len__()` must return a non-negative integer (`>= 0`). Returning a negative number triggers a `ValueError: __len__() should return >= 0`.

---

### 5.
If an object does not define a `__bool__` method, how does Python determine its boolean truthiness in an `if obj:` conditional check?
A. It always defaults to `False`.
B. It calls `__len__()`; if the length is `0`, it is `False`, otherwise `True`. If `__len__` is also absent, it defaults to `True`.
C. It calls `__repr__()` and checks if the resulting string is non-empty.
D. It raises a `TypeError`.

**Answer:** B

**Explanation:** In the absence of `__bool__`, Python checks for `__len__`. If `__len__` is defined, the object is truthy if length is non-zero. If neither method is defined, all instances of user-defined classes are considered truthy (`True`).

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Operator Overloading** (2: Magic Methods & Operator Overloading).

👉 **[Continue to Next Lesson: Operator Overloading →](/tutorials/python-for-advanced/operator-overloading)**
