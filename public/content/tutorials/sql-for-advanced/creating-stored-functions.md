---
id: creating-stored-functions
slug: creating-stored-functions
course: sql-for-advanced
chapter: Stored Functions & Cursors
topic: "Creating User-Defined Functions (CREATE FUNCTION)"
difficulty: Advanced
readingTime: 14
order: 18
keywords: ["stored functions","create function","returns clause","return statement","user-defined functions"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Creating User-Defined Functions (CREATE FUNCTION)
While Stored Procedures are designed to perform procedural tasks and return full result sets, **Stored Functions (User-Defined Functions)** are designed to compute and return a **single scalar value**.

Because functions return a scalar value, they can be invoked directly inside standard SQL expressions: in `SELECT` lists, `WHERE` filters, `ORDER BY` clauses, and `HAVING` checks.

---

### Stored Function Syntax

```sql
DELIMITER //

CREATE FUNCTION function_name(param1 datatype, param2 datatype)
RETURNS return_datatype
[DETERMINISTIC | NOT DETERMINISTIC]
[READS SQL DATA | NO SQL | CONTAINS SQL]
BEGIN
    DECLARE result return_datatype;
    -- Logic here
    RETURN result;
END //

DELIMITER ;
```

---

### Practical Example: Tax Calculation Function

Let's build a reusable financial function to calculate tiered sales tax based on product categories:

```sql
DELIMITER //

CREATE FUNCTION CalculateItemTax(
    p_price DECIMAL(10, 2),
    p_category VARCHAR(50)
) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
NO SQL
BEGIN
    DECLARE tax_rate DECIMAL(4, 2);

    IF p_category = 'Groceries' THEN
        SET tax_rate = 0.00; -- Tax-exempt
    ELSEIF p_category = 'Clothing' THEN
        SET tax_rate = 0.04; -- 4% tax
    ELSEIF p_category = 'Electronics' THEN
        SET tax_rate = 0.08; -- 8% tax
    ELSE
        SET tax_rate = 0.05; -- Standard 5%
    END IF;

    RETURN ROUND(p_price * tax_rate, 2);
END //

DELIMITER ;
```

---

### Calling Stored Functions Inline in Queries

Unlike procedures which require `CALL`, functions are embedded directly into SQL statements:

```sql
-- Invoking function inside a SELECT statement
SELECT 
    product_name,
    category,
    retail_price,
    CalculateItemTax(retail_price, category) AS sales_tax,
    (retail_price + CalculateItemTax(retail_price, category)) AS final_checkout_price
FROM products;

-- Invoking function inside a WHERE clause
SELECT product_name, retail_price 
FROM products 
WHERE CalculateItemTax(retail_price, category) > 20.00;
```

---

### Security Requirement: log_bin_trust_function_creators

If binary logging is enabled on your MySQL server, creating functions requires declaring their deterministic nature. If you encounter:
`ERROR 1418 (HY000): This function has none of DETERMINISTIC, NO SQL, or READS SQL DATA in its declaration and binary logging is enabled`

You can resolve this either by declaring `DETERMINISTIC` or toggling:
```sql
SET GLOBAL log_bin_trust_function_creators = 1;
```

---

# Multiple Choice Questions

### 1. How does a Stored Function fundamentally differ from a Stored Procedure in MySQL?
A. Functions can only be created by root
B. Functions must return exactly one scalar value and can be embedded directly within SQL expressions
C. Functions run on client machines
D. Procedures cannot access tables
**Answer:** B
**Explanation:** Stored functions always return a single scalar value via the RETURN statement and can be used inside SELECT, WHERE, and other SQL clauses.
---

### 2. Which keyword specifies the return data type in a stored function signature?
A. RETURN TYPE
B. RETURNS
C. OUTPUT
D. AS TYPE
**Answer:** B
**Explanation:** The RETURNS keyword in the function signature declares the output datatype (e.g., RETURNS DECIMAL(10,2)).
---

### 3. Which statement is used inside the function body to output the calculated result?
A. OUTPUT
B. YIELD
C. RETURN
D. SEND
**Answer:** C
**Explanation:** The RETURN expression; statement exits the function and passes the calculated scalar back to the caller.
---

### 4. How is a stored function called in SQL?
A. CALL function_name()
B. Directly inline in an expression (e.g., SELECT function_name())
C. EXEC function_name()
D. RUN function_name()
**Answer:** B
**Explanation:** Functions are invoked directly inline as part of expressions, just like built-in functions such as ROUND() or UPPER().
---

### 5. Why does MySQL require function authors to specify DETERMINISTIC or READS SQL DATA when binary logging is active?
A. To measure memory consumption
B. To ensure safe, predictable replication across replica servers
C. To prevent SQL injection
D. To disable indexes
**Answer:** B
**Explanation:** Declaring determinism guarantees that functions produce identical outputs on replica servers, preventing replication drift in binlogs.
---
