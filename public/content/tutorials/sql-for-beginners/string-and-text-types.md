---
id: string-and-text-types
slug: string-and-text-types
course: sql-for-beginners
chapter: MySQL Data Types in Depth
topic: "String & Text Types: CHAR, VARCHAR, TEXT, and BLOB"
difficulty: Beginner
readingTime: 12
order: 14
keywords: ["string types","char vs varchar","text","blob","max varchar length","storage optimization"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# String & Text Types: CHAR, VARCHAR, TEXT, and BLOB
String data encompasses everything from customer names, emails, and postal codes to full-length blog posts, JSON strings, and product descriptions. MySQL provides several string and binary data types, each with distinct storage mechanics, indexing capabilities, and performance profiles.

---

## 1. `CHAR` vs `VARCHAR`: Fixed-Length vs Variable-Length

The two most frequently used string types are **`CHAR`** and **`VARCHAR`**.

```
   CHAR(5) storing "Hi":
   +---+---+---+---+---+
   | H | i |   |   |   |  <-- Always consumes 5 bytes (padded with spaces)!
   +---+---+---+---+---+

   VARCHAR(5) storing "Hi":
   +-------+---+---+
   | len=2 | H | i |      <-- Consumes 1 length byte + 2 data bytes = 3 bytes!
   +-------+---+---+
```

| Feature | `CHAR(M)` | `VARCHAR(M)` |
| :--- | :--- | :--- |
| **Length Type** | Fixed length (always allocates `M` characters). | Variable length (allocates only actual characters + length prefix). |
| **Max Capacity** | 0 to 255 characters. | 0 to 65,535 bytes (shared across the entire row). |
| **Padding** | Right-padded with spaces upon storage; stripped on retrieval. | No trailing padding. |
| **Length Prefix** | None (0 bytes). | 1 byte (if length <= 255), 2 bytes (if length > 255). |
| **Ideal For** | Fixed-length codes: Country code (`IN`, `US`), MD5/SHA256 hashes, PIN codes. | Variable-length strings: Names, email addresses, street addresses. |

---

## 2. Large Text Types: `TEXT` Family

When a string exceeds the capacity of `VARCHAR` or represents large prose (e.g., article content, product reviews), use the **`TEXT`** family:

| Type | Maximum Storage | Typical Use Case |
| :--- | :--- | :--- |
| **`TINYTEXT`** | 255 bytes | Short notes, subtitles. |
| **`TEXT`** | 65,535 bytes (~64 KB) | Blog comments, product descriptions. |
| **`MEDIUMTEXT`** | 16,777,215 bytes (~16 MB) | Full articles, book chapters, long HTML pages. |
| **`LONGTEXT`** | 4,294,967,295 bytes (~4 GB) | Massive legal contracts, raw log dumps. |

> [!NOTE]
> `TEXT` columns cannot have default values in older MySQL versions and cannot be fully indexed in their entirety without specifying a prefix length (e.g., `INDEX (content(255))`).

---

## 3. Binary Data: `BINARY`, `VARBINARY`, and `BLOB`

While `CHAR` and `VARCHAR` store **text** (subject to character sets and collations), binary types store **raw byte sequences**:

- **`VARBINARY(M)`:** Variable-length byte string (e.g., encrypted hashes, UUID binary blobs).
- **`BLOB` (Binary Large Object):** Stores raw binary data such as PDF documents, images, or audio clips. Divided into `TINYBLOB`, `BLOB`, `MEDIUMBLOB`, and `LONGBLOB`.

```sql
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    country_code CHAR(2) NOT NULL, -- Fixed 2 characters (e.g. 'IN', 'US')
    full_name VARCHAR(100) NOT NULL, -- Variable up to 100 characters
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT, -- Markdown biography
    profile_photo_blob MEDIUMBLOB -- Raw JPEG bytes (Max 16MB)
);
```

---

## 4. Best Practices & Common Pitfalls

- **Avoid Storing Images Directly as BLOBs:** Storing large image files directly inside database tables bloats the database backup size and slows down caching. **Best practice:** Store files on AWS S3, Cloudflare R2, or a disk directory, and store only the **URL string** (`VARCHAR(500)`) in the database!
- **Beware of the 65,535 Row Size Limit:** In MySQL, the maximum row size for all columns combined is 65,535 bytes. Large `TEXT` and `BLOB` columns store only a 24-byte pointer on-page, with the rest stored in off-page overflow tablespaces.

---

# Multiple Choice Questions

### 1. Which data type is most efficient for storing fixed-length two-character country codes (e.g., 'IN', 'US', 'UK')?
A. VARCHAR(2)
B. CHAR(2)
C. TEXT
D. BLOB
**Answer:** B
**Explanation:** `CHAR(2)` is optimal for fixed-length strings because it eliminates the length prefix byte overhead required by `VARCHAR`.
---

### 2. How does `VARCHAR(100)` store a string containing 10 characters?
A. It stores 10 characters plus 90 padded space bytes
B. It stores only the 10 characters plus 1 length-prefix byte (11 bytes total)
C. It always consumes exactly 100 bytes on disk
D. It compresses the string into a 1-byte hash
**Answer:** B
**Explanation:** `VARCHAR` allocates only the characters actually stored plus a 1-byte (or 2-byte) length prefix indicator.
---

### 3. What is the maximum storage capacity of a standard `LONGTEXT` column in MySQL?
A. 64 Kilobytes
B. 16 Megabytes
C. 4 Gigabytes
D. Unlimited
**Answer:** C
**Explanation:** `LONGTEXT` can store up to 4,294,967,295 bytes (approximately 4 Gigabytes) of textual data.
---

### 4. What is the fundamental difference between `VARCHAR` and `VARBINARY`?
A. VARCHAR only stores numbers; VARBINARY stores letters
B. VARCHAR stores character strings with character sets/collations; VARBINARY stores raw byte sequences
C. VARBINARY cannot be indexed
D. VARCHAR is limited to 10 characters
**Answer:** B
**Explanation:** `VARCHAR` strings are evaluated according to a character set and collation, whereas `VARBINARY` stores raw binary bytes without character encoding.
---

### 5. Why is it considered an architectural anti-pattern to store high-resolution images as `MEDIUMBLOB` directly in a relational table?
A. MySQL cannot store binary data
B. It dramatically bloats table sizes, exhausts RAM buffer pools, and slows down database backups
C. Images lose color when stored in BLOBs
D. BLOB columns require a dedicated CPU
**Answer:** B
**Explanation:** Storing large binary files in an RDBMS consumes expensive database memory and disk I/O; storing images on dedicated object storage (e.g., S3) and referencing their URLs in VARCHAR columns is the recommended architecture.
---
