---
id: control-flow-in-procedures
slug: control-flow-in-procedures
course: sql-for-advanced
chapter: Stored Procedures Masterclass
topic: "Control Flow: Variables, Branches & Loops"
difficulty: Advanced
readingTime: 14
order: 16
keywords: ["control flow","if then else","case statement","while loop","repeat until","declare variable"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Control Flow: Variables, Branches & Loops
SQL is natively a declarative set-based language. However, inside MySQL Stored Programs (procedures, functions, and triggers), you can write full imperative procedural logic using **Variables**, **Conditional Branches**, and **Iterative Loops**.

---

### 1. Declaring and Setting Local Variables

Local variables exist only within the `BEGIN ... END` block where they are declared.

```sql
-- Syntax: DECLARE var_name datatype [DEFAULT default_val];
DECLARE user_count INT DEFAULT 0;
DECLARE discount_rate DECIMAL(4, 2);

-- Assigning values with SET
SET discount_rate = 0.15;

-- Assigning values from query with SELECT ... INTO
SELECT COUNT(*) INTO user_count FROM users WHERE is_active = 1;
```

> **Rule:** All `DECLARE` statements must appear at the **very beginning** of the `BEGIN ... END` block before any operational SQL statements!

---

### 2. Conditional Branching: IF ... ELSEIF ... ELSE

```sql
DELIMITER //

CREATE PROCEDURE CheckCreditRisk(
    IN p_credit_score INT,
    OUT p_risk_category VARCHAR(20)
)
BEGIN
    IF p_credit_score >= 750 THEN
        SET p_risk_category = 'EXCELLENT';
    ELSEIF p_credit_score >= 650 THEN
        SET p_risk_category = 'MODERATE';
    ELSEIF p_credit_score >= 500 THEN
        SET p_risk_category = 'HIGH RISK';
    ELSE
        SET p_risk_category = 'REJECTED';
    END IF;
END //

DELIMITER ;
```

---

### 3. Iterative Loops in Stored Procedures

MySQL supports three primary loop constructs:

#### A. The WHILE Loop (Pre-Condition Check)
Evaluates the condition **before** entering the loop body:
```sql
DECLARE counter INT DEFAULT 1;

WHILE counter <= 5 DO
    INSERT INTO batch_log (run_step) VALUES (counter);
    SET counter = counter + 1;
END WHILE;
```

#### B. The REPEAT ... UNTIL Loop (Post-Condition Check)
Executes the loop body at least once, evaluating the condition **at the end**:
```sql
DECLARE counter INT DEFAULT 1;

REPEAT
    INSERT INTO batch_log (run_step) VALUES (counter);
    SET counter = counter + 1;
UNTIL counter > 5 END REPEAT;
```
*Note:* Do **not** put a semicolon after the `UNTIL condition`!

#### C. The LOOP with LEAVE (Break) and ITERATE (Continue)
```sql
DECLARE counter INT DEFAULT 0;

my_loop: LOOP
    SET counter = counter + 1;
    
    -- Equivalent to 'continue' in languages like C/Java
    IF counter = 3 THEN
        ITERATE my_loop;
    END IF;

    -- Equivalent to 'break'
    IF counter >= 5 THEN
        LEAVE my_loop;
    END IF;
    
    INSERT INTO batch_log (run_step) VALUES (counter);
END LOOP my_loop;
```

---

# Multiple Choice Questions

### 1. Where must DECLARE statements be positioned within a stored procedure BEGIN...END block?
A. Anywhere inside the block
B. At the very top before any executable SQL statements
C. At the very end before END
D. Inside the loop condition
**Answer:** B
**Explanation:** In MySQL stored programs, local variable declarations (DECLARE) must precede any cursor declarations, handlers, or operational statements.
---

### 2. How is an IF block properly closed in MySQL stored procedures?
A. FI
B. ENDIF
C. END IF;
D. STOP IF
**Answer:** C
**Explanation:** MySQL requires the explicit syntax END IF; to terminate an IF conditional block.
---

### 3. What is the key operational difference between WHILE and REPEAT loops?
A. WHILE evaluates condition at start; REPEAT evaluates condition at end (guaranteeing at least 1 execution)
B. REPEAT can only execute 10 times
C. WHILE loops cannot be nested
D. REPEAT only works with floating point numbers
**Answer:** A
**Explanation:** WHILE checks its predicate prior to execution, while REPEAT executes the body first and tests the UNTIL exit condition afterwards.
---

### 4. Which keyword serves as a "break" statement to exit a labeled LOOP construct?
A. BREAK
B. EXIT
C. LEAVE
D. TERMINATE
**Answer:** C
**Explanation:** The LEAVE label_name; statement breaks out of an active loop block.
---

### 5. What statement is used to assign the result of a single-row SELECT query into a local variable?
A. FETCH INTO
B. SELECT ... INTO
C. PULL TO
D. EXTRACT INTO
**Answer:** B
**Explanation:** SELECT col1, col2 INTO var1, var2 FROM ... populates local variables directly from query results.
---
