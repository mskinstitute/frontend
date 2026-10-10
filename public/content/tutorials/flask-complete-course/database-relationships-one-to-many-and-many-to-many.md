# Database Relationships (One-to-Many & Many-to-Many)

Real-world applications require relationships between entities: users write articles, courses contain lessons, and students enroll in multiple classes. SQLAlchemy models relationships using **Foreign Keys** and **Relationship Mappings**.

---

## 1. One-to-Many Relationship (1:N)

In a One-to-Many relationship, one parent record owns multiple child records (e.g., one `Instructor` has many `Course` offerings).

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Instructor(db.Model):
    __tablename__ = "instructors"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # 1:N Relationship
    # 'courses' property on Instructor returns a list of Course objects
    # 'back_populates' links to 'instructor' property on Course
    courses = db.relationship(
        "Course", 
        back_populates="instructor", 
        cascade="all, delete-orphan",
        lazy="select"
    )

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    
    # Foreign Key column pointing to parent table
    instructor_id = db.Column(
        db.Integer, 
        db.ForeignKey("instructors.id", ondelete="CASCADE"), 
        nullable=False
    )

    # Relationship linking back to parent
    instructor = db.relationship("Instructor", back_populates="courses")
```

### Cascade Rules:
Setting `cascade="all, delete-orphan"` ensures that if an `Instructor` is deleted from the database, all associated child `Course` records are automatically deleted as well, preventing orphaned records.

---

## 2. Many-to-Many Relationship (M:N)

In a Many-to-Many relationship, multiple students can enroll in multiple courses. This requires a third helper table called an **Association Table**:

```
+---------------+              +--------------------+              +------------+
|   students    | <==========> | enrollment_table   | <==========> |  courses   |
+---------------+   (1:N)      +--------------------+   (N:1)      +------------+
| id            |              | student_id (FK)    |              | id         |
| name          |              | course_id  (FK)    |              | title      |
+---------------+              +--------------------+              +------------+
```

```python
# Pure association table (no dedicated model class required)
enrollments = db.Table(
    "enrollments",
    db.Column("student_id", db.Integer, db.ForeignKey("students.id", ondelete="CASCADE"), primary_key=True),
    db.Column("course_id", db.Integer, db.ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
    db.Column("enrolled_at", db.DateTime, default=datetime.utcnow)
)

class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Many-to-Many relationship configured using 'secondary'
    enrolled_courses = db.relationship(
        "Course",
        secondary=enrollments,
        back_populates="enrolled_students",
        lazy="select"
    )

# Inside Course model:
# enrolled_students = db.relationship("Student", secondary=enrollments, back_populates="enrolled_courses")
```

---

## 3. Working with Related Objects in Python

SQLAlchemy manages relationships transparently using standard Python lists and objects:

```python
# Create Instructor
john = Instructor(name="John Doe", email="john@example.com")

# Assign courses via Python list append
py_course = Course(title="Python Mastery")
flask_course = Course(title="Flask Complete Course")
john.courses.append(py_course)
john.courses.append(flask_course)

db.session.add(john)
db.session.commit()

# Access reverse relationship
print(py_course.instructor.name)  # Outputs: 'John Doe'
```

---

## Practice Quiz

### Q1: What column declaration establishes the relational database constraint pointing to a parent table?
- A) `db.relationship()`
- B) `db.ForeignKey('parent_table.id')`
- C) `db.Index('parent_id')`
- D) `db.Join()`
**Answer:** B
**Explanation:** `db.ForeignKey('table_name.column')` defines the physical foreign key constraint in the underlying SQL database schema.

### Q2: What is the purpose of `db.relationship()` in SQLAlchemy?
- A) It creates a foreign key column in the database table
- B) It provides a high-level object-oriented property on model instances to navigate and query related objects
- C) It connects to an external Redis database
- D) It formats SQL dates
**Answer:** B
**Explanation:** `db.relationship()` does not alter the SQL table structure directly; it provides Python-level navigation properties (like `instructor.courses` or `course.instructor`).

### Q3: What is required to implement a Many-to-Many relationship in relational databases?
- A) A single extra string column
- B) An intermediate association table containing foreign keys to both related tables
- C) An SQLite in-memory cache
- D) A JSON column
**Answer:** B
**Explanation:** Relational databases model Many-to-Many relationships using an intermediate association table with composite primary foreign keys referencing both entities.

### Q4: What does the `cascade="all, delete-orphan"` option accomplish?
- A) It prevents any user from deleting records
- B) It automatically deletes child records if their parent record is deleted or unlinked
- C) It renames orphaned tables
- D) It backups data to AWS S3
**Answer:** B
**Explanation:** `delete-orphan` cascades deletion down to child records whenever they lose their relationship link to the parent entity.

### Q5: How do you add a `Course` to a `Student`'s `enrolled_courses` Many-to-Many relationship?
- A) `student.enrolled_courses.append(course_instance)`
- B) `db.sql.insert(student, course)`
- C) `student.courses = course_instance.id`
- D) `course_instance.set_student(student)`
**Answer:** A
**Explanation:** SQLAlchemy models collection relationships as standard Python list-like collections, allowing intuitive `.append()` and `.remove()` operations.
