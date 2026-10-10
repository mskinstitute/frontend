---
id: multi-column-sorting
slug: multi-column-sorting
course: sql-for-beginners
chapter: Sorting, Limiting & Pagination
topic: "Multi-Column Sorting: Hierarchical Ordering & Custom Expressions"
difficulty: Beginner
readingTime: 12
order: 40
keywords: ["multi-column sorting","tie breaker sorting","composite order by","custom sorting","field function"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Multi-Column Sorting: Hierarchical Ordering & Custom Expressions
When querying large enterprise tables, sorting by a single column often produces ties: multiple employees work in the same department, or multiple products share the exact same price. **Multi-Column Sorting** allows you to specify a primary sort column followed by secondary and tertiary "tie-breaker" columns, each with its own independent sort direction.

---

## 1. Syntax for Multi-Column Sorting

Separate each column and its desired direction with a comma:

```sql
SELECT column_1, column_2, column_3
FROM table_name
ORDER BY 
    primary_column [ASC|DESC],
    secondary_column [ASC|DESC],
    tertiary_column [ASC|DESC];
```

### Real-World Example:
Sort employees by **Department alphabetically**, and within each department, sort by **Salary descending** (highest paid first):

```sql
SELECT employee_id, full_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
```

### Result Grid:
```text
+-------------+---------------+-------------+----------+
| employee_id | full_name     | department  | salary   |
+-------------+---------------+-------------+----------+
|         104 | Vikram Rao    | Engineering | 95000.00 | <-- Highest salary in Engineering
|         101 | Aarav Sharma  | Engineering | 80000.00 |
|         108 | Neha Gupta    | Engineering | 65000.00 |
|         102 | Priya Patel   | Marketing   | 72000.00 | <-- Highest salary in Marketing
|         105 | Rohan Verma   | Marketing   | 54000.00 |
+-------------+---------------+-------------+----------+
```

---

## 2. Sorting by Computed Expressions

You can sort results by mathematical calculations, string manipulations, or date functions directly:

```sql
-- Sort students by their total mark percentage:
SELECT 
    student_name, 
    theory_marks, 
    practical_marks,
    (theory_marks + practical_marks) / 2 AS average_score
FROM exam_results
ORDER BY (theory_marks + practical_marks) DESC;
```

---

## 3. Custom Non-Alphabetical Sorting with `FIELD()`

What if you need to sort records in a specific, non-alphabetical business order?
For example, sorting support tickets by priority: **Critical -> High -> Medium -> Low**.

Standard `ASC` or `DESC` will sort alphabetically (`Critical -> High -> Low -> Medium`), which is incorrect! MySQL provides the **`FIELD()`** function for custom ordering:

```sql
SELECT ticket_id, issue_title, priority
FROM support_tickets
ORDER BY FIELD(priority, 'Critical', 'High', 'Medium', 'Low');
```

### How `FIELD()` Works:
- `FIELD(str, str1, str2, ...)` returns the 1-based index position of `str` within the list.
- `'Critical'` returns 1, `'High'` returns 2, `'Medium'` returns 3, `'Low'` returns 4.
- The `ORDER BY` clause sorts the rows by these returned numeric values (1, 2, 3, 4)!

---

## 4. Composite Indexes for Multi-Column Sorting

When you frequently sort by multiple columns (e.g., `ORDER BY department ASC, salary DESC`), MySQL can satisfy the query instantaneously with **zero filesort overhead** if a matching **Composite Index** is present:

```sql
-- Optimal index for ORDER BY department ASC, salary DESC:
CREATE INDEX idx_dept_salary ON employees (department ASC, salary DESC);
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid Sorting by Too Many Columns:** Sorting by 5 or 6 columns without composite indexes consumes substantial server sorting memory (`sort_buffer_size`). Stick to 1 to 3 primary sorting criteria.
- **Direction Specifies per Column:** Remember that specifying `DESC` at the end applies **only to the column immediately preceding it**! Writing `ORDER BY col1, col2 DESC` sorts `col1` in **ASC** order and `col2` in **DESC** order.

---

# Multiple Choice Questions

### 1. In the statement `ORDER BY state ASC, city DESC`, how are the rows ordered?
A. First by city descending, then ties broken by state ascending
B. First by state ascending, then ties broken by city descending
C. Both columns are sorted descending
D. Both columns are sorted ascending
**Answer:** B
**Explanation:** Multi-column sorting processes from left to right: the primary sort is applied on `state ASC`, and ties within the same state are ordered by `city DESC`.
---

### 2. Which MySQL function allows sorting string values according to a custom non-alphabetical list (e.g., 'Gold', 'Silver', 'Bronze')?
A. CUSTOM_SORT()
B. FIELD()
C. LIST_ORDER()
D. ENUM_INDEX()
**Answer:** B
**Explanation:** `FIELD(column, 'Gold', 'Silver', 'Bronze')` returns the index position of the value in the list, enabling custom non-alphabetical sorting.
---

### 3. In the query `SELECT name, dept, salary FROM staff ORDER BY dept, salary DESC;`, what is the sort direction of the `dept` column?
A. DESC
B. ASC
C. Random
D. Case-sensitive
**Answer:** B
**Explanation:** Because no direction was explicitly attached to `dept`, it defaults to `ASC`. The `DESC` keyword applies only to `salary`.
---

### 4. Which database object can eliminate the need for an in-memory Filesort when sorting by `ORDER BY category ASC, price DESC`?
A. A foreign key
B. A composite index matching (category ASC, price DESC)
C. A database view
D. A trigger
**Answer:** B
**Explanation:** A composite B-Tree index covering the sorted columns in their required directions allows the engine to read rows already in sorted order without filesort.
---

### 5. Can an `ORDER BY` clause sort records based on a mathematical expression involving multiple columns?
A. No, only raw column names are permitted
B. Yes, SQL supports sorting by arbitrary mathematical or functional expressions
C. Only if the expression evaluates to a negative number
D. Only in MySQL Workbench
**Answer:** B
**Explanation:** `ORDER BY` can sort by arbitrary expressions (e.g., `ORDER BY (unit_price * quantity) DESC`).
---
