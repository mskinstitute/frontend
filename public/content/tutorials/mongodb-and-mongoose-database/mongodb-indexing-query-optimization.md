# Database Indexing Strategies (Single, Compound, TTL) & Query Optimization

Without indexes, MongoDB must inspect every single document in a collection to satisfy a query—an expensive operation known as a **Collection Scan (`COLLSCAN`)**. Proper **Indexing Strategies** turn sluggish multi-second queries into sub-millisecond **Index Scans (`IXSCAN`)**.

---

## 1. Types of MongoDB Indexes

1. **Single Field Index:** Index on a single attribute (`db.users.createIndex({ email: 1 })`).
2. **Compound Index:** Index on multiple fields (`db.courses.createIndex({ category: 1, price: -1 })`).
3. **Unique Index:** Guarantees no two documents share the same value (`{ unique: true }`).
4. **TTL (Time-To-Live) Index:** Automatically deletes documents after a designated lifespan!
5. **Text Index:** Powers full-text keyword searches across text fields.

---

## 2. The ESR Rule for Compound Indexes

When designing compound indexes for complex queries containing Equality, Sorting, and Range conditions, follow the **ESR (Equality, Sort, Range) Rule**:

1. **E - Equality:** Fields queried with exact matches (`status: 'ACTIVE'`) go first.
2. **S - Sort:** Fields used for ordering (`sort: { createdAt: -1 }`) go second.
3. **R - Range:** Fields queried with range operators (`price: { $gte: 100 }`) go last.

```javascript
// Query:
db.orders.find({ status: 'COMPLETED', totalAmount: { $gte: 500 } }).sort({ orderDate: -1 });

// Optimal Index following ESR:
db.orders.createIndex({
  status: 1,       // 1. Equality
  orderDate: -1,   // 2. Sort
  totalAmount: 1   // 3. Range
});
```

---

## 3. TTL (Time-To-Live) Indexes for Auto-Expiring Data

Use TTL indexes to automatically purge temporary verification OTPs, login tokens, or shopping carts:

```javascript
const tokenSchema = new Schema({
  userId: Schema.Types.ObjectId,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Automatically deleted by MongoDB background thread after 1 hour (3600s)!
  }
});
```

---

## 4. Query Profiling with `explain("executionStats")`

To verify if your query is using an index, run `.explain("executionStats")`:

```javascript
const stats = await Course.find({ slug: 'full-stack-mern-mastery' })
  .explain('executionStats');

console.log('Stage:', stats.executionStats.executionStages.stage);
console.log('Docs Examined:', stats.executionStats.totalDocsExamined);
console.log('Keys Examined:', stats.executionStats.totalKeysExamined);
```

- **`COLLSCAN`:** Full collection scan (Bad! Means missing index).
- **`IXSCAN`:** Index scan (Good! Direct B-Tree traversal).

---

# Multiple Choice Questions

### 1. What does the stage `COLLSCAN` in a MongoDB query explain plan signify?
A. The query executed in the cloud.
B. MongoDB had to scan every document in the entire collection because no suitable index was found.
C. The query used a compound index.
D. The collection is encrypted.
**Answer:** B
**Explanation:** `COLLSCAN` stands for Collection Scan, indicating that the database inspected every document from start to finish.
---

### 2. What is the ESR Rule for designing optimal compound indexes in MongoDB?
A. Easy, Simple, Reliable
B. Equality fields first, followed by Sort fields, followed by Range fields
C. Encryption, Storage, Retrieval
D. Expiration, Schemas, Relations
**Answer:** B
**Explanation:** The ESR (Equality, Sort, Range) guideline orders compound index keys so exact matches narrow the search first, sort operations avoid in-memory sorting, and ranges are evaluated last.
---

### 3. What does a TTL (Time-To-Live) index do in MongoDB?
A. It speeds up queries during daytime hours.
B. It automatically deletes documents after a designated number of seconds from a Date field timestamp.
C. It backs up data to tape drives.
D. It restricts write permissions.
**Answer:** B
**Explanation:** TTL indexes monitor a Date field and automatically remove expired documents from the collection via a background thread.
---

### 4. Why should you NOT indiscriminately create dozens of indexes on every single field of a collection?
A. MongoDB crashes if you have more than 3 indexes.
B. Every index consumes RAM and slows down write operations (insert, update, delete) because all relevant indexes must be updated on each write.
C. Indexes delete collection data.
D. Indexes disable HTTPS encryption.
**Answer:** B
**Explanation:** While indexes accelerate read queries, each index introduces write overhead and consumes memory, requiring a balanced, intentional indexing strategy.
---

### 5. What does the stage `IXSCAN` followed by a `FETCH` indicate in an explain plan?
A. The query failed.
B. MongoDB scanned the index B-tree (`IXSCAN`) and then retrieved the actual document data from disk/cache (`FETCH`).
C. The query ran in memory without disk access.
D. The index was deleted.
**Answer:** B
**Explanation:** `IXSCAN` indicates MongoDB navigated the index structure to locate matching keys, followed by `FETCH` to retrieve the corresponding document payloads.
---
