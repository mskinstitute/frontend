---
id: "java-adv-t2.1"
title: "Introduction to Functional Programming in Java"
slug: "functional-programming-in-java-paradigms"
course: "Java for Advanced"
chapter: "2: Functional Programming & Lambdas"
topic: "Introduction to Functional Programming in Java"
difficulty: "Advanced"
readingTime: 14
order: 6
keywords: ["functional programming","declarative programming","immutability","pure functions","java 8"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🚀 Introduction to Functional Programming in Java

## Introduction
Since Java 8, Java transitioned from being a purely Object-Oriented language into a **multi-paradigm language** that embraces **Functional Programming (FP)**. 

In traditional imperative programming, code focuses on *how* to achieve a task using explicit state mutation and loops. In functional programming, code focuses on *what* data transformations should occur using **pure functions**, **declarative pipelines**, and **immutable state**.

---

## ⚖️ Imperative vs Functional Style

Let's examine how to filter and sum odd numbers:

### 1. Imperative Style (State Mutation & Loops)
```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
int sumOfOdds = 0; // Mutable state

for (int n : numbers) {
    if (n % 2 != 0) {
        sumOfOdds += n; // Step-by-step state mutation
    }
}
System.out.println("Sum: " + sumOfOdds);
```

### 2. Functional Declarative Style (Pipelines & Immutability)
```java
int sumOfOdds = numbers.stream()
                       .filter(n -> n % 2 != 0)
                       .mapToInt(Integer::intValue)
                       .sum();
System.out.println("Sum: " + sumOfOdds);
```

---

## 🏛️ Core Tenets of Functional Programming

```text
┌────────────────────────────────────────────────────────┐
│             FUNCTIONAL PROGRAMMING PRINCIPLES          │
├────────────────────────────────────────────────────────┤
│ 1. First-Class Functions: Functions treated as values  │
│ 2. Pure Functions: Same input yields same output       │
│ 3. Side-Effect Free: Does not mutate external variables│
│ 4. Immutability: Objects cannot change after creation  │
└────────────────────────────────────────────────────────┘
```

### Pure Functions vs Side Effects:
```java
// ❌ Impure Function: Mutates external variable
int counter = 0;
int incrementAndGet(int value) {
    counter += value; // Side effect!
    return counter;
}

// ✅ Pure Function: Depends only on inputs, no side effects
int add(int a, int b) {
    return a + b;
}
```

---

## 💼 Why Enterprise Systems Embrace FP in Java:
- **Thread Safety**: Immutable data is inherently safe across concurrent threads without locks.
- **Maintainability**: Short, declarative logic minimizes branching errors.
- **Composability**: Small pure functions can be chained like building blocks.
