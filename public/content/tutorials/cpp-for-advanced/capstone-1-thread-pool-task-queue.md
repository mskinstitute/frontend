---
id: capstone-1-thread-pool-task-queue
slug: capstone-1-thread-pool-task-queue
course: cpp-for-advanced
chapter: 6: Advanced Capstone Projects
topic: "Capstone 1: Thread-Safe Concurrent Task Queue & Thread Pool"
difficulty: Advanced
readingTime: 17
order: 26
keywords: ["thread pool","concurrent task queue","multithreading project","c++ advanced project","worker threads"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏭 Capstone Project 1: Thread-Safe Task Queue & Thread Pool

## Introduction
Spawning a fresh OS thread for every brief task incurs massive overhead. In high-performance backend engines, a pre-warmed **Thread Pool** maintains a fixed set of worker threads that continuously pull jobs from a synchronized **concurrent task queue**.

---

## 🎯 Architecture
- Pre-spawns worker threads according to CPU hardware concurrency.
- Thread-safe task queue synchronized with `std::mutex` and `std::condition_variable`.
- Supports arbitrary callable lambdas using `std::function<void()>`.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

class ThreadPool {
private:
    std::vector<std::jthread> m_workers;
    std::queue<std::function<void()>> m_taskQueue;
    std::mutex m_queueMutex;
    std::condition_variable m_cv;
    bool m_stop = false;

public:
    explicit ThreadPool(std::size_t threadCount) {
        for (std::size_t i = 0; i < threadCount; ++i) {
            m_workers.emplace_back([this, i]() {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(m_queueMutex);
                        m_cv.wait(lock, [this]() {
                            return m_stop || !m_taskQueue.empty();
                        });

                        if (m_stop && m_taskQueue.empty()) {
                            return; // Exit thread cleanly
                        }

                        task = std::move(m_taskQueue.front());
                        m_taskQueue.pop();
                    }
                    task(); // Execute task outside lock!
                }
            });
        }
    }

    template <typename F>
    void enqueue(F&& f) {
        {
            std::lock_guard<std::mutex> lock(m_queueMutex);
            m_taskQueue.emplace(std::forward<F>(f));
        }
        m_cv.notify_one();
    }

    ~ThreadPool() {
        {
            std::lock_guard<std::mutex> lock(m_queueMutex);
            m_stop = true;
        }
        m_cv.notify_all();
    }
};

int main() {
    std::cout << "=== MSK Concurrent Thread Pool v1.0 ===\n";
    ThreadPool pool(4); // 4 Worker Threads

    // Enqueue 8 parallel tasks:
    for (int i = 1; i <= 8; ++i) {
        pool.enqueue([i]() {
            std::cout << "[Worker ID: " << std::this_thread::get_id() << "] Completed Task #" << i << "\n";
        });
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    std::cout << "All pool tasks finished cleanly.\n";
    return 0;
}
```
