---
id: python-intermediate-inheritance-method-overriding
slug: inheritance-method-overriding
course: python-for-intermediate
chapter: "5: Object-Oriented Programming (Intermediate)"
topic: "5.2 Inheritance & Method Overriding"
title: "Inheritance & Method Overriding in Python"
description: "Master inheritance & method overriding in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 22
keywords:
  - python inheritance method overriding
  - python intermediate
  - python inheritance & method overriding
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Inheritance & Method Overriding in Python

Inheritance is a cornerstone of Object-Oriented Programming that enables a child (derived) class to inherit attributes and methods from a parent (base) class. It facilitates clean code reuse, models hierarchical domain relationships ("is-a"), and allows subclasses to specialize or override behaviors.

---

## 1. Single Inheritance Basics

In Python, inheritance is declared by passing the parent class name inside parentheses after the child class definition:

```python
class Vehicle:
    def __init__(self, brand: str, model: str):
        self.brand = brand
        self.model = model
        self.speed = 0

    def accelerate(self, increment: int):
        self.speed += increment
        print(f"{self.brand} {self.model} accelerated to {self.speed} km/h.")

    def brake(self):
        self.speed = 0
        print(f"{self.brand} {self.model} brought to a stop.")

# Car inherits all attributes and methods from Vehicle
class Car(Vehicle):
    pass

my_car = Car("Tata", "Nexon")
my_car.accelerate(50)  # Tata Nexon accelerated to 50 km/h.
my_car.brake()         # Tata Nexon brought to a stop.
```

---

## 2. Extending Constructors with `super().__init__()`

When a child class needs its own unique attributes in addition to those of the parent, use the built-in `super()` function to invoke the parent class's constructor:

```python
class Vehicle:
    def __init__(self, brand: str, model: str, year: int):
        self.brand = brand
        self.model = model
        self.year = year

class ElectricCar(Vehicle):
    def __init__(self, brand: str, model: str, year: int, battery_kwh: float):
        # 1. Delegate core vehicle initialization to the parent class
        super().__init__(brand, model, year)
        
        # 2. Initialize subclass-specific attribute
        self.battery_kwh = battery_kwh
        self.charge_percent = 100

    def charge(self):
        self.charge_percent = 100
        print(f"{self.brand} {self.model} battery charged to 100%.")

ev = ElectricCar("Tata", "Punch EV", 2024, 35.0)
print(f"Vehicle: {ev.brand} {ev.model} ({ev.year}) | Battery: {ev.battery_kwh} kWh")
ev.charge()
```

---

## 3. Method Overriding

**Method Overriding** occurs when a child class provides a custom implementation of a method that is already defined in its parent class.

### Full Override vs. Cooperative Augmentation

1. **Full Override**: The child method completely replaces the parent method logic.
2. **Augmentation**: The child method runs custom logic before or after calling `super().method_name()`.

```python
class Employee:
    def __init__(self, name: str, base_salary: float):
        self.name = name
        self.base_salary = base_salary

    def calculate_annual_pay(self) -> float:
        return self.base_salary * 12

    def display_role(self):
        print(f"{self.name} is a standard corporate employee.")


class Manager(Employee):
    def __init__(self, name: str, base_salary: float, quarterly_bonus: float):
        super().__init__(name, base_salary)
        self.quarterly_bonus = quarterly_bonus

    # Method Overriding with Augmentation using super()
    def calculate_annual_pay(self) -> float:
        standard_pay = super().calculate_annual_pay()
        total_bonuses = self.quarterly_bonus * 4
        return standard_pay + total_bonuses

    # Complete Method Override
    def display_role(self):
        print(f"{self.name} is an Engineering Manager leading a team.")

emp = Employee("Ramesh", 50000)
mgr = Manager("Sneha", 90000, 15000)

print(f"{emp.name} Annual Pay: ₹{emp.calculate_annual_pay():,.2f}")  # ₹600,000.00
print(f"{mgr.name} Annual Pay: ₹{mgr.calculate_annual_pay():,.2f}")  # ₹1,140,000.00

emp.display_role()
mgr.display_role()
```

---

## 4. Multiple Inheritance & Method Resolution Order (MRO)

Python supports multiple inheritance, where a class inherits from two or more parent classes. The order in which methods are resolved is dictated by the C3 Linearization algorithm, accessible via the `mro()` method or `__mro__` attribute.

```python
class Device:
    def ping(self):
        print("Device responding.")

class WiFiEnabled(Device):
    def ping(self):
        print("WiFi Ping: Connected to router.")

class BluetoothEnabled(Device):
    def ping(self):
        print("Bluetooth Ping: Connected to paired unit.")

# Multiple inheritance order determines resolution
class SmartSpeaker(WiFiEnabled, BluetoothEnabled):
    pass

speaker = SmartSpeaker()
speaker.ping()  # Output: WiFi Ping: Connected to router.

# Inspect the MRO path
print([cls.__name__ for cls in SmartSpeaker.__mro__])
# ['SmartSpeaker', 'WiFiEnabled', 'BluetoothEnabled', 'Device', 'object']
```

