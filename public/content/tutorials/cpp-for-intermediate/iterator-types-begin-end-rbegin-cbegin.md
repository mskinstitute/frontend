---
id: iterator-types-begin-end-rbegin-cbegin
slug: iterator-types-begin-end-rbegin-cbegin
course: cpp-for-intermediate
chapter: 5: STL Iterators & Modern Algorithms
topic: "Iterator Types: begin(), end(), rbegin(), rend(), cbegin()"
difficulty: Intermediate
readingTime: 12
order: 21
keywords: ["iterators","begin end","rbegin rend","cbegin cend","reverse iterators","const iterators"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧭 Iterator Types: begin(), end(), rbegin(), and cbegin()

## Introduction
An **iterator** is an object that adheres to pointer semantics (`*`, `++`, `==`), enabling traversal across different container types using a uniform interface.

---

## 🗺️ Visualizing Container Boundaries

```text
  [ Element 0 ]  [ Element 1 ]  [ Element 2 ]  [ Element 3 ]
       ▲                                              ▲
       │                                              │
    begin()                                         end() (Past-the-end element!)
```

Notice that **`end()` does NOT point to the last element**; it points to the hypothetical element *immediately following* the last element.

---

## 🔄 The 4 Iterator Access Modes

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};

    // 1. Forward Traversal: begin() to end()
    std::cout << "Forward: ";
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";

    // 2. Reverse Traversal: rbegin() to rend()
    std::cout << "Reverse: ";
    for (auto rit = numbers.rbegin(); rit != numbers.rend(); ++rit) {
        std::cout << *rit << " "; // 50 40 30 20 10
    }
    std::cout << "\n";

    // 3. Const Iterators: cbegin() to cend() (Read-only protection)
    std::cout << "Const:   ";
    for (auto cit = numbers.cbegin(); cit != numbers.cend(); ++cit) {
        // *cit = 99; // 💥 Compiler halts: read-only location
        std::cout << *cit << " ";
    }
    std::cout << "\n";

    return 0;
}
```
