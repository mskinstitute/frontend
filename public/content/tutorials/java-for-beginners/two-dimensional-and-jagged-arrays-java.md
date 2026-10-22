---
id: two-dimensional-and-jagged-arrays-java
slug: two-dimensional-and-jagged-arrays-java
course: java-for-beginners
chapter: 5: Arrays & Array Utilities
topic: "Two-Dimensional Arrays (Matrices) and Jagged Arrays"
difficulty: Beginner
readingTime: 13
order: 23
keywords: ["2d arrays java","matrix java","jagged arrays","ragged arrays","multidimensional arrays"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔲 Two-Dimensional and Jagged Arrays in Java

## Introduction
A 2D array in Java is not a single contiguous block of memory; it is an **"array of arrays"** (an array holding references to other array objects). This enables **Jagged Arrays** where different rows can have different lengths!

---

## 📊 Standard 2D Rectangular Matrix

```java
public class MatrixDemo {
    public static void main(String[] args) {
        int[][] grid = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };

        System.out.println("3x3 Matrix Grid:");
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[row].length; col++) {
                System.out.printf("%3d ", grid[row][col]);
            }
            System.out.println();
        }
    }
}
```

---

## ⚡ Jagged (Ragged) Arrays

```java
public class JaggedArrayDemo {
    public static void main(String[] args) {
        // An institute batch where 3 teachers have different numbers of students:
        int[][] batchSizes = new int[3][];

        batchSizes[0] = new int[2]; // Teacher 1 has 2 students
        batchSizes[1] = new int[4]; // Teacher 2 has 4 students
        batchSizes[2] = new int[1]; // Teacher 3 has 1 student

        System.out.println("Jagged Array Row Lengths:");
        for (int i = 0; i < batchSizes.length; i++) {
            System.out.println("Row " + i + " length: " + batchSizes[i].length);
        }
    }
}
```
