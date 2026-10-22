---
id: operator-precedence-associativity-cpp
slug: operator-precedence-associativity-cpp
course: cpp-for-beginners
chapter: 3: Operators, Expressions & Math
topic: "Operator Precedence and Associativity Rules"
difficulty: Beginner
readingTime: 11
order: 15
keywords: ["operator precedence","associativity","order of operations","parentheses","cpp expressions"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🪜 Operator Precedence and Associativity Rules

## Introduction
When an expression contains multiple operators (such as `a + b * c`), C++ enforces strict **precedence** and **associativity** rules to determine evaluation order without ambiguity.

---

## 📊 Precedence Hierarchy (Highest to Lowest)

| Rank | Operators | Description | Associativity |
|---|---|---|---|
| 1 | `::` | Scope Resolution | Left-to-right |
| 2 | `()`, `[]`, `.`, `->`, `++` (postfix) | Function call, indexing, member access | Left-to-right |
| 3 | `!`, `~`, `++` (prefix), `--`, `sizeof` | Unary operations | Right-to-left |
| 4 | `*`, `/`, `%` | Multiplication, division, remainder | Left-to-right |
| 5 | `+`, `-` | Addition, subtraction | Left-to-right |
| 6 | `<=>` | Three-way comparison (Spaceship) | Left-to-right |
| 7 | `<`, `<=`, `>`, `>=` | Relational ordering | Left-to-right |
| 8 | `==`, `!=` | Equality comparisons | Left-to-right |
| 9 | `&&` | Logical AND | Left-to-right |
| 10 | `||` | Logical OR | Left-to-right |
| 11 | `? :` | Conditional (Ternary) | Right-to-left |
| 12 | `=`, `+=`, `-=`, `*=`, etc. | Assignment operators | Right-to-left |

---

## 💡 The "Parentheses Rule"
Never rely on obscure precedence rules when writing production software. Explicit parentheses eliminate ambiguity, make code instantly readable, and avoid subtle compiler bugs:

```cpp
// ❌ Ambiguous to human reviewers:
int result = a & mask != 0; // != has higher precedence than &, so it evaluates (mask != 0) first!

// ✅ Explicit and safe:
int result = (a & mask) != 0;
```
