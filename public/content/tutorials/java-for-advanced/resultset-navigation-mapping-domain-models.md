---
id: "java-adv-t5.3"
title: "ResultSet Navigation and Mapping Rows to Java Domain Models"
slug: "resultset-navigation-mapping-domain-models"
course: "Java for Advanced"
chapter: "5: Database Persistence with JDBC"
topic: "ResultSet Navigation and Mapping Rows to Java Domain Models"
difficulty: "Advanced"
readingTime: 15
order: 23
keywords: ["resultset","cursor navigation","data access object","dao pattern","domain mapping"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 📋 ResultSet Navigation and Mapping Rows to Java Domain Models

## Introduction
When a query executes via `executeQuery()`, the database returns a **`ResultSet`**. A `ResultSet` maintains an internal cursor pointing to the current row of data. Navigating this cursor and mapping relational tabular columns to strongly typed Java domain models (POJOs or Records) is the core responsibility of the **Data Access Object (DAO)** layer.

---

## 🔄 Cursor Mechanics

Initially, the `ResultSet` cursor is positioned **before the first row**. Calling `.next()` moves the cursor forward to the next record:

```text
                  [ Before First Row ]  <-- Initial Position
rs.next() ──────► Row 1: [ ID=101 | Name="Aarav" | Marks=92.5 ]
rs.next() ──────► Row 2: [ ID=102 | Name="Neha"  | Marks=88.0 ]
rs.next() ──────► Row 3: [ ID=103 | Name="Rohit" | Marks=76.2 ]
rs.next() ──────► [ After Last Row ]   <-- Returns false, loop terminates
```

---

## 💻 Clean DAO Mapping Pattern

```java
package com.mskinstitute.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

// Immutable Java Record Domain Model
public record StudentRecord(int id, String name, String email, double gpa) {}

public class StudentDAO {
    private final Connection connection;

    public StudentDAO(Connection connection) {
        this.connection = connection;
    }

    public List<StudentRecord> findAllHonorsStudents(double minGpa) throws SQLException {
        String sql = "SELECT id, full_name, email, gpa FROM students WHERE gpa >= ? ORDER BY gpa DESC";
        List<StudentRecord> students = new ArrayList<>();

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setDouble(1, minGpa);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    // Extract columns by name (clean and refactor-safe)
                    int id = rs.getInt("id");
                    String name = rs.getString("full_name");
                    String email = rs.getString("email");
                    double gpa = rs.getDouble("gpa");

                    students.add(new StudentRecord(id, name, email, gpa));
                }
            }
        }
        return students;
    }
}
```
