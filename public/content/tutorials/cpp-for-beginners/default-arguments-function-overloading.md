---
id: default-arguments-function-overloading
slug: default-arguments-function-overloading
course: cpp-for-beginners
chapter: 6: Functions, References & Overloading
topic: "Default Arguments and Function Overloading"
difficulty: Beginner
readingTime: 12
order: 27
keywords: ["function overloading","default parameters","name mangling","polymorphism basics"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🤹 Default Arguments and Function Overloading

## Introduction
C++ enables polymorphism at compile time through **function overloading** (multiple functions sharing the same name with different parameter signatures) and **default arguments**.

---

## ⚙️ Default Arguments

Default arguments let callers omit parameters, substituting predefined defaults:

```cpp
#include <iostream>

// Note: Default arguments must be placed at the end of parameter list
void printReceipt(double amount, double discountPercent = 0.0, double taxRate = 18.0) {
    double discounted = amount - (amount * (discountPercent / 100.0));
    double finalTotal = discounted + (discounted * (taxRate / 100.0));

    std::cout << "Base: ₹" << amount << " | Final Payable: ₹" << finalTotal << "\n";
}

int main() {
    printReceipt(1000);              // Uses default discount (0%) and tax (18%)
    printReceipt(1000, 10.0);        // Uses 10% discount and default tax (18%)
    printReceipt(1000, 10.0, 5.0);   // Overrides both discount and tax
    return 0;
}
```

---

## 🔄 Function Overloading

Functions can share an identical identifier as long as their parameter types or counts differ:

```cpp
#include <iostream>
#include <string>

// Overload 1: Integers
int calculateSum(int a, int b) {
    return a + b;
}

// Overload 2: Doubles
double calculateSum(double a, double b) {
    return a + b;
}

// Overload 3: Three numbers
int calculateSum(int a, int b, int c) {
    return a + b + c;
}

int main() {
    std::cout << "Sum (int): " << calculateSum(10, 20) << "\n";
    std::cout << "Sum (double): " << calculateSum(5.5, 4.2) << "\n";
    std::cout << "Sum (3 ints): " << calculateSum(1, 2, 3) << "\n";
    return 0;
}
```

### Name Mangling:
Under the hood, C++ compilers encode the parameter types into the assembly symbol name (e.g. `_Z12calculateSumii`), allowing the linker to differentiate overloaded functions.
