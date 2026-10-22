---
id: console-input-scanner-formatting
slug: console-input-scanner-formatting
course: java-for-beginners
chapter: 2: Variables, Data Types & Operators
topic: "Standard Console Input: java.util.Scanner and System.out Formatting"
difficulty: Beginner
readingTime: 13
order: 10
keywords: ["scanner java","console input","system out printf","scanner nextLine","input parsing"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⌨️ Standard Console Input with Scanner & Formatted Output

## Introduction
Interactive console applications require reading user input from the keyboard. In Java, this is managed by the **`java.util.Scanner`** class, which parses primitives and strings using regular expressions.

---

## 📥 Reading Data with `Scanner`

```java
import java.util.Scanner;

public class UserInputDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter Student Full Name: ");
        String name = scanner.nextLine(); // Reads full text line including spaces

        System.out.print("Enter Age: ");
        int age = scanner.nextInt();

        System.out.print("Enter Course Fee Paid: ₹");
        double fee = scanner.nextDouble();

        System.out.println("\n--- Student Summary ---");
        System.out.printf("Name : %s%n", name);
        System.out.printf("Age  : %d years old%n", age);
        System.out.printf("Fee  : ₹%,.2f%n", fee); // Formatted with comma separators and 2 decimals

        scanner.close(); // Clean up scanner resource
    }
}
```

---

## ⚠️ The Infamous `nextLine()` Skip Gotcha

When calling `nextInt()` or `nextDouble()`, Scanner consumes the number but **leaves the trailing newline (`\n`) in the buffer**. If you subsequently call `nextLine()`, it consumes that leftover newline immediately and appears to "skip" input!

### Solution:
Consume the leftover newline with a blank `scanner.nextLine()` call before reading text:
```java
int age = scanner.nextInt();
scanner.nextLine(); // Consume leftover newline character!
String address = scanner.nextLine(); // Now reads text properly!
```
