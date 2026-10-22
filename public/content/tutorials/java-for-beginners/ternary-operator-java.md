---
id: ternary-operator-java
slug: ternary-operator-java
course: java-for-beginners
chapter: 3: Control Flow & Decision Making
topic: "Ternary Operator (? :)"
difficulty: Beginner
readingTime: 11
order: 12
keywords: ["ternary operator java","conditional operator","inline condition","clean code"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ❓ The Java Ternary Operator (? :)

## Introduction
The ternary operator is an inline conditional expression that returns a value based on a boolean check.

---

## ⚙️ Syntax

```text
variable = (condition) ? expression_if_true : expression_if_false;
```

```java
public class TernaryDemo {
    public static void main(String[] args) {
        int marks = 68;

        // Inline conditional assignment:
        String status = (marks >= 40) ? "Passed" : "Failed";
        System.out.println("Exam Status: " + status);

        // Finding maximum of two numbers:
        int num1 = 45, num2 = 82;
        int max = (num1 > num2) ? num1 : num2;
        System.out.println("Max number: " + max);
    }
}
```

---

## ⚠️ Readability Warning
Use ternary operators only for simple, one-line assignments. Avoid nesting ternary operators (`a ? b : c ? d : e`) as it damages code readability.
