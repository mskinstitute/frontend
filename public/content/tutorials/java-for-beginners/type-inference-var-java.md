---
id: type-inference-var-java
slug: type-inference-var-java
course: java-for-beginners
chapter: 2: Variables, Data Types & Operators
topic: "Type Inference with var (Java 10+)"
difficulty: Beginner
readingTime: 12
order: 8
keywords: ["var java","type inference","local variable type inference","java 10","clean java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔍 Type Inference with var (Java 10+)

## Introduction
Introduced in Java 10, **Local Variable Type Inference** allows developers to declare local variables using the **`var`** keyword, letting the compiler infer the exact type from the right-hand initialization expression.

---

## ⚡ Static Typing Remains Intact!

> **Critical Fact**: `var` in Java is NOT like JavaScript's dynamic `var`. Java remains **100% statically typed**. Once `var` is inferred at compile-time, its type is immutable and cannot change!

```java
import java.util.ArrayList;
import java.util.HashMap;

public class VarDemo {
    public static void main(String[] args) {
        // Inferred types:
        var studentAge = 22;                     // Inferred as int
        var gpa = 8.75;                          // Inferred as double
        var instituteName = "MSK Institute";     // Inferred as String

        // studentAge = "Twenty Two"; // 💥 Compiler Error: incompatible types: String cannot be converted to int

        // Eliminates boilerplate on complex generic types:
        // Before: HashMap<String, ArrayList<Integer>> scores = new HashMap<String, ArrayList<Integer>>();
        // With var:
        var scores = new HashMap<String, ArrayList<Integer>>();

        System.out.println("Student: " + instituteName + ", Age: " + studentAge);
    }
}
```

---

## 🚫 Where `var` CANNOT Be Used
1. Class member variables (fields).
2. Method parameters or return types.
3. Variables declared without an immediate initializer (`var x;` is illegal).
4. Initialized with `null` (`var x = null;` is illegal).
