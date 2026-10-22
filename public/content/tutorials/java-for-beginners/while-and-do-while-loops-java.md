---
id: while-and-do-while-loops-java
slug: while-and-do-while-loops-java
course: java-for-beginners
chapter: 4: Loops and Iterations
topic: "The while Loop and do-while Loop"
difficulty: Beginner
readingTime: 12
order: 16
keywords: ["while loop java","do while loop java","iteration","entry controlled loop","exit controlled loop"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 The while and do-while Loops in Java

## Introduction
Loops automate repetitive operations. Java provides entry-controlled loops (`while`) and exit-controlled loops (`do-while`).

---

## 🔁 1. The `while` Loop (Entry-Controlled)

Condition is evaluated **before** executing the loop body:

```java
public class WhileDemo {
    public static void main(String[] args) {
        int count = 1;
        int sum = 0;

        while (count <= 10) {
            sum += count;
            count++;
        }

        System.out.println("Sum of 1 to 10: " + sum);
    }
}
```

---

## 🔁 2. The `do-while` Loop (Exit-Controlled)

Guaranteed to execute **at least once** because the condition is checked at the end:

```java
import java.util.Scanner;

public class DoWhileDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int pin;
        final int CORRECT_PIN = 4321;

        do {
            System.out.print("Enter 4-digit Security PIN: ");
            pin = scanner.nextInt();
            if (pin != CORRECT_PIN) {
                System.out.println("Incorrect PIN. Please re-enter.");
            }
        } while (pin != CORRECT_PIN);

        System.out.println("Authentication Successful!");
        scanner.close();
    }
}
```
