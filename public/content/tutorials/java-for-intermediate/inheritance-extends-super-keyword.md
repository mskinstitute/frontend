---
id: inheritance-extends-super-keyword
slug: inheritance-extends-super-keyword
course: java-for-intermediate
chapter: 2: Inheritance, Polymorphism & Abstraction
topic: "Inheritance with extends and the super Keyword"
difficulty: Intermediate
readingTime: 13
order: 6
keywords: ["inheritance java","extends keyword","super keyword","subclass","superclass","code reuse"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧬 Inheritance with extends and the super Keyword

## Introduction
Inheritance allows a new class (subclass / child) to acquire fields and methods from an existing class (superclass / parent) using the **`extends`** keyword. Java supports **Single Inheritance of classes** (a class can only directly extend one superclass).

---

## 🦸 The `super` Keyword

The `super` keyword refers directly to the immediate parent class:
1. **`super()`**: Calls the parent constructor (must be the first line of the child constructor).
2. **`super.member`**: Accesses parent variables shadowed by child variables.
3. **`super.method()`**: Invokes parent method implementations from an overriding method.

---

## 💻 Full Code Demonstration

```java
// Superclass
class Employee {
    protected String name;
    protected int id;
    protected double baseSalary;

    public Employee(String name, int id, double salary) {
        this.name = name;
        this.id = id;
        this.baseSalary = salary;
    }

    public void display() {
        System.out.printf("Employee #%d: %s | Base Salary: ₹%,.2f%n", id, name, baseSalary);
    }
}

// Subclass
class Instructor extends Employee {
    private String subjectSpecialization;

    public Instructor(String name, int id, double salary, String subject) {
        super(name, id, salary); // Invokes Employee constructor
        this.subjectSpecialization = subject;
    }

    @Override
    public void display() {
        super.display(); // Reuses base display logic
        System.out.println("Specialization: " + subjectSpecialization);
    }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Instructor prof = new Instructor("Er. Sumit Sharma", 101, 85000.0, "Java & Systems Architecture");
        prof.display();
    }
}
```
