---
id: numeric-and-math-functions
slug: numeric-and-math-functions
course: sql-for-beginners
chapter: SQL Built-in Scalar Functions
topic: "Numeric & Math Functions: Rounding, Arithmetic, and Truncation"
difficulty: Beginner
readingTime: 12
order: 44
keywords: ["math functions","round vs truncate","ceil and floor","abs","mod","power"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Numeric & Math Functions: Rounding, Arithmetic, and Truncation
From calculating sales commissions and compound interest to processing GPS Euclidean distances and statistical distributions, SQL provides a comprehensive suite of mathematical functions. In this tutorial, you will master the most common scalar mathematical operations in MySQL.

---

## 1. Rounding and Precision: `ROUND()` vs `TRUNCATE()`

The two most common methods for reducing decimal precision are **rounding** and **truncation**:

### `ROUND(number, [decimals])`
Rounds a number according to standard mathematical rounding rules (0.5 and above rounds up, below rounds down):

```sql
SELECT ROUND(125.756, 2); -- Returns 125.76
SELECT ROUND(125.754, 2); -- Returns 125.75
SELECT ROUND(125.75);    -- Returns 126 (Default is 0 decimal places)
SELECT ROUND(125.75, -1); -- Returns 130 (Negative rounds to nearest tens place!)
```

### `TRUNCATE(number, decimals)`
Cuts off decimal places immediately without rounding:

```sql
SELECT TRUNCATE(125.756, 2); -- Returns 125.75 (Does not round up!)
SELECT TRUNCATE(125.756, 0); -- Returns 125
```

---

## 2. Integer Boundary Functions: `CEIL()` and `FLOOR()`

- **`CEIL()` / `CEILING()`:** Rounds a decimal **up** to the nearest integer.
- **`FLOOR()`:** Rounds a decimal **down** to the nearest integer.

```sql
SELECT CEIL(4.01);   -- Returns 5
SELECT CEIL(-4.99);  -- Returns -4

SELECT FLOOR(4.99);  -- Returns 4
SELECT FLOOR(-4.01); -- Returns -5
```

### Real-World Use Case: Pagination Page Count
```sql
-- If total_records = 95 and page_size = 10, how many total pages are needed?
SELECT CEIL(95 / 10.0) AS total_pages; -- Returns 10 pages!
```

---

## 3. Absolute Values & Modulo Arithmetic

### `ABS(number)`
Returns the non-negative absolute magnitude of a number:
```sql
SELECT ABS(-45.50); -- Returns 45.50
```

### `MOD(N, M)` or `N % M` (Remainder)
Returns the remainder of dividing N by M:
```sql
SELECT MOD(17, 5); -- Returns 2 (17 / 5 = 3 with remainder 2)

-- Check for even or odd row numbers:
SELECT order_id FROM orders WHERE MOD(order_id, 2) = 0; -- Even orders
```

---

## 4. Exponential and Logarithmic Functions

```sql
-- Power: 2 raised to the power of 8 (2^8)
SELECT POWER(2, 8); -- Returns 256

-- Square Root of 144
SELECT SQRT(144); -- Returns 12

-- Random Floating-Point Number between 0.0 and 1.0
SELECT RAND();

-- Random Integer between 1 and 100:
SELECT FLOOR(1 + RAND() * 100) AS random_pin;
```

---

## 5. Best Practices & Common Pitfalls

- **Avoid Division by Zero:** In MySQL, dividing any number by zero (`100 / 0`) returns **`NULL`** with a warning, rather than crashing the query. To handle potential zeros gracefully, use `NULLIF`:
  ```sql
  -- Safe division: If total_orders is 0, NULLIF turns it into NULL, returning NULL safely:
  SELECT revenue / NULLIF(total_orders, 0) AS average_order_value FROM daily_stats;
  ```
- **Floating-Point Imprecision:** Remember that `ROUND()` on a `FLOAT` column can yield unexpected tiny fractional tails. Always cast or store monetary calculations in `DECIMAL`.

---

# Multiple Choice Questions

### 1. What is the output of `SELECT ROUND(84.346, 2);`?
A. 84.34
B. 84.35
C. 84.40
D. 85.00
**Answer:** B
**Explanation:** Because the third digit after the decimal is 6 (>= 5), `ROUND` rounds the preceding digit up from 4 to 5, yielding 84.35.
---

### 2. How does `TRUNCATE(84.346, 2)` differ from `ROUND(84.346, 2)`?
A. TRUNCATE rounds up; ROUND rounds down
B. TRUNCATE simply slices off digits after the 2nd place (yielding 84.34) without rounding up
C. TRUNCATE only works on negative numbers
D. TRUNCATE converts to binary
**Answer:** B
**Explanation:** `TRUNCATE(N, D)` removes digits beyond the specified scale without performing rounding adjustments.
---

### 3. Which function rounds a decimal value up to the next highest integer (e.g., turning 7.1 into 8)?
A. FLOOR()
B. CEIL()
C. TOP()
D. HIGHER()
**Answer:** B
**Explanation:** `CEIL()` (or `CEILING()`) rounds any fractional number up to the next integer.
---

### 4. What is the result of dividing a number by zero (e.g., `SELECT 50 / 0;`) in MySQL?
A. 0
B. Fatal server crash
C. NULL
D. Infinity
**Answer:** C
**Explanation:** In standard MySQL arithmetic, division by zero produces a `NULL` result and a warning.
---

### 5. What does `SELECT MOD(25, 4);` return?
A. 6
B. 1
C. 0
D. 0.25
**Answer:** B
**Explanation:** 25 divided by 4 equals 6 with a remainder of 1 (`25 - (4 * 6) = 1`).
---
