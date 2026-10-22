---
id: pass-by-value-semantics-java
slug: pass-by-value-semantics-java
course: java-for-beginners
chapter: 7: Methods & Modular Programming
topic: "Pass-by-Value Semantics in Java (Primitives vs Object References)"
difficulty: Beginner
readingTime: 13
order: 31
keywords: ["pass by value java","object references","primitive vs reference","java parameters"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📦 Pass-by-Value Semantics in Java

## Introduction
> **The Golden Rule**: **Java is strictly Pass-by-Value ALWAYS.**
There is NO pass-by-reference in Java!

---

## 🔍 Understanding the Nuance

1. **When passing Primitives**: A copy of the actual binary value is passed. The caller's variable cannot be modified.
2. **When passing Objects**: A copy of the **reference pointer** is passed. Both pointers refer to the same object on the heap!

```java
class Student {
    String name;
    Student(String n) { this.name = n; }
}

public class PassByValueDemo {
    public static void modifyPrimitive(int x) {
        x = 999; // Modifies only local copy
    }

    public static void modifyObject(Student s) {
        s.name = "Priya Sharma"; // Mutates shared heap object!
    }

    public static void reassignObject(Student s) {
        s = new Student("Fake"); // Overwrites only local reference copy!
    }

    public static void main(String[] args) {
        int num = 10;
        modifyPrimitive(num);
        System.out.println("num after method: " + num); // Still 10!

        Student s = new Student("Aarav");
        modifyObject(s);
        System.out.println("Student name after mutation: " + s.name); // Priya Sharma!

        reassignObject(s);
        System.out.println("Student name after reassignment attempt: " + s.name); // Still Priya Sharma!
    }
}
```
