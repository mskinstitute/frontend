---
id: python-intermediate-polymorphism-basics
slug: polymorphism-basics
course: python-for-intermediate
chapter: "5: Object-Oriented Programming (Intermediate)"
topic: "5.3 Polymorphism Basics"
title: "Polymorphism Basics in Python"
description: "Master polymorphism basics in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 23
keywords:
  - python polymorphism basics
  - python intermediate
  - python polymorphism basics
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Polymorphism Basics in Python

The term **Polymorphism** is derived from Greek words meaning "having multiple forms". In software architecture and Object-Oriented Programming, polymorphism allows different classes to expose the same interface (method signatures) while providing distinct, specialized implementations behind the scenes.

---

## 1. What is Polymorphism?

Polymorphism allows code to treat diverse object types uniformly. Instead of checking an object's exact type with long chains of `if/elif` statements, client code simply invokes a standard method name, and Python executes the version specific to that object.

```python
class Dog:
    def speak(self) -> str:
        return "Woof!"

class Cat:
    def speak(self) -> str:
        return "Meow!"

class Cow:
    def speak(self) -> str:
        return "Moo!"

# A polymorphic function: Works with ANY object providing a speak() method
def animal_chorus(animals):
    for animal in animals:
        print(f"{animal.__class__.__name__} says: {animal.speak()}")

zoo = [Dog(), Cat(), Cow()]
animal_chorus(zoo)
```

---

## 2. Duck Typing: The Python Philosophy

Python is dynamically typed and adheres to the **Duck Typing** philosophy:
> *"If it walks like a duck and quacks like a duck, it's a duck."*

In statically typed languages (like Java or C++), objects must typically inherit from a shared interface or abstract class to achieve polymorphism. In Python, objects don't need a shared ancestor class; as long as they implement the expected methods or attributes, they are valid candidates!

### Duck Typing Example: Audio Players

```python
class MP3Player:
    def play(self, filename: str):
        print(f"Decoding MP3 audio: {filename}")

class FLACPlayer:
    def play(self, filename: str):
        print(f"Streaming lossless FLAC stream: {filename}")

class VideoPlayer:
    def play(self, filename: str):
        print(f"Rendering video frames & audio: {filename}")

def launch_media(player, media_file):
    # We do not check isinstance(player, ...); we just invoke .play()
    player.play(media_file)

launch_media(MP3Player(), "song.mp3")
launch_media(VideoPlayer(), "movie.mp4")
```

---

## 3. Polymorphism in Class Hierarchies

When combined with class inheritance, polymorphism ensures that derived subclasses adhere to common parent contracts while delivering specialized behavior:

```python
import math

class Shape:
    def area(self) -> float:
        raise NotImplementedError("Subclasses must implement area()")

    def perimeter(self) -> float:
        raise NotImplementedError("Subclasses must implement perimeter()")


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * (self.radius ** 2)

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


shapes: list[Shape] = [Circle(7), Rectangle(10, 5), Circle(3.5)]

for s in shapes:
    print(f"Shape: {s.__class__.__name__:<10} | Area: {s.area():.2f} | Perimeter: {s.perimeter():.2f}")
```

---

## 4. Operator Overloading: Polymorphism with Built-in Operators

Python achieves operator polymorphism through **magic / dunder (double underscore) methods**. Operators like `+`, `*`, `==`, and `<` map directly to internal method calls on objects:

| Operator | Dunder Method | Example Use Case |
| :--- | :--- | :--- |
| `+` | `__add__(self, other)` | Vector addition, combining inventories |
| `-` | `__sub__(self, other)` | Subtracting financial amounts |
| `==` | `__eq__(self, other)` | Custom object equality |
| `<` | `__lt__(self, other)` | Sorting custom objects in lists |
| `len()` | `__len__(self)` | Returning item count for custom containers |

### Practical Example: 2D Vector Arithmetic

```python
class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # Overloads the '+' operator
    def __add__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

    # Overloads the '==' equality operator
    def __eq__(self, other):
        if not isinstance(other, Vector2D):
            return False
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

v1 = Vector2D(2, 5)
v2 = Vector2D(4, 1)

# Using '+' invokes Vector2D.__add__(v1, v2)
v3 = v1 + v2
print(v3)           # Vector2D(6, 6)
print(v3 == Vector2D(6, 6))  # True
```

---

## 5. Real-World Architecture: Pluggable Payment Processors

