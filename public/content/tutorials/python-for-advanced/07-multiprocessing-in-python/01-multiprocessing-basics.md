---
id: python-advanced-multiprocessing-basics
slug: multiprocessing-basics
course: python-for-advanced
chapter: "7: Multiprocessing in Python"
topic: "7.1 Multiprocessing Basics"
title: "Multiprocessing Basics in Python"
description: "Master multiprocessing basics in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 28
keywords:
  - python multiprocessing basics
  - python advanced
  - python multiprocessing basics
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Multiprocessing Basics

When executing CPU-intensive tasks—such as mathematical matrix crunching, cryptographic hashing, image transformation, or machine learning model inference—Python's Global Interpreter Lock (GIL) prevents threads from utilizing multiple CPU cores simultaneously.

The `multiprocessing` module bypasses the GIL entirely by spawning **independent operating system processes**. Each process runs its own isolated CPython interpreter instance with a dedicated memory heap, enabling true multi-core parallelism across modern hardware.

---

## 1. Process Architecture & The GIL Bypass

Unlike threads that share a single process heap and contend for the same GIL mutex, separate processes run in parallel across distinct CPU physical cores:

```
                            Operating System Scheduler
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
     CPU Core 0                                                CPU Core 1
┌─────────────────────────┐                               ┌─────────────────────────┐
│ Process A (PID 1001)    │                               │ Process B (PID 1002)    │
│ - Dedicated CPython VM  │                               │ - Dedicated CPython VM  │
│ - Private GIL Mutex     │                               │ - Private GIL Mutex     │
│ - Isolated Heap Memory  │                               │ - Isolated Heap Memory  │
└─────────────────────────┘                               └─────────────────────────┘
```

---

## 2. Process Start Methods: `spawn` vs `fork`

Operating systems spawn child processes differently, configured via `multiprocessing.set_start_method()`:

| Start Method | Operating System Default | Mechanism | Characteristics |
| :--- | :--- | :--- | :--- |
| `spawn` | Windows & macOS (default) | Launches fresh Python executable; re-imports main module | Safest; clean memory; requires `if __name__ == '__main__':` |
| `fork` | Linux / POSIX | Uses OS `fork()` to clone parent memory address space | Blazing fast start; dangerous with open threads/locks |
| `forkserver`| Supported on POSIX | Pre-forks clean server process to spawn children | Avoids multi-threaded fork deadlocks |

### The `__name__ == '__main__'` Invariant
> **Strict Requirement on Windows & macOS (`spawn` mode):** When a child process is spawned, the new interpreter re-imports the main Python script from the beginning. If process creation logic is not protected by `if __name__ == '__main__':`, the child process will spawn another child, triggering an uncontrolled infinite recursion known as a **Fork/Spawn Bomb** that crashes the operating system.

---

## 3. Basic Process Creation with `multiprocessing.Process`

```python
import multiprocessing
import os
import time

def cpu_intensive_calculation(chunk_id: int, count: int) -> None:
    pid = os.getpid()
    print(f"[PROCESS-{pid}] Starting calculation for Chunk #{chunk_id} ({count:,} iterations)...")
    total = sum(i * i for i in range(count))
    print(f"[PROCESS-{pid}] Finished Chunk #{chunk_id}. Result hash: {total % 10007}")

if __name__ == "__main__":
    processes = []
    chunk_iterations = 10_000_000

    start_time = time.perf_counter()

    # Spawn 4 distinct OS processes
    for i in range(4):
        p = multiprocessing.Process(
            target=cpu_intensive_calculation,
            args=(i + 1, chunk_iterations),
            name=f"WorkerProcess-{i+1}"
        )
        processes.append(p)
        p.start()

    # Verify and monitor active processes
    for p in processes:
        print(f"Process {p.name} active with OS PID: {p.pid}")

    # Wait for all child processes to complete
    for p in processes:
        p.join()
        print(f"Process {p.name} (PID {p.pid}) finished with exit code: {p.exitcode}")

    elapsed = time.perf_counter() - start_time
    print(f"All processes completed in {elapsed:.2f} seconds.")
```

---

## 4. High-Throughput Worker Pools with `multiprocessing.Pool`

For embarrassingly parallel data processing, manually managing individual processes and combining results is cumbersome. `multiprocessing.Pool` distributes tasks across a fixed pool of worker processes and collects return values automatically:

```python
import math
import multiprocessing
import time

def compute_heavy_factors(number: int) -> int:
    """CPU-bound task: counts divisors of a large number."""
    count = 0
    for i in range(1, int(math.isqrt(number)) + 1):
        if number % i == 0:
            count += 2 if i * i != number else 1
    return count

if __name__ == "__main__":
    test_numbers = [45_000_000 + i for i in range(8)]

    # 1. Benchmark Sequential Execution
    start_seq = time.perf_counter()
    seq_results = [compute_heavy_factors(n) for n in test_numbers]
    seq_time = time.perf_counter() - start_seq
    print(f"Sequential Execution Time: {seq_time:.2f}s")

    # 2. Benchmark Parallel Execution with multiprocessing.Pool
    # Defaults to os.cpu_count() worker processes
    start_par = time.perf_counter()
    with multiprocessing.Pool() as pool:
        par_results = pool.map(compute_heavy_factors, test_numbers)
    par_time = time.perf_counter() - start_par

    print(f"Parallel Pool Time:       {par_time:.2f}s (Speedup: {seq_time / par_time:.2f}x)")
    print("Verification match:", seq_results == par_results)
```

