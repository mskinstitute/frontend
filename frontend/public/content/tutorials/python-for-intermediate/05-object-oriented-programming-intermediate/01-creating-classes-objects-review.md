---
id: python-intermediate-creating-classes-objects-review
slug: creating-classes-objects-review
course: python-for-intermediate
chapter: "5: Object-Oriented Programming (Intermediate)"
topic: "5.1 Creating Classes & Objects (Review)"
title: "Creating Classes & Objects (Review) in Python"
description: "Master creating classes & objects (review) in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 21
keywords:
  - python creating classes objects review
  - python intermediate
  - python creating classes & objects (review)
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Creating Classes & Objects (Review & Deep Dive)

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of **objects**, which bundle state (attributes/data) and behavior (methods/functions) together. In Python, everything is an object—from simple integers and strings to complex modules and custom classes.

---

## 1. Classes vs. Instances

A **class** serves as a blueprint or schema defining the attributes and operations that instances will possess. An **instance** (or object) is a concrete manifestation created in memory based on that blueprint.

```python
class Developer:
    """Blueprint for a software developer profile."""
    pass

# Creating two distinct instances in memory
dev_a = Developer()
dev_b = Developer()

print(dev_a)  # <__main__.Developer object at 0x7f8...>
print(dev_a == dev_b)  # False (different memory addresses)
```

---

## 2. The `__init__` Constructor and `self`

The `__init__` method is Python's initialization hook called immediately after an instance is created in memory:
- **`self`**: A reference to the specific instance currently being initialized or manipulated. Python automatically passes the instance as the first argument when calling instance methods.

```python
class Developer:
    def __init__(self, name: str, primary_language: str, years_exp: int):
        # Instance attributes bound to this specific object
        self.name = name
        self.primary_language = primary_language
        self.years_exp = years_exp
        
    def describe(self) -> str:
        return f"{self.name} specializes in {self.primary_language} with {self.years_exp} years of experience."

dev = Developer("Vikram", "Python", 4)
print(dev.describe())
# dev.describe() is syntactic sugar for: Developer.describe(dev)
```

---

## 3. Instance Attributes vs. Class Attributes

Understanding the distinction between class-level and instance-level attributes is critical to avoiding state bugs:

- **Instance Attributes**: Bound to `self`. Each instance maintains its own distinct copy in its `__dict__`.
- **Class Attributes**: Defined directly inside the class body, shared across *all* instances of that class.

```python
class Student:
    # Class attribute (shared by all instances)
    institution = "MSK Institute of Technology"
    student_count = 0
    
    def __init__(self, name, roll_no):
        # Instance attributes (unique to each student)
        self.name = name
        self.roll_no = roll_no
        
        # Incrementing the shared class counter
        Student.student_count += 1

s1 = Student("Aarav", 101)
s2 = Student("Ananya", 102)

print(s1.institution)  # MSK Institute of Technology
print(s2.institution)  # MSK Institute of Technology
print(Student.student_count)  # 2
```

> **The Mutable Class Attribute Trap:**
> Never define mutable defaults (like lists or dictionaries) as class attributes if they are meant to be per-instance!
> ```python
> class Team:
>     members = []  # BAD: Shared across all Team instances!
>     
> class CorrectTeam:
>     def __init__(self):
>         self.members = []  # GOOD: Each team has its own list
> ```

---

## 4. Instance, Class, and Static Methods

Python provides three distinct method types using decorators:

| Method Type | Decorator | First Argument | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **Instance Method** | *(None)* | `self` | Manipulates individual instance state |
| **Class Method** | `@classmethod` | `cls` | Factory methods, modifying class-level state |
| **Static Method** | `@staticmethod` | *(None)* | Self-contained utility functions logically grouped in the class |

```python
class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius

    # 1. Instance Method
    def to_fahrenheit(self) -> float:
        return (self.celsius * 9/5) + 32

    # 2. Class Method (Alternative Constructor / Factory)
    @classmethod
    def from_fahrenheit(cls, fahrenheit: float):
        celsius = (fahrenheit - 32) * 5/9
        return cls(celsius)

    # 3. Static Method (Pure utility)
    @staticmethod
    def is_freezing(celsius: float) -> bool:
        return celsius <= 0.0

# Using Instance Method
t1 = Temperature(25)
print(f"25°C in F: {t1.to_fahrenheit()}°F")

# Using Class Method Factory
t2 = Temperature.from_fahrenheit(98.6)
print(f"98.6°F in C: {t2.celsius:.1f}°C")

# Using Static Method
print(f"Is -5°C freezing? {Temperature.is_freezing(-5)}")
```

---

## 5. String Representations: `__str__` vs `__repr__`

Every Python class should define informative string representations:

