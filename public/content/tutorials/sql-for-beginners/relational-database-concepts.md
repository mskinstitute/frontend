---
id: relational-database-concepts
slug: relational-database-concepts
course: sql-for-beginners
chapter: Database Fundamentals & RDBMS Architecture
topic: "Relational Database Concepts: Tables, Rows, Columns & Schemas"
difficulty: Beginner
readingTime: 12
order: 2
keywords: ["tables","rows","columns","schema","tuple","attribute","cardinality","degree"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Relational Database Concepts: Tables, Rows, Columns & Schemas
In relational database terminology, data is not saved as loose blobs of text. Instead, every piece of information is stored in an organized structure governed by strict mathematical and relational definitions. Understanding these core building blocks—**Tables, Columns, Rows, and Schemas**—is essential before writing any SQL code.

---

## 1. The Anatomy of a Relational Table

A relational table is a two-dimensional structure consisting of **rows** and **columns**. In theoretical computer science, a table is called a **Relation**, a row is called a **Tuple**, and a column is called an **Attribute**.

```
                       TABLE: students (Relation)
   +------------+--------------------+---------------------+--------------+
   | student_id | first_name         | email               | enroll_year  | <-- Columns
   +------------+--------------------+---------------------+--------------+     (Attributes)
   | 101        | Aarav              | aarav@example.com   | 2026         | <-- Row 1 (Tuple)
   | 102        | Diya               | diya@example.com    | 2025         | <-- Row 2 (Tuple)
   | 103        | Rohan              | rohan@example.com   | 2026         | <-- Row 3 (Tuple)
   +------------+--------------------+---------------------+--------------+
```

### Terminology Comparison: Theory vs Practice

| Theoretical Term (Codd) | Practical SQL Term | Description |
| :--- | :--- | :--- |
| **Relation** | Table | The entire dataset representing an entity (e.g., `students`, `invoices`). |
| **Tuple** | Row / Record | A single horizontal instance of data representing one specific entity. |
| **Attribute** | Column / Field | A vertical column representing a specific property with a defined data type. |
| **Degree (Arity)** | Column Count | The total number of columns in a table. In the table above, degree = 4. |
| **Cardinality** | Row Count | The total number of rows currently stored. In the table above, cardinality = 3. |
| **Domain** | Data Type & Range | The allowable set of values for a column (e.g., integers between 1900 and 2100). |

---

## 2. What is a Database Schema?

A **Database Schema** is the complete architectural blueprint or structural layout of a database. It defines:
1. All table names and their column names.
2. The data type and byte length of each column (e.g., `VARCHAR(100)`, `INT`).
3. Integrity constraints (e.g., `PRIMARY KEY`, `NOT NULL`, `CHECK`).
4. Relationships between tables established via foreign keys.
5. Auxiliary database objects including views, indexes, stored procedures, and triggers.

```sql
-- Visualizing a Schema Definition in SQL DDL:
CREATE TABLE departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_name VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    dept_id INT,
    CONSTRAINT fk_emp_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
```

---

## 3. Physical vs Logical Data Independence

One of the great advantages of an RDBMS is **Data Independence**:
- **Physical Data Independence:** The physical arrangement of files on your server's NVMe SSD or hard disk can change without requiring modifications to your SQL queries.
- **Logical Data Independence:** The logical schema of the database can evolve (such as adding a new optional column or creating a view) without breaking existing client applications that read untouched columns.

---

## 4. Best Practices & Common Pitfalls

- **Plural vs Singular Table Naming:** Adopt a consistent naming convention throughout your organization (e.g., plural `customers`, `orders` or singular `customer`, `order`).
- **Atomic Columns (1NF):** Never store multiple values in a single cell (e.g., `phone_numbers = "9820012345, 9820054321"`). Each column must contain atomic, single-valued entries.
- **Meaningful Identifiers:** Avoid cryptic abbreviations. Choose `customer_registration_date` rather than `c_reg_dt`.

---

# Multiple Choice Questions

### 1. In formal relational database theory, what is a single horizontal record (row) called?
A. Domain
B. Tuple
C. Attribute
D. Degree
**Answer:** B
**Explanation:** In Dr. Codd's formal relational model, a single row representing an instance of an entity is formally termed a "tuple".
---

### 2. If a database table has 6 columns and 1,200 rows, what is the degree and cardinality of the table?
A. Degree = 1,200, Cardinality = 6
B. Degree = 6, Cardinality = 1,200
C. Degree = 7,200, Cardinality = 1,200
D. Degree = 6, Cardinality = 6
**Answer:** B
**Explanation:** Degree represents the number of attributes (columns = 6), while cardinality represents the number of tuples (rows = 1,200).
---

### 3. What does a database schema represent?
A. The physical binary blocks written to the disk drive
B. The structural blueprint and metadata definition of tables, columns, and constraints
C. The temporary memory cache used by the query optimizer
D. The SQL query log file
**Answer:** B
**Explanation:** A database schema defines the formal structure, tables, columns, data types, constraints, and relationships governing the database.
---

### 4. What is meant by "Domain" in relational database terminology?
A. The web address of the database server
B. The allowable set of valid values and data type permitted for an attribute
C. The total storage space available on the database partition
D. The name of the database administrator user
**Answer:** B
**Explanation:** The domain of an attribute is the set of permissible values that can be assigned to that column, enforced by data types and constraints.
---

### 5. Why should multiple phone numbers NOT be stored as a comma-separated string in a single column?
A. MySQL does not support comma characters
B. It violates the atomic value principle of relational design (First Normal Form)
C. It causes the database server to shut down
D. Strings cannot exceed 10 characters in SQL
**Answer:** B
**Explanation:** Storing multiple values in one column violates atomicity (1NF), making indexing, searching, sorting, and updating individual values inefficient and error-prone.
---
