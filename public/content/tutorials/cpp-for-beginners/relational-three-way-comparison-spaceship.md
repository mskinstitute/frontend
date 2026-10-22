---
id: relational-three-way-comparison-spaceship
slug: relational-three-way-comparison-spaceship
course: cpp-for-beginners
chapter: 3: Operators, Expressions & Math
topic: "Relational, Equality, and Three-Way Comparison (Spaceship Operator <=>)"
difficulty: Beginner
readingTime: 13
order: 12
keywords: ["relational operators","equality","spaceship operator","<=>","three-way comparison","strong_ordering"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Relational, Equality, and Three-Way Comparison (Spaceship Operator <=>)

## Introduction
Comparisons are fundamental to conditional branching. C++ includes traditional boolean comparison operators and introduced the revolutionary **Three-Way Comparison Operator `<=>`** (the "Spaceship Operator") in C++20.

---

## ⚖️ Standard Relational Operators

All standard relational operators yield a boolean value (`true` or `false`):
- `==` : Equal to
- `!=` : Not equal to
- `<`  : Less than
- `<=` : Less than or equal to
- `>`  : Greater than
- `>=` : Greater than or equal to

```cpp
#include <iostream>

int main() {
    int userScore = 85;
    int passingScore = 50;

    std::cout << std::boolalpha; // Formats boolean output as 'true'/'false'
    std::cout << "Has passed: " << (userScore >= passingScore) << "\n";
    std::cout << "Perfect score: " << (userScore == 100) << "\n";
    return 0;
}
```

---

## 🛸 The Modern C++20 Spaceship Operator (`<=>`)

Prior to C++20, if you authored a custom struct or class, you had to manually implement six separate comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`).
With C++20's **Three-Way Comparison (`<=>`)**, a single operator provides complete ordering:

```cpp
#include <iostream>
#include <compare>

int main() {
    int a = 10;
    int b = 20;

    auto result = (a <=> b);

    if (result < 0) {
        std::cout << "a is less than b\n";
    } else if (result == 0) {
        std::cout << "a is equal to b\n";
    } else {
        std::cout << "a is greater than b\n";
    }

    return 0;
}
```

### Return Types of `<=>`:
- `std::strong_ordering`: Values that are substitutable (e.g. integers: if `a == b`, `f(a) == f(b)`).
- `std::partial_ordering`: Values with non-comparable states (e.g. floating-point `NaN`).
