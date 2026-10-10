---
id: cumulative-aggregates-running-totals
slug: cumulative-aggregates-running-totals
course: sql-for-advanced
chapter: Advanced Window Functions & Frame Specifications
topic: "Cumulative Aggregates: Running Totals & Moving Averages"
difficulty: Advanced
readingTime: 13
order: 2
keywords: ["cumulative sum","running totals","moving averages","ytd revenue","financial analytics"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Cumulative Aggregates: Running Totals & Moving Averages
Cumulative metrics and rolling averages are standard fixtures in financial dashboards, executive KPI trackers, and algorithmic data processing:
- **Year-To-Date (YTD) Revenue:** Cumulative revenue that resets at the start of every calendar year.
- **Customer Lifetime Value (LTV) Progression:** Cumulative spend tracked chronologically per user.
- **7-Day Exponential / Simple Moving Average:** Smoothing short-term volatility in metrics like daily active users (DAU).

---

### Step-by-Step Implementation: Year-to-Date (YTD) Running Total

```sql
SELECT 
    YEAR(order_date) AS order_year,
    order_date,
    customer_id,
    amount,
    -- Running total resetting every year
    SUM(amount) OVER (
        PARTITION BY YEAR(order_date)
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS ytd_cumulative_revenue
FROM orders
ORDER BY order_date;
```

#### Execution Trace:
- `PARTITION BY YEAR(order_date)`: Resets the cumulative accumulator at the start of 2025, 2026, etc.
- `ORDER BY order_date`: Orders records chronologically.
- `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`: Adds each row's amount to the sum of all preceding rows in the current year.

---

### Calculating Trailing Moving Averages

Moving averages smooth volatile daily fluctuations to identify underlying business trends:

```sql
SELECT 
    metric_date,
    daily_signups,
    -- 7-Day moving average of daily signups
    ROUND(
        AVG(daily_signups) OVER (
            ORDER BY metric_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS moving_avg_7day,
    -- 30-Day moving average
    ROUND(
        AVG(daily_signups) OVER (
            ORDER BY metric_date
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS moving_avg_30day
FROM user_signup_metrics;
```

---

### Moving Minimums & Maximums (Volatility Bands)

Beyond `SUM` and `AVG`, any standard aggregate function can be framed. For example, calculating price bands in fintech:

```sql
SELECT 
    trade_timestamp,
    stock_ticker,
    price,
    MIN(price) OVER (
        PARTITION BY stock_ticker 
        ORDER BY trade_timestamp 
        ROWS BETWEEN 50 PRECEDING AND CURRENT ROW
    ) AS support_low_50,
    MAX(price) OVER (
        PARTITION BY stock_ticker 
        ORDER BY trade_timestamp 
        ROWS BETWEEN 50 PRECEDING AND CURRENT ROW
    ) AS resistance_high_50
FROM stock_trades;
```

---

# Multiple Choice Questions

### 1. Which frame clause correctly calculates a true cumulative Year-to-Date sum that adds all preceding rows in the year partition?
A. ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
B. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
C. ROWS 1 PRECEDING
D. RANGE BETWEEN 1 PRECEDING AND 1 FOLLOWING
**Answer:** B
**Explanation:** UNBOUNDED PRECEDING to CURRENT ROW accumulates all values from the beginning of the partition up to the current row.
---

### 2. How many total rows are included in AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)?
A. 6 rows
B. 7 rows
C. 14 rows
D. 1 row
**Answer:** B
**Explanation:** The frame encompasses 6 preceding rows plus the current row, totaling 7 rows (a 7-day moving average).
---

### 3. What resets the cumulative running total when calculating customer-specific progression?
A. Adding a LIMIT clause
B. The PARTITION BY customer_id boundary
C. An explicit ROLLBACK
D. The MySQL query cache
**Answer:** B
**Explanation:** The PARTITION BY clause divides data into discrete subsets; calculations automatically reset at each partition boundary.
---

### 4. In moving average calculations, what is the effect of using a wider frame (e.g., 30 days vs 7 days)?
A. The moving average exhibits greater volatility
B. The moving average produces a smoother line that lags rapid short-term changes
C. The query fails due to memory limits
D. The calculation returns integers only
**Answer:** B
**Explanation:** Wider frames incorporate more data points, dampening day-to-day noise and smoothing the resulting trend line.
---

### 5. Can MIN() and MAX() functions be combined with sliding window frames?
A. No, only SUM and AVG support frames
B. Yes, all standard aggregate functions support window frame clauses
C. Only in PostgreSQL, not MySQL
D. Only when using clustered indexes
**Answer:** B
**Explanation:** All ANSI SQL standard aggregate functions (MIN, MAX, COUNT, SUM, AVG) accept window frame specifications.
---
