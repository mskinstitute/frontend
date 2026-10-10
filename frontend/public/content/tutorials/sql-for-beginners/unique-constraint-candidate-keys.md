---
id: unique-constraint-candidate-keys
slug: unique-constraint-candidate-keys
course: sql-for-beginners
chapter: Data Integrity & Table Constraints
topic: "UNIQUE Constraint & Candidate Keys: Guaranteeing Distinctness"
difficulty: Beginner
readingTime: 12
order: 25
keywords: ["unique constraint","candidate keys","primary key vs unique","composite unique","preventing duplicates"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# UNIQUE Constraint & Candidate Keys: Guaranteeing Distinctness
While a table can have only one Primary Key, real-world entities frequently possess multiple attributes that must be unique across the entire database. For example, in a user registration system, every user has an auto-incremented `user_id` (Primary Key), but their **email address**, **username**, and **phone number** must also be strictly unique. This is enforced using **`UNIQUE` Constraints**.

---

## 1. What is a UNIQUE Constraint?

A **`UNIQUE` constraint** guarantees that all values in a column (or group of columns) are distinct. If an `INSERT` or `UPDATE` statement attempts to store a duplicate value, MySQL halts the transaction with error **1062 (Duplicate entry)**.

```sql
CREATE TABLE registered_users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    
    -- Table-level UNIQUE constraint with custom name:
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone UNIQUE (phone_number)
);
```

---

## 2. Primary Key vs UNIQUE Constraint

| Feature | Primary Key | UNIQUE Constraint |
| :--- | :--- | :--- |
| **Quantity Allowed** | **Strictly 1** per table. | **Multiple** allowed per table. |
| **Allows NULL?** | **Never** (`NOT NULL` is strictly enforced). | **Yes!** (A UNIQUE column can contain `NULL` unless explicitly declared `NOT NULL`). |
| **Index Created** | Automatically creates a **Clustered Index** in InnoDB. | Automatically creates a **Secondary Unique B-Tree Index**. |
| **Purpose** | Primary row identifier for table organization and foreign keys. | Guarantees business uniqueness across secondary attributes. |

### The `NULL` Exception in Unique Constraints
In MySQL InnoDB, multiple rows can store **`NULL`** in a `UNIQUE` column without violating the constraint! Because each `NULL` mathematically represents an *unknown* value, one unknown is never considered equal to another unknown.

```sql
-- In registered_users, phone_number has a UNIQUE constraint.
-- Both inserts succeed:
INSERT INTO registered_users (username, email, phone_number) VALUES ('user1', 'u1@test.com', NULL);
INSERT INTO registered_users (username, email, phone_number) VALUES ('user2', 'u2@test.com', NULL);
```

---

## 3. What are Candidate Keys?

In relational database theory, any column (or set of columns) capable of uniquely identifying a row is called a **Candidate Key**:
- One candidate key is chosen by the architect as the **Primary Key**.
- All remaining candidate keys are enforced as **Alternate Keys** using **`UNIQUE` constraints**.

---

## 4. Composite UNIQUE Constraints

A **Composite UNIQUE Constraint** enforces uniqueness across the *combination* of multiple columns:

```sql
-- Course Enrollments: A student can enroll in multiple courses,
-- and a course has multiple students, but a student cannot enroll in 
-- the SAME course twice!
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_date DATE NOT NULL,
    
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);
```

---

## 5. Adding and Dropping UNIQUE Constraints

```sql
-- Add unique constraint to existing table:
ALTER TABLE registered_users
ADD CONSTRAINT uq_user_tax_id UNIQUE (tax_id);

-- Drop a unique constraint (In MySQL, you drop the underlying index):
ALTER TABLE registered_users
DROP INDEX uq_user_tax_id;
```

---

## 6. Best Practices & Common Pitfalls

- **Always Name Your Constraints:** Always write `CONSTRAINT uq_table_column UNIQUE (col)` rather than inline `UNIQUE`. Naming your constraints makes debugging production error logs and dropping constraints via migrations straightforward.
- **Automatic Index Creation:** Remember that every `UNIQUE` constraint creates an underlying B-Tree index. While this speeds up lookups, unnecessary unique indexes add write overhead on `INSERT` and `UPDATE` operations.

---

# Multiple Choice Questions

### 1. How many Primary Keys vs UNIQUE constraints can a single MySQL table possess?
A. Exactly 1 Primary Key, and up to 1 UNIQUE constraint
B. Exactly 1 Primary Key, and multiple UNIQUE constraints
C. Multiple Primary Keys, but only 1 UNIQUE constraint
D. Unlimited Primary Keys and unlimited UNIQUE constraints
**Answer:** B
**Explanation:** A relational table can have only one Primary Key, but can feature multiple independent UNIQUE constraints.
---

### 2. What happens in MySQL when multiple rows store `NULL` in a column with a UNIQUE constraint (assuming it is not marked NOT NULL)?
A. MySQL throws a duplicate key error on the second row
B. All inserts succeed because MySQL treats each NULL as distinct and unknown
C. The column values are converted to 0
D. The table locks permanently
**Answer:** B
**Explanation:** Standard SQL and MySQL permit multiple `NULL` entries in a `UNIQUE` column because `NULL` represents an unknown value that cannot equal another `NULL`.
---

### 3. What underlying database structure does MySQL automatically generate when a UNIQUE constraint is declared?
A. A temporary CSV file
B. A secondary Unique B-Tree Index
C. A database trigger
D. A stored procedure
**Answer:** B
**Explanation:** MySQL automatically generates a unique B-Tree index to rapidly check for duplicate entries before permitting write operations.
---

### 4. How do you remove a UNIQUE constraint named `uq_email` from a table named `users` in MySQL?
A. ALTER TABLE users DROP CONSTRAINT uq_email;
B. ALTER TABLE users DROP INDEX uq_email;
C. DELETE CONSTRAINT uq_email FROM users;
D. REMOVE UNIQUE uq_email;
**Answer:** B
**Explanation:** In MySQL, because unique constraints are implemented as unique indexes, you drop them using `ALTER TABLE ... DROP INDEX <index_name>;`.
---

### 5. In relational database theory, what is a column called if it is eligible to be a primary key but was not chosen?
A. Foreign Key
B. Alternate Key (or Candidate Key)
C. Surrogate Key
D. Supercluster Key
**Answer:** B
**Explanation:** All columns capable of uniquely identifying rows are candidate keys; the one not chosen as the primary key is referred to as an alternate key.
---
