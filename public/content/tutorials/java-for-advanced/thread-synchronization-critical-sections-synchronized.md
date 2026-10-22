---
id: "java-adv-t4.2"
title: "Thread Synchronization, Critical Sections, and synchronized Methods/Blocks"
slug: "thread-synchronization-critical-sections-synchronized"
course: "Java for Advanced"
chapter: "4: Multithreading & High Concurrency"
topic: "Thread Synchronization, Critical Sections, and synchronized Methods/Blocks"
difficulty: "Advanced"
readingTime: 16
order: 17
keywords: ["thread synchronization","race conditions","critical section","synchronized block","volatile keyword"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🔒 Thread Synchronization, Critical Sections, and synchronized Methods/Blocks

## Introduction
When multiple concurrent threads read and write to the same shared mutable memory without coordination, a **race condition** occurs, resulting in non-deterministic data corruption.

To guarantee thread safety, Java provides the **`synchronized`** keyword to enforce **mutual exclusion** on critical sections.

---

## 💥 The Race Condition Danger

```java
public class UnsafeCounter {
    private int count = 0;

    // NOT THREAD SAFE!
    public void increment() {
        // count++ is NOT atomic! It is 3 bytecode operations:
        // 1. Read count from memory
        // 2. Add 1 to count
        // 3. Write new count back to memory
        count++; 
    }
}
```
If two threads execute this simultaneously, one update overwrites the other, causing silent data loss!

---

## 🛡️ 1. Synchronized Methods

Adding `synchronized` to an instance method causes the executing thread to acquire the object's **intrinsic lock (monitor)**:

```java
public class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++; // Atomically protected by this object's lock
    }

    public synchronized int getCount() {
        return count;
    }
}
```

---

## 🎯 2. Synchronized Blocks (Finer Granularity)

Synchronizing an entire method can cause thread contention and throttle throughput. **Synchronized blocks** protect only the minimal critical section:

```java
public class AccountService {
    private final Object balanceLock = new Object();
    private double balance = 10000.0;

    public void transfer(double amount) {
        // Unsynchronized preparatory work (e.g. validation, audit logging)
        validateAmount(amount);

        // Minimal synchronized block:
        synchronized (balanceLock) {
            balance -= amount;
        }

        // Unsynchronized post-work
        sendNotification();
    }
}
```

---

## 💡 The `volatile` Keyword

The `volatile` modifier ensures that a variable is always read directly from and written to main memory, preventing CPU cache incoherence across cores:

```java
public class ServerStatus {
    // Guaranteed visible across all CPU caches immediately
    private volatile boolean isRunning = true;

    public void stopServer() {
        isRunning = false;
    }
}
```
