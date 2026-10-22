---
id: math-functions-cmath
slug: math-functions-cmath
course: cpp-for-beginners
chapter: 3: Operators, Expressions & Math
topic: "Math Functions with <cmath> (pow, sqrt, round, ceil, floor)"
difficulty: Beginner
readingTime: 12
order: 14
keywords: ["cmath","pow","sqrt","ceil","floor","round","hypot","math functions"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📐 Math Functions with <cmath>

## Introduction
For mathematical, scientific, and game programming computations, C++ imports the standard C math library through **`<cmath>`**, placing all functions cleanly inside the `std::` namespace.

---

## 📚 Essential Functions in `<cmath>`

```cpp
#include <iostream>
#include <cmath>
#include <iomanip>

int main() {
    double value = 25.0;
    double base = 2.0;
    double exponent = 8.0;

    std::cout << "Square root of 25: " << std::sqrt(value) << "\n";
    std::cout << "2^8 (pow): " << std::pow(base, exponent) << "\n";
    std::cout << "Hypotenuse (3, 4): " << std::hypot(3.0, 4.0) << "\n";

    // Rounding functions
    double fractionalNum = 4.35;
    std::cout << "Floor(4.35): " << std::floor(fractionalNum) << "\n"; // 4.0
    std::cout << "Ceil(4.35): " << std::ceil(fractionalNum) << "\n";   // 5.0
    std::cout << "Round(4.35): " << std::round(fractionalNum) << "\n"; // 4.0
    std::cout << "Round(4.75): " << std::round(4.75) << "\n";          // 5.0

    // Absolute values
    double delta = -142.85;
    std::cout << "Absolute delta: " << std::abs(delta) << "\n";

    return 0;
}
```

---

## ⚠️ Floating-Point Comparison Pitfall

Never compare two floating-point values directly using `==`:
```cpp
#include <iostream>
#include <cmath>

int main() {
    double a = 0.1 + 0.2;
    double b = 0.3;

    // ❌ WRONG: Fails due to binary precision limitations
    if (a == b) {
        std::cout << "Equal\n";
    } else {
        std::cout << "NOT Equal! (a = " << a << ", b = " << b << ")\n";
    }

    // ✅ CORRECT: Epsilon threshold comparison
    constexpr double EPSILON = 1e-9;
    if (std::abs(a - b) < EPSILON) {
        std::cout << "Equal within epsilon precision threshold!\n";
    }

    return 0;
}
```
