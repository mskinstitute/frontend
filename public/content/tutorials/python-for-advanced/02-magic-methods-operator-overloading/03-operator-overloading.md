---
id: python-advanced-operator-overloading
slug: operator-overloading
course: python-for-advanced
chapter: "2: Magic Methods & Operator Overloading"
topic: "2.3 Operator Overloading"
title: "Operator Overloading in Python"
description: "Master operator overloading in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 10
order: 8
keywords:
  - python operator overloading
  - python advanced
  - python operator overloading
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Operator Overloading

Operator overloading allows user-defined classes to intercept and define custom semantics for Python's built-in operators—such as arithmetic symbols (`+`, `-`, `*`, `/`), matrix multiplication (`@`), augmented assignment (`+=`, `-=`), and rich comparison operators (`==`, `<`, `>=`).

Through operator overloading, your custom classes can behave as intuitive, first-class mathematical entities, domain models, or fluent query builders.

---

## 1. The Operator Dispatch Architecture & `NotImplemented`

When Python encounters a binary expression like `a + b`, it dispatches the operation through a multi-stage protocol:

```
                              Expression: a + b
                                      │
                                      ▼
                      Try: type(a).__add__(a, b)
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
      Returns a Valid Result                   Returns NotImplemented
      (Operation finishes)                               │
                                                         ▼
                                             Try: type(b).__radd__(b, a)
                                                         │
                                      ┌──────────────────┴──────────────────┐
                                      ▼                                     ▼
                         Returns a Valid Result                   Returns NotImplemented
                         (Operation finishes)                               │
                                                                            ▼
                                                                  Raise TypeError:
                                                      unsupported operand type(s) for +
```

### The Difference: `NotImplemented` vs `NotImplementedError`

> **Critical Rule:** In binary operator dunder methods (`__add__`, `__eq__`, `__mul__`), if your class does not support the type of the operand, you **must return the singleton `NotImplemented`**, NOT raise `NotImplementedError`.

- **Returning `NotImplemented`**: Tells the Python runtime, *"I don't know how to handle this operand. Please check the right-hand operand's reflected method (e.g., `__radd__`) or fallback comparison."*
- **Raising `NotImplementedError`**: Immediately terminates the expression with an uncaught exception, preventing the other operand from handling the operation.

---

## 2. Arithmetic and Reflected Operators

Arithmetic operators come in two primary flavors: normal (left-hand) and reflected/reverse (right-hand, prefixed with `r`).

| Operator | Left-hand Method | Reflected Method | In-place Method |
| :---: | :--- | :--- | :--- |
| `+` | `__add__(self, other)` | `__radd__(self, other)` | `__iadd__(self, other)` |
| `-` | `__sub__(self, other)` | `__rsub__(self, other)` | `__isub__(self, other)` |
| `*` | `__mul__(self, other)` | `__rmul__(self, other)` | `__imul__(self, other)` |
| `/` | `__truediv__(self, other)` | `__rtruediv__(self, other)` | `__itruediv__(self, other)` |
| `//` | `__floordiv__(self, other)` | `__rfloordiv__(self, other)` | `__ifloordiv__(self, other)` |
| `%` | `__mod__(self, other)` | `__rmod__(self, other)` | `__imod__(self, other)` |
| `**` | `__pow__(self, other)` | `__rpow__(self, other)` | `__ipow__(self, other)` |
| `@` | `__matmul__(self, other)` | `__rmatmul__(self, other)` | `__imatmul__(self, other)` |

### Implementing Arithmetic with Scalars and Objects

