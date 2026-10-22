---
id: nested-loops-pattern-output-java
slug: nested-loops-pattern-output-java
course: java-for-beginners
chapter: 4: Loops and Iterations
topic: "Nested Loops and Algorithmic Pattern Output"
difficulty: Beginner
readingTime: 12
order: 20
keywords: ["nested loops java","pattern printing","star pyramid","matrix patterns","loop logic"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📐 Nested Loops and Algorithmic Pattern Output

## Introduction
Writing nested loops builds strong programmatic thinking and visual spatial reasoning. These patterns frequently appear in technical coding interviews and exams.

---

## 🌟 Pyramid Pattern Example

```java
public class PatternDemo {
    public static void main(String[] args) {
        int rows = 5;

        // 1. Right-Angled Triangle
        System.out.println("Right Triangle:");
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }

        // 2. Centered Number Pyramid
        System.out.println("\nNumber Pyramid:");
        for (int i = 1; i <= rows; i++) {
            // Print leading spaces
            for (int s = 1; s <= rows - i; s++) {
                System.out.print("  ");
            }
            // Print numbers
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
    }
}
```
