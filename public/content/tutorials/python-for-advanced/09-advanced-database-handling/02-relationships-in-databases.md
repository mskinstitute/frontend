---
id: python-advanced-relationships-in-databases
slug: relationships-in-databases
course: python-for-advanced
chapter: "9: Advanced Database Handling"
topic: "9.2 Relationships in Databases"
title: "Relationships in Databases in Python"
description: "Master relationships in databases in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 37
keywords:
  - python relationships in databases
  - python advanced
  - python relationships in databases
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Relationships in Databases with SQLAlchemy

Relational database systems gain their expressive power from table associations: **One-to-Many (1:N)**, **Many-to-One (N:1)**, **Many-to-Many (M:N)**, and **One-to-One (1:1)**. In SQLAlchemy 2.0, relationships are configured using `ForeignKey` constraints paired with high-level `relationship()` property descriptors, enabling bidirectional navigation and automated cascading lifecycles.

---

## 1. One-to-Many & Many-to-One Relationships

Consider a standard domain model: an **Author** writes multiple **Articles**.

```
  ┌────────────────────────┐                   ┌────────────────────────┐
  │         Author         │ 1               N │        Article         │
  ├────────────────────────┤───────────────────├────────────────────────┤
  │ id: int (PK)           │                   │ id: int (PK)           │
  │ name: str              │                   │ title: str             │
  │ articles: List[Article]│◄─ back_populates ─┤ author_id: int (FK)    │
  └────────────────────────┘                   │ author: Author         │
                                               └────────────────────────┘
```

```python
from typing import List, Optional
from sqlalchemy import ForeignKey, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)

    # 1:N relationship: Author.articles contains a list of Article instances
    # cascade="all, delete-orphan": Deleting an author deletes their articles
    articles: Mapped[List["Article"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Author(id={self.id}, name={self.name!r})"

class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    
    # Foreign Key constraint pointing to authors.id
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), nullable=False)

    # N:1 relationship: Article.author references the single Author instance
    author: Mapped["Author"] = relationship(back_populates="articles")

    def __repr__(self) -> str:
        return f"Article(id={self.id}, title={self.title!r})"
```

### The Role of `back_populates`
> **Best Practice:** Always use `back_populates` instead of legacy `backref`. `back_populates` explicitly documents the relationship on both classes, providing full IDE autocompletion, static type checking, and clean bidirectional synchronization.

---

## 2. Many-to-Many Relationships (M:N)

In a Many-to-Many association (e.g. **Students** enrolled in multiple **Courses**), relational databases require an intermediate **Association Table** containing foreign keys referencing both primary keys:

```
  ┌──────────────┐         ┌─────────────────────────┐         ┌──────────────┐
  │   Student    │ 1     N │   student_course_link   │ N     1 │    Course    │
  ├──────────────┤─────────├─────────────────────────┤─────────├──────────────┤
  │ id (PK)      │         │ student_id (FK) (PK)    │         │ id (PK)      │
  │ name         │         │ course_id (FK) (PK)     │         │ title        │
  └──────────────┘         └─────────────────────────┘         └──────────────┘
```

```python
from sqlalchemy import Column, Table

# Association Table (pure mapping table with compound primary key)
student_course_association = Table(
    "student_course_association",
    Base.metadata,
    Column("student_id", ForeignKey("students.id"), primary_key=True),
    Column("course_id", ForeignKey("courses.id"), primary_key=True)
)

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))

    # Many-to-Many: specifies secondary association table
    courses: Mapped[List["Course"]] = relationship(
        secondary=student_course_association,
        back_populates="students"
    )

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))

    students: Mapped[List["Student"]] = relationship(
        secondary=student_course_association,
        back_populates="courses"
    )
```

---

## 3. The N+1 Query Problem & Eager Loading Strategies

By default, SQLAlchemy loads relationship collections **lazily**—it issues a separate `SELECT` query only when the attribute is first accessed in Python:

```python
# The N+1 Problem:
# 1 query to fetch 100 authors
authors = session.scalars(select(Author)).all()
for a in authors:
    # 100 additional queries executed sequentially! Total: 101 queries!
    print(a.articles)
```

### Solving with Eager Loading (`selectinload` & `joinedload`)
The `sqlalchemy.orm` module provides relationship loaders to eliminate the N+1 problem:
- `selectinload`: Issues a single `SELECT ... WHERE id IN (...)` query to fetch all related items in bulk. (Best for 1:N collections).
- `joinedload`: Emits an SQL `LEFT OUTER JOIN` to fetch both parent and child rows in one query. (Best for N:1 and 1:1 scalar references).

```python
from sqlalchemy.orm import selectinload

# Solved: Exactly 2 queries executed total, regardless of author count
stmt = select(Author).options(selectinload(Author.articles))
authors = session.scalars(stmt).all()

for a in authors:
    print(f"Author: {a.name} -> Articles: {[art.title for art in a.articles]}")
```

---

## 4. Cascading Deletions: `all, delete-orphan`

