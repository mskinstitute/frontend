---
id: method-syntax-return-types-parameters
slug: method-syntax-return-types-parameters
course: java-for-beginners
chapter: 7: Methods & Modular Programming
topic: "Method Syntax, Return Types, and Formal Parameters"
difficulty: Beginner
readingTime: 12
order: 30
keywords: ["java methods","method declaration","parameters","return types","modular programming"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧩 Method Syntax, Return Types, and Parameters in Java

## Introduction
A method is a block of reusable code that runs when called. Methods facilitate code reuse and modular decomposition.

---

## 🏛️ Method Signature Structure

```text
modifier returnType methodName(parameterList) {
    // Method body
    return value; // (Omitted if void)
}
```

```java
public class MethodBasics {
    // Static helper method
    public static double calculateTotalFee(double basePrice, double gstRate) {
        double tax = basePrice * (gstRate / 100.0);
        return basePrice + tax;
    }

    public static void main(String[] args) {
        double finalPayable = calculateTotalFee(3499.0, 18.0);
        System.out.printf("Total Fee with 18%% GST: ₹%.2f%n", finalPayable);
    }
}
```
