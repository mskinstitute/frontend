---
id: "java-adv-t4.1"
title: "Thread Lifecycle, Creating Threads with Thread Class and Runnable Interface"
slug: "thread-lifecycle-thread-class-runnable-interface"
course: "Java for Advanced"
chapter: "4: Multithreading & High Concurrency"
topic: "Thread Lifecycle, Creating Threads with Thread Class and Runnable Interface"
difficulty: "Advanced"
readingTime: 15
order: 16
keywords: ["thread lifecycle","runnable interface","thread class","daemon threads","multithreading"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🧵 Thread Lifecycle, Creating Threads with Thread Class and Runnable Interface

## Introduction
A **thread** is the smallest unit of execution within a Java process. Multithreading enables concurrent execution of multiple paths of code, allowing modern enterprise applications to handle thousands of requests simultaneously and maximize multi-core CPU hardware.

---

## 🔄 The 6 States of the JVM Thread Lifecycle

```text
                 ┌───────────────┐
                 │      NEW      │
                 └───────┬───────┘
                         │ thread.start()
                         ▼
        ┌─────────────────────────────────┐
        │            RUNNABLE             │
        │  (Ready to Run or Running)      │
        └───┬───────────┬─────────────┬───┘
            │           │             │
  Waiting   │   Lock    │   Sleep     │ Task Finished
  for lock  │  Acquired │  or Wait    │
            ▼           │             ▼
    ┌───────────────┐   │     ┌───────────────┐
    │    BLOCKED    │───┘     │ WAITING /     │
    └───────────────┘         │ TIMED_WAITING │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │  TERMINATED   │
                              └───────────────┘
```

1. **NEW**: Instantiated but not yet started via `start()`.
2. **RUNNABLE**: Executing or ready for CPU time slicing.
3. **BLOCKED**: Waiting to acquire a monitor lock.
4. **WAITING**: Waiting indefinitely for another thread (e.g. `wait()`, `join()`).
5. **TIMED_WAITING**: Waiting for a specified time (e.g. `sleep(ms)`).
6. **TERMINATED**: Completed execution of `run()`.

---

## 💻 2 Ways to Create Threads in Standard Java

### Approach 1: Implementing `Runnable` (Industry Recommended)
Separates task logic from thread execution mechanism:
```java
public class ReportTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Generating report on thread: " + Thread.currentThread().getName());
    }
}

// Running with Lambda:
Thread t1 = new Thread(() -> {
    System.out.println("Async work on: " + Thread.currentThread().getName());
}, "Worker-1");
t1.start(); // Spawns OS thread
```

### Approach 2: Extending `Thread`
```java
public class WorkerThread extends Thread {
    @Override
    public void run() {
        System.out.println("Worker thread executing");
    }
}
```
*Note*: Extending `Thread` consumes Java's single inheritance slot; prefer implementing `Runnable`.

---

## 🧟 Daemon Threads & Thread Joining

```java
Thread daemonThread = new Thread(() -> {
    while (true) {
        // Runs background maintenance tasks
    }
});
daemonThread.setDaemon(true); // JVM exits without waiting for daemon threads to finish!
daemonThread.start();

// Waiting for worker thread completion:
t1.join(); // Calling thread blocks until t1 terminates
```
