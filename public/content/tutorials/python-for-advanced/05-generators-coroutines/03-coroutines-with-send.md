---
id: python-advanced-coroutines-with-send
slug: coroutines-with-send
course: python-for-advanced
chapter: "5: Generators & Coroutines"
topic: "5.3 Coroutines with send()"
title: "Coroutines with send() in Python"
description: "Master coroutines with send() in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 22
keywords:
  - python coroutines with send
  - python advanced
  - python coroutines with send()
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Coroutines with `send()`

Formalized in PEP 342 ("Coroutines via Enhanced Generators"), Python transformed standard generator functions from simple pull-based data producers into **push-based coroutines**. By using `generator.send(value)`, `generator.throw(exception)`, and `generator.close()`, a coroutine can act as an event-driven consumer, state machine, or cooperative multitasking actor.

---

## 1. The `send()` Protocol & Execution Model

In a standard generator, `yield item` produces an item to the consumer. In a coroutine, `yield` also acts as an expression that **receives data** pushed from the outside:

```
                            Coroutine Lifecycle
                                     │
                         coro = consumer_coroutine()
                         (State: GEN_CREATED)
                                     │
                         Prime: next(coro) or coro.send(None)
                         (Advances to first yield)
                                     │
                                     ▼
                         (State: GEN_SUSPENDED)
                                     │
                        ┌────────────┴────────────┐
                        │   coro.send("PAYLOAD")  │
                        ▼                         ▼
            Resume at yield expression    Receive "PAYLOAD"
            Execute business logic        Assign to received_val
                        │                         │
                        └────────────┬────────────┘
                                     │
                         (State: GEN_SUSPENDED at next yield)
```

### The Priming Requirement
> **Strict Rule:** You cannot send a non-`None` value to a generator that has just been created (`GEN_CREATED`). Execution must first be advanced to the initial `yield` expression by calling `next(coro)` or `coro.send(None)`. Violating this raises:
> `TypeError: can't send non-None value to a just-started generator`.

---

## 2. Auto-Priming Coroutines with a Decorator

To avoid repetitive manual priming calls, engineers often use a priming decorator:

```python
import functools
from typing import Any, Callable, Generator

def coroutine(func: Callable) -> Callable:
    """Decorator that automatically primes a coroutine to its first yield."""
    @functools.wraps(func)
    def primer(*args: Any, **kwargs: Any) -> Generator:
        gen = func(*args, **kwargs)
        next(gen)  # Advance to initial yield statement
        return gen
    return primer

@coroutine
def running_averager() -> Generator[float, float, None]:
    """A coroutine that computes a continuous running average."""
    total = 0.0
    count = 0
    average = 0.0
    while True:
        # Pushes 'average' out, pulls incoming 'term' in
        term = yield average
        total += term
        count += 1
        average = total / count

# Usage without explicit priming
avg_calculator = running_averager()

print("Sent 10.0 -> Running Average:", avg_calculator.send(10.0))  # 10.0
print("Sent 20.0 -> Running Average:", avg_calculator.send(20.0))  # 15.0
print("Sent 30.0 -> Running Average:", avg_calculator.send(30.0))  # 20.0
print("Sent 40.0 -> Running Average:", avg_calculator.send(40.0))  # 25.0
```

---

## 3. Exception Handling with `throw()` and Cleanup with `close()`

External callers can inject exceptions directly into a suspended coroutine using `coro.throw()` to trigger recovery or reset logic:

```python
@coroutine
def robust_sink():
    """Demonstrates handling externally injected exceptions."""
    print("[SINK] Coroutine initialized and ready.")
    try:
        while True:
            try:
                message = yield
                print(f"[SINK] Processed: {message}")
            except ValueError as err:
                print(f"[RECOVERY] Caught injected error: {err}. Resetting state...")
    finally:
        print("[SINK] Coroutine closed and resources freed.")

sink = robust_sink()
sink.send("Message #1")
sink.send("Message #2")

# Injecting an exception into the coroutine's active frame
sink.throw(ValueError, "Invalid checksum in packet")

sink.send("Message #3")

# Clean shutdown
sink.close()
```

---

## 4. Building Event-Driven State Machines with Coroutines

Coroutines can implement state machines without monolithic switch-statements or bloated class hierarchies. State transitions occur by passing execution to another coroutine or updating loop targets:

```python
@coroutine
def traffic_light_controller():
    """State machine governing traffic signal transitions."""
    while True:
        # State: RED
        print("[STATE] Light is RED. Waiting for timer...")
        signal = yield "RED"
        if signal != "NEXT":
            continue

        # State: GREEN
        print("[STATE] Light is GREEN. Flow active...")
        signal = yield "GREEN"
        if signal != "NEXT":
            continue

        # State: YELLOW
        print("[STATE] Light is YELLOW. Slowing down...")
        signal = yield "YELLOW"

controller = traffic_light_controller()
print("Current signal:", controller.send("NEXT"))
print("Current signal:", controller.send("NEXT"))
print("Current signal:", controller.send("NEXT"))
controller.close()
```

