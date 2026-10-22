---
id: java-enums-fields-methods
slug: java-enums-fields-methods
course: java-for-intermediate
chapter: 3: Packages, Access Control & Enums
topic: "Java Enums: Defining Enum Types with Custom Fields and Methods"
difficulty: Intermediate
readingTime: 13
order: 13
keywords: ["java enum","enumerated types","enum with fields","type safe constants","switch with enum"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 🏷️ Java Enums: Fields, Constructors, and Methods

## Introduction
Unlike enums in C/C++ which are merely named integers, a **Java Enum** is a full-fledged class. Enums provide type-safe constants and can contain fields, constructors, and methods.

---

## 💻 Rich Enum Implementation

```java
public enum CourseLevel {
    BEGINNER("Level 1: Core Fundamentals", 2499.0),
    INTERMEDIATE("Level 2: OOP & Collections", 3499.0),
    ADVANCED("Level 3: Concurrency & Architecture", 4499.0);

    private final String description;
    private final double fee;

    // Enum constructor is private by default
    CourseLevel(String desc, double price) {
        this.description = desc;
        this.fee = price;
    }

    public String getDescription() { return description; }
    public double getFee() { return fee; }

    public static void main(String[] args) {
        // Iterating through all enum values:
        for (CourseLevel level : CourseLevel.values()) {
            System.out.printf("[%s] %s - Fee: ₹%,.2f%n", 
                level.name(), level.getDescription(), level.getFee());
        }

        // Clean usage in Switch statements:
        CourseLevel selected = CourseLevel.INTERMEDIATE;
        switch (selected) {
            case BEGINNER -> System.out.println("Starting your journey!");
            case INTERMEDIATE -> System.out.println("Diving into OOP & Collections!");
            case ADVANCED -> System.out.println("Mastering Enterprise Architecture!");
        }
    }
}
```
