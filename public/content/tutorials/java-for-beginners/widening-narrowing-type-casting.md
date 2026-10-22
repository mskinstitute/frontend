---
id: widening-narrowing-type-casting
slug: widening-narrowing-type-casting
course: java-for-beginners
chapter: 2: Variables, Data Types & Operators
topic: "Widening and Narrowing Type Casting & Type Safety"
difficulty: Beginner
readingTime: 12
order: 7
keywords: ["type casting","widening casting","narrowing casting","implicit conversion","explicit cast"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔄 Widening and Narrowing Type Casting & Type Safety

## Introduction
Type casting is the process of converting a value from one primitive data type into another. In Java, type conversions are categorized into **Widening (Automatic)** and **Narrowing (Explicit)**.

---

## 📈 1. Widening Casting (Implicit / Automatic)

Converting a smaller data type to a larger data type is performed automatically by the Java compiler because **no data loss can occur**:

```text
byte ──► short ──► int ──► long ──► float ──► double
```

```java
public class WideningDemo {
    public static void main(String[] args) {
        int studentMarks = 85;
        double decimalMarks = studentMarks; // Automatic widening: 85 becomes 85.0

        System.out.println("Int: " + studentMarks);
        System.out.println("Double: " + decimalMarks);
    }
}
```

---

## 📉 2. Narrowing Casting (Explicit / Manual)

Converting a larger data type to a smaller data type requires explicit casting syntax `(targetType)value` because **data truncation or loss can occur**:

```java
public class NarrowingDemo {
    public static void main(String[] args) {
        double exactFee = 4999.85;

        // Explicit cast truncates fractional part:
        int roundedFee = (int) exactFee; // Becomes 4999

        System.out.println("Original: " + exactFee);
        System.out.println("Narrowed: " + roundedFee);

        // Overflow example:
        int bigNumber = 130;
        byte smallByte = (byte) bigNumber; // Wraps around to -126 due to 8-bit two's complement!
        System.out.println("Overflowed byte: " + smallByte);
    }
}
```
