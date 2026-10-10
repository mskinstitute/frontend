---
id: python-advanced-sqlalchemy-orm-basics
slug: sqlalchemy-orm-basics
course: python-for-advanced
chapter: "9: Advanced Database Handling"
topic: "9.1 SQLAlchemy ORM Basics"
title: "SQLAlchemy ORM Basics in Python"
description: "Master sqlalchemy orm basics in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 36
keywords:
  - python sqlalchemy orm basics
  - python advanced
  - python sqlalchemy orm basics
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# SQLAlchemy ORM Basics

In enterprise software engineering, connecting object-oriented application code with relational database schemas is a fundamental challenge. **SQLAlchemy** is the standard Object-Relational Mapping (ORM) toolkit for Python.

With the release of **SQLAlchemy 2.0**, the library unified its Core and ORM APIs, introduced first-class support for Python type annotations (`Mapped`, `mapped_column`), and transitioned to a declarative SQL-like querying paradigm.

---

## 1. The Modern SQLAlchemy 2.0 Declarative Architecture

SQLAlchemy maps Python classes to relational database tables. In 2.0, classes inherit from `DeclarativeBase` and define column attributes using type-annotated descriptors:

```
 Python Application Domain Model          SQLAlchemy 2.0 Mapping           Relational Database Schema
┌─────────────────────────────────┐      ┌─────────────────────────┐      ┌───────────────────────────┐
│ class User(DeclarativeBase):    │      │                         │      │ CREATE TABLE users (      │
│   id: Mapped[int] = ...         │ ───► │ type: Integer, PK       │ ───► │   id INTEGER PRIMARY KEY, │
│   username: Mapped[str] = ...   │      │ type: String(50), NOT NULL│   │   username VARCHAR(50)... │
│   email: Mapped[str] = ...      │      │ type: String(120), UNIQUE │   │   email VARCHAR(120)...   │
└─────────────────────────────────┘      └─────────────────────────┘      └───────────────────────────┘
```

---

## 2. Engine, Metadata, and Session Lifecycle

Three primary architectural constructs manage database operations:
1. **`Engine`**: The low-level connection pool and SQL dialect translator. Created via `create_engine()`.
2. **`Session`**: The Unit of Work and Identity Map pattern coordinator. It tracks changes to objects and flushes transactions.
3. **`DeclarativeBase`**: The root class collecting schema metadata and table definitions.

```
       Engine (create_engine) ◄─── Connection Pool & Dialect (SQLite/PostgreSQL)
                 ▲
                 │ Manages Connection
                 ▼
       Session (sessionmaker) ◄─── Unit of Work & Identity Map
                 │
        ┌────────┴────────┐
        ▼                 ▼
   User Object       Post Object  (Persistent In-Memory Domain Models)
```

### The Four States of an ORM Entity
- **Transient**: Newly instantiated object (`User(...)`); not associated with any session; has no database identity.
- **Pending**: Added to a session (`session.add(u)`); not yet flushed to the database.
- **Persistent**: Flushed or queried from the database; has a primary key; tracked in session.
- **Detached**: The session was closed; the object remains in memory, but changes to it are untracked.

---

## 3. Production Implementation: Schema Definition & CRUD

```python
from typing import List, Optional
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# Step 1: Base Declarative Class
class Base(DeclarativeBase):
    pass

# Step 2: Define Table Model with Type Hints
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)

    def __repr__(self) -> str:
        return f"User(id={self.id}, username={self.username!r}, active={self.is_active})"

# Step 3: Create Engine (using SQLite in-memory for testing)
engine = create_engine("sqlite:///:memory:", echo=False)

# Create database tables defined in metadata
Base.metadata.create_all(engine)

# Step 4: Manage Session via Context Manager
SessionFactory = sessionmaker(bind=engine)

def demonstrate_crud():
    print("--- 1. INSERT (Create) ---")
    with SessionFactory() as session:
        # Instantiate transient objects
        alice = User(username="alice", email="alice@enterprise.com")
        bob = User(username="bob", email="bob@enterprise.com")

        # Move to pending state
        session.add_all([alice, bob])
        
        # Commit flushes pending records to DB and commits transaction
        session.commit()
        print(f"Created persistent users: {alice.id}, {bob.id}")

    print("\n--- 2. SELECT (Read) ---")
    with SessionFactory() as session:
        # Modern 2.0 select statement
        stmt = select(User).where(User.username == "alice")
        # session.scalars() returns individual ORM entities rather than row tuples
        user = session.scalars(stmt).first()
        print(f"Queried user: {user}")

    print("\n--- 3. UPDATE (Update) ---")
    with SessionFactory() as session:
        user = session.scalars(select(User).where(User.username == "bob")).one()
        print(f"Before update: active={user.is_active}")
        
        # In-place attribute mutation tracked by Identity Map
        user.is_active = False
        session.commit()
        print(f"After commit:  active={user.is_active}")

    print("\n--- 4. DELETE (Delete) ---")
    with SessionFactory() as session:
        user_to_delete = session.scalars(select(User).where(User.username == "bob")).one()
        session.delete(user_to_delete)
        session.commit()
        print("Deleted user 'bob'.")

    # Verify deletion
    with SessionFactory() as session:
        remaining_users = session.scalars(select(User)).all()
        print(f"Remaining users in database: {list(remaining_users)}")

if __name__ == "__main__":
    demonstrate_crud()
```

