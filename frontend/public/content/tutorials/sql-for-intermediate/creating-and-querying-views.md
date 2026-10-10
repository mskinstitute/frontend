---
id: creating-and-querying-views
slug: creating-and-querying-views
course: sql-for-intermediate
chapter: Database Views
topic: "Creating & Querying Views (CREATE VIEW)"
difficulty: Intermediate
readingTime: 12
order: 27
keywords: ["views","create view","querying views","virtual tables","mysql views"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Creating & Querying Views (CREATE VIEW)
A **View** in SQL is a named, stored query definition that acts as a virtual table. It does not store physical rows of data itself (unless indexed or materialized in supporting engines); instead, every time a view is queried, MySQL executes the underlying `SELECT` query against the base tables and dynamically renders the result set.

Views encapsulate complex SQL logic, provide reusable abstractions, enhance security by exposing only necessary columns/rows, and ensure standard metrics across an entire development team.

---

### The Fundamental Purpose of Views

1. **Query Simplification:** Hide multi-table joins, subqueries, and mathematical computations behind a simple table-like interface (`SELECT * FROM active_customer_summary`).
2. **Access Security & Column Whitelisting:** Grant developers or analytics tools `SELECT` access only to the view, concealing sensitive columns like passwords, social security numbers, or internal cost margins.
3. **Data Integrity & Consistency:** Guarantee that business logic (such as calculating `net_revenue = gross - tax - discount`) is implemented identically across all backend microservices.

---

### Creating a View Syntax

```sql
CREATE [OR REPLACE] VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

Using `OR REPLACE` allows you to overwrite an existing view definition without first issuing a `DROP VIEW` statement.

---

### Practical Walkthrough: Sales Reporting View

Consider an online retail database with `customers`, `orders`, and `order_items` tables. Querying the lifetime value and latest order for every customer requires multiple joins and aggregations.

```sql
-- Creating a reusable virtual reporting view
CREATE OR REPLACE VIEW v_customer_order_summary AS
SELECT 
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS full_name,
    c.email,
    c.country,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0.00) AS lifetime_spend,
    MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.is_active = 1
GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.country;
```

---

### Querying Views Just Like Tables

Once created, users can filter, sort, and paginate against the view with standard `SELECT` statements:

```sql
-- Query high-value VIP customers using the view
SELECT full_name, email, lifetime_spend, total_orders
FROM v_customer_order_summary
WHERE lifetime_spend >= 1000.00
ORDER BY lifetime_spend DESC
LIMIT 10;
```

Under the hood, MySQL merges the view query with the outer query using its query optimizer (via the `MERGE` or `TEMPTABLE` algorithm).

---

### Viewing View Definitions

To inspect the underlying DDL query of a view:

```sql
SHOW CREATE VIEW v_customer_order_summary;
```

Or query the system catalog in `information_schema`:

```sql
SELECT table_name, view_definition, check_option, is_updatable
FROM information_schema.views
WHERE table_schema = 'my_ecommerce_db';
```

---

# Multiple Choice Questions

### 1. What is a SQL View?
A. A physical table on disk that duplicates base table data every hour
B. A saved virtual query that dynamically retrieves data from base tables upon execution
C. A compiled binary procedure that only executes inside stored routines
D. A temporary memory cache created exclusively for stored procedures
**Answer:** B
**Explanation:** A SQL view is a virtual table representing the result of a stored SELECT statement. It retrieves fresh data from underlying base tables whenever queried.
---

### 2. Which clause safely modifies an existing view definition without dropping it first?
A. ALTER OR INSERT VIEW
B. UPDATE VIEW DEFINITION
C. CREATE OR REPLACE VIEW
D. MODIFY VIEW SCHEMA
**Answer:** C
**Explanation:** The CREATE OR REPLACE VIEW syntax overwrites an existing view definition or creates a new one if it does not already exist.
---

### 3. How do views enhance database security?
A. By automatically encrypting table storage on disk using AES-256
B. By exposing a whitelist of safe columns and rows while hiding sensitive columns like passwords or SSNs
C. By restricting network ports on the MySQL host operating system
D. By disabling all foreign key constraints on the base tables
**Answer:** B
**Explanation:** Views allow database administrators to grant users access to specific views containing safe columns while revoking direct access to the underlying sensitive base tables.
---

### 4. When querying a view, what standard SQL clauses can be applied?
A. Only WHERE, without ORDER BY or LIMIT
B. Only SELECT *, without column projection
C. Any valid SQL clauses including WHERE, ORDER BY, GROUP BY, and LIMIT
D. None, because view queries are immutable and cannot take outer filters
**Answer:** C
**Explanation:** Views behave like virtual tables; callers can project specific columns, attach WHERE filters, join views with other tables, and apply sorting or pagination.
---

### 5. Where does MySQL store the metadata definition of all created views?
A. In the local mysql.log text file
B. In the performance_schema.events_waits_current table
C. In information_schema.views and the data dictionary
D. In client-side MySQL Workbench configuration files
**Answer:** C
**Explanation:** MySQL records all view definitions, check options, and updatability metadata within the information_schema.views dictionary table.
---
