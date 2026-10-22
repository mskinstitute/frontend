---
id: cpp20-ranges-and-views
slug: cpp20-ranges-and-views
course: cpp-for-advanced
chapter: 5: Modern C++ Features & Vocabulary Types
topic: "Introduction to C++20 Ranges & Views"
difficulty: Advanced
readingTime: 14
order: 25
keywords: ["c++20 ranges","ranges and views","pipe operator","lazy evaluation","modern stl"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🌊 Introduction to C++20 Ranges & Views

## Introduction
Before C++20, calling STL algorithms required passing verbose iterator pairs (`vec.begin(), vec.end()`) and chaining operations required temporary vector copies. **C++20 Ranges** introduces composable pipeline syntax using the Unix-style pipe operator (`|`) with **lazy evaluation**.

---

## ⚡ Composable Pipeline Syntax

```cpp
#include <iostream>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Filter even numbers, square them, and take the first 3:
    // Evaluated lazily on-the-fly with ZERO intermediate vector allocations!
    auto pipeline = numbers 
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; })
        | std::views::take(3);

    std::cout << "First 3 Squared Even Numbers: ";
    for (int val : pipeline) {
        std::cout << val << " "; // Output: 4 16 36
    }
    std::cout << "\n";

    return 0;
}
```

---

## 💡 Why Ranges Transform C++
1. **No Iterator Boilerplate**: Write `std::ranges::sort(vec)` instead of `std::sort(vec.begin(), vec.end())`.
2. **Zero-Copy Pipelines**: Views do not allocate memory; elements are computed lazily as they are iterated.
3. **Safety**: Eliminates mismatched iterator bugs (`std::sort(vec1.begin(), vec2.end())`).
