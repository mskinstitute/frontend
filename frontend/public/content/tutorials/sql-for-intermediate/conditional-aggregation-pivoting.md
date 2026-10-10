---
id: conditional-aggregation-pivoting
slug: conditional-aggregation-pivoting
course: sql-for-intermediate
chapter: Conditional Logic & Expressions
topic: "Conditional Aggregation: Data Pivoting & Crosstab Reporting"
difficulty: Intermediate
readingTime: 12
order: 20
keywords: ["conditional aggregation","data pivoting","crosstab","case inside sum","pivoting rows to columns"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Conditional Aggregation: Data Pivoting & Crosstab Reporting
Relational databases store transactional data **vertically** (normalized rows). However, business analysts and financial controllers want to see reports formatted **horizontally** (pivot tables / crosstabs): displaying sales by month across columns (*Jan, Feb, Mar*), or counting orders by status horizontally (*Pending, Shipped, Delivered*). 

While MySQL does not have a dedicated `PIVOT` keyword like SQL Server, you can achieve world-class data pivoting using **Conditional Aggregation** (embedding `CASE` expressions inside aggregate functions like `SUM()` and `COUNT()`).

---

## 1. The Concept of Data Pivoting

```
   NORMALIZED VERTICAL DATA:
   year | quarter | revenue
   2026 | Q1      | 150000.00
   2026 | Q2      | 180000.00
   2026 | Q3      | 210000.00
   2026 | Q4      | 250000.00

   PIVOTED HORIZONTAL REPORT (Columns created from row values!):
   year | Q1_Revenue | Q2_Revenue | Q3_Revenue | Q4_Revenue | Total_Yearly
   2026 | 150000.00  | 180000.00  | 210000.00  | 250000.00  | 790000.00
```

---

## 2. The Core Pattern: `SUM(CASE WHEN ...)`

To pivot data, you combine `SUM()` with a `CASE` expression. If the row matches the target category, return the numeric value; otherwise, return **`0`**:

```sql
SELECT 
    YEAR(order_date) AS sales_year,
    SUM(CASE WHEN QUARTER(order_date) = 1 THEN total_amount ELSE 0 END) AS Q1_Sales,
    SUM(CASE WHEN QUARTER(order_date) = 2 THEN total_amount ELSE 0 END) AS Q2_Sales,
    SUM(CASE WHEN QUARTER(order_date) = 3 THEN total_amount ELSE 0 END) AS Q3_Sales,
    SUM(CASE WHEN QUARTER(order_date) = 4 THEN total_amount ELSE 0 END) AS Q4_Sales,
    SUM(total_amount) AS Total_Annual_Sales
FROM orders
GROUP BY YEAR(order_date)
ORDER BY sales_year DESC;
```

---

## 3. Conditional Counting: `COUNT(CASE WHEN ...)`

When counting occurrences of specific conditions horizontally, exploit the fact that **`COUNT()` ignores `NULL`s**:

```sql
SELECT 
    department_id,
    COUNT(*) AS total_staff,
    
    -- Method A: Using SUM with 1 and 0
    SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_employees,
    
    -- Method B: Using COUNT with NULL (COUNT ignores NULL!)
    COUNT(CASE WHEN salary >= 80000 THEN 1 END) AS high_earners_count,
    COUNT(CASE WHEN salary < 40000 THEN 1 END) AS entry_level_count
FROM employees
GROUP BY department_id;
```

---

## 4. Real-World E-Commerce Dashboard Pivot

Let us generate a high-level summary showing order statuses broken down by customer acquisition channel:

```sql
SELECT 
    acquisition_channel,
    COUNT(order_id) AS total_orders_placed,
    SUM(CASE WHEN order_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
    SUM(CASE WHEN order_status = 'Pending'   THEN 1 ELSE 0 END) AS pending_orders,
    SUM(CASE WHEN order_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
    
    -- Calculate cancellation rate percentage on the fly!
    ROUND(
        (SUM(CASE WHEN order_status = 'Cancelled' THEN 1 ELSE 0 END) / COUNT(order_id)) * 100, 
        2
    ) AS cancellation_rate_pct
FROM orders
GROUP BY acquisition_channel;
```

---

## 5. Best Practices & Common Pitfalls

- **Do Not Use `COUNT(CASE WHEN cond THEN 0 END)`:** A common beginner bug! If you write `COUNT(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END)`, MySQL counts **both** 1 and 0 because `0` is a non-null value! Always use `ELSE NULL` (or omit `ELSE`) with `COUNT()`, or use `SUM()` with `ELSE 0`.
- **Performance Benefits:** Conditional aggregation computes multiple metrics across an entire table in a **single table scan**, replacing what would otherwise require 5 or 6 separate join queries!

---

# Multiple Choice Questions

### 1. What is "Conditional Aggregation" in relational SQL?
A. Aggregating data only when the server CPU is below 50%
B. Embedding conditional CASE expressions inside aggregate functions like SUM() and COUNT() to filter and pivot data
C. Grouping data without a GROUP BY clause
D. Deleting records based on average values
**Answer:** B
**Explanation:** Conditional aggregation nests `CASE` expressions within aggregate functions, enabling selective summation, counting, and crosstab pivoting in a single query pass.
---

### 2. Why does `COUNT(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END)` fail to count only shipped orders accurately?
A. COUNT cannot process numbers
B. Because 0 is a non-null value, COUNT tallies both 1 and 0, counting every row regardless of status
C. It triggers a divide-by-zero error
D. MySQL requires uppercase column names
**Answer:** B
**Explanation:** `COUNT(expression)` increments for every non-null result. Since `0` is non-null, every row is counted. You must use `SUM(...)` with 0, or `COUNT(...)` with `ELSE NULL`.
---

### 3. Which construct correctly sums sales revenue strictly for the month of January in a pivoted yearly report?
A. SUM(total) WHERE month = 1
B. SUM(CASE WHEN MONTH(order_date) = 1 THEN total ELSE 0 END)
C. PIVOT(total, 1)
D. COUNT(JANUARY(total))
**Answer:** B
**Explanation:** `SUM(CASE WHEN MONTH(...) = 1 THEN total ELSE 0 END)` selectively accumulates revenue for January while adding 0 for other months.
---

### 4. What is the primary performance advantage of conditional aggregation over joining multiple filtered subqueries?
A. It bypasses disk storage
B. It computes all cross-tabulated metrics in a single sequential scan of the table, avoiding multiple expensive table passes
C. It converts tables to MyISAM
D. It eliminates primary keys
**Answer:** B
**Explanation:** Conditional aggregation inspects the dataset once, categorizing metrics in memory rather than re-scanning or re-joining the table for each individual condition.
---

### 5. In a pivoted query calculating cancellation rates, what function prevents a division by zero error if `COUNT(order_id)` is 0?
A. NULLIF(COUNT(order_id), 0)
B. ZEROFILL()
C. SAFE_DIVIDE()
D. PREVENT_ZERO()
**Answer:** A
**Explanation:** Wrapping the denominator in `NULLIF(..., 0)` converts zero to `NULL`, allowing the division to yield `NULL` safely without throwing an error.
---
