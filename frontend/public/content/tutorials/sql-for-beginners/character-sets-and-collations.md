---
id: character-sets-and-collations
slug: character-sets-and-collations
course: sql-for-beginners
chapter: Database Administration Basics (MySQL DDL)
topic: "Character Sets & Collations: Complete utf8mb4 Mastery"
difficulty: Beginner
readingTime: 12
order: 11
keywords: ["character sets","collations","utf8mb4","utf8mb4_unicode_ci","utf8mb4_0900_ai_ci","encoding","emojis in mysql"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Character Sets & Collations: Complete utf8mb4 Mastery
Have you ever saved a customer's Hindi name (*राजेश शर्मा*), a Spanish name (*Señor Müller*), or a smartphone emoji (🚀, 😊) into a database, only to see it stored as garbled question marks (**????**) or crashing your application with `Incorrect string value`? 

This error happens when you misunderstand **Character Sets** and **Collations**. In this tutorial, you will master international character encoding in MySQL.

---

## 1. What is a Character Set?

A **Character Set** is a defined mapping between a collection of human-readable symbols and their underlying binary byte representations.

```
   Character 'A' ---------> Binary: 01000001 (Decimal: 65)  [1 Byte]
   Character '₹' ---------> Binary: 11100010 10000010 10111001 [3 Bytes]
   Emoji '🚀' -----------> Binary: 11110000 10011111 10011000 10000000 [4 Bytes]
```

### The `utf8` Trap in Older MySQL Versions
- In standard computing, **UTF-8** can use up to **4 bytes** per character.
- Historically, MySQL implemented a version called `utf8` (now renamed `utf8mb3`), which only allocated **3 bytes** per character!
- Any 4-byte character—including emojis, musical notation, and historic scripts—caused instant query failure!
- **The Modern Standard:** Always use **`utf8mb4`**, which allocates the full 4 bytes per character.

---

## 2. What is a Collation?

While a character set determines how characters are **encoded**, a **Collation** determines how characters are **compared and sorted**.

For example, should the letter `'a'` be treated as equal to `'A'`? Should `'e'` be equal to `'é'`? A collation answers these questions!

### Decoding Collation Naming Conventions:
Consider the collation name: **`utf8mb4_0900_ai_ci`**
- **`utf8mb4`:** Associated character set.
- **`0900`:** Unicode Collation Algorithm (UCA) version 9.0.0.
- **`_ai`:** **Accent Insensitive** (`e` = `é`).
- **`_ci`:** **Case Insensitive** (`a` = `A`).
- **`_bin`:** **Binary** comparison (compares raw byte values directly; case-sensitive and accent-sensitive).

---

## 3. Four Levels of Character Set Configuration

MySQL allows specifying character sets and collations hierarchically across four distinct levels:

```
   +-------------------------------------------------------------+
   | 1. Server Default     | Configured in my.cnf / my.ini       |
   +-------------------------------------------------------------+
                                  | Inherited if unspecified
                                  v
   +-------------------------------------------------------------+
   | 2. Database Default   | CREATE DATABASE ... CHARACTER SET   |
   +-------------------------------------------------------------+
                                  | Inherited if unspecified
                                  v
   +-------------------------------------------------------------+
   | 3. Table Default      | CREATE TABLE ... DEFAULT CHARSET    |
   +-------------------------------------------------------------+
                                  | Inherited if unspecified
                                  v
   +-------------------------------------------------------------+
   | 4. Column Level       | col_name VARCHAR(100) CHARACTER SET |
   +-------------------------------------------------------------+
```

### Practical SQL Configuration:
```sql
-- Level 2: Database Level
CREATE DATABASE msk_global_store
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE msk_global_store;

-- Level 3: Table Level
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL, -- Inherits utf8mb4_0900_ai_ci
    
    -- Level 4: Column Level (Binary Collation for Case-Sensitive Password/API Token)
    api_token VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
);
```

---

## 4. Inspecting Character Sets and Collations

```sql
-- View all available character sets supported by your MySQL server:
SHOW CHARACTER SET;

-- View all available collations for utf8mb4:
SHOW COLLATION WHERE Charset = 'utf8mb4';

-- Check active session variables:
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';
```

---

## 5. Best Practices & Common Pitfalls

- **Universal Standard:** In MySQL 8.0 and beyond, **`utf8mb4_0900_ai_ci`** is the default collation and the recommended standard for almost all international web applications.
- **Authentication Tokens:** For secret tokens, hashes, and passwords, always use binary collations (`_bin`) so that `'Token123'` does not match `'token123'`.
- **Client Connection Encoding:** Ensure your application database connection pool specifies `charset=utf8mb4` to avoid client-side transcoding bugs.

---

# Multiple Choice Questions

### 1. How many bytes per character can the modern `utf8mb4` character set allocate in MySQL?
A. Exactly 1 byte
B. Up to 2 bytes
C. Up to 4 bytes
D. Exactly 8 bytes
**Answer:** C
**Explanation:** `utf8mb4` allocates between 1 and 4 bytes per character, providing complete coverage for the entire Unicode specification, including emojis.
---

### 2. What does the `_ci` suffix represent in a MySQL collation name like `utf8mb4_unicode_ci`?
A. Compressed Index
B. Case Insensitive
C. Case Integer
D. Column Integrity
**Answer:** B
**Explanation:** The suffix `_ci` denotes "Case Insensitive", meaning comparisons treat uppercase and lowercase variations of a letter as equal.
---

### 3. If a table is created without an explicit `DEFAULT CHARSET` clause, where does it inherit its character set from?
A. From the operating system language
B. From the default character set of its parent database
C. From the first column defined
D. It defaults permanently to ASCII
**Answer:** B
**Explanation:** In MySQL's hierarchical configuration, a table inherits its character set and collation from its containing database unless overridden explicitly.
---

### 4. Which collation type should be chosen for an API key or password hash column to ensure case-sensitive matching?
A. utf8mb4_general_ci
B. utf8mb4_bin
C. utf8mb4_0900_ai_ci
D. latin1_swedish_ci
**Answer:** B
**Explanation:** Binary collations (ending with `_bin`) compare raw numeric byte values directly, ensuring that casing and accents are strictly distinguished.
---

### 5. What is the default collation in modern MySQL 8.0+ for `utf8mb4`?
A. utf8mb4_general_ci
B. utf8mb4_0900_ai_ci
C. utf8mb4_bin
D. latin1_bin
**Answer:** B
**Explanation:** MySQL 8.0 established `utf8mb4_0900_ai_ci` as the default collation, based on the Unicode 9.0 standard with accent-insensitive and case-insensitive rules.
---
