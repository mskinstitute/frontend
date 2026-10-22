---
id: checked-vs-unchecked-exceptions
slug: checked-vs-unchecked-exceptions
course: java-for-intermediate
chapter: 4: Exception Handling & Robustness
topic: "Checked vs Unchecked Exceptions"
difficulty: Intermediate
readingTime: 12
order: 16
keywords: ["checked exceptions","unchecked exceptions","runtime exceptions","compile time check","throws clause"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# ⚖️ Checked vs Unchecked Exceptions in Java

## Introduction
Java is unique among major languages in enforcing **Checked Exceptions** at compile time.

---

## 🆚 Comparison Matrix

| Property | Checked Exceptions | Unchecked Exceptions (`RuntimeException`) |
|---|---|---|
| When Checked | At **Compile Time** | At **Runtime** |
| Subclass Of | `java.lang.Exception` (excluding `RuntimeException`) | `java.lang.RuntimeException` |
| Compiler Requirement | **Mandatory**: Must catch with `try-catch` or declare with `throws` | **Optional**: Compiler does not force handling |
| Common Examples | `IOException`, `SQLException`, `FileNotFoundException` | `NullPointerException`, `ArithmeticException`, `IllegalArgumentException` |
| Meaning | Recoverable external failure (e.g., network down, missing file) | Programmer coding defect or invariant violation |
