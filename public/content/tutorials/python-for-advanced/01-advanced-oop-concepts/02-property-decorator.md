---
id: python-advanced-property-decorator
slug: property-decorator
course: python-for-advanced
chapter: "1: Advanced OOP Concepts"
topic: "1.2 Property Decorator"
title: "Property Decorator in Python"
description: "Master property decorator in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 2
keywords:
  - python property decorator
  - python advanced
  - python property decorator
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# The Property Decorator in Python: Advanced Patterns & Descriptors

The `@property` decorator is one of Python's most elegant mechanisms for managing object state. It allows methods to be accessed syntactically as simple attributes (`user.email`) while executing getter, setter, and deleter logic behind the scenes. In advanced Python architecture, properties provide **data encapsulation**, **lazy caching**, and **transparent backward compatibility**.

---

## 1. How `@property` Works Under the Hood

The `@property` decorator is implemented as a built-in Python **Descriptor** class. Under the hood, decorating a method with `@property` creates an instance of the `property` class:

```python
# The built-in property constructor signature:
# property(fget=None, fset=None, fdel=None, doc=None)

class Rectangle:
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    def _get_area(self) -> float:
        return self._width * self._height

    # Explicit descriptor assignment (equivalent to @property)
    area = property(fget=_get_area, doc="Calculates the area of the rectangle.")
```

Using decorator syntax (`@property`, `@attr.setter`, `@attr.deleter`) is clean syntactic sugar that progressively populates `fget`, `fset`, and `fdel`.

---

## 2. Complete Lifecycle: Getter, Setter, and Deleter

```python
class TemperatureSensor:
    """Manages sensor temperature readings with strict physical constraints."""

    def __init__(self, initial_celsius: float = 20.0):
        # Trigger the setter to enforce validation upon initialization!
        self.celsius = initial_celsius

    # 1. Getter
    @property
    def celsius(self) -> float:
        """Current temperature in degrees Celsius."""
        return self._celsius

    # 2. Setter with invariant validation
    @celsius.setter
    def celsius(self, value: float):
        if not isinstance(value, (int, float)):
            raise TypeError(f"Temperature must be numeric, got {type(value).__name__}.")
        
        # Invariant: Cannot drop below Absolute Zero (-273.15 °C)
        if value < -273.15:
            raise ValueError("Temperature below absolute zero (-273.15°C) is physically impossible!")
        
        self._celsius = float(value)

    # 3. Deleter
    @celsius.deleter
    def celsius(self):
        print("Resetting temperature sensor calibration.")
        del self._celsius


sensor = TemperatureSensor(25.0)
print(sensor.celsius)  # 25.0 (Calls getter)

sensor.celsius = 38.5  # Calls setter
print(sensor.celsius)

try:
    sensor.celsius = -300.0  # Raises ValueError: below absolute zero
except ValueError as err:
    print(f"Validation intercepted: {err}")
```

---

## 3. Computed & Derived Properties

Properties eliminate redundant stored state. Instead of storing `first_name`, `last_name`, and `full_name` (which risks synchronization bugs when names change), compute derived values dynamically on access:

```python
class UserAccount:
    def __init__(self, first_name: str, last_name: str, hourly_rate: float):
        self.first_name = first_name
        self.last_name = last_name
        self.hourly_rate = hourly_rate

    @property
    def full_name(self) -> str:
        """Derived property dynamically constructed on read."""
        return f"{self.first_name} {self.last_name}"

    @full_name.setter
    def full_name(self, value: str):
        """Allows updating first and last name via full name string."""
        parts = value.strip().split(" ", 1)
        if len(parts) != 2:
            raise ValueError("Full name must contain both first and last name.")
        self.first_name, self.last_name = parts

u = UserAccount("Aarav", "Sharma", 75.0)
print(u.full_name)  # Aarav Sharma

u.full_name = "Priya Verma"  # Setter updates both attributes
print(u.first_name)  # Priya
print(u.last_name)   # Verma
```

---

## 4. Lazy Evaluation with `functools.cached_property`

When a property involves expensive I/O operations (reading files, calling remote APIs, running neural network inferences), recalculating it on every read degrades performance. 

Introduced in Python 3.8, **`functools.cached_property`** computes the value **once** upon first access, stores the result in the instance's `__dict__`, and serves subsequent accesses directly from cache with zero overhead:

```python
import time
from functools import cached_property


class DataAnalyticsEngine:
    def __init__(self, dataset_path: str):
        self.dataset_path = dataset_path

    @cached_property
    def summary_statistics(self) -> dict:
        """Simulates expensive 2-second dataset scan, executed only ONCE."""
        print(f"-> [Computing] Scanning massive dataset '{self.dataset_path}'...")
        time.sleep(1.5)  # Simulate expensive disk I/O or calculation
        return {"total_records": 1_500_000, "mean": 42.8, "status": "CLEAN"}


engine = DataAnalyticsEngine("sales_2026.parquet")

# 1. First access: Runs the expensive function
t0 = time.time()
print(engine.summary_statistics)
print(f"First access took: {time.time() - t0:.2f}s")

# 2. Second access: Instantaneous lookup from instance __dict__!
t0 = time.time()
print(engine.summary_statistics)
print(f"Second access took: {time.time() - t0:.5f}s")
```

