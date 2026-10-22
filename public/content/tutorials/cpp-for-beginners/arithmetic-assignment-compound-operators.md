---
id: arithmetic-assignment-compound-operators
slug: arithmetic-assignment-compound-operators
course: cpp-for-beginners
chapter: 3: Operators, Expressions & Math
topic: "Arithmetic, Assignment, and Compound Operators"
difficulty: Beginner
readingTime: 11
order: 11
keywords: ["arithmetic operators","modulus","compound assignment","increment decrement","operator precedence"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ➗ Arithmetic, Assignment, and Compound Operators

## Introduction
Operators form the computational engine of C++ expressions. C++ provides standard mathematical operators alongside efficient compound assignment and increment/decrement shortcuts.

---

## 🧮 Basic Arithmetic Operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | Addition | `10 + 5` | `15` |
| `-` | Subtraction | `10 - 5` | `5` |
| `*` | Multiplication | `10 * 5` | `50` |
| `/` | Division | `10 / 4` | `2` (Integer division truncates!) |
| `%` | Modulus (Remainder) | `10 % 3` | `1` |

```cpp
#include <iostream>

int main() {
    int totalHours = 50;
    int days = totalHours / 24;
    int remainingHours = totalHours % 24;

    std::cout << totalHours << " hours = " << days << " days and " << remainingHours << " hours.\n";
    return 0;
}
```

---

## ⚡ Compound Assignment Operators

Compound operators execute the operation and assign the result in a single step:
- `a += b` is equivalent to `a = a + b`
- `a -= b` is equivalent to `a = a - b`
- `a *= b` is equivalent to `a = a * b`
- `a /= b` is equivalent to `a = a / b`
- `a %= b` is equivalent to `a = a % b`

---

## 🔄 Prefix vs Postfix Increment (`++x` vs `x++`)

```cpp
#include <iostream>

int main() {
    int x = 5;
    int y = ++x; // Prefix: increments x FIRST, then returns new value (x=6, y=6)
    
    int a = 5;
    int b = a++; // Postfix: returns original value FIRST, then increments a (b=5, a=6)

    std::cout << "Prefix: x=" << x << ", y=" << y << "\n";
    std::cout << "Postfix: a=" << a << ", b=" << b << "\n";
    return 0;
}
```

### Performance Tip:
In C++, **prefer prefix `++i`** over postfix `i++` when writing loops and iterators, because postfix requires constructing a temporary copy of the previous state.
