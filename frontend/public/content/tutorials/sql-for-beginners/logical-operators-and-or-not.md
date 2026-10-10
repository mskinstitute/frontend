---
id: logical-operators-and-or-not
slug: logical-operators-and-or-not
course: sql-for-beginners
chapter: Data Querying Basics (DQL)
topic: "Logical Operators: Combining Predicates with AND, OR, and NOT"
difficulty: Beginner
readingTime: 12
order: 34
keywords: ["logical operators","and operator","or operator","not operator","operator precedence","boolean logic in sql"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Logical Operators: Combining Predicates with AND, OR, and NOT
Real-world queries rarely filter by a single attribute. You will often need to retrieve records meeting multiple simultaneous criteria (e.g., *"Orders placed in Maharashtra AND total > ₹5,000 AND NOT refunded"*). Combining multiple conditions is accomplished using the SQL **Logical Operators**: **`AND`**, **`OR`**, and **`NOT`**.

---

## 1. The `AND` Operator

The **`AND`** operator returns `TRUE` only if **both** conditions on either side evaluate to `TRUE`:

```sql
-- Find active employees earning more than ₹60,000 in Engineering:
SELECT employee_id, full_name, salary, department
FROM employees
WHERE department = 'Engineering' 
  AND salary > 60000.00 
  AND is_active = TRUE;
```

---

## 2. The `OR` Operator

The **`OR`** operator returns `TRUE` if **at least one** of the conditions evaluates to `TRUE`:

```sql
-- Find customers located in Delhi OR Mumbai:
SELECT customer_id, full_name, city
FROM customers
WHERE city = 'Delhi' OR city = 'Mumbai';
```

---

## 3. The `NOT` Operator

The **`NOT`** operator inverts the boolean truth value of a condition (turning `TRUE` into `FALSE` and `FALSE` into `TRUE`):

```sql
-- Find all products that are NOT discontinued:
SELECT product_id, product_name
FROM products
WHERE NOT is_discontinued;

-- Find customers who do NOT live in Bangalore:
SELECT customer_id, full_name, city
FROM customers
WHERE NOT (city = 'Bangalore');
```

---

## 4. Operator Precedence: The Parentheses Trap!

In SQL, logical operators do not evaluate simply from left to right. They adhere to strict **Operator Precedence**:

```
   Operator Precedence (Highest to Lowest):
   1. Parentheses: ( ... )
   2. Comparison Operators: =, <>, <, >, <=, >=
   3. NOT
   4. AND  <-- Evaluated BEFORE OR!
   5. OR   <-- Evaluated LAST!
```

### The Disaster Scenario:
Suppose your manager asks: *"List all customers from Delhi or Mumbai who have a balance over ₹50,000."*

```sql
-- WRONG (Logical Bug due to AND precedence!):
SELECT * FROM customers
WHERE city = 'Delhi' OR city = 'Mumbai' AND account_balance > 50000;
```

### Why this query fails:
Because `AND` has higher precedence than `OR`, MySQL interprets this as:
*"Give me anyone from Mumbai with balance > ₹50,000 ... OR ANYONE AT ALL FROM DELHI REGARDLESS OF THEIR BALANCE!"*

### The Correct Query (Always Use Parentheses!):
```sql
SELECT * FROM customers
WHERE (city = 'Delhi' OR city = 'Mumbai') 
  AND account_balance > 50000;
```

---

## 5. Truth Table with SQL Three-Valued Logic

| Condition A | Condition B | A AND B | A OR B | NOT A |
| :--- | :--- | :--- | :--- | :--- |
| **TRUE** | **TRUE** | TRUE | TRUE | FALSE |
| **TRUE** | **FALSE** | FALSE | TRUE | FALSE |
| **TRUE** | **UNKNOWN** | UNKNOWN | TRUE | FALSE |
| **FALSE** | **UNKNOWN** | FALSE | UNKNOWN | TRUE |
| **UNKNOWN** | **UNKNOWN** | UNKNOWN | UNKNOWN | UNKNOWN |

---

## 6. Best Practices & Common Pitfalls

- **Always Use Explicit Parentheses:** Never rely on default operator precedence when mixing `AND` and `OR` in the same query. Enclosing sub-conditions in parentheses clarifies your intent to other developers and prevents catastrophic filtering bugs.
- **Index Considerations with `OR`:** Queries using `OR` across multiple unindexed columns often force MySQL to perform a full table scan because standard B-Trees cannot easily satisfy split `OR` conditions in a single index pass. Prefer using `UNION` or `IN` where applicable.

---

# Multiple Choice Questions

### 1. Which logical operator has higher evaluation precedence in standard SQL?
A. OR
B. AND
C. XOR
D. Both have identical precedence and evaluate left-to-right
**Answer:** B
**Explanation:** In SQL operator precedence, `AND` takes precedence over `OR` and is evaluated first unless overridden by parentheses.
---

### 2. In the expression `WHERE city = 'Pune' OR city = 'Goa' AND status = 'VIP'`, how does the database engine evaluate the logic?
A. (city = 'Pune' OR city = 'Goa') AND status = 'VIP'
B. city = 'Pune' OR (city = 'Goa' AND status = 'VIP')
C. It evaluates from right to left
D. It throws a syntax error
**Answer:** B
**Explanation:** Because `AND` has higher precedence than `OR`, MySQL binds `city = 'Goa' AND status = 'VIP'` together first before applying the `OR`.
---

### 3. What is the result of `TRUE OR UNKNOWN` according to SQL three-valued logic?
A. UNKNOWN
B. FALSE
C. TRUE
D. NULL
**Answer:** C
**Explanation:** In boolean OR logic, if at least one operand is known to be `TRUE`, the overall expression resolves to `TRUE` regardless of the other operand's value.
---

### 4. Which operator inverts the truth value of a condition?
A. REVERSE
B. NOT
C. INVERT
D. NEGATE
**Answer:** B
**Explanation:** The `NOT` operator negates a boolean condition, switching TRUE to FALSE and vice versa.
---

### 5. Why should parentheses always be used when combining `AND` and `OR` clauses?
A. To make queries run 50% faster
B. To explicitly enforce the intended grouping and prevent subtle bugs caused by default operator precedence
C. Because MySQL throws an error if parentheses are omitted
D. To prevent tables from locking
**Answer:** B
**Explanation:** Parentheses explicitly dictate evaluation order, guaranteeing that complex boolean logic is executed exactly as intended and keeping code readable.
---
