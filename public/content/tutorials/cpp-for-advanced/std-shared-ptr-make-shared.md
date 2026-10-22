---
id: std-shared-ptr-make-shared
slug: std-shared-ptr-make-shared
course: cpp-for-advanced
chapter: 2: Smart Pointers & RAII Architecture
topic: "std::shared_ptr: Shared Reference-Counted Ownership and std::make_shared"
difficulty: Advanced
readingTime: 14
order: 8
keywords: ["std::shared_ptr","std::make_shared","reference counting","control block","shared ownership"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🤝 std::shared_ptr: Shared Reference-Counted Ownership

## Introduction
When a heap resource must be co-owned by multiple independent subsystems (such as a shared texture loaded by multiple game sprites, or a shared database pool accessed by worker threads), Modern C++ provides **`std::shared_ptr`**.

---

## 📊 The Control Block and Reference Counting

A `std::shared_ptr` internally consists of two pointers:
1. Pointer to the managed object.
2. Pointer to a thread-safe **Control Block** (tracking the reference count and weak count).

```text
[ shared_ptr A ] ──┐
                   ▼
            [ Control Block: RefCount = 2 ] ──► [ Managed Heap Object ]
                   ▲
[ shared_ptr B ] ──┘
```

- When a new `shared_ptr` copies an existing one, `RefCount` increments.
- When any `shared_ptr` is destroyed, `RefCount` decrements.
- When `RefCount` reaches `0`, the object is deleted automatically.

---

## 💻 Full Implementation

```cpp
#include <iostream>
#include <memory>

class DatabaseConnection {
public:
    DatabaseConnection() { std::cout << "[DB]: Connection opened.\n"; }
    ~DatabaseConnection() { std::cout << "[DB]: Connection closed safely.\n"; }
    void executeQuery(const std::string& sql) const {
        std::cout << "Executing: " << sql << "\n";
    }
};

int main() {
    // Create shared resource using std::make_shared (allocates object + control block in 1 allocation!)
    std::shared_ptr<DatabaseConnection> serviceA = std::make_shared<DatabaseConnection>();
    std::cout << "Reference Count: " << serviceA.use_count() << "\n"; // 1

    {
        std::shared_ptr<DatabaseConnection> serviceB = serviceA; // Shared copy
        std::cout << "Reference Count inside block: " << serviceA.use_count() << "\n"; // 2
        serviceB->executeQuery("SELECT * FROM batches;");
    } // serviceB destroyed; RefCount decrements to 1

    std::cout << "Reference Count after block: " << serviceA.use_count() << "\n"; // 1

    return 0;
} // serviceA destroyed; RefCount hits 0; DatabaseConnection is closed!
```
