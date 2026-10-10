---
id: string-functions
slug: string-functions
course: sql-for-beginners
chapter: SQL Built-in Scalar Functions
topic: "SQL String Functions: Manipulation, Extraction, and Formatting"
difficulty: Beginner
readingTime: 12
order: 43
keywords: ["string functions","concat","substring","length vs char_length","upper and lower","trim","replace string"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# SQL String Functions: Manipulation, Extraction, and Formatting
Raw text stored in database tables is rarely in the exact display format required by end-user interfaces. Names need capitalizing, full names need stitching together from first and last names, email domains need extracting, and messy user input containing trailing spaces needs sanitizing. SQL provides a rich library of built-in **Scalar String Functions**.

---

## 1. String Concatenation: `CONCAT()` and `CONCAT_WS()`

In standard SQL (and unlike Python or JavaScript), you **cannot** use the plus operator (`+`) to concatenate strings (in MySQL, `'A' + 'B'` converts both to 0 and yields 0!). You must use concatenation functions:

### `CONCAT(str1, str2, ...)`
Joins strings together sequentially. **Crucial Rule:** If any argument is `NULL`, `CONCAT()` returns `NULL`!

```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM employees;
```

### `CONCAT_WS(separator, str1, str2, ...)` (Concatenate With Separator)
The first argument is the delimiter. Unlike `CONCAT()`, **`CONCAT_WS` skips NULL values automatically**!

```sql
-- Build full mailing address, skipping missing apartment numbers cleanly:
SELECT CONCAT_WS(', ', street_address, apartment_no, city, postal_code) AS formatted_address
FROM customer_addresses;
```

---

## 2. Case Conversion: `UPPER()` and `LOWER()`

```sql
SELECT 
    UPPER(full_name) AS loud_name,     -- 'AARAV SHARMA'
    LOWER(email) AS standardized_email -- 'aarav.sharma@example.com'
FROM customers;
```

---

## 3. String Length: `LENGTH()` vs `CHAR_LENGTH()`

Understanding the difference between byte length and character length is critical when dealing with multilingual Unicode text:

```sql
-- English ASCII:
SELECT LENGTH('MySQL'), CHAR_LENGTH('MySQL');
-- Result: Both return 5.

-- Multilingual Hindi / Emojis:
SELECT LENGTH('भारत'), CHAR_LENGTH('भारत');
-- Result: LENGTH = 12 bytes! CHAR_LENGTH = 4 characters!
```

- **`LENGTH(str)`:** Returns length in **bytes**.
- **`CHAR_LENGTH(str)`:** Returns length in **characters**. Always use `CHAR_LENGTH` when measuring text length for user validation!

---

## 4. Substring Extraction: `SUBSTRING()` / `SUBSTR()`

Extracts a slice of text starting at a specific position. **Note: SQL indexes strings starting at 1, NOT 0!**

```sql
-- Syntax: SUBSTRING(string, start_position, [length])

-- Extract first 3 characters (e.g. Area Code):
SELECT SUBSTRING(phone_number, 1, 3) FROM contacts;

-- Extract from position 5 to the end:
SELECT SUBSTRING('MSK-TECH-ACADEMY', 5); -- 'TECH-ACADEMY'

-- Extract domain from email using SUBSTRING and LOCATE/INSTR:
SELECT 
    email,
    SUBSTRING(email, INSTR(email, '@') + 1) AS email_domain
FROM users;
```

---

## 5. Cleaning Text: `TRIM()`, `LTRIM()`, and `RTRIM()`

Removes unwanted leading and trailing whitespace characters:

```sql
-- Sanitize user input:
SELECT TRIM('   clean text   ') AS cleaned; -- 'clean text'

-- Trim specific characters:
SELECT TRIM(BOTH '#' FROM '###Special Offer###'); -- 'Special Offer'
```

---

## 6. String Replacement: `REPLACE()`

Replaces all occurrences of a search string with a replacement string:

```sql
-- Update old domain references in stored URLs:
SELECT REPLACE('https://old-domain.com/page1', 'old-domain.com', 'mskinstitute.in') AS new_url;
```

---

# Multiple Choice Questions

### 1. In SQL string indexing (e.g., in the `SUBSTRING()` function), what is the index position of the first character?
A. 0
B. 1
C. -1
D. It depends on the storage engine
**Answer:** B
**Explanation:** Standard SQL uses 1-based indexing for strings; the first character in a string resides at position 1.
---

### 2. What does `CONCAT('Hello', NULL, 'World')` return in MySQL?
A. 'HelloWorld'
B. NULL
C. 'HelloNULLWorld'
D. Error 1064
**Answer:** B
**Explanation:** In standard `CONCAT()`, if any argument evaluates to `NULL`, the entire function returns `NULL`.
---

### 3. Which string concatenation function automatically uses a specified delimiter and skips any NULL arguments?
A. CONCAT_JOIN()
B. CONCAT_WS()
C. STRING_AGG()
D. DELIMIT_CONCAT()
**Answer:** B
**Explanation:** `CONCAT_WS(separator, ...)` ("Concatenate With Separator") uses the first parameter as a delimiter and ignores subsequent NULL values.
---

### 4. Which function measures the human-perceived count of characters rather than the physical byte count of a Unicode string?
A. LENGTH()
B. CHAR_LENGTH()
C. BYTE_COUNT()
D. SIZE()
**Answer:** B
**Explanation:** `CHAR_LENGTH()` counts the number of logical Unicode characters, whereas `LENGTH()` measures raw byte consumption.
---

### 5. What is the output of `SELECT SUBSTRING('DATABASE', 5, 4);`?
A. DATA
B. BASE
C. ATAB
D. ABAS
**Answer:** B
**Explanation:** Starting at position 5 ('B') and taking 4 characters yields 'BASE'.
---
