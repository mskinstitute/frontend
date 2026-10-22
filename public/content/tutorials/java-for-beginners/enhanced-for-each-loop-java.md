---
id: enhanced-for-each-loop-java
slug: enhanced-for-each-loop-java
course: java-for-beginners
chapter: 4: Loops and Iterations
topic: "Enhanced for-each Loop for Arrays and Collections"
difficulty: Beginner
readingTime: 12
order: 18
keywords: ["for each java","enhanced for loop","array traversal","collection iteration","clean code"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Enhanced for-each Loop in Java

## Introduction
Introduced in Java 5, the **enhanced for-each loop** simplifies iterating over arrays and collections without managing index variables or array length checks.

---

## 📝 Syntax

```text
for (Type element : collectionOrArray) {
    // Process element directly
}
```

```java
public class ForEachDemo {
    public static void main(String[] args) {
        String[] subjects = {"Java Core", "OOP Principles", "Data Structures", "Spring Boot"};

        System.out.println("Curriculum Subjects:");
        for (String subject : subjects) {
            System.out.println(" • " + subject);
        }

        // Computing total sum of an array:
        int[] scores = {85, 92, 78, 96, 88};
        int total = 0;
        for (int score : scores) {
            total += score;
        }
        System.out.println("Total Score: " + total);
    }
}
```

---

## 💡 When to Use Standard `for` vs `for-each`
- Use **`for-each`** by default whenever you just need to inspect or read elements.
- Use traditional **indexed `for`** if you need the element index (`i`) or need to modify array elements in-place.
