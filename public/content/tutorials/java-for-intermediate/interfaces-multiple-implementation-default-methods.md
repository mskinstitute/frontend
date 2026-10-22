---
id: interfaces-multiple-implementation-default-methods
slug: interfaces-multiple-implementation-default-methods
course: java-for-intermediate
chapter: 2: Inheritance, Polymorphism & Abstraction
topic: "Interfaces: Declaration, Multiple Interface Implementation, and default/static Methods"
difficulty: Intermediate
readingTime: 14
order: 10
keywords: ["java interfaces","multiple interface implementation","default methods java 8","static interface methods"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔌 Interfaces: Multiple Implementation & Default Methods

## Introduction
An **interface** is a 100% abstract contract specifying *what* a class should do, without prescribing *how*. While Java forbids multiple class inheritance, a class **can implement multiple interfaces**, achieving complete architectural decoupling.

---

## 💻 Multiple Interface Implementation

```java
interface Printable {
    void print(); // Public abstract by default
}

interface Exportable {
    void exportToPdf(String filename);

    // Default method (Java 8+): Provides default implementation without breaking existing classes!
    default void logExportAudit() {
        System.out.println("[AUDIT]: Document export event logged.");
    }
}

// Class implementing multiple interfaces:
public class ReportCard implements Printable, Exportable {
    private String studentName;
    private double gpa;

    public ReportCard(String name, double gpa) {
        this.studentName = name;
        this.gpa = gpa;
    }

    @Override
    public void print() {
        System.out.printf("Report Card: %s | GPA: %.2f%n", studentName, gpa);
    }

    @Override
    public void exportToPdf(String filename) {
        System.out.println("Exported " + filename + " successfully.");
        logExportAudit(); // Invokes default method
    }

    public static void main(String[] args) {
        ReportCard rc = new ReportCard("Aarav", 9.5);
        rc.print();
        rc.exportToPdf("Aarav_GradeCard.pdf");
    }
}
```
