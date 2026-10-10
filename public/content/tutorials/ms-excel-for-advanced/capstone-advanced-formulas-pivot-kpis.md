# Capstone: Applying Advanced Formulas, DAX, and Pivot KPIs

Continuing our **Business Performance Dashboard**, we now author enterprise **DAX Measures** inside the Power Pivot Data Model and construct the analytical Pivot Tables that feed our executive visual layer.

---

## 1. Authoring Core DAX Measures

Open the **Power Pivot Window** (**Power Pivot > Manage**) and navigate to the **Calculation Area** below the Fact_Transactions table to author our KPI measures:

```dax
-- 1. Total Sales Volume
Total Sales := SUM(Fact_Transactions[GrossRevenue])

-- 2. Total Cost of Goods Sold (COGS) using SUMX Iterator
Total COGS := SUMX(Fact_Transactions, Fact_Transactions[UnitsSold] * RELATED(Dim_Products[UnitCost]))

-- 3. Gross Profit Margin
Gross Profit := [Total Sales] - [Total COGS]
Profit Margin % := DIVIDE([Gross Profit], [Total Sales], 0)

-- 4. Prior Year Sales (Time Intelligence)
Sales Last Year := CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Calendar[Date]))
YoY Growth % := DIVIDE([Total Sales] - [Sales Last Year], [Sales Last Year], 0)
```

> **The Power of RELATED():**
> In measure #2, 'Fact_Transactions' does not contain 'UnitCost'. Using **RELATED(Dim_Products[UnitCost])**, DAX follows the established relationship to pull the unit cost from the dimension table in memory!

![DAX Measures and KPI Calculations](/images/tutorials/ms-excel/power-query-and-data-model.svg)

---

## 2. Building Analytical Staging Pivot Tables

On a dedicated worksheet named **Calc_Pivots**, build four strategic Pivot Tables sourced from the Data Model:

1. **PT_SummaryKPIs:** Contains '[Total Sales]', '[Gross Profit]', '[Profit Margin %]', and '[YoY Growth %]' formatted as Currency and Percentages.
2. **PT_MonthlyPerformance:**
   * Rows: 'Dim_Calendar[MonthName]'
   * Values: '[Total Sales]' and '[Sales Last Year]'
3. **PT_RegionalProfitability:**
   * Rows: 'Dim_Customers[Region]'
   * Columns: 'Dim_Customers[Segment]'
   * Values: '[Total Sales]' and '[Profit Margin %]'
4. **PT_CategoryLeaderboard:**
   * Rows: 'Dim_Products[Category]' and '[SubCategory]'
   * Values: '[Total Sales]' (Sorted Largest to Smallest).

---

## 3. Creating KPI Link Cells

In empty cells beside your Pivot Tables, format dynamic text summary cells to feed our dashboard cards:
* **Revenue Card Value:** '=PT_SummaryKPIs!B4'
* **YoY Badge Text:**
  ```excel
  =IF(Calc_Pivots!B7>=0, "▲ +" & TEXT(Calc_Pivots!B7, "0.0%") & " YoY", "▼ " & TEXT(Calc_Pivots!B7, "0.0%") & " YoY")
  ```

---

# Multiple Choice Questions

### 1. In our DAX measure, why did we use the RELATED function inside SUMX?
A. To check internet connection
B. To retrieve the 'UnitCost' value from the related 'Dim_Products' table across the established relationship
C. To format text as bold
D. To sum cells B1:B10
**Answer:** B
**Explanation:** RELATED follows existing One-to-Many relationships to fetch corresponding attribute values from parent lookup tables.

### 2. Which DAX function calculates sales for the exact same calendar period in the previous year?
A. PREVIOUS()
B. SAMEPERIODLASTYEAR(DateColumn)
C. YEAR(-1)
D. PRIOR()
**Answer:** B
**Explanation:** SAMEPERIODLASTYEAR is a core DAX time-intelligence function that shifts the active filter context back by exactly one year.

---

### 3. Why is '=DIVIDE([Gross Profit], [Total Sales], 0)' superior to '=[Gross Profit] / [Total Sales]'?
A. DIVIDE handles potential division by zero safely, returning 0 instead of crashing Pivot Tables with #DIV/0! errors
B. DIVIDE is required by Microsoft Windows
C. The forward slash is illegal in DAX
D. DIVIDE rounds to two decimal places
**Answer:** A
**Explanation:** The DIVIDE function intercepts divide-by-zero occurrences and safely returns an alternate result (such as 0 or null).

---

### 4. Where did we author our explicit DAX measures inside the Power Pivot window?
A. In the Windows Notepad
B. In the Calculation Area situated below the data table grid
C. In cell A1 of the worksheet
D. In the Name Box
**Answer:** B
**Explanation:** Explicit DAX measures are written and maintained in the Calculation Area grid located directly below the data table rows in Power Pivot.

---

### 5. What does our dynamic badge formula return if YoY Growth in cell B7 is +0.084?
A. "Error"
B. "▲ +8.4% YoY"
C. "0.084"
D. "FALSE"
**Answer:** B
**Explanation:** The IF and TEXT formatting logic evaluates positive variance and returns the upward arrow paired with the formatted percentage string "+8.4% YoY".

---