---

## 5. From Generator Coroutines to Native Async/Await

Generator-based coroutines served as the historical foundation of asynchronous Python (including early versions of `asyncio` using `@asyncio.coroutine` and `yield from`). In Python 3.5+, PEP 492 formalized **native coroutines** via `async def` and `await`, establishing a clear language-level distinction between iterators that generate data and coroutines that execute concurrent tasks.

---

## 6. Architectural Summary Table

| Method | Role | Behavior |
| :--- | :--- | :--- |
| `next(coro)` | Primes or advances | Resumes execution; evaluates `yield` as `None` |
| `coro.send(val)` | Passes data in & resumes | Resumes execution; evaluates `yield` as `val` |
| `coro.throw(exc)` | Injects exception | Raises `exc` at current `yield` point inside frame |
| `coro.close()` | Terminates coroutine | Raises `GeneratorExit` at current `yield` point |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Forgetting to Prime the Coroutine
A newly created generator coroutine cannot receive values immediately. You must prime it first by calling `next(coro)` or `coro.send(None)` to advance execution to the first `yield`.

### 2. Sending Values to Closed Coroutines
Calling `.send()` on a coroutine that has terminated or closed raises a `StopIteration`. Always handle `StopIteration` gracefully.

---

---

## 💻 Try It Yourself: Running Average Coroutine with .send()

### Scenario
Build an interactive coroutine `averager()` that accepts streaming numbers via `.send()` and yields the cumulative moving average on each send.

### Complete Solution
```python
def averager():
    total = 0.0
    count = 0
    avg = None
    while True:
        val = yield avg
        total += val
        count += 1
        avg = total / count

# Test coroutine
avg_coro = averager()
next(avg_coro)  # Prime coroutine

print("Sent 10 -> Running Avg:", avg_coro.send(10))
print("Sent 20 -> Running Avg:", avg_coro.send(20))
print("Sent 30 -> Running Avg:", avg_coro.send(30))
avg_coro.close()
```

### Expected Output
```text
Sent 10 -> Running Avg: 10.0
Sent 20 -> Running Avg: 15.0
Sent 30 -> Running Avg: 20.0
```

---

## Practice Quiz

### 1.
What error occurs if you call `coro.send("data")` on a freshly created generator coroutine before advancing it with `next()` or `send(None)`?
A. `ValueError: buffer overflow`
B. `TypeError: can't send non-None value to a just-started generator`
C. `StopIteration`
D. `RuntimeError: deadlock detected`

**Answer:** B

**Explanation:** A newly created generator has not yet reached its first `yield` expression to receive values. Sending a non-None value immediately raises a `TypeError`.

---

### 2.
What is the effect of calling `coroutine.throw(ValueError, "Bad Data")` on a suspended coroutine?
A. It terminates the entire Python process.
B. It injects a `ValueError` into the coroutine at the exact point where it was suspended, allowing it to be caught by a `try...except` block inside the coroutine.
C. It writes the error to a log file without affecting execution.
D. It resets the coroutine to the `GEN_CREATED` state.

**Answer:** B

**Explanation:** `throw()` raises the specified exception inside the suspended coroutine's frame at the current `yield` location, giving the coroutine the chance to catch and handle the error.

---

### 3.
In the expression `received = yield current_value`, what does `current_value` represent, and what does `received` represent?
A. Both represent the same integer.
B. `current_value` is sent out to the caller, and `received` captures whatever value the caller subsequently passes back via `send()`.
C. `current_value` is private, while `received` is public.
D. `received` is always `None`.

**Answer:** B

**Explanation:** `yield current_value` produces `current_value` to the caller as the result of `next()` or `send()`. When resumed with `coro.send(data)`, the entire yield expression evaluates to `data`, which is assigned to `received`.

---

### 4.
What is the primary function of a "coroutine primer" decorator?
A. To compile the coroutine to machine code.
B. To automatically call `next()` or `send(None)` upon instantiation so the coroutine is immediately ready to accept data via `send()`.
C. To serialize the coroutine over a network socket.
D. To convert a synchronous function into an asynchronous one.

**Answer:** B

**Explanation:** A priming decorator wraps generator instantiation and calls `next(gen)` to advance execution to the first `yield`, preventing the need for manual priming before sending values.

---

### 5.
Which PEP introduced native coroutines with `async def` and `await` syntax, distinguishing them from generator-based coroutines?
A. PEP 8
B. PEP 257
C. PEP 492
D. PEP 3333

**Answer:** C

**Explanation:** PEP 492 introduced explicit `async` and `await` syntax in Python 3.5 to create first-class native coroutines distinct from generator objects.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Stream Data Processor** (5: Generators & Coroutines).

👉 **[Continue to Next Lesson: Project: Stream Data Processor →](/tutorials/python-for-advanced/project-stream-data-processor)**
