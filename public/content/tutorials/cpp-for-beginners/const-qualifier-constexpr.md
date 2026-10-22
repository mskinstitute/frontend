---
id: const-qualifier-constexpr
slug: const-qualifier-constexpr
course: cpp-for-beginners
chapter: 2: Variables, Types & Const-Correctness
topic: "The const Qualifier, Const-Correctness, and constexpr Compile-Time Constants"
difficulty: Beginner
readingTime: 13
order: 8
keywords: ["const qualifier","const correctness","constexpr","compile-time constants","immutable data"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔒 The const Qualifier, Const-Correctness, and constexpr

## Introduction
Writing robust C++ software requires protecting data from unintended side-effects. The **`const`** qualifier enforces read-only access at runtime, while **`constexpr`** evaluates expressions entirely at **compile-time**.

---

## 🛡️ The `const` Qualifier

```cpp
#include <iostream>

int main() {
    const int MAX_STUDENTS = 60;
    // MAX_STUDENTS = 75; // 💥 Compiler Error: assignment of read-only variable

    std::cout << "Class limit: " << MAX_STUDENTS << "\n";
    return 0;
}
```

### The Const-Correctness Principle:
"If a variable or function parameter does not need to be modified, mark it `const` immediately." This enables compiler optimizations and serves as self-enforcing documentation.

---

## ⚡ `constexpr` Compile-Time Computation (C++11/C++20)

A variable marked `constexpr` is guaranteed to be computed during compilation. It occupies zero execution time at runtime:

```cpp
#include <iostream>

// Constexpr function evaluated by the compiler
constexpr double calculateGST(double basePrice, double ratePercent) {
    return basePrice * (ratePercent / 100.0);
}

int main() {
    // Computed during compilation into binary literal
    constexpr double courseFee = 4999.0;
    constexpr double tax = calculateGST(courseFee, 18.0);
    constexpr double total = courseFee + tax;

    std::cout << "Total Fee with GST: ₹" << total << "\n";
    return 0;
}
```

---

## 🆚 Comparison Matrix

| Feature | `const` | `constexpr` |
|---|---|---|
| Evaluation Time | Runtime or Compile-time | **Strictly Compile-Time** |
| Can accept runtime input? | Yes (e.g., `const int age = userInput;`) | **No** (all operands must be compile-time constants) |
| Usable as Array Bound? | Only if initialized with constant | **Always** |
| Memory Storage | May allocate stack memory | Replaced directly with constant literal in machine code |
