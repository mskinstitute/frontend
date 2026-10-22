---
id: overloading-comparison-subscript-operators
slug: overloading-comparison-subscript-operators
course: cpp-for-intermediate
chapter: 2: Copy Semantics & Operator Overloading
topic: "Overloading Comparison Operators (==, !=, <) and Subscript Operator ([])"
difficulty: Intermediate
readingTime: 13
order: 9
keywords: ["subscript operator","bracket operator","comparison operators","spaceship operator","bounds checked operator"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔍 Overloading Comparison Operators and the Subscript Operator ([])

## Introduction
The subscript operator **`operator[]`** enables custom collection classes to be accessed with array-like bracket syntax `myCollection[i]`. Comparison operators enable searching, sorting, and associative indexing.

---

## 🗃️ Implementing `operator[]` (Const & Non-Const Pair)

To provide both read and write capabilities, always implement `operator[]` as a pair:
1. Non-const version for element mutation: `Type& operator[](size_t index)`
2. Const version for read-only access: `const Type& operator[](size_t index) const`

```cpp
#include <iostream>
#include <stdexcept>
#include <array>

class IntList {
private:
    std::array<int, 5> m_items = {0, 0, 0, 0, 0};

public:
    // Non-const: allows assignment: list[0] = 50;
    int& operator[](std::size_t index) {
        if (index >= m_items.size()) {
            throw std::out_of_range("IntList index out of bounds!");
        }
        return m_items[index];
    }

    // Const: allows reading on const objects: int val = constList[0];
    const int& operator[](std::size_t index) const {
        if (index >= m_items.size()) {
            throw std::out_of_range("IntList index out of bounds!");
        }
        return m_items[index];
    }
};

int main() {
    IntList list;
    list[0] = 42;
    list[1] = 84;

    std::cout << "list[0]: " << list[0] << ", list[1]: " << list[1] << "\n";

    const IntList& constRef = list;
    std::cout << "Read via const: " << constRef[0] << "\n";
    return 0;
}
```

---

## 🛸 Comparison with C++20 Spaceship Operator (`<=>`)

In C++20, writing comparison operators is as simple as asking the compiler to generate default member-wise comparisons:

```cpp
#include <iostream>
#include <compare>

struct EmployeeRecord {
    int id;
    double salary;

    // Compiler automatically synthesizes ==, !=, <, <=, >, >=
    auto operator<=>(const EmployeeRecord&) const = default;
};

int main() {
    EmployeeRecord e1{101, 65000.0};
    EmployeeRecord e2{102, 72000.0};

    std::cout << std::boolalpha;
    std::cout << "e1 < e2 : " << (e1 < e2) << "\n";
    std::cout << "e1 == e2: " << (e1 == e2) << "\n";
    return 0;
}
```
