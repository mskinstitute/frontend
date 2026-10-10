---
id: simple-case-expression
slug: simple-case-expression
course: sql-for-intermediate
chapter: Conditional Logic & Expressions
topic: "Simple CASE Expression Syntax & Value Mapping"
difficulty: Intermediate
readingTime: 12
order: 18
keywords: ["simple case","case expression","switch case in sql","value mapping","conditional formatting"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Simple CASE Expression Syntax & Value Mapping
In programming languages like C, Java, or JavaScript, developers use `switch-case` statements to compare a single variable against discrete constant values. In SQL, this exact control flow mechanism is implemented using the **Simple CASE Expression**. 

It provides clean, readable value mapping directly inside `SELECT`, `UPDATE`, and `ORDER BY` statements.

---

## 1. Syntax of the Simple CASE Expression

```sql
CASE expression_to_evaluate
    WHEN value_1 THEN result_1
    WHEN value_2 THEN result_2
    WHEN value_3 THEN result_3
    [ELSE fallback_result]
END
```

### How it Operates:
- The `expression_to_evaluate` is evaluated once.
- It is compared sequentially for **equality (`=`)** against each `WHEN` value.
- As soon as a match is found, the corresponding `THEN` result is returned, and evaluation terminates.
- If no match is found, the **`ELSE`** result is returned.
- If no match is found and **`ELSE` is omitted**, MySQL returns **`NULL`**!

---

## 2. Practical Production Example: Status Code Translation

Database schemas frequently store compact single-character or integer codes to save storage space (e.g., `'P'`, `'S'`, `'D'`, `'C'`). When generating reports or returning API payloads, you translate these codes into user-friendly strings:

```sql
SELECT 
    order_id,
    order_date,
    total_amount,
    status_code,
    CASE status_code
        WHEN 'P' THEN 'Pending Payment'
        WHEN 'S' THEN 'Shipped'
        WHEN 'D' THEN 'Delivered to Customer'
        WHEN 'C' THEN 'Cancelled by Merchant'
        ELSE 'Unknown Status'
    END AS readable_status
FROM customer_orders;
```

---

## 3. Using Simple CASE in `UPDATE` Statements

You can update multiple distinct records to different values in a single atomic statement:

```sql
-- Update department location codes in a single query:
UPDATE departments
SET office_building = CASE department_code
    WHEN 'ENG' THEN 'Building A - Tech Park'
    WHEN 'HR'  THEN 'Building B - Corporate Tower'
    WHEN 'MKT' THEN 'Building C - Creative Center'
    ELSE office_building -- Keep existing building if not matched!
END;
```

---

## 4. Custom Ordering in `ORDER BY` with CASE

When you need to sort records according to a custom business hierarchy:

```sql
SELECT employee_id, full_name, role_title
FROM employees
ORDER BY 
    CASE role_title
        WHEN 'Chief Executive Officer' THEN 1
        WHEN 'Vice President'         THEN 2
        WHEN 'Senior Architect'        THEN 3
        WHEN 'Software Engineer'       THEN 4
        ELSE 5
    END ASC,
    full_name ASC;
```

---

## 5. Limitations of the Simple CASE Expression

> [!WARNING]
> The Simple CASE expression **only performs exact equality (`=`) comparisons**!
> 
> You **cannot** use inequality operators (`>`, `<`), range checks (`BETWEEN`), pattern matching (`LIKE`), or null checks (`IS NULL`) in a Simple CASE statement! For complex conditions, you must use the **Searched CASE Expression**.

---

## 6. Best Practices & Common Pitfalls

- **Always Include an `ELSE` Clause:** Omitting `ELSE` defaults unmatched cases to `NULL`, which can cause unexpected null pointer bugs in frontend applications.
- **Ensure Data Type Consistency:** All `THEN` and `ELSE` result expressions should return the same data type (or types that MySQL can implicitly coerce). Mixing integers and dates can yield strange string conversions.

---

# Multiple Choice Questions

### 1. How does a Simple CASE expression evaluate conditions?
A. It checks complex boolean expressions using AND/OR
B. It performs sequential equality (=) checks between a single target expression and each WHEN value
C. It sorts rows in descending order
D. It deletes unmatched rows
**Answer:** B
**Explanation:** A Simple CASE compares a single expression against discrete values using strict equality testing, functioning like a switch-case statement.
---

### 2. What is returned if no WHEN condition matches and no ELSE clause is provided in a CASE expression?
A. Zero (0)
B. An empty string ""
C. NULL
D. Error 1064
**Answer:** C
**Explanation:** In standard SQL, if no `WHEN` branch matches and the `ELSE` clause is omitted, the `CASE` expression evaluates to `NULL`.
---

### 3. Can a Simple CASE expression test whether a column `IS NULL`?
A. Yes, using WHEN NULL THEN ...
B. No, because Simple CASE evaluates equality using '=', and 'col = NULL' always evaluates to UNKNOWN
C. Only in MySQL 8.0
D. Only with numbers
**Answer:** B
**Explanation:** Because Simple CASE uses the `=` operator under the hood, comparing against `NULL` produces `UNKNOWN`, meaning `WHEN NULL` will never trigger.
---

### 4. Which keyword is required to conclude every `CASE` statement in SQL?
A. END CASE
B. END
C. STOP
D. DONE
**Answer:** B
**Explanation:** In SQL syntax, every `CASE` block must terminate with the keyword `END`.
---

### 5. Why is using `CASE` inside an `UPDATE` statement advantageous when updating multiple rows with different values?
A. It executes the changes atomically in a single statement, reducing database round-trips and transaction lock durations
B. It encrypts the data
C. It restarts the MySQL server
D. It turns off safe updates
**Answer:** A
**Explanation:** A single `UPDATE` with `CASE` modifies multiple distinct records in one atomic pass, replacing multiple separate update queries and reducing network and locking overhead.
---
