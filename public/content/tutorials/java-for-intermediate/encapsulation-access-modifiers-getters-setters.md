---
id: encapsulation-access-modifiers-getters-setters
slug: encapsulation-access-modifiers-getters-setters
course: java-for-intermediate
chapter: 1: Object-Oriented Programming Essentials
topic: "Encapsulation: Access Modifiers (private, default, protected, public) and Getters/Setters"
difficulty: Intermediate
readingTime: 13
order: 4
keywords: ["encapsulation java","access modifiers","private","default package-private","protected","public","getters setters"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛡️ Encapsulation and Java's 4 Access Modifiers

## Introduction
**Encapsulation** is the OOP mechanism of bundling data (attributes) and methods that manipulate that data into a single unit while restricting direct outside access. In Java, this is governed by **4 Access Levels**.

---

## 📊 The 4 Access Modifiers Compared

| Modifier | Inside Same Class | Inside Same Package | Subclasses (Different Package) | World (Everywhere) |
|---|---|---|---|---|
| **`public`** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **`protected`**| ✅ Yes | ✅ Yes | ✅ Yes (via inheritance) | ❌ No |
| *(default / package-private)* | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **`private`** | ✅ Yes | ❌ No | ❌ No | ❌ No |

---

## 🔒 Implementing Robust Getters and Setters

```java
public class BankAccount {
    // Private state prevents direct tampering:
    private String accountNumber;
    private double balance;

    public BankAccount(String accNum, double initialDeposit) {
        this.accountNumber = accNum;
        setBalance(initialDeposit); // Use setter for validation
    }

    // Getter
    public double getBalance() {
        return this.balance;
    }

    // Setter with business invariant validation:
    public void setBalance(double amount) {
        if (amount >= 0.0) {
            this.balance = amount;
        } else {
            System.err.println("[ERROR]: Balance cannot be negative!");
        }
    }

    public void deposit(double amount) {
        if (amount > 0.0) {
            this.balance += amount;
            System.out.printf("Deposited ₹%.2f. New Balance: ₹%.2f%n", amount, this.balance);
        }
    }
}
```