```python
from typing import Union

class Money:
    """Represents a monetary value tied to a currency code."""

    def __init__(self, amount: float, currency: str = "USD") -> None:
        self.amount = round(float(amount), 2)
        self.currency = currency.upper()

    def __repr__(self) -> str:
        return f"Money({self.amount:.2f}, '{self.currency}')"

    def __str__(self) -> str:
        return f"{self.currency} {self.amount:.2f}"

    def __add__(self, other: Union["Money", int, float]) -> "Money":
        """Handles: Money + Money or Money + scalar."""
        if isinstance(other, Money):
            if self.currency != other.currency:
                raise ValueError(f"Cannot add different currencies: {self.currency} and {other.currency}")
            return Money(self.amount + other.amount, self.currency)
        elif isinstance(other, (int, float)):
            return Money(self.amount + float(other), self.currency)
        return NotImplemented

    def __radd__(self, other: Union[int, float]) -> "Money":
        """Handles reflected addition: scalar + Money."""
        # Addition is commutative, delegate to __add__
        return self.__add__(other)

    def __mul__(self, factor: Union[int, float]) -> "Money":
        """Handles: Money * scalar."""
        if not isinstance(factor, (int, float)):
            return NotImplemented
        return Money(self.amount * factor, self.currency)

    def __rmul__(self, factor: Union[int, float]) -> "Money":
        """Handles reflected multiplication: scalar * Money."""
        return self.__mul__(factor)

wallet1 = Money(50.00, "USD")
wallet2 = Money(25.50, "USD")

# Money + Money
total = wallet1 + wallet2
print("Sum:", total)  # USD 75.50

# Money + scalar
with_bonus = wallet1 + 10.0
print("Money + scalar:", with_bonus)  # USD 60.00

# Reflected scalar + Money (calls wallet1.__radd__(15.0))
reflected_sum = 15.0 + wallet1
print("Scalar + Money:", reflected_sum)  # USD 65.00

# Multiplication
doubled = wallet1 * 2
print("Doubled:", doubled)  # USD 100.00
```

---

## 3. In-Place Augmented Assignment (`+=`, `-=`, `*=`)

When you define methods like `__iadd__`, Python invokes them during `a += b`.

- **Mutable objects** (like `list`): `__iadd__` modifies `self` in-place and returns `self`.
- **Immutable objects** (like `int`, `str`): If `__iadd__` is omitted, Python falls back to `a = a + b`, allocating a new instance.

```python
class MutableVector:
    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

    def __iadd__(self, other: "MutableVector") -> "MutableVector":
        """Mutates the existing vector in place."""
        if not isinstance(other, MutableVector):
            return NotImplemented
        self.x += other.x
        self.y += other.y
        return self  # CRITICAL: Always return self for in-place methods

    def __repr__(self) -> str:
        return f"MutableVector({self.x}, {self.y})"

vec = MutableVector(10, 20)
old_id = id(vec)
vec += MutableVector(5, 5)

print("Updated vector:", vec)
print(f"Preserved exact memory identity: {id(vec) == old_id}")  # True
```

---

## 4. Rich Comparison Operators and `total_ordering`

Python defines 6 rich comparison dunder methods:

| Comparison | Method |
| :---: | :--- |
| `==` | `__eq__(self, other)` |
| `!=` | `__ne__(self, other)` |
| `<` | `__lt__(self, other)` |
| `<=` | `__le__(self, other)` |
| `>` | `__gt__(self, other)` |
| `>=` | `__ge__(self, other)` |

Instead of manually implementing all 6 operators, the standard library provides `@functools.total_ordering`. You only need to define `__eq__` and one ordering method (`__lt__`, `__le__`, `__gt__`, or `__ge__`), and Python automatically synthesizes the remaining 4 operators.

```python
from functools import total_ordering

@total_ordering
class ServerNode:
    """Represents a server node ranked by processing capacity."""

    def __init__(self, hostname: str, cpu_cores: int, ram_gb: int) -> None:
        self.hostname = hostname
        self.cpu_cores = cpu_cores
        self.ram_gb = ram_gb

    @property
    def capacity_score(self) -> float:
        return (self.cpu_cores * 2.0) + self.ram_gb

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, ServerNode):
            return NotImplemented
        return self.capacity_score == other.capacity_score

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, ServerNode):
            return NotImplemented
        return self.capacity_score < other.capacity_score

    def __repr__(self) -> str:
        return f"ServerNode({self.hostname}, score={self.capacity_score})"

node_small = ServerNode("worker-01", cpu_cores=4, ram_gb=16)  # score: 24
node_large = ServerNode("worker-02", cpu_cores=16, ram_gb=64) # score: 96
node_equal = ServerNode("worker-03", cpu_cores=8, ram_gb=8)   # score: 24

# Testing auto-generated comparisons
print("node_small < node_large: ", node_small < node_large)   # True (__lt__)
print("node_small <= node_equal:", node_small <= node_equal) # True (synthesized)
print("node_large > node_small: ", node_large > node_small)   # True (synthesized)
print("node_small == node_equal:", node_small == node_equal) # True (__eq__)

# Sorting a collection of nodes
nodes = [node_large, node_small, node_equal]
print("Sorted nodes:", sorted(nodes))
```

---

## 5. Summary and Architectural Rules

