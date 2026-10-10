---
id: python-advanced-project-stream-data-processor
slug: project-stream-data-processor
course: python-for-advanced
chapter: "5: Generators & Coroutines"
topic: "5.4 Project: Stream Data Processor"
title: "Project: Stream Data Processor in Python"
description: "Master project: stream data processor in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 23
keywords:
  - python project stream data processor
  - python advanced
  - python project: stream data processor
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Project: Stream Data Processor

In financial trading, Internet of Things (IoT) telemetry, and real-time monitoring systems, architectures must process continuous, unbounded streams of incoming event data with minimal latency and constant memory usage.

In this project, we will build a production-ready **Push-Based Coroutine Stream Processor**. Rather than loading events into intermediate lists or polling queues, events are pushed directly into a network of interconnected coroutine stages that broadcast, filter, aggregate, and report anomalies in real time.

---

## 1. Stream Processor Architecture

The stream processing pipeline utilizes a **Push-Based Dataflow Network**:

```
                              Incoming Event Stream
                                (Producer Loop)
                                       │
                                       ▼
                            Broadcaster Coroutine
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
   Anomaly Detector                                      Rolling Aggregator
      Coroutine                                              Coroutine
            │                                                     │
            ▼                                                     ▼
     Sink Coroutine                                      Sink Coroutine
    (Security Alert)                                     (Metrics Audit)
```

Each processing stage is a decoupled coroutine primed and waiting at a `yield` statement to process incoming data packets.

---

## 2. Production Implementation

```python
import functools
from typing import Any, Callable, Dict, Generator, List, NamedTuple, Optional

# Structured representation of an IoT sensor reading
class SensorEvent(NamedTuple):
    device_id: str
    temperature: float
    humidity: float
    timestamp: float

# -------------------------------------------------------------
# Coroutine Priming Decorator
# -------------------------------------------------------------
def coroutine(func: Callable) -> Callable:
    """Utility decorator that automatically primes coroutines to their first yield."""
    @functools.wraps(func)
    def primer(*args: Any, **kwargs: Any) -> Generator:
        gen = func(*args, **kwargs)
        next(gen)
        return gen
    return primer

# -------------------------------------------------------------
# 1. Output Sink Coroutines
# -------------------------------------------------------------
@coroutine
def log_sink(prefix: str) -> Generator[None, str, None]:
    """Consumer sink that formats and logs alert messages."""
    try:
        while True:
            message = yield
            print(f"[{prefix.upper()}] {message}")
    except GeneratorExit:
        print(f"[{prefix.upper()}] Sink safely terminated.")

# -------------------------------------------------------------
# 2. Filter / Anomaly Detection Coroutine
# -------------------------------------------------------------
@coroutine
def anomaly_detector(threshold_temp: float, target_sink: Generator) -> Generator[None, SensorEvent, None]:
    """Inspects temperature readings and forwards alerts for anomalies."""
    try:
        while True:
            event = yield
            if event.temperature > threshold_temp:
                alert_text = (
                    f"CRITICAL HEAT ALERT: Device {event.device_id} recorded "
                    f"{event.temperature:.2f}°C (Threshold: {threshold_temp:.2f}°C) at t={event.timestamp}"
                )
                target_sink.send(alert_text)
    except GeneratorExit:
        target_sink.close()

# -------------------------------------------------------------
# 3. Rolling Aggregator Coroutine
# -------------------------------------------------------------
@coroutine
def windowed_metrics_aggregator(window_size: int, target_sink: Generator) -> Generator[None, SensorEvent, None]:
    """Maintains a rolling window of recent events and emits periodic statistical summaries."""
    buffer: List[float] = []
    try:
        while True:
            event = yield
            buffer.append(event.temperature)
            if len(buffer) >= window_size:
                avg_temp = sum(buffer) / len(buffer)
                max_temp = max(buffer)
                min_temp = min(buffer)
                summary = (
                    f"METRIC WINDOW SUMMARY ({window_size} events): "
                    f"Avg Temp: {avg_temp:.2f}°C | Min: {min_temp:.2f}°C | Max: {max_temp:.2f}°C"
                )
                target_sink.send(summary)
                buffer.clear()
    except GeneratorExit:
        target_sink.close()

# -------------------------------------------------------------
# 4. Fan-Out Broadcaster Coroutine
# -------------------------------------------------------------
@coroutine
def broadcast(targets: List[Generator]) -> Generator[None, SensorEvent, None]:
    """Pushes an incoming event simultaneously to multiple downstream coroutine consumers."""
    try:
        while True:
            event = yield
            for target in targets:
                target.send(event)
    except GeneratorExit:
        for target in targets:
            target.close()
```

---

## 3. Pipeline Assembly and Verification

