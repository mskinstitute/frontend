---
id: modern-switch-expressions-arrow-yield
slug: modern-switch-expressions-arrow-yield
course: java-for-beginners
chapter: 3: Control Flow & Decision Making
topic: "Modern Java Switch Expressions (Arrow Syntax & yield)"
difficulty: Beginner
readingTime: 13
order: 14
keywords: ["switch expressions","arrow syntax","yield java","modern java","java 14 switch"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🚀 Modern Java Switch Expressions (Arrow Syntax & yield)

## Introduction
Introduced in Java 14, **Switch Expressions** modernize branching syntax: they eliminate accidental fallthrough, allow `switch` to **return a value directly**, and use clean arrow syntax (`->`).

---

## 🎯 Arrow Syntax (`->`) Without `break`

```java
public class ModernSwitchDemo {
    public static void main(String[] args) {
        int dayOfWeek = 3;

        // Switch returning a value directly!
        String dayType = switch (dayOfWeek) {
            case 1, 2, 3, 4, 5 -> "Weekday (Classes Active)";
            case 6, 7 -> "Weekend (Lab Sessions Only)";
            default -> "Invalid Day Number";
        };

        System.out.println("Day Status: " + dayType);
    }
}
```

---

## 🌾 The `yield` Statement for Multi-Line Blocks

When a switch branch requires multiple statements before yielding a value, use **`yield`**:

```java
public class YieldDemo {
    public static void main(String[] args) {
        String courseCode = "JAVA_BEG";

        double fee = switch (courseCode) {
            case "C_BEG" -> 2499.0;
            case "CPP_BEG" -> 2999.0;
            case "JAVA_BEG" -> {
                double base = 3499.0;
                double discount = 500.0;
                yield base - discount; // Returns 2999.0 from block!
            }
            default -> 0.0;
        };

        System.out.println("Calculated Fee: ₹" + fee);
    }
}
```
