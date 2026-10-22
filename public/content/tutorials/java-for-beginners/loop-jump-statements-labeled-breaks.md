---
id: loop-jump-statements-labeled-breaks
slug: loop-jump-statements-labeled-breaks
course: java-for-beginners
chapter: 4: Loops and Iterations
topic: "Loop Jump Statements: break, continue, and Labeled Breaks"
difficulty: Beginner
readingTime: 13
order: 19
keywords: ["break java","continue java","labeled break","labeled continue","nested loop exit"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛑 Loop Jump Statements: break, continue, and Labeled Breaks

## Introduction
Loop execution can be dynamically altered using **`break`** (terminate loop immediately) and **`continue`** (skip to next iteration). Java also features **labeled breaks** to exit deeply nested loops in one step without messy flags.

---

## ⚡ `break` and `continue`

```java
public class JumpDemo {
    public static void main(String[] args) {
        System.out.println("Odd numbers between 1 and 10 (skipping 5):");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) continue; // Skip evens
            if (i == 5) continue;     // Skip 5
            System.out.print(i + " ");
        }
        System.out.println();
    }
}
```

---

## 🏷️ The Java Labeled Break (Exiting Nested Loops)

In C and C++, breaking out of nested loops often required a `goto` statement. Java does not have `goto`; instead, it provides **labeled statements**:

```java
public class LabeledBreakDemo {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 99, 6}, // 99 is target
            {7, 8, 9}
        };

        int target = 99;
        boolean found = false;

        // Label attached to outer loop:
        searchLoop:
        for (int row = 0; row < matrix.length; row++) {
            for (int col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] == target) {
                    System.out.printf("Found %d at row %d, col %d!%n", target, row, col);
                    found = true;
                    break searchLoop; // Instantly breaks BOTH loops!
                }
            }
        }
    }
}
```
