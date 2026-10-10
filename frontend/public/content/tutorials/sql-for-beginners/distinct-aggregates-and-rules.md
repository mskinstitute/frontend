---
id: distinct-aggregates-and-rules
slug: distinct-aggregates-and-rules
course: sql-for-beginners
chapter: Aggregate Functions & Grouping
topic: "Using DISTINCT with Aggregate Functions: Deduplication Rules"
difficulty: Beginner
readingTime: 12
order: 50
keywords: ["distinct in aggregates","count distinct","sum distinct","grouping distinct","aggregation rules"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Using DISTINCT with Aggregate Functions: Deduplication Rules
When calculating business metrics, you often need to differentiate between the **raw volume of events** and the **number of unique entities involved**. For example, a customer may place 10 orders in a single week. If you calculate total orders, you want to count all 10. But if you want to know how many distinct customers placed orders, you must deduplicate before counting. In SQL, this is achieved by embedding **`DISTINCT`** inside aggregate functions.

---

## 1. Syntax of DISTINCT Inside Aggregates

```sql
AGGREGATE_FUNCTION(DISTINCT column_name)
```

---

## 2. `COUNT(*)` vs `COUNT(col)` vs `COUNT(DISTINCT col)`

```
   Table: web_visits
   +----------+-------------+---------+
   | visit_id | visitor_ip  | user_id |
   +----------+-------------+---------+
   |        1 | 192.168.1.1 |     101 |
   |        2 | 192.168.1.1 |     101 |
   |        3 | 192.168.1.5 |    NULL |
   |        4 | 192.168.1.9 |     102 |
   |        5 | 192.168.1.1 |     101 |
   +----------+-------------+---------+
```

Let us observe how each query evaluates against the table above:

```sql
-- 1. Total Page Hits (All rows):
SELECT COUNT(*) FROM web_visits;
-- Result: 5

-- 2. Identified Logged-in Hits (Non-null user_id):
SELECT COUNT(user_id) FROM web_visits;
-- Result: 4 (Skips the NULL row)

-- 3. Unique Logged-in Users:
SELECT COUNT(DISTINCT user_id) FROM web_visits;
-- Result: 2 (User 101 and User 102)

-- 4. Unique IP Addresses:
SELECT COUNT(DISTINCT visitor_ip) FROM web_visits;
-- Result: 3 ('192.168.1.1', '192.168.1.5', '192.168.1.9')
```

---

## 3. Combining Multiple DISTINCT Aggregates in One Query

MySQL allows executing multiple distinct aggregate calculations simultaneously:

```sql
SELECT 
    department,
    COUNT(*) AS total_employees,
    COUNT(DISTINCT job_title) AS distinct_roles_count,
    COUNT(DISTINCT manager_id) AS distinct_managers_count,
    AVG(salary) AS dept_avg_salary
FROM employees
GROUP BY department;
```

---

## 4. Can You Use `DISTINCT` with `SUM()` or `AVG()`?

Yes, although it is less common:
- **`SUM(DISTINCT salary)`**: Sums each unique salary value only once. If three engineers earn ₹80,000, it only includes ₹80,000 once in the sum.
- **`AVG(DISTINCT salary)`**: Calculates the average of unique salary values, ignoring frequency.

```sql
-- Notice: Rarely used in standard payroll, but useful in deduplicating multi-join fan-outs!
SELECT SUM(DISTINCT unit_price) FROM order_details;
```

---

## 5. Best Practices & Common Pitfalls

- **High Memory Overhead of `COUNT(DISTINCT)`:** Calculating `COUNT(DISTINCT col)` requires MySQL to maintain a temporary hash set or B-Tree in memory to track all previously seen values. Across 100 million rows with high cardinality, this can consume significant server memory.
- **`COUNT(DISTINCT col1, col2)`:** MySQL uniquely supports counting distinct combinations of multiple columns:
  ```sql
  -- Count unique combinations of city and state:
  SELECT COUNT(DISTINCT city, state) FROM locations;
  ```

---

# Multiple Choice Questions

### 1. In a table with 5 rows where a column contains values `[10, 10, 20, 20, NULL]`, what does `COUNT(DISTINCT column)` return?
A. 5
B. 4
C. 2
D. 3
**Answer:** C
**Explanation:** `COUNT(DISTINCT col)` deduplicates the values to `{10, 20}` and ignores the `NULL`, returning a count of 2.
---

### 2. What is the fundamental difference between `COUNT(*)` and `COUNT(DISTINCT user_id)`?
A. COUNT(*) only counts numbers; COUNT(DISTINCT) only counts text
B. COUNT(*) returns the total physical row count; COUNT(DISTINCT user_id) counts only unique, non-null user IDs
C. COUNT(*) is deprecated in MySQL 8.0
D. Both always return identical results
**Answer:** B
**Explanation:** `COUNT(*)` tallies all rows, whereas `COUNT(DISTINCT user_id)` tallies only unique non-null occurrences of `user_id`.
---

### 3. Does MySQL permit counting distinct combinations across multiple columns in a single function call (e.g., `COUNT(DISTINCT col1, col2)`)?
A. No, only one column is permitted
B. Yes, MySQL natively supports multi-column distinct counts
C. Only if both columns are foreign keys
D. Only in stored procedures
**Answer:** B
**Explanation:** MySQL supports multi-column arguments in `COUNT(DISTINCT col1, col2)`, counting unique pairwise combinations where neither column is null.
---

### 4. What will `SUM(DISTINCT val)` return for the dataset `[100, 100, 200, 300]`?
A. 700
B. 600
C. 300
D. 200
**Answer:** B
**Explanation:** `SUM(DISTINCT val)` deduplicates the values to `{100, 200, 300}` before summing, resulting in `100 + 200 + 300 = 600`.
---

### 5. Why can executing `COUNT(DISTINCT)` on a column with 50 million unique values be slow?
A. The server must reboot
B. The query engine must track and deduplicate all distinct keys in an in-memory or on-disk hash structure
C. MySQL disables B-Tree indexes
D. DISTINCT converts integers to strings
**Answer:** B
**Explanation:** Deduplication across high-cardinality datasets requires building and probing large in-memory hash sets or temporary tables, consuming significant RAM and CPU.
---
