---
id: standard-for-loops-java
slug: standard-for-loops-java
course: java-for-beginners
chapter: 4: Loops and Iterations
topic: "The Standard for Loop and Decrement Counters"
difficulty: Beginner
readingTime: 12
order: 17
keywords: ["for loop java","iteration","decrement loop","step counter","multiplication table"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 Standard for Loops and Decrement Counters in Java

## Introduction
The standard `for` loop bundles initialization, condition check, and increment/step into a single concise header.

---

## 🏛️ Syntax & Structure

```text
for (initialization; condition; update) {
    // Body statements
}
```

```java
public class ForLoopDemo {
    public static void main(String[] args) {
        // Counting down from 10 to 1:
        System.out.println("Countdown Sequence:");
        for (int i = 10; i >= 1; i--) {
            System.out.print(i + " ");
        }
        System.out.println("-> Liftoff!\n");

        // Multiplication Table of 7:
        int num = 7;
        for (int i = 1; i <= 10; i++) {
            System.out.printf("%d x %2d = %2d%n", num, i, (num * i));
        }
    }
}
```
