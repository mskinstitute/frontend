---
id: modifying-json-documents
slug: modifying-json-documents
course: sql-for-advanced
chapter: Advanced MySQL Features & JSON Operations
topic: "Modifying JSON Documents (JSON_SET, JSON_INSERT, JSON_REMOVE)"
difficulty: Advanced
readingTime: 13
order: 31
keywords: ["json_set","json_insert","json_replace","json_remove","json_array_append"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Modifying JSON Documents (JSON_SET, JSON_INSERT, JSON_REMOVE)
Updating JSON documents does not require overwriting the entire document. MySQL provides dedicated JSON manipulation functions that surgically alter keys, values, and arrays directly inside the database engine.

---

### The Three Core Mutation Functions: SET vs INSERT vs REPLACE

| Function | If Key Already Exists | If Key Does NOT Exist |
| :--- | :--- | :--- |
| **`JSON_SET()`** | **Overwrites** existing value | **Creates** new key/value |
| **`JSON_INSERT()`** | **Ignores** (Does not change) | **Creates** new key/value |
| **`JSON_REPLACE()`**| **Overwrites** existing value | **Ignores** (Does not create) |

---

### 1. Updating with JSON_SET()

`JSON_SET` is the most widely used modifier because it handles both updates and insertions (upsert behavior):

```sql
-- Update warranty to 3 years AND add a new 'color' property:
UPDATE product_catalogs
SET attributes = JSON_SET(
    attributes,
    '$.warranty_years', 3,           -- Overwrites existing key
    '$.color', 'Space Gray'          -- Inserts new key!
)
WHERE product_id = 1;
```

---

### 2. Safeguarding Existing Keys with JSON_INSERT()

`JSON_INSERT` only writes if the path is currently missing:

```sql
-- Add 'refurbished': false only if it hasn't already been defined
UPDATE product_catalogs
SET attributes = JSON_INSERT(attributes, '$.refurbished', false)
WHERE product_id = 1;
```

---

### 3. Deleting Keys with JSON_REMOVE()

`JSON_REMOVE` deletes one or more keys or array elements:

```sql
-- Remove the 'warranty_years' property and the 2nd tag in the array
UPDATE product_catalogs
SET attributes = JSON_REMOVE(
    attributes, 
    '$.warranty_years',
    '$.tags[1]'
)
WHERE product_id = 1;
```

---

### 4. Working with Arrays: JSON_ARRAY_APPEND()

To append elements to an existing nested array:

```sql
-- Append 'extended-battery' to the product's tags array
UPDATE product_catalogs
SET attributes = JSON_ARRAY_APPEND(attributes, '$.tags', 'extended-battery')
WHERE product_id = 1;
```

---

### Partial In-Place Updates in MySQL 8.0

In MySQL 8.0, if an update to a JSON column using `JSON_SET` or `JSON_REPLACE` only changes existing values without expanding the document size, InnoDB performs a **partial in-place update**. Instead of rewriting the entire JSON document to disk, it updates only the modified bytes in the redo log and data page, slashing write I/O.

---

# Multiple Choice Questions

### 1. Which function updates an existing JSON key or creates it if it does not exist?
A. JSON_INSERT()
B. JSON_REPLACE()
C. JSON_SET()
D. JSON_ADD()
**Answer:** C
**Explanation:** JSON_SET() exhibits upsert semantics: it modifies values for keys that exist and appends keys that do not.
---

### 2. What does JSON_INSERT(json, '$.status', 'active') do if $.status already contains 'pending'?
A. Throws an error
B. Overwrites 'pending' with 'active'
C. Does nothing; preserves existing 'pending' value
D. Converts the key to an array
**Answer:** C
**Explanation:** JSON_INSERT() only inserts values for paths that do not currently exist; existing paths are left untouched.
---

### 3. Which function permanently deletes a property or array element from a JSON document?
A. JSON_DROP()
B. JSON_DELETE()
C. JSON_REMOVE()
D. JSON_UNSET()
**Answer:** C
**Explanation:** JSON_REMOVE(json, path1, path2) deletes the specified paths from the document.
---

### 4. How do you append a new element to an existing JSON array in MySQL?
A. JSON_PUSH()
B. JSON_ARRAY_APPEND()
C. JSON_EXTEND()
D. JSON_ARRAY_ADD()
**Answer:** B
**Explanation:** JSON_ARRAY_APPEND() appends values to the end of a specified array path.
---

### 5. What performance optimization does MySQL 8.0 apply when updating small values in-place within a JSON column?
A. It compresses the document with zip
B. Partial In-Place Update, modifying only changed bytes rather than rewriting the full document
C. Converts the column to VARCHAR
D. Flushes the table to disk
**Answer:** B
**Explanation:** MySQL 8.0's partial in-place update optimization updates modified attributes in-place when document size constraints allow.
---
