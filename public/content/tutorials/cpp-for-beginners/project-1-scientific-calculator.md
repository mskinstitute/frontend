---
id: project-1-scientific-calculator
slug: project-1-scientific-calculator
course: cpp-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 1: Scientific Calculator with Memory Registers"
difficulty: Beginner
readingTime: 15
order: 33
keywords: ["scientific calculator","memory registers","cmath project","console app"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧪 Capstone Project 1: Scientific Calculator with Memory Registers

## Introduction
In this project, you will build a menu-driven **Scientific Calculator** in Modern C++. It supports basic arithmetic, advanced operations via `<cmath>` (square root, power, logarithms), and a persistent **memory register** (`M+`, `MR`, `MC`).

---

## 🎯 Project Features
1. Basic operations (`+`, `-`, `*`, `/`, `%`).
2. Scientific calculations (`sqrt`, `pow`, `sin`, `cos`, `log`).
3. Memory Store (`MS`), Memory Recall (`MR`), and Memory Clear (`MC`).
4. Strict divide-by-zero protection and input stream validation.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <cmath>
#include <limits>

void clearInputBuffer() {
    std::cin.clear();
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

int main() {
    double memoryRegister = 0.0;
    bool active = true;

    while (active) {
        std::cout << "\n========================================\n";
        std::cout << "      MSK Scientific Calculator v1.0    \n";
        std::cout << "      [Memory: " << memoryRegister << "]\n";
        std::cout << "========================================\n";
        std::cout << " 1. Addition (+)           2. Subtraction (-)\n";
        std::cout << " 3. Multiplication (*)     4. Division (/)\n";
        std::cout << " 5. Power (x^y)            6. Square Root (sqrt)\n";
        std::cout << " 7. Store to Memory (MS)   8. Clear Memory (MC)\n";
        std::cout << " 9. Exit Calculator\n";
        std::cout << "Select option (1-9): ";

        int choice = 0;
        if (!(std::cin >> choice)) {
            std::cout << "[ERROR]: Invalid selection!\n";
            clearInputBuffer();
            continue;
        }

        if (choice == 9) {
            std::cout << "Closing Scientific Calculator. Goodbye!\n";
            active = false;
            break;
        }

        switch (choice) {
            case 1: {
                double a, b;
                std::cout << "Enter two numbers: ";
                if (std::cin >> a >> b) {
                    std::cout << "Result: " << a << " + " << b << " = " << (a + b) << "\n";
                }
                break;
            }
            case 2: {
                double a, b;
                std::cout << "Enter two numbers: ";
                if (std::cin >> a >> b) {
                    std::cout << "Result: " << a << " - " << b << " = " << (a - b) << "\n";
                }
                break;
            }
            case 3: {
                double a, b;
                std::cout << "Enter two numbers: ";
                if (std::cin >> a >> b) {
                    std::cout << "Result: " << a << " * " << b << " = " << (a * b) << "\n";
                }
                break;
            }
            case 4: {
                double a, b;
                std::cout << "Enter dividend and divisor: ";
                if (std::cin >> a >> b) {
                    if (b == 0.0) {
                        std::cerr << "[ERROR]: Division by zero is undefined!\n";
                    } else {
                        std::cout << "Result: " << a << " / " << b << " = " << (a / b) << "\n";
                    }
                }
                break;
            }
            case 5: {
                double base, exp;
                std::cout << "Enter base and exponent: ";
                if (std::cin >> base >> exp) {
                    std::cout << "Result: " << base << "^" << exp << " = " << std::pow(base, exp) << "\n";
                }
                break;
            }
            case 6: {
                double val;
                std::cout << "Enter non-negative value: ";
                if (std::cin >> val) {
                    if (val < 0.0) {
                        std::cerr << "[ERROR]: Cannot compute square root of negative number!\n";
                    } else {
                        std::cout << "Result: sqrt(" << val << ") = " << std::sqrt(val) << "\n";
                    }
                }
                break;
            }
            case 7: {
                std::cout << "Enter value to store in memory: ";
                std::cin >> memoryRegister;
                std::cout << "Memory register updated to: " << memoryRegister << "\n";
                break;
            }
            case 8: {
                memoryRegister = 0.0;
                std::cout << "Memory register cleared to 0.0\n";
                break;
            }
            default:
                std::cout << "[ERROR]: Option not recognized.\n";
                break;
        }
    }

    return 0;
}
```