Configuring `cascade="all, delete-orphan"` ensures database cleanliness:
1. When an `Author` is deleted, all their associated `Article` records are deleted automatically.
2. If an `Article` is removed from `author.articles.remove(art)`, the orphaned article record is deleted from the database instead of lingering with a `NULL` foreign key.

---

## 5. Architectural Summary Table

| Relationship | Prerequisite | SQLAlchemy Syntax | Recommended Eager Loader |
| :--- | :--- | :--- | :--- |
| **One-to-Many (1:N)** | `ForeignKey` on child table | `relationship(back_populates="...", cascade="all, delete-orphan")` | `selectinload()` |
| **Many-to-One (N:1)** | `ForeignKey` on this table | `relationship(back_populates="...")` | `joinedload()` |
| **Many-to-Many (M:N)**| Association `Table` | `relationship(secondary=link_table, back_populates="...")` | `selectinload()` |
| **One-to-One (1:1)** | Unique `ForeignKey` | `Mapped[Child] = relationship(...)` (scalar type) | `joinedload()` |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. The N+1 Query Problem
Iterating over child relationships in a loop with default lazy loading executes 1 query for the parent plus N separate queries for the children. Use `selectinload()` or `joinedload()` to eager-load relationships in bulk.

### 2. Dangling Foreign Keys
When deleting parent records, configure `cascade="all, delete-orphan"` on relationships to prevent orphaned foreign keys in child tables.

---

---

## 💻 Try It Yourself: One-to-Many Relationship with Cascading Delete

### Scenario
Model an `Author` with many `Book` instances in SQLAlchemy. Verify that deleting an author automatically cascades and purges all their associated books.

### Complete Solution
```python
from sqlalchemy import create_engine, ForeignKey, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    books: Mapped[list["Book"]] = relationship(back_populates="author", cascade="all, delete-orphan")

class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"))
    author: Mapped["Author"] = relationship(back_populates="books")

engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)

with Session(engine) as session:
    author = Author(name="Arthur Conan Doyle", books=[Book(title="Study in Scarlet"), Book(title="Sign of Four")])
    session.add(author)
    session.commit()
    
    # Cascade delete
    session.delete(author)
    session.commit()
    remaining_books = session.scalars(select(Book)).all()
    print(f"Remaining books after author deletion: {len(remaining_books)}")
```

### Expected Output
```text
Remaining books after author deletion: 0
```

---

## Practice Quiz

### 1.
What problem occurs when accessing lazy-loaded relationship attributes inside a loop over $N$ parent objects?
A. The N+1 Query Problem: $1$ query fetches the parents, followed by $N$ separate queries fetching each parent's children.
B. A `DeadlockError` on the primary key.
C. All records are deleted automatically.
D. Sockets are permanently closed.

**Answer:** A

**Explanation:** Lazy loading queries child objects on demand upon attribute access. In a loop over $N$ parents, this causes $1 + N$ queries, creating severe database latency.

---

### 2.
Which eager loading strategy emits a `SELECT ... WHERE parent_id IN (...)` query to efficiently load One-to-Many collections in bulk?
A. `lazyload()`
B. `selectinload()`
C. `subqueryload()`
D. `noload()`

**Answer:** B

**Explanation:** `selectinload()` loads related collections using an efficient `IN` query that loads all child records corresponding to parent primary keys in a single second query.

---

### 3.
What is the effect of specifying `cascade="all, delete-orphan"` on a parent model's `relationship()`?
A. Child objects are deleted when their parent is deleted, and children removed from the parent's collection are also deleted from the database.
B. Child objects are converted into JSON strings.
C. Deleting the parent is blocked by a `ForeignKeyViolation`.
D. Foreign keys are automatically set to `-1`.

**Answer:** A

**Explanation:** `delete-orphan` instructs SQLAlchemy to delete child records from the database if their parent is deleted or if they are detached from the parent's relationship collection.

---

### 4.
How is a Many-to-Many relationship configured between two models in SQLAlchemy?
A. By placing two foreign keys on the same table.
B. By defining an intermediate Association `Table` and referencing it via `relationship(secondary=association_table)`.
C. By using Python's `multiprocessing.Queue`.
D. By duplicating all table columns.

**Answer:** B

**Explanation:** Many-to-Many relationships require an association table containing foreign keys to both models, passed to the `secondary` argument of `relationship()`.

---

### 5.
Why is `back_populates` preferred over `backref` in modern SQLAlchemy 2.0?
A. `backref` only works on PostgreSQL.
B. `back_populates` requires explicit declarations on both participating classes, improving code clarity, IDE autocompletion, and static type checking.
C. `backref` runs slower in SQLite.
D. `back_populates` creates automated database indexes.

**Answer:** B

**Explanation:** Explicitly defining relationships on both classes using `back_populates` ensures strict type annotations and clarity, avoiding the implicit attribute creation caused by legacy `backref`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Transactions and Rollbacks** (9: Advanced Database Handling).

👉 **[Continue to Next Lesson: Transactions and Rollbacks →](/tutorials/python-for-advanced/transactions-and-rollbacks)**
