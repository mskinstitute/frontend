# Goal Seek for Target Back-Calculation

Standard spreadsheet calculations operate forward: you input variables (price, quantity, cost), and Excel calculates the outcome (profit). But what if you know the outcome you need—such as requiring exactly $100,000 in net profit—and need to determine what price or sales volume is required to achieve it? **Goal Seek** is Excel’s dedicated backwards-calculation engine.

---

## 1. How Goal Seek Works

Goal Seek uses numerical iteration to adjust an input cell repeatedly until a formula cell reaches your exact target value:

```
+-----------------------------------------------------------------------------------+
| Forward Calculation (Standard):                                                   |
| Units (1,000) * Price ($50) = Revenue ($50,000)                                   |
+-----------------------------------------------------------------------------------+
| Backwards Calculation (Goal Seek):                                                |
| Target Revenue: $80,000 -> Goal Seek adjusts Units until Revenue = $80,000!       |
+-----------------------------------------------------------------------------------+
```

### The 3 Golden Rules of Goal Seek:
1. **Set Cell:** Must contain a **formula** (cannot be a hardcoded number).
2. **To Value:** The exact numerical target you wish to achieve (must be typed as a constant number).
3. **By Changing Cell:** Must contain a **raw input value** (cannot be a formula!).

![What-If Analysis and Goal Seek](/images/tutorials/ms-excel/executive-sales-dashboard.svg)

---

## 2. Practical Business Scenarios for Goal Seek

### Scenario A: Break-Even Loan Payment Calculation
Suppose you are purchasing equipment:
* Loan Amount: $500,000
* Term: 60 Months
* Annual Rate: 8.5%
* Monthly EMI Formula: '=PMT(8.5%/12, 60, -500000)' -> Calculates **$10,258/month**.
* *Problem:* Your business budget can only afford **$8,500/month**.
* *Using Goal Seek:*
  * **Set cell:** EMI formula cell
  * **To value:** '8500'
  * **By changing cell:** Loan Amount cell
  * *Result:* Goal Seek calculates that you must negotiate the equipment price down to **$414,310**!

### Scenario B: Passing Grade Requirement
A student has scored 65, 72, and 68 on three exams. To achieve an overall 75 average across 4 exams:
* Formula cell: '=AVERAGE(Exam1:Exam4)'
* Set cell: Average cell | To value: '75' | By changing cell: Exam 4 cell
* *Result:* Goal Seek reveals the student must score **95** on Exam 4.

---

## 3. Step-by-Step: Running Goal Seek

1. Open your model and locate your formula cell.
2. Go to **Data > Forecast group > What-If Analysis > Goal Seek...**.
3. Fill in the three fields:
   * **Set cell:** '$B$6'
   * **To value:** '100000'
   * **By changing cell:** '$B$2'
4. Click **OK**.
5. The Goal Seek Status dialog displays: *"Goal Seeking with cell B6 found a solution."*
6. Click **OK** to keep the calculated value, or **Cancel** to revert.

---

# Multiple Choice Questions

### 1. Where on the Microsoft Excel ribbon is the Goal Seek tool located?
A. Home tab > Editing
B. Data tab > Forecast group > What-If Analysis > Goal Seek...
C. Formulas tab > Calculation
D. Review tab > Proofing
**Answer:** B
**Explanation:** Goal Seek is found on the Data tab under What-If Analysis in the Forecast command group.

---

### 2. Which of the following is a mandatory requirement for the 'Set cell' in Goal Seek?
A. It must contain a formula
B. It must be empty
C. It must be formatted as currency
D. It must be located in cell A1
**Answer:** A
**Explanation:** The 'Set cell' must contain an active formula because Goal Seek evaluates how changes to inputs impact formula output.

---

### 3. Can the 'By changing cell' in Goal Seek contain a formula?
A. Yes, any formula can be used
B. No, the changing cell must contain a hardcoded numeric input value
C. Only if it uses VLOOKUP
D. Only if it is linked to another workbook
**Answer:** B
**Explanation:** The 'By changing cell' must be a direct numeric constant cell that Excel can adjust freely during iteration.

---

### 4. If Goal Seek fails to find an exact solution, what does it do?
A. It deletes the workbook
B. It halts and presents the closest mathematical approximation it was able to reach
C. It generates a #REF! error
D. It sends an error log to Microsoft
**Answer:** B
**Explanation:** If an exact solution cannot be reached within standard iteration limits, Goal Seek reports the closest approximation found.

---

### 5. What limitation does Goal Seek possess compared to the advanced Excel Solver add-in?
A. Goal Seek can only adjust ONE single variable cell, whereas Solver can adjust multiple variables with constraints
B. Goal Seek only works on Mondays
C. Goal Seek cannot perform division
D. Goal Seek requires Python
**Answer:** A
**Explanation:** Goal Seek is limited to solving for a single target by altering a single variable cell; solving multi-variable optimization problems requires Solver.

---
