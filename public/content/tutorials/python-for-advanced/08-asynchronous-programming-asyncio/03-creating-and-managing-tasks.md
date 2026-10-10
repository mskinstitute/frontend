---
id: python-advanced-creating-and-managing-tasks
slug: creating-and-managing-tasks
course: python-for-advanced
chapter: "8: Asynchronous Programming (Asyncio)"
topic: "8.3 Creating and Managing Tasks"
title: "Creating and Managing Tasks in Python"
description: "Master creating and managing tasks in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 34
keywords:
  - python creating and managing tasks
  - python advanced
  - python creating and managing tasks
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Creating and Managing Tasks

While the `await` expression pauses the current coroutine until a single operation completes, achieving true concurrent execution requires wrapping coroutines into **Tasks**. An `asyncio.Task` schedules a coroutine on the active event loop, allowing multiple operations to interleave and run concurrently on the single thread.

Understanding task scheduling, aggregation, cancellation, and Python 3.11's modern **Structured Concurrency** (`asyncio.TaskGroup`) is essential for building production-grade asynchronous services.

---

## 1. Scheduling Concurrency: `asyncio.create_task`

When you simply write:
```python
await fetch_a()
await fetch_b()
```
These operations execute **sequentially**. `fetch_b()` cannot begin until `fetch_a()` has completed.

To execute them concurrently, wrap each coroutine with `asyncio.create_task()`:

```python
import asyncio
import time

async def worker(task_name: str, delay: float) -> str:
    print(f"[{task_name}] Started (takes {delay}s)...")
    await asyncio.sleep(delay)
    print(f"[{task_name}] Finished.")
    return f"{task_name}_RESULT"

async def concurrent_demo():
    # create_task schedules workers on the event loop immediately!
    task1 = asyncio.create_task(worker("Alpha", 0.3))
    task2 = asyncio.create_task(worker("Beta", 0.2))

    # Both tasks run concurrently while awaiting
    res2 = await task2
    res1 = await task1
    print(f"Gathered: {res1}, {res2}")

if __name__ == "__main__":
    asyncio.run(concurrent_demo())
```

```
 Sequential:
 Coroutine 1 [==== 0.3s ====] ──► Coroutine 2 [== 0.2s ==] ──► Total: 0.5s

 Concurrent with Tasks:
 Task 1 [==== 0.3s ====]
 Task 2 [== 0.2s ==]             ──► Total: 0.3s (Overlapping I/O)
```

---

## 2. Aggregating Results with `asyncio.gather`

The `asyncio.gather()` function accepts an arbitrary number of awaitables, runs them concurrently, and returns an aggregated list of their results in the exact order of submission:

```python
import asyncio

async def fetch_price(ticker: str) -> float:
    await asyncio.sleep(0.1)
    prices = {"AAPL": 182.5, "MSFT": 415.0, "GOOGL": 175.2}
    return prices.get(ticker, 0.0)

async def aggregate_portfolio():
    tickers = ["AAPL", "MSFT", "GOOGL"]
    
    # Run all 3 queries concurrently
    prices = await asyncio.gather(*(fetch_price(t) for t in tickers))
    
    for ticker, price in zip(tickers, prices):
        print(f"Ticker: {ticker} -> Price: ${price:.2f}")

if __name__ == "__main__":
    asyncio.run(aggregate_portfolio())
```

### Handling Failures with `return_exceptions=True`
By default, if one task inside `gather()` raises an unhandled exception, `gather()` immediately raises that exception, but the other tasks continue running in the background (orphan tasks). Setting `return_exceptions=True` causes exceptions to be returned as items in the result list alongside successful values:

```python
async def unstable_task(val: int) -> int:
    if val == 0:
        raise ValueError("Zero value rejected!")
    return 100 // val

async def safe_gather():
    results = await asyncio.gather(
        unstable_task(10),
        unstable_task(0),  # Will fail
        unstable_task(2),
        return_exceptions=True  # Catches exception into results array
    )
    print("Safely gathered results:", results)
    # Output: [10, ValueError('Zero value rejected!'), 50]
```

---

## 3. Python 3.11+ Structured Concurrency: `asyncio.TaskGroup`

PEP 654 and Python 3.11 introduced **Structured Concurrency** via `asyncio.TaskGroup`. It provides an asynchronous context manager that guarantees no task leaks or orphan tasks:

```
                            TaskGroup Scope Entry
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           ▼                                                     ▼
     tg.create_task(Task A)                                tg.create_task(Task B)
           │                                                     │
           ▼                                                     ▼
     Task A Fails! (Raises Exception)                            │
           │                                                     │
           ▼                                                     ▼
    TaskGroup Cancels Task B Automatically! ◄────────────────────┘
           │
           ▼
    Raises consolidated ExceptionGroup
```

```python
import asyncio

async def query_service_a():
    await asyncio.sleep(0.1)
    return "Service A OK"

async def query_service_b():
    await asyncio.sleep(0.05)
    # Simulate service failure
    raise ConnectionResetError("Service B unreachable")

async def structured_runner():
    try:
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(query_service_a())
            t2 = tg.create_task(query_service_b())
        # Both tasks are guaranteed completed or cancelled when exiting block
    except* ConnectionResetError as eg:  # Python 3.11 exception group syntax
        print(f"[RECOVERY] Caught exception in TaskGroup: {eg.exceptions}")

if __name__ == "__main__":
    asyncio.run(structured_runner())
```

---

## 4. Timeouts & Task Cancellation

