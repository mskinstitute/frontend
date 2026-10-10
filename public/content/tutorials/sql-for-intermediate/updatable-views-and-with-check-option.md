---
id: updatable-views-and-with-check-option
slug: updatable-views-and-with-check-option
course: sql-for-intermediate
chapter: Database Views
topic: "Updatable Views & WITH CHECK OPTION"
difficulty: Intermediate
readingTime: 13
order: 28
keywords: ["updatable views","with check option","cascaded check option","local check option","mysql views"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Updatable Views & WITH CHECK OPTION
While views are predominantly used for data retrieval, MySQL allows certain views to be **updatable**. An updatable view permits `INSERT`, `UPDATE`, and `DELETE` statements executed against the view to be directly translated to modifications on the underlying base table.

To prevent updates or inserts that violate the view's qualifying filtering criteria, MySQL provides the **`WITH CHECK OPTION`** constraint.

---

### Rules for Updatable Views in MySQL

For a view to be updatable, there must be a direct 1-to-1 relationship between rows in the view and rows in the base table. A view is **NOT** updatable if its definition contains any of the following:

- Aggregate functions (`SUM()`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`)
- `DISTINCT`
- `GROUP BY` or `HAVING` clauses
- `UNION` or `UNION ALL`
- Subqueries in the `SELECT` list
- Non-updatable views in the `FROM` clause
- Join views where updates span multiple base tables simultaneously in ambiguous ways

---

### Example of an Updatable View

```sql
-- Base table: employees
CREATE TABLE employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'resigned', 'terminated') DEFAULT 'active'
);

-- Updatable View: active engineering staff
CREATE OR REPLACE VIEW v_engineering_staff AS
SELECT emp_id, first_name, last_name, department, salary
FROM employees
WHERE department = 'Engineering' AND status = 'active';
```

Now, issuing an update directly through the view:

```sql
UPDATE v_engineering_staff
SET salary = salary * 1.08
WHERE emp_id = 101;
```
This successfully modifies the `salary` column in the underlying `employees` table for employee 101!

---

### The Risk Without WITH CHECK OPTION

Consider what happens if an update changes the filtering column:

```sql
UPDATE v_engineering_staff
SET department = 'Marketing'
WHERE emp_id = 101;
```

Without protection, MySQL executes this update on `employees`. However, employee 101 is now in 'Marketing', meaning they instantly "vanish" from `v_engineering_staff`! Even worse, an `INSERT` could insert a record with `department = 'Finance'` through `v_engineering_staff`.

---

### Enforcing WITH CHECK OPTION

By appending `WITH CHECK OPTION`, MySQL validates any inserted or updated row against the view's `WHERE` condition:

```sql
CREATE OR REPLACE VIEW v_engineering_staff AS
SELECT emp_id, first_name, last_name, department, salary
FROM employees
WHERE department = 'Engineering' AND status = 'active'
WITH CHECK OPTION;
```

Now, if a query attempts to change the department out of 'Engineering':

```sql
-- This will fail with an error!
UPDATE v_engineering_staff
SET department = 'Marketing'
WHERE emp_id = 101;
-- ERROR 1369 (HY000): CHECK OPTION failed 'company_db.v_engineering_staff'
```

MySQL provides two scopes for `WITH CHECK OPTION`:
1. **`WITH CASCADED CHECK OPTION` (Default):** Evaluates rules for the current view and all underlying nested views.
2. **`WITH LOCAL CHECK OPTION`:** Evaluates rules only for the current view definition.

---

# Multiple Choice Questions

### 1. When is a MySQL view considered updatable?
A. Whenever it contains a GROUP BY and HAVING clause
B. When there is a deterministic 1-to-1 relationship between view rows and base table rows without aggregates or DISTINCT
C. Only when the view is indexed using a clustered primary key
D. Views are strictly read-only and can never receive INSERT or UPDATE statements
**Answer:** B
**Explanation:** A view is updatable in MySQL only when each row in the view maps uniquely to a single underlying row in a base table, without aggregations, grouping, or set operations.
---

### 2. Which clause prevents INSERT or UPDATE statements through a view from violating the view's WHERE condition?
A. WITH ENFORCE CONSTRAINTS
B. STRICT MODE ONLY
C. WITH CHECK OPTION
D. VALIDATE INTEGRITY
**Answer:** C
**Explanation:** WITH CHECK OPTION causes MySQL to reject any INSERT or UPDATE on the view that would produce rows not visible under the view's WHERE clause.
---

### 3. What happens when WITH CHECK OPTION is violated during an UPDATE?
A. The row is moved to a quarantine table
B. MySQL raises ERROR 1369 and aborts the statement
C. The row is updated anyway, but a warning is logged
D. The database server restarts in recovery mode
**Answer:** B
**Explanation:** MySQL halts the transaction and returns error code 1369: "CHECK OPTION failed".
---

### 4. What is the difference between LOCAL and CASCADED check options?
A. LOCAL checks foreign keys, while CASCADED checks primary keys
B. LOCAL checks only the view's own WHERE clause; CASCADED evaluates conditions of the view and all underlying views
C. LOCAL works only on localhost connections; CASCADED works over networks
D. LOCAL applies to integers; CASCADED applies to strings
**Answer:** B
**Explanation:** CASCADED (the default) checks the criteria of the current view and all views from which it is derived. LOCAL restricts validation to the current view.
---

### 5. Which of the following view definitions is fundamentally NOT updatable?
A. CREATE VIEW v1 AS SELECT id, name FROM users WHERE active = 1;
B. CREATE VIEW v2 AS SELECT emp_id, salary FROM payroll WHERE salary > 50000;
C. CREATE VIEW v3 AS SELECT dept_id, AVG(salary) FROM employees GROUP BY dept_id;
D. CREATE VIEW v4 AS SELECT product_id, stock_qty FROM inventory;
**Answer:** C
**Explanation:** Views that include aggregate functions (AVG) and GROUP BY clauses cannot be updated because individual rows cannot be mapped back to base records.
---
