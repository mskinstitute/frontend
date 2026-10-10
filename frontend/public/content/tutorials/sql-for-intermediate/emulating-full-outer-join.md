---
id: emulating-full-outer-join
slug: emulating-full-outer-join
course: sql-for-intermediate
chapter: SQL Joins Masterclass
topic: "Emulating FULL OUTER JOIN in MySQL: The UNION Technique"
difficulty: Intermediate
readingTime: 12
order: 8
keywords: ["full outer join","emulate full join","union join","full join mysql","bidirectional outer join"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Emulating FULL OUTER JOIN in MySQL: The UNION Technique
A **FULL OUTER JOIN** returns all rows from Table A and all rows from Table B. If there is a match, columns from both tables are displayed. If a row in Table A has no match in Table B, Table B's columns are filled with `NULL`. If a row in Table B has no match in Table A, Table A's columns are filled with `NULL`.

While databases like PostgreSQL, Oracle, and Microsoft SQL Server natively support the `FULL OUTER JOIN` syntax, **MySQL does NOT natively support `FULL OUTER JOIN`**. In this tutorial, you will master the industry-standard technique to emulate it in MySQL using **`UNION`**.

---

## 1. The Mathematical Concept of FULL OUTER JOIN

```
   Table A (Employees)             Table B (Departments)
   +----+----------+---------+     +---------+-------------------+
   | id | name     | dept_id |     | dept_id | dept_name         |
   +----+----------+---------+     +---------+-------------------+
   |  1 | Aarav    |      10 |     |      10 | Engineering       |
   |  2 | Priya    |      20 |     |      20 | Marketing         |
   |  3 | Rohan    |    NULL |     |      30 | Research (Empty!) |
   +----+----------+---------+     +---------+-------------------+

   FULL OUTER JOIN Result:
   +----------+-------------------+
   | name     | dept_name         |
   +----------+-------------------+
   | Aarav    | Engineering       | <-- Matched in both
   | Priya    | Marketing         | <-- Matched in both
   | Rohan    | NULL              | <-- In Employee, NOT in Department!
   | NULL     | Research          | <-- In Department, NOT in Employee!
   +----------+-------------------+
```

---

## 2. Emulating FULL OUTER JOIN in MySQL

Because writing `FULL OUTER JOIN` triggers syntax error **1064**, MySQL engineers emulate it by combining a **`LEFT JOIN`** and an **anti-matching `RIGHT JOIN`** using **`UNION`**:

```sql
-- Step 1: All rows from LEFT table (plus matched right rows)
SELECT e.employee_id, e.full_name, d.department_id, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.department_id

UNION

-- Step 2: All rows from RIGHT table (plus matched left rows)
SELECT e.employee_id, e.full_name, d.department_id, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.department_id;
```

---

## 3. Why `UNION` (and NOT `UNION ALL`) is Mandatory Here

Notice that:
- The `LEFT JOIN` in Step 1 returns the matched rows (*Aarav in Engineering*, *Priya in Marketing*).
- The `RIGHT JOIN` in Step 2 **also** returns those exact same matched rows!
- If you use **`UNION ALL`**, those matching rows will appear **twice (duplicates)** in your output grid!
- Using **`UNION`** (without ALL) causes MySQL to run an automatic deduplication pass, preserving unique records and yielding a mathematically perfect `FULL OUTER JOIN`!

---

## 4. The High-Performance Optimization (UNION ALL + Anti-Join)

While standard `UNION` works, deduplicating millions of rows in memory can be slow. A seasoned database engineer writes the emulation using **`UNION ALL` paired with an Anti-Join**:

```sql
-- Step 1: All records from LEFT table:
SELECT e.employee_id, e.full_name, d.department_id, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.department_id

UNION ALL

-- Step 2: ONLY unmatched records from the RIGHT table (Avoids duplicate overlap!):
SELECT e.employee_id, e.full_name, d.department_id, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.department_id
WHERE e.dept_id IS NULL; -- Anti-join condition!
```

### Why this is faster:
By explicitly filtering for `WHERE e.dept_id IS NULL` in Step 2, there is **zero overlap** between Step 1 and Step 2. This allows using **`UNION ALL`**, which bypasses the expensive temporary table sorting and deduplication step!

---

## 5. Best Practices & Common Pitfalls

- **Column Lists Must Match:** Both `SELECT` queries joined by `UNION` must have the **exact same number of columns in the exact same order** with compatible data types.
- **When is a FULL JOIN Needed?** Common use cases include reconciling two financial ledgers (finding transactions present in the bank statement but missing from accounting software, and vice versa).

---

# Multiple Choice Questions

### 1. Does MySQL natively support the `FULL OUTER JOIN` keyword syntax?
A. Yes, since MySQL 5.0
B. No, MySQL does not natively support FULL OUTER JOIN syntax and requires emulation
C. Only when using the MyISAM engine
D. Only on Windows
**Answer:** B
**Explanation:** MySQL does not feature a native `FULL OUTER JOIN` keyword; developers emulate this behavior using `UNION` combining `LEFT` and `RIGHT` joins.
---

### 2. How is a FULL OUTER JOIN emulated in standard MySQL?
A. By combining an INNER JOIN with a CROSS JOIN
B. By combining a LEFT JOIN and a RIGHT JOIN using the UNION operator
C. By writing two WHERE clauses
D. By creating a temporary database
**Answer:** B
**Explanation:** Combining a `LEFT JOIN` (all left rows) and a `RIGHT JOIN` (all right rows) with `UNION` produces the complete set of matched and unmatched rows from both tables.
---

### 3. Why does standard emulation require `UNION` instead of `UNION ALL` if the second query is not an anti-join?
A. UNION ALL is deprecated
B. Because matched rows are generated by both the LEFT JOIN and the RIGHT JOIN, requiring UNION to eliminate the duplicate rows
C. UNION ALL only works with numbers
D. UNION is faster than UNION ALL
**Answer:** B
**Explanation:** Both sides of the query produce identical records for the matching rows; `UNION` performs deduplication to prevent double-counting.
---

### 4. How can the FULL OUTER JOIN emulation be optimized to safely use `UNION ALL` without producing duplicates?
A. By sorting both tables first
B. By filtering the RIGHT JOIN with `WHERE left_table.key IS NULL` to return only unmatched right rows
C. By deleting the primary keys
D. By using LIMIT 10
**Answer:** B
**Explanation:** Adding an anti-join condition to the second query ensures mutually exclusive sets, allowing `UNION ALL` to concatenate them without needing a deduplication pass.
---

### 5. What is a primary real-world use case for a FULL OUTER JOIN?
A. Fast primary key lookups
B. Reconciling two data sources to identify matching records alongside unmatched records from both systems
C. Sorting customer names alphabetically
D. Creating table backups
**Answer:** B
**Explanation:** Full outer joins are essential for reconciliation tasks (e.g., comparing inventory audits against sales orders) to identify discrepancies on both sides.
---
