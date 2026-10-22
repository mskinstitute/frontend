---
id: project-4-point-of-sale-billing-terminal
slug: project-4-point-of-sale-billing-terminal
course: java-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 4: Simple Point-of-Sale Billing Terminal"
difficulty: Beginner
readingTime: 16
order: 38
keywords: ["pos billing java","point of sale project","invoice generator java","java capstone"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧾 Capstone Project 4: Simple Point-of-Sale Billing Terminal

## Introduction
The final capstone project for **Java for Beginners** is a **Point-of-Sale Billing Terminal** that processes multiple items, computes 18% GST, applies promotional discounts, and generates a formatted receipt.

---

## 💻 Full Source Code

```java
import java.util.Scanner;

public class PosTerminal {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String[] itemCatalog = {"Java Handbook", "Notebook Spiral", "64GB Pen Drive", "Wireless Mouse"};
        double[] priceCatalog = {499.0, 120.0, 450.0, 750.0};
        int[] quantities = new int[itemCatalog.length];

        System.out.println("==================================================");
        System.out.println("       MSK TECH STORE - POINT OF SALE (POS)       ");
        System.out.println("==================================================");

        for (int i = 0; i < itemCatalog.length; i++) {
            System.out.printf("%d. %-22s : ₹%.2f%n", (i + 1), itemCatalog[i], priceCatalog[i]);
            System.out.print("   Enter quantity purchased: ");
            quantities[i] = scanner.nextInt();
        }

        double subtotal = 0.0;
        for (int i = 0; i < itemCatalog.length; i++) {
            subtotal += (priceCatalog[i] * quantities[i]);
        }

        double gst = subtotal * 0.18;
        double grandTotal = subtotal + gst;

        System.out.println("\n==================================================");
        System.out.println("                   TAX INVOICE                    ");
        System.out.println("==================================================");
        System.out.printf("%-20s %6s %10s %10s%n", "Item", "Qty", "Rate", "Amount");
        System.out.println("--------------------------------------------------");

        for (int i = 0; i < itemCatalog.length; i++) {
            if (quantities[i] > 0) {
                double lineTotal = priceCatalog[i] * quantities[i];
                System.out.printf("%-20s %6d %10.2f %10.2f%n", itemCatalog[i], quantities[i], priceCatalog[i], lineTotal);
            }
        }

        System.out.println("--------------------------------------------------");
        System.out.printf("%-38s ₹%10.2f%n", "Subtotal:", subtotal);
        System.out.printf("%-38s ₹%10.2f%n", "GST (18%):", gst);
        System.out.printf("%-38s ₹%10.2f%n", "GRAND TOTAL PAYABLE:", grandTotal);
        System.out.println("==================================================");
        System.out.println("   Thank you for shopping at MSK Institute Store!  ");

        scanner.close();
    }
}
```

---

## 🎓 Next Steps in Your Java Journey
Congratulations on finishing **Java for Beginners**! You have mastered primitive types, operators, Scanner I/O, control flow, loops, arrays, strings, methods, and built 4 terminal applications. Proceed next to **Java for Intermediate** to conquer Object-Oriented Programming (Classes, Inheritance, Interfaces), the Java Collections Framework, Exception Handling, and File I/O.
