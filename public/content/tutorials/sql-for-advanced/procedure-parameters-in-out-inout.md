---
id: procedure-parameters-in-out-inout
slug: procedure-parameters-in-out-inout
course: sql-for-advanced
chapter: Stored Procedures Masterclass
topic: "Procedure Parameters: IN, OUT, and INOUT"
difficulty: Advanced
readingTime: 14
order: 15
keywords: ["procedure parameters","in parameter","out parameter","inout parameter","session variables"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Procedure Parameters: IN, OUT, and INOUT
Stored procedures become truly versatile when they accept inputs and return calculated outputs dynamically. MySQL procedures support three parameter modes: **`IN`**, **`OUT`**, and **`INOUT`**.

---

### The Three Parameter Modes Explained

1. **`IN` (Default):** Pass-by-value input parameter. The procedure receives a copy of the caller's value. The procedure can modify the variable locally, but changes are **not visible** to the caller outside the procedure.
2. **`OUT`:** Pass-by-reference output parameter. The procedure initializes the parameter to `NULL` and assigns a value to it that is passed back to the caller upon completion.
3. **`INOUT`:** Dual-purpose parameter. The caller provides an initial input value, and the procedure can inspect, modify, and pass the updated value back to the caller.

---

### Syntax Specification

```sql
CREATE PROCEDURE proc_name(
    [IN | OUT | INOUT] param1_name datatype,
    [IN | OUT | INOUT] param2_name datatype
)
```

---

### Comprehensive Example Demonstrating All Three Modes

Let's build an order fulfillment procedure that takes an `IN` order ID, computes an `OUT` total price, and updates an `INOUT` customer reward points balance:

```sql
DELIMITER //

CREATE PROCEDURE ProcessOrderReward(
    IN  p_order_id INT,               -- Input order to evaluate
    OUT p_total_amount DECIMAL(10,2), -- Output total computed
    INOUT p_reward_points INT         -- Points input and updated!
)
BEGIN
    -- 1. Retrieve order total into the OUT parameter
    SELECT total_amount 
    INTO p_total_amount
    FROM orders
    WHERE order_id = p_order_id;

    -- 2. Award 1 point for every $10 spent, adding to existing points
    SET p_reward_points = p_reward_points + FLOOR(p_total_amount / 10);
END //

DELIMITER ;
```

---

### Calling Procedures with Session Variables

To receive values from `OUT` and `INOUT` parameters, pass MySQL **session user variables** (prefixed with `@`):

```sql
-- 1. Initialize user variable for INOUT parameter
SET @current_points = 50;

-- 2. Call procedure passing literal for IN, and @variables for OUT and INOUT
CALL ProcessOrderReward(1001, @calculated_total, @current_points);

-- 3. Inspect returned output values
SELECT 
    @calculated_total AS final_order_total,
    @current_points AS updated_points_balance;
```

#### Execution Result:
If order 1001 had `total_amount = 250.00`:
- `@calculated_total` is populated with **`250.00`**.
- `@current_points` increases from 50 by `FLOOR(250 / 10) = 25`, yielding **`75`**!

---

# Multiple Choice Questions

### 1. What is the default mode for a stored procedure parameter if neither IN, OUT, nor INOUT is specified?
A. OUT
B. IN
C. INOUT
D. GLOBAL
**Answer:** B
**Explanation:** If omitted, MySQL defaults the parameter mode to IN (read-only input).
---

### 2. What initial value does an OUT parameter hold when the procedure execution begins?
A. 0
B. An empty string
C. NULL
D. The previous caller value
**Answer:** C
**Explanation:** An OUT parameter is initialized to NULL inside the procedure; any prior value held by the caller variable is ignored until assigned by the procedure.
---

### 3. Which parameter mode allows a variable to be passed in with an initial value, modified inside the routine, and returned with the new value?
A. IN
B. OUT
C. INOUT
D. STATIC
**Answer:** C
**Explanation:** INOUT parameters serve as both input and output conduits for variable values.
---

### 4. How are MySQL session user variables denoted when passed to receive OUT values?
A. Prefix with $ ($variable)
B. Prefix with @ (@variable)
C. Enclosed in brackets ([variable])
D. Suffix with _var (variable_var)
**Answer:** B
**Explanation:** MySQL session user variables are prefixed with the @ symbol (e.g., @my_result).
---

### 5. Can an IN parameter be modified inside the procedure to change the caller's outer variable?
A. Yes, it updates the caller variable immediately
B. No, modifications to an IN parameter are strictly local to the procedure execution
C. Yes, if autocommit is enabled
D. Only if the parameter is an integer
**Answer:** B
**Explanation:** IN parameters are passed by value; modifying them inside the routine does not alter the variable in the caller's scope.
---
