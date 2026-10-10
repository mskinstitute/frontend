---
id: python-advanced-yield-from-expression
slug: yield-from-expression
course: python-for-advanced
chapter: "5: Generators & Coroutines"
topic: "5.2 Yield from Expression"
title: "Yield from Expression in Python"
description: "Master yield from expression in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 21
keywords:
  - python yield from expression
  - python advanced
  - python yield from expression
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# `yield from` Expression

Introduced in Python 3.3 via PEP 380, the `yield from <iterable>` expression is often mistaken for a mere syntactic shortcut for a `for item in iterable: yield item` loop. In reality, `yield from` establishes a **transparent, bidirectional communication channel** between the caller and an inner subgenerator, seamlessly delegating values, exceptions, return values, and lifecycle events.

---

## 1. The Delegation Channel Architecture

When a delegating generator uses `yield from`, it creates a direct conduit connecting the outer caller with the inner subgenerator:

```
                            Outer Caller
                                 │
                ┌────────────────┴────────────────┐
                │  next(), send(v), throw(e),     │
                │             close()             │
                ▼                                 ▼
       Delegating Generator              Direct Delegation Pipe
         yield from subgen() ═══════════►  Subgenerator
                ▲                                 │
                │        yields item              │
                └─────────────────────────────────┘
```

The delegating generator remains suspended while the subgenerator produces values. Data sent via `send()`, exceptions injected via `throw()`, and termination via `close()` bypass the delegating generator and pass directly into the subgenerator.

---

## 2. Capturing Return Values from Subgenerators

Prior to PEP 380, generators could not return values with meaningful data—any `return value` statement raised a `SyntaxError` or discarded the value. 

With `yield from`, a subgenerator can `return <value>`. Python embeds this returned value inside the `value` attribute of the terminating `StopIteration` exception, and `yield from` automatically extracts it into a variable:

```python
from typing import Generator, Tuple

def compute_batch_stats(batch: list[int]) -> Generator[int, None, dict[str, float]]:
    """Subgenerator: yields items sequentially, then returns summary metrics."""
    total = 0
    for num in batch:
        yield num  # Yielded directly to caller
        total += num
    
    # Return statement inside generator!
    return {
        "count": len(batch),
        "sum": total,
        "mean": total / len(batch) if batch else 0.0
    }

def pipeline_coordinator() -> Generator[int, None, None]:
    """Delegating generator: captures the subgenerator's return value."""
    print("[COORDINATOR] Processing Batch 1...")
    stats1 = yield from compute_batch_stats([10, 20, 30])
    print(f"[COORDINATOR] Batch 1 complete. Summary stats: {stats1}")

    print("\n[COORDINATOR] Processing Batch 2...")
    stats2 = yield from compute_batch_stats([100, 250, 400])
    print(f"[COORDINATOR] Batch 2 complete. Summary stats: {stats2}")

# Caller consuming delegating generator
for item in pipeline_coordinator():
    print(f"  Caller received yielded item: {item}")
```

---

## 3. Bidirectional Communication Delegation

The power of `yield from` becomes apparent when sending values into a subgenerator via `send()`:

```python
from typing import Generator

def averaging_coroutine() -> Generator[None, float, Tuple[int, float]]:
    """Subgenerator that calculates running averages from sent numbers."""
    total = 0.0
    count = 0
    while True:
        value = yield
        if value is None:
            break
        total += value
        count += 1
    return count, total / count if count > 0 else 0.0

def delegator(results_dict: dict, key: str):
    """Delegates incoming values to the averaging subgenerator."""
    # yield from transparently routes every send() call directly to subgen
    results_dict[key] = yield from averaging_coroutine()

# External caller
results = {}
del_gen = delegator(results, "sensor_readings")
next(del_gen)  # Prime the subgenerator through the delegator

# Send values into delegating generator
del_gen.send(10.0)
del_gen.send(20.0)
del_gen.send(60.0)

# Terminate subgenerator by sending None
try:
    del_gen.send(None)
except StopIteration:
    pass

print("Final captured results dict:", results)
# Output: {'sensor_readings': (3, 30.0)}
```

---

## 4. Flattening Nested and Recursive Data Structures

`yield from` simplifies recursive tree traversal algorithms by eliminating manual nested iteration loops:

