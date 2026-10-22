---
id: arrays-utility-class-methods
slug: arrays-utility-class-methods
course: java-for-beginners
chapter: 5: Arrays & Array Utilities
topic: "The java.util.Arrays Utility Class (sort, binarySearch, toString, copyOf)"
difficulty: Beginner
readingTime: 13
order: 24
keywords: ["java.util.Arrays","Arrays.sort","Arrays.binarySearch","Arrays.toString","Arrays.copyOf"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🛠️ The java.util.Arrays Utility Class

## Introduction
The **`java.util.Arrays`** class provides static helper methods to manipulate, sort, search, format, and clone arrays without writing manual algorithms.

---

## 📚 Essential Methods

```java
import java.util.Arrays;

public class ArraysUtilDemo {
    public static void main(String[] args) {
        int[] numbers = {45, 12, 89, 33, 7, 62};

        // 1. Formatting Array to String:
        System.out.println("Original: " + Arrays.toString(numbers));

        // 2. Sorting using Dual-Pivot Quicksort:
        Arrays.sort(numbers);
        System.out.println("Sorted:   " + Arrays.toString(numbers));

        // 3. Binary Search (Prerequisite: Array must be sorted!):
        int target = 33;
        int idx = Arrays.binarySearch(numbers, target);
        System.out.println("Index of " + target + ": " + idx);

        // 4. Copying and Resizing:
        int[] expanded = Arrays.copyOf(numbers, 10);
        System.out.println("Expanded (length 10): " + Arrays.toString(expanded));

        // 5. Fill with constant:
        int[] initialized = new int[5];
        Arrays.fill(initialized, -1);
        System.out.println("Filled with -1: " + Arrays.toString(initialized));
    }
}
```
