---
id: operators-arithmetic-relational-logical-java
slug: operators-arithmetic-relational-logical-java
course: java-for-beginners
chapter: 2: Variables, Data Types & Operators
topic: "Arithmetic, Assignment, Relational, and Logical Operators"
difficulty: Beginner
readingTime: 12
order: 9
keywords: ["java operators","arithmetic","relational","logical operators","short circuit evaluation"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🧮 Java Operators: Arithmetic, Relational, and Logical

## Introduction
Operators perform operations on variables and values. Java provides standard arithmetic, relational, and short-circuit logical operators.

---

## ➗ 1. Arithmetic & Compound Operators

| Operator | Description | Example |
|---|---|---|
| `+`, `-`, `*`, `/` | Basic math | `10 / 4` evaluates to `2` (Integer division!) |
| `%` | Modulus (Remainder) | `10 % 3` evaluates to `1` |
| `++`, `--` | Increment / Decrement | `count++` vs `++count` |
| `+=`, `-=`, `*=`, `/=` | Compound assignments | `balance += deposit;` |

---

## ⚖️ 2. Relational & Equality Operators

Evaluate to `true` or `false`:
- `==` : Equal to
- `!=` : Not equal to
- `>`, `>=` : Greater than / Greater than or equal to
- `<`, `<=` : Less than / Less than or equal to

---

## 💡 3. Logical Operators & Short-Circuit Evaluation

- **`&&` (Logical AND)**: Returns `true` only if both conditions are `true`. If left operand is `false`, the right operand is **skipped entirely**.
- **`||` (Logical OR)**: Returns `true` if at least one condition is `true`. If left operand is `true`, the right operand is **skipped entirely**.
- **`!` (Logical NOT)**: Inverts boolean truth.

```java
public class OperatorDemo {
    public static void main(String[] args) {
        int score = 78;
        int attendancePercentage = 85;

        boolean isEligibleForExam = (score >= 40) && (attendancePercentage >= 75);

        System.out.println("Eligible for Exam: " + isEligibleForExam);
    }
}
```
