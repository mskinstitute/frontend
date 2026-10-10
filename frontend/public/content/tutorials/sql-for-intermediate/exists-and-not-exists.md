---
id: exists-and-not-exists
slug: exists-and-not-exists
course: sql-for-intermediate
chapter: Subqueries & Nested Queries
topic: "Semi-Joins & Anti-Joins with EXISTS and NOT EXISTS"
difficulty: Intermediate
readingTime: 12
order: 17
keywords: ["exists","not exists","semi join","anti join","subquery optimization","exists vs in"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Semi-Joins & Anti-Joins with EXISTS and NOT EXISTS
When querying relationships between tables, your business logic often requires testing for **existence** rather than retrieving actual data values. For example: *"Find all customers who have placed at least one order"* or *"Find all products that have never been reviewed"*. In SQL, these existence tests are implemented using **`EXISTS`** (Semi-Join) and **`NOT EXISTS`** (Anti-Join).

---

## 1. The `EXISTS` Operator (Semi-Join)

The **`EXISTS`** operator evaluates a subquery and returns **`TRUE`** as soon as the subquery produces **at least one row**. If the subquery produces zero rows, it returns **`FALSE`**.

```sql
SELECT customer_id, customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
);
```

### Why `SELECT 1`?
Because `EXISTS` only checks whether a row **exists**, it does not care what columns are projected in the subquery. By convention, developers write `SELECT 1` (or `SELECT *`). The database query engine ignores the projection entirely and performs an **Early Termination Index Seek**!

---

## 2. Early Termination: The Secret to `EXISTS` Speed

Consider a customer who has placed 10,000 orders over 5 years:
- An `INNER JOIN` will match and process **all 10,000 order records**, expanding the result set and requiring a `DISTINCT` pass to remove duplicates.
- An **`EXISTS`** subquery inspects the index, finds the **very first matching order**, stops scanning immediately, and returns `TRUE`!

---

## 3. The `NOT EXISTS` Operator (Anti-Join)

The **`NOT EXISTS`** operator returns `TRUE` if the subquery returns **zero rows**:

```sql
-- Find all customers who have NEVER placed an order:
SELECT customer_id, customer_name, email
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 
    FROM orders o 
    WHERE o.customer_id = c.customer_id
);
```

---

## 4. `EXISTS` vs `IN`: Which is Better?

| Feature | `EXISTS` | `IN` |
| :--- | :--- | :--- |
| **Execution Style** | Boolean existence test (Early termination). | Evaluates values against an extracted set. |
| **Performance with Large Subquery**| **Faster** (Stops on first match). | Slower if subquery result set is large. |
| **Handling of NULLs** | **Safe** (Does not fail on NULLs). | **Dangerous with NOT IN** (Returns 0 rows if list has a NULL!). |
| **Readability** | Requires correlated link. | Clean and intuitive for static lists. |

```sql
-- DANGEROUS (If any supplier has NULL id, query returns NOTHING!):
SELECT * FROM products WHERE supplier_id NOT IN (SELECT supplier_id FROM inactive_suppliers);

-- 100% SAFE AND BULLETPROOF:
SELECT * FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM inactive_suppliers s WHERE s.supplier_id = p.supplier_id
);
```

---

## 5. What are Semi-Joins and Anti-Joins?

In database internals:
- **Semi-Join (`EXISTS`):** Returns rows from the first table if they match the second table, **without duplicating rows** from the first table if multiple matches exist.
- **Anti-Join (`NOT EXISTS`):** Returns rows from the first table that have **no matching records** in the second table.

---

## 6. Best Practices & Common Pitfalls

- **Always Prefer NOT EXISTS over NOT IN for Subqueries:** Due to SQL three-valued logic, `NOT IN` fails completely when subqueries contain `NULL` values. `NOT EXISTS` is completely immune to this problem and should be your default choice.
- **Index Correlating Foreign Keys:** Ensure the child table has an index on the foreign key column (`orders.customer_id`) to guarantee $O(log N)$ seeks for each outer check.

---

# Multiple Choice Questions

### 1. What does the `EXISTS` operator check for in a subquery?
A. Whether the subquery has any syntax errors
B. Whether the subquery returns at least one row
C. Whether all values in the subquery are unique
D. Whether the subquery returns numbers
**Answer:** B
**Explanation:** `EXISTS` evaluates to `TRUE` if the subquery yields at least one record; otherwise, it evaluates to `FALSE`.
---

### 2. Why do developers typically write `SELECT 1` inside an `EXISTS` subquery?
A. Because MySQL requires the number 1
B. Because EXISTS only checks for row presence, making column projection irrelevant; SELECT 1 is a clean standard convention
C. It limits the search to row 1
D. It increments the counter
**Answer:** B
**Explanation:** The query optimizer ignores the select list inside an `EXISTS` clause because it only checks for the existence of qualifying rows.
---

### 3. What operational advantage does `EXISTS` have over an `INNER JOIN ... DISTINCT` query?
A. EXISTS encrypts the output
B. Early termination: EXISTS stops scanning the child table as soon as the first matching record is discovered
C. EXISTS ignores indexes
D. EXISTS deletes duplicates from disk
**Answer:** B
**Explanation:** `EXISTS` short-circuits evaluation on the first match, avoiding the overhead of scanning all child rows and subsequently deduplicating them.
---

### 4. What is a "Semi-Join" in database theory?
A. A join that only joins half the columns
B. A join that filters rows from the first table based on matching records in the second table without duplicating the first table's rows
C. A join that runs halfway and pauses
D. A join without foreign keys
**Answer:** B
**Explanation:** A semi-join returns rows from table A that have at least one match in table B, guaranteeing that no duplicates of table A are created.
---

### 5. Why is `NOT EXISTS` preferred over `NOT IN` when querying nullable foreign key relationships?
A. NOT EXISTS runs in parallel
B. NOT IN produces an empty result set if the inner query contains even a single NULL value, whereas NOT EXISTS handles NULLs safely
C. NOT IN is only supported in SQLite
D. NOT EXISTS requires fewer permissions
**Answer:** B
**Explanation:** Three-valued logic causes `NOT IN` to evaluate to UNKNOWN if any subquery row is NULL; `NOT EXISTS` relies on boolean row counts and remains unaffected by NULLs.
---
