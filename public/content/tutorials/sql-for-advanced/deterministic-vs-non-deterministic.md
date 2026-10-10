---
id: deterministic-vs-non-deterministic
slug: deterministic-vs-non-deterministic
course: sql-for-advanced
chapter: Stored Functions & Cursors
topic: "Deterministic vs Non-Deterministic Functions"
difficulty: Advanced
readingTime: 13
order: 19
keywords: ["deterministic","non-deterministic","binary logging","replication safe","query optimization"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Deterministic vs Non-Deterministic Functions
When creating stored functions in MySQL, you are required to declare their behavioral characteristics: **`DETERMINISTIC`** or **`NOT DETERMINISTIC`**.

Declaring this correctly impacts both **Query Optimization** and **Replication Safety**.

---

### What is a Deterministic Function?

A function is **Deterministic** if it **always produces the exact same output given the exact same input parameters**, with zero side effects.

- *Mathematical Example:* $f(x, y) = x + y$. For inputs $(5, 3)$, the result is *always* $8$.
- *SQL Example:* Converting Fahrenheit to Celsius, calculating string hash values, formatting telephone numbers.

```sql
CREATE FUNCTION FahrenheitToCelsius(f_temp DOUBLE) 
RETURNS DOUBLE
DETERMINISTIC
NO SQL
BEGIN
    RETURN ROUND((f_temp - 32) * 5 / 9, 2);
END;
```

#### Optimization Advantage:
The query optimizer knows that for a constant input, the result never changes. It can evaluate the function once and cache the result for the duration of the query!

---

### What is a Non-Deterministic Function?

A function is **Non-Deterministic** if its output can change between consecutive calls even when supplied with the identical input parameters.

A function is inherently non-deterministic if it references:
- System time or dates (`NOW()`, `CURRENT_DATE()`, `UNIX_TIMESTAMP()`)
- Random number generators (`RAND()`)
- Dynamic database tables whose rows change over time (`SELECT balance FROM accounts`)
- System variables or connection IDs (`CONNECTION_ID()`, `USER()`)

```sql
CREATE FUNCTION CalculateAge(birthdate DATE) 
RETURNS INT
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN TIMESTAMPDIFF(YEAR, birthdate, CURRENT_DATE());
END;
```
Because `CURRENT_DATE()` changes as time elapses, this function is strictly `NOT DETERMINISTIC`.

---

### The Danger with Binary Logging & Replication

When MySQL replication is enabled (statement-based logging):
- If a function marked `DETERMINISTIC` actually uses `NOW()` or reads unstable data, the master and replica databases will execute the function at slightly different times, producing **divergent data** between master and slave nodes!
- Declaring characteristics honestly maintains cluster consistency.

---

### Additional Characteristic Clauses

| Clause | Meaning |
| :--- | :--- |
| **`DETERMINISTIC`** | Same inputs always return same output. |
| **`NOT DETERMINISTIC`** | Output may vary for same inputs. |
| **`CONTAINS SQL`** | Routine contains SQL statements but does not read or write data. |
| **`NO SQL`** | Routine contains no SQL statements (pure math/logic). |
| **`READS SQL DATA`** | Routine queries database tables using `SELECT`. |
| **`MODIFIES SQL DATA`**| Routine writes to tables via `INSERT`, `UPDATE`, or `DELETE`. |

---

# Multiple Choice Questions

### 1. What defines a DETERMINISTIC function in MySQL?
A. It executes in less than 1 second
B. Given identical input parameters, it is guaranteed to always produce the exact same output
C. It only runs once per server startup
D. It modifies table rows
**Answer:** B
**Explanation:** A deterministic function consistently returns the identical output whenever invoked with the same input arguments.
---

### 2. Which of the following functions is inherently NOT DETERMINISTIC?
A. A function calculating: price * 1.18
B. A function calculating: (celsius * 9/5) + 32
C. A function returning days elapsed between an input date and CURRENT_DATE()
D. A function converting a string to uppercase
**Answer:** C
**Explanation:** Referencing dynamic environmental variables like CURRENT_DATE() or NOW() causes outputs to change over time, making the routine non-deterministic.
---

### 3. What clause tells the optimizer that a function contains pure math and does not query database tables?
A. EMPTY SQL
B. NO SQL
C. ZERO_DATA
D. BYPASS TABLES
**Answer:** B
**Explanation:** The NO SQL characteristic declares that the function body does not execute queries against database tables.
---

### 4. Why does misdeclaring a non-deterministic function as DETERMINISTIC pose a severe risk in replicated environments?
A. The server crashes immediately
B. It can cause master and replica nodes to calculate different results, leading to silent replication data drift
C. The binlog runs out of memory
D. Passwords become visible
**Answer:** B
**Explanation:** Replicas executing statements containing non-deterministic logic marked as deterministic can compute divergent values, corrupting data integrity.
---

### 5. What is the default classification if neither DETERMINISTIC nor NOT DETERMINISTIC is specified?
A. DETERMINISTIC
B. NOT DETERMINISTIC
C. OPTIMIZED
D. STRICT
**Answer:** B
**Explanation:** MySQL defaults to NOT DETERMINISTIC for safety unless explicitly specified otherwise.
---