```python
def run_stream_processor():
    print("=====================================================")
    print("      INITIALIZING COROUTINE STREAM PROCESSOR       ")
    print("=====================================================")

    # Instantiate end-of-line sinks
    alert_sink = log_sink(prefix="AlertManager")
    metrics_sink = log_sink(prefix="TelemetryMetrics")

    # Instantiate intermediate transformation coroutines
    detector = anomaly_detector(threshold_temp=75.0, target_sink=alert_sink)
    aggregator = windowed_metrics_aggregator(window_size=3, target_sink=metrics_sink)

    # Instantiate fan-out broadcaster
    pipeline = broadcast([detector, aggregator])

    # Synthetic event stream
    events = [
        SensorEvent(device_id="sensor-01", temperature=68.2, humidity=45.0, timestamp=100.0),
        SensorEvent(device_id="sensor-02", temperature=72.1, humidity=43.5, timestamp=101.0),
        SensorEvent(device_id="sensor-01", temperature=79.4, humidity=40.0, timestamp=102.0), # Anomaly!
        SensorEvent(device_id="sensor-03", temperature=71.0, humidity=48.2, timestamp=103.0),
        SensorEvent(device_id="sensor-02", temperature=82.5, humidity=38.0, timestamp=104.0), # Anomaly!
        SensorEvent(device_id="sensor-01", temperature=70.0, humidity=46.0, timestamp=105.0),
    ]

    print("Pushing events into the live pipeline...")
    for event in events:
        print(f"\n-> Ingesting: {event.device_id} (Temp: {event.temperature}°C)")
        pipeline.send(event)

    print("\nShutting down pipeline...")
    pipeline.close()
    print("Pipeline shutdown complete.")

if __name__ == "__main__":
    run_stream_processor()
```

---

## 4. Key Architectural Advantages

1. **Zero Intermediate Memory**: Events are passed through call frames via `send()` without allocating queue nodes or arrays.
2. **Dynamic Fan-Out**: The `broadcast` coroutine can easily scale to support new consumer pipelines (e.g. archiving to database, triggering webhooks) without modifying existing components.
3. **Cascading Clean Shutdown**: Closing the root broadcaster cascades `GeneratorExit` exceptions through all child coroutines, guaranteeing safe resource deallocation.

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Accumulating Unbounded Window State
When aggregating sliding windows of streaming records, always prune expired records to prevent unbounded RAM growth.

### 2. Unhandled Exception Propagation in Coroutine Pipelines
An unhandled exception in one coroutine stage will terminate the entire pipeline. Wrap processing stages in `try...except` blocks.

---

---

## 💻 Try It Yourself: Extension Challenge - High Error Threshold Alerting

### Challenge
Add an error frequency alert coroutine to the Stream Data Processor that triggers an alert callback whenever more than 3 errors occur within 5 seconds.

### Complete Solution
```python
def error_alert_consumer(threshold=3):
    error_count = 0
    while True:
        log_entry = yield
        if "ERROR" in log_entry:
            error_count += 1
            if error_count >= threshold:
                print(f"🚨 [CRITICAL ALERT] Threshold breached: {error_count} errors detected!")
                error_count = 0

consumer = error_alert_consumer(3)
next(consumer)
for log in ["INFO ok", "ERROR 500", "INFO ok", "ERROR 403", "ERROR 502"]:
    consumer.send(log)
consumer.close()
```

### Expected Output
```text
🚨 [CRITICAL ALERT] Threshold breached: 3 errors detected!
```

---

## Practice Quiz

### 1.
In the push-based stream processor, how are events propagated from one stage to the next?
A. Sinks poll a centralized Redis database.
B. Stages push data directly to downstream stages using `target.send(event)`.
C. Threads write to a global shared list.
D. Using operating system IPC pipes.

**Answer:** B

**Explanation:** In a coroutine dataflow pipeline, each upstream stage pushes transformed events directly to the next stage by calling its `send()` method.

---

### 2.
What happens when `pipeline.close()` is called on the root broadcaster coroutine?
A. Only the broadcaster stops; downstream coroutines remain suspended indefinitely.
B. CPython crashes with a `SegmentationFault`.
C. The broadcaster's `except GeneratorExit` block executes, which systematically invokes `target.close()` on all registered downstream coroutines.
D. All memory is instantly zeroed out.

**Answer:** C

**Explanation:** Calling `.close()` raises `GeneratorExit` inside the broadcaster, allowing its exception block to forward `.close()` to all downstream targets, ensuring orderly shutdown.

---

### 3.
Why is the `@coroutine` decorator necessary for each generator in the dataflow network?
A. It runs each stage on a separate CPU thread.
B. It primes each generator by invoking `next()` so it pauses at its first `yield` and is immediately ready to accept data via `send()`.
C. It catches syntax errors.
D. It prevents memory leaks by limiting cache size.

**Answer:** B

**Explanation:** A generator must be primed (advanced to its initial `yield`) before it can receive data via `send()`. The `@coroutine` decorator automates this priming step.

---

### 4.
What is the memory complexity of passing events through this coroutine pipeline?
A. $O(N)$ where $N$ is the total number of events ever ingested.
B. $O(1)$ constant memory overhead per stage, as events are passed directly through active stack frames without buffering (except explicit window buffers).
C. $O(N^2)$ exponential growth.
D. Proportional to the size of the hard drive.

**Answer:** B

**Explanation:** Coroutines process events on the fly in active memory frames, achieving $O(1)$ constant overhead without accumulating processed items.

---

### 5.
Which coroutine handles splitting a single event stream into multiple concurrent downstream processing branches?
A. `log_sink`
B. `anomaly_detector`
C. `broadcast`
D. `windowed_metrics_aggregator`

**Answer:** C

**Explanation:** The `broadcast` coroutine receives an event and iterates through its list of registered downstream targets, calling `target.send(event)` on each one.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Threading Module Basics** (6: Multithreading in Python).

👉 **[Continue to Next Lesson: Threading Module Basics →](/tutorials/python-for-advanced/threading-module-basics)**
