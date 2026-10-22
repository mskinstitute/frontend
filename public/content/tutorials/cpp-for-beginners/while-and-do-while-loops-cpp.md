---
id: while-and-do-while-loops-cpp
slug: while-and-do-while-loops-cpp
course: cpp-for-beginners
chapter: 5: Loops and Iterations
topic: "while and do-while Loops"
difficulty: Beginner
readingTime: 11
order: 20
keywords: ["while loop","do-while loop","condition-controlled loops","exit-controlled loop"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 while and do-while Loops

## Introduction
Loops repeat a code block until a condition evaluates to `false`. C++ provides entry-controlled loops (`while`) and exit-controlled loops (`do-while`).

---

## 🔁 The `while` Loop (Entry-Controlled)

The test expression is checked **before** entering the loop body. If the condition is initially `false`, the body never executes:

```cpp
#include <iostream>

int main() {
    int counter = 1;
    int sum = 0;

    while (counter <= 10) {
        sum += counter;
        ++counter;
    }

    std::cout << "Sum of numbers 1 to 10 is: " << sum << "\n";
    return 0;
}
```

---

## 🔁 The `do-while` Loop (Exit-Controlled)

The test expression is checked **after** executing the body. Therefore, the body is **guaranteed to run at least once**:

```cpp
#include <iostream>

int main() {
    int pin = 0;
    constexpr int CORRECT_PIN = 1234;

    do {
        std::cout << "Enter 4-digit Security PIN: ";
        std::cin >> pin;
        
        if (pin != CORRECT_PIN) {
            std::cout << "Incorrect PIN. Try again.\n";
        }
    } while (pin != CORRECT_PIN);

    std::cout << "Access Granted! Welcome to MSK Banking Portal.\n";
    return 0;
}
```

---

## 💡 Summary Comparison

| Loop Type | Condition Check | Minimum Executions | Best Use Case |
|---|---|---|---|
| `while` | Entry (Before body) | 0 times | When processing streams, iterating data buffers |
| `do-while` | Exit (After body) | 1 time | Console menus, input re-prompts, games |
