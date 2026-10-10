---
id: project-student-information-system
slug: project-student-information-system
course: sql-for-beginners
chapter: Practical Capstone Projects
topic: "Project 1: Student Information System Database Architecture"
difficulty: Beginner
readingTime: 15
order: 54
keywords: ["student management system","database capstone","schema design","sql project","ddl dml dql"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Project 1: Student Information System Database Architecture
Welcome to your first practical capstone project! In this project, you will step into the shoes of a Lead Database Architect tasked with designing, implementing, and querying a production-ready **Student Information System (SIS)** for MSK Tech Academy. 

This project integrates every concept you have learned across Level 1: DDL database and table creation, constraints, foreign keys, DML data population, multi-column sorting, scalar functions, and aggregation with `GROUP BY` and `HAVING`.

---

## 1. Project Requirements & Architecture

Our educational institute requires tracking:
1. **Departments / Branches** (e.g., Computer Science, Data Science, Cyber Security).
2. **Students** (Personal details, enrollment dates, active statuses).
3. **Courses & Enrollments** (Course fees, grades, student-course mappings).

```
   +--------------------+          +--------------------+
   |    departments     |          |      students      |
   +--------------------+          +--------------------+
   | dept_id (PK)       | <------- | student_id (PK)    |
   | dept_name          |    1:N   | full_name          |
   +--------------------+          | email (UQ)         |
                                   | dept_id (FK)       |
                                   | fee_balance        |
                                   +--------------------+
```

---

## 2. Step 1: Schema Creation (DDL)

Copy and execute this script in MySQL Workbench or CLI:

```sql
-- Create and switch to project database
CREATE DATABASE IF NOT EXISTS msk_student_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE msk_student_system;

-- Table 1: Academic Departments
CREATE TABLE IF NOT EXISTS departments (
    dept_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    head_of_dept VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

-- Table 2: Student Directory
CREATE TABLE IF NOT EXISTS students (
    student_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    dept_id INT UNSIGNED NOT NULL,
    fee_balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    academic_status ENUM('Active', 'Graduated', 'Suspended') NOT NULL DEFAULT 'Active',
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_student_email UNIQUE (email),
    CONSTRAINT chk_positive_balance CHECK (fee_balance >= 0.00),
    CONSTRAINT fk_students_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB;
```

---

## 3. Step 2: Data Population (DML)

```sql
-- Populate Departments:
INSERT INTO departments (dept_name, head_of_dept) VALUES
    ('Computer Science', 'Dr. Ramesh Kulkarni'),
    ('Data Science & AI', 'Dr. Sunita Sharma'),
    ('Full Stack Engineering', 'Prof. Amit Roy');

-- Batch Insert Student Records:
INSERT INTO students (first_name, last_name, email, date_of_birth, dept_id, fee_balance, academic_status, enrolled_at) VALUES
    ('Aarav', 'Sharma', 'aarav.s@msk.in', '2004-05-12', 1, 0.00, 'Active', '2025-08-01 10:00:00'),
    ('Diya', 'Patel', 'diya.p@msk.in', '2005-02-18', 2, 12500.00, 'Active', '2025-08-05 11:30:00'),
    ('Rohan', 'Verma', 'rohan.v@msk.in', '2003-11-25', 1, 4500.00, 'Active', '2025-08-01 14:00:00'),
    ('Ananya', 'Gupta', 'ananya.g@msk.in', '2004-09-03', 2, 0.00, 'Active', '2025-08-10 09:15:00'),
    ('Kabir', 'Mehta', 'kabir.m@msk.in', '2002-07-14', 3, 22000.00, 'Active', '2024-07-15 10:00:00'),
    ('Sneha', 'Deshmukh', 'sneha.d@msk.in', '2004-12-30', 1, 8000.00, 'Suspended', '2025-08-02 12:00:00'),
    ('Ishaan', 'Nair', 'ishaan.n@msk.in', '2005-04-05', 3, 0.00, 'Graduated', '2024-01-10 10:00:00');
```

---

## 4. Step 3: Analytical Business Queries (DQL)

Now, let us write the queries that the academy's executive directors and administrative staff use daily:

```sql
-- Query 1: Outstanding Fee Collection Report
-- Find all active students who owe fees, ordered from highest balance to lowest:
SELECT 
    student_id,
    CONCAT(first_name, ' ', last_name) AS student_name,
    email,
    fee_balance
FROM students
WHERE academic_status = 'Active' 
  AND fee_balance > 0.00
ORDER BY fee_balance DESC;

-- Query 2: Department Enrollment & Financial Breakdown
-- Compute student count and total pending fee balance per department:
SELECT 
    dept_id,
    COUNT(*) AS total_students,
    SUM(fee_balance) AS total_pending_fees,
    AVG(fee_balance) AS average_pending_fee,
    MAX(fee_balance) AS highest_individual_debt
FROM students
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY total_pending_fees DESC;

-- Query 3: Student Age Calculation & Verification
-- Calculate the current age of each student in years:
SELECT 
    student_id,
    CONCAT(first_name, ' ', last_name) AS full_name,
    date_of_birth,
    TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS calculated_age
FROM students
ORDER BY calculated_age ASC;
```

---

## 5. Capstone Review & Takeaways

You have designed a normalized database from scratch! It features:
- Referential integrity linking students to departments.
- Automatic default values and check constraints enforcing positive fee balances.
- Optimized queries that calculate summaries and filter aggregates cleanly.

---

# Multiple Choice Questions

### 1. In our student system schema, why is `ON DELETE RESTRICT` specified on the foreign key linking students to departments?
A. To prevent students from registering
B. To prevent an administrator from accidentally deleting a department while enrolled students are still assigned to it
C. To encrypt student names
D. To make the database read-only
**Answer:** B
**Explanation:** `RESTRICT` enforces referential integrity by blocking the deletion of any department record that is still referenced by existing student rows.
---

### 2. Which constraint guarantees that no two students can register with the exact same email address?
A. CHECK
B. UNIQUE
C. DEFAULT
D. FOREIGN KEY
**Answer:** B
**Explanation:** The `UNIQUE` constraint on the `email` column prevents duplicate entries, ensuring each student account has a distinct email.
---

### 3. What does `TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())` calculate?
A. The year the student was born
B. The exact current age of the student in completed years
C. The number of days until graduation
D. The total fee balance
**Answer:** B
**Explanation:** `TIMESTAMPDIFF(YEAR, date1, date2)` accurately calculates the completed number of calendar years elapsed between the two dates.
---

### 4. What will happen if an administrative script attempts to insert a student with a negative `fee_balance = -500.00`?
A. MySQL sets the balance to 0.00
B. The query fails with error 3819 because it violates the `chk_positive_balance` CHECK constraint
C. The student receives a refund
D. The table is locked
**Answer:** B
**Explanation:** The `CHECK (fee_balance >= 0.00)` constraint actively rejects any insertion or update that attempts to store a negative fee balance.
---

### 5. In Query 2, what does `HAVING COUNT(*) >= 2` accomplish?
A. It filters out departments that have fewer than 2 students from the summary output
B. It limits the output to 2 total rows
C. It inserts 2 new students
D. It sorts the results by 2
**Answer:** A
**Explanation:** The `HAVING` clause filters the aggregated department groups, displaying only those containing 2 or more enrolled students.
---
