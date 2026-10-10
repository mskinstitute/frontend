---
id: python-advanced-shared-memory-queues
slug: shared-memory-queues
course: python-for-advanced
chapter: "7: Multiprocessing in Python"
topic: "7.3 Shared Memory & Queues"
title: "Shared Memory & Queues in Python"
description: "Master shared memory & queues in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 30
keywords:
  - python shared memory queues
  - python advanced
  - python shared memory & queues
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Shared Memory and IPC Queues

Because processes do not share a virtual memory space by default, data exchange between them requires specialized **Inter-Process Communication (IPC)** mechanisms. Python's `multiprocessing` module offers two distinct communication paradigms: **Message Passing** (via Queues and Pipes) and **Shared Memory** (via `Value`, `Array`, `Manager`, and Python 3.8+'s zero-copy `shared_memory`).

---

## 1. Message Passing: `multiprocessing.Queue` vs `Pipe`

### `multiprocessing.Queue`
Similar in API to `queue.Queue`, but backed by underlying OS pipes and background feeder threads that serialize (pickle) objects across process boundaries:

```
 Process A (Producer) ──► Pickle Object ──► OS Pipe ──► Unpickle ──► Process B (Consumer)
```

```python
import multiprocessing
import time

def producer_process(q: multiprocessing.Queue) -> None:
    for i in range(5):
        payload = {"packet_id": i, "timestamp": time.time()}
        q.put(payload)
        print(f"[PRODUCER] Put packet #{i} into Queue.")
    q.put(None)  # Poison pill sentinel to signal completion

def consumer_process(q: multiprocessing.Queue) -> None:
    while True:
        item = q.get()
        if item is None:
            print("[CONSUMER] Received sentinel. Exiting cleanly.")
            break
        print(f"[CONSUMER] Processing packet #{item['packet_id']}")

if __name__ == "__main__":
    work_queue: multiprocessing.Queue = multiprocessing.Queue()

    p1 = multiprocessing.Process(target=producer_process, args=(work_queue,))
    p2 = multiprocessing.Process(target=consumer_process, args=(work_queue,))

    p1.start()
    p2.start()

    p1.join()
    p2.join()
```

### `multiprocessing.Pipe`
Provides a direct, low-latency, two-way (or one-way) connection between exactly two processes:

```python
if __name__ == "__main__":
    parent_conn, child_conn = multiprocessing.Pipe()

    def child_worker(conn):
        message = conn.recv()
        print(f"[CHILD] Received: {message}")
        conn.send(f"Echo response: {message.upper()}")
        conn.close()

    p = multiprocessing.Process(target=child_worker, args=(child_conn,))
    p.start()

    parent_conn.send("hello over pipe")
    reply = parent_conn.recv()
    print(f"[PARENT] Reply received: {reply}")

    p.join()
```

---

## 2. Basic Shared State: `Value` and `Array`

For lightweight primitives, `multiprocessing.Value` and `multiprocessing.Array` allocate synchronized C-level data structures (`ctypes`) in shared memory:

```python
import multiprocessing

def increment_shared_state(shared_val: multiprocessing.Value, shared_arr: multiprocessing.Array, lock: multiprocessing.Lock) -> None:
    with lock:  # Must lock to prevent simultaneous write race conditions
        shared_val.value += 1.5
        for i in range(len(shared_arr)):
            shared_arr[i] *= 2

if __name__ == "__main__":
    # 'd' = double precision float, 'i' = signed integer
    counter = multiprocessing.Value('d', 10.0)
    scores = multiprocessing.Array('i', [1, 2, 3, 4])
    process_lock = multiprocessing.Lock()

    p = multiprocessing.Process(target=increment_shared_state, args=(counter, scores, process_lock))
    p.start()
    p.join()

    print(f"Updated Value: {counter.value}")        # 11.5
    print(f"Updated Array: {list(scores)}")         # [2, 4, 6, 8]
```

---

## 3. Python 3.8+ Zero-Copy Shared Memory (`multiprocessing.shared_memory`)