Tasks can be cancelled programmatically, or automatically via timeout wrappers:

```python
import asyncio

async def long_running_computation():
    try:
        print("[TASK] Running heavy operation...")
        await asyncio.sleep(10.0)  # Simulates long job
        print("[TASK] Finished.")
    except asyncio.CancelledError:
        print("[TASK] Cancellation received! Cleaning up resources...")
        raise  # It is critical to re-raise CancelledError

async def timeout_demo():
    # Python 3.11+ idiom: asyncio.timeout
    try:
        async with asyncio.timeout(0.2):
            await long_running_computation()
    except TimeoutError:
        print("[TIMEOUT] Operation timed out and was cancelled.")

if __name__ == "__main__":
    asyncio.run(timeout_demo())
```

---

## 5. Architectural Summary Table

| Tool | Purpose | Failure Behavior |
| :--- | :--- | :--- |
| `asyncio.create_task(coro)` | Schedules a single coroutine on loop | Unhandled errors logged as task exceptions |
| `asyncio.gather(*awaitables)` | Concurrently aggregates results | Raises first error; siblings continue running |
| `asyncio.TaskGroup()` (3.11+) | Structured Concurrency context | Cancels all child tasks if one fails; raises `ExceptionGroup` |
| `asyncio.timeout(delay)` (3.11+) | Async context manager timeout | Cancels tasks inside scope upon deadline |
| `task.cancel()` | Cancels an individual task | Injects `asyncio.CancelledError` at `await` point |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Losing Strong References to Background Tasks
Tasks created with `asyncio.create_task()` that are not retained in a strong reference (like a set) can be garbage-collected mid-execution!

### 2. Unhandled Exceptions in `asyncio.gather`
By default, if one task in `asyncio.gather()` raises an exception, the exception propagates immediately, but other running tasks continue in the background unless handled with `return_exceptions=True`.

---

---

## 💻 Try It Yourself: Task Cancellation and Timeout Handling

### Scenario
Demonstrate canceling a slow async task using `asyncio.wait_for()` and gracefully catching `asyncio.TimeoutError`.

### Complete Solution
```python
import asyncio

async def long_query():
    print("Executing complex database migration...")
    await asyncio.sleep(2.0)
    return "Finished migration."

async def main():
    try:
        # Enforce strict 0.2s timeout
        result = await asyncio.wait_for(long_query(), timeout=0.2)
        print(result)
    except asyncio.TimeoutError:
        print("⏱️ [TIMEOUT] Query exceeded maximum SLA and was safely cancelled!")

asyncio.run(main())
```

### Expected Output
```text
Executing complex database migration...
⏱️ [TIMEOUT] Query exceeded maximum SLA and was safely cancelled!
```

---

## Practice Quiz

### 1.
What is the effect of calling `task = asyncio.create_task(my_coro())`?
A. It pauses the current function until `my_coro()` completes.
B. It schedules `my_coro()` to run concurrently on the active event loop as an `asyncio.Task` and returns immediately.
C. It compiles the coroutine to C code.
D. It starts a new POSIX thread.

**Answer:** B

**Explanation:** `asyncio.create_task()` packages the coroutine into a Task and registers it with the running event loop for concurrent execution, returning the Task object without blocking.

---

### 2.
What happens by default in `asyncio.gather(task1, task2)` if `task1` raises an unhandled exception?
A. `task2` is immediately killed by the operating system.
B. `gather()` immediately re-raises the exception from `task1`, while `task2` continues running in the background as an orphaned task.
C. The exception is converted into a string.
D. The event loop crashes.

**Answer:** B

**Explanation:** By default (`return_exceptions=False`), `gather()` raises the first encountered exception immediately, but does not cancel or terminate the remaining sibling tasks.

---

### 3.
What major concurrency advancement does Python 3.11's `asyncio.TaskGroup` provide over older task management patterns?
A. It disables the GIL across multiple threads.
B. It enforces Structured Concurrency: if any child task in the group fails, all other active tasks in the group are automatically cancelled, eliminating leaked orphan tasks.
C. It converts asynchronous code to GPU shaders.
D. It eliminates the need for `await`.

**Answer:** B

**Explanation:** `asyncio.TaskGroup` introduces structured concurrency, ensuring that all tasks spawned within its context block are cleanly resolved, and automatically cancelling remaining siblings if an exception occurs.

---

### 4.
When a task is cancelled via `task.cancel()`, what exception is raised inside the coroutine at its current `await` suspension point?
A. `StopIteration`
B. `asyncio.CancelledError`
C. `KeyboardInterrupt`
D. `TimeoutError`

**Answer:** B

**Explanation:** Calling `.cancel()` on an `asyncio.Task` injects `asyncio.CancelledError` into the coroutine at its active `await` expression.

---

### 5.
What happens if a coroutine catches `asyncio.CancelledError` in a `try...except` block and suppresses it without re-raising?
A. The task refuses to cancel and continues running, violating cancellation protocols.
B. The event loop shuts down.
C. A `SyntaxError` is logged.
D. Python reboots the machine.

**Answer:** A

**Explanation:** If `CancelledError` is caught and not re-raised, the task does not acknowledge cancellation and continues executing, which breaks structured concurrency cancellation semantics.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Async Web Scraper** (8: Asynchronous Programming (Asyncio)).

👉 **[Continue to Next Lesson: Project: Async Web Scraper →](/tutorials/python-for-advanced/project-async-web-scraper)**