- **`__str__`**: User-friendly, readable string representation (returned by `print(obj)` or `str(obj)`).
- **`__repr__`**: Unambiguous, developer-oriented string used for debugging (returned by typing `obj` in interactive shell or `repr(obj)`). Ideally should look like valid Python code to recreate the object.

```python
class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn

    def __str__(self):
        return f"'{self.title}' by {self.author}"

    def __repr__(self):
        return f"Book(title='{self.title}', author='{self.author}', isbn='{self.isbn}')"

book = Book("Fluent Python", "Luciano Ramalho", "978-1491946008")
print(str(book))   # 'Fluent Python' by Luciano Ramalho
print(repr(book))  # Book(title='Fluent Python', author='Luciano Ramalho', isbn='978-1491946008')
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Confusing Class Attributes with Instance Attributes
A mutable class attribute (like a list) is shared across all instances of the class!
```python
# ❌ SHARED BUG: All students share the same grades list!
class Student:
    grades = []

# ✅ CORRECT: Each student gets an independent list in __init__
class Student:
    def __init__(self):
        self.grades = []
```

### 2. Forgetting `self` in Method Signatures
Every instance method must take `self` as its first parameter; omitting it causes a `TypeError: method takes 0 positional arguments but 1 was given`.

---

---

## 💻 Try It Yourself: Product Inventory Item Class

### Scenario
Create an `Item` class for an e-commerce store with attributes `name`, `price`, and `quantity`. Implement methods `total_value()`, `apply_discount(pct)`, and a formatted `__repr__()` method.

### Complete Solution
```python
class Item:
    def __init__(self, name: str, price: float, quantity: int = 1):
        if price < 0 or quantity < 0:
            raise ValueError("Price and quantity must be non-negative.")
        self.name = name
        self.price = float(price)
        self.quantity = int(quantity)

    def total_value(self) -> float:
        return self.price * self.quantity

    def apply_discount(self, discount_pct: float):
        self.price -= self.price * (discount_pct / 100.0)

    def __repr__(self) -> str:
        return f"Item(name='{self.name}', price=₹{self.price:,.2f}, qty={self.quantity})"

# Testing
phone = Item("Smartphone", 25000.0, 4)
print(phone)
print(f"Total Inventory Value: ₹{phone.total_value():,.2f}")
phone.apply_discount(10)
print(f"After 10% Discount: {phone}")
```

### Expected Output
```text
Item(name='Smartphone', price=₹25,000.00, qty=4)
Total Inventory Value: ₹100,000.00
After 10% Discount: Item(name='Smartphone', price=₹22,500.00, qty=4)
```

---

## Practice Quiz

### 1. What does the `self` parameter in a Python instance method represent?
A. The class type that spawned the method
B. A pointer to the global Python execution namespace
C. The specific instance on which the method was invoked
D. A copy of Python's garbage collection registry
**Answer:** C
**Explanation:** When invoking an instance method like `obj.method()`, Python passes the instance `obj` automatically as the first parameter `self`.
---

### 2. What happens if you define a mutable list as a class attribute and append items to it from an instance?
A. Python throws an `AttributeError`
B. The list is cloned exclusively for that instance
C. The list is modified for all instances sharing that class
D. The list converts automatically into an immutable tuple
**Answer:** C
**Explanation:** Class attributes are shared across all instances. Modifying a mutable class attribute affects every instance that references it.
---

### 3. Which decorator allows defining an alternative factory constructor that receives the class itself as `cls`?
A. `@property`
B. `@classmethod`
C. `@staticmethod`
D. `@factory`
**Answer:** B
**Explanation:** `@classmethod` passes the class object as its first argument (usually named `cls`), allowing the method to construct and return new instances of that class or its subclasses.
---

### 4. How does `@staticmethod` differ from regular instance methods and class methods?
A. It cannot be called without first creating an instance
B. It automatically runs in a background thread
C. It does not receive an implicit first argument (`self` or `cls`)
D. It can only return integer values
**Answer:** C
**Explanation:** A `@staticmethod` is a plain function bound into a class's namespace without receiving automatic `self` or `cls` references.
---

### 5. What is the standard purpose of the `__repr__` special method in Python?
A. To print formatted HTML documents for web browsers
B. To provide an unambiguous, developer-focused string representation of the object
C. To serialize the object to binary byte streams
D. To validate user permissions before accessing attributes
**Answer:** B
**Explanation:** `__repr__` is intended for developers and debugging, providing an explicit, unambiguous representation of the object state.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Inheritance & Method Overriding** (5: Object-Oriented Programming (Intermediate)).

👉 **[Continue to Next Lesson: Inheritance & Method Overriding →](/tutorials/python-for-intermediate/inheritance-method-overriding)**
