---
id: if-else-decision-ladders-java
slug: if-else-decision-ladders-java
course: java-for-beginners
chapter: 3: Control Flow & Decision Making
topic: "if, if-else, and if-else-if Decision Ladders"
difficulty: Beginner
readingTime: 12
order: 11
keywords: ["if else java","decision making","conditional logic","nested if","grade calculation"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🌿 if, if-else, and Decision Ladders in Java

## Introduction
Control flow statements determine the path of execution based on boolean conditions. The `if-else-if` ladder checks conditions sequentially from top to bottom, executing the first branch that evaluates to `true`.

---

## 🏛️ Syntax & Structure

```java
public class GradingSystem {
    public static void main(String[] args) {
        int percentage = 84;

        if (percentage >= 90) {
            System.out.println("Grade: A+ (Outstanding Honors)");
        } else if (percentage >= 75) {
            System.out.println("Grade: A (First Class with Distinction)");
        } else if (percentage >= 60) {
            System.out.println("Grade: B (First Class)");
        } else if (percentage >= 40) {
            System.out.println("Grade: C (Pass)");
        } else {
            System.out.println("Grade: F (Failed - Remedial Required)");
        }
    }
}
```

---

## 💡 Best Practices:
1. Always enclose conditional blocks in curly braces `{}`, even for single statements. Omitting braces is a frequent source of bugs.
2. Order conditions from most specific to most general in `if-else-if` ladders.
