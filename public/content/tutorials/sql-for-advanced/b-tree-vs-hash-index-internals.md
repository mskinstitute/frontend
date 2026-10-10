---
id: b-tree-vs-hash-index-internals
slug: b-tree-vs-hash-index-internals
course: sql-for-advanced
chapter: Indexing Architecture & Deep Internals
topic: "B-Tree vs Hash Index Data Structures"
difficulty: Advanced
readingTime: 14
order: 5
keywords: ["b-tree index","hash index","b+tree","index internals","innodb indexes","point lookups"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# B-Tree vs Hash Index Data Structures
Indexes are specialized data structures maintained on disk and in memory that allow the database engine to locate records in $O(log N)$ or $O(1)$ time rather than performing costly $O(N)$ full table scans.

In MySQL, the two most fundamental index data structures are **B-Tree (specifically B+Tree)** and **Hash Indexes**. Choosing and optimizing indexes requires understanding their low-level mechanics.

---

### 1. B+Tree Indexes: The Relational Workhorse

In MySQL InnoDB, all standard indexes are implemented as **B+Trees** (a variation of the balanced B-Tree):
- **Balanced Tree Height:** The tree is balanced; every path from root to leaf has identical depth (typically 3 to 4 levels even for tens of millions of rows).
- **Internal Nodes:** Store key search pointers only (maximizing branching factor).
- **Leaf Nodes:** Store actual data or row pointers, and are linked together via **bi-directional doubly linked lists**.

```
               [ Root Node ]
              /                    [ Branch ]         [ Branch ]
        /                 /          [Leaf]<--->[Leaf]<--->[Leaf]<--->[Leaf]
       │          │          │          │
   (Doubly-linked leaves allow blazing fast range scans!)
```

#### Why B+Trees Dominate RDBMS Storage:
- **Point Lookups:** $O(log N)$ lookup time.
- **Range Queries:** Blazing fast for `BETWEEN`, `>`, `<`, and `LIKE 'prefix%'` because leaf nodes are sequentially linked.
- **Sorting:** Pre-sorted leaf nodes eliminate the need for in-memory sorting (`filesort`) during `ORDER BY`.

---

### 2. Hash Indexes: Instant $O(1)$ Point Lookups

Hash indexes use an internal hash table where key values are passed through a hash function to compute a direct memory bucket address:

```
Key "Alice" ──> [Hash Function] ──> Bucket 4 ──> Pointer to Row
```

#### Strengths of Hash Indexes:
- Unbeatable $O(1)$ search performance for exact equality matches (`=` or `<=>`).

#### Fatal Weaknesses for General SQL:
- **Zero Range Scan Capability:** Because hash codes randomize order, hash indexes **cannot** be used for `<`, `>`, `BETWEEN`, or `ORDER BY`.
- **Cannot Match Partial Prefixes:** You cannot search on the first 3 characters of a string.

---

### InnoDB's Secret Weapon: The Adaptive Hash Index (AHI)

MySQL InnoDB does not permit users to create manual Hash indexes directly. Instead, InnoDB includes an internal feature called the **Adaptive Hash Index (AHI)**:
- InnoDB monitors B+Tree index searches in real-time.
- If it notices certain index pages are queried repeatedly with equality lookups, it automatically builds a Hash index in memory on top of the B+Tree buffer pool!
- This gives developers the best of both worlds: B+Tree versatility on disk with Hash index speed in memory!

```sql
-- Check Adaptive Hash Index status
SHOW GLOBAL STATUS LIKE 'Innodb_adaptive_hash%';

-- Toggle AHI in MySQL configuration
SET GLOBAL innodb_adaptive_hash_index = ON;
```

---

### Structural Comparison

| Feature | B+Tree Index | Hash Index |
| :--- | :--- | :--- |
| **Equality Lookups (`=`)** | Excellent: $O(log N)$ | Instant: $O(1)$ |
| **Range Queries (`<`, `>`, `BETWEEN`)**| **Supported natively** | **Completely unsupported** |
| **Sorting (`ORDER BY`)** | **Pre-sorted on leaf nodes** | Requires full filesort |
| **Prefix Matching (`LIKE 'abc%'`)** | **Supported** | Unsupported |
| **MySQL Engine Support** | InnoDB, MyISAM, MEMORY | MEMORY engine only |

---

# Multiple Choice Questions

### 1. What type of tree structure does MySQL InnoDB use for its primary and secondary indexes?
A. Red-Black Tree
B. Binary Search Tree
C. B+Tree
D. AVL Tree
**Answer:** C
**Explanation:** InnoDB utilizes balanced B+Trees, storing search keys in internal nodes and keeping leaf pages sequentially linked in doubly-linked lists.
---

### 2. Why are B+Trees superior to Hash Indexes for standard relational queries?
A. B+Trees take up zero disk space
B. B+Trees support range queries (>, <, BETWEEN) and pre-sorted ORDER BY traversals
C. B+Trees do not require CPU to search
D. Hash indexes cannot store numbers
**Answer:** B
**Explanation:** Hash functions destroy numerical ordering; B+Tree leaf nodes maintain sorted sequential order, enabling efficient range scans.
---

### 3. What is the time complexity of an exact equality lookup in a Hash Index?
A. O(N)
B. O(log N)
C. O(1)
D. O(N^2)
**Answer:** C
**Explanation:** Hash indexes compute direct bucket locations in constant time O(1).
---

### 4. What is the InnoDB Adaptive Hash Index (AHI)?
A. A plugin that replaces InnoDB with MongoDB
B. An automatic in-memory hash table built dynamically by InnoDB for frequently accessed B+Tree pages
C. A disk defragmentation tool
D. A tool for hashing passwords
**Answer:** B
**Explanation:** The Adaptive Hash Index is InnoDB's internal feature that automatically constructs memory hash tables for hot B+Tree pages to boost lookup speed.
---

### 5. Can a B+Tree index accelerate a query filtering with LIKE '%term'?
A. Yes, always
B. No, leading wildcards prevent the B+Tree from navigating down the tree from the root prefix
C. Yes, if the column is utf8mb4
D. Only if the table has fewer than 100 rows
**Answer:** B
**Explanation:** A leading wildcard ('%term') prevents root-to-leaf traversal because the starting prefix is unknown, forcing a full table scan.
---