---

## 5. Architectural Summary Table

| Feature | Details |
| :--- | :--- |
| **Concurrency Type** | True parallel multi-core execution (bypasses the GIL) |
| **Memory Model** | Isolated private address space per process (no shared heap) |
| **Communication** | Inter-Process Communication (IPC) via serialized pipes/queues |
| **Overhead** | Higher memory footprint and slower startup than threads |
| **Best Workloads** | CPU-bound computation, data transforms, media encoding |
| **Safety Invariant** | Must guard startup code with `if __name__ == '__main__':` |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Missing `if __name__ == '__main__':` Guard
On Windows and macOS (which use the `spawn` process start method), child processes re-import the main script. Omitting this guard triggers an infinite fork bomb!
```python
# ❌ DANGEROUS: Will spawn infinite child processes on Windows
p = Process(target=worker)
p.start()

# ✅ MANDATORY
if __name__ == "__main__":
    p = Process(target=worker)
    p.start()
```

### 2. IPC Serialization Overhead
Data passed between processes must be serialized (pickled) and transferred over OS pipes. If the serialization overhead exceeds computation time, multiprocessing will run slower than a single thread.

---

---

## 💻 Try It Yourself: Parallel Factorial Computation

### Scenario
Use `multiprocessing.Pool` to compute large factorials across multiple CPU cores, demonstrating true parallelism.

### Complete Solution
```python
import multiprocessing
import math

def compute_factorial(n):
    return n, len(str(math.factorial(n)))

if __name__ == "__main__":
    numbers = [5000, 10000, 15000, 20000]
    with multiprocessing.Pool(processes=2) as pool:
        results = pool.map(compute_factorial, numbers)
    
    for n, digits in results:
        print(f"Factorial of {n} has {digits:,} decimal digits.")
```

### Expected Output
```text
Factorial of 5000 has 16,326 decimal digits.
Factorial of 10000 has 35,660 decimal digits.
Factorial of 15000 has 56,130 decimal digits.
Factorial of 20000 has 77,338 decimal digits.
```

---

## Practice Quiz

### 1.
Why can `multiprocessing` achieve true multi-core CPU parallelism in Python while `threading` cannot?
A. `multiprocessing` converts Python code into assembly language.
B. Each process runs its own independent CPython interpreter instance with its own private GIL, allowing simultaneous execution on separate CPU cores.
C. `multiprocessing` only runs on Linux.
D. Processes ignore the operating system scheduler.

**Answer:** B

**Explanation:** In multiprocessing, each spawned process has a separate memory space and its own CPython virtual machine and GIL. As a result, processes can execute Python code simultaneously on different CPU cores.

---

### 2.
Why is the `if __name__ == '__main__':` guard strictly mandatory when spawning processes on Windows and macOS?
A. Windows does not support Python functions.
B. In `spawn` mode, the child process re-imports the main script; without the guard, the child would recursively spawn additional child processes in an infinite loop.
C. It prevents memory leaks in the GPU.
D. It is an optional code styling convention from PEP 8.

**Answer:** B

**Explanation:** On platforms using the `spawn` start method, child processes re-import the entry point script to load target functions. Without the `__name__ == '__main__':` check, each child would execute the process-spawning code again, causing a spawn bomb.

---

### 3.
What method on a `multiprocessing.Pool` instance applies a function concurrently across an iterable of inputs and blocks until all results are gathered?
A. `pool.apply_async()`
B. `pool.map()`
C. `pool.fork()`
D. `pool.run()`

**Answer:** B

**Explanation:** `pool.map(func, iterable)` chops the iterable into chunks, distributes them to worker processes, and blocks until all results are gathered in order, mimicking built-in `map()`.

---

### 4.
What does `process.pid` represent on an active `multiprocessing.Process` object?
A. The number of iterations executed.
B. The operating system Process Identifier.
C. The thread identity hash.
D. The port number for network sockets.

**Answer:** B

**Explanation:** `process.pid` provides the OS-level Process ID assigned by the operating system kernel to the running process.

---

### 5.
What is the primary architectural trade-off of multiprocessing compared to multithreading?
A. Processes cannot open files.
B. Processes have higher memory overhead and inter-process communication costs because memory is isolated and data must be serialized (pickled).
C. Processes cannot run on 64-bit systems.
D. Processes cannot return values.

**Answer:** B

**Explanation:** Each process requires its own memory footprint (CPython runtime, modules, heap) and communicating between processes requires serializing (pickling) data across IPC channels, which introduces serialization overhead.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Process vs Thread** (7: Multiprocessing in Python).

👉 **[Continue to Next Lesson: Process vs Thread →](/tutorials/python-for-advanced/process-vs-thread)**
