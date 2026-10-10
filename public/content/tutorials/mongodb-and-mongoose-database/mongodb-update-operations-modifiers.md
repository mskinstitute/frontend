# Update Operations: updateOne, updateMany & Field Modifiers ($set, $inc, $push)

In MongoDB, modifying documents requires atomic update operators. Replacing an entire document accidentally is an infamous beginner mistake. MongoDB provides precise atomic field modifiers like **`$set`**, **`$inc`**, **`$push`**, and **`$pull`** to update documents safely.

---

## 1. Updating Documents: `updateOne()` vs `updateMany()`

- `updateOne(filter, update, options)`: Updates the first matching document.
- `updateMany(filter, update, options)`: Updates all documents matching the filter.

```javascript
// Update a single user's status
const result = await db.collection('users').updateOne(
  { _id: new ObjectId('64fa123456789abcdef01234') },
  { $set: { status: 'ACTIVE', lastLogin: new Date() } }
);

console.log('Matched:', result.matchedCount, 'Modified:', result.modifiedCount);
```

---

## 2. Essential Field Update Modifiers

| Operator | Action | Example |
| :--- | :--- | :--- |
| **`$set`** | Sets or creates the value of a field | `{ $set: { price: 2999, 'meta.verified': true } }` |
| **`$unset`** | Deletes a field from the document | `{ $unset: { temporaryToken: "" } }` |
| **`$inc`** | Increments/decrements a numeric field atomically | `{ $inc: { views: 1, inventory: -1 } }` |
| **`$min` / `$max`** | Updates only if the value is less/greater than current | `{ $max: { highScore: 980 } }` |
| **`$currentDate`** | Sets field to current timestamp or Date | `{ $currentDate: { updatedAt: true } }` |

---

## 3. Array Modifiers: `$push`, `$pull`, `$addToSet`

MongoDB allows modifying array fields directly inside a document without fetching the document into JavaScript memory:

- **`$push`:** Appends a new item to an array:
```javascript
await db.collection('courses').updateOne(
  { slug: 'full-stack-mern-mastery' },
  { $push: { tags: 'docker' } }
);
```

- **`$addToSet`:** Adds an item **only if it does not already exist** in the array (prevents duplicate tags):
```javascript
await db.collection('courses').updateOne(
  { slug: 'full-stack-mern-mastery' },
  { $addToSet: { tags: 'react' } } // Will not duplicate if 'react' is already present!
);
```

- **`$pull`:** Removes all occurrences of matching items from an array:
```javascript
await db.collection('courses').updateOne(
  { slug: 'full-stack-mern-mastery' },
  { $pull: { tags: 'deprecated-tech' } }
);
```

---

## 4. Upserts (`upsert: true`)

An **Upsert** is a hybrid operation: if a matching document is found, it is updated; if no document matches the filter, a new document is inserted:

```javascript
await db.collection('analytics').updateOne(
  { pageUrl: '/courses/mern', date: '2026-09-15' },
  { $inc: { views: 1 } },
  { upsert: true } // Creates record on 1st visit, increments on subsequent visits!
);
```

---

# Multiple Choice Questions

### 1. What happens if you accidentally pass `{ price: 1999 }` without `$set` as the update parameter in `collection.updateOne()`?
A. MongoDB modifies only the price field.
B. Modern MongoDB drivers throw an error stating that update documents must contain atomic operators like `$set`.
C. MongoDB wipes all collections.
D. MongoDB converts the document to SQL.
**Answer:** B
**Explanation:** Modern MongoDB drivers reject update objects lacking atomic update operators (like `$set`) to prevent accidental document overwrite.
---

### 2. Which operator increments a numerical field atomically, eliminating race conditions during high-concurrency balance or view counter updates?
A. `$add`
B. `$inc`
C. `$plus`
D. `$count`
**Answer:** B
**Explanation:** `$inc` performs an atomic server-side numeric increment/decrement without requiring a prior read operation.
---

### 3. How does `$addToSet` differ from `$push` when modifying an array field?
A. `$addToSet` sorts the array alphabetically.
B. `$addToSet` adds an element only if it does not already exist in the array, ensuring uniqueness, whereas `$push` appends duplicates unconditionally.
C. `$addToSet` only works with numbers.
D. `$push` removes elements from arrays.
**Answer:** B
**Explanation:** `$addToSet` treats the array like a mathematical set, ensuring uniqueness by preventing duplicate values.
---

### 4. What does the `{ upsert: true }` option accomplish in an update operation?
A. It forces the update to run on all secondary replica nodes.
B. If a document matching the query exists, it updates it; otherwise, it inserts a new document based on the query and update operations.
C. It rolls back the database if the update takes longer than 10ms.
D. It deletes obsolete documents.
**Answer:** B
**Explanation:** "Upsert" is a combination of Update and Insert; it updates matching documents or creates a new one if no match is found.
---

### 5. Which operator completely removes a specified field from a document?
A. `$delete`
B. `$remove`
C. `$unset`
D. `$drop`
**Answer:** C
**Explanation:** The `$unset` operator deletes the specified field from the matching document.
---
