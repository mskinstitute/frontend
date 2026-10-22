---
id: handling-exceptions-try-catch-finally
slug: handling-exceptions-try-catch-finally
course: java-for-intermediate
chapter: 4: Exception Handling & Robustness
topic: "Handling Exceptions with try, catch, and finally Blocks"
difficulty: Intermediate
readingTime: 13
order: 17
keywords: ["try catch finally","exception handling java","finally block","multi catch block"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛡️ Handling Exceptions with try, catch, and finally

## Introduction
The `try-catch-finally` construct intercepts runtime exceptions, executes fallback recovery routines, and guarantees cleanup execution.

---

## 💻 Full Implementation

```java
public class TryCatchFinallyDemo {
    public static void main(String[] args) {
        try {
            int a = 10;
            int b = 0;
            System.out.println("Performing division...");
            int result = a / b; // Throws ArithmeticException!
            System.out.println("Result: " + result); // Skipped!
        } catch (ArithmeticException ex) {
            System.err.println("[CAUGHT ERROR]: Division by zero is undefined! " + ex.getMessage());
        } catch (Exception ex) {
            System.err.println("[GENERIC ERROR]: " + ex.getMessage());
        } finally {
            // FINALLY block ALWAYS executes whether an exception occurred or not!
            System.out.println("[FINALLY]: Execution cleanup finished.");
        }

        System.out.println("Application recovered and continuing smoothly.");
    }
}
```
