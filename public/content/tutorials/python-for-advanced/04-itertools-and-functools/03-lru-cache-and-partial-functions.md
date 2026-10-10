---
id: python-advanced-lru-cache-and-partial-functions
slug: lru-cache-and-partial-functions
course: python-for-advanced
chapter: "4: Itertools and Functools"
topic: "4.3 lru_cache and Partial Functions"
title: "lru_cache and Partial Functions in Python"
description: "Master lru_cache and partial functions in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 18
keywords:
  - python lru cache and partial functions
  - python advanced
  - python lru_cache and partial functions
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# `lru_cache` and Partial Functions

In production Python engineering, optimizing CPU-bound functions and simplifying callable interfaces are common architectural requirements. The `functools` module provides two essential tools for these tasks: `@lru_cache` (and `@cache`) for memoization, and `partial` (and `partialmethod`) for partial function application.

---

## 1. Memoization with `@functools.lru_cache`

Memoization caches the output of an expensive pure function based on its input arguments. When invoked with previously seen arguments, the function skips execution and returns the cached result from an internal lookup table.

```
                         Function Call: compute(10, 20)
                                        │
                                        ▼
                           Has (10, 20) been cached?
                                        │
                       ┌────────────────┴────────────────┐
                      YES                                NO
                       │                                 │
                       ▼                                 ▼
              Cache Hit Detected                 Cache Miss Detected
             Return cached value                Execute function body
              (0 ms latency)                    Store result in cache table
                                                Return computed value
```

### The Least Recently Used (LRU) Eviction Policy

When the cache reaches its `maxsize` threshold, the entry that has gone the longest without being accessed is evicted to free space for the incoming result.

```python
import functools
import time

@functools.lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    """Calculates Fibonacci numbers with exponential speedup via memoization."""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Benchmark Fibonacci calculation
start = time.perf_counter()
fib_value = fibonacci(50)
elapsed = (time.perf_counter() - start) * 1000

print(f"Fibonacci(50) = {fib_value}")
print(f"Elapsed computation time: {elapsed:.4f} ms")

# Inspect cache telemetry
info = fibonacci.cache_info()
print(f"Cache Telemetry -> Hits: {info.hits}, Misses: {info.misses}, Size: {info.currsize}/{info.maxsize}")
```

### Python 3.9+ `@functools.cache`

Python 3.9 introduced `@functools.cache` as a shorthand for `@functools.lru_cache(maxsize=None)`. Because it is unbounded, it avoids LRU eviction tracking overhead, providing maximum execution speed when memory growth is not a concern.

---

## 2. Hashability and the Method Caching Trap

> **Crucial Rule 1:** All arguments passed into an `@lru_cache` decorated function **must be hashable** (i.e. implement `__hash__`). Passing a `list`, `dict`, or `set` will trigger a runtime `TypeError: unhashable type: 'list'`.

> **Crucial Rule 2 (Memory Leak with `self`):** If you apply `@lru_cache` directly to an instance method, the cache table stores a reference to `self` in its key tuple `(self, *args)`. This circular reference prevents the instance from being garbage-collected until `cache_clear()` is explicitly invoked!

```python
# The Method Caching Anti-Pattern:
class DataModel:
    @functools.lru_cache(maxsize=64)  # Retains reference to self!
    def calculate(self, param: int) -> int:
        return param * 2

# Preferred Alternative: Free function or cached_property
```

---

## 3. Partial Function Application with `functools.partial`

Partial function application allows you to "freeze" a portion of a function's arguments and/or keyword arguments, producing a new callable with fewer required parameters (reduced arity).

```
   Original Function: connect(host, port, timeout, secure)   (4 arguments)
                                      │
                                      ▼
             functools.partial(connect, host="api.internal", port=443, secure=True)
                                      │
                                      ▼
   Specialized Callable: api_connect(timeout)                 (1 argument)
```

```python
import functools
import requests

def send_request(base_url: str, endpoint: str, timeout: int = 5, auth_token: str = "") -> dict:
    """Simulates an API client request."""
    return {
        "url": f"{base_url.rstrip('/')}/{endpoint.lstrip('/')}",
        "timeout": timeout,
        "authenticated": bool(auth_token)
    }

# Freeze base_url and auth_token into a specialized client
prod_api = functools.partial(
    send_request,
    base_url="https://api.enterprise.io/v2",
    auth_token="Bearer secret_token_999"
)

# Inspect partial attributes
print("Target function: ", prod_api.func.__name__)
print("Frozen arguments:", prod_api.args)
print("Frozen keywords: ", prod_api.keywords)

# Invoke the specialized partial function
response = prod_api(endpoint="users/metrics", timeout=10)
print("Response payload:", response)
```

---

## 4. `functools.partialmethod` for Class Descriptors

When working with methods within class bodies, `functools.partial` fails to bind `self` correctly when invoked as an instance method. Python provides `functools.partialmethod` specifically designed to respect descriptor binding:

