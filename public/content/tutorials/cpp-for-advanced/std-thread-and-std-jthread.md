---
id: std-thread-and-std-jthread
slug: std-thread-and-std-jthread
course: cpp-for-advanced
chapter: 4: Concurrency & Multithreading in C++
topic: "Creating and Joining Threads with std::thread and std::jthread"
difficulty: Advanced
readingTime: 13
order: 16
keywords: ["std::thread","std::jthread","concurrency","multithreading","c++20 jthread","thread join"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧵 Creating and Joining Threads: std::thread and std::jthread

## Introduction
Modern multi-core processors achieve peak performance through parallel execution. C++11 introduced cross-platform native threading via **`<thread>`**, and C++20 elevated it with **`std::jthread`** (automatically joining thread with cooperative cancellation support).

---

## ⚡ The Danger of Forgotten Joins in `std::thread`

If a `std::thread` is destroyed while still joinable (meaning neither `.join()` nor `.detach()` was called), its destructor immediately calls **`std::terminate()`**, instantly crashing the entire process!

---

## 🌟 Modern C++20: `std::jthread` (Joining Thread)

`std::jthread` automatically calls `.join()` inside its destructor:

```cpp
#include <iostream>
#include <thread>
#include <chrono>

void workerTask(int id, int durationMs) {
    std::cout << "[Thread " << id << "]: Started processing...\n";
    std::this_thread::sleep_for(std::chrono::milliseconds(durationMs));
    std::cout << "[Thread " << id << "]: Completed task!\n";
}

int main() {
    std::cout << "Main thread ID: " << std::this_thread::get_id() << "\n";

    {
        // Launches in parallel background thread
        std::jthread t1(workerTask, 1, 300);
        std::jthread t2(workerTask, 2, 150);

        std::cout << "Main continuing work...\n";
    } // 💥 At scope exit, both t1 and t2 are automatically joined! No crash!

    std::cout << "All background threads completed successfully.\n";
    return 0;
}
```

---

## 🚦 Hardware Concurrency Query
```cpp
unsigned int cores = std::thread::hardware_concurrency();
std::cout << "CPU Core count detected: " << cores << "\n";
```
