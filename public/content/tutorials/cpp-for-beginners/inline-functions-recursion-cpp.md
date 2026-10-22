---
id: inline-functions-recursion-cpp
slug: inline-functions-recursion-cpp
course: cpp-for-beginners
chapter: 6: Functions, References & Overloading
topic: "Inline Functions and Intro to Recursion"
difficulty: Beginner
readingTime: 12
order: 28
keywords: ["inline function","recursion","base case","call stack","factorial recursive"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Inline Functions and Intro to Recursion

## Introduction
Small helper functions incur a micro-overhead when invoked (stack frame creation, register spilling, and instruction jumps). The **`inline`** keyword suggests that the compiler replace the function call directly with its body code. Conversely, **recursion** solves problems by having functions call themselves.

---

## 🚀 The `inline` Keyword

```cpp
#include <iostream>

inline int squareNumber(int x) {
    return x * x;
}

int main() {
    // Compiler replaces this directly with: (5 * 5)
    int result = squareNumber(5);
    std::cout << "Square: " << result << "\n";
    return 0;
}
```

---

## 🔁 Introduction to Recursion

A recursive function requires two fundamental components:
1. **Base Case**: The condition where recursion stops.
2. **Recursive Case**: The step that reduces the problem towards the base case.

### Factorial Example:
```cpp
#include <iostream>

uint64_t computeFactorial(uint32_t n) {
    // 1. Base Case
    if (n <= 1) {
        return 1;
    }
    // 2. Recursive Case
    return n * computeFactorial(n - 1);
}

int main() {
    uint32_t num = 5;
    std::cout << "Factorial of " << num << " is: " << computeFactorial(num) << "\n";
    return 0;
}
```

### Visualizing the Call Stack for `computeFactorial(3)`:
```text
[ computeFactorial(3) ] ──► returns 3 * computeFactorial(2)
    [ computeFactorial(2) ] ──► returns 2 * computeFactorial(1)
        [ computeFactorial(1) ] ──► returns 1 (Base Case hit!)
Unwinding: 1 * 2 * 3 = 6
```
