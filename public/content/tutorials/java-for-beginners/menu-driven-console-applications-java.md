---
id: menu-driven-console-applications-java
slug: menu-driven-console-applications-java
course: java-for-beginners
chapter: 3: Control Flow & Decision Making
topic: "Menu-Driven Console Application Logic"
difficulty: Beginner
readingTime: 13
order: 15
keywords: ["console menu","menu driven app","scanner menu loop","input validation java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🖥️ Menu-Driven Console Application Logic in Java

## Introduction
Building an interactive terminal tool requires coordinating a loop, prompt display, user selection, and input validation to prevent crashes.

---

## 💻 Full Implementation

```java
import java.util.Scanner;

public class InstitutePortal {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println("\n=== MSK Institute Student Portal ===");
            System.out.println("1. View Current Courses");
            System.out.println("2. Check Fee Structure");
            System.out.println("3. Contact Counselling Team");
            System.out.println("4. Exit");
            System.out.print("Enter your choice (1-4): ");

            if (!scanner.hasNextInt()) {
                System.out.println("[ERROR]: Please enter numbers only!");
                scanner.next(); // Discard invalid token
                continue;
            }

            int choice = scanner.nextInt();

            switch (choice) {
                case 1 -> System.out.println("-> Courses: C, C++, Java, Python, Web Development.");
                case 2 -> System.out.println("-> Fees range from ₹2,499 to ₹4,999 with 10% affiliate discounts.");
                case 3 -> System.out.println("-> Helpline: admissions@mskinstitute.in | Shikohabad Branch.");
                case 4 -> {
                    System.out.println("Thank you for using the portal. Goodbye!");
                    running = false;
                }
                default -> System.out.println("[ERROR]: Choice must be between 1 and 4.");
            }
        }

        scanner.close();
    }
}
```
