---
id: comparison-operators
slug: comparison-operators
course: sql-for-beginners
chapter: Data Querying Basics (DQL)
topic: "Comparison Operators in SQL: Exact and Relational Checks"
difficulty: Beginner
readingTime: 12
order: 33
keywords: ["comparison operators","not equal","spaceship operator","equality operator","relational comparison"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Comparison Operators in SQL: Exact and Relational Checks
To filter rows effectively in a `WHERE` clause, you evaluate expressions using **Comparison Operators**. These operators compare two expressions and evaluate to `TRUE`, `FALSE`, or `UNKNOWN`.

---

## 1. Standard SQL Comparison Operators

| Operator | Meaning | Example | Result for Match |
| :--- | :--- | :--- | :--- |
| **`=`** | Equal to | `status = 'Shipped'` | TRUE if values match. |
| **`!=`** or **`<>`**| Not equal to | `department != 'HR'` | TRUE if values differ. |
| **`<`** | Less than | `price < 500.00` | TRUE if left is strictly smaller. |
| **`<=`** | Less than or equal to | `age <= 60` | TRUE if left is smaller or equal. |
| **`>`** | Greater than | `salary > 50000.00` | TRUE if left is strictly larger. |
| **`>=`** | Greater than or equal to | `rating >= 4.5` | TRUE if left is larger or equal. |

```sql
-- Find all products priced at ₹1,000 or higher:
SELECT product_name, price 
FROM products 
WHERE price >= 1000.00;

-- Find all orders NOT marked as 'Delivered' (Using ANSI standard <>):
SELECT order_id, customer_id, order_status 
FROM orders 
WHERE order_status <> 'Delivered';
```

---

## 2. `!=` vs `<>`: Which is Preferred?

In MySQL, both **`!=`** and **`<>`** perform the exact same "not equal to" comparison.
- **`<>`** is the **official ANSI SQL standard** operator, compatible across all database vendors (Oracle, PostgreSQL, SQL Server, SQLite).
- **`!=`** is a popular vendor convenience operator.
- **Best Practice:** Use **`<>`** for maximum cross-database portability.

---

## 3. The "Not Equal" NULL Trap!

One of the most common bugs in SQL query writing involves combining not-equal operators with `NULL` values:

```sql
-- Suppose our employees table has 5 employees:
-- 3 in 'Engineering', 1 in 'HR', and 1 with department = NULL.

SELECT * FROM employees WHERE department <> 'HR';
```

**Question:** Will the employee with `department = NULL` be returned?
**Answer:** **NO!** 
Because `NULL <> 'HR'` evaluates to **`UNKNOWN`**, the row is silently discarded! If you want to include employees without a department, you must write:

```sql
SELECT * FROM employees 
WHERE department <> 'HR' OR department IS NULL;
```

---

## 4. The MySQL Spaceship Operator (`<=>`)

To solve the NULL comparison problem, MySQL provides a unique operator: the **NULL-Safe Equal Operator** (**`<=>`**), affectionately called the **Spaceship Operator**:

```sql
-- Standard equality:
SELECT 1 = 1;     -- Returns 1 (TRUE)
SELECT NULL = NULL; -- Returns NULL (UNKNOWN)

-- NULL-Safe equality (<=>):
SELECT 1 <=> 1;       -- Returns 1 (TRUE)
SELECT NULL <=> NULL; -- Returns 1 (TRUE!)
SELECT 1 <=> NULL;    -- Returns 0 (FALSE)
```

You can use the spaceship operator to safely compare columns that might contain `NULL` without writing cumbersome `OR col IS NULL` clauses:

```sql
-- Matches rows where discount_code matches the user's input, even if both are NULL:
SELECT * FROM orders WHERE discount_code <=> NULL;
```

---

## 5. Best Practices & Common Pitfalls

- **Do Not Use `col = NULL`:** In SQL, writing `WHERE status = NULL` will **never return any rows**, because nothing can equal an unknown! Always use `IS NULL` or the spaceship operator `<=>`.
- **String Collation in Comparisons:** Remember that comparisons like `name = 'amit'` will match `'Amit'` and `'AMIT'` if your collation is case-insensitive (`_ci`).

---

# Multiple Choice Questions

### 1. Which operator is the official ANSI SQL standard for "not equal to"?
A. !=
B. <>
C. !==
D. ~=
**Answer:** B
**Explanation:** `<>` is the official ANSI standard operator representing inequality across all relational database management systems.
---

### 2. What does the expression `SELECT 5 <=> NULL;` evaluate to in MySQL?
A. NULL
B. 0 (FALSE)
C. 1 (TRUE)
D. Syntax Error
**Answer:** B
**Explanation:** The NULL-safe equal operator (`<=>`) returns 0 (FALSE) when one operand is a value and the other is NULL, without yielding an UNKNOWN state.
---

### 3. Why will the query `SELECT * FROM users WHERE middle_name = NULL;` return 0 rows even if users have NULL middle names?
A. Because NULL must be uppercase
B. Because in SQL, comparing any value to NULL using '=' yields UNKNOWN rather than TRUE
C. Because users cannot have NULL middle names
D. Because the table is empty
**Answer:** B
**Explanation:** `=` cannot compare NULLs in SQL; any expression like `col = NULL` evaluates to UNKNOWN and is rejected by the WHERE clause. `IS NULL` must be used instead.
---

### 4. What does the spaceship operator (`<=>`) return when comparing `NULL <=> NULL`?
A. NULL
B. 1 (TRUE)
C. 0 (FALSE)
D. Error 1054
**Answer:** B
**Explanation:** The spaceship operator treats two NULLs as equal to each other, returning 1 (TRUE).
---

### 5. If a table contains 10 rows (7 with `status = 'Active'`, 2 with `status = 'Banned'`, and 1 with `status = NULL`), how many rows will `WHERE status <> 'Banned'` return?
A. 10 rows
B. 9 rows
C. 7 rows
D. 8 rows
**Answer:** C
**Explanation:** Only the 7 'Active' rows are returned. The row with `status = NULL` evaluates to UNKNOWN for `NULL <> 'Banned'` and is excluded.
---
