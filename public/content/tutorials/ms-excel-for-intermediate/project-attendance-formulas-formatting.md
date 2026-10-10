# Use COUNTIF Formulas and Conditional Formatting

Continuing our **Employee Attendance Tracker**, we will now implement automated statistical formulas to aggregate attendance metrics and apply dynamic conditional formatting to visually highlight weekends and absenteeism.

---

## 1. Calculating Attendance Metrics with COUNTIF

In columns **AI** through **AL**, we calculate monthly totals for each employee:

```excel
Grid Coordinates Reference:
- Attendance Data Range: D5:AH5 (Columns D through AH for row 5)
```

### Formula Implementation in Row 5:
1. **Total Present Days (Column AI):**
   ```excel
   =COUNTIF(D5:AH5, "P") + (COUNTIF(D5:AH5, "HD") * 0.5)
   ```
   *(Counts full 'P' days plus counts half-days multiplied by 0.5).*
2. **Total Absent Days (Column AJ):**
   ```excel
   =COUNTIF(D5:AH5, "A")
   ```
3. **Total Approved Leaves (Column AK):**
   ```excel
   =COUNTIF(D5:AH5, "L")
   ```
4. **Attendance Percentage (Column AL):**
   ```excel
   =AI5 / (31 - COUNTIF($D$3:$AH$3, "Sun"))
   ```
   *(Divides total present days by total working days in the month, formatted as **Percentage**).*

Double-click the Fill Handle to propagate these formulas down to all employees!

![Attendance Tracker Calculations](/images/tutorials/ms-excel/conditional-formatting-rules.svg)

---

## 2. Dynamic Highlighting for Attendance Codes

To make the attendance sheet easy to read at a glance:
1. Select the entire attendance body: **D5:AH50**.
2. Click **Home > Conditional Formatting > Highlight Cells Rules > Equal To...**:
   * Value: **"A"** -> Format: **Light Red Fill with Dark Red Text** (Flags absenteeism).
   * Value: **"L"** -> Format: **Light Yellow Fill with Dark Yellow Text** (Flags leaves).
   * Value: **"P"** -> Format: **Light Green Fill with Dark Green Text** (Flags presence).

---

## 3. Shading Weekend Columns Automatically

To automatically gray out weekend columns across the calendar:
1. Select the calendar area: **D4:AH50**.
2. Click **Conditional Formatting > New Rule > Use a formula to determine which cells to format**.
3. Enter formula:
   ```excel
   =WEEKDAY(D$4, 2) > 5
   ```
   *Notice the mixed reference 'D$4': Row 4 is locked because dates are stored in row 4, while column D adjusts freely across all 31 days!*
4. Click **Format...**, select a light gray fill pattern, and click **OK**.
*Instantly, every Saturday and Sunday column across the entire month turns gray!*

---

# Multiple Choice Questions

### 1. Which formula accurately calculates total Present days for row 5, granting 0.5 credit for each Half Day (HD)?
A. =SUM(D5:AH5)
B. =COUNTIF(D5:AH5, "P") + (COUNTIF(D5:AH5, "HD") * 0.5)
C. =COUNT(D5:AH5, "P", "HD")
D. =IF(D5:AH5="P", 1, 0.5)
**Answer:** B
**Explanation:** Combining COUNTIF for 'P' with COUNTIF for 'HD' multiplied by 0.5 accurately accounts for full and half-day attendance.

---

### 2. What does the conditional formatting formula '=WEEKDAY(D$4, 2) > 5' accomplish?
A. Flags employees with more than 5 absences
B. Automatically shades columns where the date in row 4 falls on a Saturday or Sunday
C. Deletes weekend records
D. Highlights the 5th day of every month
**Answer:** B
**Explanation:** In return type 2, Saturday is 6 and Sunday is 7; testing for > 5 identifies weekend days to shade corresponding columns.

---

### 3. Why is the mixed reference 'D$4' used instead of '$D$4' when creating the weekend shading rule?
A. $D$4 would lock column D, causing every column across the sheet to evaluate only Day 1
B. Mixed references are required for printing
C. $D$4 causes an Excel crash
D. D$4 only works on weekdays
**Answer:** A
**Explanation:** Locking only row 4 allows the column letter to adjust relative to each column (D, E, F... AH), testing each day's date individually.

---

### 4. Which function counts how many times the letter "A" appears across row cells D5 through AH5?
A. =SUMIF(D5:AH5, "A")
B. =COUNTIF(D5:AH5, "A")
C. =COUNTA(D5:AH5)
D. =COUNTBLANK(D5:AH5)
**Answer:** B
**Explanation:** COUNTIF takes a range and a criterion string, counting the exact occurrences of that value.

---

### 5. How should cell AL5 (Attendance Percentage) be formatted to display '0.945' as '94.5%'?
A. Currency format
B. Percentage format with 1 decimal place
C. Scientific format
D. Text format
**Answer:** B
**Explanation:** Applying the Percentage number format with 1 decimal place displays 0.945 neatly as 94.5%.

---
