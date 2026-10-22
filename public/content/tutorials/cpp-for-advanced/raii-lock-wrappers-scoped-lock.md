---
id: raii-lock-wrappers-scoped-lock
slug: raii-lock-wrappers-scoped-lock
course: cpp-for-advanced
chapter: 4: Concurrency & Multithreading in C++
topic: "RAII Lock Wrappers: std::lock_guard, std::unique_lock, std::scoped_lock"
difficulty: Advanced
readingTime: 14
order: 18
keywords: ["std::lock_guard","std::unique_lock","std::scoped_lock","deadlock prevention","raii locking"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔐 RAII Lock Wrappers: std::lock_guard, std::unique_lock, and std::scoped_lock

## Introduction
Manually invoking `mutex.lock()` and `mutex.unlock()` is dangerous: an early `return` or thrown exception skips `unlock()`, causing a permanent **deadlock**. Modern C++ mandates **RAII lock guards**.

---

## 🛡️ The 3 Lock Wrappers Compared

| Lock Wrapper | Features | Best Use Case |
|---|---|---|
| **`std::lock_guard`** | Minimalist RAII lock; locks on construction, unlocks on destruction | Simple critical sections |
| **`std::unique_lock`** | Can be manually unlocked, relocked, deferred, or transferred | When used with `std::condition_variable` |
| **`std::scoped_lock`** (C++17) | **Locks multiple mutexes simultaneously with deadlock-avoidance algorithms** | **Default choice for all modern code** |

---

## 🚫 Preventing Multi-Mutex Deadlocks with `std::scoped_lock`

When transferring funds between two accounts, locking Account A then Account B while another thread locks Account B then Account A causes a classic **ABBA Deadlock**.
C++17's **`std::scoped_lock`** eliminates this:

```cpp
#include <iostream>
#include <mutex>
#include <thread>

struct Account {
    int id;
    double balance;
    std::mutex mtx;
    Account(int i, double b) : id(i), balance(b) {}
};

void transferFunds(Account& from, Account& to, double amount) {
    // Locks BOTH mutexes atomically without risk of deadlock!
    std::scoped_lock lock(from.mtx, to.mtx);

    if (from.balance >= amount) {
        from.balance -= amount;
        to.balance += amount;
        std::cout << "Transferred ₹" << amount << " from Acc " << from.id << " to Acc " << to.id << "\n";
    }
}

int main() {
    Account acc1(101, 5000.0);
    Account acc2(102, 3000.0);

    std::jthread t1(transferFunds, std::ref(acc1), std::ref(acc2), 1000.0);
    std::jthread t2(transferFunds, std::ref(acc2), std::ref(acc1), 500.0);

    return 0;
}
```