When processing massive datasets (such as 4K video frames, large Pandas DataFrames, or multi-gigabyte NumPy tensors), pickling data across pipes induces massive CPU and memory serialization overhead.

Python 3.8 introduced `multiprocessing.shared_memory.SharedMemory`, allocating named shared memory segments managed directly by the operating system kernel. Processes map directly to this memory via `memoryview`, achieving **true zero-copy parallel data manipulation**:

```
                       Operating System Shared Memory Block
                             ("/my_shared_tensor_101")
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
  Process 1 (Producer)                                      Process 2 (Consumer)
   Direct memoryview                                         Direct memoryview
  (Zero Copy / Zero Pickle)                                 (Zero Copy / Zero Pickle)
```

```python
from multiprocessing import shared_memory
import numpy as np

if __name__ == "__main__":
    # Step 1: Parent creates a 10-megabyte shared memory block
    sample_array = np.array([10, 20, 30, 40, 50], dtype=np.int64)
    
    shm = shared_memory.SharedMemory(create=True, size=sample_array.nbytes, name="shared_np_buf")
    
    # Wrap shared memory buffer inside a NumPy array
    shared_np = np.ndarray(sample_array.shape, dtype=sample_array.dtype, buffer=shm.buf)
    shared_np[:] = sample_array[:]
    print(f"[PARENT] Initialized shared array: {shared_np}")

    def worker_modify(shm_name: str, shape: tuple, dtype: np.dtype):
        # Attach to existing shared memory segment by name
        existing_shm = shared_memory.SharedMemory(name=shm_name)
        worker_np = np.ndarray(shape, dtype=dtype, buffer=existing_shm.buf)
        # Modify in place (zero copy!)
        worker_np *= 10
        existing_shm.close()  # Detach process

    p = multiprocessing.Process(target=worker_modify, args=("shared_np_buf", sample_array.shape, sample_array.dtype))
    p.start()
    p.join()

    print(f"[PARENT] Result after worker in-place modification: {shared_np}")

    # Step 2: Cleanup (Must close handle AND unlink from OS)
    shm.close()
    shm.unlink()  # Instructs OS kernel to destroy the shared memory segment
```

---

## 4. Resource Cleanup Invariant: `close()` vs `unlink()`

> **Critical Memory Safety Rule:** With `shared_memory.SharedMemory`:
> - Calling `shm.close()` detaches the current process from the memory block.
> - Calling `shm.unlink()` instructs the operating system kernel to destroy and deallocate the shared memory segment. 
> Failing to call `unlink()` on the creator process causes an **OS-level memory leak** that persists even after the Python process terminates.

---

## 5. Architectural Summary Table

| Mechanism | Serialization Cost | Flexibility | Best Use Case |
| :--- | :--- | :--- | :--- |
| `multiprocessing.Queue` | High (Pickled via OS pipe) | Highly flexible (any pickleable Python object) | Producer-Consumer pipelines |
| `multiprocessing.Pipe` | Moderate (Two-endpoint stream) | Fast point-to-point communication | Direct duplex socket-like communication |
| `multiprocessing.Value` / `Array` | Very Low (C-structs in RAM) | Restricted to primitive numeric types | Shared counters, small fixed arrays |
| `multiprocessing.Manager` | High (RPC proxy overhead) | Extremely high (shared dicts, lists, sets) | Complex coordinating supervisor services |
| `shared_memory.SharedMemory` | **Zero (Direct memory mapping)** | Raw bytes / NumPy tensors | High-throughput data science, video processing |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Queue Feeder Thread Deadlock
Calling `process.join()` before reading all data from a full `multiprocessing.Queue` causes a permanent deadlock because the background queue feeder thread cannot flush its buffer.

### 2. Race Conditions on Shared Values Without Locks
`multiprocessing.Value` provides an internal lock by default, but complex compound checks still require manual synchronization with `with val.get_lock():`.

---

---

