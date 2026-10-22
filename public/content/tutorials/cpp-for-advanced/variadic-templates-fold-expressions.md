---
id: variadic-templates-fold-expressions
slug: variadic-templates-fold-expressions
course: cpp-for-advanced
chapter: 3: Templates & Generic Metaprogramming
topic: "Variadic Templates and Fold Expressions in Modern C++"
difficulty: Advanced
readingTime: 13
order: 13
keywords: ["variadic templates","fold expressions","parameter packs","c++17 fold","generic print"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🪄 Variadic Templates and Fold Expressions

## Introduction
A **variadic template** accepts an arbitrary number of arguments of arbitrary types using parameter packs (`typename... Args`). C++17 introduced **fold expressions**, transforming complex recursive parameter-pack expansions into simple one-line statements.

---

## 🤹 Modern C++17 Fold Expressions

```cpp
#include <iostream>
#include <string>

// 1. Unary Left Fold: (... + args) evaluates: (((a + b) + c) + d)
template <typename... Args>
auto sumAll(Args... args) {
    return (... + args);
}

// 2. Comma Fold Expression: Printing arbitrary items separated by space
template <typename... Args>
void printLine(const Args&... args) {
    // Expands: (std::cout << arg1 << ' ', std::cout << arg2 << ' ', ...)
    ((std::cout << args << " "), ...) << "\n";
}

int main() {
    std::cout << "Sum (1+2+3+4+5): " << sumAll(1, 2, 3, 4, 5) << "\n";
    std::cout << "Float Sum:       " << sumAll(1.5, 2.5, 3.5) << "\n";

    printLine("Welcome", "to", "MSK", "Institute", 2026, "Batch");
    return 0;
}
```

---

## 💡 Types of Fold Expressions
- **Unary Right Fold**: `(args op ...)`
- **Unary Left Fold**: `(... op args)`
- **Binary Right Fold**: `(args op ... op init)`
- **Binary Left Fold**: `(init op ... op args)`
