---
id: "java-adv-t7.2"
title: "Capstone 2: Student ERP System with JDBC, PreparedStatement, and MySQL"
slug: "project-2-student-erp-jdbc-mysql"
course: "Java for Advanced"
chapter: "7: Enterprise Capstone Projects"
topic: "Capstone 2: Student ERP System with JDBC, PreparedStatement, and MySQL"
difficulty: "Advanced"
readingTime: 22
order: 30
keywords: ["capstone project","student erp","jdbc","dao architecture","mysql","transactional enrollment"]
lastUpdated: "2025-01-15"
author: "MSK Institute"
version: "1.0.0"
---

# 🎓 Capstone 2: Student ERP System with JDBC, PreparedStatement, and MySQL

## Project Overview
In this enterprise capstone, we construct an end-to-end **Student ERP Persistence Layer**. The solution features strict adherence to the **Data Access Object (DAO) Pattern**, parameterized **PreparedStatement queries**, and **transaction-safe multi-table enrollment** preventing partial database state corruption.

---

## 🏛️ Domain Model & Database Schema

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE course_enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fee_paid DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

---

## 💻 Complete Production DAO Implementation

```java
package com.mskinstitute.capstone2;

import java.sql.*;
import java.util.*;

public class StudentERPService {

    public record Student(int id, String name, String email, String phone) {}
    public record Enrollment(int studentId, String courseCode, double fee) {}

    private final Connection connection;

    public StudentERPService(Connection connection) {
        this.connection = connection;
    }

    /**
     * Executes atomic student creation and course enrollment within a single transaction boundary.
     */
    public int registerAndEnrollStudent(String name, String email, String phone, 
                                        String courseCode, double fee) throws SQLException {
        String studentSql = "INSERT INTO students (full_name, email, phone) VALUES (?, ?, ?)";
        String enrollSql  = "INSERT INTO course_enrollments (student_id, course_code, fee_paid) VALUES (?, ?, ?)";

        // 1. Begin Transaction
        connection.setAutoCommit(false);

        try (PreparedStatement studentStmt = connection.prepareStatement(studentSql, Statement.RETURN_GENERATED_KEYS);
             PreparedStatement enrollStmt  = connection.prepareStatement(enrollSql)) {

            // Insert Student Record
            studentStmt.setString(1, name);
            studentStmt.setString(2, email);
            studentStmt.setString(3, phone);
            studentStmt.executeUpdate();

            // Retrieve Auto-Generated Primary Key
            int newStudentId = -1;
            try (ResultSet generatedKeys = studentStmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    newStudentId = generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Failed to obtain generated student ID!");
                }
            }

            // Insert Enrollment Record
            enrollStmt.setInt(1, newStudentId);
            enrollStmt.setString(2, courseCode);
            enrollStmt.setDouble(3, fee);
            enrollStmt.executeUpdate();

            // 2. Commit Transaction
            connection.commit();
            System.out.printf("✅ Successfully enrolled student ID #%d into %s!%n", newStudentId, courseCode);
            return newStudentId;

        } catch (SQLException ex) {
            // 3. Rollback on Failure
            System.err.println("❌ Enrollment failed, triggering rollback: " + ex.getMessage());
            connection.rollback();
            throw ex;
        } finally {
            // 4. Restore Auto-Commit
            connection.setAutoCommit(true);
        }
    }

    /**
     * Queries active enrollments with safe column mapping.
     */
    public List<Student> searchStudentsByName(String searchTerm) throws SQLException {
        String sql = "SELECT id, full_name, email, phone FROM students WHERE full_name LIKE ? ORDER BY full_name ASC";
        List<Student> list = new ArrayList<>();

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, "%" + searchTerm + "%");
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(new Student(
                        rs.getInt("id"),
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("phone")
                    ));
                }
            }
        }
        return list;
    }
}
```
