# Mini Project: Create an Employee Attendance Tracker Setup

In this three-part capstone project for the Intermediate track, you will build a dynamic, production-grade **Employee Attendance Tracker**. In this first lesson, we establish the grid architecture, configure automated calendar headers, apply Data Validation codes, and establish freeze panes.

---

## 1. Project Requirements & Architecture

Our attendance tracker will track a team across an entire 31-day month:
* **Columns A to C:** Employee Master Data (Emp ID, Full Name, Department).
* **Columns D to AH:** Days of the Month (Day 1 through Day 31).
* **Columns AI to AL:** Summary Calculation Columns (Present, Absent, Leave, Attendance %).

```
Worksheet Layout Grid:
+---------+-------------------+------------+-------+-------+-----+--------+---------+--------+-------+
| Emp ID  | Employee Name     | Department | Day 1 | Day 2 | ... | Day 31 | Present | Absent | Att % |
+---------+-------------------+------------+-------+-------+-----+--------+---------+--------+-------+
| EMP-01  | Rajesh Sharma     | Operations | P     | P     | ... | P      | 24      | 1      | 96.0% |
| EMP-02  | Ananya Patel      | Finance    | P     | A     | ... | L      | 22      | 2      | 88.0% |
+---------+-------------------+------------+-------+-------+-----+--------+---------+--------+-------+
```

![Employee Attendance Tracker Architecture](/images/tutorials/ms-excel/sorting-filtering-tables.svg)

---

## 2. Step-by-Step Layout Construction

1. Open a fresh worksheet and rename the tab to **Attendance_Tracker**.
2. Set up the Master Headers in row 4:
   * Cell **A4:** 'Emp ID'
   * Cell **B4:** 'Employee Name'
   * Cell **C4:** 'Department'
3. Set up the Month Configuration in row 2:
   * Cell **D2:** Enter the start date: '2026-10-01'.
   * Format cell **D2** as 'mmmm yyyy' (Displays: *October 2026*).
4. Generating 31 Dynamic Days in Row 4:
   * In cell **D4**, enter '=D2' (Format as 'dd' to display '01').
   * In cell **E4**, enter '=D4 + 1' and drag across through column **AH** (Day 31).
   * In row 3 (above the numbers), enter '=TEXT(D4, "ddd")' to display day names (Thu, Fri, Sat...).

---

## 3. Applying In-Cell Dropdowns for Attendance Codes

To prevent spelling mistakes ('present', 'prsnt', 'p'):
1. Highlight the entire attendance grid: **D5:AH50**.
2. Go to **Data > Data Validation**.
3. Set **Allow: List**.
4. In **Source**, enter:
   ```text
   P, A, L, HD
   ```
   *(P = Present, A = Absent, L = Approved Leave, HD = Half Day)*
5. Click **OK**. Every single cell in the calendar now has a standardized drop-down menu!

---

## 4. Freezing Panes for Effortless Scrolling

Because the calendar spans 31 columns wide:
1. Click cell **D5** (the intersection of the first data row and the first day column).
2. Go to **View > Window group > Freeze Panes > Freeze Panes**.
3. Now, as you scroll right to Day 31, Columns A, B, and C remain permanently visible!

---

# Multiple Choice Questions

### 1. Which cell must be active before clicking 'Freeze Panes' to keep Columns A-C and Rows 1-4 locked on screen?
A. A1
B. C4
C. D5
D. E1
**Answer:** C
**Explanation:** Freeze Panes locks all rows above the active cell and all columns to the left; clicking D5 locks rows 1-4 and columns A-C.

---

### 2. Which Data Validation list string standardizes attendance logging across the employee tracking grid?
A. Present; Absent
B. P, A, L, HD
C. TRUE/FALSE
D. 1 - 31
**Answer:** B
**Explanation:** Entering 'P, A, L, HD' separated by commas creates a standardized in-cell drop-down list for logging attendance codes.

---

### 3. Which formula converts a date in cell D4 into a three-letter day abbreviation like 'Mon' or 'Fri'?
A. =DAY(D4)
B. =TEXT(D4, "ddd")
C. =WEEKDAY(D4)
D. =NAME(D4)
**Answer:** B
**Explanation:** The formula '=TEXT(D4, "ddd")' formats the underlying date into a 3-letter weekday abbreviation.

---

### 4. Why is setting standardized codes (P, A, L) through Data Validation crucial before writing summary formulas?
A. Because Excel cannot count letters unless they are uppercase
B. Inconsistent spelling (e.g., 'Present' vs 'p' vs 'P') causes COUNTIF formulas to produce inaccurate counts
C. It reduces file printing costs
D. It locks the worksheet password
**Answer:** B
**Explanation:** Standardized validation ensures all entries match exact criteria, enabling summary formulas like COUNTIF to calculate accurately.

---

### 5. What happens when you drag '=D4 + 1' horizontally across columns when cell D4 contains a valid date?
A. The number increments by 1 day for each successive column
B. It returns #VALUE!
C. The month changes
D. The formula remains fixed on D4
**Answer:** A
**Explanation:** Because dates are stored as serial numbers, adding 1 increments the date by exactly one calendar day.

---
