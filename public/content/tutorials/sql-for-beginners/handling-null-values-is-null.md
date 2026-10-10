---
id: handling-null-values-is-null
slug: handling-null-values-is-null
course: sql-for-beginners
chapter: Advanced Filtering & Searching
topic: "Handling NULL Values: IS NULL, IS NOT NULL, and Three-Valued Logic"
difficulty: Beginner
readingTime: 12
order: 38
keywords: ["is null","is not null","null values","three valued logic","handling missing data"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Handling NULL Values: IS NULL, IS NOT NULL, and Three-Valued Logic
No concept in relational databases trips up beginners and seasoned programmers more consistently than **`NULL`**. Because `NULL` represents missing or unknown information, standard equality operators (`=` and `!=`) do not work as expected. To inspect, filter, and handle missing values properly, you must use **`IS NULL`** and **`IS NOT NULL`**.

---

## 1. What is `NULL`? (And What It Isn't)

```
   NULL is NOT equal to 0.         (0 is a known, definitive integer).
   NULL is NOT equal to "" (empty). ("" is a known, definitive string of length 0).
   NULL represents ABSENCE OF DATA / UNKNOWN.
```

### The Fundamental Rule:
Because `NULL` represents an unknown, **nothing can equal `NULL`—not even another `NULL`!**

```sql
-- Let's test this in MySQL:
SELECT NULL = NULL;   -- Returns NULL (Not 1, not 0, but UNKNOWN!)
SELECT NULL != NULL;  -- Returns NULL (UNKNOWN!)
SELECT NULL = 0;      -- Returns NULL (UNKNOWN!)
SELECT NULL = '';     -- Returns NULL (UNKNOWN!)
```

---

## 2. The Correct Syntax: `IS NULL` and `IS NOT NULL`

Because standard comparison operators fail on `NULL`, SQL provides dedicated unary operators:

```sql
-- Find all orders that have NOT shipped yet (shipped_date is unrecorded):
SELECT order_id, customer_id, order_date
FROM orders
WHERE shipped_date IS NULL;

-- Find all customers who HAVE provided their phone number:
SELECT customer_id, full_name, phone_number
FROM customers
WHERE phone_number IS NOT NULL;
```

---

## 3. The Dangerous Trap: `WHERE column = NULL`

Consider this common junior developer error:

```sql
-- WRONG! NEVER WRITE THIS!
SELECT * FROM orders WHERE shipped_date = NULL;
```

### What happens when MySQL executes this?
1. For every row, MySQL evaluates `shipped_date = NULL`.
2. Regardless of whether `shipped_date` contains `'2026-03-10'` or `NULL`, the expression evaluates to **`UNKNOWN`**!
3. Because `WHERE` only returns rows that evaluate strictly to `TRUE`, **this query will return ZERO rows 100% of the time!**

---

## 4. Sorting Behavior of `NULL` in MySQL

How does `ORDER BY` handle rows with `NULL` values?
- In MySQL, **`NULL` values are treated as the lowest possible values**.
- In **`ORDER BY col ASC`**, rows containing `NULL` appear **at the very beginning**.
- In **`ORDER BY col DESC`**, rows containing `NULL` appear **at the very end**.

```sql
-- Put customers without a referral code at the bottom:
SELECT customer_id, full_name, referral_code
FROM customers
ORDER BY referral_code IS NULL ASC, referral_code ASC;
```

---

## 5. Replacing NULLs in Output: `IFNULL()` and `COALESCE()`

When presenting query results to users or frontend applications, displaying raw `NULL` values looks unpolished. You can replace `NULL` with friendly fallback values:

### `IFNULL(expression, fallback_value)` (MySQL Specific):
```sql
SELECT 
    full_name,
    IFNULL(phone_number, 'No Phone Provided') AS contact_phone
FROM customers;
```

### `COALESCE(val1, val2, ..., valN)` (ANSI SQL Standard):
Returns the first non-null value in its parameter list:
```sql
SELECT 
    full_name,
    COALESCE(work_phone, mobile_phone, home_phone, 'N/A') AS primary_contact
FROM customer_directory;
```

---

## 6. Best Practices & Common Pitfalls

- **Avoid Nullable Foreign Keys Where Possible:** Making foreign keys nullable allows orphaned child rows with no parent entity. Only make foreign keys nullable when the relationship is genuinely optional.
- **Count Gotcha (`COUNT(col)` vs `COUNT(*)`):**
  - `COUNT(*)` counts **all rows** regardless of nullability.
  - `COUNT(column_name)` counts **only rows where that column is NOT NULL**!

---

# Multiple Choice Questions

### 1. Which SQL operator correctly checks if a column contains a missing or unrecorded value?
A. = NULL
B. == NULL
C. IS NULL
D. IS EMPTY
**Answer:** C
**Explanation:** `IS NULL` is the dedicated SQL operator designed to test for the presence of NULL values.
---

### 2. What will the query `SELECT * FROM employees WHERE bonus = NULL;` return?
A. All employees with a bonus of zero
B. All employees whose bonus is NULL
C. Zero rows, because comparing any value to NULL using '=' yields UNKNOWN
D. An error message
**Answer:** C
**Explanation:** In SQL, `bonus = NULL` evaluates to UNKNOWN for every row, causing the WHERE clause to discard all records.
---

### 3. How does MySQL sort `NULL` values when executing an `ORDER BY column ASC` statement?
A. NULL values are placed at the very top (treated as the lowest values)
B. NULL values are placed at the very bottom
C. NULL values are randomly scattered
D. NULL values are omitted from the output
**Answer:** A
**Explanation:** In MySQL, NULL values are treated as lower than any non-NULL value, causing them to appear first in ascending (ASC) sorts.
---

### 4. Which function returns the first non-NULL value from a comma-separated list of arguments?
A. IFNULL()
B. COALESCE()
C. NULLIF()
D. ISNULL()
**Answer:** B
**Explanation:** `COALESCE(val1, val2, ...)` is the standard SQL function that evaluates arguments sequentially and returns the first non-NULL entry.
---

### 5. What is the difference between `COUNT(*)` and `COUNT(commission_pct)` on a table with 100 rows where 20 rows have NULL commissions?
A. Both return 100
B. COUNT(*) returns 100, while COUNT(commission_pct) returns 80
C. Both return 80
D. COUNT(commission_pct) throws an error
**Answer:** B
**Explanation:** `COUNT(*)` tallies total physical rows (100), whereas `COUNT(column_name)` tallies only rows where the specified column contains a non-NULL value (80).
---
