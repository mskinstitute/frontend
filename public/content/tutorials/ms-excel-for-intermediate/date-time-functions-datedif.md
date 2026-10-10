# Date & Time Functions (TODAY, NOW, DATEDIF, NETWORKDAYS)

In financial models, project schedules, and HR analytics, time calculation is critical. Excel stores dates as serial integers (where Day 1 is January 1, 1900) and times as decimal fractions. Understanding specialized date functions enables you to calculate employee tenure, project durations, and business day milestones effortlessly.

---

## 1. Dynamic Clocks: TODAY() and NOW()

* **'=TODAY()'**: Returns the current system calendar date (e.g., '15/09/2026'). Takes no arguments. Updates automatically every time the workbook calculates.
* **'=NOW()'**: Returns both current system date and exact time (e.g., '15/09/2026 14:32').
* *Freezing Date Stamp Shortcut:* If you want a permanent non-updating timestamp, press **Ctrl + ;** for today's date, or **Ctrl + Shift + ;** for current time.

---

## 2. Calculating Durations with DATEDIF

**DATEDIF** is one of Excel's most useful functions for calculating age, tenure, and elapsed time:

```excel
Syntax:
=DATEDIF(start_date, end_date, unit)
```

### Unit Interval Codes:
| Unit Code | Meaning | Calculation Output |
| :--- | :--- | :--- |
| **"Y"** | Complete Years | Total full years between dates (ideal for employee age / tenure). |
| **"M"** | Complete Months | Total elapsed months. |
| **"D"** | Days | Total elapsed calendar days. |
| **"YM"** | Months Excluding Years | Remaining months after subtracting complete years (e.g., 5 years, **3 months**). |
| **"MD"** | Days Excluding Months | Remaining days after subtracting complete months. |

### Practical Age/Tenure Formula:
```excel
=DATEDIF(B2, TODAY(), "Y") & " Years, " & DATEDIF(B2, TODAY(), "YM") & " Months"
```
*(Displays formatted string: "6 Years, 4 Months")*

![Date and Time Formulas in Excel](/images/tutorials/ms-excel/essential-functions-summary.svg)

---

## 3. Working with Business Days: NETWORKDAYS & WORKDAY

Calendar days include weekends and holidays, which distorts project deadlines. Excel provides dedicated business-day engines:

### A. NETWORKDAYS: Calculating Net Working Days
Calculates total workdays between two dates, automatically excluding Saturdays, Sundays, and specified company holidays:
```excel
=NETWORKDAYS(start_date, end_date, [holidays])
```
*Example:* '=NETWORKDAYS(A2, B2, $H$2:$H$10)' calculates actual working days between start and finish dates, omitting the holiday dates listed in 'H2:H10'.

### B. WORKDAY: Projecting Completion Deadlines
Adds N working days to a start date:
```excel
=WORKDAY(start_date, days, [holidays])
```
*Example:* If a task starts on Friday and requires 3 working days: '=WORKDAY("2026-10-02", 3)' returns Wednesday '2026-10-07' (skipping Saturday and Sunday).

---

# Multiple Choice Questions

### 1. Which function returns the current system date without timestamps and updates dynamically whenever the sheet recalculates?
A. =DATE()
B. =CURRENT()
C. =TODAY()
D. =SYSTEMDATE()
**Answer:** C
**Explanation:** TODAY() takes no arguments and returns the current system calendar date dynamically.

---

### 2. What keyboard shortcut inserts a permanent, static timestamp of today's date that will never change?
A. Ctrl + T
B. Ctrl + ; (Semicolon)
C. Alt + D
D. Shift + F3
**Answer:** B
**Explanation:** Pressing Ctrl + ; stamps the current static calendar date directly into the cell.

---

### 3. What does the formula '=DATEDIF("2020-01-01", "2025-01-01", "Y")' return?
A. 60
B. 5
C. 1826
D. 2025
**Answer:** B
**Explanation:** The "Y" unit parameter instructs DATEDIF to return the count of complete elapsed years, which is 5.

---

### 4. Which function calculates the total number of working days between two dates, automatically omitting Saturdays and Sundays?
A. DAYS360
B. NETWORKDAYS
C. WORKDAY.ADD
D. DATEDIF
**Answer:** B
**Explanation:** NETWORKDAYS calculates net working days between a start date and end date, excluding weekend days and optional custom holidays.

---

### 5. In DATEDIF, which unit code calculates the remaining months between two dates as if they were in the same year (ignoring full years)?
A. "M"
B. "YM"
C. "MD"
D. "YD"
**Answer:** B
**Explanation:** The "YM" unit calculates the remaining months between two dates after accounting for full elapsed years.

---
