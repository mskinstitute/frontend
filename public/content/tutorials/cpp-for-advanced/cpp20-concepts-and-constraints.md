---
id: cpp20-concepts-and-constraints
slug: cpp20-concepts-and-constraints
course: cpp-for-advanced
chapter: 3: Templates & Generic Metaprogramming
topic: "Modern C++20 Concepts and Constraints (requires Clause)"
difficulty: Advanced
readingTime: 14
order: 15
keywords: ["c++20 concepts","constraints","requires clause","type safety","readable template errors"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Modern C++20 Concepts and Constraints

## Introduction
While SFINAE and `std::enable_if` worked, they produced infamously cryptic 100-line compiler error messages. C++20 revolutionized template metaprogramming with **Concepts**: first-class language constructs that specify semantic and syntactic requirements on template arguments.

---

## 🏛️ Defining and Using Concepts

```cpp
#include <iostream>
#include <concepts>
#include <string>

// 1. Custom Concept: Requires type to support addition and multiplication
template <typename T>
concept ArithmeticType = std::is_arithmetic_v<T>;

// 2. Using the concept in a function template:
template <ArithmeticType T>
T computeSquare(T x) {
    return x * x;
}

// 3. Using the 'requires' clause syntax:
template <typename T>
requires std::integral<T>
T computeModulus(T a, T b) {
    return a % b;
}

// 4. Terse Syntax: 'auto' constrained by Concept (C++20 shorthand):
void displayNumeric(std::integral auto val) {
    std::cout << "Integer Value: " << val << "\n";
}

int main() {
    std::cout << "Square (5):   " << computeSquare(5) << "\n";
    std::cout << "Square (2.5): " << computeSquare(2.5) << "\n";
    std::cout << "Modulus:      " << computeModulus(17, 5) << "\n";

    displayNumeric(42);

    // computeSquare(std::string("MSK")); 
    // 💥 Beautiful clean compiler error:
    // constraints not satisfied: 'std::is_arithmetic_v<std::string>' evaluated to false

    return 0;
}
```

---

## 💡 The Value of Concepts
1. **Readable Compiler Errors**: Pinpoints exactly which condition failed in 2 lines instead of pages of template dump.
2. **Self-Documenting Code**: Signatures clearly state their operational requirements directly in the interface.
