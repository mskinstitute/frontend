---
id: creating-stored-procedures
slug: creating-stored-procedures
course: sql-for-advanced
chapter: Stored Procedures Masterclass
topic: "Defining Stored Procedures (DELIMITER //, CREATE PROCEDURE)"
difficulty: Advanced
readingTime: 14
order: 14
keywords: ["stored procedures","delimiter","create procedure","call statement","stored routines"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Defining Stored Procedures (DELIMITER //, CREATE PROCEDURE)
A **Stored Procedure** is a compiled collection of one or more SQL statements and procedural logic stored directly in the database catalog. Instead of sending lengthy SQL text from client applications over the network, the client simply invokes the procedure by name using the **`CALL`** statement.

Stored procedures reduce network overhead, centralize business logic, and enforce strict security boundaries.

---

### The Role of the DELIMITER Command

In standard SQL execution, the semicolon (`;`) tells MySQL to execute the preceding statement immediately. However, stored procedure bodies contain internal statements that also terminate with semicolons.

To prevent the MySQL CLI from executing prematurely when encountering the first internal semicolon, you must temporarily change the statement delimiter using the **`DELIMITER`** command:

```sql
-- 1. Change delimiter from ; to //
DELIMITER //

-- 2. Define the procedure body containing internal semicolons
CREATE PROCEDURE procedure_name()
BEGIN
    SELECT 'First query' AS msg;
    SELECT 'Second query' AS msg;
END //

-- 3. Restore original delimiter
DELIMITER ;
```

---

### Creating Your First Stored Procedure

Let's construct a procedure to generate a quarterly sales summary:

```sql
DELIMITER $$

CREATE PROCEDURE GetQuarterlySalesSummary()
BEGIN
    -- Declare local procedure variables
    DECLARE total_rev DECIMAL(15, 2);
    DECLARE total_orders INT;

    -- Compute aggregated revenue
    SELECT 
        COALESCE(SUM(total_amount), 0.00),
        COUNT(order_id)
    INTO total_rev, total_orders
    FROM orders
    WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY);

    -- Output final result set
    SELECT 
        total_rev AS last_90_days_revenue,
        total_orders AS total_orders_placed,
        ROUND(total_rev / NULLIF(total_orders, 0), 2) AS avg_order_value;
END $$

DELIMITER ;
```

---

### Executing and Managing Stored Procedures

```sql
-- Execute procedure
CALL GetQuarterlySalesSummary();

-- Inspect stored procedure DDL code
SHOW CREATE PROCEDURE GetQuarterlySalesSummary;

-- View procedure metadata in system catalog
SELECT routine_name, routine_type, created, last_altered 
FROM information_schema.routines 
WHERE routine_schema = 'my_database';

-- Safely drop a stored procedure
DROP PROCEDURE IF EXISTS GetQuarterlySalesSummary;
```

---

# Multiple Choice Questions

### 1. Why is the DELIMITER command required when defining stored procedures in MySQL?
A. To encrypt procedure code
B. To temporarily reassign the statement terminator so internal semicolons inside the BEGIN...END block do not trigger premature execution
C. To allocate memory in the buffer pool
D. To convert queries to lower case
**Answer:** B
**Explanation:** DELIMITER changes the default semicolon delimiter to a custom symbol (like // or $$), allowing semicolons inside the procedure body to be parsed as part of the routine.
---

### 2. Which SQL statement is used to execute an existing stored procedure?
A. EXECUTE
B. RUN
C. CALL
D. INVOKE
**Answer:** C
**Explanation:** In MySQL, stored procedures are executed using the CALL procedure_name() syntax.
---

### 3. Where are stored procedure definitions stored within MySQL?
A. In flat files under the /tmp directory
B. In the data dictionary and information_schema.routines catalog
C. In the client browser cache
D. Inside the binlog only
**Answer:** B
**Explanation:** Procedures are persistent database objects stored in the MySQL system catalog and accessible via information_schema.routines.
---

### 4. Which block structure encapsulates the executable statements of a stored procedure?
A. START ... FINISH
B. BEGIN ... END
C. OPEN ... CLOSE
D. DO ... WHILE
**Answer:** B
**Explanation:** The procedural statements inside a stored procedure are enclosed within the BEGIN ... END block.
---

### 5. What statement is used to safely remove an obsolete stored procedure?
A. DELETE PROCEDURE p;
B. DROP PROCEDURE IF EXISTS p;
C. REMOVE PROCEDURE p;
D. TRUNCATE PROCEDURE p;
**Answer:** B
**Explanation:** DROP PROCEDURE [IF EXISTS] procedure_name removes the procedure from the database catalog.
---
