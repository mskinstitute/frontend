# Real-World Project: Corporate Financial & P&L Dashboard

In this project, you will build an **Executive Financial Performance Dashboard**. Corporate financial reporting requires specialized data modeling patterns: handling Profit & Loss (P&L) statements, calculating gross margins, evaluating Operating Expenses (OPEX) vs Capital Expenditures (CAPEX), and tracking EBITDA.

---

## 1. Financial Data Architecture: The General Ledger

Financial data originates from General Ledger (GL) tables structured around a **Chart of Accounts (COA)**:

```
Financial Account Hierarchy:
[Revenue]
  ├── Gross Sales
  └── (-) Sales Returns & Discounts
[Cost of Goods Sold (COGS)]
  ├── Raw Materials
  └── Direct Labor
=================================
[GROSS PROFIT] = Revenue - COGS
=================================
[Operating Expenses (OPEX)]
  ├── Sales & Marketing
  ├── Research & Development (R&D)
  └── General & Administrative (G&A)
=================================
[OPERATING INCOME (EBITDA)]
```

---

## 2. Key DAX Financial Measures

```dax
-- 1. Total Revenue
Total Revenue = SUM(Fact_Financials[RevenueAmount])

-- 2. Cost of Goods Sold (COGS)
Total COGS = SUM(Fact_Financials[COGSAmount])

-- 3. Gross Profit
Gross Profit = [Total Revenue] - [Total COGS]

-- 4. Gross Margin %
Gross Margin % = 
DIVIDE(
    [Gross Profit], 
    [Total Revenue], 
    0
)

-- 5. Operating Expenses (OPEX)
Total OPEX = SUM(Fact_Financials[OpexAmount])

-- 6. Operating Income (EBITDA)
EBITDA = [Gross Profit] - [Total OPEX]

-- 7. Operating Margin %
Operating Margin % = 
DIVIDE(
    [EBITDA], 
    [Total Revenue], 
    0
)
```

---

## 3. Financial Dashboard Visual Layout

A professional finance dashboard follows an intuitive vertical P&L waterfall structure:

```
+-----------------------------------------------------------------------------+
| EXECUTIVE FINANCIAL PERFORMANCE (FY 2025)                                   |
| [Revenue: $12.4M | +8.2% YoY] [Gross Profit: $4.8M | 38.7%] [EBITDA: $2.1M] |
+-----------------------------------------------------------------------------+
| [Waterfall Chart: Revenue -> COGS -> Gross Profit -> OPEX -> Net EBITDA]    |
+-------------------------------------+---------------------------------------+
| OPEX Breakdown by Department        | Monthly Revenue & Gross Margin Trend  |
| - Marketing: $850k                  | [ Combo Chart: Bars = Monthly Sales,  |
| - R&D:       $650k                  |                Line = Margin % ]      |
| - G&A:       $600k                  |                                       |
+-------------------------------------+---------------------------------------+
```

---

# Multiple Choice Questions

### 1. In corporate financial accounting, how is Gross Profit calculated?
A. Total Revenue plus Operating Expenses
B. Total Revenue minus Cost of Goods Sold (COGS)
C. Net Income divided by Taxes
D. Total Assets minus Liabilities
**Answer:** B
**Explanation:** Gross Profit represents the residual profit after deducting direct production and procurement costs (COGS) from total top-line revenue.

### 2. Which visual chart type is universally standard for demonstrating how initial revenue is reduced by expenses to arrive at net EBITDA?
A. Pie Chart
B. Waterfall Chart
C. Donut Chart
D. Scatter Plot
**Answer:** B
**Explanation:** Waterfall charts clearly visualize positive and negative sequential contributions, showing how gross revenue is diminished by COGS and OPEX down to final EBITDA.

### 3. Why is the `DIVIDE` function critical when calculating financial ratios like Operating Margin Percentage?
A. Ratios can only be calculated in Excel
B. If a business unit records zero revenue during a launch period, standard division `/` throws an error, whereas `DIVIDE` safely returns `0` or `BLANK()`
C. Power BI does not allow percentages
D. It increases the financial figures
**Answer:** B
**Explanation:** Financial dashboards must handle periods with zero sales or seasonal pauses without crashing visuals with division-by-zero errors.

### 4. What type of chart is ideal for visualizing monthly revenue alongside gross margin percentage trends on the same visual?
A. Treemap
B. Line and Clustered Column Chart (Dual-Axis Combo Chart)
C. Gauge Visual
D. Funnel Chart
**Answer:** B
**Explanation:** A combo chart allows revenue amounts (currency) to be plotted on the primary column axis while margin percentage is plotted simultaneously on the secondary line axis.

### 5. In a Chart of Accounts (COA) dimension table, what column is typically created to control the exact sorting order of P&L line items in a matrix?
A. AccountSortOrder (an integer sequence column used with "Sort by Column")
B. CreationDate
C. UserEmail
D. RandomID
**Answer:** A
**Explanation:** Alphabetical sorting scrambles financial statements (putting Expenses before Revenue). An integer `AccountSortOrder` column paired with Power BI's "Sort by Column" ensures standard accounting order.

---
