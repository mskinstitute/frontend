---
id: abstract-classes-vs-concrete-classes
slug: abstract-classes-vs-concrete-classes
course: java-for-intermediate
chapter: 2: Inheritance, Polymorphism & Abstraction
topic: "Abstract Classes vs Concrete Classes"
difficulty: Intermediate
readingTime: 13
order: 9
keywords: ["abstract class java","concrete class","abstract methods","partial abstraction","oop design"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📐 Abstract Classes vs Concrete Classes

## Introduction
An **abstract class** (declared with `abstract`) represents a partial blueprint. It can contain both implemented methods with code bodies and **abstract methods** (methods without a body) that subclasses are forced to implement.

---

## 💻 Abstract Class Architecture

```java
abstract class BankAccount {
    protected String accountNumber;
    protected double balance;

    public BankAccount(String accNum, double balance) {
        this.accountNumber = accNum;
        this.balance = balance;
    }

    // Concrete method: Reusable shared behavior
    public void deposit(double amount) {
        if (amount > 0) this.balance += amount;
    }

    // Abstract method: Every subclass MUST define its own interest formula!
    public abstract void applyMonthlyInterest();

    public double getBalance() { return balance; }
}

class SavingsAccount extends BankAccount {
    public SavingsAccount(String accNum, double balance) {
        super(accNum, balance);
    }

    @Override
    public void applyMonthlyInterest() {
        double interest = balance * (0.045 / 12.0); // 4.5% annual interest
        balance += interest;
        System.out.printf("Credited Savings Interest: ₹%.2f%n", interest);
    }
}

public class AbstractDemo {
    public static void main(String[] args) {
        // BankAccount acc = new BankAccount(); // 💥 Compiler Error: Cannot instantiate abstract class!
        SavingsAccount sa = new SavingsAccount("MSK-1001", 50000.0);
        sa.applyMonthlyInterest();
    }
}
```
