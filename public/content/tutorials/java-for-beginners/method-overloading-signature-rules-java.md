---
id: method-overloading-signature-rules-java
slug: method-overloading-signature-rules-java
course: java-for-beginners
chapter: 7: Methods & Modular Programming
topic: "Method Overloading and Signature Rules"
difficulty: Beginner
readingTime: 12
order: 32
keywords: ["method overloading","compile time polymorphism","method signature","overload rules"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🤹 Method Overloading and Signature Rules in Java

## Introduction
**Method Overloading** allows multiple methods in the same class to share the same name with different parameter lists (different types, number of parameters, or parameter order).

---

## 💻 Overloading Demonstration

```java
public class Calculator {
    // 1. Two ints
    public static int add(int a, int b) {
        return a + b;
    }

    // 2. Two doubles
    public static double add(double a, double b) {
        return a + b;
    }

    // 3. Three ints
    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    public static void main(String[] args) {
        System.out.println("Sum ints:    " + add(10, 20));
        System.out.println("Sum doubles: " + add(5.5, 4.2));
        System.out.println("Sum 3 ints:  " + add(1, 2, 3));
    }
}
```

---

## ⚠️ Important Constraint
**Return type alone does NOT count towards method overloading!**
If two methods have identical names and identical parameter types but different return types, the compiler halts with an error.
