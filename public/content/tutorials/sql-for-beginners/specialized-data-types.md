---
id: specialized-data-types
slug: specialized-data-types
course: sql-for-beginners
chapter: MySQL Data Types in Depth
topic: "Specialized Data Types: ENUM, BOOLEAN, and Native JSON"
difficulty: Beginner
readingTime: 12
order: 16
keywords: ["enum","boolean","json data type","json_extract","set type","specialized types"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Specialized Data Types: ENUM, BOOLEAN, and Native JSON
Beyond numbers, text, and dates, MySQL provides specialized data types designed for specific software engineering patterns: **`ENUM`** for restricted choice lists, **`BOOLEAN`** for true/false flags, and **`JSON`** for modern semi-structured document storage.

---

## 1. `ENUM`: Constrained String Choices

An **`ENUM`** is a string object whose value must be chosen from an explicit list of permitted values declared at table creation time:

```sql
CREATE TABLE support_tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
    status ENUM('Open', 'In_Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Open'
);
```

### How ENUM Works Under the Hood
- Although you query and insert strings (like `'High'`), MySQL stores them internally as **1-byte or 2-byte integers** representing index positions (`'Low' = 1`, `'Medium' = 2`, `'High' = 3`, `'Critical' = 4`).
- This makes `ENUM` extremely compact on disk and fast to compare.
- If you attempt to insert an invalid value (e.g., `'Urgent'`), MySQL in strict mode rejects the query with an error!

> [!CAUTION]
> Avoid `ENUM` if the list of values changes frequently! Adding a new value to an `ENUM` requires an `ALTER TABLE` statement. If values change often, use a separate lookup table with a foreign key instead.

---

## 2. `BOOLEAN` / `BOOL`: Truth Values in MySQL

Does MySQL have a true native Boolean type? **No!**

In MySQL, **`BOOLEAN`** and **`BOOL`** are syntactic synonyms for **`TINYINT(1)`**:
- The literal keyword **`TRUE`** evaluates to the integer **`1`**.
- The literal keyword **`FALSE`** evaluates to the integer **`0`**.

```sql
CREATE TABLE customer_accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- Querying Boolean columns:
SELECT * FROM customer_accounts WHERE is_active = TRUE;
-- Equivalent to:
SELECT * FROM customer_accounts WHERE is_active = 1;
```

---

## 3. Native `JSON` Data Type in MySQL 8.0+

MySQL provides native support for RFC 7159 **JSON documents**. Unlike storing JSON as a raw `TEXT` string, MySQL's native `JSON` data type:
1. **Validates Syntax:** Automatically rejects malformed JSON documents on insert.
2. **Optimized Binary Format:** Stored in an internal binary format that allows the server to read nested keys without parsing the entire JSON string!

```sql
CREATE TABLE product_catalog (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    specifications JSON NOT NULL
);

-- Inserting structured JSON documents:
INSERT INTO product_catalog (product_name, specifications) VALUES
('MacBook Pro M3', '{"brand": "Apple", "ram_gb": 16, "storage_gb": 512, "color": "Space Black"}'),
('ThinkPad X1', '{"brand": "Lenovo", "ram_gb": 32, "storage_gb": 1024, "ports": ["USB-C", "HDMI"]}');
```

### Querying JSON with Operators (`->` and `->>`)
- **`->` (JSON Extract):** Extracts value preserving JSON quotes (e.g., `"Apple"`).
- **`->>` (JSON Unquote Extract):** Extracts value as clean unquoted text (e.g., `Apple`).

```sql
-- Find all laptops with 32 GB RAM:
SELECT 
    product_name,
    specifications->>'$.brand' AS brand,
    specifications->'$.ram_gb' AS ram
FROM product_catalog
WHERE specifications->'$.ram_gb' >= 32;
```

---

## 4. Best Practices & Common Pitfalls

- **Do Not Overuse JSON for Everything:** Relational tables with typed columns are faster to index, enforce foreign keys, and perform joins on. Use JSON only for semi-structured, rapidly evolving, or sparse attributes.
- **Index JSON with Generated Columns:** If you frequently query a JSON field (e.g., `WHERE specifications->'$.brand' = 'Apple'`), create a **virtual generated column** on that JSON path and put a standard B-Tree index on it!

---

# Multiple Choice Questions

### 1. In MySQL, what underlying data type is `BOOLEAN` internally an alias for?
A. BIT(8)
B. CHAR(1)
C. TINYINT(1)
D. VARCHAR(5)
**Answer:** C
**Explanation:** In MySQL, `BOOLEAN` and `BOOL` are syntactic aliases for `TINYINT(1)`, where 1 represents TRUE and 0 represents FALSE.
---

### 2. How does MySQL store the values of an `ENUM('Small', 'Medium', 'Large')` column on disk?
A. As full plain-text strings
B. As compact 1-byte or 2-byte integer index numbers (1, 2, 3)
C. As MD5 hash values
D. In a temporary JSON file
**Answer:** B
**Explanation:** MySQL stores `ENUM` values internally as integer offsets corresponding to their position in the declaration list, making storage compact and comparisons fast.
---

### 3. What is the difference between the `->` and `->>` JSON extraction operators in MySQL?
A. -> is for numbers; ->> is for strings
B. -> extracts the value preserving quotes, while ->> unquotes the extracted string
C. -> only works in SQLite; ->> works in MySQL
D. -> is deprecated
**Answer:** B
**Explanation:** `->` is shorthand for `JSON_EXTRACT()`, returning quoted JSON values, whereas `->>` unquotes the extracted string, returning plain text.
---

### 4. What happens when you attempt to insert an invalid string (not listed in the ENUM definition) in strict SQL mode?
A. MySQL inserts the value anyway and expands the ENUM
B. MySQL rejects the query with an error and halts insertion
C. MySQL converts the value to 0
D. MySQL shuts down
**Answer:** B
**Explanation:** In strict SQL mode (`STRICT_TRANS_TABLES`), attempting to insert an illegal value into an `ENUM` column causes MySQL to throw a fatal error.
---

### 5. Why is MySQL's native `JSON` type superior to storing JSON in a standard `TEXT` column?
A. JSON columns cannot be deleted
B. Native JSON provides automatic syntax validation and optimized binary storage for fast key lookups without full document parsing
C. Native JSON does not consume disk space
D. Native JSON allows running Python code inside MySQL
**Answer:** B
**Explanation:** The native JSON type validates JSON syntax on write and stores documents in an optimized binary format allowing rapid direct-access lookups of nested keys.
---
