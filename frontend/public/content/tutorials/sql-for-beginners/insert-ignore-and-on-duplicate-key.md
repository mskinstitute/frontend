---
id: insert-ignore-and-on-duplicate-key
slug: insert-ignore-and-on-duplicate-key
course: sql-for-beginners
chapter: Data Manipulation Language (DML)
topic: "INSERT IGNORE & ON DUPLICATE KEY UPDATE: Upserting in MySQL"
difficulty: Beginner
readingTime: 12
order: 28
keywords: ["insert ignore","on duplicate key update","upsert","replace into","handling duplicates"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# INSERT IGNORE & ON DUPLICATE KEY UPDATE: Upserting in MySQL
When synchronizing data feeds, importing large CSV files, or tracking user website activity, you will frequently encounter records that **already exist** in your database. Standard `INSERT` statements fail completely on duplicate key collisions, aborting entire batches. MySQL provides two powerful solutions: **`INSERT IGNORE`** and **`ON DUPLICATE KEY UPDATE`** (Upserting).

---

## 1. The Duplicate Key Collision Problem

Suppose we have a user analytics table where `user_id` is unique:

```sql
CREATE TABLE user_daily_logins (
    user_id INT PRIMARY KEY,
    login_count INT NOT NULL DEFAULT 1,
    last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

If you run:
```sql
INSERT INTO user_daily_logins (user_id) VALUES (101); -- Succeeds!
INSERT INTO user_daily_logins (user_id) VALUES (101); -- CRASHES with Error 1062: Duplicate entry!
```

---

## 2. Silent Skipping with `INSERT IGNORE`

When you use **`INSERT IGNORE`**, MySQL silently skips any row that would cause a duplicate key violation (or invalid data type error), downgrading errors to harmless warnings:

```sql
-- Attempting to insert 3 users. User 101 already exists:
INSERT IGNORE INTO user_daily_logins (user_id)
VALUES 
    (101), -- Skipped silently!
    (102), -- Inserted!
    (103); -- Inserted!
```

- Rows that cause duplicate key violations are ignored with zero errors.
- Clean rows are inserted normally.
- **Limitation:** The existing row is not updated or modified in any way.

---

## 3. The Power of Upsert: `ON DUPLICATE KEY UPDATE`

In software engineering, an **"Upsert"** (*Update or Insert*) is an operation that:
1. **Inserts** a new record if the primary/unique key does not exist.
2. **Updates** the existing record if the primary/unique key *does* exist!

```sql
-- Daily Login Tracker: If user exists, increment login count and update timestamp!
INSERT INTO user_daily_logins (user_id, login_count, last_login)
VALUES (101, 1, NOW())
ON DUPLICATE KEY UPDATE
    login_count = login_count + 1,
    last_login = NOW();
```

### Modern MySQL 8.0.19+ Alias Syntax:
In MySQL 8.0.19+, you can use table and column aliases directly in the update clause:

```sql
INSERT INTO user_daily_logins (user_id, login_count, last_login)
VALUES (101, 1, NOW()) AS new_row
ON DUPLICATE KEY UPDATE
    login_count = user_daily_logins.login_count + new_row.login_count,
    last_login = new_row.last_login;
```

---

## 4. What About `REPLACE INTO`? (The Hidden Trap)

MySQL also supports **`REPLACE INTO`**, but DBAs consider it a dangerous anti-pattern:
- `REPLACE INTO` does **not** update in-place.
- It physically **DELETES** the old row and **INSERTS** a brand new row!
- **Dangers:**
  1. It triggers `ON DELETE CASCADE` on foreign key child tables, unintentionally wiping related records!
  2. It fires `DELETE` triggers.
  3. It increments the `AUTO_INCREMENT` sequence unnecessarily.
  - **Always prefer `INSERT ... ON DUPLICATE KEY UPDATE` over `REPLACE INTO`!**

---

## 5. Best Practices & Common Pitfalls

- **Ensure Unique Index Exists:** `ON DUPLICATE KEY UPDATE` only activates if the collision occurs on a **`PRIMARY KEY`** or **`UNIQUE`** index. It has zero effect on standard non-unique columns.
- **Inspect `ROW_COUNT()` Return Codes:**
  - If a row is newly **inserted**, MySQL reports **1 row affected**.
  - If an existing row is **updated**, MySQL reports **2 rows affected**!
  - If an existing row is matched but no values changed, MySQL reports **0 rows affected**.

---

# Multiple Choice Questions

### 1. What does the term "Upsert" signify in database management?
A. Upgrading the server hardware
B. Inserting a row if it is new, or updating the existing row if a duplicate key is detected
C. Sorting rows in ascending order
D. Uploading data to cloud storage
**Answer:** B
**Explanation:** An "Upsert" combines insert and update semantics: inserting when no matching unique key exists, and updating when a collision occurs.
---

### 2. How does `INSERT IGNORE` handle a row that violates a PRIMARY KEY constraint during batch insertion?
A. It terminates the entire transaction immediately
B. It converts the error into a warning, skips the duplicate row, and proceeds to insert the remaining valid rows
C. It overwrites the primary key with NULL
D. It deletes the table
**Answer:** B
**Explanation:** `INSERT IGNORE` suppresses duplicate key errors, quietly skipping colliding rows while continuing to process valid ones.
---

### 3. What is the fundamental danger of using `REPLACE INTO` instead of `INSERT ... ON DUPLICATE KEY UPDATE`?
A. REPLACE INTO is only supported on Linux
B. REPLACE INTO physically deletes the existing row before inserting, which can trigger cascading deletes on child tables
C. REPLACE INTO cannot handle numbers
D. REPLACE INTO locks the database for 24 hours
**Answer:** B
**Explanation:** `REPLACE INTO` performs a `DELETE` followed by an `INSERT`, potentially triggering `ON DELETE CASCADE` constraints and destroying dependent child rows.
---

### 4. What row count does MySQL return when `ON DUPLICATE KEY UPDATE` successfully modifies an existing record?
A. 0 rows affected
B. 1 row affected
C. 2 rows affected
D. -1 rows affected
**Answer:** C
**Explanation:** By MySQL convention, `ON DUPLICATE KEY UPDATE` returns 1 for a new insert, 2 for an existing updated row, and 0 if the row was matched but values were identical.
---

### 5. On which types of columns does `ON DUPLICATE KEY UPDATE` detect collisions?
A. Any column with an index
B. Columns with PRIMARY KEY or UNIQUE constraints only
C. Only columns of type VARCHAR
D. Only foreign key columns
**Answer:** B
**Explanation:** `ON DUPLICATE KEY UPDATE` triggers exclusively when an insert causes a collision on a Primary Key or a Unique Key constraint.
---
