# Built-in & Custom Schema Validations with Custom Error Messages

Data integrity starts at the model layer. Mongoose provides built-in validators for numbers, strings, dates, and arrays, as well as the ability to define asynchronous **Custom Validators** that enforce complex business rules before data reaches the database.

---

## 1. Built-in Mongoose Validators

| Validator | Target Types | Description | Example |
| :--- | :--- | :--- | :--- |
| `required` | All types | Ensures field exists and is not null | `required: [true, 'Email is mandatory']` |
| `min` / `max` | Number, Date | Enforces minimum and maximum bounds | `min: [0, 'Price must be positive']` |
| `minlength` / `maxlength` | String | Restricts string character count | `minlength: [8, 'Password too short']` |
| `enum` | String | Restricts string to allowed array of values | `enum: ['draft', 'published', 'archived']` |
| `match` | String | Validates string against a Regular Expression | `match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email']` |

---

## 2. Writing Custom Asynchronous Validators

Custom validators use the `validate` property. You can supply a synchronous function, an asynchronous function returning a Promise/Boolean, or an async validator with custom error messages:

```javascript
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Note: unique creates a database index, not a validator!
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function(val) {
        // 'this' points to the current document being created
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) must be less than the regular price'
    }
  },
  price: {
    type: Number,
    required: true
  }
});
```

*Note: In custom validators, `this` only points to the document on new document creation (`.save()`). For updates via `findOneAndUpdate()`, use `{ runValidators: true, context: 'query' }`.*

---

## 3. Triggering Validation on Updates

By default, Mongoose executes schema validators when creating documents via `.save()` or `.create()`. When running update queries like `findByIdAndUpdate()` or `updateOne()`, Mongoose skips validators by default for performance!

To force validation on updates, you **must** pass `{ runValidators: true }`:

```javascript
const updatedCourse = await Course.findByIdAndUpdate(
  courseId,
  { price: -50 }, // Invalid!
  {
    new: true, // Return updated document
    runValidators: true // Enforces schema validation rules!
  }
);
```

---

# Multiple Choice Questions

### 1. Why must `{ runValidators: true }` be explicitly specified when calling `findByIdAndUpdate()` in Mongoose?
A. Because Mongoose disables database access on updates.
B. By default, Mongoose only runs schema validators on `.save()` and `.create()`; it skips validation on update queries unless instructed.
C. It allows users to write raw SQL.
D. It prevents documents from being updated twice.
**Answer:** B
**Explanation:** For historical performance reasons, Mongoose does not run schema validators on `update()` queries unless the `{ runValidators: true }` option is provided.
---

### 2. Is `unique: true` in a Mongoose schema a validator?
A. Yes, it is a built-in Mongoose validator that runs before saving.
B. No; it is a helper that instructs MongoDB to create a unique database index, not a validation function.
C. Yes, it hashes the string.
D. No, it is only for comments.
**Answer:** B
**Explanation:** `unique: true` is not a validator; it tells MongoDB to build a unique index in the background. Duplicate violations throw an `E11000` database error, not a `ValidationError`.
---

### 3. In a custom validator function, how do you access the value of the field being validated?
A. As the first parameter passed to the validator function.
B. By reading `process.argv`.
C. Through `document.body`.
D. By calling `Math.random()`.
**Answer:** A
**Explanation:** Mongoose passes the field's current value as the first argument to the validator function (`function(value) { ... }`).
---

### 4. Which built-in validator ensures that a String matches a predefined list of allowed choices?
A. `whitelist`
B. `enum`
C. `options`
D. `inArray`
**Answer:** B
**Explanation:** The `enum` validator restricts a string field to an explicit list of permissible values (e.g. `enum: ['admin', 'student']`).
---

### 5. What type of error object is thrown when Mongoose validation fails?
A. `DatabaseCrashError`
B. `mongoose.Error.ValidationError`
C. `SyntaxError`
D. `TypeError`
**Answer:** B
**Explanation:** Mongoose throws a `ValidationError` containing an `errors` object that maps individual invalid field paths to their specific `ValidatorError` instances.
---
