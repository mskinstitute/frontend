---
id: modern-java-records-immutable-data
slug: modern-java-records-immutable-data
course: java-for-intermediate
chapter: 3: Packages, Access Control & Enums
topic: "Modern Java Records (Java 14+) for Immutable Data Modeling"
difficulty: Intermediate
readingTime: 13
order: 14
keywords: ["java records","record java 14","immutable data","boilerplate elimination","dto java"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📋 Modern Java Records (Java 14+) for Immutable Data Modeling

## Introduction
Before Java 14, creating a simple Data Transfer Object (DTO) required 50 lines of boilerplate: private fields, constructors, getters, `toString()`, `equals()`, and `hashCode()`. **Java Records** eliminate this ceremony with a single concise line of code!

---

## ⚡ The Power of Records

A `record` automatically generates:
- Private `final` fields.
- Public canonical constructor.
- Public accessor methods (named `name()`, `rollNumber()`, without the "get" prefix).
- Semantic `equals()`, `hashCode()`, and `toString()`.

```java
// One line defines an immutable data model!
public record StudentDTO(int rollNumber, String fullName, double gpa) {}

public class RecordDemo {
    public static void main(String[] args) {
        StudentDTO student = new StudentDTO(101, "Aarav Sharma", 9.4);

        // Accessors:
        System.out.println("Name: " + student.fullName());
        System.out.println("Roll: " + student.rollNumber());

        // Automatic readable toString():
        System.out.println(student); // StudentDTO[rollNumber=101, fullName=Aarav Sharma, gpa=9.4]

        // Automatic value equality:
        StudentDTO clone = new StudentDTO(101, "Aarav Sharma", 9.4);
        System.out.println("Equal? " + student.equals(clone)); // true!
    }
}
```