---

## 4. Modern 2.0 Querying: `select()` and `session.scalars()`

In legacy SQLAlchemy 1.x, querying relied on `session.query(User).filter(...)`. 

In SQLAlchemy 2.0, all queries use explicit `select()` statements:
- `session.execute(select(User))`: Returns a `Result` containing row tuples `(User,)`.
- `session.scalars(select(User))`: Automatically unwraps single-entity rows into `ScalarResult` containing `User` instances directly.

```python
# Modern 2.0 Query Idioms:
stmt = select(User).where(User.is_active == True).order_by(User.username)
active_users = session.scalars(stmt).all()
```

---

## 5. Architectural Summary Table

| Construct | Role | 2.0 Syntax |
| :--- | :--- | :--- |
| **Model Base** | Defines root declarative metadata | `class Base(DeclarativeBase): pass` |
| **Typed Columns** | Declares columns with Python types | `col: Mapped[type] = mapped_column(...)` |
| **Engine** | Connection pool & dialect gateway | `create_engine("dialect://user:pass@host/db")` |
| **Session** | Unit of Work coordinator | `with Session(engine) as session:` |
| **Querying** | Declarative SQL queries | `session.scalars(select(Model).where(...))` |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Mixing SQLAlchemy 1.x and 2.0 Syntax
SQLAlchemy 2.0 deprecates `session.query(Model)` in favor of declarative `select(Model)` executed via `session.scalars(select(Model))`.

### 2. Leaking Unclosed Sessions
Always manage database sessions with context managers (`with Session(engine) as session:`) to guarantee sessions and connection pool handles are released back to the pool.

---

---

## 💻 Try It Yourself: Modern SQLAlchemy 2.0 Declarative Model

### Scenario
Define a modern SQLAlchemy 2.0 `Product` model using `Mapped` and `mapped_column`, insert records, and query with `select()`.

### Complete Solution
```python
from sqlalchemy import create_engine, select, String, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    price: Mapped[float] = mapped_column(Float)

engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add(Product(name="Ergonomic Keyboard", price=3499.0))
    session.commit()
    
    prod = session.scalars(select(Product).where(Product.name.like("%Keyboard%"))).first()
    print(f"Found Product: {prod.name} (₹{prod.price:,.2f})")
```

### Expected Output
```text
Found Product: Ergonomic Keyboard (₹3,499.00)
```

---

## Practice Quiz

### 1.
How are table columns defined with strict type-safety in modern SQLAlchemy 2.0?
A. `col = Column(Integer)`
B. `col: Mapped[int] = mapped_column(...)`
C. `col = Field(int)`
D. `col = db.Integer()`

**Answer:** B

**Explanation:** SQLAlchemy 2.0 introduced `Mapped[T]` and `mapped_column(...)` to integrate directly with Python's typing system (PEP 484) and static type checkers like Mypy.

---

### 2.
What is the difference between `session.execute(select(User))` and `session.scalars(select(User))`?
A. `execute()` only works for inserts, while `scalars()` works for selects.
B. `execute()` returns rows of tuples `(User,)`, whereas `scalars()` unwraps the first column of each row into raw scalar ORM instances.
C. `scalars()` does not support `where` clauses.
D. `execute()` bypasses the database engine.

**Answer:** B

**Explanation:** `session.scalars()` is a convenience method that automatically extracts the first element from each row tuple, yielding ORM entity instances directly.

---

### 3.
What is the state of a newly created ORM object `user = User(name="Alex")` before `session.add(user)` is executed?
A. Persistent
B. Pending
C. Transient
D. Detached

**Answer:** C

**Explanation:** A freshly instantiated ORM object that has not been attached to a session and has no database representation is in the **Transient** state.

---

### 4.
What does `Base.metadata.create_all(engine)` do?
A. Deletes all data from the database.
B. Inspects all mapped models registered under `Base` and issues `CREATE TABLE` DDL statements for any tables that do not yet exist in the database.
C. Compiles Python code to SQLite binaries.
D. Drops the database connection pool.

**Answer:** B

**Explanation:** `create_all()` examines the metadata dictionary collected by `DeclarativeBase` and generates the corresponding schema tables in the target database if they are missing.

---

### 5.
Why should SQLAlchemy sessions always be managed using a `with Session(engine) as session:` context manager block?
A. Because Python refuses to compile sessions outside of `with` blocks.
B. To guarantee that database connections are properly closed, pooled, and cleaned up upon exit, avoiding connection leaks.
C. To turn on SQLite WAL mode.
D. To disable transaction isolation.

**Answer:** B

**Explanation:** Using the session context manager guarantees that the session's internal resources and checked-out engine connections are closed and returned to the pool even if unhandled exceptions occur.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Relationships in Databases** (9: Advanced Database Handling).

👉 **[Continue to Next Lesson: Relationships in Databases →](/tutorials/python-for-advanced/relationships-in-databases)**