```python
from functools import partialmethod

class MicroserviceClient:
    def __init__(self, service_name: str) -> None:
        self.service_name = service_name

    def _dispatch(self, method: str, path: str) -> None:
        print(f"[{self.service_name}] Dispatched {method} -> {path}")

    # Bind specific HTTP verbs as instance methods using partialmethod
    get = partialmethod(_dispatch, "GET")
    post = partialmethod(_dispatch, "POST")
    delete = partialmethod(_dispatch, "DELETE")

client = MicroserviceClient("AuthService")
client.get("/users/verify")
client.post("/users/login")
```

---

## 5. Architectural Comparison Summary

| Feature | `lru_cache` / `cache` | `partial` / `partialmethod` |
| :--- | :--- | :--- |
| **Primary Goal** | Execution acceleration via memoization | Interface specialization and arity reduction |
| **Key Constraint** | Arguments must be immutable and hashable | Order of positional arguments must be preserved |
| **Inspection Tool** | `.cache_info()`, `.cache_clear()` | `.func`, `.args`, `.keywords` |
| **Method Variant** | `@cached_property` for instances | `partialmethod` for descriptors |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Passing Unhashable Arguments to `@lru_cache`
`@lru_cache` stores cached results in an internal dictionary keyed by function arguments. Passing mutable types (like `list` or `dict`) raises a `TypeError: unhashable type`. Use tuples instead.

### 2. Memory Leaks with `maxsize=None`
Setting `maxsize=None` creates an unbounded cache that never evicts stale entries, leading to silent memory exhaustion in long-running services. Always set a sensible `maxsize` limit.

---

---

## 💻 Try It Yourself: Fibonacci Acceleration & Pre-configured Partial Functions

### Scenario
Demonstrate the exponential speedup of `@lru_cache` on recursive Fibonacci calculation, and use `functools.partial` to create a specialized `power_of_two` calculator.

### Complete Solution
```python
from functools import lru_cache, partial

@lru_cache(maxsize=128)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

# High-speed memoized calculation
print("Fib(50):", fib(50))
print("Cache info:", fib.cache_info())

# Partial function application
power = lambda base, exp: base ** exp
power_of_two = partial(power, 2)
print("2^8 =", power_of_two(8))
```

### Expected Output
```text
Fib(50): 12586269025
Cache info: CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)
2^8 = 256
```

---

## Practice Quiz

### 1.
What exception is raised when passing a mutable `list` into a function decorated with `@functools.lru_cache`?
A. `ValueError`
B. `TypeError: unhashable type: 'list'`
C. `KeyError`
D. `MemoryError`

**Answer:** B

**Explanation:** `@functools.lru_cache` uses the function's arguments as keys in an internal hash table. Because lists are mutable, they do not implement `__hash__` and trigger a `TypeError`.

---

### 2.
What does the `hits` metric reported by `my_func.cache_info()` signify?
A. The number of errors caught by the cache.
B. The number of times the function returned a cached result without executing the underlying function body.
C. The number of active threads accessing the cache.
D. The number of evicted keys.

**Answer:** B

**Explanation:** A "hit" occurs whenever the function is called with arguments that are already present in the cache table, allowing instant retrieval without recomputation.

---

### 3.
What is the key difference between `@functools.lru_cache(maxsize=None)` and `@functools.cache`?
A. `@functools.cache` is slower because it writes to disk.
B. `@functools.cache` is an alias introduced in Python 3.9 specifically for an unbounded cache (`maxsize=None`), running slightly faster by bypassing LRU eviction logic.
C. `@functools.cache` works with unhashable types.
D. `@functools.cache` clears itself every 60 seconds.

**Answer:** B

**Explanation:** Introduced in Python 3.9, `@functools.cache` provides an unbounded memoization decorator with less bookkeeping overhead than `lru_cache` with a capacity limit.

---

### 4.
What does `functools.partial` produce when called?
A. A generator that yields each parameter.
B. A new callable partial object with fixed positional and keyword arguments.
C. A compiled C-extension module.
D. A class definition inheriting from `object`.

**Answer:** B

**Explanation:** `functools.partial` returns a partial callable object that wraps the original function with pre-filled arguments and keyword arguments.

---

### 5.
Why should `functools.partialmethod` be preferred over `functools.partial` when defining methods inside a class definition?
A. `partial` runs in a separate thread and causes race conditions.
B. `partialmethod` properly binds the instance (`self`) when called as a descriptor on an instance, whereas `partial` treats `self` as a standard argument.
C. `partialmethod` only accepts integer arguments.
D. `partial` is deprecated in modern Python.

**Answer:** B

**Explanation:** Standard `partial` does not implement descriptor binding protocol. `partialmethod` is specifically designed for class definitions so that the instance `self` is properly bound when the method is invoked on an instance.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Data Pipeline with Itertools** (4: Itertools and Functools).

👉 **[Continue to Next Lesson: Project: Data Pipeline with Itertools →](/tutorials/python-for-advanced/project-data-pipeline-with-itertools)**
