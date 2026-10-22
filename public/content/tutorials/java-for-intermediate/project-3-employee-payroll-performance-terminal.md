---
id: project-3-employee-payroll-performance-terminal
slug: project-3-employee-payroll-performance-terminal
course: java-for-intermediate
chapter: 7: Intermediate Portfolio Projects
topic: "Project 3: Employee Payroll & Performance Evaluation Terminal"
difficulty: Intermediate
readingTime: 17
order: 32
keywords: ["payroll project java","performance evaluation","intermediate java capstone","employee management"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 💼 Portfolio Project 3: Employee Payroll & Performance Terminal

## Introduction
The final capstone project for **Java for Intermediate** integrates OOP inheritance, custom exceptions, collections, comparators, and formatted reporting into an Employee Payroll and Performance Evaluation system.

---

## 💻 Full Source Code

```java
import java.util.*;

enum Department { ENGINEERING, ADMISSIONS, MARKETING, ACADEMICS }

class Employee {
    private final int id;
    private final String name;
    private final Department department;
    private final double baseSalary;
    private double performanceScore; // 1.0 to 5.0

    public Employee(int id, String name, Department dept, double salary, double score) {
        this.id = id;
        this.name = name;
        this.department = dept;
        this.baseSalary = salary;
        this.performanceScore = score;
    }

    public double calculateNetSalary() {
        // Performance bonus: 10% for scores >= 4.5; 5% for scores >= 3.5
        double bonusMultiplier = (performanceScore >= 4.5) ? 0.10 : (performanceScore >= 3.5 ? 0.05 : 0.0);
        return baseSalary + (baseSalary * bonusMultiplier);
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public double getScore() { return performanceScore; }
    public Department getDepartment() { return department; }
}

public class PayrollTerminal {
    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
            new Employee(101, "Deepak Yadav", Department.ENGINEERING, 75000.0, 4.8),
            new Employee(102, "Sneha Gupta", Department.ACADEMICS, 65000.0, 4.2),
            new Employee(103, "Aarav Sharma", Department.ADMISSIONS, 50000.0, 3.2),
            new Employee(104, "Rohan Verma", Department.MARKETING, 58000.0, 4.6)
        ));

        // Sort by Highest Performance Score using Comparator:
        staff.sort(Comparator.comparingDouble(Employee::getScore).reversed());

        System.out.println("=========================================================================");
        System.out.println("                 MSK INSTITUTE MONTHLY PAYROLL REPORT                    ");
        System.out.println("=========================================================================");
        System.out.printf("%-6s %-18s %-15s %-8s %15s%n", "ID", "Name", "Department", "Rating", "Net Salary (₹)");
        System.out.println("-------------------------------------------------------------------------");

        double totalDisbursed = 0.0;
        for (Employee e : staff) {
            double net = e.calculateNetSalary();
            totalDisbursed += net;
            System.out.printf("%-6d %-18s %-15s %-8.1f ₹%14,.2f%n", 
                e.getId(), e.getName(), e.getDepartment(), e.getScore(), net);
        }

        System.out.println("=========================================================================");
        System.out.printf("Total Monthly Payroll Disbursed: ₹%,.2f%n", totalDisbursed);
        System.out.println("=========================================================================");
    }
}
```

---

## 🎓 Next Steps in Your Java Journey
Congratulations on finishing **Java for Intermediate**! You have mastered classes, constructors, inheritance, runtime polymorphism, abstract classes, interfaces, packages, exception handling, the Java Collections Framework (Lists, Sets, Maps), File I/O, and serialization. Proceed next to **Java for Advanced** to conquer Generics deep dive, Multithreading & Concurrency (`java.util.concurrent`), Lambda & Stream API pipelines, Reflection, Annotations, and Spring Boot foundations.
