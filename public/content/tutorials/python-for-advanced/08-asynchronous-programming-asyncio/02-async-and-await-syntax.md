---
id: python-advanced-async-and-await-syntax
slug: async-and-await-syntax
course: python-for-advanced
chapter: "8: Asynchronous Programming (Asyncio)"
topic: "8.2 Async and Await Syntax"
title: "Async and Await Syntax in Python"
description: "Master async and await syntax in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 33
keywords:
  - python async and await syntax
  - python advanced
  - python async and await syntax
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# `async` and `await` Syntax

Formalized in PEP 492, the `async` and `await` keywords establish native asynchronous programming syntax in Python. By distinguishing coroutines from generator objects, native coroutines provide compile-time syntax validation, dedicated runtime protocols (`__await__`, `__aiter__`, `__aenter__`), and clear concurrency semantics.

---

## 1. Native Coroutines & The `await` Expression

Defining a function with `async def` creates a **Native Coroutine Function**. Calling this function **does not execute its body**; instead, it returns an unstarted **Coroutine Object**:

```python
async def fetch_user_profile(user_id: int) -> dict:
    print(f"Fetching user #{user_id}...")
    await asyncio.sleep(0.1)
    return {"id": user_id, "name": "Ada Lovelace"}

# Calling the function without await:
coro = fetch_user_profile(42)
print("Type of coro:", type(coro))  # <class 'coroutine'>
# If left un-awaited, Python raises:
# RuntimeWarning: coroutine 'fetch_user_profile' was never awaited
```

### The Three Awaitable Objects
In Python, the `await` expression can only be used on objects that implement the **Awaitable Protocol** (defining an `__await__()` method). The three core awaitable types are:
1. **Coroutines**: Native coroutines created via `async def`.
2. **Tasks**: Coroutines scheduled onto the event loop via `asyncio.create_task()`.
3. **Futures**: Low-level objects representing the eventual result of an asynchronous operation (such as an I/O callback).

```
                      The Awaitable Protocol Hierarchy
                                      │
                   ┌──────────────────┼──────────────────┐
                   ▼                  ▼                  ▼
               Coroutine             Task              Future
           (async def body)    (Scheduled Loop)   (Low-level Result)
                   │                  │                  │
                   └──────────────────┼──────────────────┘
                                      ▼
                        Implements __await__() method
```

---

## 2. Asynchronous Context Managers (`async with`)

Just as synchronous code manages resources with `with`, asynchronous code uses `async with` to acquire and release network connections, transactions, and session locks non-blockingly.

An asynchronous context manager implements two dunder methods:
- `__aenter__(self)`: A coroutine that returns the acquired resource.
- `__aexit__(self, exc_type, exc_val, exc_tb)`: A coroutine that performs cleanup.

```python
import asyncio
from typing import Optional

class AsyncDatabaseSession:
    """Asynchronous context manager managing non-blocking database transactions."""

    def __init__(self, dsn: str) -> None:
        self.dsn = dsn
        self.is_connected = False

    async def __aenter__(self) -> "AsyncDatabaseSession":
        print(f"[DB] Opening asynchronous socket connection to {self.dsn}...")
        await asyncio.sleep(0.1)  # Simulates async network handshake
        self.is_connected = True
        print("[DB] Connected successfully.")
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> Optional[bool]:
        print("[DB] Closing asynchronous connection...")
        await asyncio.sleep(0.05)  # Simulates async TCP teardown
        self.is_connected = False
        print("[DB] Socket closed cleanly.")
        return None

async def execute_query():
    async with AsyncDatabaseSession("postgres://db.prod:5432/core") as session:
        print(f"Session active: {session.is_connected}")
        print("Executing non-blocking query...")

if __name__ == "__main__":
    asyncio.run(execute_query())
```

---

## 3. Asynchronous Iteration (`async for`)

Asynchronous iterators stream data non-blockingly (e.g. streaming chunks from an HTTP socket, WebSocket packets, or reading database query cursors).

They implement two methods:
- `__aiter__(self)`: Returns the asynchronous iterator object.
- `__anext__(self)`: A coroutine that returns the next value, or raises `StopAsyncIteration` when exhausted.

```python
import asyncio

class AsyncDataStream:
    """Asynchronously yields simulated incoming telemetry chunks."""

    def __init__(self, total_packets: int) -> None:
        self.total_packets = total_packets
        self.current = 0

    def __aiter__(self) -> "AsyncDataStream":
        return self

    async def __anext__(self) -> dict:
        if self.current >= self.total_packets:
            raise StopAsyncIteration  # Signals end of async stream

        self.current += 1
        await asyncio.sleep(0.05)  # Non-blocking pause for incoming packet
        return {"packet_index": self.current, "payload_bytes": 1024}

async def consume_stream():
    print("--- Reading Asynchronous Data Stream ---")
    async for packet in AsyncDataStream(total_packets=3):
        print(f"Received: Packet #{packet['packet_index']} ({packet['payload_bytes']} bytes)")

if __name__ == "__main__":
    asyncio.run(consume_stream())
```

---

