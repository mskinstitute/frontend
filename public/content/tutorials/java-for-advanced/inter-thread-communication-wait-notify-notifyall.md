---
id: "java-adv-t4.3"
title: "Inter-Thread Communication: wait(), notify(), and notifyAll()"
slug: "inter-thread-communication-wait-notify-notifyall"
course: "Java for Advanced"
chapter: "4: Multithreading & High Concurrency"
topic: "Inter-Thread Communication: wait(), notify(), and notifyAll()"
difficulty: "Advanced"
readingTime: 16
order: 18
keywords: ["inter thread communication","wait","notify","notifyall","producer consumer","spurious wakeups"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 📣 Inter-Thread Communication: wait(), notify(), and notifyAll()

## Introduction
Rather than having threads poll a condition in a tight busy-waiting loop (wasting 100% of CPU cycles), Java provides built-in inter-thread signaling through methods defined in `java.lang.Object`: **`wait()`**, **`notify()`**, and **`notifyAll()`**.

---

## 📜 Rules of Engagement
1. **Must Hold the Monitor**: `wait()`, `notify()`, and `notifyAll()` can **only** be called from within a `synchronized` context on the object whose monitor is being signaled.
2. **Releasing the Lock**: When a thread calls `wait()`, it **atomically releases the lock** and enters the object's wait set.
3. **Waking Up**: Calling `notify()` wakes up one arbitrary waiting thread; `notifyAll()` wakes up all waiting threads.

---

## 🏭 Classic Producer-Consumer Architecture

```java
package com.mskinstitute.concurrency;

import java.util.LinkedList;
import java.util.Queue;

public class BoundedMessageBuffer<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;

    public BoundedMessageBuffer(int capacity) {
        this.capacity = capacity;
    }

    public synchronized void produce(T item) throws InterruptedException {
        // ALWAYS check condition in a while loop to handle spurious wakeups!
        while (queue.size() == capacity) {
            wait(); // Buffer is full; release lock and sleep
        }
        queue.add(item);
        System.out.println("Produced item. Queue size: " + queue.size());
        notifyAll(); // Notify waiting consumers that data is ready
    }

    public synchronized T consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait(); // Buffer is empty; release lock and sleep
        }
        T item = queue.poll();
        System.out.println("Consumed item. Queue size: " + queue.size());
        notifyAll(); // Notify waiting producers that space is available
        return item;
    }
}
```

---

## ⚠️ The Spurious Wakeup Hazard

A waiting thread can sometimes wake up without being explicitly notified (due to OS-level signaling quirks). For this reason:
```java
// ❌ WRONG: Can cause array index out of bounds or deadlocks
if (condition) { wait(); }

// ✅ CORRECT: Always guard wait() inside a while loop!
while (condition) { wait(); }
```
