# Advanced Time Intelligence: 4-4-5 Calendars, Moving Averages & Custom Fiscal Years

While standard DAX time functions (`TOTALYTD`, `SAMEPERIODLASTYEAR`) work seamlessly for standard Gregorian calendar years (January to December), large enterprises—especially in retail, hospitality, and manufacturing—operate on **custom non-standard fiscal calendars**:
- **4-4-5, 4-5-4, or 5-4-4 Retail Calendars** (where every quarter consists of two 4-week months and one 5-week month so that quarters always have exactly 13 weeks).
- **Custom Rolling Windows** (Trailing 12 Months - T12M, 30-day moving averages).

Standard DAX time intelligence functions **FAIL COMPLETELY** on 4-4-5 retail calendars! Advanced BI architects author **custom time intelligence patterns using pure filter manipulation**.

---

## 1. Rolling Moving Averages (Trailing 30 Days / 90 Days)

A moving average smooths out daily sales volatility to reveal true underlying demand trends:

```dax
-- 30-Day Moving Average of Sales
Sales 30-Day Moving Avg = 
VAR LastVisibleDate = MAX(Dim_Date[Date])
VAR DateWindow = 
    DATESINPERIOD(
        Dim_Date[Date], 
        LastVisibleDate, 
        -30, 
        DAY
    )
RETURN
CALCULATE(
    AVERAGEX(
        VALUES(Dim_Date[Date]),
        [Total Sales]
    ),
    DateWindow
)
```

---

## 2. Custom 4-4-5 Retail Calendar Year-to-Date (YTD)

In a 4-4-5 calendar, months do not align with standard date ranges. The Date table contains custom attributes: `FiscalYear`, `FiscalWeekNumber`, `FiscalPeriod`.

```dax
-- Custom Fiscal YTD on 4-4-5 Calendar (Bypasses TOTALYTD!)
Fiscal 445 Sales YTD = 
VAR CurrentFiscalYear = MAX(Dim_Date[FiscalYear])
VAR CurrentFiscalWeek = MAX(Dim_Date[FiscalWeekNumber])
RETURN
CALCULATE(
    [Total Sales],
    ALLEXCEPT(Dim_Date, Dim_Date[FiscalYear]),
    Dim_Date[FiscalYear] = CurrentFiscalYear,
    Dim_Date[FiscalWeekNumber] <= CurrentFiscalWeek
)
```

---

## 3. Trailing 12 Months (T12M) Revenue Pattern

Executive boards look at T12M to evaluate revenue trends independent of seasonal fluctuations:

```dax
-- Trailing 12 Months (T12M) Sales
Sales T12M = 
VAR LastSelectedDate = MAX(Dim_Date[Date])
VAR FirstDateT12M = EDATE(LastSelectedDate, -12) + 1
RETURN
CALCULATE(
    [Total Sales],
    REMOVEFILTERS(Dim_Date),
    Dim_Date[Date] >= FirstDateT12M && Dim_Date[Date] <= LastSelectedDate
)
```

---

# Multiple Choice Questions

### 1. Why do standard DAX time intelligence functions like `TOTALYTD` fail when applied to a retail 4-4-5 fiscal calendar?
A. Standard functions assume standard Gregorian calendar months (varying days per month) and standard month boundaries, which do not align with 13-week 4-4-5 retail periods
B. Retail companies are not allowed to use Power BI
C. 4-4-5 calendars can only be analyzed in Python
D. `TOTALYTD` cannot calculate sales
**Answer:** A
**Explanation:** Built-in time intelligence functions rely on Gregorian calendar math. Custom retail calendars with fixed 4-week/5-week cycles require explicit filter manipulation using columns like `FiscalPeriod` and `FiscalWeek`.

### 2. What function in DAX shifts a date backward or forward by an exact number of calendar months (e.g., subtracting 12 months for T12M)?
A. `MONTHSHIFT()`
B. `EDATE(Date, NumberOfMonths)`
C. `DATEOFFSET()`
D. `TIMETRAVEL()`
**Answer:** B
**Explanation:** `EDATE` returns the date that is the indicated number of months before or after the specified start date, making it the ideal tool for calculating trailing 12-month boundaries.

### 3. In the 30-day moving average pattern, what does `DATESINPERIOD(Dates, LastDate, -30, DAY)` generate?
A. A single number representing 30
B. A single-column table of contiguous dates spanning 30 days backward from the last date currently in context
C. A list of 30 customer names
D. A chart visual
**Answer:** B
**Explanation:** `DATESINPERIOD` returns a table containing a sliding window of dates starting from a reference date and extending backward (or forward) by the specified interval.

### 4. Which DAX function completely removes all active filters from the Date table to establish an unconstrained custom date window?
A. `REMOVEFILTERS(Dim_Date)` (or `ALL(Dim_Date)`)
B. `DELETE()`
C. `FILTER()`
D. `KEEPFILTERS()`
**Answer:** A
**Explanation:** `REMOVEFILTERS()` clears any ambient visual date restrictions, enabling the calculation to re-apply custom date range boundaries (such as the Trailing 12 Months window).

### 5. Why is a Trailing 12 Months (T12M) calculation heavily favored in financial executive reporting?
A. It simplifies color choices
B. It neutralizes recurring seasonal peaks and valleys (such as holiday retail spikes), revealing the true baseline operational momentum of the enterprise
C. It limits reports to 12 rows
D. It reduces dataset refresh frequency
**Answer:** B
**Explanation:** By always summing a complete 365-day / 12-month cycle, T12M removes seasonality, enabling fair month-over-month trajectory analysis.

---
