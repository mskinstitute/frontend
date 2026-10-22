---
id: "java-adv-t2.2"
title: "Functional Interfaces & the @FunctionalInterface Annotation"
slug: "functional-interfaces-annotation"
course: "Java for Advanced"
chapter: "2: Functional Programming & Lambdas"
topic: "Functional Interfaces & the @FunctionalInterface Annotation"
difficulty: "Advanced"
readingTime: 14
order: 7
keywords: ["functional interfaces","single abstract method","SAM","functionalinterface annotation","default methods"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 📜 Functional Interfaces & the @FunctionalInterface Annotation

## Introduction
At the heart of Java's lambda expressions is the concept of a **Functional Interface**. A functional interface is an interface that contains **exactly one abstract method** (known as the Single Abstract Method or **SAM** contract).

Lambdas and method references can be assigned to any variable whose type is a compatible functional interface.

---

## 🏷️ The `@FunctionalInterface` Annotation

The `@FunctionalInterface` annotation informs the Java compiler to verify that the annotated interface has exactly one abstract method:

```java
package com.mskinstitute.functional;

@FunctionalInterface
public interface CryptoValidator {
    // Exactly ONE abstract method
    boolean validate(String transactionHash);

    // Can have any number of default methods
    default void logValidationAttempt(String hash) {
        System.out.println("Verifying cryptographic hash: " + hash);
    }

    // Can have any number of static utility methods
    static boolean isHex(String s) {
        return s != null && s.matches("^[0-9a-fA-F]+$");
    }
}
```

---

## 🔬 Compiler Enforcement Rules

1. **Exactly One Abstract Method**: If an interface has zero abstract methods or more than one abstract method, the compiler generates a build error:
   `error: Unexpected @FunctionalInterface annotation: interface is not a functional interface`
2. **Methods Inherited from `java.lang.Object`**: Abstract methods that match public methods of `java.lang.Object` (like `equals`, `hashCode`, `toString`) do **not** count towards the SAM limit:

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2); // The single abstract method

    // Does NOT count against the single abstract method rule!
    boolean equals(Object obj);
}
```

---

## 💻 Instantiating via Lambda vs Anonymous Inner Class

```java
// 1. Traditional Anonymous Inner Class (Verbose)
CryptoValidator legacyValidator = new CryptoValidator() {
    @Override
    public boolean validate(String hash) {
        return hash != null && hash.length() == 64;
    }
};

// 2. Modern Lambda Expression (Concise & Clean)
CryptoValidator modernValidator = hash -> hash != null && hash.length() == 64;

System.out.println("Valid: " + modernValidator.validate("a1b2c3..."));
```
