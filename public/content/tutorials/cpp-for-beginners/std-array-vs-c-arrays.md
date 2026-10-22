---
id: std-array-vs-c-arrays
slug: std-array-vs-c-arrays
course: cpp-for-beginners
chapter: 7: Modern std::string & std::array
topic: "Fixed-Size Arrays with std::array vs C-Style Arrays"
difficulty: Beginner
readingTime: 13
order: 31
keywords: ["std::array","c-style array","bounds checking","array::at","size member"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📦 Fixed-Size Arrays: std::array vs C-Style Arrays

## Introduction
C-style arrays (`int arr[5]`) suffer from dangerous flaws: they silently decay into raw pointers when passed to functions, do not know their own size, and lack bounds-checking. Modern C++ provides **`std::array`** from `<array>` as a zero-overhead, type-safe replacement.

---

## 🆚 Comparison Overview

| Feature | Legacy C-Array (`int arr[5]`) | Modern `std::array<int, 5>` |
|---|---|---|
| Memory Overhead | Zero (Stack allocated) | **Zero (Stack allocated, identical to C-array)** |
| Knows its own size? | No (Decays to raw pointer) | **Yes (`.size()`)** |
| Bounds Checking | No | **Yes (via `.at()`)** |
| Copyable / Assignable? | No (Cannot do `a = b;`) | **Yes (`arr1 = arr2;`)** |
| STL Iterator Support | Partial | **Full (`begin()`, `end()`, range-for)** |

---

## 💻 Working with `std::array`

```cpp
#include <iostream>
#include <array>
#include <algorithm>

int main() {
    // Definition: std::array<Type, Size>
    std::array<int, 5> studentScores = {85, 92, 78, 96, 88};

    std::cout << "Total items: " << studentScores.size() << "\n";

    // Bounds-checked access
    try {
        std::cout << "First: " << studentScores.at(0) << "\n";
        // studentScores.at(10) = 50; // Throws std::out_of_range exception!
    } catch (const std::out_of_range& e) {
        std::cerr << "Caught exception: " << e.what() << "\n";
    }

    // Modern range-based for loop
    std::cout << "Scores: ";
    for (const auto& score : studentScores) {
        std::cout << score << " ";
    }
    std::cout << "\n";

    // Sorting using standard algorithms
    std::sort(studentScores.begin(), studentScores.end());
    std::cout << "Highest Score: " << studentScores.back() << "\n";

    return 0;
}
```
