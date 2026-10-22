---
id: "java-adv-t2.4"
title: "Lambda Expression Syntax, Scope, and Variable Capture"
slug: "lambda-expressions-syntax-scope-variable-capture"
course: "Java for Advanced"
chapter: "2: Functional Programming & Lambdas"
topic: "Lambda Expression Syntax, Scope, and Variable Capture"
difficulty: "Advanced"
readingTime: 15
order: 9
keywords: ["lambda syntax","variable capture","effectively final","lexical scoping","closures"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# ⚡ Lambda Expression Syntax, Scope, and Variable Capture

## Introduction
A **lambda expression** is an anonymous function—a function without a declared name that can be passed around as data. Understanding lambda syntax variations, lexical scoping rules, and variable capture mechanics is essential for writing high-performance, bug-free modern Java.

---

## 📝 1. Syntax Variations

```java
// 1. Full syntax with explicit types and block
(int a, int b) -> { return a + b; }

// 2. Inferred types (compiler infers types from interface signature)
(a, b) -> { return a + b; }

// 3. Single expression body (implicit return)
(a, b) -> a + b

// 4. Single parameter (parentheses are optional)
x -> x * x

// 5. Zero parameters (empty parentheses required)
() -> System.out.println("Ping")
```

---

## 🔒 2. Variable Capture and "Effectively Final" Rule

A lambda expression can access variables declared in its enclosing scope. However, local variables must be **final** or **effectively final** (a variable whose value is never modified after initialization).

```java
public void processOrders(List<Order> orders) {
    double taxRate = 0.18; // Effectively final

    orders.forEach(order -> {
        // ✅ Valid: Reading effectively final variable
        double total = order.getAmount() * (1 + taxRate);
        System.out.println("Order total: " + total);
    });

    // If we uncomment the line below:
    // taxRate = 0.20; 
    // ❌ COMPILE ERROR inside lambda: "Local variable taxRate defined in an 
    //    enclosing scope must be final or effectively final"
}
```

### Why Must Captured Variables Be Effectively Final?
Java copies primitive local variables onto the lambda's execution frame by value. If mutation were allowed, concurrency hazards and race conditions would occur when lambdas run in background threads!

---

## 🔍 3. Scope: Lambdas vs Anonymous Inner Classes

Unlike anonymous inner classes, lambdas have **lexical scope**:
- In a lambda, `this` refers to the **enclosing class instance**, not the lambda instance!
- A lambda does not shadow variable names from the enclosing method.

```java
public class ScopeDemo {
    private String tag = "GlobalTag";

    public void testScope() {
        Runnable r = () -> {
            // "this.tag" refers to ScopeDemo's field!
            System.out.println("Current tag: " + this.tag);
        };
        r.run();
    }
}
```
