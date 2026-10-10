---
id: python-intermediate-introduction-to-databases
slug: introduction-to-databases
course: python-for-intermediate
chapter: "11: Database Basics with SQLite"
topic: "11.1 Introduction to Databases"
title: "Introduction to Databases in Python"
description: "Master introduction to databases in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 51
keywords:
  - python introduction to databases
  - python intermediate
  - python introduction to databases
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Introduction to Databases in Python

In earlier chapters, we persisted application data using flat files such as plain text, CSV, and JSON. While flat files are adequate for basic storage and configurations, modern software applications require concurrent access, complex relationships, relational integrity, and fast querying across millions of records. This is where **Databases** become indispensable.

---

## 1. Why Flat Files (CSV / JSON) Fall Short

| Challenge | Flat File Limitation | Database Solution |
| :--- | :--- | :--- |
| **Concurrency** | If two threads write to a file simultaneously, corruption or race conditions occur. | Built-in locking mechanisms and multi-user concurrency control. |
| **Query Speed** | Finding one record requires reading and scanning the entire file into memory ($O(n)$). | **B-Tree Indexes** allow searching millions of rows in milliseconds ($O(\log n)$). |
| **Data Integrity** | Any malformed string can be written, corrupting formats. | Strict schemas, constraints (`NOT NULL`, `UNIQUE`), and type validation. |
| **Atomicity** | A crash halfway through writing leaves partial, corrupt data. | **ACID Transactions** guarantee all-or-nothing execution. |

---

## 2. What is an RDBMS?

A **Relational Database Management System (RDBMS)** organizes data into structured two-dimensional **Tables** (also called relations).
- **Table**: A collection of related data entries consisting of columns and rows.
- **Column (Field / Attribute)**: Defines a specific property (e.g., `email`, `salary`, `date_of_birth`) and its data type.
- **Row (Record / Tuple)**: Represents a single, distinct data entity instance.
- **Primary Key (PK)**: A unique identifier guaranteeing that every row in the table can be distinguished (e.g. `user_id` or `isbn`).
- **Foreign Key (FK)**: A column in one table that links directly to the Primary Key of another table, establishing relational associations.

---

## 3. SQL: The Universal Language of Databases

**SQL (Structured Query Language)** is the standardized domain-specific language used to query, define, and mutate relational databases. SQL commands are traditionally categorized into:

### 1. Data Definition Language (DDL)
Defines the schema and structure of tables:
```sql
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    gpa REAL CHECK(gpa >= 0.0 AND gpa <= 4.0),
    enrolled_date TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Data Manipulation Language (DML)
Interacts with the rows inside existing tables:
```sql
-- Create (Insert)
INSERT INTO students (full_name, email, gpa) VALUES ('Aarav Sharma', 'aarav@example.com', 3.85);

-- Read (Select)
SELECT full_name, gpa FROM students WHERE gpa >= 3.5;

-- Update
UPDATE students SET gpa = 3.90 WHERE email = 'aarav@example.com';

-- Delete
DELETE FROM students WHERE student_id = 1;
```

---

## 4. What is SQLite?

**SQLite** is the most widely deployed SQL database engine in the world, embedded in billions of smartphones, web browsers, operating systems, and IoT devices.

Key advantages of SQLite:
1. **Serverless**: Unlike client-server databases (like PostgreSQL or MySQL) that require running a background daemon process, opening network ports, and managing user credentials, SQLite reads and writes directly to a regular disk file.
2. **Zero Configuration**: No installation, configuration, or administrator service management needed.
3. **Single Disk File**: An entire database—with multiple tables, indexes, triggers, and schemas—is stored in a single cross-platform `.db` or `.sqlite` file.
4. **Built into Python**: Python provides the **`sqlite3`** module in its standard library—ready to use out of the box with zero external dependencies!

---

## 5. ACID Properties: The Reliability Guarantee

All production-grade relational databases adhere to ACID guarantees:
- **A - Atomicity**: All operations in a transaction succeed together, or all are rolled back.
- **C - Consistency**: Data must always adhere to defined constraints, rules, and triggers.
- **I - Isolation**: Concurrent transactions execute independently without interfering with each other.
- **D - Durability**: Once a transaction is committed, changes are permanently written to non-volatile disk.

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Storing Everything in Flat Files
Using flat CSV/JSON files for applications with frequent concurrent writes leads to file lock collisions and data corruption. Relational databases provide ACID transaction guarantees.

### 2. Missing Primary Keys
Every database table should have an unambiguous primary key (such as an auto-incrementing integer or UUID) to uniquely identify records and facilitate indexing.

---

---

## 💻 Try It Yourself: Database Schema Design

### Scenario
Design a SQL `CREATE TABLE` schema for an e-commerce order management system including primary key, foreign key references, and data validation constraints.

### Complete Solution
```sql
-- SQL Schema for Customer Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT NOT NULL DEFAULT (datetime('now')),
    total_amount REAL NOT NULL CHECK(total_amount >= 0.0),
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'PAID', 'SHIPPED', 'CANCELLED')),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

---

## Practice Quiz

### 1. What is the primary purpose of a Primary Key in a relational database table?
A. To encrypt confidential passwords
B. To uniquely identify each individual row within the table
C. To format text into uppercase letters
D. To compress database size on disk
**Answer:** B
**Explanation:** A Primary Key is a unique column or set of columns that uniquely identifies every record in a relational database table.
---

### 2. Why is SQLite described as "serverless"?
A. It runs exclusively in the cloud
B. It does not require a standalone background server process; the engine runs embedded inside the host application and reads directly from a disk file
C. It cannot store data permanently
D. It only works when disconnected from the internet
**Answer:** B
**Explanation:** SQLite is serverless because it requires no separate database server process; the entire engine is compiled directly into the application process.
---

### 3. What does the "A" stand for in the database ACID reliability model?
A. Asynchronous
B. Atomicity
C. Authorization
D. Allocation
**Answer:** B
**Explanation:** Atomicity guarantees that a transaction's operations are treated as a single atomic unit—either all succeed or all are rolled back.
---

### 4. Which SQL command is used to retrieve data from a database table?
A. `GET`
B. `FETCH`
C. `SELECT`
D. `RETRIEVE`
**Answer:** C
**Explanation:** `SELECT` is the standard SQL statement used to query and retrieve records from tables.
---

### 5. Why is indexing essential when querying millions of records in a database compared to a CSV file?
A. Indexes eliminate the need for hard drives
B. Indexes allow searching data in $O(\log n)$ logarithmic time instead of scanning every single row linearly ($O(n)$)
C. Indexes convert SQL queries into HTML
D. Indexes prevent users from deleting rows
**Answer:** B
**Explanation:** Database indexes use balanced search trees (B-Trees) to locate matching rows in logarithmic time, whereas searching a flat CSV file requires a linear scan of every line.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **SQLite Installation & Setup** (11: Database Basics with SQLite).

👉 **[Continue to Next Lesson: SQLite Installation & Setup →](/tutorials/python-for-intermediate/sqlite-installation-setup)**
