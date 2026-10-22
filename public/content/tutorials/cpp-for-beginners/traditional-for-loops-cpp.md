---
id: traditional-for-loops-cpp
slug: traditional-for-loops-cpp
course: cpp-for-beginners
chapter: 5: Loops and Iterations
topic: "Traditional for Loops with Multiple Counters"
difficulty: Beginner
readingTime: 12
order: 21
keywords: ["for loop","loop counters","iteration","multiple loop variables"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 Traditional for Loops with Multiple Counters

## Introduction
The traditional `for` loop bundles initialization, condition testing, and increment/step operations into a single structured header.

---

## 🏛️ Anatomy of the `for` Loop

```text
for (init-statement; condition; iteration-expression) {
    // Body statements
}
```

```cpp
#include <iostream>

int main() {
    // Standard step loop: counting even numbers from 2 to 20
    for (int i = 2; i <= 20; i += 2) {
        std::cout << i << " ";
    }
    std::cout << "\n";
    return 0;
}
```

---

## 🤹 Multiple Loop Counters in a Single Loop

You can initialize and advance multiple loop variables simultaneously using the comma operator:

```cpp
#include <iostream>

int main() {
    // Two pointers converging towards each other:
    for (int i = 0, j = 10; i <= j; ++i, --j) {
        std::cout << "i: " << i << " <---> j: " << j << "\n";
    }

    return 0;
}
```

---

## ⚠️ Scope of Loop Variables
In Modern C++, variables declared in the `for` header are scoped strictly to the loop body:
```cpp
for (int i = 0; i < 5; ++i) {
    // 'i' exists here
}
// 'i' is automatically destroyed here; no memory leak or scope pollution.
```
