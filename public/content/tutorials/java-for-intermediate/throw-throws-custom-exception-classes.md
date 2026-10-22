---
id: throw-throws-custom-exception-classes
slug: throw-throws-custom-exception-classes
course: java-for-intermediate
chapter: 4: Exception Handling & Robustness
topic: "Throwing Exceptions with throw, throws, and Creating Custom Exception Classes"
difficulty: Intermediate
readingTime: 14
order: 19
keywords: ["throw keyword","throws keyword","custom exceptions","domain exceptions","user defined exception"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚨 Throwing Exceptions and Creating Custom Exception Classes

## Introduction
To signal business violations (such as insufficient bank account balance or invalid course capacity), you create **custom domain exceptions** inheriting from `Exception` (checked) or `RuntimeException` (unchecked).

---

## 💻 Creating and Throwing a Custom Exception

```java
// Custom Domain Exception
class InsufficientFundsException extends Exception {
    private double currentBalance;
    private double attemptedWithdrawal;

    public InsufficientFundsException(double balance, double withdrawal) {
        super(String.format("Withdrawal of ₹%.2f exceeds balance of ₹%.2f", withdrawal, balance));
        this.currentBalance = balance;
        this.attemptedWithdrawal = withdrawal;
    }

    public double getDeficit() {
        return attemptedWithdrawal - currentBalance;
    }
}

public class BankService {
    public static void withdraw(double balance, double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(balance, amount); // Explicitly throw!
        }
        System.out.printf("Successfully withdrew ₹%.2f%n", amount);
    }

    public static void main(String[] args) {
        try {
            withdraw(5000.0, 7500.0);
        } catch (InsufficientFundsException e) {
            System.err.println("[FAILED TRANSACTION]: " + e.getMessage());
            System.err.printf("Shortfall amount: ₹%.2f%n", e.getDeficit());
        }
    }
}
```
