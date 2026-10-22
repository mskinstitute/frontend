---
id: array-iteration-linear-search-min-max
slug: array-iteration-linear-search-min-max
course: java-for-beginners
chapter: 5: Arrays & Array Utilities
topic: "Array Iteration, Linear Search, and Min/Max Algorithms"
difficulty: Beginner
readingTime: 13
order: 22
keywords: ["array search","linear search java","find min max","array traversal","algorithms"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔍 Array Iteration, Linear Search, and Min/Max Algorithms

## Introduction
Processing arrays involves traversing items to compute sums, find extremes (minimum and maximum), or locate specific elements via linear search.

---

## 💻 Full Implementation

```java
public class ArrayAlgorithms {
    public static void main(String[] args) {
        int[] marks = {65, 88, 42, 95, 73, 58, 91};

        // 1. Finding Maximum and Minimum
        int max = marks[0];
        int min = marks[0];
        int sum = 0;

        for (int score : marks) {
            if (score > max) max = score;
            if (score < min) min = score;
            sum += score;
        }

        double average = (double) sum / marks.length;

        System.out.println("Highest Mark: " + max);
        System.out.println("Lowest Mark:  " + min);
        System.out.printf("Average Score: %.2f%n", average);

        // 2. Linear Search Algorithm:
        int target = 95;
        int foundIndex = -1;

        for (int i = 0; i < marks.length; i++) {
            if (marks[i] == target) {
                foundIndex = i;
                break;
            }
        }

        System.out.println("Target " + target + " found at index: " + foundIndex);
    }
}
```
