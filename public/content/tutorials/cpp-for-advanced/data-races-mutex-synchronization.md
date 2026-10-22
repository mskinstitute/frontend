---
id: data-races-mutex-synchronization
slug: data-races-mutex-synchronization
course: cpp-for-advanced
chapter: 4: Concurrency & Multithreading in C++
topic: "Data Races and Thread Synchronization with std::mutex"
difficulty: Advanced
readingTime: 13
order: 17
keywords: ["data race","std::mutex","thread synchronization","critical section","undefined behavior"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔒 Data Races and Thread Synchronization with std::mutex

## Introduction
When two or more threads access the same memory location concurrently and at least one thread modifies it without synchronization, you have a **Data Race**. Data races constitute **Undefined Behavior**: numbers get corrupted, memory pointers desynchronize, and software crashes unpredictably.

---

## 💥 The Race Condition Demonstrated

```cpp
// ❌ BROKEN: Multiple threads increment counter without locking
int sharedCounter = 0;
// If 10 threads increment 1,000 times each, sharedCounter will NOT be 10,000!
// Assembly: LOAD -> INCREMENT -> STORE (Interleaved across cores)
```

---

## 🛡️ Protecting the Critical Section with `std::mutex`

A **`std::mutex`** (mutual exclusion) ensures that only one thread can execute a critical section at any given instant:

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <mutex>

int g_sharedCounter = 0;
std::mutex g_counterMutex;

void safeIncrement(int iterations) {
    for (int i = 0; i < iterations; ++i) {
        g_counterMutex.lock(); // Enter critical section
        ++g_sharedCounter;
        g_counterMutex.unlock(); // Exit critical section
    }
}

int main() {
    std::vector<std::jthread> workers;

    // Launch 10 parallel threads, each incrementing 1,000 times:
    for (int i = 0; i < 10; ++i) {
        workers.emplace_back(safeIncrement, 1000);
    }

    workers.clear(); // Joins all threads

    std::cout << "Final Expected Counter: 10000\n";
    std::cout << "Actual Computed Counter: " << g_sharedCounter << "\n";

    return 0;
}
```
