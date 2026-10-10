---
id: ctes-vs-subqueries-vs-views
slug: ctes-vs-subqueries-vs-views
course: sql-for-intermediate
chapter: Common Table Expressions (CTEs)
topic: "CTEs vs Subqueries vs Views Comparison"
difficulty: Intermediate
readingTime: 11
order: 34
keywords: ["cte vs subquery","cte vs view","query optimization","database views comparison","derived tables"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# CTEs vs Subqueries vs Views Comparison
Modern SQL provides three powerful mechanisms to structure, modularize, and encapsulate queries: **Subqueries (Derived Tables)**, **Common Table Expressions (CTEs)**, and **Database Views**.

Junior developers often struggle to decide which tool to choose for a given task. Selecting the appropriate abstraction directly influences query readability, performance, cacheability, and security.

---

### Architectural Feature Comparison

| Feature / Dimension | Subquery (Derived Table) | CTE (`WITH`) | Database View |
| :--- | :--- | :--- | :--- |
| **Persistence** | Volatile (inline in query) | Volatile (single statement) | Persistent (stored DDL in data dictionary) |
| **Reusability** | Zero (must be retyped) | Reusable within same query | Globally reusable across all sessions/queries |
| **Syntax Location** | Embedded inside `FROM`/`WHERE` | Defined at top before main query | Created once via `CREATE VIEW` |
| **Recursion Support**| No | **Yes** (`WITH RECURSIVE`) | No (unless view queries a recursive CTE) |
| **Security & Masking**| No | No | **Yes** (Grant access to view, not base table) |
| **Readability** | Poor when nested deeply | **Exceptional** (top-down pipeline) | High (masks query completely) |
| **Parameter Passing**| N/A | N/A | N/A (requires filtering in outer `WHERE`) |

---

### When to Use Each Technique

#### 1. When to Use a Database View
- You need to share a standardized business calculation across multiple microservices or business intelligence dashboards (e.g., `v_monthly_active_users`).
- You must restrict column-level or row-level access for security compliance (e.g., masking credit cards or employee salaries).
- You want to decouple database schema changes from consumer applications.

#### 2. When to Use a Common Table Expression (CTE)
- You are constructing a complex multi-step data transformation or analytical report within a single query.
- You need to reference the same intermediate aggregated dataset more than once in the same query.
- You need to traverse hierarchical data structures, graphs, or sequences recursively.
- You want clean, self-documenting, maintainable code without polluting the database catalog with permanent view objects.

#### 3. When to Use an Inline Subquery
- Quick, one-off comparisons in a `WHERE` clause (e.g., `WHERE salary > (SELECT AVG(salary) FROM employees)`).
- Simple membership lookups with `IN` or existence checks with `EXISTS`.
- Trivially simple derived tables that do not warrant the formality of a `WITH` block.

---

### Performance Considerations in MySQL 8.0

In early versions of MySQL, derived tables always materialized temporary tables on disk. In modern MySQL 8.0+:
- The query optimizer employs **Derived Table Merging** and **CTE Inlining**: simple CTEs and derived tables are rewritten into the parent query, allowing indexes from the underlying tables to be utilized.
- If a CTE is referenced multiple times, MySQL can choose between materializing the CTE once into a temporary table or computing it in-place depending on cost estimation.
- Views defined with `ALGORITHM = MERGE` incur zero performance penalty compared to raw table queries.

---

# Multiple Choice Questions

### 1. Which abstraction is permanently stored in the database catalog and can be reused by multiple users across different sessions?
A. Inline Subquery
B. Derived Table
C. Database View
D. Common Table Expression
**Answer:** C
**Explanation:** Views are persistent database objects whose DDL definitions are stored in the data dictionary for repeated access across sessions.
---

### 2. If you need to traverse an organizational reporting tree recursively, which tool should you choose?
A. Scalar Subquery
B. Correlated Subquery
C. Recursive CTE (WITH RECURSIVE)
D. Simple Case Expression
**Answer:** C
**Explanation:** Recursive CTEs natively support iterative tree and graph traversals in SQL.
---

### 3. If an analytics query needs to reference an intermediate aggregation three times in the same statement without polluting the schema with a permanent object, what is the best choice?
A. Duplicate the identical subquery three times in the FROM clause
B. Define a Common Table Expression (CTE) once in a WITH clause
C. Create a permanent base table using CREATE TABLE
D. Export the data to a CSV file
**Answer:** B
**Explanation:** A CTE can be defined once at the top of the query and referenced multiple times in joins, unions, and filters within that same statement.
---

### 4. For masking sensitive columns from an external reporting tool, which mechanism is required?
A. A local temporary CTE
B. A Database View with restricted SELECT grants
C. An unindexed derived subquery
D. A recursive UNION ALL loop
**Answer:** B
**Explanation:** Only views can receive granular user privileges (GRANT SELECT ON db.view TO user) while locking down base tables.
---

### 5. Does a CTE persist on disk after the SQL query finishes executing?
A. Yes, in the MySQL system directory
B. Yes, until the next server restart
C. No, its scope is strictly confined to the execution lifetime of that single query
D. Yes, inside the InnoDB undo log
**Answer:** C
**Explanation:** CTEs are volatile; they cease to exist the instant the query finishes executing.
---
