# Summarize Attendance with a Pivot Table and Visuals

In this final lesson of the Intermediate track, we complete our **Employee Attendance Tracker** by summarizing company-wide attendance patterns using a **Pivot Table** and presenting key findings with an executive **Combo Chart**.

---

## 1. Structuring the Summary Table

Our raw attendance tracker provides employee-level daily data. To generate departmental insights for management:
1. Select the employee master data and summary totals: columns **A through C** and **AI through AL** ('Emp ID', 'Name', 'Department', 'Present', 'Absent', 'Leave', 'Att %').
2. Convert this block into an official Excel Table (**Ctrl + T**) and name it **AttendanceSummary**.

```
Summary Columns Prepared for Analysis:
+-------------------+------------+---------------+--------------+--------------+
| Employee Name     | Department | Total Present | Total Absent | Attendance % |
+-------------------+------------+---------------+--------------+--------------+
| Rajesh Sharma     | Operations | 24            | 1            | 96.0%        |
| Ananya Patel      | Finance    | 22            | 2            | 88.0%        |
| Vikram Singh      | Sales      | 25            | 0            | 100.0%       |
+-------------------+------------+---------------+--------------+--------------+
```

![Pivot Table Attendance Dashboard](/images/tutorials/ms-excel/pivot-tables-and-fields.svg)

---

## 2. Building the Department Attendance Pivot Table

1. Click inside the 'AttendanceSummary' table.
2. Go to **Insert > PivotTable** and choose **New Worksheet**.
3. Name the new tab **Management_Summary**.
4. Configure the Pivot Table Fields:
   * Drag **Department** into the **Rows** area.
   * Drag **Emp ID** into the **Values** area (summarizes as *Count of Emp ID*).
   * Drag **Total Present** into the **Values** area (*Average of Total Present*).
   * Drag **Total Absent** into the **Values** area (*Sum of Total Absent*).
   * Drag **Attendance %** into the **Values** area.
5. In *Value Field Settings* for Attendance %, switch calculation to **Average** and click *Number Format > Percentage*.

---

## 3. Creating the Executive Attendance Combo Chart

To communicate departmental performance to executive leadership:
1. Click inside the Pivot Table.
2. Go to **Insert > Charts > Combo Chart (Create Custom Combo Chart)**.
3. Configure the dual-axis chart:
   * **Sum of Total Absent:**
     * Chart Type: **Clustered Column**
     * Secondary Axis: *Unchecked* (Plotted against left axis).
   * **Average Attendance %:**
     * Chart Type: **Line with Markers**
     * Secondary Axis: **CHECKED** (Plotted against right axis: 0% to 100%).
4. Click **OK**.
5. Add clear Chart Titles: *"Monthly Departmental Absenteeism & Attendance Rate"*.

Congratulations! You have completed the **MS Excel Intermediate Track**, mastering advanced formulas, dynamic tables, validation rules, conditional formatting, Pivot Tables, and executive visualizations!

---

# Multiple Choice Questions

### 1. In our departmental attendance Pivot Table, why should the calculation for 'Attendance %' be set to Average instead of Sum?
A. Sum would add up percentages, producing meaningless figures like 480%
B. Sum produces a #DIV/0! error
C. Pivot Tables cannot sum percentages
D. Average changes the font color to blue
**Answer:** A
**Explanation:** Summing percentage rates across multiple employees yields invalid totals exceeding 100%; taking the Average reflects the true departmental rate.

---

### 2. Which chart type best presents Total Absent Days alongside the Average Attendance Percentage across departments?
A. Single Pie Chart
B. Dual-Axis Combination Chart (Clustered Column for Absences, Line for Attendance %)
C. Scatter Plot
D. Treemap
**Answer:** B
**Explanation:** A dual-axis Combo Chart allows direct comparison of discrete count volumes (absent days) against a percentage metric (attendance rate).

---

### 3. What is the role of the 'Count of Emp ID' field in our departmental attendance summary?
A. It sums the employee payroll
B. It displays the total headcount of employees working within each department
C. It generates unique passwords
D. It sorts the table alphabetically
**Answer:** B
**Explanation:** Placing a non-numeric identifier like Emp ID into the Values quadrant calculates the count of employees (headcount) per department.

---

### 4. What happens to the Management_Summary Pivot Table when new employee attendance records are entered into the tracker?
A. It updates automatically in real-time
B. Right-clicking the Pivot Table and selecting 'Refresh' (or Alt + F5) pulls in the newly logged figures
C. The sheet must be deleted and rebuilt
D. You must email Microsoft support
**Answer:** B
**Explanation:** Refreshing the Pivot Table updates the analytical cache with all newly entered source data.

---

### 5. Which skill set learned in this Intermediate track was applied during this mini-project?
A. Only basic mouse clicking
B. Formulas (COUNTIF), Data Validation, Conditional Formatting, Freeze Panes, Pivot Tables, and Combo Charts
C. Python programming
D. Hardware repair
**Answer:** B
**Explanation:** The capstone attendance tracker synthesizes data validation, COUNTIF formulas, mixed-reference conditional formatting, Pivot Table summarization, and combo charting.

---
