---
id: range-based-for-loops
slug: range-based-for-loops
course: cpp-for-beginners
chapter: 5: Loops and Iterations
topic: "Modern Range-Based for Loops (for (const auto& item : items))"
difficulty: Beginner
readingTime: 12
order: 22
keywords: ["range-based for loop","for each","iterating containers","const auto ref","modern cpp loops"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Modern Range-Based for Loops

## Introduction
Introduced in C++11, the **range-based for loop** is the standard, idiomatic way to iterate over arrays, vectors, strings, and standard library collections. It eliminates off-by-one errors and pointer arithmetic mistakes.

---

## 📝 Syntax Patterns

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> courses = {"C Programming", "Modern C++", "Java", "DSA"};

    // 1. Read-Only Pass by Const Reference (Fastest, zero copying):
    for (const auto& course : courses) {
        std::cout << "Course: " << course << "\n";
    }

    // 2. Modifying Elements in-place via non-const reference:
    std::vector<int> marks = {45, 52, 60, 71};
    for (auto& score : marks) {
        score += 5; // Bonus grace marks added directly to collection
    }

    // 3. Iterating by value (Makes a copy of each element):
    for (auto score : marks) {
        std::cout << score << " ";
    }
    std::cout << "\n";

    return 0;
}
```

---

## 💡 Best Practice Cheat Sheet

| Loop Signature | Behavior | When to Use |
|---|---|---|
| `for (const auto& x : container)` | **Read-only by reference** | **90% of the time** (Prevents copying large strings/objects) |
| `for (auto& x : container)` | **Read/write by reference** | When mutating elements in-place |
| `for (auto x : container)` | **Pass-by-value (copy)** | Only for cheap primitives (`int`, `double`, `char`) |
