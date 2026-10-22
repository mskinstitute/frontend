---
id: member-variables-and-methods
slug: member-variables-and-methods
course: cpp-for-intermediate
chapter: 1: Classes & Object-Oriented Fundamentals
topic: "Member Variables and Member Methods"
difficulty: Intermediate
readingTime: 12
order: 2
keywords: ["member variables","member methods","getters and setters","in-class definition","scope resolution"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚙️ Member Variables and Member Methods

## Introduction
A class binds state (data) and behavior (functions) into a unified type. Understanding how to organize declarations in header files (`.h`/`.hpp`) and method implementations in source files (`.cpp`) using the **scope resolution operator (`::`)** is fundamental to C++ project architecture.

---

## 🏛️ Separating Declaration from Definition

```cpp
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string m_accountHolder;
    std::string m_accountNumber;
    double m_balance;

public:
    // Method Declarations (Prototypes)
    void initialize(const std::string& holder, const std::string& accNum, double initialDeposit);
    void deposit(double amount);
    bool withdraw(double amount);
    double getBalance() const;
    void printStatement() const;
};

// Method Definitions using Class::Method syntax
void BankAccount::initialize(const std::string& holder, const std::string& accNum, double initialDeposit) {
    m_accountHolder = holder;
    m_accountNumber = accNum;
    m_balance = (initialDeposit >= 0.0) ? initialDeposit : 0.0;
}

void BankAccount::deposit(double amount) {
    if (amount > 0.0) {
        m_balance += amount;
        std::cout << "Deposited ₹" << amount << " into " << m_accountNumber << "\n";
    }
}

bool BankAccount::withdraw(double amount) {
    if (amount > 0.0 && amount <= m_balance) {
        m_balance -= amount;
        std::cout << "Withdrew ₹" << amount << " from " << m_accountNumber << "\n";
        return true;
    }
    std::cerr << "[ERROR]: Withdrawal denied. Insufficient funds or invalid amount.\n";
    return false;
}

double BankAccount::getBalance() const {
    return m_balance;
}

void BankAccount::printStatement() const {
    std::cout << "Holder: " << m_accountHolder << " | Acc: " << m_accountNumber 
              << " | Balance: ₹" << m_balance << "\n";
}

int main() {
    BankAccount account;
    account.initialize("Priya Verma", "MSK-SB-8001", 15000.0);
    account.deposit(5000.0);
    account.withdraw(3000.0);
    account.printStatement();
    return 0;
}
```

---

## 💡 Naming Conventions for Member Variables
To immediately distinguish class member fields from local variables and function parameters, popular engineering conventions include:
- Prefix with `m_`: `m_balance`, `m_accountHolder` (Google / LLVM style)
- Suffix with trailing underscore: `balance_`, `account_holder_` (C++ Core Guidelines)