1. **Always return `NotImplemented` on unknown operand types**: This allows Python to query the other operand or produce clear, standardized error messages.
2. **In-place methods must return `self`**: Failing to return `self` from `__iadd__` will cause variables using `+=` to silently become `None`.
3. **Use `total_ordering` cautiously in performance-critical paths**: While `@functools.total_ordering` saves boilerplate, explicit implementations of comparison methods execute slightly faster by avoiding dynamic method wrapper lookups.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. In-Place Mutation in Binary Operators
Binary arithmetic operators like `__add__(self, other)` must return a **new instance** rather than mutating `self`. Mutating `self` violates mathematical immutability expectations.

### 2. Forgetting Reflected Operators (`__radd__`)
If the left operand does not support the operation with the right operand, Python falls back to the right operand's reflected method (`__radd__`). Implementing reflected operators allows operations like `5 + my_vector`.

---

---

## 💻 Try It Yourself: Overloading Currency Addition and Comparison

### Scenario
Build a `Rupee` monetary class that supports addition with another `Rupee` instance or integer, proper string representation, and comparison operators.

### Complete Solution
```python
class Rupee:
    def __init__(self, amount: float):
        self.amount = round(float(amount), 2)

    def __add__(self, other):
        if isinstance(other, Rupee):
            return Rupee(self.amount + other.amount)
        elif isinstance(other, (int, float)):
            return Rupee(self.amount + other)
        return NotImplemented

    def __radd__(self, other):
        return self.__add__(other)

    def __lt__(self, other):
        if isinstance(other, Rupee):
            return self.amount < other.amount
        return self.amount < other

    def __repr__(self):
        return f"₹{self.amount:,.2f}"

wallet1 = Rupee(450.50)
wallet2 = Rupee(120.00)
total = wallet1 + wallet2
augmented = 50 + wallet1

print("Total Wallet:", total)
print("Augmented with raw number:", augmented)
print("Is wallet2 < wallet1?", wallet2 < wallet1)
```

### Expected Output
```text
Total Wallet: ₹570.50
Augmented with raw number: ₹500.50
Is wallet2 < wallet1? True
```

---

## Practice Quiz

### 1.
What should a binary operator dunder method like `__add__(self, other)` return when it encounters an unsupported type for `other`?
A. `raise TypeError`
B. `raise NotImplementedError`
C. `return NotImplemented`
D. `return None`

**Answer:** C

**Explanation:** Returning the singleton `NotImplemented` signals the Python runtime to attempt the operation using the right-hand operand's reflected method (`__radd__`). Raising an error immediately halts evaluation.

---

### 2.
Given the expression `result = 10 + custom_obj`, where `10` is an `int` that does not know how to add `custom_obj`, which method is invoked on `custom_obj`?
A. `custom_obj.__add__(10)`
B. `custom_obj.__radd__(10)`
C. `custom_obj.__iadd__(10)`
D. `custom_obj.__call__(10)`

**Answer:** B

**Explanation:** When the left operand fails or returns `NotImplemented`, Python attempts the reflected (reverse) operator method on the right operand, which is `__radd__`.

---

### 3.
What critical value must an in-place operator like `__iadd__(self, other)` return when mutating a mutable object?
A. `None`
B. `True`
C. `self`
D. The previous value of `self`

**Answer:** C

**Explanation:** In Python, the statement `a += b` assigns the return value of `__iadd__` back to `a`. If `__iadd__` returns `None` (or omits a return statement), `a` is reassigned to `None`.

---

### 4.
Which standard library decorator allows a class defining only `__eq__` and `__lt__` to automatically support all six rich comparison operators (`<=`, `>`, `>=`, `!=`)?
A. `@functools.lru_cache`
B. `@functools.total_ordering`
C. `@dataclasses.dataclass`
D. `@operator.rich_comparison`

**Answer:** B

**Explanation:** `@functools.total_ordering` takes a class that defines `__eq__` and any one of `__lt__`, `__le__`, `__gt__`, or `__ge__`, and programmatically supplies the remaining comparison methods.

---

### 5.
Which operator corresponds to the special method `__matmul__(self, other)` introduced in Python 3.5?
A. Regular matrix exponentiation (`**`)
B. Matrix multiplication (`@`)
C. Bitwise AND (`&`)
D. Decorator application (`@property`)

**Answer:** B

**Explanation:** The `@` binary operator was introduced in Python 3.5 (PEP 465) specifically for matrix multiplication and corresponds to the `__matmul__` and `__rmatmul__` dunder methods.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Customizing Classes with Magic Methods** (2: Magic Methods & Operator Overloading).

👉 **[Continue to Next Lesson: Customizing Classes with Magic Methods →](/tutorials/python-for-advanced/customizing-classes-with-magic-methods)**
