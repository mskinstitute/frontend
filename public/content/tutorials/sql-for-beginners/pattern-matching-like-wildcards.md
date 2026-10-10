---
id: pattern-matching-like-wildcards
slug: pattern-matching-like-wildcards
course: sql-for-beginners
chapter: Advanced Filtering & Searching
topic: "Pattern Matching with LIKE & Wildcards: Text Search Mechanics"
difficulty: Beginner
readingTime: 12
order: 37
keywords: ["like operator","wildcards","percent wildcard","underscore wildcard","text searching","escape character"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Pattern Matching with LIKE & Wildcards: Text Search Mechanics
Exact equality matches (`WHERE username = 'amit'`) work when you know the complete, precise string. However, real-world user interfaces require partial searching: finding all customers whose last name starts with *"Sha"*, looking up emails ending with *"@gmail.com"*, or searching for products containing the word *"Wireless"*. In SQL, basic pattern matching is accomplished using the **`LIKE`** operator and **wildcard characters**.

---

## 1. The Two Fundamental SQL Wildcards

| Wildcard Symbol | Meaning | Example Pattern | Matches | Does NOT Match |
| :--- | :--- | :--- | :--- | :--- |
| **`%`** (Percent) | Matches **zero, one, or multiple** characters. | `'A%'` | `'A'`, `'Amit'`, `'Ananya'` | `'Rohan'` |
| **`_`** (Underscore) | Matches **exactly one** single character. | `'R_m'` | `'Ram'`, `'Rom'`, `'R-m'` | `'Rohan'`, `'Rm'` |

---

## 2. Common Pattern Matching Recipes

```sql
-- 1. Starts With: Find all names starting with 'S'
SELECT full_name FROM customers WHERE full_name LIKE 'S%';

-- 2. Ends With: Find all corporate emails ending with '@company.com'
SELECT email FROM employees WHERE email LIKE '%@company.com';

-- 3. Contains (Substring): Find all products with 'Bluetooth' anywhere in the title
SELECT product_name FROM products WHERE product_name LIKE '%Bluetooth%';

-- 4. Exact Length & Position: Find 5-character postal codes starting with '400'
SELECT postal_code FROM addresses WHERE postal_code LIKE '400__';

-- 5. Specific Character Position: Second letter is 'a'
SELECT full_name FROM students WHERE full_name LIKE '_a%';
```

---

## 3. Escaping Wildcard Characters (`ESCAPE`)

What if you need to search for an actual literal percent sign (**`%`**) or underscore (**`_`**) stored in the database (e.g., finding a discount code named `'SALE_50%'`)?

In MySQL, the backslash (`\`) serves as the default escape character:

```sql
-- Search for literal discount string '50%':
SELECT * FROM promotions WHERE promo_code LIKE '%50\%%';

-- Search for literal underscore 'user_test':
SELECT * FROM accounts WHERE username LIKE '%user\_test%';

-- Custom Escape Character using ESCAPE clause:
SELECT * FROM promotions WHERE promo_code LIKE '%50!%%' ESCAPE '!';
```

---

## 4. The Performance Reality: Index Utilization with `LIKE`

How does the MySQL query optimizer handle B-Tree indexes when evaluating `LIKE` queries?

```
   LIKE 'Sharma%'   =======> CAN USE B-TREE INDEX! (Index Range Scan)
                             Fast because prefix is known.

   LIKE '%Sharma'   =======> CANNOT USE B-TREE INDEX! (Full Table Scan)
                             Slow because index cannot be traversed backwards.

   LIKE '%Sharma%'  =======> CANNOT USE B-TREE INDEX! (Full Table Scan)
                             Slowest! Must scan every single row on disk.
```

> [!TIP]
> For large-scale substring searching across millions of text records (e.g., searching full product catalogs or blog articles), standard `LIKE '%word%'` is too slow. Use MySQL's **Full-Text Search (`MATCH ... AGAINST`)** or external search engines like Elasticsearch!

---

## 5. Case Sensitivity in `LIKE`

In MySQL, whether `LIKE` is case-sensitive depends entirely on the **collation** of the column:
- With the default collation (`utf8mb4_0900_ai_ci`), `LIKE 'amit%'` matches `'Amit'`, `'AMIT'`, and `'amit'`.
- To force a **case-sensitive** pattern match, prefix the expression with the **`BINARY`** operator:
  ```sql
  SELECT * FROM users WHERE BINARY username LIKE 'Admin%';
  ```

---

## 6. Best Practices & Common Pitfalls

- **Avoid Leading Wildcards on High-Traffic Queries:** A query like `WHERE email LIKE '%@gmail.com'` on a 50-million-row table will bypass your index, scanning every row and pegging CPU utilization at 100%.
- **Inverting with NOT LIKE:** You can invert matches using `NOT LIKE` (e.g., `WHERE email NOT LIKE '%@spam.com'`).

---

# Multiple Choice Questions

### 1. Which wildcard character matches zero, one, or multiple characters in a SQL `LIKE` expression?
A. Underscore (_)
B. Percent (%)
C. Asterisk (*)
D. Question mark (?)
**Answer:** B
**Explanation:** The percent sign (`%`) represents any string of zero or more characters in SQL pattern matching.
---

### 2. Which wildcard character matches exactly one single character in a SQL `LIKE` expression?
A. Percent (%)
B. Underscore (_)
C. Dot (.)
D. Hash (#)
**Answer:** B
**Explanation:** The underscore (`_`) matches exactly one single character.
---

### 3. Which of the following `LIKE` patterns CAN utilize a standard B-Tree index to perform a fast index range scan?
A. LIKE '%Technology'
B. LIKE '%Technology%'
C. LIKE 'Technology%'
D. LIKE '_Technology'
**Answer:** C
**Explanation:** Only leading-prefix patterns (where the start of the string is fixed, e.g. `'Technology%'`) can traverse a B-Tree index; leading wildcards force a full table scan.
---

### 4. How do you search for a product code that contains an actual literal underscore (`'PROMO_'`) in MySQL?
A. LIKE 'PROMO_'
B. LIKE 'PROMO\_%'
C. LIKE 'PROMO[underscore]%'
D. LIKE 'PROMO-*'
**Answer:** B
**Explanation:** In MySQL, escaping the underscore with a backslash (`\_`) treats it as a literal character rather than the single-character wildcard.
---

### 5. What will the pattern `LIKE '_r%'` match?
A. Any string starting with the letter 'r'
B. Any string where the second character is 'r'
C. Any string ending with 'r'
D. Any string containing exactly two characters
**Answer:** B
**Explanation:** The leading underscore (`_`) matches any first character, followed immediately by `r` as the second character, followed by any remaining characters (`%`).
---
