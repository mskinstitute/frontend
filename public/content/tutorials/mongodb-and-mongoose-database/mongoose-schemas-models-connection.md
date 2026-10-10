# Mongoose Connection Lifecycle, Schemas & Compiled Models

While the native MongoDB driver provides low-level querying flexibility, real-world enterprise applications require structured data models, type casting, validation rules, and business logic. **Mongoose** is the industry-standard **Object Data Modeling (ODM)** library for MongoDB and Node.js.

---

## 1. Connecting Mongoose to MongoDB

Mongoose provides an intelligent connection pool that buffers queries until the database connection is officially established:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/msk_academy';

export async function connectDatabase() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 20, // Keep up to 20 socket connections open
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if server unreachable
      socketTimeoutMS: 45000 // Close idle sockets after 45s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
}

// Connection lifecycle event listeners
mongoose.connection.on('disconnected', () => console.warn('MongoDB connection lost!'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected cleanly.'));
```

---

## 2. Defining Schemas and Compiling Models

1. **Schema:** A blueprint that defines the structure of documents, default values, and data types within a collection.
2. **Model:** A compiled constructor compiled from the Schema that provides the interface for querying and saving documents in MongoDB.

```javascript
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// 1. Define the Schema
const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is mandatory'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    level: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        message: '{VALUE} is not a supported difficulty level'
      },
      default: 'All Levels'
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically injects and manages createdAt and updatedAt fields!
  }
);

// 2. Compile the Model (Creates 'courses' collection in lowercase plural)
const Course = model('Course', courseSchema);

export default Course;
```

---

## 3. Creating and Querying with Mongoose Models

```javascript
// Create and save a new document
const newCourse = await Course.create({
  title: 'Next.js 15 Full-Stack Framework',
  slug: 'nextjs-15-full-stack',
  price: 3499,
  level: 'Intermediate'
});

// Find documents
const publishedCourses = await Course.find({ isPublished: true })
  .select('title price level') // Field projection
  .sort('-price'); // Descending sort
```

---

# Multiple Choice Questions

### 1. What is Mongoose in relation to MongoDB?
A. A SQL query compiler.
B. An Object Data Modeling (ODM) library for Node.js that provides schema definition, type casting, validation, and query middleware.
C. A desktop GUI for viewing MongoDB documents.
D. A cloud hosting service.
**Answer:** B
**Explanation:** Mongoose is an ODM library that provides a schema-based solution for modeling application data on top of MongoDB.
---

### 2. When you compile a model with `mongoose.model('Product', productSchema)`, what name will Mongoose give to the underlying collection in MongoDB by default?
A. `Product`
B. `products` (lowercase, pluralized)
C. `Product_collection`
D. `tbl_products`
**Answer:** B
**Explanation:** Mongoose automatically converts the model name to lowercase and pluralizes it (e.g., `'Product'` becomes `'products'`, `'Category'` becomes `'categories'`).
---

### 3. What does setting `{ timestamps: true }` in the Mongoose Schema options do?
A. Deletes documents after 24 hours.
B. Automatically creates and updates `createdAt` and `updatedAt` Date fields on documents.
C. Records the server's time zone.
D. Measures query execution time.
**Answer:** B
**Explanation:** The `{ timestamps: true }` option instructs Mongoose to automatically assign and manage `createdAt` and `updatedAt` fields.
---

### 4. What happens when Mongoose receives a database operation before the initial connection to the MongoDB server finishes?
A. Mongoose immediately throws a crash exception.
B. Mongoose automatically buffers the operation internally and executes it as soon as the connection succeeds.
C. The query is permanently deleted.
D. Mongoose sends an email to the administrator.
**Answer:** B
**Explanation:** Mongoose features built-in operation buffering, queuing queries until the database driver successfully connects.
---

### 5. Which schema option removes surrounding whitespace from string inputs automatically before saving?
A. `strip: true`
B. `trim: true`
C. `clean: true`
D. `sanitize: true`
**Answer:** B
**Explanation:** Setting `trim: true` on a String field schema tells Mongoose to run JavaScript's `.trim()` on the input string before persistence.
---
