# Defining Models & Column Constraints in SQLAlchemy

An **Object Relational Mapper (ORM)** bridges the gap between object-oriented Python code and relational database tables. Instead of querying raw SQL tables, you define Python classes that subclass `db.Model`. Each class represents a database table, and each instance represents a row.

---

## 1. Declaring a Modern SQLAlchemy Model

In Flask-SQLAlchemy, models subclass `db.Model`. Attributes map to database columns via `db.Column`:

```python
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Course(db.Model):
    # Table name defaults to lowercase class name ('course'), but can be set explicitly:
    __tablename__ = "courses"

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # String & Text Columns with Constraints
    title = db.Column(db.String(150), nullable=False, unique=True, index=True)
    slug = db.Column(db.String(160), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)

    # Numeric Types
    price = db.Column(db.Numeric(precision=10, scale=2), nullable=False, default=0.00)
    rating = db.Column(db.Float, default=5.0)

    # Booleans & Integers
    is_published = db.Column(db.BooleanField, default=False, nullable=False)
    enrollment_count = db.Column(db.Integer, default=0)

    # Timestamps
    created_at = db.Column(
        db.DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = db.Column(
        db.DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self):
        return f"<Course id={self.id} title='{self.title}'>"
```

---

## 2. Common SQLAlchemy Column Data Types

| SQLAlchemy Type | SQL Equivalent | Description |
| :--- | :--- | :--- |
| `db.Integer` | `INTEGER` | 32-bit signed integer |
| `db.BigInteger` | `BIGINT` | 64-bit integer (useful for high-volume transactions) |
| `db.String(N)` | `VARCHAR(N)` | Variable-length string with maximum length N |
| `db.Text` | `TEXT` | Unbounded text string (articles, blog bodies) |
| `db.Boolean` | `BOOLEAN` | True or False |
| `db.DateTime` | `TIMESTAMP` | Python `datetime.datetime` object |
| `db.Date` | `DATE` | Python `datetime.date` object |
| `db.Float` | `FLOAT` | Floating-point real numbers |
| `db.Numeric(10,2)` | `NUMERIC / DECIMAL` | Exact fixed-point numbers (financial currencies) |

---

## 3. Essential Column Constraints

- `primary_key=True`: Establishes the unique identifier for table rows and creates an indexed primary key.
- `nullable=False`: Enforces a database-level `NOT NULL` constraint; inserting `None` raises an `IntegrityError`.
- `unique=True`: Enforces unique values across all rows (ideal for emails, usernames, slugs).
- `index=True`: Generates a B-tree database index for fast query lookup performance.
- `default=value`: Provides a default value when inserting a new record. **Note:** pass callables without parentheses (e.g. `default=datetime.utcnow`) so the function executes at insert time!

---

## Practice Quiz

### Q1: What base class must every Flask-SQLAlchemy model inherit from?
- A) `models.Model`
- B) `db.Model`
- C) `sqlalchemy.Base`
- D) `object`
**Answer:** B
**Explanation:** Models in Flask-SQLAlchemy subclass `db.Model` to register with the declarative mapping metadata.

### Q2: Why is `db.Numeric` preferred over `db.Float` for storing prices and financial currencies?
- A) `db.Numeric` uses less disk space
- B) `db.Float` suffers from binary floating-point rounding inaccuracies, whereas `db.Numeric` stores exact decimal digits
- C) SQLite does not support floats
- D) `db.Numeric` encrypts the currency
**Answer:** B
**Explanation:** Financial amounts require exact precision. Binary floats introduce rounding errors (e.g., 0.1 + 0.2 = 0.30000000000000004), whereas `db.Numeric` / `Decimal` preserves exact decimal representation.

### Q3: Why should a timestamp default be passed as a callable (`default=datetime.utcnow`) rather than a called function (`default=datetime.utcnow()`)?
- A) Calling the function executes it once when the Python module loads, freezing the timestamp for all future records
- B) Calling the function crashes the database
- C) Python functions cannot be called in class definitions
- D) SQLAlchemy requires lambdas
**Answer:** A
**Explanation:** Passing `datetime.utcnow()` evaluates the function once at application boot time. Passing the callable `datetime.utcnow` ensures the function is evaluated dynamically whenever a new row is inserted.

### Q4: What does setting `index=True` on a column do in the underlying database?
- A) Formats the text as an HTML index page
- B) Creates a B-tree search index on the column to accelerate SELECT query lookup speeds
- C) Prevents duplicate records from being added
- D) Makes the column auto-incrementing
**Answer:** B
**Explanation:** Creating an index on frequently queried columns (such as email, username, or foreign keys) dramatically improves database lookup performance.

### Q5: What does the `__repr__` method do on a model class?
- A) Computes the hash of the model
- B) Defines a readable string representation of model instances for debugging and logging in the Python console
- C) Renders the HTML template
- D) Serializes the model to JSON
**Answer:** B
**Explanation:** `__repr__` provides an informative string representation (e.g., `<Course id=1 title='Flask'>`) when inspecting objects in the Python shell or logs.