## 4. Asynchronous Generators

Just as standard generators use `yield`, an `async def` function containing `yield` creates an **Asynchronous Generator**. It allows you to produce data streams lazily while using `await` internally:

```python
import asyncio
from typing import AsyncGenerator

async def fetch_paged_records(total_pages: int) -> AsyncGenerator[str, None]:
    """Asynchronous generator yielding paginated network responses."""
    for page in range(1, total_pages + 1):
        await asyncio.sleep(0.05)  # Non-blocking API network request
        yield f"Page_{page}_Content"

async def process_pages():
    async for page_data in fetch_paged_records(4):
        print(f"Ingested: {page_data}")

if __name__ == "__main__":
    asyncio.run(process_pages())
```

---

## 5. Architectural Summary Table

| Syntax | Underlying Protocol | Core Dunder Methods |
| :--- | :--- | :--- |
| `await expr` | Awaitable Protocol | `__await__()` |
| `async with expr as val:` | Async Context Manager | `__aenter__()`, `__aexit__()` |
| `async for item in expr:` | Async Iterator | `__aiter__()`, `__anext__()` |
| `async def f(): yield x` | Async Generator | `__anext__()`, `asend()`, `aclose()` |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Forgetting `await` on a Coroutine
Calling an async function without `await` returns a coroutine object without executing it:
```python
# ❌ Coroutine was never awaited warning!
fetch_data()

# ✅ CORRECT
await fetch_data()
```

### 2. Using `await` Outside of `async def`
The `await` keyword is syntactically invalid outside of functions declared with `async def` (except in Python 3.8+ top-level REPL shells).

---

---

## 💻 Try It Yourself: Asynchronous Context Manager with aiofiles Simulation

### Scenario
Implement a custom asynchronous context manager using `__aenter__` and `__aexit__` to simulate non-blocking file streaming.

### Complete Solution
```python
import asyncio

class AsyncDatabaseSession:
    async def __aenter__(self):
        print("Acquiring async database connection...")
        await asyncio.sleep(0.05)
        return self

    async def query(self, sql):
        await asyncio.sleep(0.05)
        return f"Results for: {sql}"

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Releasing async database connection back to pool.")
        await asyncio.sleep(0.01)

async def main():
    async with AsyncDatabaseSession() as db:
        res = await db.query("SELECT * FROM users")
        print("Query returned:", res)

asyncio.run(main())
```

### Expected Output
```text
Acquiring async database connection...
Query returned: Results for: SELECT * FROM users
Releasing async database connection back to pool.
```

---

## Practice Quiz

### 1.
What occurs when an `async def` function is called directly without using the `await` keyword (e.g. `result = my_coroutine()`)?
A. The function executes immediately and returns its value.
B. A coroutine object is created and returned, but its body is NOT executed yet, triggering a `RuntimeWarning: coroutine was never awaited`.
C. A new OS thread is spawned.
D. A `SyntaxError` is raised.

**Answer:** B

**Explanation:** Calling an `async def` function returns a coroutine object. Its code does not begin execution until it is explicitly awaited or scheduled as an `asyncio.Task` on an event loop.

---

### 2.
Which three types of objects are considered valid "Awaitables" that can follow the `await` keyword in Python?
A. Lists, Dictionaries, and Tuples
B. Native Coroutines, Tasks, and Futures
C. Threads, Processes, and Sockets
D. Strings, Bytes, and Numbers

**Answer:** B

**Explanation:** The Python `asyncio` specification defines three primary awaitable objects: Coroutines (created by `async def`), Tasks (created via `asyncio.create_task`), and Futures (low-level callback trackers).

---

### 3.
Which dunder methods must a class implement to function as an asynchronous context manager with `async with`?
A. `__enter__` and `__exit__`
B. `__aenter__` and `__aexit__`
C. `__open__` and `__close__`
D. `__start__` and `__stop__`

**Answer:** B

**Explanation:** Asynchronous context managers implement `__aenter__(self)` and `__aexit__(self, exc_type, exc_val, exc_tb)`, both of which are coroutines evaluated with `await`.

---

### 4.
What exception must an asynchronous iterator raise from its `__anext__()` method to terminate an `async for` loop?
A. `StopIteration`
B. `StopAsyncIteration`
C. `GeneratorExit`
D. `EOFError`

**Answer:** B

**Explanation:** While synchronous iterators raise `StopIteration`, asynchronous iterators must raise `StopAsyncIteration` to signal that no further items remain in the stream.

---

### 5.
Where is the `await` expression permitted to appear in Python code?
A. Inside any standard Python function.
B. Exclusively inside functions defined with `async def` (or within the interactive REPL in Python 3.8+).
C. Only inside `__init__` methods.
D. Inside class definitions directly.

**Answer:** B

**Explanation:** Using `await` outside of an `async def` function triggers a `SyntaxError: 'await' outside async function`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Creating and Managing Tasks** (8: Asynchronous Programming (Asyncio)).

👉 **[Continue to Next Lesson: Creating and Managing Tasks →](/tutorials/python-for-advanced/creating-and-managing-tasks)**
