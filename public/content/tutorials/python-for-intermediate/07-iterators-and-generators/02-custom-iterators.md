---
id: python-intermediate-custom-iterators
slug: custom-iterators
course: python-for-intermediate
chapter: "7: Iterators and Generators"
topic: "7.2 Custom Iterators"
title: "Custom Iterators in Python"
description: "Master custom iterators in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 32
keywords:
  - python custom iterators
  - python intermediate
  - python custom iterators
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Custom Iterators in Python

While Python provides built-in iterators for sequences and collections, writing your own **Custom Iterators** allows you to stream complex data structures, generate custom mathematical sequences, and traverse domain models cleanly using Python's native `for` loop syntax.

---

## 1. Creating a Basic Custom Iterator

To create a custom iterator class, implement two essential methods:
1. **`__iter__(self)`**: Returns the iterator instance (typically `return self`).
2. **`__next__(self)`**: Calculates and returns the next element, or raises `StopIteration` when the sequence is completed.

### Example 1: A Custom `Countdown` Iterator

```python
class Countdown:
    """Iterates backwards from a given integer down to 1."""
    
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        # An iterator returns itself
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        
        value = self.current
        self.current -= 1
        return value

# Using in a standard for loop
for num in Countdown(5):
    print(num, end=" ")
# Output: 5 4 3 2 1
print()
```

---

## 2. Re-creating the `range()` Function

Here is how Python's built-in `range()` can be implemented from first principles:

```python
class StepRange:
    """Generates integers from start up to (but not including) stop by step."""
    
    def __init__(self, start: int, stop: int, step: int = 1):
        if step == 0:
            raise ValueError("Step cannot be zero.")
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        # Forward stepping check
        if self.step > 0 and self.current >= self.stop:
            raise StopIteration
        # Backward stepping check
        if self.step < 0 and self.current <= self.stop:
            raise StopIteration

        val = self.current
        self.current += self.step
        return val

# Stepping forwards
print(list(StepRange(0, 10, 2)))  # [0, 2, 4, 6, 8]

# Stepping backwards
print(list(StepRange(10, 0, -3))) # [10, 7, 4, 1]
```

---

## 3. Stateful Mathematical Sequence: Fibonacci Iterator

Custom iterators can maintain complex state across iterations without keeping every generated number in memory:

```python
class Fibonacci:
    """Generates the first N numbers in the Fibonacci sequence."""
    
    def __init__(self, limit: int):
        self.limit = limit
        self.count = 0
        self.a, self.b = 0, 1

    def __iter__(self):
        return self

    def __next__(self):
        if self.count >= self.limit:
            raise StopIteration

        val = self.a
        self.a, self.b = self.b, self.a + self.b
        self.count += 1
        return val

fib = Fibonacci(8)
print(list(fib))  # [0, 1, 1, 2, 3, 5, 8, 13]
```

---

## 4. Re-usable Iterables: Separating Iterable from Iterator

When a class combines `__iter__` and `__next__` in one object, it is consumed after a single pass and cannot be re-iterated without re-instantiation.

To build an iterable collection that can be looped over multiple times (like a list), separate the **Collection (Iterable)** from the **Iterator**:

```python
class BookIterator:
    """Maintains state for a single iteration pass."""
    def __init__(self, books):
        self._books = books
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index >= len(self._books):
            raise StopIteration
        book = self._books[self._index]
        self._index += 1
        return book


class Bookshelf:
    """Reusable Iterable collection."""
    def __init__(self):
        self.books = []

    def add_book(self, title: str):
        self.books.append(title)

    def __iter__(self):
        # Spawns a BRAND NEW iterator instance every time a loop starts!
        return BookIterator(self.books)

shelf = Bookshelf()
shelf.add_book("Clean Code")
shelf.add_book("Fluent Python")
shelf.add_book("Refactoring")

# First loop works
for b in shelf:
    print(f"Pass 1: {b}")

# Second loop ALSO works because __iter__() returned a fresh iterator!
for b in shelf:
    print(f"Pass 2: {b}")
```

