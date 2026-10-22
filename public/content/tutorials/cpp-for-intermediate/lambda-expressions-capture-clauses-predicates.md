---
id: lambda-expressions-capture-clauses-predicates
slug: lambda-expressions-capture-clauses-predicates
course: cpp-for-intermediate
chapter: 5: STL Iterators & Modern Algorithms
topic: "Lambda Expressions: Syntax, Capture Clauses ([=], [&]), and Predicates"
difficulty: Intermediate
readingTime: 13
order: 24
keywords: ["lambda expressions","anonymous functions","capture clause","predicates","modern cpp"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚡ Lambda Expressions: Syntax, Capture Clauses, and Predicates

## Introduction
A **lambda expression** is an anonymous function object defined inline at the call site. Introduced in C++11 and refined in Modern C++, lambdas simplify working with STL algorithms.

---

## 🧩 Lambda Anatomy

```text
[ capture-clause ] ( parameters ) -> return-type {
    // Function body
};
```

---

## 🎒 The Capture Clause Demystified

The capture clause controls which variables from the enclosing outer scope are accessible inside the lambda:

| Capture Clause | Meaning |
|---|---|
| `[]` | **No captures**: Can only access parameters passed to the lambda |
| `[x]` | Captures variable `x` **by value (copy)** |
| `[&x]` | Captures variable `x` **by reference** |
| `[=]` | Captures **all** used outer variables **by value (copy)** |
| `[&]` | Captures **all** used outer variables **by reference** |

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> studentAges = {17, 19, 21, 16, 24, 18, 22};
    int votingAge = 18;

    // Capture 'votingAge' by value inside lambda predicate:
    int adultCount = std::count_if(studentAges.begin(), studentAges.end(), [votingAge](int age) {
        return age >= votingAge;
    });

    std::cout << "Adult Students (>= 18): " << adultCount << "\n";

    // Modifying external variable via reference capture:
    int totalYears = 0;
    std::for_each(studentAges.begin(), studentAges.end(), [&totalYears](int age) {
        totalYears += age;
    });

    std::cout << "Sum of ages: " << totalYears << "\n";
    return 0;
}
```
