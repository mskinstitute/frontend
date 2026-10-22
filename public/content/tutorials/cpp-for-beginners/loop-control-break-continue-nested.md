---
id: loop-control-break-continue-nested
slug: loop-control-break-continue-nested
course: cpp-for-beginners
chapter: 5: Loops and Iterations
topic: "Loop Control: break, continue, and Nested Iteration Patterns"
difficulty: Beginner
readingTime: 12
order: 23
keywords: ["break statement","continue statement","nested loops","loop patterns","matrix traversal"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛑 Loop Control: break, continue, and Nested Iteration Patterns

## Introduction
Loop execution can be dynamically altered using **`break`** (premature exit) and **`continue`** (skipping to the next iteration). These controls are especially important in search algorithms and 2D grid matrix traversals.

---

## ⚡ The `break` vs `continue` Statements

- **`break`**: Terminate the innermost enclosing loop immediately.
- **`continue`**: Skip the remainder of the current iteration and jump to the loop update step.

```cpp
#include <iostream>

int main() {
    std::cout << "Odd numbers between 1 and 10 (skipping 5):\n";
    for (int i = 1; i <= 10; ++i) {
        if (i % 2 == 0) {
            continue; // Skip even numbers
        }
        if (i == 5) {
            continue; // Skip number 5
        }
        std::cout << i << " ";
    }
    std::cout << "\n";
    return 0;
}
```

---

## 🔲 Nested Loops & 2D Grid Pattern Generation

```cpp
#include <iostream>
#include <iomanip>

int main() {
    std::cout << "=== Multiplication Grid (1 to 5) ===\n";
    for (int row = 1; row <= 5; ++row) {
        for (int col = 1; col <= 5; ++col) {
            std::cout << std::setw(4) << (row * col);
        }
        std::cout << "\n";
    }
    return 0;
}
```

### Output:
```text
=== Multiplication Grid (1 to 5) ===
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```
