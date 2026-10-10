---
id: recursive-ctes-hierarchies
slug: recursive-ctes-hierarchies
course: sql-for-intermediate
chapter: Common Table Expressions (CTEs)
topic: "Recursive CTEs for Hierarchies & Trees"
difficulty: Intermediate
readingTime: 14
order: 33
keywords: ["recursive cte","with recursive","hierarchical queries","trees in sql","cte_max_recursion_depth"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Recursive CTEs for Hierarchies & Trees
Standard relational tables store flat sets of rows, yet real-world enterprise data is filled with **hierarchies, trees, and graphs**:
- Organizational reporting charts (CEOs -> VPs -> Managers -> Developers)
- Multi-level product categories (Electronics -> Computers -> Laptops -> Gaming Laptops)
- Bill of Materials (BOM) in manufacturing (Car -> Engine -> Cylinder -> Piston Rings)

Before MySQL 8.0, querying arbitrarily deep hierarchies required recursive application code or complex stored procedures. **Recursive Common Table Expressions (`WITH RECURSIVE`)** solve this problem natively within pure SQL.

---

### Structure of a Recursive CTE

A recursive CTE consists of three indispensable components:
1. **The Anchor Member:** An initial non-recursive query that generates the starting base rows (e.g., the top-level CEO or root category).
2. **`UNION ALL` (or `UNION`):** Joins the anchor results to the subsequent recursive iterations.
3. **The Recursive Member:** A query that references the CTE itself, joining to the base table to fetch the next level of children. It continues executing until it yields an empty set.

```sql
WITH RECURSIVE cte_name AS (
    -- 1. Anchor Member
    SELECT id, name, parent_id, 1 AS depth
    FROM category
    WHERE parent_id IS NULL

    UNION ALL

    -- 2. Recursive Member
    SELECT c.id, c.name, c.parent_id, r.depth + 1
    FROM category c
    JOIN cte_name r ON c.parent_id = r.id
)
SELECT * FROM cte_name;
```

---

### Step-by-Step Example 1: Number Generation

To generate a sequence of numbers from 1 to 5:

```sql
WITH RECURSIVE NumberSeq AS (
    -- Anchor
    SELECT 1 AS num
    
    UNION ALL
    
    -- Recursive Step: increment num until condition terminates
    SELECT num + 1
    FROM NumberSeq
    WHERE num < 5
)
SELECT num FROM NumberSeq;
```
*Output:* 1, 2, 3, 4, 5.

---

### Step-by-Step Example 2: Organizational Hierarchy Traversal

Suppose an `employees` table has an `employee_id` and a `manager_id` pointing to their supervisor:

```sql
CREATE TABLE org_chart (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50),
    manager_id INT NULL
);

INSERT INTO org_chart VALUES
(1, 'Alice (CEO)', NULL),
(2, 'Bob (VP Tech)', 1),
(3, 'Charlie (VP Sales)', 1),
(4, 'David (Dev Manager)', 2),
(5, 'Eve (Senior Dev)', 4),
(6, 'Frank (Junior Dev)', 5);
```

Querying the entire reporting line from the CEO down to junior developers with depth levels:

```sql
WITH RECURSIVE HierarchyCTE AS (
    -- 1. Anchor: Start at the top of the pyramid (CEO)
    SELECT 
        emp_id, 
        name, 
        manager_id, 
        1 AS org_level,
        CAST(name AS CHAR(200)) AS path_trace
    FROM org_chart
    WHERE manager_id IS NULL

    UNION ALL

    -- 2. Recursive Step: Find all direct reports of current level
    SELECT 
        e.emp_id, 
        e.name, 
        e.manager_id, 
        h.org_level + 1,
        CONCAT(h.path_trace, ' -> ', e.name)
    FROM org_chart e
    JOIN HierarchyCTE h ON e.manager_id = h.emp_id
)
SELECT org_level, name, path_trace
FROM HierarchyCTE
ORDER BY path_trace;
```

---

### Preventing Infinite Recursion Loops

If cyclical references occur (e.g., Employee A manages Employee B, and Employee B manages Employee A), recursion could loop indefinitely, exhausting memory.

MySQL protects against runaway execution using the **`cte_max_recursion_depth`** system variable:

```sql
-- Check current recursion limit (default is 1000)
SHOW VARIABLES LIKE 'cte_max_recursion_depth';

-- Adjust recursion depth for large datasets or strict safety
SET SESSION cte_max_recursion_depth = 50;
```
If a query exceeds this limit, MySQL immediately aborts with:
`ERROR 3636 (HY000): Recursive query aborted after 51 iterations.`

---

# Multiple Choice Questions

### 1. Which keyword must follow WITH to enable recursive query capabilities in MySQL?
A. LOOP
B. RECURSIVE
C. ITERATE
D. CASCADE
**Answer:** B
**Explanation:** Recursive CTEs require the explicit syntax WITH RECURSIVE cte_name AS (...).
---

### 2. What are the two mandatory query components connected by UNION ALL inside a recursive CTE?
A. The Start block and the End block
B. The Anchor member and the Recursive member
C. The Clustered index and the Secondary index
D. The Trigger body and the Stored procedure
**Answer:** B
**Explanation:** A recursive CTE requires an Anchor member (producing the initial seed rows) and a Recursive member (which joins back to the CTE to retrieve children).
---

### 3. When does a recursive CTE terminate execution?
A. When the system clock reaches midnight
B. Only when a manual KILL QUERY command is executed
C. When the recursive query member returns an empty result set (or reaches maximum depth)
D. After exactly two iterations
**Answer:** C
**Explanation:** The recursive loop terminates naturally when the recursive member yields zero new rows, or when cte_max_recursion_depth is exceeded.
---

### 4. What MySQL system variable protects the database from infinite recursion loops in CTEs?
A. max_execution_time
B. cte_max_recursion_depth
C. innodb_lock_wait_timeout
D. recursive_loop_limit
**Answer:** B
**Explanation:** cte_max_recursion_depth (default: 1000) limits the total number of recursive iterations permitted before throwing an error.
---

### 5. What practical real-world problem are recursive CTEs best suited to solve?
A. Encrypting passwords with SHA-256
B. Traversing hierarchical relationships such as org charts, category trees, and bill-of-materials
C. Formatting timestamps into custom regional locales
D. Creating foreign key constraints between databases
**Answer:** B
**Explanation:** Recursive CTEs excel at traversing multi-level hierarchical trees, finding all descendants or ancestors without requiring procedural code.
---
