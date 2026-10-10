---
id: partitioning-concepts-and-types
slug: partitioning-concepts-and-types
course: sql-for-advanced
chapter: Table Partitioning & Scaling
topic: "Table Partitioning Principles: Range, List, Hash, Key"
difficulty: Advanced
readingTime: 14
order: 34
keywords: ["table partitioning","range partitioning","list partitioning","hash partitioning","key partitioning","database scaling"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# Table Partitioning Principles: Range, List, Hash, Key
When a single table grows beyond tens or hundreds of millions of rows, maintaining B+Tree index depths and performing table maintenance becomes increasingly painful.

**Table Partitioning** allows a single logical table to be physically split into smaller, independent chunks (partitions) across storage, governed by a **Partitioning Key**.

---

### The Fundamental Rule of Partitioning in MySQL

> **THE PRIMARY KEY MANDATE:**
> In MySQL, **every unique key on the table (including the PRIMARY KEY) MUST contain every column in the table's partitioning expression**!
> You cannot partition by `order_date` if your primary key is simply `order_id`; the primary key must be composite: `PRIMARY KEY (order_id, order_date)`.

---

### The Four Core Partitioning Types

#### 1. RANGE Partitioning
Assigns rows to partitions based on whether the partitioning key value falls within a specified discrete range. Ideal for date-based data archiving:

```sql
CREATE TABLE orders_range (
    order_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2),
    PRIMARY KEY (order_id, order_date)
) ENGINE = InnoDB
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

#### 2. LIST Partitioning
Assigns rows based on matching one of a set of discrete enumerated values. Ideal for geographic segmentation:

```sql
CREATE TABLE customers_list (
    customer_id INT NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    PRIMARY KEY (customer_id, country_code)
) ENGINE = InnoDB
PARTITION BY LIST COLUMNS (country_code) (
    PARTITION p_americas VALUES IN ('US', 'CA', 'MX'),
    PARTITION p_europe VALUES IN ('UK', 'DE', 'FR'),
    PARTITION p_asia VALUES IN ('IN', 'JP', 'SG')
);
```

#### 3. HASH Partitioning
Distributes rows evenly across a predetermined number of partitions using a user-defined expression:

```sql
CREATE TABLE web_events (
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (event_id, user_id)
) ENGINE = InnoDB
PARTITION BY HASH (user_id)
PARTITIONS 8;
```

#### 4. KEY Partitioning
Similar to HASH, but MySQL uses its internal MD5-based hashing algorithm on the columns:

```sql
CREATE TABLE user_tokens (
    token_uuid VARCHAR(36) PRIMARY KEY
) ENGINE = InnoDB
PARTITION BY KEY ()
PARTITIONS 16;
```

---

# Multiple Choice Questions

### 1. What is the fundamental requirement regarding Primary Keys when partitioning a table in MySQL?
A. Partitioned tables cannot have primary keys
B. The partitioning column MUST be included in all unique keys and primary keys on the table
C. Primary keys must be UUIDs
D. Primary keys must be AUTO_INCREMENT
**Answer:** B
**Explanation:** MySQL mandates that every unique constraint and primary key must encompass the partitioning column to enforce uniqueness locally.
---

### 2. Which partitioning type is most suitable for archiving time-series logs by year or month?
A. KEY Partitioning
B. HASH Partitioning
C. RANGE Partitioning
D. COMPOSITE LIST
**Answer:** C
**Explanation:** RANGE partitioning assigns rows by value thresholds (e.g., VALUES LESS THAN (2025)), making time-based archiving clean and efficient.
---

### 3. What does VALUES LESS THAN MAXVALUE accomplish in RANGE partitioning?
A. Throws an error
B. Acts as a catch-all bucket for any values exceeding the highest defined threshold
C. Limits table size to 4GB
D. Closes the partition
**Answer:** B
**Explanation:** MAXVALUE serves as an open-ended catch-all partition preventing insert failures for future values.
---

### 4. Which partitioning type distributes rows evenly using an internal MySQL hashing algorithm across a set number of buckets?
A. LIST
B. KEY
C. RANGE
D. INTERVAL
**Answer:** B
**Explanation:** KEY partitioning uses MySQL's internal hashing function to distribute rows evenly across N defined partition buckets.
---

### 5. If a table is partitioned into 4 partitions, how does the application query it?
A. By querying the individual partition tables explicitly (SELECT * FROM table_p1)
B. Transparently querying the logical table name; MySQL routes the query to the proper physical partition
C. Using stored procedures only
D. Using external sharding proxies
**Answer:** B
**Explanation:** Partitioning is transparent to client applications; queries address the logical table name and the engine routes requests internally.
---
