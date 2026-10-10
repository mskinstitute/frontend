---
id: altering-and-dropping-views
slug: altering-and-dropping-views
course: sql-for-intermediate
chapter: Database Views
topic: "Managing & Dropping Views"
difficulty: Intermediate
readingTime: 11
order: 29
keywords: ["alter view","drop view","drop view if exists","merge algorithm","temptable algorithm"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Managing & Dropping Views
Database schemas evolve continuously. As business requirements change, tables gain or lose columns, business definitions shift, and views must be modified or retired.

In MySQL, managing views involves altering existing definitions using `ALTER VIEW` or `CREATE OR REPLACE VIEW`, inspecting view metadata, and safely removing obsolete views with `DROP VIEW`.

---

### Modifying a View: ALTER VIEW vs CREATE OR REPLACE VIEW

MySQL supports two synonymous statements to modify an existing view:

#### 1. ALTER VIEW Statement
```sql
ALTER VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```
*Note:* If `view_name` does not exist, `ALTER VIEW` throws an error.

#### 2. CREATE OR REPLACE VIEW Statement
```sql
CREATE OR REPLACE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```
*Note:* If `view_name` exists, it is replaced; if it does not exist, it is created cleanly. For this reason, `CREATE OR REPLACE VIEW` is preferred in idempotent deployment scripts.

---

### Dropping Views with DROP VIEW

To permanently delete one or more views:

```sql
DROP VIEW [IF EXISTS] view_name1 [, view_name2, ...];
```

```sql
-- Safely dropping a view
DROP VIEW IF EXISTS v_customer_order_summary;

-- Dropping multiple views at once
DROP VIEW IF EXISTS v_sales_q1, v_sales_q2, v_sales_q3;
```

> **Crucial Rule:** Dropping a view **never** deletes the data in the underlying base tables! It only removes the stored query definition.

---

### Impact of Base Table Alterations on Views

A view is dependent on the underlying columns referenced in its `SELECT` clause. Consider what happens when base tables change:

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    name VARCHAR(100),
    cost_price DECIMAL(10, 2),
    sale_price DECIMAL(10, 2)
);

CREATE VIEW v_product_margins AS
SELECT product_id, name, (sale_price - cost_price) AS margin
FROM products;
```

If an administrator drops a column used by the view:
```sql
ALTER TABLE products DROP COLUMN cost_price;
```

The view definition is **not** deleted, but querying it immediately yields:
```sql
SELECT * FROM v_product_margins;
-- ERROR 1356 (HY000): View 'store.v_product_margins' references invalid table(s) or column(s)
```
To resolve this, the view must be recreated with the updated schema.

---

### View Execution Algorithms: MERGE vs TEMPTABLE

When creating or altering views, MySQL allows specifying the internal evaluation algorithm:

```sql
CREATE ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE} VIEW view_name AS ...
```

| Algorithm | How it Works | Best For / Limitations |
| :--- | :--- | :--- |
| **MERGE** | The view's text is merged directly into the outer query before optimization. Filters in `WHERE` are pushed down. | Highly efficient, updatable views. Cannot be used with `GROUP BY`, `DISTINCT`, or aggregates. |
| **TEMPTABLE** | The view is materialized into a temporary table in memory/disk first; the outer query scans that temp table. | Required when views use `GROUP BY`, `HAVING`, or window functions. Not updatable. |
| **UNDEFINED** (Default) | MySQL automatically selects `MERGE` if possible, falling back to `TEMPTABLE`. | Recommended for general use. |

---

# Multiple Choice Questions

### 1. What happens to base table rows when you execute DROP VIEW my_view;?
A. All corresponding rows in the base tables are permanently deleted
B. Nothing happens to base table data; only the view definition is removed
C. The base tables are automatically converted to temporary tables
D. Rows are moved into the system Recycle Bin
**Answer:** B
**Explanation:** Dropping a view removes only the virtual schema query definition; the underlying physical tables and their stored records remain completely untouched.
---

### 2. What is the key operational difference between ALTER VIEW and CREATE OR REPLACE VIEW?
A. ALTER VIEW works with temporary tables, while CREATE OR REPLACE VIEW does not
B. ALTER VIEW fails if the view does not exist, whereas CREATE OR REPLACE VIEW creates it
C. CREATE OR REPLACE VIEW deletes all base tables before updating
D. ALTER VIEW requires dropping foreign keys first
**Answer:** B
**Explanation:** ALTER VIEW requires the view to exist beforehand; CREATE OR REPLACE VIEW creates the view if missing or alters it if already present.
---

### 3. What error occurs if a base table column referenced by an existing view is dropped?
A. The column is automatically reinstated in the base table
B. Querying the view throws ERROR 1356: View references invalid table(s) or column(s)
C. The view automatically replaces missing column values with NULL
D. The entire database schema locks into read-only mode
**Answer:** B
**Explanation:** Dropping a dependent column leaves the view invalid. Subsequent SELECT queries against the view result in MySQL Error 1356.
---

### 4. Which ALGORITHM option merges the view's query text directly into the outer caller query?
A. TEMPTABLE
B. MATERIALIZED
C. MERGE
D. INLINE_CACHE
**Answer:** C
**Explanation:** The MERGE algorithm rewrites the combined query, merging caller conditions with the view definition to leverage indexes directly.
---

### 5. How can you drop multiple views in a single SQL statement?
A. DELETE VIEW v1 AND v2;
B. DROP VIEW IF EXISTS v1, v2, v3;
C. TRUNCATE VIEW v1, v2;
D. DROP ALL VIEWS LIKE 'v%';
**Answer:** B
**Explanation:** MySQL's DROP VIEW statement accepts a comma-separated list of view names with optional IF EXISTS syntax.
---
