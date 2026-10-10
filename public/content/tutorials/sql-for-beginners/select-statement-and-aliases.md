---
id: select-statement-and-aliases
slug: select-statement-and-aliases
course: sql-for-beginners
chapter: Data Querying Basics (DQL)
topic: "SELECT Statement & Column Aliases: The Core of Data Querying (DQL)"
difficulty: Beginner
readingTime: 12
order: 31
keywords: ["select statement","column aliases","as keyword","dql","table aliases","distinct"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# SELECT Statement & Column Aliases: The Core of Data Querying (DQL)
Over 80% of all SQL code written by software engineers, data analysts, and BI specialists consists of **Data Query Language (DQL)**. The cornerstone of DQL is the **`SELECT`** statement, used to retrieve rows and columns from one or more database tables.

---

## 1. The Core `SELECT` Syntax

```sql
SELECT [DISTINCT] column_1, column_2, ...
FROM table_name;
```

### Querying All Columns (`SELECT *`) vs Specific Columns
```sql
-- Retrieve all columns across all rows (Wildcard):
SELECT * FROM employees;

-- Retrieve only specific columns (Recommended Best Practice):
SELECT employee_id, first_name, salary FROM employees;
```

### Why `SELECT *` is an Anti-Pattern in Production:
1. **Network Overhead:** Fetching 30 columns when your web app only needs `id` and `name` wastes bandwidth and slows down API response times.
2. **Memory Exhaustion:** If a table contains wide `TEXT` or `BLOB` columns, `SELECT *` pulls massive data payloads into memory buffers.
3. **Breaks Covering Indexes:** Queries that select specific indexed columns can be answered entirely from RAM indexes without touching the disk tablespace!

---

## 2. Renaming Columns with Column Aliases (`AS`)

A **Column Alias** temporarily renames a column or calculated expression in the query result set, making outputs readable for human users and API serializers:

```sql
SELECT 
    customer_id AS id,
    first_name AS 'First Name',
    account_balance AS current_balance,
    account_balance * 0.18 AS estimated_gst_tax -- Computed column alias
FROM customers;
```

### Alias Rules:
- The **`AS`** keyword is optional (e.g., `first_name fname`), but including `AS` makes queries much easier to read and maintain.
- If your alias contains spaces or special characters, enclose it in quotes (e.g., `'First Name'` or `` `First Name` ``).

---

## 3. Removing Duplicates with `DISTINCT`

When querying columns that contain duplicate values (e.g., cities, departments, job titles), use **`DISTINCT`** to return only unique values:

```sql
-- View all unique cities where customers reside:
SELECT DISTINCT city FROM customers;

-- DISTINCT across multiple columns (unique combinations):
SELECT DISTINCT department_id, job_title FROM employees;
```

---

## 4. Literal Values & Arithmetic Expressions

`SELECT` can be used without a table to evaluate scalar expressions or inspect server variables:

```sql
-- Perform math calculations directly:
SELECT 100 * 1.18 AS price_with_tax;

-- Inspect server information:
SELECT VERSION() AS mysql_ver, CURRENT_USER() AS logged_in_user;
```

---

## 5. Best Practices & Common Pitfalls

- **Aliases Cannot Be Used in WHERE Clauses:** In SQL, the **`WHERE`** clause is evaluated *before* the **`SELECT`** clause. Therefore, referring to a column alias inside `WHERE` triggers an error!
  ```sql
  -- WRONG (Syntax Error):
  SELECT salary * 12 AS annual_salary FROM employees WHERE annual_salary > 500000;
  
  -- CORRECT:
  SELECT salary * 12 AS annual_salary FROM employees WHERE (salary * 12) > 500000;
  ```

---

# Multiple Choice Questions

### 1. What does the `AS` keyword accomplish in a `SELECT` statement?
A. It changes the permanent column name in the database schema
B. It assigns a temporary display alias to a column or expression in the query output
C. It sorts the rows in ascending order
D. It filters duplicate records
**Answer:** B
**Explanation:** `AS` defines an alias, temporarily renaming a column or calculated expression in the returned result set without altering the physical schema.
---

### 2. Why is using `SELECT *` considered an anti-pattern in high-performance production APIs?
A. It locks the table for writes
B. It retrieves unnecessary columns, increasing network bandwidth, memory consumption, and preventing covering index optimizations
C. MySQL disables SELECT * in version 8.0
D. It only returns the first 10 rows
**Answer:** B
**Explanation:** `SELECT *` fetches all columns regardless of need, wasting network I/O, exhausting memory buffers, and preventing the query engine from satisfying queries solely from secondary indexes.
---

### 3. Which keyword eliminates duplicate rows from the result set of a `SELECT` query?
A. UNIQUE
B. DISTINCT
C. DEDUPLICATE
D. FILTER
**Answer:** B
**Explanation:** The `DISTINCT` keyword instructs the query engine to filter out duplicate rows, returning only distinct combinations of the requested columns.
---

### 4. Why does the query `SELECT price * 2 AS double_price FROM items WHERE double_price > 100;` fail in standard SQL?
A. Multiplication is not supported in SELECT
B. The WHERE clause is executed logically before the SELECT clause, meaning the alias is not yet known to the filter engine
C. Double quotes must be used
D. WHERE only supports primary keys
**Answer:** B
**Explanation:** In standard SQL query processing order, `WHERE` is evaluated before `SELECT`, meaning column aliases created in `SELECT` are not accessible in `WHERE`.
---

### 5. Can a `SELECT` query be executed in MySQL without specifying a `FROM table_name` clause?
A. No, FROM is always mandatory
B. Yes, MySQL allows querying literal constants, math expressions, and system functions without a table
C. Only if connected as the root user
D. Only in SQLite
**Answer:** B
**Explanation:** MySQL allows `SELECT` queries without a `FROM` clause (e.g., `SELECT 1 + 1;`, `SELECT NOW();`), unlike databases that require dummy tables (like Oracle's `DUAL`).
---
