---
id: overloading-arithmetic-operators
slug: overloading-arithmetic-operators
course: cpp-for-intermediate
chapter: 2: Copy Semantics & Operator Overloading
topic: "Overloading Arithmetic Operators (+, -, *, /)"
difficulty: Intermediate
readingTime: 13
order: 8
keywords: ["operator overloading","arithmetic operators","complex numbers","canonical operators","symmetric operators"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ➕ Overloading Arithmetic Operators (+, -, *, /)

## Introduction
Operator overloading allows user-defined classes (matrices, vectors, currency, fractions, complex numbers) to interact using natural mathematical syntax instead of verbose method calls like `a.add(b)`.

---

## 🏛️ Best Practice: Canonical Implementation Pattern

The most robust, idiomatic way to overload binary arithmetic operators is:
1. Implement the compound assignment operator (`+=`, `-=`) as a **member function**.
2. Implement the binary operator (`+`, `-`) as a non-member friend or standalone function implemented in terms of `+=`.

```cpp
#include <iostream>

class ComplexNumber {
public:
    double real = 0.0;
    double imag = 0.0;

    ComplexNumber(double r = 0.0, double i = 0.0) : real(r), imag(i) {}

    // 1. Compound assignment operator as member function
    ComplexNumber& operator+=(const ComplexNumber& rhs) {
        this->real += rhs.real;
        this->imag += rhs.imag;
        return *this;
    }

    ComplexNumber& operator-=(const ComplexNumber& rhs) {
        this->real -= rhs.real;
        this->imag -= rhs.imag;
        return *this;
    }

    void display() const {
        std::cout << real << " + " << imag << "i\n";
    }
};

// 2. Binary arithmetic operator implemented using +=
inline ComplexNumber operator+(ComplexNumber lhs, const ComplexNumber& rhs) {
    lhs += rhs; // Modifies local lhs copy and returns it
    return lhs;
}

inline ComplexNumber operator-(ComplexNumber lhs, const ComplexNumber& rhs) {
    lhs -= rhs;
    return lhs;
}

int main() {
    ComplexNumber c1(3.0, 4.0);
    ComplexNumber c2(1.5, 2.5);

    ComplexNumber sum = c1 + c2; // Clean mathematical expression!
    ComplexNumber diff = c1 - c2;

    std::cout << "Sum:  "; sum.display();
    std::cout << "Diff: "; diff.display();

    return 0;
}
```

---

## ⚠️ Operator Overloading Golden Rules
1. Never change the natural meaning of an operator (do not make `+` perform subtraction).
2. You cannot invent new operator tokens (like `**` or `<->`).
3. Precedence and associativity rules cannot be altered.
