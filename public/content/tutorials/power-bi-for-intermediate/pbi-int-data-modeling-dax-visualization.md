# Capstone Project: Model Relationships, DAX Measures & Visualization

Following our Power Query ETL transformations, we now configure the physical relationships in Model View, build out the centralized KPI measure library, and design the multi-page user interface.

---

## 1. Configuring Model Relationships

In Power BI **Model View**, establish the following relationships:

```
                  [Dim_Customer]
                 CustomerID (1)
                       |
                       | (1 : *) Single
                       v
[Dim_Product] ---> [Fact_SalesOrders] <--- [Dim_Geography]
SubCat (1 : *)     ^                ^      City (1 : *)
                   | (Active)       | (Inactive)
                   |                |
             [Dim_Date]       (ShipDate via USERELATIONSHIP)
             Date (1)
```

1. `Dim_Customer[CustomerID]` ($1$) $\to$ `Fact_SalesOrders[CustomerID]` ($*$)
2. `Dim_Product[SubCategory]` ($1$) $\to$ `Fact_SalesOrders[SubCategory]` ($*$)
3. `Dim_Geography[City]` ($1$) $\to$ `Fact_SalesOrders[City]` ($*$)
4. `Dim_Date[Date]` ($1$) $\to$ `Fact_SalesOrders[OrderDate]` ($*$) [ACTIVE]
5. `Dim_Date[Date]` ($1$) $\to$ `Fact_SalesOrders[ShipDate]` ($*$) [INACTIVE]

---

## 2. Core Capstone DAX Measure Library

Create a dedicated empty table named `_Key Measures`:

```dax
-- 1. Base Net Revenue
Total Sales = SUM(Fact_SalesOrders[Sales])

-- 2. Base Net Profit
Total Profit = SUM(Fact_SalesOrders[Profit])

-- 3. Profit Margin %
Profit Margin % = 
DIVIDE(
    [Total Profit], 
    [Total Sales], 
    0
)

-- 4. Cumulative Year-to-Date Sales
Sales YTD = 
TOTALYTD(
    [Total Sales], 
    Dim_Date[Date]
)

-- 5. Prior Year Benchmark & YoY Growth
Sales Prior Year = 
CALCULATE(
    [Total Sales], 
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

Sales YoY Growth % = 
DIVIDE(
    [Total Sales] - [Sales Prior Year], 
    [Sales Prior Year], 
    0
)

-- 6. Sales by Shipping Date (Inactive Relationship)
Sales by Ship Date = 
CALCULATE(
    [Total Sales], 
    USERELATIONSHIP(Fact_SalesOrders[ShipDate], Dim_Date[Date])
)
```

---

## 3. Designing the Final Capstone Dashboard

Build three interconnected pages:
1. **Executive Overview Page:** KPI Cards (Sales, Profit, Margin %, YoY Growth), Monthly Trend Combo Chart, Category Breakdown.
2. **Regional Deep-Dive Page:** Map visual, City-level matrix table, Region drillthrough.
3. **Product Detail Drillthrough Page:** Customer list, order history, and discount sensitivity analysis.

---

# Multiple Choice Questions

### 1. In which view in Power BI Desktop do you verify that relationship cardinality is set to One-to-Many ($1 : *$) with Single cross-filter direction?
A. Report View
B. Model View
C. DAX Query View
D. Performance Analyzer
**Answer:** B
**Explanation:** Model View displays the graphical schema diagram where relationships, cardinality, and cross-filter arrows can be inspected and configured.

### 2. How do you create an empty table dedicated exclusively to storing DAX measures in Power BI Desktop?
A. Write a Python script
B. Click "Enter Data" on the Home ribbon, name the table `_Key Measures`, load it, and move measures into it
C. Export to CSV
D. Uncheck Auto Date/Time
**Answer:** B
**Explanation:** Using the "Enter Data" button to create an empty table allows developers to organize all calculations into a central, easy-to-find container.

### 3. What does the measure `Sales by Ship Date` calculate when it utilizes `USERELATIONSHIP(Fact_SalesOrders[ShipDate], Dim_Date[Date])`?
A. It calculates sales based on the date goods were shipped rather than the order creation date
B. It calculates the delivery truck speed
C. It deletes delayed orders
D. It calculates shipping freight taxes
**Answer:** A
**Explanation:** `USERELATIONSHIP` activates the inactive link between ShipDate and the Date dimension, reporting revenue according to the shipping timeline.

### 4. What color and styling best practices should be applied to financial and sales executive dashboards?
A. Use 20 neon colors across all visuals
B. Maintain a cohesive corporate color palette with a single primary brand color, neutral grays for structure, and reserved alert colors (Green for positive, Red for critical)
C. Make the background bright yellow
D. Avoid using text
**Answer:** B
**Explanation:** Professional dashboards use reserved, purposeful colors. High-contrast alert colors (red/green) should be reserved for variances and performance thresholds.

### 5. Why should every business measure be formatted (e.g., Currency `$#,##0`, Percentage `0.0%`) immediately upon creation?
A. Unformatted measures will fail to evaluate
B. Proper formatting ensures consistent, professional presentation across all visuals without requiring manual formatting in individual charts
C. It speeds up VertiPaq compression
D. It is required by Microsoft licensing
**Answer:** B
**Explanation:** Setting default formatting at the measure level guarantees that any visual utilizing that measure automatically inherits correct currency, decimal, or percentage symbols.

---
