---
id: essential-string-methods-java
slug: essential-string-methods-java
course: java-for-beginners
chapter: 6: String Handling & Text Manipulation
topic: "Essential String Methods (substring, indexOf, replace, split, trim)"
difficulty: Beginner
readingTime: 13
order: 27
keywords: ["string methods java","substring","indexOf","split","replace","trim","strip"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧰 Essential String Methods in Java

## Introduction
Java's `String` class includes rich built-in utility methods for parsing, inspecting, and transforming text.

---

## 💻 Essential Methods Demonstration

```java
public class StringMethodsDemo {
    public static void main(String[] args) {
        String institute = "  MSK Institute of Technology, Shikohabad  ";

        // 1. Length & Trimming
        System.out.println("Length: " + institute.length());
        String cleaned = institute.trim(); // or .strip() in Java 11+
        System.out.println("Cleaned: '" + cleaned + "'");

        // 2. Case Conversion
        System.out.println("Upper: " + cleaned.toUpperCase());
        System.out.println("Lower: " + cleaned.toLowerCase());

        // 3. Search: indexOf and contains
        System.out.println("Contains 'Institute': " + cleaned.contains("Institute"));
        int commaPos = cleaned.indexOf(',');
        System.out.println("Comma index: " + commaPos);

        // 4. Substring: substring(start, end)
        String title = cleaned.substring(0, commaPos);
        System.out.println("Title: " + title);

        // 5. Replace
        String replaced = cleaned.replace("Shikohabad", "Main Campus");
        System.out.println("Replaced: " + replaced);

        // 6. Splitting text:
        String csvData = "Roll_101,Aarav,Java_Beginners,Passed";
        String[] tokens = csvData.split(",");
        System.out.println("Student Name: " + tokens[1]);
    }
}
```