---

## 5. Critical Pitfalls: The Recursion Trap

> **THE DEADLIEST PROPERTY TRAP:**
> Inside a property setter, never assign to the property name itself (`self.celsius = value`). That calls the setter again recursively, resulting in a fatal `RecursionError: maximum recursion depth exceeded`!
> Always assign to a private/protected backing attribute (e.g., `self._celsius = value`).

```python
# FATAL MISTAKE (Infinite Recursion):
@celsius.setter
def celsius(self, val):
    self.celsius = val  # CRASH! Calls self.celsius setter infinitely!

# CORRECT:
@celsius.setter
def celsius(self, val):
    self._celsius = val  # Stores in underlying backing variable
```

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Infinite Recursion in Property Setters
Assigning to the property name instead of the underlying private attribute inside the setter causes an immediate `RecursionError`:
```python
# ❌ INFINITE RECURSION BUG
@temperature.setter
def temperature(self, value):
    self.temperature = value  # Calls setter repeatedly!

# ✅ CORRECT
@temperature.setter
def temperature(self, value):
    self._temperature = value
```

### 2. Defining Setter Without Getter
A `@prop.setter` decorator requires the corresponding `@property` getter to be defined first in the class with the exact same method name.

---

---

## 💻 Try It Yourself: Validated Bank Account Balance Property

### Scenario
Create a `BankAccount` class that protects its `balance` attribute using `@property`. Prevent negative deposits, prevent overdrafts beyond a fixed limit, and log all balance modifications.

### Complete Solution
```python
class BankAccount:
    def __init__(self, owner: str, initial_deposit: float = 0.0):
        self.owner = owner
        self._balance = 0.0
        self.balance = initial_deposit

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float):
        if value < 0:
            raise ValueError(f"Balance cannot be negative! Attempted: ₹{value:,.2f}")
        print(f"[{self.owner}] Balance updated: ₹{self._balance:,.2f} -> ₹{value:,.2f}")
        self._balance = float(value)

acc = BankAccount("Aarav", 5000.0)
acc.balance += 2500.0
try:
    acc.balance = -100.0
except ValueError as err:
    print(f"Validation Guard: {err}")
```

### Expected Output
```text
[Aarav] Balance updated: ₹0.00 -> ₹5,000.00
[Aarav] Balance updated: ₹5,000.00 -> ₹7,500.00
Validation Guard: Balance cannot be negative! Attempted: ₹-100.00
```

---

## Practice Quiz

### 1. What built-in Python protocol powers the `@property` decorator under the hood?
A. Context Manager Protocol
B. Iterator Protocol
C. Descriptor Protocol
D. Buffer Protocol
**Answer:** C
**Explanation:** `property` is a descriptor implementing `__get__`, `__set__`, and `__delete__` methods to intercept attribute access.
---

### 2. What fatal error occurs if a setter method assigns to `self.attribute_name = value` instead of `self._attribute_name = value`?
A. `AttributeError`
B. `RecursionError` (maximum recursion depth exceeded)
C. `SyntaxError`
D. `MemoryError`
**Answer:** B
**Explanation:** Assigning to the public property name inside its own setter re-invokes the setter continuously until Python's call stack is exhausted with a `RecursionError`.
---

### 3. How does `functools.cached_property` differ from standard `@property`?
A. `cached_property` can only return integers
B. `cached_property` calculates the value once on first access and stores the result directly in the instance's `__dict__` for subsequent fast lookups
C. `cached_property` is removed in Python 3.12
D. `cached_property` saves values to disk
**Answer:** B
**Explanation:** `cached_property` evaluates the method only on first access and caches the result on the instance, bypassing repeated calculation.
---

### 4. How can you make a property strictly read-only?
A. Prepend the method name with `@readonly`
B. Define the `@property` getter without providing a corresponding `@<property>.setter`
C. Freeze the operating system
D. Wrap the class in a tuple
**Answer:** B
**Explanation:** Omitting the `@<prop>.setter` method prevents attribute mutation; attempting to set the attribute raises an `AttributeError: can't set attribute`.
---

### 5. What decorator method is used to define custom cleanup logic when `del obj.attribute` is executed?
A. `@property.delete`
B. `@<attribute>.deleter`
C. `@cleanup`
D. `@destructor`
**Answer:** B
**Explanation:** The `@<attribute>.deleter` decorator registers the function invoked when the `del` statement targets that property.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Method Resolution Order (MRO)** (1: Advanced OOP Concepts).

👉 **[Continue to Next Lesson: Method Resolution Order (MRO) →](/tutorials/python-for-advanced/method-resolution-order-mro)**
