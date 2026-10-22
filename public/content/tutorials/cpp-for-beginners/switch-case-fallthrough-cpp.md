---
id: switch-case-fallthrough-cpp
slug: switch-case-fallthrough-cpp
course: cpp-for-beginners
chapter: 4: Control Flow and Decision Making
topic: "switch-case Statements and [[fallthrough]] Attribute"
difficulty: Beginner
readingTime: 12
order: 18
keywords: ["switch case","fallthrough attribute","jump tables","multi-way branching","break statement"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔀 switch-case Statements and the [[fallthrough]] Attribute

## Introduction
When branching across multiple integral constants, a **`switch`** statement is cleaner and often faster than chained `if-else` checks because compilers can optimize `switch` into O(1) jump tables.

---

## 🏛️ Standard switch Anatomy

```cpp
#include <iostream>

int main() {
    int option = 2;

    switch (option) {
        case 1:
            std::cout << "Enrolled in C Programming Course\n";
            break;
        case 2:
            std::cout << "Enrolled in Modern C++ Mastery Course\n";
            break;
        case 3:
            std::cout << "Enrolled in Java Development Course\n";
            break;
        default:
            std::cerr << "Invalid Course Selection!\n";
            break;
    }

    return 0;
}
```

---

## ⚡ The C++17 `[[fallthrough]]` Attribute

If a `case` does not terminate with `break`, execution "falls through" into the next case. Compilers treat accidental fallthrough as a bug and throw warnings.
When fallthrough is intentional, annotate it explicitly using the C++17 standard attribute `[[fallthrough]]`:

```cpp
#include <iostream>

int main() {
    char clearanceLevel = 'B';

    switch (clearanceLevel) {
        case 'A':
            std::cout << "[Permission]: Root Administrator Access Granted.\n";
            [[fallthrough]]; // Intentionally cascades to lower tier permissions
        case 'B':
            std::cout << "[Permission]: Database Read/Write Access Granted.\n";
            [[fallthrough]];
        case 'C':
            std::cout << "[Permission]: Guest Read-Only Access Granted.\n";
            break;
        default:
            std::cout << "[Permission]: No Access.\n";
            break;
    }

    return 0;
}
```

### Constraints on `switch`:
- `switch` expressions must evaluate to an integral or enumeration type (e.g. `int`, `char`, `enum`). Strings and floating-point types cannot be used in a `switch` condition.
