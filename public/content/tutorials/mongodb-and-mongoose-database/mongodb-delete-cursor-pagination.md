# Delete Operations, Cursors, Limit, Skip & Sorting in MongoDB

Efficiently managing query volume and deleting obsolete data is vital for scalable systems. In this tutorial, we cover **`deleteOne()`**, **`deleteMany()`**, and the mechanics of **Cursors**, including sorting and pagination using **Limit/Skip** versus **Cursor-Based (Keyset) Pagination**.

---

## 1. Delete Operations

- **`deleteOne(filter)`:** Deletes the first document matching the filter.
- **`deleteMany(filter)`:** Deletes all documents matching the filter.

```javascript
// 1. Delete a specific inactive user
const deleteRes = await db.collection('users').deleteOne({
  _id: new ObjectId('64fa123456789abcdef01234')
});
console.log('Deleted Count:', deleteRes.deletedCount);

// 2. Bulk delete expired sessions older than 30 days
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const bulkDelete = await db.collection('sessions').deleteMany({
  lastActive: { $lt: thirtyDaysAgo }
});
console.log('Purged expired sessions:', bulkDelete.deletedCount);
```

---

## 2. Cursor Operations: Sorting, Limit & Skip

Querying returns a cursor that allows chaining cursor modifiers before results are streamed over the network:

```javascript
const page = 1;
const pageSize = 10;

const products = await db.collection('products')
  .find({ inStock: true })
  .sort({ price: 1, createdAt: -1 }) // 1 = Ascending, -1 = Descending
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .toArray();
```

---

## 3. The Problem with `.skip()` at Scale

While `skip((page - 1) * limit)` is simple, it has an $O(N)$ performance drawback. To skip 1,000,000 documents, MongoDB must traverse and count through 1,000,000 index entries before returning the 10 requested items.

### The Solution: Keyset (Cursor-Based) Pagination
Instead of `skip()`, query using an indexed field (such as `_id` or `createdAt`) greater or less than the last document of the previous page:

```javascript
// Fetch page 2: records after the last viewed document's _id
const lastSeenId = '64fa10000000000000000000';

const nextPageProducts = await db.collection('products')
  .find({
    inStock: true,
    _id: { $gt: new ObjectId(lastSeenId) } // $O(1)$ fast indexed seek!
  })
  .sort({ _id: 1 })
  .limit(10)
  .toArray();
```

Keyset pagination executes with constant $O(1)$ index seek performance, regardless of whether you are viewing page 2 or page 2,000,000!

---

# Multiple Choice Questions

### 1. In MongoDB sorting, what integer values represent Ascending and Descending order?
A. `0` for Ascending, `1` for Descending
B. `1` for Ascending, `-1` for Descending
C. `'ASC'` and `'DESC'`
D. `+` and `-`
**Answer:** B
**Explanation:** In MongoDB query specifications, `1` designates ascending order (smallest to largest / A-Z) and `-1` designates descending order.
---

### 2. Why does `skip(100000)` degrade performance severely in high-volume database queries?
A. MongoDB runs out of disk space.
B. MongoDB must scan and discard 100,000 index entries one-by-one from the beginning before returning the requested batch.
C. The Node.js event loop terminates.
D. MongoDB only allows skipping up to 50 records.
**Answer:** B
**Explanation:** Offsetting queries with `.skip()` is $O(N)$ because the storage engine must iterate through every skipped document, consuming CPU and I/O.
---

### 3. What is the performance advantage of Keyset (Cursor-based) pagination over Offset (Limit/Skip) pagination?
A. Keyset pagination compresses documents in RAM.
B. Keyset pagination uses an indexed range filter (`_id > lastId`) to jump directly to the target record in $O(1)$ time, maintaining blazing speed regardless of page depth.
C. Keyset pagination eliminates the need for database connections.
D. Keyset pagination allows clients to edit other users' data.
**Answer:** B
**Explanation:** Cursor-based pagination uses indexed inequalities (`$gt` / `$lt`), enabling instant index seeks rather than sequential record skipping.
---

### 4. What will `collection.deleteMany({})` do if passed an empty filter object `{}`?
A. Throw an error.
B. Delete all documents in the collection while preserving the collection structure and indexes.
C. Delete the entire database server.
D. Backup the database to Atlas.
**Answer:** B
**Explanation:** Passing an empty filter `{}` to `deleteMany()` matches every document in the collection, deleting all records while keeping collection metadata intact.
---

### 5. Which method closes an open MongoDB Cursor manually when streaming results?
A. `cursor.close()`
B. `cursor.destroy()`
C. `cursor.exit()`
D. `cursor.kill()`
**Answer:** A
**Explanation:** Cursors automatically close when fully exhausted or timed out, but can be closed explicitly using `await cursor.close()`.
---