---

## 5. Type Introspection: `isinstance()` vs. `issubclass()`

Always use Python's built-in inspection functions rather than comparing raw `type(obj) == Class`:

```python
ev = ElectricCar("Tesla", "Model 3", 2023, 75.0)

# Check instance relationship
print(isinstance(ev, ElectricCar))  # True
print(isinstance(ev, Vehicle))      # True (inherited)
print(isinstance(ev, object))       # True (root of all Python objects)

# Check class hierarchy relationship
print(issubclass(ElectricCar, Vehicle))  # True
print(issubclass(Vehicle, ElectricCar))  # False
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting to Call `super().__init__()`
Failing to invoke `super().__init__()` leaves base class attributes uninitialized, resulting in unexpected `AttributeError`s when derived methods execute.

### 2. Violating the Liskov Substitution Principle (LSP)
Overridden methods in child classes should accept the same parameters and return compatible data types as the parent method to prevent breaking caller expectations.

---

---

## 💻 Try It Yourself: Vehicle Hierarchy with Super()

### Scenario
Define a base class `Vehicle` and a child class `ElectricCar` that extends `__init__` with `battery_capacity_kwh` using `super()` and overrides `drive()` to display battery consumption.

### Complete Solution
```python
class Vehicle:
    def __init__(self, brand: str, model: str):
        self.brand = brand
        self.model = model

    def drive(self, distance_km: float):
        print(f"Driving {self.brand} {self.model} for {distance_km} km.")

class ElectricCar(Vehicle):
    def __init__(self, brand: str, model: str, battery_kwh: float):
        super().__init__(brand, model)
        self.battery_kwh = battery_kwh
        self.charge_remaining = battery_kwh

    def drive(self, distance_km: float):
        # Overridden method: consumes ~0.15 kWh per km
        consumed = distance_km * 0.15
        self.charge_remaining = max(0.0, self.charge_remaining - consumed)
        print(f"⚡ Electric drive: {self.brand} {self.model} traveled {distance_km} km.")
        print(f"Remaining Battery: {self.charge_remaining:.1f}/{self.battery_kwh} kWh")

ev = ElectricCar("Tata", "Nexon EV", 40.5)
ev.drive(120)
```

### Expected Output
```text
⚡ Electric drive: Tata Nexon EV traveled 120 km.
Remaining Battery: 22.5/40.5 kWh
```

---

## Practice Quiz

### 1. Which function is used in a child class constructor to call the parent class's `__init__` method?
A. `parent().__init__()`
B. `super().__init__()`
C. `this.__init__()`
D. `base().__init__()`
**Answer:** B
**Explanation:** `super()` returns a proxy object that delegates method calls to the parent or sibling classes according to the class MRO.
---

### 2. What happens when a child class defines a method with the exact same name and signature as its parent class?
A. A `NameConflictError` is raised at compilation
B. The child class method overrides the parent class method
C. Both methods are merged together automatically
D. Python ignores the child method and defaults to the parent
**Answer:** B
**Explanation:** Defining a method in a child class with the same name as a parent method overrides the parent implementation when invoked on instances of the child.
---

### 3. What does MRO stand for in Python's object model?
A. Method Return Object
B. Main Runtime Order
C. Method Resolution Order
D. Memory Reference Optimization
**Answer:** C
**Explanation:** MRO stands for Method Resolution Order, the deterministic order in which Python searches class hierarchies for attributes and methods.
---

### 4. Which built-in function checks whether a specific class inherits from another class?
A. `isinstance()`
B. `issubclass()`
C. `hasattr()`
D. `isderived()`
**Answer:** B
**Explanation:** `issubclass(sub, sup)` returns `True` if `sub` is a direct or indirect subclass of `sup`.
---

### 5. If `class Dog(Animal)` does not define its own `__init__` method, what constructor is executed when running `Dog()`?
A. Python creates a dummy object without initializing attributes
B. The constructor of `Animal` is automatically called
C. A `TypeError` is raised because constructors are mandatory
D. The `__init__` method of `type` is called
**Answer:** B
**Explanation:** If a child class does not declare an `__init__` method, Python traverses the MRO and calls the parent's `__init__` method automatically.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Polymorphism Basics** (5: Object-Oriented Programming (Intermediate)).

👉 **[Continue to Next Lesson: Polymorphism Basics →](/tutorials/python-for-intermediate/polymorphism-basics)**
