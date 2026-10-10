# Multi-Table Joins with $lookup & Array Flattening with $unwind

Real-world reporting requires combining documents from disparate collections and manipulating nested arrays. The **`$lookup`** stage performs true server-side left outer joins between collections, and the **`$unwind`** stage deconstructs array fields into individual stream documents.

---

## 1. Multi-Collection Joins: The `$lookup` Stage

The `$lookup` stage performs a left outer join to an unsharded collection in the same database:

```text
Orders Collection ---> [$lookup from "users"] ---> Orders with embedded User details
```

### Basic Syntax:
```javascript
const orderDetails = await db.collection('orders').aggregate([
  {
    $lookup: {
      from: 'users', // Target collection to join
      localField: 'customerId', // Field from the input documents ('orders')
      foreignField: '_id', // Field from documents of the 'from' collection ('users')
      as: 'customerDetails' // Output array field name
    }
  }
]).toArray();
```

*Note: `$lookup` always outputs an **array** in the `as` field, even if only one matching document is found.*

---

## 2. Array Flattening: The `$unwind` Stage

Arrays often contain multiple elements that need to be analyzed individually. The `$unwind` stage deconstructs an array field from the input documents to output a document for **each** element in the array:

```text
Input Document:
{ _id: 1, item: "Course Bundle", tags: ["react", "node", "mongo"] }

After { $unwind: "$tags" }:
{ _id: 1, item: "Course Bundle", tags: "react" }
{ _id: 1, item: "Course Bundle", tags: "node" }
{ _id: 1, item: "Course Bundle", tags: "mongo" }
```

---

## 3. Combining `$lookup`, `$unwind`, and `$group`

Find the most popular course tags across all enrollments:

```javascript
const popularTags = await db.collection('courses').aggregate([
  // 1. Flatten the tags array
  { $unwind: '$tags' },

  // 2. Group by individual tag and sum enrollments
  {
    $group: {
      _id: '$tags',
      courseCount: { $sum: 1 },
      totalEnrollments: { $sum: '$enrollmentCount' }
    }
  },

  // 3. Sort by popularity
  { $sort: { totalEnrollments: -1 } },

  // 4. Return top 5 tags
  { $limit: 5 }
]);
```

---

# Multiple Choice Questions

### 1. What type of relational join does the MongoDB `$lookup` aggregation stage perform?
A. Full Outer Join
B. Left Outer Join
C. Inner Cross Join
D. Cartesian Product only
**Answer:** B
**Explanation:** `$lookup` performs a Left Outer Join; it includes all input documents from the local collection even if no matching documents exist in the joined collection.
---

### 2. What data structure does the `$lookup` stage assign to the output field designated by `as`?
A. A single JSON string
B. An Array of matching documents (which may be empty if no match exists)
C. An integer count
D. A boolean flag
**Answer:** B
**Explanation:** `$lookup` always outputs an array for the `as` property, holding zero, one, or many joined documents.
---

### 3. What does the `$unwind` stage do when applied to an array with 4 elements?
A. It deletes the array from disk.
B. It splits the single input document into 4 separate output documents, each containing one element of the array.
C. It sorts the array items in reverse order.
D. It concatenates the 4 items into a single string.
**Answer:** B
**Explanation:** `$unwind` deconstructs an array field, outputting one document for each element in the array.
---

### 4. What happens by default in `$unwind` if a document has an empty array `[]` or the field is missing/null?
A. The document is ignored and omitted from the output stream.
B. MongoDB crashes with a NullPointerException.
C. It creates a document with `"undefined"`.
D. It throws an index warning.
**Answer:** A
**Explanation:** By default, `$unwind` discards documents where the target array is empty or missing (unless `{ preserveNullAndEmptyArrays: true }` is specified).
---

### 5. Why should the `foreignField` in a joined `$lookup` collection be indexed?
A. To prevent MongoDB from corrupting data.
B. Without an index on `foreignField`, MongoDB must perform a full collection scan for every single document in the pipeline, crippling query performance.
C. Indexes are mandatory for `$unwind`.
D. Unindexed lookups run only in memory.
**Answer:** B
**Explanation:** During a `$lookup`, MongoDB queries the `from` collection for each input document; indexing `foreignField` turns these lookups into rapid index seeks.
---
