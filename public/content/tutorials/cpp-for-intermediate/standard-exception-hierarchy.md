---
id: standard-exception-hierarchy
slug: standard-exception-hierarchy
course: cpp-for-intermediate
chapter: 6: Exception Handling & File Streams
topic: "Standard Exception Hierarchy (std::exception, std::runtime_error)"
difficulty: Intermediate
readingTime: 12
order: 26
keywords: ["std::exception","std::runtime_error","std::logic_error","custom exception","what method"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏛️ The Standard Exception Hierarchy & Custom Exceptions

## Introduction
All standard C++ exception classes inherit from **`std::exception`** defined in **`<stdexcept>`**. Catching `const std::exception&` allows your program to intercept any standard error polymorphicly.

---

## 🌲 Standard Exception Hierarchy

```text
                      std::exception
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
  std::logic_error                      std::runtime_error
  (Violations of program logic)         (Unforeseen runtime conditions)
  ├── invalid_argument                  ├── range_error
  ├── out_of_range                      ├── overflow_error
  └── length_error                      └── system_error
```

---

## 💻 Authoring Custom Exception Classes

```cpp
#include <iostream>
#include <stdexcept>
#include <string>

// Custom domain exception inheriting from std::runtime_error
class InsufficientFundsException : public std::runtime_error {
private:
    double m_attemptedWithdrawal;
    double m_currentBalance;

public:
    InsufficientFundsException(double attempted, double balance)
        : std::runtime_error("Withdrawal exceeds available account balance!"),
          m_attemptedWithdrawal(attempted),
          m_currentBalance(balance) {}

    void printFinancialSummary() const {
        std::cerr << "[AUDIT]: Attempted ₹" << m_attemptedWithdrawal 
                  << " | Current Balance: ₹" << m_currentBalance << "\n";
    }
};

void performTransaction(double balance, double withdrawal) {
    if (withdrawal > balance) {
        throw InsufficientFundsException(withdrawal, balance);
    }
    std::cout << "Transaction successful. Remaining: ₹" << (balance - withdrawal) << "\n";
}

int main() {
    try {
        performTransaction(5000.0, 7500.0);
    } catch (const InsufficientFundsException& ex) {
        std::cerr << "Caught: " << ex.what() << "\n";
        ex.printFinancialSummary();
    }
    return 0;
}
```
