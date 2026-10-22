---
id: std-unique-ptr-make-unique
slug: std-unique-ptr-make-unique
course: cpp-for-advanced
chapter: 2: Smart Pointers & RAII Architecture
topic: "std::unique_ptr: Exclusive Ownership and std::make_unique"
difficulty: Advanced
readingTime: 13
order: 7
keywords: ["std::unique_ptr","std::make_unique","smart pointer","exclusive ownership","move only pointer"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔒 std::unique_ptr: Exclusive Ownership and std::make_unique

## Introduction
**`std::unique_ptr`** is the default smart pointer in Modern C++. It guarantees **exclusive ownership** of a heap-allocated resource: exactly one `unique_ptr` owns the resource at any given moment, and when that pointer leaves scope, the memory is deleted automatically with **zero runtime overhead** compared to raw pointers.

---

## 🚫 Move-Only Semantics

A `std::unique_ptr` **cannot be copied** (copy constructor is deleted to prevent double-free bugs), but it **can be moved**:

```cpp
#include <iostream>
#include <memory>
#include <string>

class UserSession {
public:
    std::string username;
    explicit UserSession(std::string name) : username(std::move(name)) {
        std::cout << "[LOGIN]: UserSession created for " << username << "\n";
    }
    ~UserSession() {
        std::cout << "[LOGOUT]: UserSession destroyed for " << username << "\n";
    }
};

int main() {
    // Modern C++14 std::make_unique: Exception-safe heap construction
    auto sessionPtr = std::make_unique<UserSession>("sumit_msk");

    // sessionPtr->username; // Access using pointer arrow syntax

    // auto copySession = sessionPtr; // 💥 Compiler halts: Copying is forbidden!
    
    // Transferring ownership via move semantics:
    std::unique_ptr<UserSession> newOwner = std::move(sessionPtr);

    if (!sessionPtr) {
        std::cout << "Original sessionPtr is now null (ownership relinquished).\n";
    }

    std::cout << "New owner username: " << newOwner->username << "\n";

    return 0;
} // newOwner goes out of scope here: destructor cleanly executes!
```

---

## 💡 Why Prefer `std::make_unique` Over `new`?
1. Prevents memory leaks if an exception is thrown in a multi-argument function call.
2. Eliminates repetitive type declarations (`auto p = std::make_unique<Student>()` instead of `std::unique_ptr<Student> p(new Student())`).
