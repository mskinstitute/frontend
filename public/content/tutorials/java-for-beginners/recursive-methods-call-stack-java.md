---
id: recursive-methods-call-stack-java
slug: recursive-methods-call-stack-java
course: java-for-beginners
chapter: 7: Methods & Modular Programming
topic: "Recursive Methods and Call Stack Execution"
difficulty: Beginner
readingTime: 13
order: 34
keywords: ["recursion java","recursive methods","call stack","base case","factorial java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔁 Recursive Methods and Call Stack Execution

## Introduction
A method that calls itself is **recursive**. Every recursive method requires a **Base Case** (to terminate execution) and a **Recursive Step** (which reduces the problem).

---

## 🧮 Factorial Example

```java
public class RecursionDemo {
    public static long factorial(int n) {
        // 1. Base Case
        if (n <= 1) return 1;

        // 2. Recursive Case
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        int num = 5;
        System.out.println("Factorial of " + num + " is: " + factorial(num));
    }
}
```

---

## ⚠️ StackOverflowError
If a recursive method lacks a reachable base case or recurses too deeply, it exhausts the thread's stack memory and crashes with a **`StackOverflowError`**.
