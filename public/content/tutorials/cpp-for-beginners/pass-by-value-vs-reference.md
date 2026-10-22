---
id: pass-by-value-vs-reference
slug: pass-by-value-vs-reference
course: cpp-for-beginners
chapter: 6: Functions, References & Overloading
topic: "Pass-by-Value vs Pass-by-Reference (&)"
difficulty: Beginner
readingTime: 13
order: 25
keywords: ["pass by value","pass by reference","reference variable","aliasing","modifying arguments"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 Pass-by-Value vs Pass-by-Reference (&)

## Introduction
How parameters are passed into functions dictates whether operations affect the original variables or merely local copies. C++ introduces native **references (`&`)**, which act as safe, non-null aliases to existing memory addresses.

---

## 📦 Pass-by-Value (Copying Data)

When passing by value, the caller makes a complete duplicate of the argument in stack memory:

```cpp
#include <iostream>

void modifyByValue(int x) {
    x = 100; // Modifies only local copy
}

int main() {
    int original = 10;
    modifyByValue(original);
    std::cout << "Original after pass-by-value: " << original << "\n"; // Still 10!
    return 0;
}
```

---

## 🔗 Pass-by-Reference (&)

By appending an ampersand `&` to the parameter type, the function binds directly to the caller's variable:

```cpp
#include <iostream>

// Swapping two values in-place via reference:
void swapNumbers(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int num1 = 50;
    int num2 = 99;

    std::cout << "Before swap: num1=" << num1 << ", num2=" << num2 << "\n";
    swapNumbers(num1, num2);
    std::cout << "After swap:  num1=" << num1 << ", num2=" << num2 << "\n";

    return 0;
}
```

---

## 🆚 References vs Pointers: Why References Win
1. **Cannot be Null**: A reference must always bind to a valid existing object upon creation.
2. **Cannot be Rebound**: Once created, a reference permanently aliases its target.
3. **Clean Syntax**: No dereferencing asterisks `*ptr` or arrow operators `->` required.