```python
class UPIPayment:
    def process_payment(self, amount: float):
        print(f"Processing ₹{amount:.2f} via UPI Instant Transfer.")

class CreditCardPayment:
    def process_payment(self, amount: float):
        print(f"Processing ₹{amount:.2f} via Credit Card Gateway (2% fee).")

class CryptoPayment:
    def process_payment(self, amount: float):
        print(f"Processing ₹{amount:.2f} via Blockchain Confirmation.")

def checkout(processor, total: float):
    # Polymorphic dispatch allows adding new processors without modifying checkout!
    processor.process_payment(total)

checkout(UPIPayment(), 1499.00)
checkout(CreditCardPayment(), 4999.00)
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Excessive `isinstance()` Checks
Writing cascades of `if isinstance(obj, Cat): ... elif isinstance(obj, Dog): ...` defeats polymorphism. Instead, define a common method (e.g., `.speak()`) on all classes and let duck typing handle execution.

### 2. Returning `None` from `__str__()` or `__repr__()`
Special methods like `__str__()` must return a string. Returning a non-string or printing inside the method causes a `TypeError`.

---

---

## 💻 Try It Yourself: Polymorphic Payment Processing

### Scenario
Create a polymorphic payment system where different payment methods (`CreditCardPayment`, `UPIPayment`, `CryptoPayment`) implement a unified `pay(amount)` method.

### Complete Solution
```python
class CreditCardPayment:
    def __init__(self, card_last4: str):
        self.card_last4 = card_last4

    def pay(self, amount: float):
        print(f"Paid ₹{amount:,.2f} using Credit Card ending in {self.card_last4} (+2% surcharge).")

class UPIPayment:
    def __init__(self, vpa: str):
        self.vpa = vpa

    def pay(self, amount: float):
        print(f"Paid ₹{amount:,.2f} via UPI to {self.vpa} (Instant settlement).")

# Polymorphic processor function
def process_checkout(payment_method, bill_amount):
    payment_method.pay(bill_amount)

# Test diverse payment methods
process_checkout(CreditCardPayment("8821"), 4500.0)
process_checkout(UPIPayment("aarav@upi"), 1200.0)
```

### Expected Output
```text
Paid ₹4,500.00 using Credit Card ending in 8821 (+2% surcharge).
Paid ₹1,200.00 via UPI to aarav@upi (Instant settlement).
```

---

## Practice Quiz

### 1. What does "Duck Typing" mean in the context of Python polymorphism?
A. Classes must be named after biological entities
B. Python inspects an object's behavior and available methods rather than its explicit class type
C. All objects must inherit from an abstract `Duck` class
D. Static typing is enforced during bytecode compilation
**Answer:** B
**Explanation:** Duck typing focuses on what an object can do (its methods and interface) rather than its strict nominal class hierarchy.
---

### 2. Which dunder method is invoked when the `+` operator is used between two custom objects?
A. `__plus__()`
B. `__sum__()`
C. `__add__()`
D. `__concat__()`
**Answer:** C
**Explanation:** The `+` operator delegates to the `__add__` method of the left-hand operand.
---

### 3. What is the main architectural advantage of polymorphism in large software systems?
A. It eliminates the need for RAM memory allocation
B. It enables adding new subtypes without modifying existing caller code (Open/Closed Principle)
C. It compiles Python scripts into standalone binary executables
D. It forces all variables to be immutable
**Answer:** B
**Explanation:** Polymorphic code interacts with high-level interfaces, so new subclasses can be introduced without breaking or changing existing calling logic.
---

### 4. What exception should base class placeholder methods raise to mandate child implementation?
A. `ValueError`
B. `RuntimeError`
C. `NotImplementedError`
D. `AssertionError`
**Answer:** C
**Explanation:** `NotImplementedError` indicates that a method is intended to be implemented by derived subclasses.
---

### 5. Which dunder method allows a custom class instance to be passed into Python's built-in `len()` function?
A. `__size__()`
B. `__count__()`
C. `__length__()`
D. `__len__()`
**Answer:** D
**Explanation:** Python's built-in `len(obj)` calls `obj.__len__()`, which must return a non-negative integer.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Encapsulation and Abstraction** (5: Object-Oriented Programming (Intermediate)).

👉 **[Continue to Next Lesson: Encapsulation and Abstraction →](/tutorials/python-for-intermediate/encapsulation-and-abstraction)**
