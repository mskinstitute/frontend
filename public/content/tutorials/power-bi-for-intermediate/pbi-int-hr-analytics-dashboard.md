# Real-World Project: HR Analytics & Employee Retention Dashboard

Human Resources (HR) Analytics has become a vital strategic function in modern organizations. People leaders analyze **employee turnover rates**, track **diversity & inclusion (D&I) metrics**, monitor **salary equity**, and predict **flight risk** among top talent.

---

## 1. HR Metrics & Key Data Points

For this project, we analyze an enterprise workforce dataset:
- `EmployeeID`, `FullName`, `HireDate`, `TerminationDate`
- `Department` (Engineering, Sales, Marketing, HR, Finance)
- `JobRole`, `PerformanceRating` (1 to 5), `MonthlySalary`
- `AttritionStatus` ("Active" vs. "Terminated"), `AttritionReason`

---

## 2. Core HR DAX Formulations

```dax
-- 1. Total Headcount (Active Employees)
Active Headcount = 
CALCULATE(
    COUNTROWS(Dim_Employee),
    Dim_Employee[AttritionStatus] = "Active"
)

-- 2. Total Terminations
Total Exits = 
CALCULATE(
    COUNTROWS(Dim_Employee),
    Dim_Employee[AttritionStatus] = "Terminated"
)

-- 3. Monthly Attrition Rate %
-- Formula: (Total Exits during period) / (Average Headcount during period)
Attrition Rate % = 
VAR Exits = [Total Exits]
VAR AvgHeadcount = 
    AVERAGEX(
        VALUES(Dim_Date[YearMonth]),
        [Active Headcount]
    )
RETURN
DIVIDE(Exits, AvgHeadcount, 0)

-- 4. Average Tenure (Years)
Avg Tenure Years = 
AVERAGEX(
    Dim_Employee,
    DATEDIFF(Dim_Employee[HireDate], COALESCE(Dim_Employee[TerminationDate], TODAY()), YEAR)
)

-- 5. Gender Diversity Ratio %
Female Headcount % = 
DIVIDE(
    CALCULATE([Active Headcount], Dim_Employee[Gender] = "Female"),
    [Active Headcount],
    0
)
```

---

## 3. Dashboard Wireframe & Insights Structure

```
+-----------------------------------------------------------------------------+
| WORKFORCE ANALYTICS & TALENT RETENTION PORTAL                               |
| [Active Headcount: 2,450] [Attrition Rate: 11.2%] [Avg Tenure: 3.4 Yrs]     |
+-------------------------------------+---------------------------------------+
| Attrition by Department             | Salary Banding vs. Performance Rating |
| Engineering: 8.5%                   | [ Scatter Plot: Salary (Y) vs         |
| Sales:       18.4% (High Risk!)     |                 Tenure (X)            |
| Marketing:   12.1%                  |                 Colored by Perf Rating|
+-------------------------------------+---------------------------------------+
| Attrition Reasons Breakdown         | Monthly Headcount Evolution           |
| - Career Growth: 42%                | [ Stacked Area Chart:                 |
| - Compensation:  35%                |   New Hires vs Terminations ]         |
| - Work Culture:  23%                |                                       |
+-------------------------------------+---------------------------------------+
```

---

# Multiple Choice Questions

### 1. In Human Resources analytics, what is the standard mathematical formula for calculating the Employee Attrition Rate?
A. Total Hires divided by Total Exits
B. Total Exits during the period divided by Average Headcount during the period
C. Total Salary divided by 12 months
D. Number of Departments multiplied by 100
**Answer:** B
**Explanation:** Attrition percentage measures departures relative to the average size of the workforce over a specified timeframe.

### 2. Which DAX function returns the current date dynamically to compute an active employee's tenure up to the present day?
A. `NOW_DATE()`
B. `TODAY()`
C. `CURRENT_DAY()`
D. `DATE_NOW()`
**Answer:** B
**Explanation:** `TODAY()` returns the current date without a timestamp, ideal for dynamic date difference calculations like employee tenure.

### 3. Which chart type is best suited for identifying pay equity discrepancies across departments, tenure, and performance ratings?
A. Funnel Chart
B. Scatter Plot
C. Card Visual
D. KPI Gauge
**Answer:** B
**Explanation:** Scatter plots display two continuous numerical axes (e.g., Tenure vs. Salary) with individual employee dots categorized by department and performance, highlighting compensation outliers.

### 4. What is the role of the `COALESCE` function in `COALESCE(Dim_Employee[TerminationDate], TODAY())`?
A. It deletes terminated employees
B. It returns the first non-blank value: if the employee is still active (TerminationDate is BLANK), it evaluates against TODAY()
C. It formats dates into strings
D. It forces DirectQuery mode
**Answer:** B
**Explanation:** `COALESCE` checks arguments in order and returns the first non-null expression, allowing a single calculation to handle both exited and currently active staff.

### 5. Why is tracking voluntary vs. involuntary attrition reasons critical for human resource business partners (HRBPs)?
A. To decide printer ink budgets
B. To distinguish between regrettable top-performer departures (resigned for higher pay) versus company-initiated restructuring
C. Voluntary departures do not count toward attrition
D. It is required by web browsers
**Answer:** B
**Explanation:** Segmenting exit types allows organizations to diagnose whether turnover stems from uncompetitive market compensation or planned organizational resizing.

---
