---
id: package-architecture-import-statements
slug: package-architecture-import-statements
course: java-for-intermediate
chapter: 3: Packages, Access Control & Enums
topic: "Package Architecture, package Declaration, and import Statements"
difficulty: Intermediate
readingTime: 12
order: 11
keywords: ["java packages","package declaration","import statements","namespace management","classpath"]
lastUpdated: 2026-10-22
author: MSK Institute
version: 1.0.0
---

# 📦 Package Architecture and import Statements

## Introduction
A **package** in Java organizes related classes, interfaces, and sub-packages into namespaces, preventing naming collisions and grouping business domain code.

---

## 🏛️ Directory Mapping & The Reverse-Domain Convention

In Java, package hierarchies map directly to physical directory paths on disk:

```text
Package Declaration: package in.mskinstitute.portal.admissions;
Directory on Disk:   in/mskinstitute/portal/admissions/StudentRegistry.java
```

---

## 💻 Syntax & Importing

```java
// 1. Package declaration MUST be the first non-comment line
package in.mskinstitute.courses;

// 2. Import specific class (Recommended):
import java.util.ArrayList;
import java.time.LocalDate;

// 3. Static import (Imports static members directly):
import static java.lang.Math.PI;
import static java.lang.Math.sqrt;

public class CourseSchedule {
    public static void main(String[] args) {
        ArrayList<String> batches = new ArrayList<>();
        batches.add("Java Morning Batch");

        // Static import in action:
        double area = PI * sqrt(25);
        System.out.println("Computed: " + area);
    }
}
```
