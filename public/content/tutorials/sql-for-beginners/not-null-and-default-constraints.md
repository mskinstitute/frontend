---
id: not-null-and-default-constraints
slug: not-null-and-default-constraints
course: sql-for-beginners
chapter: Data Integrity & Table Constraints
topic: "NOT NULL and DEFAULT Constraints: Preventing Missing Data"
difficulty: Beginner
readingTime: 12
order: 24
keywords: ["not null","default constraint","handling missing data","column defaults","data integrity"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# NOT NULL and DEFAULT Constraints: Preventing Missing Data
In database design, missing or unrecorded information is represented by **`NULL`**. However, allowing `NULL` everywhere leads to complex, bug-prone queries where every filter must check `IS NOT NULL`. To build reliable databases, you must know when to strictly forbid missing data using **`NOT NULL`** and when to supply automatic fallbacks using **`DEFAULT`**.

---

## 1. The `NOT NULL` Constraint

The **`NOT NULL`** constraint enforces that a column must always be assigned a valid value during an `INSERT` or `UPDATE` statement. Attempting to insert a `NULL` value into a `NOT NULL` column triggers an error.

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL, -- Mandatory field
    email VARCHAR(100) NOT NULL,    -- Mandatory field
    middle_name VARCHAR(50)         -- Optional field (Defaults to NULL allowed)
);
```

### What is `NULL` Exactly?
- `NULL` is **not** equal to zero (`0`).
- `NULL` is **not** equal to an empty string (`""`).
- `NULL` represents **unknown, unrecorded, or missing** data.
- In SQL three-valued logic, `NULL = NULL` evaluates to **`UNKNOWN`**, not `TRUE`!

---

## 2. The `DEFAULT` Constraint

The **`DEFAULT`** constraint supplies a predetermined fallback value if an `INSERT` statement does not explicitly provide a value for that column:

```sql
CREATE TABLE product_inventory (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    quantity_in_stock INT NOT NULL DEFAULT 0,
    is_discontinued BOOLEAN NOT NULL DEFAULT FALSE,
    minimum_order_quantity INT NOT NULL DEFAULT 1,
    reorder_level INT NOT NULL DEFAULT 10
);
```

### Testing Defaults During Insertion:
```sql
-- Notice we only supply product_name:
INSERT INTO product_inventory (product_name) 
VALUES ('Wireless Mechanical Keyboard');

-- Check the resulting row:
SELECT * FROM product_inventory;
```

Output:
```text
+------------+--------------------------------+-------------------+-----------------+------------------------+---------------+
| product_id | product_name                   | quantity_in_stock | is_discontinued | minimum_order_quantity | reorder_level |
+------------+--------------------------------+-------------------+-----------------+------------------------+---------------+
|          1 | Wireless Mechanical Keyboard   |                 0 |               0 |                      1 |            10 |
+------------+--------------------------------+-------------------+-----------------+------------------------+---------------+
```

---

## 3. Dynamic Default Expressions in MySQL 8.0+

Traditionally, `DEFAULT` only accepted literal constants (e.g., `DEFAULT 0`, `DEFAULT 'Active'`). In modern MySQL 8.0+, you can use **dynamic expressions** enclosed in parentheses!

```sql
CREATE TABLE audit_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_action VARCHAR(100) NOT NULL,
    
    -- Dynamic Default: Current timestamp
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Dynamic Default: Random UUID v4 generated on insert
    tracking_uuid VARCHAR(36) NOT NULL DEFAULT (UUID())
);
```

---

## 4. Modifying Constraints on Existing Tables

```sql
-- Add NOT NULL constraint to an existing column:
ALTER TABLE users
MODIFY COLUMN middle_name VARCHAR(50) NOT NULL;

-- Add a default value to an existing column:
ALTER TABLE users
ALTER COLUMN is_active SET DEFAULT TRUE;

-- Drop a default value:
ALTER TABLE users
ALTER COLUMN is_active DROP DEFAULT;
```

---

## 5. Best Practices & Common Pitfalls

- **Default to NOT NULL Everywhere Possible:** Unless a column genuinely represents optional or unknown information (e.g., `shipped_date` for an order that hasn't shipped yet), mark columns as `NOT NULL`. This simplifies query logic and enables the optimizer to utilize indexes more efficiently.
- **Do Not Confuse Empty String with NULL:** An empty string `""` is a known string of zero length; `NULL` is an unknown value. Storing `""` in a `NOT NULL` column succeeds, but may violate your business logic!

---

# Multiple Choice Questions

### 1. In SQL three-valued logic, what is the result of the comparison expression `NULL = NULL`?
A. TRUE
B. FALSE
C. UNKNOWN
D. 0
**Answer:** C
**Explanation:** In standard SQL logic, `NULL` represents an unknown value, so comparing two unknowns yields `UNKNOWN`, not TRUE.
---

### 2. What happens if an INSERT statement does not provide a value for a column configured with `DEFAULT 'Active'`?
A. The insert query fails
B. The string 'Active' is automatically assigned to that column
C. The column is assigned NULL
D. The column is left blank
**Answer:** B
**Explanation:** The `DEFAULT` constraint automatically populates the column with its specified default value when an `INSERT` omits it.
---

### 3. Which SQL statement alters an existing column named `status` to set its default value to 'Pending'?
A. UPDATE users SET DEFAULT = 'Pending';
B. ALTER TABLE users ALTER COLUMN status SET DEFAULT 'Pending';
C. SET DEFAULT 'Pending' ON users.status;
D. CHANGE DEFAULT TO 'Pending' ON status;
**Answer:** B
**Explanation:** `ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT 'value';` is the standard syntax to assign a new default value.
---

### 4. Why does marking columns as `NOT NULL` improve database performance?
A. It compresses data to 1 bit
B. It eliminates null-check overhead and allows the query optimizer to utilize more compact index representations
C. It doubles the CPU clock rate
D. It prevents users from updating records
**Answer:** B
**Explanation:** Nullable columns require extra null-mask bits in index entries and table records, complicating query execution plans.
---

### 5. In MySQL 8.0+, how must dynamic function expressions (like `UUID()`) be written in a `DEFAULT` clause?
A. Enclosed in double quotes: DEFAULT "UUID()"
B. Enclosed in parentheses: DEFAULT (UUID())
C. Preceded by an at sign: DEFAULT @UUID()
D. Function defaults are not supported
**Answer:** B
**Explanation:** MySQL 8.0 requires that expression-based defaults be enclosed within parentheses, e.g., `DEFAULT (UUID())`.
---
