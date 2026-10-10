---
id: innodb-architecture-buffer-pool-redo-undo
slug: innodb-architecture-buffer-pool-redo-undo
course: sql-for-advanced
chapter: Database Administration & Maintenance
topic: "InnoDB Architecture: Buffer Pool, Redo Log, Undo Log"
difficulty: Advanced
readingTime: 15
order: 37
keywords: ["innodb architecture","buffer pool","redo log","undo log","write ahead logging","innodb internals"]
lastUpdated: 2026-09-12
author: Antigravity Team
version: 1.0.0
---

# InnoDB Architecture: Buffer Pool, Redo Log, Undo Log
To optimize, tune, and troubleshoot MySQL at an enterprise scale, you must understand the internal memory and storage architecture of the **InnoDB Storage Engine**.

InnoDB's architectural design guarantees ACID compliance and maximizes throughput via three primary subsystems: the **Buffer Pool**, the **Redo Log**, and the **Undo Log**.

---

### High-Level Architecture Diagram

```
                    [ Client Applications ]
                              │ (SQL Queries)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INNODB MEMORY ENGINE                     │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 INNODB BUFFER POOL                  │   │
│   │  [ Data Pages ]  [ Index Pages ]  [ Adaptive Hash ] │   │
│   │  [ Dirty Pages (modified in memory) ]               │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   [ Log Buffer ]             │ (Background Flusher Thread)  │
└──────────┬───────────────────┼──────────────────────────────┘
           │                   │
           ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     INNODB DISK STORAGE                     │
│                                                             │
│   [ Redo Log (ib_logfile) ] ──> WAL: Crash Recovery         │
│   [ Undo Log (Rollback Segments) ] ──> MVCC & Rollbacks     │
│   [ Tablespace (.ibd files) ] ──> Persistent Data & Indexes │
│   [ Doublewrite Buffer ] ──> Guards against Torn Pages      │
└─────────────────────────────────────────────────────────────┘
```

---

### 1. The InnoDB Buffer Pool: The Heart of Performance

The **Buffer Pool** is the dedicated RAM memory area where InnoDB caches data pages and index pages.
- When a row is read, InnoDB fetches its entire 16 KB page from disk into the Buffer Pool. Subsequent reads occur directly in RAM at nanosecond speeds!
- **Dirty Pages:** When a query updates a row, InnoDB modifies the page in RAM immediately (making it "dirty"). It does **not** write to the `.ibd` table disk file immediately; background threads flush dirty pages to disk asynchronously.

> **Production Rule:** On a dedicated MySQL database server, set `innodb_buffer_pool_size` to **60% to 80% of total system RAM**!

---

### 2. The Redo Log: Write-Ahead Logging (WAL) & Durability

If MySQL crashes while dirty pages are sitting in the Buffer Pool, how is data not lost?
Answer: **The Redo Log**.

Before any dirty page can be modified in RAM, the change is written sequentially to the **Log Buffer** and flushed to the **Redo Log on disk** (`ib_logfile0`, `ib_logfile1`):
- Sequential disk writes are fast ($O(1)$ append).
- **Crash Recovery:** Upon server restart after a crash, InnoDB reads the Redo Log and replays any committed changes that had not yet been flushed to the tablespace files.

#### Flush Behavior (`innodb_flush_log_at_trx_commit`):
- **`1` (Default / Full ACID):** Redo log is flushed to disk on **every transaction commit**. Maximum safety.
- **`2`:** Redo log is written to OS cache on commit and flushed to disk once per second. High performance, risk of losing 1 second of transactions on power failure.
- **`0`:** Written and flushed once per second. Maximum performance, highest risk.

---

### 3. The Undo Log: Atomicity & MVCC

The **Undo Log** stores the inverse of modifications:
1. **Rollback Support:** If a transaction issues `ROLLBACK`, InnoDB uses the undo log to revert changed rows back to their original values.
2. **Multi-Version Concurrency Control (MVCC):** When Transaction B reads rows modified by uncommitted Transaction A, Transaction B reads the older row versions reconstructed directly from the Undo Log!

---

### 4. The Doublewrite Buffer: Guarding Against Torn Pages

Operating system file blocks are typically 4 KB, but InnoDB pages are 16 KB. If a power outage occurs midway through writing a 16 KB page (writing only 8 KB), the page becomes corrupted (a **torn page**).

The **Doublewrite Buffer** writes pages to a contiguous memory and disk buffer before writing them to actual tablespace files. If a crash tears a page, InnoDB restores the intact page from the doublewrite buffer during recovery.

---

# Multiple Choice Questions

### 1. What percentage of total server RAM is recommended for innodb_buffer_pool_size on a dedicated MySQL server?
A. 10% to 20%
B. 60% to 80%
C. 100%
D. Exactly 2 GB
**Answer:** B
**Explanation:** Allocating 60% to 80% of available RAM to the InnoDB Buffer Pool maximizes memory caching while leaving room for the OS and connection threads.
---

### 2. What is a "Dirty Page" in InnoDB memory architecture?
A. A page corrupted by malware
B. A page modified in the Buffer Pool that has not yet been flushed to disk
C. A deleted table page
D. An unindexed row
**Answer:** B
**Explanation:** A dirty page is a 16 KB memory page in the buffer pool whose content has been updated by transactions but not yet written to tablespace storage.
---

### 3. How does the Redo Log ensure Durability after an unexpected power outage?
A. By sending backups to Google Drive
B. By replaying sequential write-ahead log records during startup recovery to restore unflushed dirty page modifications
C. By resetting tables to zero
D. By restarting in read-only mode
**Answer:** B
**Explanation:** Write-Ahead Logging (WAL) guarantees that replaying the Redo Log upon crash recovery restores all committed state modifications.
---

### 4. What dual purpose does the Undo Log serve in MySQL InnoDB?
A. Defragmenting tables and sorting indexes
B. Transaction rollback execution and consistent snapshot reconstruction for MVCC reads
C. Compressing files and managing user passwords
D. Tracking slow queries
**Answer:** B
**Explanation:** Undo logs store reverse images of modified rows, enabling atomic rollbacks and providing snapshot isolation for concurrent MVCC readers.
---

### 5. What catastrophe does the InnoDB Doublewrite Buffer prevent?
A. SQL injection attacks
B. Torn page corruption caused by server power failures midway through writing 16 KB pages
C. Buffer pool memory exhaustion
D. Slow network connections
**Answer:** B
**Explanation:** The doublewrite buffer protects against partial page writes (torn pages) caused by power outages during disk flushes.
---
