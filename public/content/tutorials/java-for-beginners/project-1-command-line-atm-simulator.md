---
id: project-1-command-line-atm-simulator
slug: project-1-command-line-atm-simulator
course: java-for-beginners
chapter: 8: Beginner Projects & Capstones
topic: "Project 1: Command-Line ATM Banking Simulator"
difficulty: Beginner
readingTime: 16
order: 35
keywords: ["atm project java","console banking","beginner java project","scanner menu app"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏧 Capstone Project 1: Command-Line ATM Banking Simulator

## Introduction
In this project, you will build an interactive **Command-Line ATM Banking Simulator** in Java with PIN verification, deposits, withdrawals, and balance inquiries.

---

## 💻 Full Source Code

```java
import java.util.Scanner;

public class AtmSimulator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double balance = 25000.0;
        final int CORRECT_PIN = 7890;
        int attempts = 0;
        boolean authenticated = false;

        System.out.println("==========================================");
        System.out.println("     MSK INSTITUTE DIGITAL BANKING ATM    ");
        System.out.println("==========================================");

        // PIN Authentication Loop (Max 3 attempts)
        while (attempts < 3) {
            System.out.print("Enter your 4-digit PIN: ");
            int pin = scanner.nextInt();

            if (pin == CORRECT_PIN) {
                authenticated = true;
                break;
            } else {
                attempts++;
                System.out.printf("Incorrect PIN. Attempts remaining: %d%n", (3 - attempts));
            }
        }

        if (!authenticated) {
            System.out.println("🚨 Card blocked due to 3 failed attempts. Contact support.");
            scanner.close();
            return;
        }

        boolean active = true;
        while (active) {
            System.out.println("\n---------------- ATM MENU ----------------");
            System.out.println("1. Check Account Balance");
            System.out.println("2. Deposit Cash");
            System.out.println("3. Withdraw Cash");
            System.out.println("4. Exit");
            System.out.print("Select an option (1-4): ");

            int choice = scanner.nextInt();

            switch (choice) {
                case 1 -> System.out.printf("Current Balance: ₹%,.2f%n", balance);
                case 2 -> {
                    System.out.print("Enter deposit amount: ₹");
                    double deposit = scanner.nextDouble();
                    if (deposit > 0) {
                        balance += deposit;
                        System.out.printf("Deposited ₹%,.2f. New Balance: ₹%,.2f%n", deposit, balance);
                    } else {
                        System.out.println("Invalid deposit amount.");
                    }
                }
                case 3 -> {
                    System.out.print("Enter withdrawal amount: ₹");
                    double withdraw = scanner.nextDouble();
                    if (withdraw > balance) {
                        System.out.println("[ERROR]: Insufficient account balance.");
                    } else if (withdraw <= 0) {
                        System.out.println("Invalid withdrawal amount.");
                    } else {
                        balance -= withdraw;
                        System.out.printf("Please collect your cash: ₹%,.2f. Remaining: ₹%,.2f%n", withdraw, balance);
                    }
                }
                case 4 -> {
                    System.out.println("Please collect your card. Thank you for banking with MSK!");
                    active = false;
                }
                default -> System.out.println("Invalid selection. Choose 1 through 4.");
            }
        }

        scanner.close();
    }
}
```
