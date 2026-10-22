---
id: object-class-tostring-equals-hashcode
slug: object-class-tostring-equals-hashcode
course: java-for-intermediate
chapter: 1: Object-Oriented Programming Essentials
topic: "The java.lang.Object Class: toString(), equals(), and hashCode()"
difficulty: Intermediate
readingTime: 14
order: 5
keywords: ["java.lang.Object","toString method","equals method","hashCode method","hash contract"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 👑 The java.lang.Object Class: toString, equals, and hashCode

## Introduction
In Java, **`java.lang.Object`** is the root ancestor of every single class. If a class does not explicitly extend another class, the compiler automatically inserts `extends Object`.

---

## 🔄 The Big Three Methods to Override

1. **`toString()`**: Returns a readable string representation of the object (default returns `ClassName@HexHash`).
2. **`equals(Object obj)`**: Determines logical equality between two objects (default checks reference `==`).
3. **`hashCode()`**: Returns an integer hash value used by hash-based collections (`HashMap`, `HashSet`).

---

## 💻 Full Implementation & The Equals-HashCode Contract

> **The Hash Contract**: If `a.equals(b)` is `true`, then `a.hashCode()` **MUST be identical** to `b.hashCode()`!

```java
import java.util.Objects;

public class Student {
    private int rollNumber;
    private String name;

    public Student(int roll, String name) {
        this.rollNumber = roll;
        this.name = name;
    }

    // 1. Override toString()
    @Override
    public String toString() {
        return "Student[Roll=" + rollNumber + ", Name='" + name + "']";
    }

    // 2. Override equals()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Reference identity check
        if (o == null || getClass() != o.getClass()) return false; // Null and class type check
        Student student = (Student) o; // Cast
        return rollNumber == student.rollNumber && Objects.equals(name, student.name);
    }

    // 3. Override hashCode()
    @Override
    public int hashCode() {
        return Objects.hash(rollNumber, name);
    }

    public static void main(String[] args) {
        Student s1 = new Student(101, "Aarav");
        Student s2 = new Student(101, "Aarav");

        System.out.println("String representation: " + s1);
        System.out.println("Are s1 and s2 equal?   " + s1.equals(s2)); // true!
        System.out.println("s1 Hash: " + s1.hashCode() + " | s2 Hash: " + s2.hashCode());
    }
}
```
