---
id: left-outer-join
slug: left-outer-join
course: sql-for-intermediate
chapter: SQL Joins Masterclass
topic: "LEFT JOIN (Left Outer Join): Retaining Unmatched Left Records"
difficulty: Intermediate
readingTime: 12
order: 6
keywords: ["left join","left outer join","unmatched records","null replacement","outer join mechanics"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# LEFT JOIN (Left Outer Join): Retaining Unmatched Left Records
While an `INNER JOIN` returns only rows that match in both tables, business queries frequently require showing **all records from the primary entity**, regardless of whether corresponding child records exist. 

For example: *"List all customers and their orders, but STILL include customers who have never placed an order!"* or *"List all students and their exam scores, including students who missed the exam!"*. This is the exact role of the **`LEFT JOIN`** (formally **`LEFT OUTER JOIN`**).

---

## 1. The Mechanics of a LEFT JOIN

In a `LEFT JOIN`:
1. **All rows from the LEFT table** are retained in the result set.
2. If a matching row exists in the **RIGHT table**, the right table's columns are populated.
3. If **no match exists** in the right table, all columns from the right table are filled with **`NULL`**!

```
   LEFT TABLE: customers            RIGHT TABLE: orders
   +----+--------------+           +----------+---------+
   | id | name         |           | order_id | cust_id |
   +----+--------------+           +----------+---------+
   |  1 | Aarav        |           |      101 |       1 |
   |  2 | Priya        |           |      102 |       1 |
   |  3 | Rohan        |           |     NULL |    NULL | (Rohan has 0 orders!)
   +----+--------------+           +----------+---------+

   SELECT c.name, o.order_id
   FROM customers c
   LEFT JOIN orders o ON c.id = o.cust_id;

   OUTPUT:
   +--------------+----------+
   | name         | order_id |
   +--------------+----------+
   | Aarav        |      101 |
   | Aarav        |      102 |
   | Priya        |     NULL | <-- Priya has no orders, but is NOT lost!
   | Rohan        |     NULL | <-- Rohan has no orders, but is NOT lost!
   +--------------+----------+
```

---

## 2. Syntax & Shorthand

In standard SQL and MySQL, the keywords **`LEFT JOIN`** and **`LEFT OUTER JOIN`** are 100% identical:

```sql
SELECT 
    c.customer_id,
    c.customer_name,
    IFNULL(o.order_id, 'No Orders') AS order_reference,
    IFNULL(o.total_amount, 0.00) AS amount_spent
FROM customers c
LEFT OUTER JOIN orders o ON c.customer_id = o.customer_id;
```

---

## 3. The Classic Pattern: Finding What DOESN'T Exist (Anti-Joins)

One of the most powerful uses of a `LEFT JOIN` is finding records in Table A that have **no corresponding records** in Table B. This is called an **Anti-Join**:

```sql
-- Find all customers who have NEVER placed an order (Zero-sales leads):
SELECT 
    c.customer_id,
    c.customer_name,
    c.email
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL; -- Filters exclusively for non-matching rows!
```

### Why this works:
Because unmatched customers have `NULL` in `o.order_id`, filtering by `WHERE o.order_id IS NULL` discards all customers who *did* place orders, isolating only the inactive accounts!

---

## 4. The Critical Filter Trap: `ON` vs `WHERE` in LEFT JOINs

Where you place filter conditions in a `LEFT JOIN` completely changes the outcome!

### Condition in `ON` Clause:
```sql
-- Evaluates during the join: Keeps ALL customers, but joins ONLY orders placed in 2026:
SELECT c.customer_name, o.order_id, o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_date >= '2026-01-01';
```

### Condition in `WHERE` Clause (The Accidental INNER JOIN Trap!):
```sql
-- Evaluates AFTER the join:
SELECT c.customer_name, o.order_id, o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2026-01-01';
```

> [!CAUTION]
> In the second query, because customers with no orders have `o.order_date = NULL`, the condition `NULL >= '2026-01-01'` evaluates to **`UNKNOWN`**, discarding those customers! **Putting a right-table condition in the `WHERE` clause accidentally converts your `LEFT JOIN` into an `INNER JOIN`!**

---

## 5. Best Practices & Common Pitfalls

- **Protect Against NULLs in Application Code:** When your backend receives results from a `LEFT JOIN`, right-side columns can be `NULL`. Handle these safely using `COALESCE()` or in your application code.
- **Join Cardinality Expansion:** Remember that if a customer has 5 orders, the customer's name will appear on 5 separate rows in the output grid.

---

# Multiple Choice Questions

### 1. What happens to rows from the LEFT table that have no matching records in the RIGHT table during a `LEFT JOIN`?
A. They are excluded from the result set
B. They are retained in the result set with NULL values filling the right table's columns
C. An error is thrown
D. They are deleted from the database
**Answer:** B
**Explanation:** A `LEFT JOIN` guarantees that all rows from the left table appear in the output, using NULL placeholders for missing right-table columns.
---

### 2. How can a `LEFT JOIN` be used to identify all products that have never been sold?
A. By adding `WHERE orders.product_id = 0`
B. By performing a LEFT JOIN from products to order_items and filtering with `WHERE order_items.product_id IS NULL`
C. By using an INNER JOIN with COUNT(*)
D. By truncating the products table
**Answer:** B
**Explanation:** An anti-join filters the result of a `LEFT JOIN` using `WHERE right_table.key IS NULL`, isolating records that have zero matches.
---

### 3. What happens if a filter on a right-table column (e.g. `WHERE orders.status = 'Shipped'`) is placed in the `WHERE` clause of a `LEFT JOIN`?
A. The query runs twice as fast
B. It accidentally converts the LEFT JOIN into an INNER JOIN because rows with NULL right-side columns are discarded
C. MySQL throws a syntax error
D. The left table rows are duplicated
**Answer:** B
**Explanation:** Because unmatched left rows produce NULL for right-table columns, any `WHERE` clause requiring a non-null condition discards those rows, behaving like an `INNER JOIN`.
---

### 4. Are the keywords `LEFT JOIN` and `LEFT OUTER JOIN` identical in MySQL?
A. No, LEFT JOIN is faster
B. Yes, the keyword OUTER is optional and completely synonymous
C. LEFT OUTER JOIN is only supported in SQLite
D. LEFT JOIN deletes unmatched rows
**Answer:** B
**Explanation:** In standard SQL and MySQL syntax, `OUTER` is an optional noise word; `LEFT JOIN` and `LEFT OUTER JOIN` are completely identical.
---

### 5. If Table A has 10 rows and Table B has 0 rows, how many rows will `SELECT * FROM TableA LEFT JOIN TableB ON TableA.id = TableB.a_id` return?
A. 0 rows
B. 10 rows (with NULLs for Table B columns)
C. 1 row
D. Error: Table B is empty
**Answer:** B
**Explanation:** Because Table A is the left table, all 10 of its rows are preserved, with NULL values populating the absent Table B attributes.
---
