---
id: project-2-student-gpa-grade-generator
slug: project-2-student-gpa-grade-generator
course: java-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 2: Student GPA & Grade Card Generator"
difficulty: Beginner
readingTime: 16
order: 36
keywords: ["gpa generator java","grade card project","arrays project java","student report"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📊 Capstone Project 2: Student GPA & Grade Card Generator

## Introduction
This application collects subject scores using Java arrays, computes statistical aggregates, and produces a formatted report card.

---

## 💻 Full Source Code

```java
import java.util.Scanner;

public class GradeCardGenerator {
    public static char determineGrade(double percentage) {
        if (percentage >= 90.0) return 'A';
        if (percentage >= 80.0) return 'B';
        if (percentage >= 70.0) return 'C';
        if (percentage >= 50.0) return 'D';
        return 'F';
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] subjects = {"Java Basics", "Data Structures", "Database Management", "Web Tech", "Discrete Math"};
        double[] marks = new double[subjects.length];

        System.out.println("=== MSK Student Grade Entry ===");
        System.out.print("Enter Student Full Name: ");
        String studentName = scanner.nextLine();

        System.out.print("Enter Roll Number: ");
        String rollNumber = scanner.nextLine();

        double totalMarks = 0.0;
        for (int i = 0; i < subjects.length; i++) {
            System.out.printf("Enter marks for %s (0-100): ", subjects[i]);
            marks[i] = scanner.nextDouble();
            totalMarks += marks[i];
        }

        double percentage = totalMarks / subjects.length;
        double gpa = percentage / 10.0;
        char grade = determineGrade(percentage);

        System.out.println("\n==================================================");
        System.out.println("           MSK INSTITUTE OF TECHNOLOGY            ");
        System.out.println("                STUDENT GRADE CARD                ");
        System.out.println("==================================================");
        System.out.printf("Student Name : %s%n", studentName);
        System.out.printf("Roll Number  : %s%n", rollNumber);
        System.out.println("--------------------------------------------------");
        System.out.printf("%-25s %15s%n", "Subject", "Marks Obtained");
        System.out.println("--------------------------------------------------");

        for (int i = 0; i < subjects.length; i++) {
            System.out.printf("%-25s %15.1f%n", subjects[i], marks[i]);
        }

        System.out.println("==================================================");
        System.out.printf("Total Marks  : %.1f / 500.0%n", totalMarks);
        System.out.printf("Percentage   : %.2f%%%n", percentage);
        System.out.printf("GPA (10-pt)  : %.2f / 10.0%n", gpa);
        System.out.printf("Final Grade  : %c (%s)%n", grade, (grade != 'F' ? "PASSED" : "FAILED"));
        System.out.println("==================================================");

        scanner.close();
    }
}
```
