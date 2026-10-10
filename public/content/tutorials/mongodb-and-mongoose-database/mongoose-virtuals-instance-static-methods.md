# Virtual Properties, Instance Methods & Static Model Methods

Mongoose allows adding domain behavior directly to your data models. Instead of scattering helper functions throughout controllers, you can attach **Virtual Properties** (computed properties not stored in MongoDB), **Instance Methods** (actions on a single document), and **Static Methods** (queries on the entire model).

---

## 1. Virtual Properties (Computed Attributes)

A **Virtual Property** is a logical field that can be read and written like a normal property, but is **never persisted** to the MongoDB database:

```javascript
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true }
}, {
  // Ensure virtuals are included when converting to JSON or Objects
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define virtual getter for 'fullName'
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Define virtual getter for calculated 'age'
userSchema.virtual('age').get(function() {
  const diffMs = Date.now() - this.birthDate.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});
```

*Virtual properties cannot be queried directly with `Model.find({ fullName: '...' })` because they do not exist on disk in MongoDB!*

---

## 2. Instance Methods (`methods`)

An **Instance Method** is a custom function available on every individual document instance:

```javascript
import bcrypt from 'bcrypt';

// Method to verify passwords during authentication
userSchema.methods.comparePassword = async function(candidatePassword) {
  // 'this.password' contains the stored bcrypt hash
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};
```

---

## 3. Static Methods (`statics`)

A **Static Method** is a custom function attached directly to the compiled Model itself, ideal for specialized queries:

```javascript
// Custom static method to find top-rated active courses
courseSchema.statics.getFeaturedCourses = function(limit = 6) {
  // 'this' refers to the Course model
  return this.find({ isPublished: true, rating: { $gte: 4.5 } })
    .sort('-rating')
    .limit(limit)
    .populate('instructor', 'name avatar');
};

// Invoking static method:
const topCourses = await Course.getFeaturedCourses(10);
```

---

# Multiple Choice Questions

### 1. Where are Mongoose Virtual Properties stored?
A. In the MongoDB BSON disk storage file.
B. They are computed dynamically in Node.js memory and never persisted to the database.
C. In a Redis cache cluster.
D. Inside the browser cookies.
**Answer:** B
**Explanation:** Virtuals are pure JavaScript getters/setters computed on the fly in application memory; they occupy zero storage in MongoDB.
---

### 2. Why can't you run `User.find({ fullName: 'Sumit Sharma' })` when `fullName` is defined as a Mongoose virtual?
A. Full names must be written in uppercase.
B. Virtual fields do not exist on disk in the MongoDB collection, so database query filters cannot match against them.
C. Mongoose does not support string queries.
D. Virtuals require SQL databases.
**Answer:** B
**Explanation:** Because virtual properties exist only on Mongoose document instances in Node.js memory, MongoDB's database engine has no knowledge of them during queries.
---

### 3. What is the difference between an Instance Method and a Static Method in Mongoose?
A. Instance methods are written in Python; Static methods are in JavaScript.
B. An Instance Method operates on a single document instance (`doc.comparePassword()`), while a Static Method is called on the Model itself (`User.findByEmail()`).
C. Static methods can only be run once per day.
D. There is no difference.
**Answer:** B
**Explanation:** Instance methods (`schema.methods`) belong to individual document instances, whereas static methods (`schema.statics`) are attached to the model constructor.
---

### 4. Which schema option must be set to ensure virtual fields are displayed when sending a document via `res.json(user)`?
A. `{ virtuals: true }` inside `toJSON` and `toObject` schema options.
B. `{ emitVirtuals: 'always' }`.
C. `{ exposeAll: true }`.
D. `{ serialize: true }`.
**Answer:** A
**Explanation:** To serialize virtuals into JSON payloads (such as Express `res.json()`), the schema options must specify `toJSON: { virtuals: true }`.
---

### 5. In an instance method `userSchema.methods.getTier = function() { ... }`, what does `this` point to?
A. The global Express app.
B. The specific user document instance on which the method was called.
C. The HTTP client socket.
D. The Mongoose connection string.
**Answer:** B
**Explanation:** Inside an instance method defined with a standard `function()` keyword, `this` references the calling document instance.
---
