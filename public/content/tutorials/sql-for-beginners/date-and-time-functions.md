---
id: date-and-time-functions
slug: date-and-time-functions
course: sql-for-beginners
chapter: SQL Built-in Scalar Functions
topic: "Date & Time Functions: Current Timestamps, Arithmetic, and Formatting"
difficulty: Beginner
readingTime: 12
order: 45
keywords: ["date functions","now vs curdate","datediff","date_add and date_sub","date_format","extract date"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Date & Time Functions: Current Timestamps, Arithmetic, and Formatting
Handling temporal data is essential for computing delivery estimates, subscription expirations, user ages, and financial reporting periods. MySQL offers an extensive library of **Date and Time Functions** that allow you to retrieve system clocks, execute calendar arithmetic, and format dates for display.

---

## 1. Getting the Current Date & Time

| Function | Returns | Format |
| :--- | :--- | :--- |
| **`NOW()`** / **`CURRENT_TIMESTAMP`** | Current date and time | `'YYYY-MM-DD HH:MM:SS'` |
| **`CURDATE()`** / **`CURRENT_DATE`** | Current date only | `'YYYY-MM-DD'` |
| **`CURTIME()`** / **`CURRENT_TIME`** | Current time only | `'HH:MM:SS'` |

```sql
SELECT 
    NOW() AS current_moment,
    CURDATE() AS today,
    CURTIME() AS right_now;
```

---

## 2. Extracting Parts of a Date

```sql
SELECT 
    order_date,
    YEAR(order_date) AS order_year,        -- e.g. 2026
    MONTH(order_date) AS order_month_num,  -- e.g. 3
    MONTHNAME(order_date) AS month_name,   -- e.g. 'March'
    DAY(order_date) AS day_of_month,       -- e.g. 15
    DAYNAME(order_date) AS day_name,       -- e.g. 'Sunday'
    QUARTER(order_date) AS fiscal_quarter  -- e.g. 1
FROM orders;
```

---

## 3. Date Arithmetic: `DATE_ADD()` and `DATE_SUB()`

Never perform date arithmetic using simple addition (`order_date + 7`). Use dedicated date interval functions to account for varying month lengths and leap years:

```sql
-- Calculate subscription renewal date (Add 1 Month):
SELECT DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AS renewal_date;

-- Calculate 30-day warranty expiration:
SELECT DATE_ADD(purchase_date, INTERVAL 30 DAY) AS warranty_end FROM sales;

-- Calculate 90 days ago:
SELECT DATE_SUB(CURDATE(), INTERVAL 90 DAY) AS ninety_days_ago;
```

---

## 4. Calculating Time Elapsed: `DATEDIFF()`

The **`DATEDIFF(date1, date2)`** function returns the number of days between two dates (`date1 - date2`):

```sql
-- How many days did order fulfillment take?
SELECT 
    order_id, 
    order_date, 
    delivery_date,
    DATEDIFF(delivery_date, order_date) AS fulfillment_days
FROM shipments;

-- Calculate user age in days:
SELECT DATEDIFF(CURDATE(), '2000-01-01') AS days_alive;
```

> [!NOTE]
> For calculating exact differences in hours, minutes, or seconds, use **`TIMESTAMPDIFF(unit, datetime1, datetime2)`**:
> `SELECT TIMESTAMPDIFF(HOUR, login_time, logout_time) AS hours_online FROM sessions;`

---

## 5. Custom Date Formatting with `DATE_FORMAT()`

When presenting dates on invoices or reports, use **`DATE_FORMAT(date, format_string)`**:

| Specifier | Description | Example |
| :--- | :--- | :--- |
| **`%Y`** | 4-digit Year | `2026` |
| **`%y`** | 2-digit Year | `26` |
| **`%M`** | Full Month Name | `March` |
| **`%m`** | 2-digit Month Number | `03` |
| **`%d`** | 2-digit Day of Month | `15` |
| **`%W`** | Full Weekday Name | `Sunday` |
| **`%h`** / **`%i`** / **`%p`** | 12-hour / Minutes / AM-PM | `02:30 PM` |

```sql
SELECT 
    order_date,
    DATE_FORMAT(order_date, '%W, %d %M %Y') AS readable_date,
    DATE_FORMAT(NOW(), '%d/%m/%Y %h:%i %p') AS indian_standard_format
FROM orders;
-- Output: 'Sunday, 15 March 2026' and '15/03/2026 02:30 PM'
```

---

# Multiple Choice Questions

### 1. Which function returns both the current system date and time in MySQL?
A. CURDATE()
B. NOW()
C. TODAY()
D. SYSDATE_ONLY()
**Answer:** B
**Explanation:** `NOW()` (and its synonym `CURRENT_TIMESTAMP`) returns the current date and time formatted as `YYYY-MM-DD HH:MM:SS`.
---

### 2. How do you calculate a date exactly 3 weeks in the future from today in MySQL?
A. TODAY + 21
B. DATE_ADD(CURDATE(), INTERVAL 3 WEEK)
C. FUTURE_DATE(3 WEEKS)
D. CURDATE() + INTERVAL(21)
**Answer:** B
**Explanation:** `DATE_ADD(date, INTERVAL value unit)` is the standard function to add intervals (DAYS, WEEKS, MONTHS, YEARS) to a date.
---

### 3. What does `DATEDIFF('2026-03-20', '2026-03-15')` return?
A. -5
B. 5
C. '5 days'
D. 0
**Answer:** B
**Explanation:** `DATEDIFF(d1, d2)` calculates `d1 - d2`, returning the integer number of days between them (20 - 15 = 5).
---

### 4. Which format string in `DATE_FORMAT()` outputs the full 4-digit year (e.g., '2026')?
A. %y
B. %Y
C. %yyyy
D. %YEAR
**Answer:** B
**Explanation:** In MySQL's `DATE_FORMAT` syntax, uppercase `%Y` represents the full 4-digit year, while lowercase `%y` represents a 2-digit year.
---

### 5. How can you calculate an employee's exact age in years from their `birth_date`?
A. YEAR(CURDATE()) - YEAR(birth_date) (Rough estimate) or TIMESTAMPDIFF(YEAR, birth_date, CURDATE())
B. DATEDIFF(CURDATE(), birth_date) / 365.25
C. AGE(birth_date)
D. CURDATE() - birth_date
**Answer:** A
**Explanation:** `TIMESTAMPDIFF(YEAR, birth_date, CURDATE())` accurately calculates completed calendar years without manual leap-day calculations.
---
