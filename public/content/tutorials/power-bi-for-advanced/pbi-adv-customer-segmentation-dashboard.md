# Case Study 2: Customer Segmentation & Dynamic RFM Analytics

Marketing executives and Customer Success teams rely on **Customer Segmentation** to allocate promotional budgets, prevent churn, and identify high-value VIP buyers. The gold-standard analytical framework is **RFM (Recency, Frequency, Monetary)** analysis.

---

## 1. The RFM Framework Explained

```
                           RFM Segmentation Dimensions
                                        |
     +----------------------------------+----------------------------------+
     |                                  |                                  |
[RECENCY (R)]                   [FREQUENCY (F)]                    [MONETARY (M)]
How recently did the            How often does the                 How much money has the
customer purchase?              customer purchase?                 customer spent in total?
(Days since last order)         (Total unique order count)         (Total lifetime net revenue)
```

---

## 2. Advanced DAX for Dynamic RFM Scoring

```dax
-- 1. Recency in Days
Customer Recency Days = 
VAR LastOrderDate = MAX(Fact_Sales[OrderDate])
RETURN
DATEDIFF(LastOrderDate, TODAY(), DAY)

-- 2. Frequency (Total Orders)
Customer Frequency = DISTINCTCOUNT(Fact_Sales[OrderID])

-- 3. Monetary (Lifetime Value)
Customer Lifetime Value = [Total Sales]

-- 4. Dynamic RFM Segment Assignment (SWITCH TRUE Pattern)
Customer Segment = 
VAR R = [Customer Recency Days]
VAR F = [Customer Frequency]
VAR M = [Customer Lifetime Value]
RETURN
SWITCH(
    TRUE(),
    R <= 30 && F >= 10 && M >= 50000, "Champions / VIP",
    R <= 60 && F >= 5,                "Loyal Customers",
    R <= 30 && F == 1,                "Promising Newcomers",
    R > 90 && F >= 8,                 "At-Risk (High Value)",
    R > 180 && F >= 5,                "Hibernating (Churned)",
    "Standard Customers"
)
```

---

# Multiple Choice Questions

### 1. In Customer Segmentation, what do the letters in RFM represent?
A. Revenue, Finance, Margin
B. Recency, Frequency, Monetary
C. Rate, Factor, Management
D. Regional, Federal, Municipal
**Answer:** B
**Explanation:** RFM stands for Recency (how recently a customer transacted), Frequency (how often they buy), and Monetary (how much they spend in total).

### 2. Which customer segment in RFM analysis requires immediate marketing intervention because they were historically frequent buyers but have not purchased in over 90 days?
A. Champions
B. At-Risk / Need Attention
C. New Customers
D. Prospective Leads
**Answer:** B
**Explanation:** "At-Risk" customers possess high frequency and monetary history but poor recency, indicating high probability of imminent churn unless re-engaged.

### 3. What DAX function calculates the number of elapsed days between an order date and the current date?
A. `DATEDIFF(OrderDate, TODAY(), DAY)`
B. `DAYS()`
C. `TIMEPASSED()`
D. `DATE_SUB()`
**Answer:** A
**Explanation:** `DATEDIFF` computes the exact interval (in Days, Months, Years) between two timestamps.

### 4. Which visual is most effective for plotting thousands of customers across two continuous axes (e.g., Recency vs. Monetary)?
A. Pie Chart
B. Scatter Plot with customer dots grouped by RFM segment
C. Card Visual
D. Funnel Chart
**Answer:** B
**Explanation:** Scatter plots display multi-dimensional distributions, showing Recency on one axis, Monetary on the other, with bubble colors representing assigned segments.

### 5. Why is dynamic RFM segmentation in DAX superior to static segmentation assigned in a source database?
A. It allows segment boundaries to shift dynamically based on whatever date range or regional slicer the user selects on the canvas
B. It uses less memory than Excel
C. It requires no calculations
D. It translates reports into Python
**Answer:** A
**Explanation:** Calculating RFM dynamically in DAX allows segments to adapt to the active filter context (e.g., evaluating customer behavior within a specific fiscal year or product line).

---
