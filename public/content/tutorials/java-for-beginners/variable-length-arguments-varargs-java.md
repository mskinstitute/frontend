---
id: variable-length-arguments-varargs-java
slug: variable-length-arguments-varargs-java
course: java-for-beginners
chapter: 7: Methods & Modular Programming
topic: "Variable-Length Arguments (Varargs ...)"
difficulty: Beginner
readingTime: 12
order: 33
keywords: ["varargs java","variable arguments","three dots syntax","ellipsis parameter"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🪄 Variable-Length Arguments (Varargs ...) in Java

## Introduction
Introduced in Java 5, **Varargs (variable-length arguments)** allow a method to accept zero, one, or multiple arguments of a specified type using the ellipsis syntax (`Type... args`).

---

## 💻 Varargs in Action

Under the hood, the compiler packs the arguments into an array:

```java
public class VarargsDemo {
    public static int calculateSum(int... numbers) {
        int sum = 0;
        for (int n : numbers) {
            sum += n;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println("Sum 0: " + calculateSum());
        System.out.println("Sum 2: " + calculateSum(10, 20));
        System.out.println("Sum 4: " + calculateSum(1, 2, 3, 4));
    }
}
```

---

## ⚠️ Varargs Rules
1. A method can have **at most one** varargs parameter.
2. The varargs parameter **must be the last parameter** in the method signature (`public void log(String level, int... codes)`).
