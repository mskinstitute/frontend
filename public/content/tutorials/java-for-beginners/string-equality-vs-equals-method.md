---
id: string-equality-vs-equals-method
slug: string-equality-vs-equals-method
course: java-for-beginners
chapter: 6: String Handling & Text Manipulation
topic: "String Equality: == vs .equals() and .equalsIgnoreCase()"
difficulty: Beginner
readingTime: 12
order: 26
keywords: ["string equality","equals vs ==","equalsIgnoreCase","string comparison","common java bugs"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚖️ String Equality: == vs .equals()

## Introduction
The distinction between **`==`** and **`.equals()`** is the single most common mistake made by beginners in Java.

---

## 🆚 The Critical Distinction

| Comparison | What It Compares |
|---|---|
| **`==`** | **Memory Reference Identity**: Checks if two variables point to the **exact same memory address**. |
| **`.equals()`** | **Content Value**: Checks if the characters inside both strings are identical. |

```java
import java.util.Scanner;

public class StringComparisonDemo {
    public static void main(String[] args) {
        String predefinedPassword = "SecretPassWord";

        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter password: ");
        String enteredPassword = scanner.nextLine();

        // ❌ WRONG: == compares heap memory references, NOT text!
        if (enteredPassword == predefinedPassword) {
            System.out.println("Never printed!");
        }

        // ✅ CORRECT: .equals() compares character content
        if (enteredPassword.equals(predefinedPassword)) {
            System.out.println("Access Granted!");
        } else {
            System.out.println("Access Denied!");
        }

        // Case-Insensitive Comparison:
        if (enteredPassword.equalsIgnoreCase("secretpassword")) {
            System.out.println("Password matched ignoring uppercase/lowercase.");
        }

        scanner.close();
    }
}
```
