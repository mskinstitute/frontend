---
id: thread-signaling-condition-variable
slug: thread-signaling-condition-variable
course: cpp-for-advanced
chapter: 4: Concurrency & Multithreading in C++
topic: "Thread Signaling with std::condition_variable"
difficulty: Advanced
readingTime: 14
order: 19
keywords: ["condition variable","thread signaling","producer consumer","spurious wakeups","unique_lock"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚦 Thread Signaling with std::condition_variable

## Introduction
Instead of making worker threads waste CPU cycles spinning in a busy loop (`while (!dataReady) {}`), **`std::condition_variable`** puts threads to sleep until another thread wakes them up with a signal. This is the cornerstone of the **Producer-Consumer pattern**.

---

## 📦 The Producer-Consumer Architecture

```cpp
#include <iostream>
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>

std::queue<int> g_taskQueue;
std::mutex g_queueMutex;
std::condition_variable g_cv;
bool g_finished = false;

// Worker (Consumer) Thread
void consumerWorker() {
    while (true) {
        std::unique_lock<std::mutex> lock(g_queueMutex);

        // Sleep until queue has items OR finished flag is set:
        // Predicate prevents Spurious Wakeups!
        g_cv.wait(lock, [] { return !g_taskQueue.empty() || g_finished; });

        while (!g_taskQueue.empty()) {
            int task = g_taskQueue.front();
            g_taskQueue.pop();
            std::cout << "Processed Task #" << task << "\n";
        }

        if (g_finished) break;
    }
}

// Producer Thread
int main() {
    std::jthread worker(consumerWorker);

    // Push 5 tasks with simulated intervals:
    for (int i = 1; i <= 5; ++i) {
        {
            std::lock_guard<std::mutex> lock(g_queueMutex);
            g_taskQueue.push(i);
            std::cout << "Enqueued Task #" << i << "\n";
        }
        g_cv.notify_one(); // Signal waiting consumer thread
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }

    {
        std::lock_guard<std::mutex> lock(g_queueMutex);
        g_finished = true;
    }
    g_cv.notify_one(); // Wake up consumer to exit cleanly

    return 0;
}
```

---

## ⚠️ Spurious Wakeups
Operating systems can occasionally wake up a thread even if no signal was sent. Always provide a **boolean predicate lambda** to `cv.wait(lock, predicate)` to guard against false wakeups.
