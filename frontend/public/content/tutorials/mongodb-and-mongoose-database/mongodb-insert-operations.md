# Insert Operations: insertOne, insertMany & Write Concerns

Writing documents into MongoDB is the initial step in any data lifecycle. MongoDB provides high-throughput insert methods with granular control over batch processing, ordered execution, and **Write Concerns**.

---

## 1. Inserting a Single Document: `insertOne()`

The `insertOne()` method inserts a single document into a collection. If the document does not contain a top-level `_id` field, the driver generates an `ObjectId` automatically.

```javascript
// Inserting into 'courses' collection
const result = await db.collection('courses').insertOne({
  title: 'Full-Stack MERN Mastery',
  slug: 'full-stack-mern-mastery',
  price: 4999,
  category: 'Web Development',
  isPublished: true,
  tags: ['react', 'node', 'mongodb', 'express'],
  instructor: {
    name: 'Sumit Sharma',
    experienceYears: 10
  },
  createdAt: new Date()
});

console.log('Inserted ID:', result.insertedId);
console.log('Acknowledged:', result.acknowledged); // true
```

---

## 2. Inserting Multiple Documents: `insertMany()`

To insert multiple records in a single network round-trip, pass an array of documents to `insertMany()`:

```javascript
const students = [
  { name: 'Aarav Patel', email: 'aarav@example.com', enrolledAt: new Date() },
  { name: 'Priya Sharma', email: 'priya@example.com', enrolledAt: new Date() },
  { name: 'Rohan Gupta', email: 'rohan@example.com', enrolledAt: new Date() }
];

const batchResult = await db.collection('students').insertMany(students, {
  ordered: true // Default: stops on first error. Set to false for unordered inserts.
});

console.log('Inserted Count:', batchResult.insertedCount);
console.log('Inserted IDs:', batchResult.insertedIds);
```

### Ordered vs Unordered Inserts:
- **`ordered: true` (Default):** MongoDB processes documents sequentially. If document 2 fails (e.g. duplicate key), the operation halts immediately. Documents after 2 are **not** inserted.
- **`ordered: false`:** MongoDB attempts to insert all documents in parallel. If document 2 fails, MongoDB reports the error but continues inserting documents 3, 4, etc.

---

## 3. Understanding Write Concerns (`w`)

A **Write Concern** describes the level of acknowledgment requested from MongoDB for write operations:

- **`w: 1` (Acknowledged):** The Primary node acknowledges the write has been written to memory/journal. Fast, standard default.
- **`w: "majority"`:** The write must be committed by a majority of replica set members before returning success. Protects against data loss during sudden primary failover.
- **`j: true` (Journaled):** Guarantees the write has been written to the on-disk journal before responding.

```javascript
// High-security financial transaction write concern:
await db.collection('transactions').insertOne(
  { accountId: 'acc_01', amount: 50000, type: 'CREDIT' },
  { writeConcern: { w: 'majority', j: true, wtimeoutMS: 5000 } }
);
```

---

# Multiple Choice Questions

### 1. What happens if you insert a document into a MongoDB collection without providing an `_id` field?
A. MongoDB rejects the document and throws a `MissingKeyException`.
B. MongoDB automatically creates an `_id` field populated with a new unique 12-byte `ObjectId`.
C. MongoDB stores the document in a temporary lost-and-found table.
D. MongoDB sets `_id` to `null`.
**Answer:** B
**Explanation:** MongoDB enforces an `_id` primary key for every document; if omitted, the driver or server generates a unique `ObjectId` automatically.
---

### 2. In `collection.insertMany(docs, { ordered: true })`, what occurs if the 3rd document violates a unique index constraint?
A. The entire database is wiped.
B. Documents 1 and 2 remain inserted, but the operation halts and subsequent documents (4, 5...) are not processed.
C. All documents including 1 and 2 are rolled back automatically.
D. The 3rd document overwrites the existing duplicate.
**Answer:** B
**Explanation:** In an ordered insert operation, execution terminates on the first failure, leaving preceding successful inserts in place while discarding subsequent ones.
---

### 3. How do you instruct `insertMany()` to continue inserting remaining documents even if one document in the batch fails?
A. Set `{ ordered: false }` in the options object.
B. Set `{ ignoreErrors: true }`.
C. Pass `{ forceAll: true }`.
D. Use a while loop.
**Answer:** A
**Explanation:** Unordered inserts (`ordered: false`) tell MongoDB to attempt inserting all documents regardless of individual document errors.
---

### 4. What does the write concern option `{ w: 'majority' }` guarantee?
A. That all databases in the country are synchronized.
B. That the write operation has been committed to a majority of active replica set member nodes before acknowledging success.
C. That the write has been approved by the database administrator.
D. That no other user can read the database.
**Answer:** B
**Explanation:** `w: 'majority'` ensures high durability by confirming the write has been written to more than 50% of replica nodes in the cluster.
---

### 5. What property on the result object of `collection.insertOne()` contains the generated primary key?
A. `result.id`
B. `result.insertedId`
C. `result.newKey`
D. `result.primaryKey`
**Answer:** B
**Explanation:** The MongoDB Node.js driver returns `insertedId` on the InsertOneResult object containing the document's `_id`.
---