---

## 5. Common Pitfalls

- **Forgetting `StopIteration`**: If your `__next__` method never raises `StopIteration`, loops over the iterator become infinite loops.
- **Forgetting `return self`**: An iterator's `__iter__` method *must* return an iterator object, typically `self`.
- **Modifying the underlying collection during iteration**: Adding or removing elements from a list while iterating over it leads to skipped elements or index bugs.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting to Return `self` from `__iter__()`
An iterator must implement both `__iter__()` and `__next__()`. `__iter__()` should return `self` so the iterator can be used directly in `for` loops.

### 2. Forgetting to Raise `StopIteration`
If `__next__()` does not raise `StopIteration` upon completion, a `for` loop over the iterator will become an infinite loop.

---

---

## 💻 Try It Yourself: Step Range Iterator

### Scenario
Build a custom float range iterator `FloatRange(start, stop, step)` that supports floating-point increments without floating-point drift.

### Complete Solution
```python
class FloatRange:
    def __init__(self, start: float, stop: float, step: float = 0.5):
        if step == 0:
            raise ValueError("Step cannot be zero.")
        self.current = float(start)
        self.stop = float(stop)
        self.step = float(step)

    def __iter__(self):
        return self

    def __next__(self):
        if (self.step > 0 and self.current >= self.stop) or (self.step < 0 and self.current <= self.stop):
            raise StopIteration
        val = self.current
        self.current = round(self.current + self.step, 6)
        return val

for val in FloatRange(1.0, 3.0, 0.5):
    print(val, end=" | ")
print()
```

### Expected Output
```text
1.0 | 1.5 | 2.0 | 2.5 | 
```

---

## Practice Quiz

### 1. What two methods must a custom iterator class implement to satisfy the Python Iterator Protocol?
A. `__init__()` and `__del__()`
B. `__iter__()` and `__next__()`
C. `__start__()` and `__step__()`
D. `__enter__()` and `__exit__()`
**Answer:** B
**Explanation:** The Iterator Protocol requires `__iter__()` (which returns the iterator) and `__next__()` (which returns consecutive items and raises `StopIteration`).
---

### 2. Why should the `__iter__()` method of an iterator class return `self`?
A. To prevent Python's garbage collector from deleting the object
B. So that the iterator itself can be used anywhere an iterable is expected (e.g. in `for` loops)
C. To force the class to run in a single thread
D. To clone the object in memory
**Answer:** B
**Explanation:** Python expects iterators to be iterables as well; returning `self` in `__iter__()` allows an iterator to be passed directly to `for` loops and built-in functions like `sum()`.
---

### 3. What happens if a custom iterator's `__next__()` method never raises `StopIteration`?
A. The iterator will raise a `SyntaxError`
B. Any standard `for` loop consuming it will continue indefinitely as an infinite loop
C. Python terminates the loop after 1000 cycles
D. Memory is automatically cleared
**Answer:** B
**Explanation:** Python relies exclusively on `StopIteration` to detect the end of iteration. Without it, the loop will run endlessly until interrupted.
---

### 4. How can you make a custom collection class re-iterable across multiple distinct `for` loops?
A. By placing `return self` in both `__iter__` and `__next__`
B. By having `__iter__()` return a new, distinct iterator instance every time it is called
C. By making all attributes static
D. By calling `del self` at the end of `__next__`
**Answer:** B
**Explanation:** To allow repeated iterations, the collection's `__iter__()` method must instantiate and return a fresh iterator object initialized at the beginning of the sequence.
---

### 5. What error is raised by `StepRange` if the step argument provided is `0`?
A. `ZeroDivisionError`
B. `ValueError`
C. `IndexError`
D. `StopIteration`
**Answer:** B
**Explanation:** In both Python's built-in `range()` and custom range implementations, a step of 0 is mathematically invalid and raises a `ValueError`.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Using Generators with yield** (7: Iterators and Generators).

👉 **[Continue to Next Lesson: Using Generators with yield →](/tutorials/python-for-intermediate/using-generators-with-yield)**
