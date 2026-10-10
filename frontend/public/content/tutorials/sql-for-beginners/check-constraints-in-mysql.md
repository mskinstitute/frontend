---
id: check-constraints-in-mysql
slug: check-constraints-in-mysql
course: sql-for-beginners
chapter: Data Integrity & Table Constraints
topic: "CHECK Constraints: Enforcing Custom Business Logic"
difficulty: Beginner
readingTime: 12
order: 26
keywords: ["check constraint","mysql 8.0 check","business rules validation","data validation","table constraints"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# CHECK Constraints: Enforcing Custom Business Logic
Data types ensure that numbers are stored in numeric columns and dates are stored in temporal columns. However, data types cannot enforce business rules such as: *"Employee salary must be greater than ₹10,000"*, *"Product discount percentage must be between 0 and 100"*, or *"End date must be after Start date"*. To validate these business rules directly inside the database engine, you use **`CHECK` Constraints**.

---

## 1. What is a CHECK Constraint?

A **`CHECK` constraint** specifies a boolean expression that must evaluate to `TRUE` (or `UNKNOWN`) for every inserted or updated row. If a statement causes the condition to evaluate to `FALSE`, MySQL rejects the operation with error **3819: Check constraint is violated**.

> [!IMPORTANT]
> **MySQL Version Note:** Older versions of MySQL (MySQL 5.7 and earlier) parsed `CHECK` constraints syntactically but **silently ignored them**! Active enforcement of `CHECK` constraints was officially implemented in **MySQL 8.0.16**.

---

## 2. Defining CHECK Constraints in SQL

```sql
CREATE TABLE product_discounts (
    discount_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Constraint 1: Base price must be strictly positive
    CONSTRAINT chk_positive_price CHECK (base_price > 0),
    
    -- Constraint 2: Discount must be between 0% and 100%
    CONSTRAINT chk_discount_range CHECK (discount_percentage >= 0.00 AND discount_percentage <= 100.00),
    
    -- Constraint 3: Multi-column validation (End date must be after Start date)
    CONSTRAINT chk_valid_date_range CHECK (end_date >= start_date)
);
```

---

## 3. Testing Violation Errors

Let us test our constraint by attempting to insert an illegal discount:

```sql
-- Attempting to insert a negative price and a 150% discount:
INSERT INTO product_discounts (product_name, base_price, discount_percentage, start_date, end_date)
VALUES ('Gaming Mouse', -500.00, 150.00, '2026-03-01', '2026-03-10');
```

### MySQL Server Response:
```text
ERROR 3819 (HY000): Check constraint 'chk_positive_price' is violated.
```
The database rejected the bad data at the door, safeguarding your application against corrupted records!

---

## 4. Complex Expressions with CHECK

You can use standard SQL operators, boolean logic, and scalar functions within `CHECK` expressions:

```sql
CREATE TABLE staff_members (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    
    -- Check age requirement (At least 18 years old):
    CONSTRAINT chk_minimum_age CHECK (age >= 18),
    
    -- Check email format contains '@' and '.':
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%')
);
```

---

## 5. Adding and Dropping CHECK Constraints

```sql
-- Add CHECK constraint to existing table:
ALTER TABLE staff_members
ADD CONSTRAINT chk_staff_age_cap CHECK (age <= 70);

-- Drop a CHECK constraint in MySQL 8.0+:
ALTER TABLE staff_members
DROP CHECK chk_staff_age_cap;
```

---

## 6. Best Practices & Common Pitfalls

- **Do Not Rely Exclusively on Application-Level Validation:** Application code can have bugs, and backend APIs can be bypassed via direct database migrations or CSV imports. Enforcing constraints in the database ensures 100% data integrity regardless of where the data originates.
- **Handling NULL in CHECK Constraints:** In SQL, if a `CHECK` expression evaluates to `UNKNOWN` (due to a `NULL` column), MySQL **considers the check satisfied** and allows the insert! If a value must not be `NULL`, always pair your `CHECK` constraint with an explicit `NOT NULL` declaration.

---

# Multiple Choice Questions

### 1. Starting with which version did MySQL begin actively enforcing `CHECK` constraints?
A. MySQL 5.5
B. MySQL 5.7
C. MySQL 8.0.16
D. MySQL 9.0
**Answer:** C
**Explanation:** While previous versions accepted `CHECK` syntactically without enforcing it, MySQL 8.0.16 introduced full runtime enforcement.
---

### 2. What happens when a user attempts to insert a record that causes a `CHECK` constraint expression to evaluate to FALSE?
A. The value is converted to NULL
B. MySQL halts the statement and throws error 3819 (Check constraint is violated)
C. The row is inserted into a temporary warning log
D. The server shuts down
**Answer:** B
**Explanation:** If a `CHECK` constraint condition evaluates to `FALSE`, MySQL aborts the operation and returns a constraint violation error.
---

### 3. Which `CHECK` constraint syntax validates that an `end_date` column is strictly on or after a `start_date` column?
A. CHECK (end_date AFTER start_date)
B. CONSTRAINT chk_dates CHECK (end_date >= start_date)
C. VALIDATE (end_date - start_date > 0)
D. DATE_CHECK (start_date TO end_date)
**Answer:** B
**Explanation:** `CONSTRAINT chk_dates CHECK (end_date >= start_date)` is standard SQL syntax validating multi-column date consistency.
---

### 4. How does a `CHECK` constraint behave if the expression evaluates to `UNKNOWN` due to a `NULL` value?
A. It throws a violation error
B. It permits the insert because SQL check constraints only reject rows when the condition evaluates strictly to FALSE
C. It rolls back the entire database
D. It deletes the column
**Answer:** B
**Explanation:** In SQL logic, a `CHECK` constraint passes if the expression evaluates to `TRUE` or `UNKNOWN`; it fails only if it evaluates strictly to `FALSE`.
---

### 5. How do you remove a check constraint named `chk_salary` from a table named `employees` in MySQL 8.0+?
A. ALTER TABLE employees DROP CHECK chk_salary;
B. ALTER TABLE employees REMOVE CONSTRAINT chk_salary;
C. DELETE CHECK chk_salary FROM employees;
D. DROP chk_salary;
**Answer:** A
**Explanation:** The statement `ALTER TABLE table_name DROP CHECK constraint_name;` removes an existing check constraint in MySQL 8.0+.
---
