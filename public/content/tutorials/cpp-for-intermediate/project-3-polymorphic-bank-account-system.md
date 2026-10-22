---
id: project-3-polymorphic-bank-account-system
slug: project-3-polymorphic-bank-account-system
course: cpp-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 3: Bank Account Class System with Polymorphic Savings/Checking Accounts"
difficulty: Intermediate
readingTime: 16
order: 32
keywords: ["polymorphic bank account","abstract base class","virtual functions project","savings account","checking account"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏦 Portfolio Project 3: Polymorphic Bank Account System

## Introduction
In this capstone portfolio project for the **C++ for Intermediate** track, you will build an **Enterprise Banking Core** utilizing runtime polymorphism, abstract interfaces, inheritance, and dynamic dispatch.

---

## 🎯 Architecture
```text
                  [ Base Class: BankAccount ]
                  (Abstract: virtual calculateInterest() = 0)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 [ SavingsAccount ]                      [ CheckingAccount ]
 (Interest rate: 4.5% p.a.)              (Overdraft limit: ₹10,000)
```

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <iomanip>

// Abstract Base Class
class BankAccount {
protected:
    std::string m_accountNumber;
    std::string m_holderName;
    double m_balance;

public:
    BankAccount(const std::string& accNum, const std::string& name, double balance)
        : m_accountNumber(accNum), m_holderName(name), m_balance(balance) {}

    virtual ~BankAccount() = default; // Crucial Virtual Destructor

    virtual void deposit(double amount) {
        if (amount > 0.0) {
            m_balance += amount;
            std::cout << "Deposited ₹" << amount << " into " << m_accountNumber << "\n";
        }
    }

    virtual bool withdraw(double amount) = 0; // Pure Virtual Method
    virtual void applyInterestOrCharges() = 0; // Pure Virtual Method

    virtual void displayInfo() const {
        std::cout << "Acc: " << m_accountNumber << " | Holder: " << m_holderName 
                  << " | Balance: ₹" << std::fixed << std::setprecision(2) << m_balance;
    }

    double getBalance() const { return m_balance; }
};

// Concrete Subclass 1: Savings Account
class SavingsAccount : public BankAccount {
private:
    double m_annualInterestRate; // e.g. 0.045 for 4.5%

public:
    SavingsAccount(const std::string& accNum, const std::string& name, double balance, double interestRate)
        : BankAccount(accNum, name, balance), m_annualInterestRate(interestRate) {}

    bool withdraw(double amount) override {
        if (amount > 0.0 && (m_balance - amount) >= 1000.0) {
            m_balance -= amount;
            std::cout << "Withdrew ₹" << amount << " from Savings Acc " << m_accountNumber << "\n";
            return true;
        }
        std::cerr << "[ERROR]: Minimum balance of ₹1000 required for Savings Account.\n";
        return false;
    }

    void applyInterestOrCharges() override {
        double interest = m_balance * (m_annualInterestRate / 12.0); // Monthly interest
        m_balance += interest;
        std::cout << "Credited monthly interest: +₹" << interest << " to " << m_accountNumber << "\n";
    }

    void displayInfo() const override {
        BankAccount::displayInfo();
        std::cout << " [Savings - Rate: " << (m_annualInterestRate * 100.0) << "%]\n";
    }
};

// Concrete Subclass 2: Checking Account with Overdraft Protection
class CheckingAccount : public BankAccount {
private:
    double m_overdraftLimit;

public:
    CheckingAccount(const std::string& accNum, const std::string& name, double balance, double overdraftLimit)
        : BankAccount(accNum, name, balance), m_overdraftLimit(overdraftLimit) {}

    bool withdraw(double amount) override {
        if (amount > 0.0 && (m_balance + m_overdraftLimit) >= amount) {
            m_balance -= amount;
            std::cout << "Withdrew ₹" << amount << " from Checking Acc " << m_accountNumber << "\n";
            return true;
        }
        std::cerr << "[ERROR]: Overdraft limit (₹" << m_overdraftLimit << ") exceeded!\n";
        return false;
    }

    void applyInterestOrCharges() override {
        if (m_balance < 0.0) {
            double penalty = 250.0; // Maintenance charge for negative overdraft balance
            m_balance -= penalty;
            std::cout << "Applied negative balance overdraft maintenance fee: -₹" << penalty << "\n";
        }
    }

    void displayInfo() const override {
        BankAccount::displayInfo();
        std::cout << " [Checking - Overdraft Limit: ₹" << m_overdraftLimit << "]\n";
    }
};

int main() {
    std::cout << "=== MSK Institute Digital Banking Core ===\n";

    // Polymorphic collection using std::unique_ptr
    std::vector<std::unique_ptr<BankAccount>> accounts;

    accounts.push_back(std::make_unique<SavingsAccount>("SB-1001", "Rohan Mehta", 25000.0, 0.045));
    accounts.push_back(std::make_unique<CheckingAccount>("CA-9002", "CodeWork Technologies", 15000.0, 10000.0));

    // Process all accounts through uniform polymorphic base interface:
    for (const auto& acc : accounts) {
        acc->displayInfo();
        acc->deposit(5000.0);
        acc->withdraw(22000.0);
        acc->applyInterestOrCharges();
        acc->displayInfo();
        std::cout << "------------------------------------------\n";
    }

    return 0;
}
```

---

## 🎓 Next Steps in Your C++ Journey
Congratulations on mastering **C++ for Intermediate**! You have unlocked classes, encapsulation, constructors, destructors, RAII, copy semantics, operator overloading, polymorphism, the STL, exception handling, and file streams. Proceed next to **C++ for Advanced** to conquer templates, move semantics (rvalue references), smart pointers (`std::unique_ptr`, `std::shared_ptr`), and multithreading concurrency.
