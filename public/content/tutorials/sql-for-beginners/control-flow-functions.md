---
id: control-flow-functions
slug: control-flow-functions
course: sql-for-beginners
chapter: SQL Built-in Scalar Functions
topic: "Control Flow Functions: IF, IFNULL, and COALESCE"
difficulty: Beginner
readingTime: 12
order: 46
keywords: ["control flow","if function","ifnull","coalesce","nullif","conditional expressions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Control Flow Functions: IF, IFNULL, and COALESCE
Relational databases are not limited to passive data retrieval. You often need inline conditional logic: classifying orders as *High Value* vs *Standard*, substituting missing telephone numbers, or preventing division by zero errors. MySQL provides several compact **Control Flow Functions**: **`IF()`**, **`IFNULL()`**, **`NULLIF()`**, and the ANSI standard **`COALESCE()`**.

---

## 1. The Ternary `IF(condition, true_val, false_val)` Function

MySQL's built-in `IF()` function operates exactly like the ternary operator in programming languages (`condition ? true_val : false_val`):

```sql
-- Classify employee compensation tiers:
SELECT 
    full_name, 
    salary,
    IF(salary >= 75000.00, 'Senior Compensation', 'Standard Compensation') AS salary_tier
FROM employees;
```

---

## 2. Replacing NULLs: `IFNULL(expression, fallback)`

The **`IFNULL()`** function takes two arguments:
1. If the first argument is **NOT NULL**, it returns the first argument.
2. If the first argument **IS NULL**, it returns the second argument (the fallback).

```sql
-- Replace missing discount percentages with 0%:
SELECT 
    product_name,
    base_price,
    IFNULL(discount_percentage, 0.00) AS applied_discount
FROM products;
```

---

## 3. The Universal Standard: `COALESCE(val1, val2, ..., valN)`

While `IFNULL()` is a MySQL-specific convenience limited to two arguments, **`COALESCE()`** is the **ANSI SQL standard** function supported by every relational database on Earth. It evaluates arguments from left to right and returns the **first non-null value**:

```sql
-- Cascading contact lookup:
-- Checks mobile phone first. If NULL, checks work phone. If NULL, checks email.
-- If all are NULL, falls back to 'No Contact Info'!
SELECT 
    customer_name,
    COALESCE(mobile_phone, work_phone, home_phone, email, 'No Contact Info') AS primary_reach
FROM customers;
```

---

## 4. Preventing Errors: `NULLIF(val1, val2)`

The **`NULLIF()`** function compares two arguments:
- If `val1 = val2`, it returns **`NULL`**!
- Otherwise, it returns `val1`.

### The Classic Use Case: Safe Division by Zero Prevention
```sql
-- If sales_count is 0, NULLIF(sales_count, 0) turns it into NULL.
-- In SQL, any number divided by NULL safely evaluates to NULL without error!
SELECT 
    total_revenue,
    sales_count,
    total_revenue / NULLIF(sales_count, 0) AS average_sale_amount
FROM store_analytics;
```

---

## 5. Comparison: Control Flow Functions

| Function | Standard? | Arguments | Return Rule |
| :--- | :--- | :--- | :--- |
| **`IF(cond, a, b)`** | MySQL Only | Exactly 3 | Returns `a` if `cond` is true; else `b`. |
| **`IFNULL(a, b)`** | MySQL Only | Exactly 2 | Returns `a` if `a` is not null; else `b`. |
| **`COALESCE(a, b, ...)`**| **ANSI SQL** | 2 or more | Returns the first non-null argument in list. |
| **`NULLIF(a, b)`** | **ANSI SQL** | Exactly 2 | Returns `NULL` if `a = b`; else `a`. |

---

## 6. Best Practices & Common Pitfalls

- **Prefer COALESCE over IFNULL for Portability:** If there is any chance your application might migrate to PostgreSQL, Oracle, or SQLite, always choose `COALESCE()` over `IFNULL()`.
- **Complex Multi-Branch Logic:** For multi-branch conditional trees with more than two outcomes, avoid nesting multiple `IF()` statements. Use standard `CASE WHEN ... THEN ... ELSE ... END` expressions instead.

---

# Multiple Choice Questions

### 1. What does `SELECT IF(10 > 5, 'Yes', 'No');` return in MySQL?
A. Yes
B. No
C. TRUE
D. NULL
**Answer:** A
**Explanation:** The `IF()` function evaluates the boolean condition `10 > 5` to TRUE, returning the second argument ('Yes').
---

### 2. What will `COALESCE(NULL, NULL, 'Found Me', 'Backup')` return?
A. NULL
B. 'Found Me'
C. 'Backup'
D. 0
**Answer:** B
**Explanation:** `COALESCE()` evaluates arguments in order and returns the first non-null entry ('Found Me').
---

### 3. What does `NULLIF(50, 50)` return?
A. 50
B. 0
C. NULL
D. TRUE
**Answer:** C
**Explanation:** `NULLIF(a, b)` returns `NULL` whenever its two arguments are equal to each other.
---

### 4. Which function is an official ANSI SQL standard supported across all major database engines?
A. IF()
B. IFNULL()
C. COALESCE()
D. NVL()
**Answer:** C
**Explanation:** `COALESCE()` and `NULLIF()` are part of the core ANSI SQL standard, whereas `IF()` and `IFNULL()` are MySQL-specific functions.
---

### 5. How can `NULLIF` be used to prevent division by zero errors when dividing `revenue` by `visits`?
A. revenue / ZERO(visits)
B. revenue / NULLIF(visits, 0)
C. NULLIF(revenue / visits, 0)
D. DIVIDE(revenue, visits)
**Answer:** B
**Explanation:** `NULLIF(visits, 0)` returns `NULL` when `visits = 0`. Dividing by `NULL` evaluates gracefully to `NULL` instead of crashing.
---
