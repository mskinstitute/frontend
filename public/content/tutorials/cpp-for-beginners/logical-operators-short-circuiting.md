---
id: logical-operators-short-circuiting
slug: logical-operators-short-circuiting
course: cpp-for-beginners
chapter: 3: Operators, Expressions & Math
topic: "Logical Operators and Short-Circuiting"
difficulty: Beginner
readingTime: 11
order: 13
keywords: ["logical and","logical or","logical not","short-circuit evaluation","boolean logic"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💡 Logical Operators and Short-Circuiting

## Introduction
Logical operators evaluate one or more boolean expressions to make composite decisions. C++ guarantees **short-circuit evaluation**, a critical feature for writing safe, performant conditions.

---

## 🧩 The Three Core Logical Operators

| Operator | Name | Logic |
|---|---|---|
| `&&` | Logical AND | Returns `true` if **both** operands evaluate to `true` |
| `||` | Logical OR | Returns `true` if **at least one** operand evaluates to `true` |
| `!` | Logical NOT | Inverts the truth value (`!true` is `false`) |

```cpp
#include <iostream>

int main() {
    bool hasIdProof = true;
    int age = 19;
    bool hasParentalConsent = false;

    // Compound logic:
    bool isEligibleForAdmission = hasIdProof && (age >= 18 || hasParentalConsent);

    std::cout << std::boolalpha << "Eligible: " << isEligibleForAdmission << "\n";
    return 0;
}
```

---

## ⚡ Short-Circuit Evaluation: Safety & Performance

In C++, boolean expressions are evaluated strictly from left to right:
1. **In `A && B`**: If `A` is `false`, `B` is **never evaluated**, because the result must be `false`.
2. **In `A || B`**: If `A` is `true`, `B` is **never evaluated**, because the result must be `true`.

### Preventing Division-by-Zero and Null Pointer Crashes:
```cpp
#include <iostream>

int main() {
    int totalItems = 0;
    int totalCost = 1000;

    // ✅ Safe thanks to short-circuiting:
    // If totalItems == 0, the right-hand division is skipped entirely!
    if (totalItems > 0 && (totalCost / totalItems) < 100) {
        std::cout << "Discount applicable\n";
    } else {
        std::cout << "Cannot compute average or items are zero\n";
    }

    return 0;
}
```
