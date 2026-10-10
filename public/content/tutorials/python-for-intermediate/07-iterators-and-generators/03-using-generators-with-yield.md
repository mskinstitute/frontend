---
id: python-intermediate-using-generators-with-yield
slug: using-generators-with-yield
course: python-for-intermediate
chapter: "7: Iterators and Generators"
topic: "7.3 Using Generators with yield"
title: "Using Generators with yield in Python"
description: "Master using generators with yield in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 33
keywords:
  - python using generators with yield
  - python intermediate
  - python using generators with yield
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Using Generators with Yield in Python

Writing custom iterator classes requires boilerplate code: tracking indices, defining `__iter__()`, handling `__next__()`, and manually managing `StopIteration`. 

**Generators** provide a simple, elegant way to create iterators using regular functions. By replacing the `return` statement with `yield`, Python handles the entire Iterator Protocol automatically behind the scenes.

---

## 1. What is `yield`?

When a function contains the `yield` keyword, Python automatically compiles it into a **Generator Function**. Calling this function does not execute its body immediately; instead, it returns a **Generator Object**.

- **`return`**: Terminates the function completely and returns a value, destroying its local stack frame.
- **`yield`**: Produces a value, **pauses** function execution, and preserves its entire execution context (all local variables and instruction pointer) in memory until the next value is requested.

```python
def simple_number_stream():
    print("-> Generator started")
    yield 10
    print("-> Resumed at second yield")
    yield 20
    print("-> Resumed at third yield")
    yield 30
    print("-> Generator finished")

# 1. Calling the function returns a generator object (no execution yet!)
gen = simple_number_stream()
print(type(gen))  # <class 'generator'>

# 2. Each next() call executes until the next yield
print(next(gen))  # Prints: "-> Generator started", then returns 10
print(next(gen))  # Prints: "-> Resumed at second yield", then returns 20
print(next(gen))  # Prints: "-> Resumed at third yield", then returns 30

# 3. Next call raises StopIteration automatically
try:
    next(gen)
except StopIteration:
    print("Stream ended.")
```

---

## 2. Memory Efficiency: Processing Huge Files

The superpower of generators is **lazy evaluation**—values are computed strictly on-demand.

Consider reading a 10 GB log file. Reading it into a standard list with `.readlines()` will immediately exhaust system RAM with an `OutOfMemory` crash. A generator reads one line at a time with near-zero memory footprint:

```python
def read_large_log(filepath):
    """Streams file lines lazily without reading whole file into RAM."""
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if "ERROR" in line:
                yield line.strip()

# Memory usage is constant (a few kilobytes) even for 100 GB files!
for error_line in read_large_log("server.log"):
    print(f"Logged Incident: {error_line}")
```

---

## 3. Building Generator Pipelines

You can chain multiple generators together like unix pipes (`|`) to form clean, modular data processing pipelines:

```python
# Stage 1: Infinite sequence of integers
def generate_integers():
    n = 1
    while True:
        yield n
        n += 1

# Stage 2: Filter for even numbers
def filter_evens(numbers):
    for num in numbers:
        if num % 2 == 0:
            yield num

# Stage 3: Compute square
def square_numbers(numbers):
    for num in numbers:
        yield num ** 2

# Pipeline: Ints -> Evens -> Squares
pipeline = square_numbers(filter_evens(generate_integers()))

# Extract first 5 processed results
results = [next(pipeline) for _ in range(5)]
print(results)  # [4, 16, 36, 64, 100]
```

---

## 4. Advanced Generator Features: `send()` and `close()`

Generators can also receive data back from the caller via `.send(value)`:

```python
def running_average():
    """Calculates running average of values sent into it."""
    total = 0.0
    count = 0
    average = None
    
    while True:
        # yield produces current average AND receives incoming value
        val = yield average
        if val is None:
            break
        total += val
        count += 1
        average = total / count

avg_calculator = running_average()

# Prime the generator (advance to first yield)
next(avg_calculator)  # Returns None

print(avg_calculator.send(10))  # 10.0
print(avg_calculator.send(20))  # 15.0
print(avg_calculator.send(30))  # 20.0

# Terminate generator cleanly
avg_calculator.close()
```

---

## 5. Comparison: Regular Function vs. Generator

| Attribute | Regular Function | Generator Function |
| :--- | :--- | :--- |
| **Keyword** | Uses `return` | Uses `yield` |
| **Execution** | Executes to completion in one call | Pauses and resumes on demand |
| **Return Value** | Single value or collection | Generator object |
| **Memory** | Stores entire result set in RAM | Generates values lazily one at a time |
| **Protocol** | Not iterable by default | Implements Iterator Protocol natively |

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Re-using an Exhausted Generator
A generator can only be consumed once. Once it raises `StopIteration`, iterating over it again yields zero items silently. Create a new generator instance if you need a fresh pass.

### 2. Calling a Generator Function Without Iterating
Calling a generator function returns a generator object; it does not execute the function body until `next()` is called or a `for` loop begins.

---

---

## 💻 Try It Yourself: Chunked Data Generator

### Scenario
Build a generator function `chunk_stream(iterable, chunk_size)` that yields fixed-size sublists lazily without loading the entire collection into memory.

### Complete Solution
```python
def chunk_stream(iterable, chunk_size):
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == chunk_size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk

# Test chunk generator
numbers = list(range(1, 11))
for batch in chunk_stream(numbers, 3):
    print(f"Batch: {batch}")
```

### Expected Output
```text
Batch: [1, 2, 3]
Batch: [4, 5, 6]
Batch: [7, 8, 9]
Batch: [10]
```

---

## Practice Quiz

### 1. What does Python return when a function containing a `yield` statement is invoked?
A. The value specified after `yield`
B. A Generator object implementing the Iterator Protocol
C. A tuple of all yielded elements
D. `None`
**Answer:** B
**Explanation:** Calling a generator function does not run the code immediately; it returns a generator object that controls execution via `next()`.
---

### 2. How does `yield` differ from `return`?
A. `yield` can only return integers, while `return` returns any object
B. `yield` pauses the function state and preserves its local variables, while `return` destroys the execution frame
C. `yield` forces Python into multi-threaded mode
D. There is no operational difference
**Answer:** B
**Explanation:** `yield` pauses the function and saves its local state so execution can resume seamlessly upon the next call to `next()`.
---

### 3. What exception is automatically raised when a generator function reaches its end or an empty `return`?
A. `GeneratorExit`
B. `StopIteration`
C. `SystemExit`
D. `IndexError`
**Answer:** B
**Explanation:** When a generator function finishes executing or hits a `return`, Python automatically raises `StopIteration` to signal that the iterator is exhausted.
---

### 4. Why are generators essential when parsing massive datasets (such as a 50 GB log file)?
A. They compress data into zip format in memory
B. They load only one record at a time into RAM (lazy evaluation), preventing out-of-memory crashes
C. They bypass Python's Global Interpreter Lock (GIL)
D. They execute in GPU memory
**Answer:** B
**Explanation:** Generators evaluate lazily, consuming minimal constant memory regardless of the total size of the stream being processed.
---

### 5. Which generator method allows sending a value back into the generator function at the point of `yield`?
A. `push()`
B. `send()`
C. `insert()`
D. `feed()`
**Answer:** B
**Explanation:** The `.send(value)` method resumes the generator and provides a value that becomes the result of the current `yield` expression inside the generator.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Generator Expressions** (7: Iterators and Generators).

👉 **[Continue to Next Lesson: Generator Expressions →](/tutorials/python-for-intermediate/generator-expressions)**
