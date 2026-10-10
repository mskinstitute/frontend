---
id: python-advanced-method-resolution-order-mro
slug: method-resolution-order-mro
course: python-for-advanced
chapter: "1: Advanced OOP Concepts"
topic: "1.3 Method Resolution Order (MRO)"
title: "Method Resolution Order (MRO) in Python"
description: "Master method resolution order (mro) in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 3
keywords:
  - python method resolution order mro
  - python advanced
  - python method resolution order (mro)
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Method Resolution Order (MRO) and C3 Linearization in Python

In complex object-oriented systems with multiple inheritance, determining which parent version of a method executes is not always trivial. Python resolves method lookups deterministically using the **Method Resolution Order (MRO)**, calculated via the sophisticated **C3 Linearization Algorithm**. Understanding MRO is essential for mastering cooperative multiple inheritance, mixins, and large Python frameworks.

---

## 1. The Diamond Problem

The classic dilemma in multiple inheritance is the **Diamond Problem**:

```text
               +------------------+
               |     Class A      |
               |  def action()    |
               +------------------+
                    /        \
                   /          \
      +------------------+  +------------------+
      |     Class B      |  |     Class C      |
      |  def action()    |  |  def action()    |
      +------------------+  +------------------+
                   \          /
                    \        /
               +------------------+
               |     Class D      |
               |    (B, C)        |
               +------------------+
```

If `Class D` inherits from both `B` and `C`, and all three define `action()`, which method should execute when calling `D().action()`?
- In naive Depth-First Search (used in Python 2.1), `A` would be visited before `C`, meaning `A`'s outdated base method could override `C`'s specialized method!
- Python solves this with **C3 Linearization**, ensuring that derived classes always precede their ancestors.

---

## 2. Inspecting the MRO

You can inspect the linear resolution order of any class using two attributes:
- **`ClassName.__mro__`**: Returns a tuple of classes in resolution order.
- **`ClassName.mro()`**: Returns the same order as a list.

```python
class A:
    def action(self):
        print("A's action")

class B(A):
    def action(self):
        print("B's action")

class C(A):
    def action(self):
        print("C's action")

class D(B, C):
    pass

d = D()
d.action()  # Output: B's action

# Inspecting the exact linear search sequence:
print([cls.__name__ for cls in D.__mro__])
# Output: ['D', 'B', 'C', 'A', 'object']
```

Python searches classes strictly from left to right along this sequence: `D` $\rightarrow$ `B` $\rightarrow$ `C` $\rightarrow$ `A` $\rightarrow$ `object`.

---

## 3. The Mathematics of C3 Linearization

The C3 algorithm guarantees three fundamental properties:
1. **Local Precedence Order**: In `class D(B, C)`, class `B` is always evaluated before class `C`.
2. **Monotonicity**: If class `X` precedes class `Y` in the MRO of any parent class, `X` will precede `Y` in the MRO of any derived class.
3. **Single Appearance**: Each ancestor class appears exactly once in the MRO list.

### The Linearization Formula:
$$L[C(B_1, B_2, \dots, B_N)] = C + \text{merge}(L[B_1], L[B_2], \dots, L[B_N], (B_1, B_2, \dots, B_N))$$

The `merge` operation inspects the head of each candidate list. If a head class is not present in the tail (any position other than the first) of any other list, it is extracted and appended to the MRO output.

---

## 4. `super()` is NOT "Call Parent"—It is "Call Next in MRO"!

One of the most widespread misconceptions in Python is that `super()` simply calls the direct parent class. 

**`super()` actually calls the NEXT class in the active MRO sequence of the originating instance!**

Notice how `super()` in class `B` actually calls class `C` (its sibling!), not its parent `A`:

```python
class Root:
    def ping(self):
        print("Root.ping()")

class A(Root):
    def ping(self):
        print("A.ping() start")
        super().ping()
        print("A.ping() end")

class B(Root):
    def ping(self):
        print("B.ping() start")
        super().ping()  # In class C(A, B), this calls Root, but in C(B, A), super() calls A!
        print("B.ping() end")

class Composite(A, B):
    def ping(self):
        print("Composite.ping() start")
        super().ping()
        print("Composite.ping() end")

print("MRO:", [cls.__name__ for cls in Composite.__mro__])
# ['Composite', 'A', 'B', 'Root', 'object']

c = Composite()
c.ping()
```