## 💻 Try It Yourself: Producer-Consumer Pipeline with multiprocessing.Queue

### Scenario
Build an Inter-Process Communication (IPC) pipeline where a Producer process generates tasks and a Consumer process processes them via a `multiprocessing.Queue`.

### Complete Solution
```python
import multiprocessing
import time

def producer(queue):
    for item in ["Job-A", "Job-B", "Job-C"]:
        queue.put(item)
        print(f"Produced: {item}")
    queue.put(None)  # Sentinel to stop consumer

def consumer(queue):
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"Consumer processed: {item}")

if __name__ == "__main__":
    q = multiprocessing.Queue()
    p1 = multiprocessing.Process(target=producer, args=(q,))
    p2 = multiprocessing.Process(target=consumer, args=(q,))
    
    p1.start()
    p2.start()
    p1.join()
    p2.join()
```

### Expected Output
```text
Produced: Job-A
Produced: Job-B
Produced: Job-C
Consumer processed: Job-A
Consumer processed: Job-B
Consumer processed: Job-C
```

---

## Practice Quiz

### 1.
How does `multiprocessing.Queue` transmit Python objects between separate processes?
A. By sending memory pointer addresses directly across the bus.
B. By serializing objects into byte streams using `pickle` and transmitting them across operating system pipes.
C. By writing objects to temporary JSON files on the hard drive.
D. By creating a temporary HTTP web server.

**Answer:** B

**Explanation:** In CPython, `multiprocessing.Queue` uses background threads to pickle Python objects and stream them through OS IPC pipes to the destination process.

---

### 2.
What is the primary operational advantage of Python 3.8's `multiprocessing.shared_memory` over standard `multiprocessing.Queue` for large NumPy arrays?
A. It provides zero-copy access by mapping raw memory buffers directly, avoiding expensive serialization (pickling) overhead.
B. It automatically backs up data to the cloud.
C. It allows unpickled Python code to run on GPUs.
D. It encrypts memory using AES-256.

**Answer:** A

**Explanation:** `SharedMemory` allocates contiguous blocks of physical memory managed by the OS kernel, allowing multiple processes to map the buffer directly (e.g. via NumPy or memoryviews) with zero copying.

---

### 3.
What occurs if a program creates a `multiprocessing.shared_memory.SharedMemory` block and terminates without calling `.unlink()`?
A. Python deletes the file automatically on exit.
B. An operating system-level shared memory leak occurs; the memory segment persists in the OS kernel until reboot or manual removal.
C. A `SyntaxError` is logged.
D. The process hangs indefinitely.

**Answer:** B

**Explanation:** Shared memory segments are owned by the operating system kernel, not the Python process. Unless `shm.unlink()` is called, the OS continues to retain the memory block.

---

### 4.
What is the difference between `shm.close()` and `shm.unlink()`?
A. `shm.close()` deletes the memory segment, while `shm.unlink()` prints its size.
B. `shm.close()` detaches the current process from the shared memory segment, while `shm.unlink()` instructs the operating system to destroy and deallocate the segment.
C. They are identical aliases.
D. `shm.unlink()` only works on Windows.

**Answer:** B

**Explanation:** Every process that accesses shared memory must call `close()` to release its local file descriptor/handle. Exactly one process (typically the creator) should call `unlink()` to deallocate the segment from the OS.

---

### 5.
Which IPC primitive provides a fast, two-way (duplex) connection specifically between exactly two processes?
A. `multiprocessing.Queue`
B. `multiprocessing.Pipe`
C. `multiprocessing.Manager`
D. `multiprocessing.Pool`

**Answer:** B

**Explanation:** `multiprocessing.Pipe()` returns a pair of connection endpoints `(conn1, conn2)` establishing a lightweight, bi-directional IPC channel between two endpoints.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Parallel File Processor** (7: Multiprocessing in Python).

👉 **[Continue to Next Lesson: Project: Parallel File Processor →](/tutorials/python-for-advanced/project-parallel-file-processor)**
