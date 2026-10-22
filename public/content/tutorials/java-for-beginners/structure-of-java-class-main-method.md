---
id: structure-of-java-class-main-method
slug: structure-of-java-class-main-method
course: java-for-beginners
chapter: 1: Java Ecosystem & Development Setup
topic: "Structure of a Java Class & public static void main(String[] args)"
difficulty: Beginner
readingTime: 13
order: 5
keywords: ["java class structure","public static void main","main method","system out println","syntax breakdown"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧱 Structure of a Java Class & public static void main

## Introduction
Every single line of executable logic in Java must reside inside a **class**. Understanding the anatomy of a class and the entry point method is fundamental to all Java programming.

---

## 📝 The Canonical "Hello World"

```java
public class Welcome {
    public static void main(String[] args) {
        System.out.println("Welcome to Java Programming at MSK Institute!");
    }
}
```

---

## 🔍 Dissecting `public static void main(String[] args)`

Each keyword in the main method signature serves a specific JVM purpose:

| Keyword | Purpose |
|---|---|
| **`public`** | Access specifier. Allows the external JVM runtime to locate and call the entry point from anywhere. |
| **`static`** | Enables the JVM to invoke the method **without creating an instance of the class** beforehand. |
| **`void`** | Return type. The method does not return a value (status codes are passed via `System.exit()`). |
| **`main`** | The designated identifier that the JVM looks for as the starting execution point. |
| **`String[] args`**| Array of strings that receives optional command-line arguments passed when launching the program. |

---

## 📜 The File-Naming Rule in Java

> **Rule**: If a class is declared `public`, the source file name **MUST match the class name exactly**, including casing, with a `.java` extension!

```text
public class Welcome { ... }  ──► File MUST be named: Welcome.java
```

---

## 🖨️ Console Output: `print` vs `println`
- `System.out.print("Text")`: Prints text **without** appending a newline.
- `System.out.println("Text")`: Prints text and immediately moves the cursor to the next line.
- `System.out.printf("Age: %d", age)`: Formatted string output.
