---
id: multiple-ctes-in-query
slug: multiple-ctes-in-query
course: sql-for-intermediate
chapter: Common Table Expressions (CTEs)
topic: "Chaining Multiple CTEs in a Single Query"
difficulty: Intermediate
readingTime: 13
order: 32
keywords: ["multiple ctes","chained ctes","data pipeline","sql with clause","cte dependency"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Chaining Multiple CTEs in a Single Query
One of the most potent capabilities of the `WITH` clause is the ability to define **multiple Common Table Expressions in a single query**, separated by commas. Furthermore, subsequent CTEs can directly reference previously defined CTEs within the same `WITH` block, creating an elegant, pipeline-style data transformation workflow.

---

### Syntax for Chaining Multiple CTEs

Notice that the keyword `WITH` is specified **only once** at the very beginning:

```sql
WITH 
    cte_first AS (
        SELECT ...
    ),
    cte_second AS (
        SELECT ...
        FROM cte_first  -- References the first CTE!
        WHERE ...
    ),
    cte_third AS (
        SELECT ...
        FROM cte_second -- References the second CTE!
    )
-- Final consuming query
SELECT *
FROM cte_third;
```

---

### Practical Example: Multi-Stage E-Commerce Sales Pipeline

Suppose management wants to find the top 5% highest spending customers in each geographic region and compare their spending against the regional average.

Without multiple CTEs, this requires three levels of nested subqueries. With chained CTEs, the logic unfolds step-by-step:

```sql
WITH 
    -- Step 1: Compute total lifetime spend for each customer
    CustomerSpending AS (
        SELECT 
            c.customer_id,
            CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
            c.country,
            SUM(o.total_amount) AS total_spent
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        WHERE o.order_status = 'completed'
        GROUP BY c.customer_id, c.first_name, c.last_name, c.country
    ),
    
    -- Step 2: Compute country-wide averages referencing CustomerSpending
    CountryBenchmarks AS (
        SELECT 
            country,
            AVG(total_spent) AS avg_country_spend,
            MAX(total_spent) AS max_country_spend
        FROM CustomerSpending
        GROUP BY country
    ),
    
    -- Step 3: Flag high-performing outliers by joining both CTEs
    CustomerOutliers AS (
        SELECT 
            cs.customer_id,
            cs.customer_name,
            cs.country,
            cs.total_spent,
            cb.avg_country_spend,
            ROUND(cs.total_spent / cb.avg_country_spend, 2) AS spend_ratio
        FROM CustomerSpending cs
        JOIN CountryBenchmarks cb ON cs.country = cb.country
        WHERE cs.total_spent > (cb.avg_country_spend * 2.0)
    )

-- Final consumption
SELECT 
    customer_name,
    country,
    total_spent,
    avg_country_spend,
    spend_ratio
FROM CustomerOutliers
ORDER BY spend_ratio DESC;
```

---

### Execution Rules & Best Practices

1. **Top-Down Dependency:** A CTE can reference any CTE defined **before** it in the same statement. However, a CTE **cannot** reference a CTE defined after it (forward reference).
2. **Naming Conventions:** Use clear PascalCase or snake_case names that indicate what data stage the CTE represents (e.g., `RawOrders`, `AggregatedByMonth`, `FinalAudit`).
3. **Avoid Over-Materialization:** While CTEs improve readability, breaking simple logic into dozens of trivial CTEs can hinder optimization. Keep data transformations purposeful.

---

# Multiple Choice Questions

### 1. How many times should the WITH keyword appear when chaining multiple CTEs?
A. Before each individual CTE definition
B. Exactly once at the very start of the chained block
C. Twice: once at the beginning and once at the end
D. WITH is optional when defining multiple CTEs
**Answer:** B
**Explanation:** The WITH keyword appears only once. Individual CTEs are separated by commas within the single block.
---

### 2. Can a chained CTE reference a CTE defined earlier in the same WITH clause?
A. No, CTEs are strictly isolated from one another
B. Yes, any subsequent CTE can reference previously defined CTEs in the list
C. Only if both CTEs query the exact same base table
D. Only if the database is running in Oracle compatibility mode
**Answer:** B
**Explanation:** Chained CTEs allow subsequent CTEs to query earlier CTEs, establishing a clean, step-by-step transformation pipeline.
---

### 3. Can a CTE reference a CTE that is declared after it in the WITH block?
A. Yes, SQL automatically re-orders CTEs
B. No, forward references are invalid in SQL CTE declarations
C. Yes, but only if the second CTE is empty
D. Only if using the REVERSE keyword
**Answer:** B
**Explanation:** SQL executes declarations top-down; a CTE cannot refer to another CTE that appears later in the comma-separated list.
---

### 4. What separates multiple CTE declarations within a single WITH statement?
A. Semicolon (;)
B. Comma (,)
C. Pipe symbol (|)
D. AND keyword
**Answer:** B
**Explanation:** Multiple CTE definitions within a single WITH clause are separated by commas.
---

### 5. In our multi-stage pipeline example, which CTE consumed data from CustomerSpending?
A. Only the base table orders
B. Both CountryBenchmarks and CustomerOutliers
C. Neither, because CTEs cannot be reused more than once
D. The system log file
**Answer:** B
**Explanation:** Multiple downstream CTEs or the main query can query the same earlier CTE, demonstrating the high reusability of CTE definitions.
---
