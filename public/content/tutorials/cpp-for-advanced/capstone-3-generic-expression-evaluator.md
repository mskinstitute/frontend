---
id: capstone-3-generic-expression-evaluator
slug: capstone-3-generic-expression-evaluator
course: cpp-for-advanced
chapter: 6: Advanced Capstone Projects
topic: "Capstone 3: Custom Generic Expression Evaluator using Modern Templates"
difficulty: Advanced
readingTime: 17
order: 28
keywords: ["expression evaluator","generic templates","ast interpreter","modern c++ capstone","variant evaluation"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧮 Capstone Project 3: Generic Expression Evaluator

## Introduction
In this final capstone project for **C++ for Advanced**, you will build a **Generic Expression Tree Evaluator** using modern templates, `std::unique_ptr`, and polymorphic evaluation.

---

## 🎯 Architecture
```text
                  [ ExpressionNode<T> ] (Abstract Interface)
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 [ NumericLiteralNode<T> ]       [ BinaryOperatorNode<T> ]
 (Stores direct value)           (Left & Right unique_ptr operands)
```

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <memory>
#include <concepts>
#include <functional>

// Abstract Expression Interface
template <typename T>
requires std::is_arithmetic_v<T>
class ExpressionNode {
public:
    virtual ~ExpressionNode() = default;
    virtual T evaluate() const = 0;
};

// Concrete Terminal Node: Numeric Constant
template <typename T>
requires std::is_arithmetic_v<T>
class NumericNode : public ExpressionNode<T> {
private:
    T m_value;
public:
    explicit NumericNode(T val) : m_value(val) {}
    T evaluate() const override { return m_value; }
};

// Concrete Binary Operator Node (+, -, *, /)
template <typename T>
requires std::is_arithmetic_v<T>
class BinaryOpNode : public ExpressionNode<T> {
public:
    enum class Op { Add, Subtract, Multiply, Divide };

private:
    std::unique_ptr<ExpressionNode<T>> m_left;
    std::unique_ptr<ExpressionNode<T>> m_right;
    Op m_op;

public:
    BinaryOpNode(Op op, std::unique_ptr<ExpressionNode<T>> left, std::unique_ptr<ExpressionNode<T>> right)
        : m_op(op), m_left(std::move(left)), m_right(std::move(right)) {}

    T evaluate() const override {
        T lVal = m_left->evaluate();
        T rVal = m_right->evaluate();

        switch (m_op) {
            case Op::Add:      return lVal + rVal;
            case Op::Subtract: return lVal - rVal;
            case Op::Multiply: return lVal * rVal;
            case Op::Divide:   return (rVal != 0) ? (lVal / rVal) : 0;
        }
        return 0;
    }
};

int main() {
    std::cout << "=== MSK Generic AST Expression Evaluator ===\n";

    // Representing: (15 + 5) * (8 - 2)
    using Op = BinaryOpNode<double>::Op;

    auto expr = std::make_unique<BinaryOpNode<double>>(
        Op::Multiply,
        std::make_unique<BinaryOpNode<double>>(
            Op::Add,
            std::make_unique<NumericNode<double>>(15.0),
            std::make_unique<NumericNode<double>>(5.0)
        ),
        std::make_unique<BinaryOpNode<double>>(
            Op::Subtract,
            std::make_unique<NumericNode<double>>(8.0),
            std::make_unique<NumericNode<double>>(2.0)
        )
    );

    std::cout << "Expression: (15 + 5) * (8 - 2)\n";
    std::cout << "Evaluated Result: " << expr->evaluate() << "\n"; // Output: 120

    return 0;
}
```

---

## 🎓 Congratulations on Mastering C++!
You have completed the entire C++ curriculum at MSK Institute:
1. **C++ for Beginners**: Core syntax, iostream, references, arrays, and control flow.
2. **C++ for Intermediate**: Classes, encapsulation, inheritance, polymorphism, RAII, and the STL.
3. **C++ for Advanced**: Move semantics, smart pointers, templates, SFINAE, C++20 concepts, multithreading concurrency, and modern vocabulary types.
