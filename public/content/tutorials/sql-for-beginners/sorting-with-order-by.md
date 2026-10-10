---
id: sorting-with-order-by
slug: sorting-with-order-by
course: sql-for-beginners
chapter: Sorting, Limiting & Pagination
topic: "Sorting Data with ORDER BY: Ascending & Descending Sequences"
difficulty: Beginner
readingTime: 12
order: 39
keywords: ["order by","sorting","asc vs desc","default sort order","sorting nulls"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Sorting Data with ORDER BY: Ascending & Descending Sequences
In relational database theory, tables are defined as unordered mathematical sets. When you execute a basic `SELECT` query without an explicit sorting instruction, the database engine returns rows in arbitrary order (typically corresponding to the physical sequence of disk blocks or index order). To guarantee a predictable, deterministic sequence of records, you must use the **`ORDER BY`** clause.

---

## 1. Syntax of the `ORDER BY` Clause

The `ORDER BY` clause is specified toward the end of your query (after `FROM` and `WHERE`):

```sql
SELECT column_1, column_2
FROM table_name
[WHERE condition]
ORDER BY sort_column [ASC | DESC];
```

### Sorting Directions:
- **`ASC` (Ascending):** Smallest to largest (e.g., 1 to 100, A to Z, oldest date to newest). **This is the default direction if omitted.**
- **`DESC` (Descending):** Largest to smallest (e.g., 100 to 1, Z to A, newest date to oldest).

```sql
-- Sort employees by salary ascending (lowest to highest):
SELECT full_name, salary FROM employees ORDER BY salary ASC;
-- Equivalent (ASC is default):
SELECT full_name, salary FROM employees ORDER BY salary;

-- Sort products by price descending (most expensive first):
SELECT product_name, price FROM products ORDER BY price DESC;
```

---

## 2. Sorting by Column Aliases & Positional Indexes

Unlike the `WHERE` clause (which executes before `SELECT`), the **`ORDER BY` clause executes AFTER `SELECT`** in the logical query lifecycle. This means you **can** sort by column aliases defined in your `SELECT` statement!

```sql
-- Sorting by a computed column alias:
SELECT 
    product_name,
    unit_price * stock_quantity AS total_inventory_value
FROM products
ORDER BY total_inventory_value DESC;

-- Sorting by positional index number (1 = first column, 2 = second column):
-- (Supported, but discouraged in production for readability):
SELECT product_name, price FROM products ORDER BY 2 DESC;
```

---

## 3. Sorting Text and Collations

When sorting character strings, the sorting order depends on the column's **Collation**:
- In **`utf8mb4_0900_ai_ci`** (case-insensitive), `'apple'` and `'Apple'` are considered identical in sort weight.
- In **`utf8mb4_bin`** (binary), uppercase letters (ASCII 65-90) sort **before** lowercase letters (ASCII 97-122).

---

## 4. How NULL Values are Sorted in MySQL

- In **`ASC`** order, MySQL places `NULL` values **at the top** (treated as smaller than any value).
- In **`DESC`** order, MySQL places `NULL` values **at the bottom**.

```sql
-- Force NULL values to the bottom during an ASC sort:
SELECT full_name, commission_pct
FROM sales_reps
ORDER BY commission_pct IS NULL ASC, commission_pct ASC;
```

---

## 5. Best Practices & Common Pitfalls

- **Never Assume Physical Order:** Never rely on default insertion order without an explicit `ORDER BY`. As soon as rows are updated, deleted, or indexes are rebuilt, unordered `SELECT` output order will change unpredictably.
- **Index Your Sort Columns:** Sorting unindexed columns on tables with 500,000+ rows forces the database to perform an expensive in-memory or disk-based **Filesort** algorithm, causing high CPU spikes.

---

# Multiple Choice Questions

### 1. What is the default sorting direction if neither `ASC` nor `DESC` is explicitly specified in an `ORDER BY` clause?
A. DESC
B. ASC
C. RANDOM
D. PRIMARY KEY
**Answer:** B
**Explanation:** By SQL standard, `ASC` (ascending order) is the default sort direction when omitted.
---

### 2. In what logical order of operations is the `ORDER BY` clause evaluated relative to the `SELECT` clause?
A. Before FROM
B. Before WHERE
C. AFTER the SELECT clause has evaluated expressions and aliases
D. Concurrently with the table lock
**Answer:** C
**Explanation:** `ORDER BY` evaluates after `SELECT`, allowing queries to sort by projected column aliases.
---

### 3. How does MySQL place `NULL` values when executing `ORDER BY score DESC`?
A. At the very beginning of the result set
B. At the very end of the result set
C. NULL values are removed
D. It throws a NullPointerException
**Answer:** B
**Explanation:** In descending (`DESC`) sorts, MySQL treats NULLs as the lowest possible values, placing them at the bottom of the result set.
---

### 4. Which query sorts products with the most expensive items listed first?
A. SELECT * FROM products ORDER BY price ASC;
B. SELECT * FROM products ORDER BY price DESC;
C. SELECT * FROM products SORT BY price DOWN;
D. SELECT * FROM products ORDER price HIGH;
**Answer:** B
**Explanation:** `ORDER BY price DESC` orders rows in descending sequence, showing the largest values at the top.
---

### 5. Why can sorting large unindexed tables degrade database server performance?
A. It deletes temporary tables
B. It forces the engine to allocate buffer memory and execute a CPU-intensive "Filesort" algorithm
C. It disconnects client applications
D. Indexes become invalid
**Answer:** B
**Explanation:** Sorting non-indexed data requires loading rows into memory and performing a sorting pass (Filesort), which consumes significant RAM and CPU.
---
