---
id: date-and-time-types
slug: date-and-time-types
course: sql-for-beginners
chapter: MySQL Data Types in Depth
topic: "Date & Time Types: DATE, TIME, DATETIME, and TIMESTAMP"
difficulty: Beginner
readingTime: 12
order: 15
keywords: ["date and time","datetime vs timestamp","timezones","current_timestamp","temporal types","unix epoch"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Date & Time Types: DATE, TIME, DATETIME, and TIMESTAMP
Nearly every real-world application requires handling time: timestamps for when an order was placed, account creation dates, subscription renewal deadlines, and employee shift durations. Choosing between **`DATE`**, **`TIME`**, **`DATETIME`**, and **`TIMESTAMP`** requires understanding how MySQL handles time zones.

---

## 1. MySQL Temporal Data Types Overview

| Type | Format | Storage | Range | Time Zone Aware? |
| :--- | :--- | :--- | :--- | :--- |
| **`DATE`** | `YYYY-MM-DD` | 3 bytes | `1000-01-01` to `9999-12-31` | No |
| **`TIME`** | `HH:MM:SS[.fraction]` | 3 bytes | `-838:59:59` to `838:59:59` | No |
| **`DATETIME`** | `YYYY-MM-DD HH:MM:SS` | 5 bytes | `1000-01-01 00:00:00` to `9999-12-31 23:59:59` | **No (Constant)** |
| **`TIMESTAMP`** | `YYYY-MM-DD HH:MM:SS` | 4 bytes | `1970-01-01 00:00:01` UTC to `2038-01-19 03:14:07` UTC | **Yes (UTC converted)** |
| **`YEAR`** | `YYYY` | 1 byte | `1901` to `2155` | No |

---

## 2. The Great Debate: `DATETIME` vs `TIMESTAMP`

The most common point of confusion is choosing between `DATETIME` and `TIMESTAMP`.

```
   Client in Tokyo (+09:00) stores '2026-03-15 18:00:00'
   
   If DATETIME:
   Stored on disk as: '2026-03-15 18:00:00' (Exact literal string)
   Client in New York (-05:00) reads: '2026-03-15 18:00:00' (NO timezone adjustment!)

   If TIMESTAMP:
   MySQL converts Tokyo time to UTC: '2026-03-15 09:00:00' UTC stored on disk.
   Client in New York (-05:00) reads: '2026-03-15 04:00:00' (AUTOMATIC timezone conversion!)
```

### When to Use `TIMESTAMP`:
- Event tracking, audit logs, `created_at` and `updated_at` record timestamps.
- When your system serves users globally across different time zones.

### When to Use `DATETIME`:
- Dates that represent fixed calendar appointments (e.g., "Doctor Appointment on Dec 25 at 10:00 AM regardless of where you view it from").
- Dates far in the future or past (e.g., historical dates before 1970, or mortgages expiring after the year 2038).

> [!WARNING]
> **The Year 2038 Problem:** `TIMESTAMP` is stored as a 32-bit integer representing seconds since the Unix Epoch (Jan 1, 1970). On **January 19, 2038**, 32-bit timestamps will overflow! Modern systems frequently adopt `DATETIME` or 64-bit timestamps to avoid this limitation.

---

## 3. Automatic Timestamps: `created_at` & `updated_at`

MySQL allows columns to populate and update their timestamps automatically:

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Automatically set to current timestamp when row is inserted:
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Automatically set to current timestamp when row is updated:
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 4. Querying & Manipulating Dates

```sql
-- Insert using standard ISO-8601 string format:
INSERT INTO orders (customer_id, total_amount) VALUES (101, 4999.00);

-- Extract parts of a date:
SELECT 
    order_id, 
    created_at,
    YEAR(created_at) AS order_year,
    MONTHNAME(created_at) AS order_month,
    DATE_FORMAT(created_at, '%d-%M-%Y %h:%i %p') AS formatted_date
FROM orders;
```

---

## 5. Best Practices & Common Pitfalls

- **Always Store in ISO Format (`YYYY-MM-DD`):** Never store dates as `VARCHAR` strings like `"15/03/2026"`. Storing strings breaks date sorting (`'02/10/2025'` sorts before `'15/01/2020'`), breaks date arithmetic, and prevents indexing!
- **Store UTC in Application Tier:** When using `DATETIME`, adopt the industry best practice of saving all records in Coordinated Universal Time (**UTC**), converting to local time only in the UI layer.

---

# Multiple Choice Questions

### 1. Which MySQL temporal type automatically converts values to UTC for storage and converts back to the client session timezone on retrieval?
A. DATE
B. DATETIME
C. TIMESTAMP
D. TIME
**Answer:** C
**Explanation:** `TIMESTAMP` values are converted from the current session time zone to UTC for storage, and converted back from UTC to the session time zone upon retrieval.
---

### 2. What causes the "Year 2038 Problem" with MySQL `TIMESTAMP` columns?
A. MySQL licenses expire in 2038
B. TIMESTAMP uses a signed 32-bit integer representing seconds since 1970-01-01, which overflows in January 2038
C. Hardware clocks stop working in 2038
D. The calendar runs out of days
**Answer:** B
**Explanation:** A 32-bit signed integer can only count up to 2,147,483,647 seconds, which elapses on January 19, 2038 at 03:14:07 UTC.
---

### 3. What is the standard SQL format for entering a date literal in MySQL?
A. DD/MM/YYYY
B. MM-DD-YYYY
C. YYYY-MM-DD
D. YYYY/DD/MM
**Answer:** C
**Explanation:** MySQL strictly adheres to the standard ISO-8601 calendar date format: `YYYY-MM-DD` (e.g., `2026-03-15`).
---

### 4. Which clause automatically updates a timestamp column whenever any column in that row is modified?
A. AUTO_REFRESH
B. ON UPDATE CURRENT_TIMESTAMP
C. TRIGGER UPDATE NOW
D. REFRESH_ON_CHANGE
**Answer:** B
**Explanation:** The `ON UPDATE CURRENT_TIMESTAMP` clause instructs MySQL to update the column's value with the current timestamp on every `UPDATE` statement that changes the row.
---

### 5. Why is storing dates in a `VARCHAR(20)` column considered a major database design mistake?
A. VARCHAR consumes 100 times more memory
B. It breaks chronological sorting, eliminates date validation, and prevents date arithmetic functions like DATEDIFF()
C. Text columns cannot be backed up
D. MySQL blocks queries containing slashes
**Answer:** B
**Explanation:** String representations of dates sort alphabetically rather than chronologically, cannot enforce leap-year or month validity, and prevent native SQL date arithmetic.
---
