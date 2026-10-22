---
id: "java-adv-t4.5"
title: "Thread Pools with ExecutorService, Callable<T>, and Future<T>"
slug: "thread-pools-executorservice-callable-future"
course: "Java for Advanced"
chapter: "4: Multithreading & High Concurrency"
topic: "Thread Pools with ExecutorService, Callable<T>, and Future<T>"
difficulty: "Advanced"
readingTime: 16
order: 20
keywords: ["thread pools","executorservice","callable","future","concurrency framework","graceful shutdown"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🏭 Thread Pools with ExecutorService, Callable<T>, and Future<T>

## Introduction
Creating a new OS thread has high overhead: memory allocation for the thread stack (~1MB per thread), context-switching costs, and CPU thrashing. In production systems, spawning `new Thread()` for every request will quickly lead to `OutOfMemoryError`.

The **Executor Framework** decouples task submission from thread execution through managed **Thread Pools**.

---

## 📦 Factory Methods in `Executors`

```java
// 1. Fixed Thread Pool: Constant number of worker threads
ExecutorService fixedPool = Executors.newFixedThreadPool(8);

// 2. Cached Thread Pool: Spawns threads as needed, reuses idle ones
ExecutorService cachedPool = Executors.newCachedThreadPool();

// 3. Single Thread Executor: Sequential FIFO task queue
ExecutorService singlePool = Executors.newSingleThreadExecutor();
```

---

## ⚡ `Runnable` vs `Callable<V>`

- **`Runnable`**: `void run()` - cannot return a value, cannot throw checked exceptions.
- **`Callable<V>`**: `V call() throws Exception` - returns a computed result and can propagate checked exceptions!

```java
import java.util.concurrent.*;

public class ExecutorDemo {
    public static void main(String[] args) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(4);

        // Submit Callable task
        Callable<Double> calculateTaxTask = () -> {
            Thread.sleep(1000); // Simulate network or calculation delay
            return 14500.50 * 0.18;
        };

        // Future acts as a placeholder for the asynchronous result
        Future<Double> futureResult = executor.submit(calculateTaxTask);

        System.out.println("Task submitted. Main thread continues doing work...");

        // Blocks until worker finishes and returns value
        Double tax = futureResult.get(3, TimeUnit.SECONDS);
        System.out.printf("Calculated Tax: ₹%.2f%n", tax);

        // Graceful shutdown protocol
        executor.shutdown();
        if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
            executor.shutdownNow();
        }
    }
}
```

---

## 🛑 The Standard Graceful Shutdown Recipe

```java
executor.shutdown(); // Refuses new tasks, lets running ones finish
try {
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        executor.shutdownNow(); // Cancel running tasks
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
}
```
