---
id: project-4-console-atm-simulator
slug: project-4-console-atm-simulator
course: cpp-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 4: Text-Based Console ATM Simulator"
difficulty: Beginner
readingTime: 16
order: 36
keywords: ["atm simulator","banking app","state management","transaction history","input validation"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏧 Capstone Project 4: Text-Based Console ATM Simulator

## Introduction
The **Console ATM Simulator** is our capstone project for the C++ for Beginners curriculum. It integrates variables, conditional authentication, loops, functions, references, arrays, formatted streams, and error recovery into a secure simulated banking system.

---

## 🎯 Project Features
1. PIN Authentication with maximum retry lockout (3 attempts).
2. Balance inquiry, Cash Deposits, and Cash Withdrawals with minimum balance rules.
3. Transaction log tracking recent deposits and withdrawals.
4. Clean state management.

---

## 💻 Full Source Code

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
#include <limits>

struct ATMState {
    double balance = 25000.0; // Initial balance in INR
    const int correctPin = 5432;
    std::vector<std::string> transactionHistory;
};

void logTransaction(ATMState& state, const std::string& note) {
    state.transactionHistory.push_back(note);
}

bool authenticateUser(const ATMState& state) {
    int enteredPin = 0;
    int attempts = 0;
    constexpr int MAX_ATTEMPTS = 3;

    while (attempts < MAX_ATTEMPTS) {
        std::cout << "Enter your 4-digit ATM PIN: ";
        if (std::cin >> enteredPin) {
            if (enteredPin == state.correctPin) {
                std::cout << "✅ PIN Verified Successfully!\n";
                return true;
            }
        }
        ++attempts;
        std::cerr << "❌ Incorrect PIN! Attempts remaining: " << (MAX_ATTEMPTS - attempts) << "\n";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }

    std::cerr << "🚨 CARD BLOCKED: Too many incorrect attempts! Contact branch manager.\n";
    return false;
}

int main() {
    ATMState atm;

    std::cout << "========================================\n";
    std::cout << "      MSK DIGITAL BANKING ATM PORTAL    \n";
    std::cout << "========================================\n";

    if (!authenticateUser(atm)) {
        return 1;
    }

    bool sessionActive = true;
    while (sessionActive) {
        std::cout << "\n----------------------------------------\n";
        std::cout << "1. Check Account Balance\n";
        std::cout << "2. Deposit Cash\n";
        std::cout << "3. Withdraw Cash\n";
        std::cout << "4. Mini-Statement (History)\n";
        std::cout << "5. Eject Card & Exit\n";
        std::cout << "Choose option (1-5): ";

        int choice = 0;
        if (!(std::cin >> choice)) {
            std::cout << "Invalid input. Try again.\n";
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            continue;
        }

        switch (choice) {
            case 1: {
                std::cout << "💰 Current Account Balance: ₹" << std::fixed << std::setprecision(2) << atm.balance << "\n";
                break;
            }
            case 2: {
                double depositAmount = 0.0;
                std::cout << "Enter amount to deposit: ₹";
                if (std::cin >> depositAmount && depositAmount > 0) {
                    atm.balance += depositAmount;
                    logTransaction(atm, "Deposited: +₹" + std::to_string(static_cast<int>(depositAmount)));
                    std::cout << "✅ Successfully deposited ₹" << depositAmount << ". New Balance: ₹" << atm.balance << "\n";
                } else {
                    std::cout << "[ERROR]: Invalid deposit amount.\n";
                }
                break;
            }
            case 3: {
                double withdrawAmount = 0.0;
                std::cout << "Enter amount to withdraw: ₹";
                if (std::cin >> withdrawAmount && withdrawAmount > 0) {
                    if (withdrawAmount > atm.balance) {
                        std::cerr << "[ERROR]: Insufficient funds! Available balance: ₹" << atm.balance << "\n";
                    } else if ((atm.balance - withdrawAmount) < 1000.0) {
                        std::cerr << "[ERROR]: Withdrawal denied. Must maintain minimum balance of ₹1000.0\n";
                    } else {
                        atm.balance -= withdrawAmount;
                        logTransaction(atm, "Withdrew: -₹" + std::to_string(static_cast<int>(withdrawAmount)));
                        std::cout << "💵 Please collect your cash: ₹" << withdrawAmount << ". New Balance: ₹" << atm.balance << "\n";
                    }
                } else {
                    std::cout << "[ERROR]: Invalid withdrawal amount.\n";
                }
                break;
            }
            case 4: {
                std::cout << "\n📜 --- Mini-Statement (Recent Activity) ---\n";
                if (atm.transactionHistory.empty()) {
                    std::cout << "No transactions in this session.\n";
                } else {
                    for (const auto& entry : atm.transactionHistory) {
                        std::cout << " • " << entry << "\n";
                    }
                }
                break;
            }
            case 5: {
                std::cout << "\n💳 Card Ejected. Thank you for banking with MSK Institute Digital Bank!\n";
                sessionActive = false;
                break;
            }
            default:
                std::cout << "Invalid choice! Please select 1 through 5.\n";
                break;
        }
    }

    return 0;
}
```

---

## 🎓 Next Steps in Your C++ Journey
Congratulations on mastering **C++ for Beginners**! You have built a solid foundation in Modern C++ syntax, memory allocation, references, arrays, and standard I/O streams. Proceed next to **C++ for Intermediate** to master Object-Oriented Programming (Classes, Inheritance, Polymorphism) and Dynamic Memory (RAII, Smart Pointers).
