# JSON vs BSON Data Types & MongoDB Internal Storage Engine (WiredTiger)

While developers query MongoDB using familiar JavaScript/JSON notation, the database internally serializes and stores documents as **BSON (Binary JSON)**. Behind the scenes, the **WiredTiger** storage engine delivers enterprise-grade performance, in-memory caching, and transparent disk compression.

---

## 1. Why Not Pure JSON? (JSON vs BSON)

Plain **JSON (JavaScript Object Notation)** is a lightweight text-based format, but it has severe limitations for a production database:
1. **Limited Data Types:** JSON supports only strings, numbers, booleans, arrays, objects, and null. It lacks native representations for Dates, 64-bit integers, regular expressions, and raw binary bytes.
2. **Text Parsing Overhead:** Text JSON requires parsing strings character-by-character on every query, which is computationally expensive.
3. **No Traversal Offsets:** Finding a field in a large nested JSON document requires scanning the entire string up to that character.

**BSON (Binary JSON)** solves these issues:
- **Binary Encoding:** Compact binary representation with prefixed length bytes for fast traversal.
- **Rich Type Support:** Native `ISODate`, `ObjectId`, `Decimal128` (high-precision financial arithmetic), `Int64`, and `BinData`.

```text
JSON Representation:
{"name": "Laptop", "price": 999.99, "created": "2026-09-15T00:00:00Z"}

BSON Storage:
\x16\x00\x00\x00\x02name\x00\x07\x00\x00\x00Laptop\x00\x01price\x00\x3d\x0a\xd7\xa3\x70\x3f\x8f\x40...
```

---

## 2. Anatomy of the MongoDB `ObjectId`

Every MongoDB document requires a unique primary key `_id`. If not provided, MongoDB automatically generates a 12-byte **`ObjectId`**:

```text
| 4-Byte Timestamp | 5-Byte Random Value | 3-Byte Incrementing Counter |
|   (Seconds epoch)   |  (Process unique)   |    (Per-process counter)    |
```

- **Built-in Timestamp:** You can extract the exact creation timestamp of any document using `doc._id.getTimestamp()` without storing an extra `createdAt` field!
- **Natural Ordering:** ObjectIds are roughly ordered chronologically.

---

## 3. The WiredTiger Storage Engine

MongoDB's default storage engine, **WiredTiger**, is responsible for managing data between memory and disk:
- **Document-Level Concurrency:** Provides fine-grained document-level locking for write operations, maximizing multi-core CPU throughput.
- **In-Memory LRU Cache:** Uses 50% of available server RAM minus 1 GB by default to cache hot indexes and documents.
- **Snappy / Zlib Compression:** Transparently compresses collection data and indexes on disk, typically saving 50% to 70% of storage costs compared to raw JSON.
- **Write-Ahead Logging (Journaling):** Commits write operations to an on-disk journal before flushing to data files, guaranteeing durability across sudden server power outages.

---

# Multiple Choice Questions

### 1. What is BSON in MongoDB?
A. A browser styling extension.
B. A binary-encoded serialization format that extends JSON with additional data types like Date, ObjectId, and 64-bit integers.
C. A network socket protocol.
D. A compression algorithm used only for CSS.
**Answer:** B
**Explanation:** BSON (Binary JSON) extends JSON with binary encoding and rich data types like ISODate, ObjectId, and Decimal128 for high-efficiency storage.
---

### 2. How many bytes does a standard MongoDB `ObjectId` occupy in memory?
A. 4 bytes
B. 8 bytes
C. 12 bytes
D. 64 bytes
**Answer:** C
**Explanation:** A MongoDB `ObjectId` is a compact 12-byte BSON type comprising a 4-byte timestamp, 5-byte random value, and 3-byte incrementing counter.
---

### 3. What can be extracted directly from a document's default `_id` ObjectId without querying any other field?
A. The user's credit card number.
B. The exact date and second when the document was created.
C. The server CPU temperature.
D. The client IP address.
**Answer:** B
**Explanation:** The first 4 bytes of an ObjectId represent an epoch timestamp in seconds, accessible via `_id.getTimestamp()`.
---

### 4. What type of concurrency locking does the WiredTiger storage engine provide for write operations?
A. Database-level locking (locks all collections during every write)
B. Table-level locking
C. Document-level concurrency control
D. No locking at all
**Answer:** C
**Explanation:** WiredTiger implements document-level locking, meaning two concurrent writes to different documents in the same collection execute simultaneously without blocking.
---

### 5. What role does "Journaling" play in MongoDB?
A. Writing marketing blogs to the company website.
B. Ensuring write durability by persisting operations to an on-disk write-ahead log before writing them to the main data files, preventing data loss during crashes.
C. Translating BSON to Python.
D. Deleting unused indexes every 5 minutes.
**Answer:** B
**Explanation:** Journaling records writes to a durable transaction log on disk, ensuring that the database can recover cleanly in the event of an unexpected crash or power failure.
---