```python
from typing import Any, Generator

def flatten_tree(nested_structure: Any) -> Generator[Any, None, None]:
    """Recursively flattens arbitrarily nested lists or tuples."""
    if isinstance(nested_structure, (list, tuple)):
        for element in nested_structure:
            # Recursively delegate to flatten_tree
            yield from flatten_tree(element)
    else:
        yield nested_structure

tree = [1, [2, [3, 4], 5], [[6, 7], 8], 9]
flat_list = list(flatten_tree(tree))
print("Original nested structure:", tree)
print("Flattened elements:      ", flat_list)
# Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

---

## 5. Architectural Comparison: `for ... yield` vs `yield from`

| Capability | `for item in subgen: yield item` | `yield from subgen` |
| :--- | :--- | :--- |
| **Data Yielding** | Supported | Supported |
| **`send()` Forwarding** | **Fails**: Values sent to delegator are discarded or error | **Supported**: Transferred directly to subgenerator |
| **`throw()` Forwarding** | **Fails**: Raises exception in delegator, not subgen | **Supported**: Injected cleanly into subgenerator |
| **`close()` Delegation**| Requires complex manual `try...finally` boilerplate | **Supported**: Automatically cascades `close()` to subgen |
| **Subgenerator Return Value** | **Lost**: Cannot access `return val` easily | **Captured**: `val = yield from subgen` extracts return |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Ignoring Sub-generator Return Values
`yield from subgen()` evaluates to the value returned by the sub-generator's `return` statement:
```python
# ✅ Capturing sub-generator return value
result = yield from calculate_subtotal()
```

### 2. Using `yield` Instead of `yield from`
Writing `yield subgen` yields the sub-generator object itself rather than delegating iteration to its elements.

---

---

## 💻 Try It Yourself: Recursive Tree Flattening with yield from

### Scenario
Write a generator that recursively traverses and flattens a deeply nested arbitrary list/tree structure using `yield from`.

### Complete Solution
```python
def flatten(nested_iterable):
    for item in nested_iterable:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item

nested_data = [1, [2, [3, 4], 5], [[6], 7], 8]
flattened = list(flatten(nested_data))
print("Nested:", nested_data)
print("Flattened:", flattened)
```

### Expected Output
```text
Nested: [1, [2, [3, 4], 5], [[6], 7], 8]
Flattened: [1, 2, 3, 4, 5, 6, 7, 8]
```

---

## Practice Quiz

### 1.
What is the primary difference between `yield from subgenerator()` and a standard `for item in subgenerator(): yield item` loop?
A. `yield from` compiles the code to C for a $10\times$ speedup.
B. `yield from` creates a bidirectional communication channel that forwards `send()`, `throw()`, and `close()`, while capturing subgenerator return values.
C. `yield from` can only be used on string objects.
D. A standard `for` loop does not work with generators.

**Answer:** B

**Explanation:** PEP 380 introduced `yield from` to establish a two-way pipeline between the caller and the subgenerator, delegating data, exceptions, termination signals, and return values transparently.

---

### 2.
How does a delegating generator capture the value returned by a subgenerator via a `return result` statement?
A. By reading `subgen.__return__`
B. By assigning the result of the `yield from` expression: `result = yield from subgen()`
C. By catching a `ReturnException`
D. Subgenerators are forbidden from returning values in Python.

**Answer:** B

**Explanation:** When a subgenerator executes `return value`, Python places the value in `StopIteration.value`. The `yield from` expression catches this automatically and evaluates to that returned value.

---

### 3.
What occurs when `delegator.send(data)` is called while the delegating generator is suspended at `yield from subgenerator()`?
A. The `data` is sent directly to `subgenerator()`.
B. An `AttributeError` is raised.
C. The delegating generator resumes and ignores the data.
D. The subgenerator is immediately closed.

**Answer:** A

**Explanation:** Any values passed via `send()` into the delegating generator are passed through directly to the active subgenerator at its current `yield` point.

---

### 4.
What exception carries the return value of a completed generator under the hood?
A. `GeneratorExit`
B. `StopIteration`
C. `StopAsyncIteration`
D. `Return`

**Answer:** B

**Explanation:** When a generator finishes via a `return expr` statement, Python raises `StopIteration(expr)`, storing `expr` in the `value` attribute of the exception instance.

---

### 5.
Which PEP introduced the `yield from` syntax into Python?
A. PEP 8
B. PEP 380
C. PEP 484
D. PEP 343

**Answer:** B

**Explanation:** PEP 380 ("Syntax for Delegating to a Subgenerator") was introduced in Python 3.3 to standardize generator delegation and subgenerator communication.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Coroutines with send()** (5: Generators & Coroutines).

👉 **[Continue to Next Lesson: Coroutines with send() →](/tutorials/python-for-advanced/coroutines-with-send)**
