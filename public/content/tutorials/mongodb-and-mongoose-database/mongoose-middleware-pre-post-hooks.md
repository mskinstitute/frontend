# Pre and Post Middleware Hooks (Document & Query Middleware)

Mongoose middleware (also referred to as **Pre and Post Hooks**) allows developers to execute logic automatically during the lifecycle of a document or query. Pre/Post hooks are essential for automated **password hashing**, **slug generation**, **cascading deletes**, and **query filtering**.

---

## 1. Document Middleware vs Query Middleware

- **Document Middleware:** Operates on the individual document instance (`this` points to the document). Hooks: `save`, `validate`, `remove`, `init`.
- **Query Middleware:** Operates on a Mongoose query object (`this` points to the query). Hooks: `find`, `findOne`, `findOneAndUpdate`, `countDocuments`.

---

## 2. Document Middleware Example: Slug Generation & Password Hashing

```javascript
import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: String,
  email: String,
  password: {
    type: String,
    required: true,
    select: false // Exclude password from query results by default
  },
  slug: String
});

// PRE-SAVE HOOK: Automatically hash password if modified
userSchema.pre('save', async function(next) {
  // Only run if password field was modified (or created)
  if (!this.isModified('password')) return next();

  // Hash password with cost factor of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// PRE-SAVE HOOK: Automatically generate URL slug from name
userSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
```

---

## 3. Query Middleware Example: Soft-Delete Auto-Filter

To implement "soft deletes" (hiding deleted records rather than permanently deleting them), use a `pre(/^find/)` regex hook to automatically filter out soft-deleted documents on all `find` queries:

```javascript
// Automatically exclude soft-deleted documents from any find, findOne, etc.
courseSchema.pre(/^find/, function(next) {
  // 'this' refers to the Query object
  this.find({ isDeleted: { $ne: true } });
  this.start = Date.now();
  next();
});

// POST-FIND HOOK: Measure and log query duration
courseSchema.post(/^find/, function(docs, next) {
  const elapsed = Date.now() - this.start;
  console.log(`Query completed in ${elapsed}ms`);
  next();
});
```

---

# Multiple Choice Questions

### 1. In a Mongoose `pre('save')` document middleware hook, what does `this` keyword refer to?
A. The Express HTTP response object.
B. The document instance currently being validated and saved.
C. The global Node.js process.
D. The MongoDB connection pool.
**Answer:** B
**Explanation:** In document middleware like `pre('save')`, `this` points to the specific document being persisted.
---

### 2. Why is checking `this.isModified('password')` critical before hashing a password in a `pre('save')` hook?
A. To prevent hashing an already-hashed password when a user merely updates their email or profile picture.
B. It reduces server power consumption.
C. Bcrypt crashes if run more than once.
D. It prevents the database from closing.
**Answer:** A
**Explanation:** If a user updates their profile name without touching their password, omitting `isModified('password')` would hash the existing hash, locking the user out permanently.
---

### 3. What does regex middleware `schema.pre(/^find/, ...)` match?
A. Only queries that search for regular expressions.
B. Any query method that starts with 'find' (e.g., `find`, `findOne`, `findOneAndUpdate`, `findById`).
C. CSS class finders.
D. Only exact string matches.
**Answer:** B
**Explanation:** Passing the regex `/^find/` binds the middleware hook to all query methods starting with "find" (`find`, `findOne`, `findOneAndRemove`, etc.).
---

### 4. What parameters are passed to a `post('save')` hook?
A. `(doc, next)`
B. `(req, res)`
C. `(sql, error)`
D. `(socket, cluster)`
**Answer:** A
**Explanation:** Post-save hooks receive the freshly saved document (`doc`) and the `next` callback function.
---

### 5. What must you call at the end of asynchronous middleware if you use the `next` parameter callback style?
A. `next()`
B. `res.send()`
C. `process.exit()`
D. `db.close()`
**Answer:** A
**Explanation:** If using the callback signature `function(next)`, calling `next()` is required to proceed to the next middleware or save operation.
---
