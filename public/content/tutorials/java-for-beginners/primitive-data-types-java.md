---
id: primitive-data-types-java
slug: primitive-data-types-java
course: java-for-beginners
chapter: 2: Variables, Data Types & Operators
topic: "Primitive Data Types (byte, short, int, long, float, double, char, boolean)"
difficulty: Beginner
readingTime: 13
order: 6
keywords: ["primitive types java","byte","short","int","long","float","double","char","boolean"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔢 Java's 8 Primitive Data Types

## Introduction
Java is a strongly-typed language. Data is stored either as **primitive types** (allocated directly on the stack) or **reference types** (objects allocated on the heap). Java specifies exactly **8 primitive types**, with identical bit sizes across all platforms.

---

## 📊 The 8 Primitives Summary

| Type | Size | Range | Default Value | Example Literal |
|---|---|---|---|---|
| **`byte`** | 1 byte (8 bits) | -128 to 127 | `0` | `byte b = 100;` |
| **`short`** | 2 bytes (16 bits) | -32,768 to 32,767 | `0` | `short s = 25000;` |
| **`int`** | 4 bytes (32 bits) | -2.14B to +2.14B | `0` | `int count = 450000;` |
| **`long`** | 8 bytes (64 bits) | -9 quintillion to +9 quintillion | `0L` | `long pop = 8000000000L;` (Requires `L`) |
| **`float`** | 4 bytes (32 bits) | ~7 decimal digits | `0.0f` | `float temp = 98.6f;` (Requires `f`) |
| **`double`** | 8 bytes (64 bits) | ~15 decimal digits | `0.0d` | `double fee = 4999.75;` |
| **`char`** | 2 bytes (16 bits) | 0 to 65,535 (Unicode UTF-16) | `'\u0000'` | `char grade = 'A';` |
| **`boolean`**| JVM-dependent | `true` or `false` | `false` | `boolean active = true;` |

---

## 💻 Working Example

```java
public class PrimitiveDemo {
    public static void main(String[] args) {
        int studentRoll = 101;
        double courseFee = 3499.50;
        char section = 'B';
        boolean isFeePaid = true;
        long transactionId = 9876543210123L; // Note trailing 'L'

        // Modern numeric literals can use underscores for readability:
        int million = 1_000_000;

        System.out.println("Roll: " + studentRoll);
        System.out.println("Fee: ₹" + courseFee);
        System.out.println("Section: " + section);
        System.out.println("Fee Cleared: " + isFeePaid);
        System.out.println("Txn ID: " + transactionId);
    }
}
```
