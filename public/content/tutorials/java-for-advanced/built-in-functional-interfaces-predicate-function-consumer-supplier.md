---
id: "java-adv-t2.3"
title: "Core Built-In Functional Interfaces: Predicate, Function, Consumer, Supplier"
slug: "built-in-functional-interfaces-predicate-function-consumer-supplier"
course: "Java for Advanced"
chapter: "2: Functional Programming & Lambdas"
topic: "Core Built-In Functional Interfaces: Predicate, Function, Consumer, Supplier"
difficulty: "Advanced"
readingTime: 16
order: 8
keywords: ["predicate","function","consumer","supplier","java util function","bifunction"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🧩 Core Built-In Functional Interfaces: Predicate, Function, Consumer, Supplier

## Introduction
Instead of forcing developers to declare custom interfaces for common functional signatures, Java provides the **`java.util.function`** package. This package provides standardized functional interfaces covering 95% of software transformation requirements.

---

## 🏛️ The "Big Four" Core Functional Interfaces

| Interface | Method Signature | Conceptual Role | Example Real-World Use Case |
| :--- | :--- | :--- | :--- |
| **`Predicate<T>`** | `boolean test(T t)` | Evaluates a condition (true/false) | Filtering products by price > ₹500 |
| **`Function<T, R>`** | `R apply(T t)` | Transforms input type `T` into result type `R` | Converting `Student` object into GPA `Double` |
| **`Consumer<T>`** | `void accept(T t)` | Consumes data, performs action, returns void | Printing logs or saving record to database |
| **`Supplier<T>`** | `T get()` | Produces/supplies data with zero inputs | Generating unique UUIDs or timestamps |

---

## 💻 Practical Code Demonstrations

```java
package com.mskinstitute.functional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class CoreFunctionsDemo {
    public static void main(String[] args) {
        // 1. Predicate: Check if account balance is solvent
        Predicate<Double> isSolvent = balance -> balance >= 1000.0;
        System.out.println("Solvent: " + isSolvent.test(1250.00)); // true

        // 2. Function: Convert string to character length
        Function<String, Integer> stringLength = s -> s.length();
        System.out.println("Length: " + stringLength.apply("MSK Institute")); // 13

        // 3. Consumer: Display alert message
        Consumer<String> alertService = msg -> System.out.println("[ALERT SENT]: " + msg);
        alertService.accept("Database backup completed successfully.");

        // 4. Supplier: Provide transaction ID
        Supplier<String> transactionIdGen = () -> "TXN-" + UUID.randomUUID().toString().substring(0, 8);
        System.out.println("New ID: " + transactionIdGen.get());
    }
}
```

---

## 🔗 Chaining Functional Interfaces

Many functional interfaces provide default methods for composition:
- **Predicate**: `.and()`, `.or()`, `.negate()`
- **Function**: `.andThen()`, `.compose()`
- **Consumer**: `.andThen()`

```java
Predicate<String> hasAtSymbol = s -> s.contains("@");
Predicate<String> hasDot = s -> s.contains(".");
Predicate<String> isValidEmail = hasAtSymbol.and(hasDot);

System.out.println(isValidEmail.test("admin@mskinstitute.in")); // true
```
