---
id: numeric-data-types
slug: numeric-data-types
course: sql-for-beginners
chapter: MySQL Data Types in Depth
topic: "Numeric Data Types: Integers, Decimals, and Floating-Point"
difficulty: Beginner
readingTime: 12
order: 13
keywords: ["numeric data types","int vs bigint","tinyint","decimal vs float","unsigned","zerofill"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Numeric Data Types: Integers, Decimals, and Floating-Point
Choosing the correct numeric data type is one of the most critical decisions in database engineering. An incorrect choice can lead to subtle financial calculation bugs (such as 0.1 + 0.2 equaling 0.30000000000000004) or waste hundreds of gigabytes of server RAM and SSD storage across billions of rows.

---

## 1. Exact Integers in MySQL

MySQL provides five distinct integer types depending on the range of numbers you need to store:

| Type | Storage Bytes | Signed Range | Unsigned Range | Common Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **`TINYINT`** | 1 byte | -128 to 127 | 0 to 255 | Age, status codes, flags. |
| **`SMALLINT`** | 2 bytes | -32,768 to 32,767 | 0 to 65,535 | Year, country codes, items in cart. |
| **`MEDIUMINT`** | 3 bytes | -8,388,608 to 8,388,607 | 0 to 16,777,215 | Zip codes, customer IDs for medium apps. |
| **`INT` / `INTEGER`**| 4 bytes | -2.14 billion to +2.14 billion | 0 to 4.29 billion | Standard primary keys, order IDs. |
| **`BIGINT`** | 8 bytes | -9.22 quintillion to +9.22 quintillion | 0 to 18.44 quintillion | Global payment transactions, analytics logs. |

### The `UNSIGNED` Keyword
If a column will **never** store negative values (e.g., student age, product price, quantity in stock), designate it as `UNSIGNED`. This doubles the positive range without consuming any additional disk space!

```sql
CREATE TABLE product_inventory (
    product_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    stock_quantity SMALLINT UNSIGNED NOT NULL,
    reorder_threshold TINYINT UNSIGNED NOT NULL DEFAULT 5
);
```

---

## 2. Fixed-Point vs Floating-Point: Financial Accuracy

```
   DECIMAL(M, D)  ---------> EXACT STORAGE (Base-10 math)  <-- USE FOR MONEY!
   FLOAT / DOUBLE ---------> APPROXIMATE (IEEE 754 Binary) <-- USE FOR SCIENTIFIC DATA!
```

### `DECIMAL(M, D)` (Exact Numeric)
- **M (Precision):** Total number of digits (1 to 65).
- **D (Scale):** Number of digits to the right of the decimal point (0 to 30).
- `DECIMAL(10, 2)` can store up to 8 digits before the dot and 2 digits after: `-99999999.99` to `+99999999.99`.
- Stored as binary-encoded decimal digits with **zero rounding error**. Always use `DECIMAL` for prices, salaries, currency, and taxes!

### `FLOAT` & `DOUBLE` (Approximate Numeric)
- **`FLOAT` (4 bytes):** ~7 decimal digits of precision.
- **`DOUBLE` (8 bytes):** ~15 decimal digits of precision.
- Implements IEEE 754 floating-point arithmetic. Numbers like `0.1` cannot be represented with absolute exactness in binary, leading to rounding discrepancies. Use strictly for scientific measurements, GPS coordinates, or game coordinates where speed outweighs microscopic rounding precision.

```sql
CREATE TABLE account_ledger (
    entry_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    transaction_amount DECIMAL(12, 4) NOT NULL, -- Exact to 4 decimal places
    currency_exchange_rate DECIMAL(8, 6) NOT NULL,
    latitude DOUBLE, -- GPS coordinates (approximate is fine)
    longitude DOUBLE
);
```

---

## 3. Best Practices & Common Pitfalls

- **Never Use FLOAT for Currency:** Storing rupees, dollars, or cryptocurrency in `FLOAT` or `DOUBLE` will result in reconciliation errors during financial audits.
- **The Meaning of `INT(11)` in MySQL:** The number inside parentheses in `INT(11)` or `INT(4)` is only a **display width hint** used with `ZEROFILL`. It does **not** limit the maximum value or storage size! An `INT(4)` can still store `2,000,000,000`. In MySQL 8.0.19+, integer display widths are officially deprecated.
- **Choose the Smallest Viable Integer:** Using `BIGINT` for a column that will never exceed 100 entries wastes 7 bytes per row. Across 100 million rows, that is 700 MB of wasted RAM!

---

# Multiple Choice Questions

### 1. Which numeric data type MUST be used when storing monetary values like product prices and salaries in MySQL?
A. FLOAT
B. DOUBLE
C. DECIMAL
D. REAL
**Answer:** C
**Explanation:** `DECIMAL` is an exact fixed-point numeric type that stores numbers with exact precision, avoiding the floating-point rounding errors inherent to FLOAT and DOUBLE.
---

### 2. How many bytes of storage does a standard signed `INT` column occupy in MySQL?
A. 2 bytes
B. 4 bytes
C. 8 bytes
D. 16 bytes
**Answer:** B
**Explanation:** A standard `INT` (or `INTEGER`) column occupies exactly 4 bytes of storage with a signed range of -2,147,483,648 to 2,147,483,647.
---

### 3. What does the `UNSIGNED` keyword accomplish on an integer column?
A. It encrypts the integer
B. It disallows negative values, thereby doubling the maximum positive range
C. It allows decimal fractions
D. It resets the value to zero after 1000 rows
**Answer:** B
**Explanation:** `UNSIGNED` eliminates negative numbers, shifting the entire range to positive values (e.g., `TINYINT UNSIGNED` ranges from 0 to 255 instead of -128 to 127).
---

### 4. In `DECIMAL(8, 2)`, what is the maximum number of digits allowed before the decimal point?
A. 8 digits
B. 2 digits
C. 6 digits
D. 10 digits
**Answer:** C
**Explanation:** In `DECIMAL(M, D)`, M is total precision (8) and D is decimal scale (2). Therefore, the number of integer digits before the decimal point is 8 - 2 = 6.
---

### 5. What did the specification `INT(5)` historically indicate in MySQL versions prior to 8.0.19?
A. The column can only store numbers up to 99999
B. The column occupies 5 bytes of RAM
C. A display width hint (often used with ZEROFILL) that did not affect storage capacity
D. An index of 5 levels
**Answer:** C
**Explanation:** Integer display widths such as `INT(5)` were purely formatting hints for client applications and did not limit the actual storage range of the integer.
---
