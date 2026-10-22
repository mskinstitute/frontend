---
id: exception-handling-try-catch-throw
slug: exception-handling-try-catch-throw
course: cpp-for-intermediate
chapter: 6: Exception Handling & File Streams
topic: "Exception Handling with try, catch, and throw"
difficulty: Intermediate
readingTime: 12
order: 25
keywords: ["exception handling","try catch throw","runtime errors","stack unwinding","c++ exceptions"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛡️ Exception Handling with try, catch, and throw

## Introduction
Runtime errors (such as network timeouts, missing files, or out-of-range indices) must not cause software to abruptly terminate. C++ provides structured **exception handling** using `try`, `catch`, and `throw`.

---

## ⚡ The Try-Catch Architecture

```cpp
#include <iostream>
#include <string>

double divideCourseFees(double totalFee, int installments) {
    if (installments <= 0) {
        // Throw an exception when an unrecoverable condition occurs
        throw std::invalid_argument("Installment count must be greater than zero!");
    }
    return totalFee / installments;
}

int main() {
    try {
        std::cout << "2 Installments: ₹" << divideCourseFees(6000.0, 2) << "\n";
        
        // This will trigger an exception:
        std::cout << "0 Installments: ₹" << divideCourseFees(6000.0, 0) << "\n";
    } catch (const std::invalid_argument& ex) {
        std::cerr << "[CAUGHT ERROR]: " << ex.what() << "\n";
    } catch (const std::exception& ex) {
        std::cerr << "[STANDARD EXCEPTION]: " << ex.what() << "\n";
    } catch (...) {
        std::cerr << "[UNKNOWN CRITICAL ERROR CAUGHT]\n";
    }

    std::cout << "Program recovered and continuing execution cleanly.\n";
    return 0;
}
```

---

## 🌪️ Stack Unwinding & RAII Safety
When an exception is thrown, C++ unwinds the call stack frame by frame. **Every stack-allocated object between the throw site and the catch block has its destructor invoked automatically**. This guarantees that files are closed and locks released without manual cleanup code.
