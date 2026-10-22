---
id: type-deduction-auto-decltype
slug: type-deduction-auto-decltype
course: cpp-for-beginners
chapter: 2: Variables, Types & Const-Correctness
topic: "Type Deduction with auto and decltype"
difficulty: Beginner
readingTime: 12
order: 7
keywords: ["auto keyword","decltype","type deduction","modern cpp types","type inference"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔍 Type Deduction with auto and decltype

## Introduction
Prior to C++11, C++ developers had to write verbose, repetitive type declarations. With the introduction of **`auto`** and **`decltype`**, the compiler automatically infers the exact type of an expression at **compile time** with **zero runtime overhead**.

---

## 🚗 Automatic Type Deduction with `auto`

```cpp
#include <iostream>
#include <string>
#include <vector>

int main() {
    auto age = 25;               // Deduced as int
    auto price = 19.99;          // Deduced as double
    auto grade = 'A';            // Deduced as char
    auto isEnrolled = true;      // Deduced as bool
    auto message = "MSK";        // Deduced as const char*
    auto title = std::string{"Modern C++"}; // Deduced as std::string

    std::cout << title << " | Price: ₹" << price << "\n";
    return 0;
}
```

### Where `auto` Truly Shines: Complex Types
```cpp
#include <vector>
#include <map>
#include <string>

int main() {
    std::map<std::string, std::vector<int>> studentScores;

    // ❌ Without auto: excruciating verbosity
    // std::map<std::string, std::vector<int>>::const_iterator it = studentScores.cbegin();

    // ✅ With auto: clean, maintainable, refactor-friendly
    auto it = studentScores.cbegin();
    return 0;
}
```

---

## 🔬 Type Querying with `decltype`

While `auto` declares a variable by deducing its type from an initializer, `decltype(expr)` extracts the exact declared type of an expression without evaluating it:

```cpp
#include <iostream>

int main() {
    int score = 95;
    decltype(score) bonusScore = 10; // Deduced as int

    const double taxRate = 0.18;
    decltype(taxRate) stateTax = 0.05; // Deduced as const double

    std::cout << "Score + Bonus: " << (score + bonusScore) << "\n";
    return 0;
}
```

---

## ⚠️ Important Nuance: `auto` Drops References & Top-Level Const

```cpp
int x = 10;
const int& ref = x;

auto a = ref;       // 'a' is a plain 'int' (copy), NOT const reference!
const auto& b = ref;// 'b' is 'const int&' (explicitly preserves const reference)
```
