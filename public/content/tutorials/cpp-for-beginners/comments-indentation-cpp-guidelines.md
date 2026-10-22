---
id: comments-indentation-cpp-guidelines
slug: comments-indentation-cpp-guidelines
course: cpp-for-beginners
chapter: 1: Modern C++ Setup & Fundamentals
topic: "Comments, Indentation, and Modern C++ Coding Guidelines"
difficulty: Beginner
readingTime: 10
order: 5
keywords: ["cpp guidelines","clean code","doxygen comments","naming conventions","core guidelines"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📐 Comments, Indentation, and Modern C++ Coding Guidelines

## Introduction
Writing working C++ code is only half the battle. Production software must be maintainable, readable, and structured according to established engineering conventions like the **C++ Core Guidelines** (championed by Bjarne Stroustrup and Herb Sutter).

---

## 📝 Commenting Best Practices

C++ provides two comment styles:
1. Single-line comments: `//`
2. Multi-line block comments: `/* ... */`

```cpp
// ❌ BAD: Explaining what the code trivially does
int count = 0; // set count to zero

// ✅ GOOD: Explaining the *why*, business logic, or edge cases
// We initialize retry attempts to 0 to adhere to MSK API failover policy
int retryAttempts = 0;
```

### Doxygen Documentation Comments:
```cpp
/**
 * @brief Computes the compound annual growth rate (CAGR).
 * @param beginningValue Initial portfolio valuation (> 0).
 * @param endingValue Final portfolio valuation.
 * @param years Total elapsed periods in fractional years.
 * @return Double representing the annualized growth rate.
 */
double calculateCAGR(double beginningValue, double endingValue, double years);
```

---

## 🏛️ Modern C++ Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Variables & Functions | `camelCase` or `snake_case` | `studentAge` or `student_age` |
| Classes & Structs | `PascalCase` | `StudentManager`, `BankAccount` |
| Constants & `constexpr` | `UPPER_SNAKE_CASE` or `kPascalCase` | `MAX_BUFFER_SIZE`, `kMaxRetries` |
| Template Parameters | Single capital letters or `PascalCase` | `T`, `ContainerType` |

---

## 💡 The C++ Core Guidelines Philosophy
- **F.21**: Prefer returning values directly rather than using "out" pointer parameters.
- **ES.20**: Always initialize an object upon declaration.
- **Con.1**: By default, make objects `const` unless they genuinely require mutation.
