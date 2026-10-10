---
id: python-intermediate-project-infinite-sequence-generator
slug: project-infinite-sequence-generator
course: python-for-intermediate
chapter: "7: Iterators and Generators"
topic: "7.5 Project: Infinite Sequence Generator"
title: "Project: Infinite Sequence Generator in Python"
description: "Master project: infinite sequence generator in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 35
keywords:
  - python project infinite sequence generator
  - python intermediate
  - python project: infinite sequence generator
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Infinite Sequence & Data Stream Generator

In this capstone project, we will apply our mastery of **Iterators, Generator Functions, `yield`, and Generator Expressions** to build an **Infinite Sequence & IoT Telemetry Streaming Engine**.

---

## 1. The Power of Infinite Streams

In traditional programming, you cannot store an infinite sequence in a list because RAM is finite. However, because Python generators evaluate lazily on-demand, an infinite loop `while True: yield item` is completely valid, memory-safe, and runs indefinitely until the consumer decides to stop pulling items!

Our project demonstrates three streaming engines:
1. **Infinite Prime Number Stream**: Produces mathematical primes continuously.
2. **Infinite IoT Telemetry Sensor**: Simulates live hardware sensors emitting temperature, humidity, and status readings.
3. **Stream Pipeline Processing**: Batches and filters live streaming data using custom chunking and `itertools.islice`.

---

## 2. Complete Project Implementation

```python
import itertools
import math
import random
import time
from datetime import datetime


# -------------------------------------------------------------
# 1. Infinite Mathematical Generators
# -------------------------------------------------------------
def infinite_primes():
    """Generates an unbounded sequence of prime numbers on-demand."""
    yield 2
    candidate = 3
    primes_found = [2]
    
    while True:
        is_prime = True
        limit = math.isqrt(candidate)
        for p in primes_found:
            if p > limit:
                break
            if candidate % p == 0:
                is_prime = False
                break
        
        if is_prime:
            primes_found.append(candidate)
            yield candidate
            
        candidate += 2


def infinite_fibonacci():
    """Generates an unbounded Fibonacci sequence."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


# -------------------------------------------------------------
# 2. Infinite IoT Sensor Telemetry Stream
# -------------------------------------------------------------
def iot_sensor_stream(device_id: str):
    """Simulates a live IoT industrial sensor producing telemetry readings."""
    reading_id = 1
    base_temp = 45.0
    base_pressure = 101.3
    
    while True:
        # Simulate realistic telemetry fluctuations
        temperature = round(base_temp + random.uniform(-4.5, 6.0), 2)
        pressure = round(base_pressure + random.uniform(-2.0, 3.5), 2)
        
        # Flag alert conditions
        status = "CRITICAL" if temperature > 50.0 else "NORMAL"
        
        telemetry = {
            "reading_id": reading_id,
            "device_id": device_id,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3],
            "temperature_c": temperature,
            "pressure_kpa": pressure,
            "status": status
        }
        
        yield telemetry
        reading_id += 1


# -------------------------------------------------------------
# 3. Stream Utilities: Windowing & Chunking
# -------------------------------------------------------------
def chunk_stream(stream, chunk_size: int):
    """Batches an infinite stream into fixed-size finite chunks."""
    while True:
        chunk = list(itertools.islice(stream, chunk_size))
        if not chunk:
            break
        yield chunk


# -------------------------------------------------------------
# 4. Stream Consumer & Demonstration
# -------------------------------------------------------------
def run_streaming_demo():
    print("=" * 65)
    print("   INFINITE SEQUENCE & STREAM GENERATOR ENGINE")
    print("=" * 65)

    # 1. Pull first 10 Primes using itertools.islice
    print("\n--- First 10 Prime Numbers from Infinite Stream ---")
    prime_stream = infinite_primes()
    first_10_primes = list(itertools.islice(prime_stream, 10))
    print(f"Primes: {first_10_primes}")

    # 2. Pull first 12 Fibonacci numbers
    print("\n--- First 12 Fibonacci Numbers from Infinite Stream ---")
    fib_stream = infinite_fibonacci()
    first_12_fib = list(itertools.islice(fib_stream, 12))
    print(f"Fibonacci: {first_12_fib}")

    # 3. Processing IoT Telemetry Stream (Filtered Pipeline)
    print("\n--- Processing Live IoT Telemetry (Capturing 3 Critical Alerts) ---")
    sensor = iot_sensor_stream("THERMAL-SENS-09")
    
    # Lazy filter pipeline for critical anomalies
    alert_pipeline = (
        packet for packet in sensor 
        if packet["status"] == "CRITICAL"
    )

    # Consumer loop pulling 3 anomalies
    captured_alerts = []
    for _ in range(3):
        alert_packet = next(alert_pipeline)
        captured_alerts.append(alert_packet)
        print(f" [ALERT] #{alert_packet['reading_id']} | "
              f"Time: {alert_packet['timestamp']} | "
              f"Temp: {alert_packet['temperature_c']}°C (Threshold Exceeded!)")

    # 4. Chunking Demonstration
    print("\n--- Chunking Sensor Stream into Batches of 3 Packets ---")
    batched_sensor = chunk_stream(iot_sensor_stream("DEVICE-B"), chunk_size=3)
    
    # Process only 2 batches
    for batch_idx, batch in enumerate(itertools.islice(batched_sensor, 2), start=1):
        print(f"Batch #{batch_idx} ({len(batch)} items):")
        for reading in batch:
            print(f"  -> ID: {reading['reading_id']} | Temp: {reading['temperature_c']}°C | Pressure: {reading['pressure_kpa']} kPa")

    print("\nStream demonstration finished safely without memory exhaustion.")


if __name__ == "__main__":
    run_streaming_demo()
```

