---
id: constructors-constructor-chaining-this
slug: constructors-constructor-chaining-this
course: java-for-intermediate
chapter: 1: Object-Oriented Programming Essentials
topic: "Constructors: Default, Parameterized, and Constructor Chaining (this())"
difficulty: Intermediate
readingTime: 13
order: 3
keywords: ["constructors java","constructor chaining","this keyword","default constructor","parameterized constructor"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏗️ Constructors and Constructor Chaining (this())

## Introduction
A **constructor** is a special method invoked automatically upon object creation to establish initial state. Java supports **constructor overloading** and **constructor chaining** via the `this()` call.

---

## 🔗 Constructor Chaining with `this()`

Constructor chaining eliminates redundant code by allowing one constructor to delegate to another overloaded constructor in the same class:

> **Rule**: `this()` **must be the very first statement** in the constructor!

```java
public class CourseBatch {
    private String courseCode;
    private String batchName;
    private int maxStudents;
    private boolean isEveningBatch;

    // 1. Fully Parameterized Master Constructor
    public CourseBatch(String code, String name, int capacity, boolean isEvening) {
        this.courseCode = code;
        this.batchName = name;
        this.maxStudents = capacity;
        this.isEveningBatch = isEvening;
    }

    // 2. Overloaded Constructor: Defaults to Morning batch
    public CourseBatch(String code, String name, int capacity) {
        this(code, name, capacity, false); // Delegates to master constructor!
    }

    // 3. Default Constructor: Defaults to standard batch size 30
    public CourseBatch() {
        this("JAVA-101", "Foundation Java Track", 30, false);
    }

    public void display() {
        System.out.printf("[%s] %s | Max: %d | Evening: %b%n", 
            courseCode, batchName, maxStudents, isEveningBatch);
    }

    public static void main(String[] args) {
        CourseBatch b1 = new CourseBatch();
        CourseBatch b2 = new CourseBatch("CPP-201", "Modern C++ Core", 45);
        CourseBatch b3 = new CourseBatch("FS-301", "Full Stack Java", 60, true);

        b1.display();
        b2.display();
        b3.display();
    }
}
```
