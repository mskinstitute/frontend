# One-to-Few (Embedded) vs One-to-Many (Referenced) Data Modeling

In relational databases, normalization dictates splitting entities across multiple tables linked by foreign keys. In MongoDB, data modeling is governed by the golden rule: **"Data that is accessed together should be stored together."** Choosing between **Embedding (Denormalization)** and **Referencing (Normalization)** is the most crucial architectural decision in NoSQL system design.

---

## 1. The Three Cardinal Rules of MongoDB Data Modeling

1. **Rule 1:** Favor embedding unless there is a compelling reason not to.
2. **Rule 2:** Needing to access an object on its own is a compelling reason not to embed it.
3. **Rule 3:** Avoid arrays that grow without bound (the 16 MB document size limit).

---

## 2. Approach 1: Embedding (Denormalization / Subdocuments)

When related data has a **One-to-Few** or **One-to-Squillions** relationship that is always retrieved together:

```javascript
// User document with embedded addresses
const userSchema = new Schema({
  name: String,
  email: String,
  addresses: [
    {
      street: String,
      city: String,
      postalCode: String,
      isDefault: Boolean
    }
  ]
});
```

### When to Embed:
- **One-to-Few:** A user has 2 or 3 shipping addresses; an article has 3 tags.
- **Atomic Updates:** Updating a parent and its subdocuments in a single atomic write operation without transactions.
- **Read Performance:** Fetching the parent retrieves all data in a single disk read without joins.

---

## 3. Approach 2: Referencing (Normalization / Document Links)

When data has a **One-to-Many (Unbounded)** or **Many-to-Many** relationship, or when child entities must be queried independently:

```javascript
// Post Schema referencing author
const postSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
});

// User Schema (keeps user document lean)
const userSchema = new Schema({
  name: String,
  email: String
});
```

### When to Reference:
- **One-to-Squillions:** A YouTube channel with 10,000,000 log events or comments. Embedding an unbounded array would quickly breach MongoDB's **16 MB maximum document size limit**!
- **Independent Queries:** When child documents must be searched, filtered, and paginated on their own.
- **Frequently Changing Data:** Storing mutable shared entities in one place prevents having to update thousands of duplicate embedded copies.

---

# Multiple Choice Questions

### 1. What is the hard maximum BSON document size limit enforced by MongoDB?
A. 1 MB
B. 16 MB
C. 64 MB
D. Unlimited
**Answer:** B
**Explanation:** MongoDB enforces a maximum single BSON document size limit of 16 MB to prevent documents from consuming excessive RAM during queries.
---

### 2. Why is embedding an unbounded array (such as all historical server logs or all user comments) directly inside a parent document considered an anti-pattern?
A. Arrays cannot contain more than 10 items in MongoDB.
B. As the array grows indefinitely over time, the document will eventually hit the 16 MB limit and fail to save.
C. Unbounded arrays disable JavaScript.
D. MongoDB deletes large arrays automatically.
**Answer:** B
**Explanation:** Unbounded array growth risks breaching MongoDB's 16MB document boundary and leads to continuous document relocation on disk.
---

### 3. What is the general rule of thumb for data modeling in MongoDB?
A. Always split every field into its own table.
B. Data that is accessed together should be stored together.
C. Never use references.
D. Only store numbers, not strings.
**Answer:** B
**Explanation:** Designing for application access patterns is the core principle: grouping data queried together into single documents minimizes I/O and query latency.
---

### 4. When modeling a Many-to-Many relationship between Students and Courses, which pattern is most appropriate?
A. Storing all students inside a single JSON string.
B. Two-Way Referencing: Storing an array of Course ObjectIds on the Student document, and/or Student ObjectIds on Course documents.
C. Storing the data in an Excel spreadsheet.
D. Embedding the entire course syllabus 5,000 times inside each student record.
**Answer:** B
**Explanation:** Two-way referencing using arrays of `ObjectId` references models Many-to-Many relationships efficiently while avoiding redundant data replication.
---

### 5. In which scenario is Document Embedding strictly superior to Document Referencing?
A. When an entity has millions of child records added daily.
B. When related data is small, bounded (One-to-Few), and almost always read simultaneously with the parent record.
C. When child records are constantly queried independently without the parent.
D. When the parent document is already 15.9 MB.
**Answer:** B
**Explanation:** Bounded One-to-Few relationships that are always accessed with the parent benefit from the zero-join, single-read performance of embedding.
---
