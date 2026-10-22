---
id: package-scope-information-hiding
slug: package-scope-information-hiding
course: java-for-intermediate
chapter: 3: Packages, Access Control & Enums
topic: "Package Scope and Information Hiding"
difficulty: Intermediate
readingTime: 11
order: 12
keywords: ["package scope","package-private","information hiding","encapsulation","internal classes"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🙈 Package Scope and Information Hiding in Java

## Introduction
When a class member has no access modifier (omitting `public`, `private`, or `protected`), it has **package-private (default)** access: it is visible to all classes inside the same package, but completely hidden from the outside world.

---

## 🛡️ Clean Architectural Boundary

```text
Package: in.mskinstitute.banking.internal
├── TransactionEngine.java (package-private: helper class hidden from outside)
└── AccountManager.java    (public: official public interface exposed to clients)
```

```java
// Package-private class: accessible ONLY within this package
class InternalTaxCalculator {
    static double calculateGst(double amount) {
        return amount * 0.18;
    }
}

// Public class: Client interface
public class FeeManager {
    public double getNetFee(double baseFee) {
        return baseFee + InternalTaxCalculator.calculateGst(baseFee);
    }
}
```
