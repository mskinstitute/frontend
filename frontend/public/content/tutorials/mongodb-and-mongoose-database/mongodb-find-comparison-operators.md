# Find Queries & Comparison Operators ($eq, $gt, $in, $nin)

Querying data in MongoDB is accomplished using the `find()` and `findOne()` methods. Unlike SQL's `SELECT * FROM table WHERE condition`, MongoDB queries are expressed as JSON/BSON filter documents using specialized **query operators**.

---

## 1. Finding Documents: `findOne()` vs `find()`

```javascript
// 1. findOne(): Returns the first matching document (or null)
const user = await db.collection('users').findOne({ email: 'priya@example.com' });

// 2. find(): Returns a CURSOR over all matching documents
const cursor = db.collection('courses').find({ isPublished: true });
const courses = await cursor.toArray(); // Convert cursor into JavaScript array
```

---

## 2. Comparison Operators Overview

| Operator | Meaning | Example |
| :--- | :--- | :--- |
| `$eq` | Equals | `{ status: { $eq: 'ACTIVE' } }` (or shorthand `{ status: 'ACTIVE' }`) |
| `$ne` | Not equals | `{ role: { $ne: 'banned' } }` |
| `$gt` | Greater than | `{ price: { $gt: 500 } }` |
| `$gte` | Greater than or equal to | `{ age: { $gte: 18 } }` |
| `$lt` | Less than | `{ inventory: { $lt: 10 } }` |
| `$lte` | Less than or equal to | `{ rating: { $lte: 4.5 } }` |
| `$in` | Matches any value in array | `{ category: { $in: ['Web', 'AI', 'Cloud'] } }` |
| `$nin` | Matches none of the values | `{ status: { $nin: ['ARCHIVED', 'DELETED'] } }` |

---

## 3. Practical Example: Querying Numeric Ranges and Inclusions

```javascript
// Find premium courses priced between 1,000 and 5,000 in specific categories
const premiumCourses = await db.collection('courses').find({
  category: { $in: ['Full-Stack', 'Data Science'] },
  price: { $gte: 1000, $lte: 5000 },
  isPublished: true
}).toArray();

console.log(`Found ${premiumCourses.length} matching courses.`);
```

### Querying Nested Subdocuments:
Use **dot notation** enclosed in quotes to query fields inside embedded subdocuments:

```javascript
// Query courses where instructor's experience is >= 5 years
const expertCourses = await db.collection('courses').find({
  'instructor.experienceYears': { $gte: 5 }
}).toArray();
```

---

# Multiple Choice Questions

### 1. What does `collection.find()` return in the MongoDB Node.js driver?
A. An immediate JavaScript array of all documents in the database.
B. A MongoDB Cursor, which can be iterated or converted to an array using `.toArray()`.
C. A string containing SQL statements.
D. A boolean indicating whether records exist.
**Answer:** B
**Explanation:** `collection.find()` returns a Cursor pointer that streams results lazily from the server rather than buffering all records at once.
---

### 2. Which comparison operator selects documents where a field matches any value specified in an array?
A. `$all`
B. `$in`
C. `$contains`
D. `$any`
**Answer:** B
**Explanation:** The `$in` operator matches documents where the value of a field equals any item in the provided array.
---

### 3. How do you query a field named `city` located inside an embedded subdocument `address` in MongoDB?
A. `{ address->city: 'Delhi' }`
B. `{ 'address.city': 'Delhi' }`
C. `{ address: { city: 'Delhi' } }` (strict exact match only)
D. `{ address[city]: 'Delhi' }`
**Answer:** B
**Explanation:** Dot notation enclosed in quotation marks (`'address.city'`) is the standard MongoDB syntax for inspecting nested subdocument properties.
---

### 4. What filter matches all products whose `rating` is strictly greater than 4.5?
A. `{ rating: { $gt: 4.5 } }`
B. `{ rating: { $gte: 4.5 } }`
C. `{ rating: > 4.5 }`
D. `{ rating: { $eq: 4.5 } }`
**Answer:** A
**Explanation:** `$gt` stands for "greater than", selecting only documents where the value is strictly higher than the target value.
---

### 5. What will `collection.findOne({ email: 'nonexistent@test.com' })` return?
A. Throws a `NotFoundException`.
B. An empty array `[]`.
C. `null`.
D. An empty object `{}`.
**Answer:** C
**Explanation:** `findOne()` returns `null` when no documents match the query criteria.
---
