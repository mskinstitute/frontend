---
id: executing-first-sql-script
slug: executing-first-sql-script
course: sql-for-beginners
chapter: MySQL Installation & Tooling Setup
topic: "Writing & Running Your First SQL Script"
difficulty: Beginner
readingTime: 12
order: 8
keywords: ["sql script","running sql","first sql query","comments in sql","select 1","sql syntax basics"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Writing & Running Your First SQL Script
Now that you have MySQL installed and understand the tooling, it is time to write and execute your first real SQL script. In this tutorial, you will write a complete, self-contained SQL script that creates a database, creates a table, inserts records, queries data, and explores SQL comment conventions.

---

## 1. Writing Comments in SQL & MySQL

Good code documentation is as important in SQL as it is in any programming language. MySQL supports three distinct commenting styles:

```sql
-- 1. Standard Single-Line Comment (ANSI SQL):
-- Note the space after the two hyphens! This space is mandatory in MySQL.

# 2. MySQL-Specific Single-Line Comment:
# Hash symbols can also be used for comments in MySQL scripts.

/* 3. Multi-Line Comment:
   This comment can span across
   multiple lines of text without
   affecting execution. */
```

---

## 2. Your First Complete SQL Script

Copy and execute this complete script in MySQL Workbench or your CLI:

```sql
-- Step 1: Create a brand new database for an institute
CREATE DATABASE IF NOT EXISTS msk_tech_academy;

-- Step 2: Set the database as our active working context
USE msk_tech_academy;

-- Step 3: Create a clean table for registered students
CREATE TABLE IF NOT EXISTS students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    course_name VARCHAR(50) NOT NULL,
    fee_paid DECIMAL(8, 2) NOT NULL,
    enrollment_date DATE NOT NULL
);

-- Step 4: Insert sample student records
INSERT INTO students (full_name, course_name, fee_paid, enrollment_date) 
VALUES 
    ('Aarav Sharma', 'Python Mastery', 15000.00, '2026-01-10'),
    ('Priya Patel', 'Web Development', 18000.00, '2026-01-15'),
    ('Rohan Verma', 'Data Analytics', 16500.00, '2026-02-01'),
    ('Ananya Gupta', 'Python Mastery', 15000.00, '2026-02-10');

-- Step 5: Query all students enrolled in 'Python Mastery'
SELECT 
    student_id,
    full_name,
    fee_paid,
    enrollment_date
FROM students
WHERE course_name = 'Python Mastery';
```

---

## 3. Breaking Down the Query Output

When the final `SELECT` query executes, MySQL returns a structured tabular result set:

```text
+------------+---------------+----------+-----------------+
| student_id | full_name     | fee_paid | enrollment_date |
+------------+---------------+----------+-----------------+
|          1 | Aarav Sharma  | 15000.00 | 2026-01-10      |
|          4 | Ananya Gupta  | 15000.00 | 2026-02-10      |
+------------+---------------+----------+-----------------+
2 rows in set (0.00 sec)
```

### What Just Happened Under the Hood?
1. **Schema Check:** The MySQL server checked if `msk_tech_academy` existed; if not, it created a dedicated schema directory in its data folder.
2. **Table Definition:** `InnoDB` allocated a table dictionary entry and created the table space.
3. **Data Ingestion:** The 4 rows were written to the active buffer pool page and committed to the redo log for durability.
4. **Filtered Read:** The `SELECT` statement filtered the rows, returning only those matching `course_name = 'Python Mastery'`.

---

## 4. Running SQL Scripts from a File

In professional DevOps workflows, you rarely type SQL statements interactively one by one. You save them to a `.sql` script file and execute them via the CLI:

```bash
# Method 1: Using input redirection in terminal:
mysql -u root -p msk_tech_academy < setup_database.sql

# Method 2: From inside the MySQL prompt using the source command:
mysql> USE msk_tech_academy;
mysql> SOURCE /path/to/your/script.sql;
```

---

## 5. Best Practices & Common Pitfalls

- **Always Use `IF NOT EXISTS`:** Adding `IF NOT EXISTS` to `CREATE DATABASE` and `CREATE TABLE` prevents fatal script crashes when running initialization scripts multiple times in deployment pipelines.
- **Hyphen Comment Spacing:** In standard ANSI SQL and MySQL, single-line comments using `--` **must** be followed by at least one space (e.g., `-- comment`). Writing `--comment` without a space will trigger a syntax error in MySQL!
- **Consistent Semicolons:** Always terminate every DDL and DML statement with a semicolon (`;`).

---

# Multiple Choice Questions

### 1. In MySQL, what is required immediately after the two hyphens (`--`) for a single-line comment to be valid?
A. A colon (:)
B. At least one whitespace character or control character
C. A semicolon (;)
D. An exclamation mark (!)
**Answer:** B
**Explanation:** MySQL requires that the `--` comment sequence be followed by at least one whitespace character (space, tab, newline) to distinguish it from potential unary minus expressions.
---

### 2. Which SQL clause prevents an error from occurring if a table with the specified name already exists?
A. IF TABLE EXISTS
B. IF NOT EXISTS
C. IGNORE DUPLICATE
D. OVERWRITE
**Answer:** B
**Explanation:** Using `CREATE TABLE IF NOT EXISTS` suppresses the error if the table is already present in the target schema.
---

### 3. Which command executed inside the MySQL CLI prompt loads and runs an external `.sql` script file?
A. RUN script.sql;
B. SOURCE script.sql;
C. LOAD SCRIPT script.sql;
D. EXECUTE FILE script.sql;
**Answer:** B
**Explanation:** The `SOURCE <filepath>;` command (or `\. <filepath>`) reads and executes SQL statements sequentially from an external file inside the MySQL CLI.
---

### 4. What is the effect of the `AUTO_INCREMENT` attribute on a primary key column in MySQL?
A. It multiplies the numeric value by 2
B. It automatically generates a unique sequential integer for new rows when no value is provided
C. It encrypts the primary key using SHA-256
D. It prevents the row from being updated
**Answer:** B
**Explanation:** `AUTO_INCREMENT` assigns the next ascending sequential integer to the column whenever a new row is inserted without an explicit key value.
---

### 5. How can you execute a file named `schema.sql` directly from the operating system shell without opening the interactive MySQL prompt?
A. mysql -u root -p my_db < schema.sql
B. run-mysql schema.sql
C. mysql-exec --file schema.sql
D. sql -open schema.sql
**Answer:** A
**Explanation:** Using standard shell input redirection (`< schema.sql`) pipes the file contents directly into the `mysql` client executable.
---
