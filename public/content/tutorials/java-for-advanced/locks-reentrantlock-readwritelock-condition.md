---
id: "java-adv-t4.4"
title: "java.util.concurrent: ReentrantLock, ReadWriteLock, and Condition"
slug: "locks-reentrantlock-readwritelock-condition"
course: "Java for Advanced"
chapter: "4: Multithreading & High Concurrency"
topic: "java.util.concurrent: ReentrantLock, ReadWriteLock, and Condition"
difficulty: "Advanced"
readingTime: 16
order: 19
keywords: ["reentrantlock","readwritelock","condition","java util concurrent","explicit locking","trylock"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🔐 java.util.concurrent: ReentrantLock, ReadWriteLock, and Condition

## Introduction
While intrinsic `synchronized` locks are easy to use, they are rigid: a thread cannot interrupt lock acquisition, cannot attempt a timed lock acquisition, and cannot separate read operations from write operations.

Java 5 introduced **`java.util.concurrent.locks`** providing explicit, powerful lock implementations.

---

## 🔑 1. `ReentrantLock`

Provides explicit `lock()` and `unlock()` controls. **Crucial Rule**: Always release explicit locks inside a `finally` block!

```java
import java.util.concurrent.locks.ReentrantLock;

public class InventoryService {
    private final ReentrantLock lock = new ReentrantLock();

    public void processItem(int itemId) {
        lock.lock(); // Acquire lock explicitly
        try {
            // Critical section
            updateStock(itemId);
        } finally {
            lock.unlock(); // Always release in finally to prevent permanent deadlocks!
        }
    }
}
```

### Non-Blocking Lock Acquisition with `tryLock()`:
```java
if (lock.tryLock(2, TimeUnit.SECONDS)) {
    try {
        // Proceed with critical section
    } finally {
        lock.unlock();
    }
} else {
    // Fallback logic when lock is busy; no thread hanging!
}
```

---

## 📖 2. `ReentrantReadWriteLock` (High-Read Performance)

In applications where reads occur 99% of the time and writes occur 1% of the time, standard mutual exclusion kills performance. A ReadWriteLock allows:
- **Multiple readers concurrently** (shared lock)
- **Only one writer exclusively** (exclusive lock)

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class CachedPrices {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private double goldPrice = 6500.0;

    // Concurrent reads
    public double getPrice() {
        rwLock.readLock().lock();
        try {
            return goldPrice;
        } finally {
            rwLock.readLock().unlock();
        }
    }

    // Exclusive write
    public void updatePrice(double newPrice) {
        rwLock.writeLock().lock();
        try {
            this.goldPrice = newPrice;
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
```
