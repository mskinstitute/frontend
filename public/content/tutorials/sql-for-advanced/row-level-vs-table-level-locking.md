---
id: row-level-vs-table-level-locking
slug: row-level-vs-table-level-locking
course: sql-for-advanced
chapter: Database Locking & Deadlock Resolution
topic: "InnoDB Row-Level Locking, Gap Locks & Next-Key Locks"
difficulty: Advanced
readingTime: 14
order: 27
keywords: ["row level locking","gap locks","next-key locks","record locks","phantom read prevention","innodb internals"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# InnoDB Row-Level Locking, Gap Locks & Next-Key Locks
One of MySQL InnoDB's greatest architectural strengths is its ability to perform **Row-Level Locking**. Older engines (like MyISAM) locked the entire table for every write operation, causing massive contention.

However, InnoDB's row-level locking mechanism does not lock arbitrary data rows on disk; **it locks the index records**!

To prevent phantom reads under `REPEATABLE READ`, InnoDB employs three distinct locking mechanisms: **Record Locks**, **Gap Locks**, and **Next-Key Locks**.

---

### 1. Record Locks

A **Record Lock** locks a specific physical index entry:
```sql
SELECT * FROM users WHERE user_id = 10 FOR UPDATE;
```
If `user_id` has a unique index, InnoDB applies a Record Lock **only to the index leaf entry where `user_id = 10`**. Other transactions can freely insert, update, or delete `user_id = 9` or `user_id = 11`.

---

### 2. Gap Locks

A **Gap Lock** locks the open "gap" (the empty space) between two consecutive index records, or before the first / after the last index record:

```sql
-- Suppose users has IDs: 5, 10, 15
SELECT * FROM users 
WHERE user_id BETWEEN 7 AND 12 
FOR UPDATE;
```
In this query:
- Record lock on `10`.
- **Gap lock** on the space between 5 and 10 `(5, 10)`.
- **Gap lock** on the space between 10 and 15 `(10, 15)`.

#### The Purpose of Gap Locks:
If Transaction 2 attempts to `INSERT INTO users (user_id) VALUES (8);`, Transaction 2 is **blocked**! Gap locking prevents other transactions from inserting new rows into the range, eliminating **Phantom Reads**!

---

### 3. Next-Key Locks: Record + Gap Combined

In InnoDB, a **Next-Key Lock** is an index Record Lock combined with a Gap Lock on the space immediately **preceding** that index record:

$$	ext{Next-Key Lock on Record } R = 	ext{Gap } (R_{prev}, R] + 	ext{Record Lock on } R$$

- Under the default `REPEATABLE READ` isolation level, InnoDB uses **Next-Key Locks** by default when searching or scanning index ranges.
- If a query searches on a Unique index with an exact match (`=`), InnoDB automatically degrades the Next-Key Lock to a simple **Record Lock** for maximum concurrency.

---

### The Danger of Non-Indexed Locking Reads: Table-Level Locking Fallback!

> **CRITICAL WARNING:** InnoDB locks **INDEXES**, not data rows!
> If you issue an `UPDATE` or `SELECT ... FOR UPDATE` with a `WHERE` filter on an **unindexed column**, InnoDB cannot navigate an index tree.
> **It must scan every index record in the table, locking EVERY SINGLE ROW AND GAP!**
> An unindexed update on a single row effectively locks the **ENTIRE TABLE**, bringing your entire production application to a dead stop!

```sql
-- Schema: status column has NO index!
-- DISASTER QUERY: Locks all rows in the entire table!
UPDATE orders SET status = 'CANCELLED' WHERE status = 'PENDING';
```

---

# Multiple Choice Questions

### 1. In MySQL InnoDB, what does a row-level lock physically lock?
A. The table header block in the operating system
B. The specific index record leaf in the B+Tree
C. The entire database cache
D. The primary key sequence generator
**Answer:** B
**Explanation:** InnoDB row-level locking functions strictly at the index layer; locks are placed directly on index records.
---

### 2. What is a "Gap Lock" in InnoDB?
A. A lock that deletes empty space
B. A lock placed on the space between index records to prevent concurrent transactions from inserting new phantom rows into the range
C. A lock placed on auto-increment counters
D. A memory leak in the buffer pool
**Answer:** B
**Explanation:** Gap locks lock the interval between index entries to prevent concurrent inserts that would cause phantom reads.
---

### 3. What constitutes a "Next-Key Lock" in MySQL?
A. A lock on the next primary key value
B. A combination of an index Record Lock plus a Gap Lock on the interval preceding that record
C. A foreign key constraint lock
D. A table lock combined with a database lock
**Answer:** B
**Explanation:** A Next-Key lock encompasses both the index record itself and the preceding gap interval (R_prev, R].
---

### 4. What catastrophic performance penalty occurs if an UPDATE statement filters on an unindexed column?
A. The statement fails with syntax error
B. InnoDB must scan the entire table, locking every index record and gap in the table, effectively locking out all concurrent writers
C. The server restarts
D. The table is converted to MyISAM
**Answer:** B
**Explanation:** Without an index, InnoDB must perform a full scan, placing locks on every record in the table and degrading concurrency to table-level locking.
---

### 5. Why does InnoDB downgrade a Next-Key Lock to a simple Record Lock when searching with WHERE id = 10 on a unique primary key?
A. Because primary keys cannot hold locks
B. Because a unique index guarantees at most one row can exist, eliminating the possibility of duplicate phantom inserts for that key
C. To comply with MySQL 5.5 syntax
D. Because gap locks are illegal on numbers
**Answer:** B
**Explanation:** Uniqueness guarantees no phantom row can match id = 10, so locking the gap around it is redundant and unnecessary.
---
