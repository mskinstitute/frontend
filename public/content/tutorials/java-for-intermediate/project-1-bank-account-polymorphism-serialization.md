---
id: project-1-bank-account-polymorphism-serialization
slug: project-1-bank-account-polymorphism-serialization
course: java-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 1: Bank Account Management System with Polymorphism and Serialization"
difficulty: Intermediate
readingTime: 17
order: 30
keywords: ["bank project java","polymorphism project","serialization project","savings checking account"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏦 Portfolio Project 1: Polymorphic Bank Account with Binary Serialization

## Introduction
This project builds an Object-Oriented Banking Core with abstract accounts, concrete Savings/Checking accounts, and binary serialization for persistent data storage.

---

## 💻 Full Source Code

```java
import java.io.*;
import java.util.ArrayList;
import java.util.List;

abstract class Account implements Serializable {
    @Serial
    private static final long serialVersionUID = 101L;

    protected String accountNumber;
    protected String holderName;
    protected double balance;

    public Account(String accNum, String name, double bal) {
        this.accountNumber = accNum;
        this.holderName = name;
        this.balance = bal;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public abstract boolean withdraw(double amount);

    public void printSummary() {
        System.out.printf("Acc: %s | Holder: %-15s | Balance: ₹%,.2f%n", accountNumber, holderName, balance);
    }
}

class SavingsAccount extends Account {
    public SavingsAccount(String accNum, String name, double bal) {
        super(accNum, name, bal);
    }

    @Override
    public boolean withdraw(double amount) {
        if (amount > 0 && (balance - amount) >= 1000.0) {
            balance -= amount;
            return true;
        }
        return false;
    }
}

public class BankSystem {
    public static void main(String[] args) throws Exception {
        String dbFile = "bank_data.ser";
        List<Account> accounts = new ArrayList<>();

        accounts.add(new SavingsAccount("SB-101", "Aarav Sharma", 15000.0));
        accounts.add(new SavingsAccount("SB-102", "Priya Verma", 35000.0));

        // Serialize
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(dbFile))) {
            oos.writeObject(accounts);
            System.out.println("Saved " + accounts.size() + " accounts to disk.");
        }

        // Deserialize
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(dbFile))) {
            @SuppressWarnings("unchecked")
            List<Account> loaded = (List<Account>) ois.readObject();
            System.out.println("\n--- Loaded Accounts from Disk ---");
            loaded.forEach(Account::printSummary);
        }
    }
}
```
