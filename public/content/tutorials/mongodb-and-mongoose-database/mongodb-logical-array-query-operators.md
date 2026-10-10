# Logical, Element & Array Query Operators ($and, $or, $exists, $all)

Beyond simple value comparisons, enterprise querying requires compound Boolean logic, schema existence checks, and precise array pattern matching. MongoDB provides robust **Logical**, **Element**, and **Array** query operators.

---

## 1. Logical Query Operators: `$and`, `$or`, `$nor`, `$not`

- **`$or`:** Matches documents that satisfy at least one condition:
```javascript
// Find courses that are either free (price: 0) OR have a top rating (>= 4.8)
const featured = await db.collection('courses').find({
  $or: [
    { price: 0 },
    { rating: { $gte: 4.8 } }
  ]
}).toArray();
```

- **`$and`:** Explicit Boolean AND. While specifying multiple fields in a filter object implicitly applies AND, `$and` is required when targeting the same field with multiple complex conditions or combining multiple `$or` clauses:
```javascript
const query = await db.collection('users').find({
  $and: [
    { $or: [{ role: 'admin' }, { role: 'moderator' }] },
    { $or: [{ isActive: true }, { isSuperUser: true }] }
  ]
}).toArray();
```

---

## 2. Element Operators: `$exists` & `$type`

Because MongoDB is schema-flexible, documents within the same collection may contain different fields:

- **`$exists`:** Checks if a field is present in the document.
```javascript
// Find all users who have an optional 'phoneNumber' field
const usersWithPhone = await db.collection('users').find({
  phoneNumber: { $exists: true, $ne: null }
}).toArray();
```

- **`$type`:** Matches documents where the field is of a specific BSON type (e.g. `'string'`, `'number'`, `'date'`, `'array'`).

---

## 3. Array Query Operators: `$all`, `$size`, `$elemMatch`

- **`$all`:** Matches arrays that contain **all** specified elements, regardless of order or additional elements:
```javascript
// Match courses that teach BOTH 'react' AND 'nodejs'
const fullstackCourses = await db.collection('courses').find({
  tags: { $all: ['react', 'nodejs'] }
}).toArray();
```

- **`$size`:** Matches arrays with an exact number of elements:
```javascript
// Find articles with exactly 3 tags
const threeTags = await db.collection('articles').find({
  tags: { $size: 3 }
}).toArray();
```

- **`$elemMatch`:** Crucial for arrays of subdocuments! Ensures that a **single** subdocument satisfies multiple criteria:
```javascript
// Find students who have scored >= 90 on a 'Final Exam'
const topStudents = await db.collection('students').find({
  scores: {
    $elemMatch: { type: 'Final Exam', score: { $gte: 90 } }
  }
}).toArray();
```

---

# Multiple Choice Questions

### 1. Which operator queries documents where an array field contains ALL of the specified elements?
A. `$in`
B. `$all`
C. `$every`
D. `$containsAll`
**Answer:** B
**Explanation:** The `$all` operator selects documents where the array field contains every value specified in the query array.
---

### 2. Why is `$elemMatch` necessary when querying arrays of embedded subdocuments?
A. It sorts the array in descending order.
B. It guarantees that at least one single embedded document matches ALL specified criteria, rather than criteria matching across different array elements.
C. It converts subdocuments to strings.
D. It prevents duplicates.
**Answer:** B
**Explanation:** Without `$elemMatch`, a query with multiple conditions on array subdocuments can match if condition A is true on element 1 and condition B is true on element 2; `$elemMatch` enforces that both conditions occur in the exact same element.
---

### 3. What does `{ discount: { $exists: false } }` match?
A. Documents where `discount` is equal to 0.
B. Documents where the `discount` field is completely absent from the document schema.
C. Documents where `discount` is a boolean `false`.
D. All documents in the collection.
**Answer:** B
**Explanation:** `{ $exists: false }` selects documents that do not contain the specified field.
---

### 4. How do you query documents where `status` is either 'PENDING' OR 'IN_REVIEW'?
A. `{ status: { $or: ['PENDING', 'IN_REVIEW'] } }`
B. `{ status: { $in: ['PENDING', 'IN_REVIEW'] } }` or `{ $or: [{ status: 'PENDING' }, { status: 'IN_REVIEW' }] }`
C. `{ status: { $xor: ['PENDING', 'IN_REVIEW'] } }`
D. `{ status: 'PENDING' | 'IN_REVIEW' }`
**Answer:** B
**Explanation:** Both `$in` (for simple field equality) and `$or` can achieve this condition, with `$in` being the more concise and idiomatic choice for single fields.
---

### 5. What is the limitation of the `$size` operator in MongoDB queries?
A. It only works on strings.
B. It matches only exact array lengths (e.g. `$size: 3`) and cannot perform range comparisons like "size greater than 3".
C. It can only check sizes up to 10.
D. It deletes the array.
**Answer:** B
**Explanation:** MongoDB's `$size` operator only accepts exact integers and does not support range operators like `$gt` or `$lt`.
---
