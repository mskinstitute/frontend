---
id: class-definition-object-heap-stack
slug: class-definition-object-heap-stack
course: java-for-intermediate
chapter: 1: Object-Oriented Programming Essentials
topic: "Class Definition, Object Instantiation, and Heap vs Stack Allocation"
difficulty: Intermediate
readingTime: 13
order: 1
keywords: ["java oop","class definition","object instantiation","heap vs stack","reference variables"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏛️ Class Definition, Object Instantiation, and Heap vs Stack Allocation

## Introduction
Object-Oriented Programming (OOP) in Java models real-world business domains as interactions between software objects. A **class** is a blueprint or template, while an **object** is a concrete instance created from that blueprint.

---

## 🔬 Memory Architecture: Stack vs Heap

```text
STACK MEMORY (Thread-Private, Fast)       HEAP MEMORY (Shared, Managed by GC)
┌─────────────────────────────────┐       ┌─────────────────────────────────────┐
│  studentRef (Pointer Address)   │ ────► │  [ Student Object Instance ]        │
│  primitive int roll = 101       │       │    String name = "Aarav Sharma"     │
└─────────────────────────────────┘       │    double gpa = 9.2                 │
                                          └─────────────────────────────────────┘
```

- **Stack**: Stores method execution frames, primitive local variables, and object reference variables (pointers).
- **Heap**: Stores all object instances and arrays. Cleaned automatically by Garbage Collection (GC).

---

## 💻 Class Definition & Instantiation

```java
public class StudentProfile {
    // Member state (fields)
    private int rollNumber;
    private String fullName;
    private double gpa;

    // Method to initialize
    public void setDetails(int roll, String name, double marks) {
        this.rollNumber = roll;
        this.fullName = name;
        this.gpa = marks;
    }

    public void display() {
        System.out.printf("Student #%d: %s | GPA: %.2f%n", rollNumber, fullName, gpa);
    }

    public static void main(String[] args) {
        // 's1' is a reference on the stack; 'new StudentProfile()' allocates on the heap
        StudentProfile s1 = new StudentProfile();
        s1.setDetails(101, "Aarav Sharma", 9.4);
        s1.display();

        StudentProfile s2 = new StudentProfile();
        s2.setDetails(102, "Sneha Gupta", 8.9);
        s2.display();
    }
}
```