### Output:
```text
Composite.ping() start
A.ping() start
B.ping() start
Root.ping()
B.ping() end
A.ping() end
Composite.ping() end
```
`A`'s call to `super().ping()` invoked **`B.ping()`**! This cooperative dispatch pattern enables multi-tiered mixin architectures without hardcoded dependencies.

---

## 5. Inconsistent MRO: When Python Refuses to Compile

If an inheritance hierarchy violates the local precedence rules, the C3 merge algorithm fails, and Python refuses to create the class with a `TypeError`:

```python
class X: pass
class Y(X): pass

# Fails! X cannot precede Y because Y inherits from X!
try:
    class Invalid(X, Y):
        pass
except TypeError as err:
    print(f"Compilation Blocked: {err}")
    # TypeError: Cannot create a consistent method resolution order (MRO) for bases X, Y
```

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Bypassing `super()` with Direct Base Class Calls
Calling `Parent.__init__(self)` directly in multiple inheritance violates C3 Linearization and causes common ancestor constructors to be invoked multiple times in diamond hierarchies. Always use cooperative `super().__init__()`.

### 2. Inconsistent Hierarchy Signatures
Cooperative multiple inheritance requires that all participating classes accept consistent arguments or forward extra arguments with `*args, **kwargs`.

---

---

## 💻 Try It Yourself: Inspecting C3 Linearization in Diamonds

### Scenario
Construct a classic diamond inheritance hierarchy with classes `A`, `B(A)`, `C(A)`, and `D(B, C)`. Use cooperative `super()` calls and inspect `D.__mro__`.

### Complete Solution
```python
class A:
    def ping(self):
        print("A.ping()")

class B(A):
    def ping(self):
        print("B.ping() -> calling super")
        super().ping()

class C(A):
    def ping(self):
        print("C.ping() -> calling super")
        super().ping()

class D(B, C):
    def ping(self):
        print("D.ping() -> calling super")
        super().ping()

d = D()
d.ping()
print("
Method Resolution Order (MRO):")
for idx, cls in enumerate(D.__mro__, 1):
    print(f"{idx}. {cls.__name__}")
```

### Expected Output
```text
D.ping() -> calling super
B.ping() -> calling super
C.ping() -> calling super
A.ping()

Method Resolution Order (MRO):
1. D
2. B
3. C
4. A
5. object
```

---

## Practice Quiz

### 1. Which algorithm does Python use to compute the Method Resolution Order (MRO)?
A. Breadth-First Search (BFS)
B. C3 Linearization
C. Dijkstra's Shortest Path
D. A* Search
**Answer:** B
**Explanation:** Python 2.3+ utilizes the C3 Linearization algorithm to produce a deterministic, monotonic method resolution order.
---

### 2. In `class D(B, C): pass`, what does `D.__mro__` return?
A. A list of all variable names in D
B. A tuple showing the exact linear order in which classes are searched for methods and attributes
C. A dictionary of parent class methods
D. A string with the class name
**Answer:** B
**Explanation:** `__mro__` returns a tuple representing the linear resolution sequence starting from the class itself down to `object`.
---

### 3. What does `super()` actually invoke in Python?
A. Strictly the first parent class declared in the class definition
B. The next class in the active instance's Method Resolution Order (MRO)
C. The root `object` class
D. A global fallback function
**Answer:** B
**Explanation:** `super()` is dynamic; it searches the MRO of the instance currently executing and invokes the subsequent class in that chain.
---

### 4. What happens if a class definition creates an inheritance conflict that violates C3 linearity?
A. Python uses the first class and silently ignores the second
B. Python raises a `TypeError: Cannot create a consistent method resolution order (MRO)` at class definition time
C. The program hangs in an infinite loop
D. Python runs in single inheritance mode
**Answer:** B
**Explanation:** If an inheritance graph is topologically inconsistent, Python detects the failure during class creation and raises a `TypeError`.
---

### 5. In the diamond inheritance `class D(B, C)` where both `B` and `C` inherit from `A`, why does `C` execute before `A` in the MRO?
A. Because C is shorter alphabetically
B. Because C3 linearization guarantees that subclasses always precede their base ancestor classes
C. Because Python flips class orders backwards
D. Because `A` is marked as abstract
**Answer:** B
**Explanation:** C3 linearization guarantees that a parent class (A) is never visited until all of its derived subclasses (B and C) in the hierarchy have been evaluated.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Multiple Inheritance** (1: Advanced OOP Concepts).

👉 **[Continue to Next Lesson: Multiple Inheritance →](/tutorials/python-for-advanced/multiple-inheritance)**
