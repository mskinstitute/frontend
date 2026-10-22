---
id: string-creation-string-pool-immutability
slug: string-creation-string-pool-immutability
course: java-for-beginners
chapter: 6: String Handling & Text Manipulation
topic: "String Creation, String Pool, and Immutability in Java"
difficulty: Beginner
readingTime: 14
order: 25
keywords: ["string pool","string immutability","string memory heap","interning","java strings"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧵 String Creation, the String Constant Pool & Immutability

## Introduction
In Java, **`String`** is an object representing a sequence of characters. Unlike strings in C++, **Java Strings are strictly immutable**: once created, their contents can never be changed.

---

## 🏊 The String Constant Pool (SCP)

To conserve heap memory, the JVM maintains a special cache in the Metaspace/Heap called the **String Constant Pool**:

```text
String s1 = "MSK";  ──┐
                      ▼
String s2 = "MSK";  ──► [ String Pool: "MSK" (Single Shared Object!) ]
```

If you create strings using double-quote literals, Java checks the pool first. If the string already exists, it reuses the existing reference!

---

## 🧱 Literal vs `new String()`

```java
public class StringPoolDemo {
    public static void main(String[] args) {
        String s1 = "MSK";               // Lives in String Constant Pool
        String s2 = "MSK";               // Points to identical object in pool!
        String s3 = new String("MSK");   // Explicitly allocates separate heap object!

        // Memory address equality (==):
        System.out.println("s1 == s2 : " + (s1 == s2)); // true (Same pool memory reference!)
        System.out.println("s1 == s3 : " + (s1 == s3)); // false (Different heap memory addresses!)
    }
}
```

---

## 🔒 Why are Strings Immutable in Java?
1. **Security**: Strings store database credentials, file paths, and network URLs. Immutability ensures malicious code cannot alter these parameters.
2. **Thread-Safety**: Immutable objects can be shared across multiple threads without locking.
3. **Caching & Hashing**: Strings cache their `hashCode()`, making them ideal keys for `HashMap` and `HashSet`.