---

## 3. Sample Execution Output

```text
=================================================================
   INFINITE SEQUENCE & STREAM GENERATOR ENGINE
=================================================================

--- First 10 Prime Numbers from Infinite Stream ---
Primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]

--- First 12 Fibonacci Numbers from Infinite Stream ---
Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

--- Processing Live IoT Telemetry (Capturing 3 Critical Alerts) ---
 [ALERT] #4 | Time: 2026-09-12 15:30:12.102 | Temp: 50.84°C (Threshold Exceeded!)
 [ALERT] #7 | Time: 2026-09-12 15:30:12.103 | Temp: 50.19°C (Threshold Exceeded!)
 [ALERT] #11 | Time: 2026-09-12 15:30:12.105 | Temp: 50.92°C (Threshold Exceeded!)

--- Chunking Sensor Stream into Batches of 3 Packets ---
Batch #1 (3 items):
  -> ID: 1 | Temp: 43.12°C | Pressure: 102.15 kPa
  -> ID: 2 | Temp: 46.88°C | Pressure: 99.45 kPa
  -> ID: 3 | Temp: 44.51°C | Pressure: 101.80 kPa
Batch #2 (3 items):
  -> ID: 4 | Temp: 47.19°C | Pressure: 100.22 kPa
  -> ID: 5 | Temp: 48.05°C | Pressure: 103.11 kPa
  -> ID: 6 | Temp: 42.94°C | Pressure: 101.05 kPa

Stream demonstration finished safely without memory exhaustion.
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Unbounded Iteration Without a Break Condition
When consuming an infinite generator, always ensure your loop has an explicit counter or threshold break condition to avoid hanging the program.

### 2. Storing Yielded History Unintentionally
If your generator keeps appending yielded items to an internal list, you eliminate the memory advantage of using a generator. Keep state minimal.

---

---

## 💻 Try It Yourself: Extension Challenge - Prime Number Stream

### Challenge
Create an infinite prime number generator function that yields successive prime numbers on demand using lazy evaluation.

### Complete Solution
```python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def prime_stream():
    num = 2
    while True:
        if is_prime(num):
            yield num
        num += 1

# Extract first 6 primes
primes = prime_stream()
first_six = [next(primes) for _ in range(6)]
print("First 6 Primes:", first_six)
```

### Expected Output
```text
First 6 Primes: [2, 3, 5, 7, 11, 13]
```

---

## Practice Quiz

### 1. Why doesn't the `while True: yield ...` statement inside `infinite_primes()` cause an infinite freeze or crash?
A. Python runs generator functions on separate CPU cores
B. Execution pauses at each `yield` and only resumes when the consumer calls `next()`
C. Python terminates the loop after 100 iterations automatically
D. The `while True` loop is optimized away by the CPython compiler
**Answer:** B
**Explanation:** Generators evaluate lazily; they execute up to the `yield` statement and pause, relinquishing control until the consumer explicitly requests the next element.
---

### 2. Which function from Python's standard `itertools` library extracts a finite slice from an infinite iterator?
A. `itertools.slice_iter()`
B. `itertools.islice()`
C. `itertools.take()`
D. `itertools.limit()`
**Answer:** B
**Explanation:** `itertools.islice(iterable, stop)` extracts elements from an iterator up to `stop` without attempting to consume or evaluate the entire sequence.
---

### 3. In the telemetry simulation, how does the alert pipeline consume readings?
A. It pre-loads one million telemetry records into a database
B. It acts as a lazy generator expression, evaluating sensor items one by one until finding matching criteria
C. It compiles the telemetry stream into JSON files
D. It restarts the computer's network interface
**Answer:** B
**Explanation:** The generator expression `(packet for packet in sensor if ...)` evaluates lazily, requesting items from `sensor` one at a time and discarding non-matching items immediately.
---

### 4. What happens if you run `list(infinite_primes())` without slicing?
A. It returns the first 100 primes
B. The program will hang indefinitely attempting to consume an infinite sequence into memory until RAM is exhausted
C. A `SyntaxError` is raised
D. Python automatically paginates the output
**Answer:** B
**Explanation:** The `list()` constructor consumes an iterable until `StopIteration` is raised. Since `infinite_primes()` never terminates, it will run until memory runs out.
---

### 5. What design pattern does chaining `chunk_stream(sensor)` represent in data engineering?
A. Factory Method Pattern
B. Stream Pipeline / Producer-Consumer Architecture
C. Model-View-Controller (MVC)
D. Singleton Pattern
**Answer:** B
**Explanation:** Chaining generators and chunking utilities creates a modular stream processing pipeline where producers emit data lazily and downstream consumers process it in stages.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **HTTP Requests using requests** (8: Working with APIs).

👉 **[Continue to Next Lesson: HTTP Requests using requests →](/tutorials/python-for-intermediate/http-requests-using-requests)**
