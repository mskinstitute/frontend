# Real-World Project: Commercial Sales Performance Dashboard

The **Sales Performance Dashboard** is the most widely deployed analytical application in global enterprise BI. It provides sales directors, regional managers, and account executives with visibility into revenue velocity, quota attainment, product margins, and customer concentration.

---

## 1. Sales KPI Definitions & Business Targets

In this project, we utilize the real-world **`superstore_sales_analytics.csv`** dataset from `public/downloads/datasets/`:
- Orders, discounts, categories, customer segments, regional geographies, and delivery modes.

```
Core Sales Metrics Hierarchy:
[Total Gross Sales] ---> [Discounts Given] ---> [Total Net Sales]
                                                       |
                                 +---------------------+---------------------+
                                 |                                           |
                         [Cost of Goods]                             [Sales Quota Target]
                                 |                                           |
                                 v                                           v
                          [Gross Profit]                            [Quota Attainment %]
```

---

## 2. Advanced Sales DAX Measures

```dax
-- 1. Total Net Sales
Total Sales = SUM(Fact_Sales[Sales])

-- 2. Total Profit
Total Profit = SUM(Fact_Sales[Profit])

-- 3. Overall Profit Margin %
Profit Margin % = 
DIVIDE(
    [Total Profit], 
    [Total Sales], 
    0
)

-- 4. Target Quota Attainment %
Quota Attainment % = 
VAR Target = SUM(Dim_SalesTargets[AnnualQuota])
RETURN
DIVIDE([Total Sales], Target, 0)

-- 5. Average Order Value (AOV)
Average Order Value = 
DIVIDE(
    [Total Sales], 
    DISTINCTCOUNT(Fact_Sales[OrderID]), 
    0
)

-- 6. Dynamic Tier Assignment (SWITCH TRUE Pattern)
Performance Status = 
VAR Attainment = [Quota Attainment %]
RETURN
SWITCH(
    TRUE(),
    Attainment >= 1.00, "Target Achieved (Green)",
    Attainment >= 0.85, "On Track (Yellow)",
    "Critical Risk (Red)"
)
```

---

## 3. Interactive Visual Architecture

```
+-----------------------------------------------------------------------------+
| COMMERCIAL SALES OPERATIONS PORTAL                                          |
| [Sales: $4.2M | +14% YoY] [Profit: $1.1M | 26.2%] [AOV: $1,420] [Target: 98%]|
+-------------------------------------+---------------------------------------+
| Revenue by Product Sub-Category     | Regional Quota Attainment Gauge       |
| - Laptops:     $1.2M                | [ Gauge Visual: Target = $4.5M        |
| - Accessories: $850k                |                 Actual = $4.2M        |
| - Chairs:      $600k                |                 Needle at 93.3% ]     |
+-------------------------------------+---------------------------------------+
| Sales vs Profit Correlation Matrix  | Top 10 High-Value Customers           |
| [ Scatter Plot: Sales vs Margin %   | [ Ranked Table with Data Bars:        |
|   Bubbles sized by Order Count ]    |   Rank | Customer | Sales | Profit ]  |
+-------------------------------------+---------------------------------------+
```

---

# Multiple Choice Questions

### 1. What DAX function is used to calculate the Average Order Value (AOV) correctly when a single order contains multiple product line items?
A. `AVERAGE(Fact_Sales[Sales])`
B. `DIVIDE([Total Sales], DISTINCTCOUNT(Fact_Sales[OrderID]), 0)`
C. `COUNT(Fact_Sales[OrderID])`
D. `SUM(Fact_Sales[OrderID])`
**Answer:** B
**Explanation:** Because an order can contain several line items, dividing total sales by `DISTINCTCOUNT(OrderID)` accurately computes revenue per unique transaction.

### 2. Which visual type is standard for displaying actual performance against a fixed numerical goal (such as $4.5M annual sales target)?
A. Gauge Visual or KPI Card with Target Goal
B. Treemap
C. Word Cloud
D. Pie Chart
**Answer:** A
**Explanation:** Gauge and KPI visuals feature dedicated fields for minimum, maximum, and target goals, showing the progress needle relative to target benchmarks.

### 3. In the DAX pattern `SWITCH(TRUE(), [Attainment] >= 1.0, "Green", [Attainment] >= 0.85, "Yellow", "Red")`, what does `SWITCH(TRUE())` accomplish?
A. It restarts the computer
B. It tests a series of conditional boolean expressions sequentially and returns the result of the first condition that evaluates to TRUE
C. It disables visual filtering
D. It converts numbers to binary
**Answer:** B
**Explanation:** `SWITCH(TRUE(), ...)` is the standard DAX design pattern for clean, multi-branch conditional evaluations, replacing cumbersome nested `IF` statements.

### 4. When analyzing customer profitability, what risk does a high sales volume accompanied by a negative profit margin indicate?
A. The customer is buying discounted products below cost, eroding overall company profit
B. DirectQuery is not working
C. The visual is broken
D. The customer is paying in foreign currency
**Answer:** A
**Explanation:** Unprofitable high-volume accounts indicate that heavy discounting or unfavorable shipping terms are causing the company to lose money on every unit delivered.

### 5. What formatting feature in Power BI table and matrix visuals allows columns to display miniature horizontal color bars proportional to sales values?
A. Data Bars (Conditional Formatting)
B. Sparkline animation
C. Bookmark view
D. Highlighting filter
**Answer:** A
**Explanation:** Data Bars under Conditional Formatting render mini in-cell bar charts, allowing users to visually gauge performance magnitude across table rows at a glance.

---
