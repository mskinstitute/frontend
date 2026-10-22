---
id: final-keyword-variables-methods-classes
slug: final-keyword-variables-methods-classes
course: java-for-intermediate
chapter: 2: Inheritance, Polymorphism & Abstraction
topic: "The final Keyword: Final Variables, Methods, and Classes"
difficulty: Intermediate
readingTime: 12
order: 8
keywords: ["final keyword java","final variables","final methods","final classes","immutability"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🔒 The final Keyword in Java

## Introduction
The **`final`** modifier in Java restricts modification. Depending on context, it prevents value reassignment, method overriding, or class inheritance.

---

## 🏛️ The Three Applications of `final`

| Applied To | Effect | Example |
|---|---|---|
| **Variable** | Creates a **constant**: cannot be reassigned once initialized | `final double PI = 3.14159;` |
| **Method** | **Prevents overriding** by subclasses | `public final void secureLogin() {}` |
| **Class** | **Prevents inheritance**: class cannot be extended | `public final class SecurityCore {}` |

```java
// Final class: Cannot be subclassed (e.g. java.lang.String is final)
public final class SystemSecurityConfig {
    public static final String CIPHER = "AES-256";

    // Final method: Subclasses cannot alter security verification logic
    public final boolean verifyChecksum(String fileHash) {
        return true;
    }
}
```
