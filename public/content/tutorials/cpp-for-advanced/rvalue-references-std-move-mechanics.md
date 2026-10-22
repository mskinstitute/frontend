---
id: rvalue-references-std-move-mechanics
slug: rvalue-references-std-move-mechanics
course: cpp-for-advanced
chapter: 1: Move Semantics & Modern Memory Management
topic: "Rvalue References (&&) and std::move Mechanics"
difficulty: Advanced
readingTime: 13
order: 2
keywords: ["rvalue reference","std::move","double ampersand","move semantics","cast to rvalue"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Rvalue References (&&) and std::move Mechanics

## Introduction
The introduction of **rvalue references (`Type&&`)** in C++11 solved one of C++'s oldest performance bottlenecks: unnecessary deep copying of heavy temporary objects.

---

## 🔍 The Rvalue Reference Syntax (`Type&&`)

An rvalue reference binds exclusively to rvalues (temporaries or expiring objects):

```cpp
#include <iostream>

void inspect(int& lref) {
    std::cout << "Bound to Lvalue reference: " << lref << "\n";
}

void inspect(int&& rref) {
    std::cout << "Bound to Rvalue reference (Movable): " << rref << "\n";
}

int main() {
    int x = 42;
    inspect(x);           // Calls inspect(int&)
    inspect(99);          // Calls inspect(int&&) - temporary literal
    inspect(x + 5);       // Calls inspect(int&&) - temporary result
    inspect(std::move(x));// Calls inspect(int&&) - cast to rvalue!
    return 0;
}
```

---

## 🚚 What `std::move` Actually Does

A common misconception is that `std::move` moves bytes or generates machine code. In reality:
> **`std::move` does not move anything!**
> It is simply an unconditional **compile-time static_cast** to an rvalue reference: `static_cast<std::remove_reference_t<T>&&>(t)`.

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> source = {1, 2, 3, 4, 5};

    // Deep copy: allocates new heap buffer, copies 5 integers:
    std::vector<int> copyTarget = source;

    // Move: transfers internal pointer addresses! source becomes empty.
    std::vector<int> moveTarget = std::move(source);

    std::cout << "moveTarget size: " << moveTarget.size() << "\n";
    std::cout << "source size:     " << source.size() << " (moved-from valid state)\n";

    return 0;
}
```

---

## ⚠️ The Moved-From State Contract
After an object is moved from, the C++ standard states it is in a **"valid but unspecified state"**. You can safely re-assign it or let its destructor run, but you must not make assumptions about its contents.
