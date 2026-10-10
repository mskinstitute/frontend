---
id: query-anti-patterns-and-best-practices
slug: query-anti-patterns-and-best-practices
course: sql-for-advanced
chapter: Query Optimization & Performance Tuning
topic: "SQL Query Anti-Patterns & Best Practices"
difficulty: Advanced
readingTime: 14
order: 13
keywords: ["anti-patterns","sargable queries","select star","n+1 problem","sql performance best practices"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# SQL Query Anti-Patterns & Best Practices
Even with optimal indexes in place, poorly constructed SQL syntax can prevent the query optimizer from leveraging them. In database engineering, these bad syntax habits are known as **SQL Anti-Patterns**.

Mastering **SARGable** (Search Argument Able) query design guarantees maximum index utilization.

---

### Anti-Pattern 1: Wrapping Indexed Columns in Functions (Non-SARGable)

When you wrap an indexed column in a function, MySQL **cannot use the index** because the index contains raw column values, not function results!

```sql
-- ANTI-PATTERN (Forces Full Table Scan!):
SELECT * FROM orders 
WHERE YEAR(order_date) = 2026;

-- BEST PRACTICE (SARGable: Preserves raw indexed column!):
SELECT * FROM orders 
WHERE order_date >= '2026-01-01 00:00:00' 
  AND order_date <  '2027-01-01 00:00:00';
```

---

### Anti-Pattern 2: Implicit Type Conversion

If you compare a numeric column to a string, or a string column to an integer, MySQL converts the column value for every row, disabling the index:

```sql
-- Schema: phone_number is VARCHAR(20) with an index
-- ANTI-PATTERN (Column is cast to numeric on every row!):
SELECT * FROM customers WHERE phone_number = 9876543210;

-- BEST PRACTICE (Quotes preserve string comparison!):
SELECT * FROM customers WHERE phone_number = '9876543210';
```

---

### Anti-Pattern 3: Wildcard Prefixes (`LIKE '%term'`)

```sql
-- ANTI-PATTERN (Cannot navigate B+Tree from the root!):
SELECT * FROM products WHERE sku LIKE '%PROD';

-- BEST PRACTICE (Prefix wildcard utilizes B+Tree range!):
SELECT * FROM products WHERE sku LIKE 'PROD%';
-- Or use Full-Text Search for arbitrary substring matching!
```

---

### Anti-Pattern 4: `SELECT *` in Production Applications

Using `SELECT *`:
1. Destroys **Covering Index** optimizations by demanding all unindexed columns.
2. Increases network bandwidth consumption between DB and backend API servers.
3. Wastes application memory parsing unused columns (like large `BLOB` or `TEXT` fields).

```sql
-- ANTI-PATTERN:
SELECT * FROM users WHERE user_id = 42;

-- BEST PRACTICE:
SELECT user_id, email, first_name FROM users WHERE user_id = 42;
```

---

### Anti-Pattern 5: The OR Operator Across Unrelated Columns

A single query with `WHERE col_a = 1 OR col_b = 2` frequently prevents index usage, resulting in an expensive `index_merge` or full table scan.

```sql
-- ANTI-PATTERN:
SELECT * FROM users WHERE email = 'a@b.com' OR phone = '12345';

-- BEST PRACTICE (Combine two separate index seeks via UNION):
SELECT * FROM users WHERE email = 'a@b.com'
UNION
SELECT * FROM users WHERE phone = '12345';
```

---

### Summary Checklist for Production Queries

- [x] Are date and time queries structured with range comparisons instead of `YEAR()`, `MONTH()`, or `DATE()`?
- [x] Are string literals properly quoted to prevent implicit casting?
- [x] Are only necessary columns projected instead of `SELECT *`?
- [x] Are multiple conditions joined with `AND` rather than disjoint `OR` where possible?

---

# Multiple Choice Questions

### 1. What does the term "SARGable" stand for in SQL query optimization?
A. Storage Array Redundant Gateway
B. Search Argument Able (queries structured so indexes can be utilized)
C. Serialized Asynchronous Read Group
D. System Administrator Resource Governance
**Answer:** B
**Explanation:** SARGable describes predicates formatted so the query engine can directly utilize index seeks rather than scanning tables.
---

### 2. Why does WHERE DATE(created_at) = '2026-08-01' cause a full table scan on an indexed created_at column?
A. The DATE function is deprecated
B. Applying a function to an indexed column prevents the B+Tree from searching raw stored timestamps
C. Dates cannot be indexed
D. The format is invalid
**Answer:** B
**Explanation:** Wrapping an indexed column in a function requires MySQL to compute the function on every row, disabling index range lookup.
---

### 3. If phone_number is VARCHAR, why does WHERE phone_number = 12345 perform poorly?
A. MySQL throws a fatal syntax error
B. MySQL implicitly converts the indexed column to a number for every row, disabling index seeking
C. Numbers cannot be stored in VARCHAR
D. The buffer pool flushes
**Answer:** B
**Explanation:** Type mismatch between a VARCHAR column and an integer literal triggers implicit casting on the column, preventing index lookup.
---

### 4. Why is SELECT * considered an anti-pattern in production backend code?
A. It locks tables from writing
B. It breaks covering index optimizations and wastes network/memory bandwidth fetching unneeded columns
C. MySQL automatically converts it to a temporary table
D. Primary keys cannot be selected with *
**Answer:** B
**Explanation:** SELECT * fetches all columns, preventing covering index optimizations and wasting I/O and network transfer bandwidth.
---

### 5. How can a slow WHERE col_a = 10 OR col_b = 20 query often be refactored to utilize two distinct single-column indexes?
A. By replacing OR with AND
B. By splitting into two indexed queries connected via UNION
C. By adding a GROUP BY
D. By converting to a stored procedure
**Answer:** B
**Explanation:** Splitting an OR into two separate queries combined with UNION allows each branch to execute an efficient single-index seek.
---
