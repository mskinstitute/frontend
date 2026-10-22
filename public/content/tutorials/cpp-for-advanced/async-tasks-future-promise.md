---
id: async-tasks-future-promise
slug: async-tasks-future-promise
course: cpp-for-advanced
chapter: 4: Concurrency & Multithreading in C++
topic: "Asynchronous Tasks with std::async, std::future, and std::promise"
difficulty: Advanced
readingTime: 13
order: 20
keywords: ["std::async","std::future","std::promise","asynchronous tasks","task based parallelism"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔮 Asynchronous Tasks with std::async, std::future, and std::promise

## Introduction
Low-level threads (`std::thread`) do not provide a direct way to return a value to the caller. High-level task-based concurrency via **`std::async`** and **`std::future`** abstracts thread management and transmits return values or exceptions seamlessly.

---

## ⚡ Task-Based Asynchrony with `std::async`

```cpp
#include <iostream>
#include <future>
#include <chrono>

// Time-consuming background computation:
int calculateBatchExamAverages(int batchId) {
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    return batchId * 85; // Simulated computed result
}

int main() {
    std::cout << "Initiating background calculation...\n";

    // Launch asynchronously in background thread:
    std::future<int> futureResult = std::async(std::launch::async, calculateBatchExamAverages, 101);

    std::cout << "Main thread continues rendering UI animations...\n";

    // .get() waits until the task finishes and retrieves the return value!
    int score = futureResult.get();

    std::cout << "Background Task Completed! Result: " << score << "\n";
    return 0;
}
```

---

## 🤝 `std::promise` and `std::future` Channel

A **`std::promise`** is the sending end of a communication channel, while **`std::future`** is the receiving end:

```cpp
#include <iostream>
#include <future>
#include <thread>

void worker(std::promise<double> prom) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    prom.set_value(98.6); // Transmit result to consumer
}

int main() {
    std::promise<double> prom;
    std::future<double> fut = prom.get_future();

    std::jthread t(worker, std::move(prom));

    std::cout << "Received value from thread: " << fut.get() << "\n";
    return 0;
}
```
