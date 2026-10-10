---
id: full-text-search-indexes
slug: full-text-search-indexes
course: sql-for-advanced
chapter: Indexing Architecture & Deep Internals
topic: "Full-Text Search Indexes (MATCH ... AGAINST)"
difficulty: Advanced
readingTime: 13
order: 9
keywords: ["full-text search","match against","boolean mode","natural language mode","inverted index"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Full-Text Search Indexes (MATCH ... AGAINST)
Standard B+Tree indexes are incapable of efficiently searching for keywords inside unstructured text (e.g., blog posts, product reviews, or article bodies). Using `LIKE '%keyword%'` forces a full table scan that cripples database performance.

MySQL provides **Full-Text Indexes (FTS)** powered by an internal **Inverted Index**, queried using the **`MATCH() ... AGAINST()`** syntax.

---

### How Inverted Indexes Work

Instead of mapping rows to words, a Full-Text Inverted Index tokenizes text into distinct words (tokens) and maps each word to a list of Document IDs where it appears:

```
Token "database" ──> Appears in Doc #1, Doc #4, Doc #89
Token "relational" ──> Appears in Doc #4, Doc #12
```
Looking up "database" requires only a single index lookup to find all matching rows instantly!

---

### Creating a Full-Text Index

```sql
CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    FULLTEXT INDEX ft_title_body (title, body)
) ENGINE = InnoDB;
```

---

### 1. Natural Language Mode (Default)

Natural Language Mode calculates a relevance score based on word frequency and uniqueness:

```sql
SELECT 
    article_id, 
    title,
    MATCH(title, body) AGAINST('mysql performance tuning') AS relevance_score
FROM articles
WHERE MATCH(title, body) AGAINST('mysql performance tuning' IN NATURAL LANGUAGE MODE)
ORDER BY relevance_score DESC;
```

---

### 2. Boolean Mode: Power Search with Operators

Boolean Mode allows precision keyword filtering using search operators:

| Operator | Meaning | Example |
| :--- | :--- | :--- |
| **`+`** | Word **MUST** be present | `+mysql +optimization` |
| **`-`** | Word **MUST NOT** be present | `+mysql -oracle` |
| **`*`** | Wildcard / prefix operator | `auto*` (matches automates, automatic) |
| **`""`** | Exact phrase search | `"query execution plan"` |
| **`( )`** | Grouping expressions | `+mysql +(replication OR cluster)` |

```sql
-- Find articles mentioning 'mysql' and 'optimization', but NOT 'windows'
SELECT article_id, title 
FROM articles
WHERE MATCH(title, body) AGAINST('+mysql +optimization -windows' IN BOOLEAN MODE);

-- Exact phrase match
SELECT article_id, title 
FROM articles
WHERE MATCH(title, body) AGAINST('"high availability"' IN BOOLEAN MODE);
```

---

### Minimum Word Length & Stopwords

By default:
- Words shorter than 3 characters (in InnoDB, controlled by `innodb_ft_min_token_size`) are ignored.
- Common English "stopwords" (like "the", "and", "is") are filtered out automatically.

```sql
-- Inspect minimum token length
SHOW VARIABLES LIKE 'innodb_ft_min_token_size';
```

---

# Multiple Choice Questions

### 1. What data structure powers MySQL Full-Text Search?
A. Hash Table
B. Inverted Index
C. B+Tree Clustered Heap
D. R-Tree
**Answer:** B
**Explanation:** Full-text search uses an Inverted Index that maps tokenized words to lists of document/row IDs.
---

### 2. Which SQL syntax is used to query a Full-Text index?
A. WHERE title CONTAINS 'keyword'
B. WHERE SEARCH(title, 'keyword')
C. WHERE MATCH(columns) AGAINST('query_string')
D. WHERE title LIKE_ANY('keyword')
**Answer:** C
**Explanation:** Full-text queries require the MATCH(col1, col2) AGAINST('search_term') clause.
---

### 3. In Boolean Mode, what does the operator + signify (e.g., +mysql)?
A. The word is optional
B. The word must be present in every matching row
C. Sort in ascending order
D. Match uppercase only
**Answer:** B
**Explanation:** In Boolean search, the plus sign '+' designates that the following word must be present in the text.
---

### 4. How do you perform an exact multi-word phrase search in Boolean Mode?
A. Enclose the phrase in double quotes ("high availability")
B. Separate words with ampersands (high & availability)
C. Use brackets ([high availability])
D. Prefix with the EQUAL operator
**Answer:** A
**Explanation:** Enclosing terms in double quotes searches for the exact phrase in consecutive sequence.
---

### 5. Why is LIKE '%keyword%' unsuitable for searching large textual corpuses?
A. It fails to match lowercase letters
B. The leading wildcard prevents index usage, forcing an expensive O(N) full table scan
C. It only searches numbers
D. It locks the entire database server
**Answer:** B
**Explanation:** Leading wildcards (%keyword) prevent B+Tree traversal, scanning every row on disk and causing high latency.
---
