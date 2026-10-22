---
id: std-variant-visit-type-safe-unions
slug: std-variant-visit-type-safe-unions
course: cpp-for-advanced
chapter: 5: Modern C++ Features & Vocabulary Types
topic: "std::variant and std::visit: Type-Safe Tagged Unions"
difficulty: Advanced
readingTime: 13
order: 23
keywords: ["std::variant","std::visit","tagged union","type safe union","visitor pattern"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🎭 std::variant and std::visit: Type-Safe Tagged Unions

## Introduction
C-style `union` structures are unsafe: they do not call destructors on complex types and lack runtime awareness of which type is currently active. C++17's **`std::variant`** is a **type-safe tagged union** capable of holding one value from a predefined set of types at any time.

---

## 🏛️ `std::variant` with `std::visit` Pattern

```cpp
#include <iostream>
#include <variant>
#include <string>

// A payment payload can be an Integer (UPI ID), String (Card Mask), or Double (Cash amount)
using PaymentInfo = std::variant<int, std::string, double>;

// Visitor struct using overloaded lambdas
struct PaymentVisitor {
    void operator()(int upiCode) const {
        std::cout << "Processing UPI Pin Code: " << upiCode << "\n";
    }
    void operator()(const std::string& card) const {
        std::cout << "Processing Credit Card ending in: " << card << "\n";
    }
    void operator()(double cash) const {
        std::cout << "Processing Cash Payment: ₹" << cash << "\n";
    }
};

int main() {
    PaymentInfo payment1 = 12345;
    PaymentInfo payment2 = std::string("**** 9042");
    PaymentInfo payment3 = 3499.50;

    // Inspect active type index:
    std::cout << "payment1 holds type index: " << payment1.index() << "\n";

    // Visit invokes the matching overloaded operator():
    std::visit(PaymentVisitor{}, payment1);
    std::visit(PaymentVisitor{}, payment2);
    std::visit(PaymentVisitor{}, payment3);

    // Checking specific type directly:
    if (std::holds_alternative<double>(payment3)) {
        std::cout << "Direct Cash extracted: ₹" << std::get<double>(payment3) << "\n";
    }

    return 0;
}
```
