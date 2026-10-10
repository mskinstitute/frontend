---
id: python-advanced-transactions-and-rollbacks
slug: transactions-and-rollbacks
course: python-for-advanced
chapter: "9: Advanced Database Handling"
topic: "9.3 Transactions and Rollbacks"
title: "Transactions and Rollbacks in Python"
description: "Master transactions and rollbacks in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Advanced
readingTime: 8
order: 38
keywords:
  - python transactions and rollbacks
  - python advanced
  - python transactions and rollbacks
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# Transactions and Rollbacks in SQLAlchemy

Data consistency in backend systems relies on the **ACID** guarantees of relational databases (Atomicity, Consistency, Isolation, Durability). In SQLAlchemy, transactions are governed by the Unit of Work pattern through the `Session` object.

Mastering transaction lifecycles, explicit commits, automated rollbacks, and nested savepoints ensures that database operations either complete in their entirety or leave data completely untouched in the presence of runtime exceptions.

---

## 1. ACID Guarantees & Transaction Boundaries

```
                      The ACID Invariants in Database Systems
                                         │
        ┌──────────────────┬─────────────┴────────────┬──────────────────┐
        ▼                  ▼                          ▼                  ▼
    Atomicity         Consistency                 Isolation          Durability
All-or-Nothing;      Enforces schema        Concurrent transactions  Committed changes
No partial state.    rules, types & FKs.    do not corrupt state.    persist to disk.
```

### The Automatic Transaction Scope (`session.begin()`)
In SQLAlchemy 2.0, managing transactions inside a `with session.begin():` context manager provides a guarantee:
- If the block finishes without errors, `session.commit()` is issued automatically.
- If an unhandled exception occurs, `session.rollback()` is executed immediately before the exception propagates out.

```python
from sqlalchemy import Float, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

class Base(DeclarativeBase):
    pass

class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner: Mapped[str] = mapped_column(String(50), unique=True)
    balance: Mapped[float] = mapped_column(Float, default=0.0)

engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)
SessionFactory = sessionmaker(bind=engine)
```

---

## 2. Transferring Funds: Atomic Transactions in Action

Consider an inter-account bank transfer. If funds are deducted from Account A, but the network or application crashes before depositing into Account B, money is permanently lost unless wrapped in an atomic transaction:

```python
def execute_funds_transfer(sender_name: str, receiver_name: str, amount: float) -> bool:
    with SessionFactory() as session:
        try:
            # Atomic block begins here
            with session.begin():
                # 1. Fetch sender and receiver
                sender = session.scalars(select(BankAccount).where(BankAccount.owner == sender_name)).one()
                receiver = session.scalars(select(BankAccount).where(BankAccount.owner == receiver_name)).one()

                if sender.balance < amount:
                    raise ValueError(f"Insufficient funds! Balance: ${sender.balance:.2f}, Required: ${amount:.2f}")

                # 2. Deduct from sender
                sender.balance -= amount
                print(f"[STAGE 1] Deducted ${amount:.2f} from {sender.owner}")

                # Simulate a catastrophic failure mid-transaction (e.g. power loss or validation error)
                if amount > 1000:
                    raise RuntimeError("Regulatory anti-money laundering block triggered!")

                # 3. Credit receiver
                receiver.balance += amount
                print(f"[STAGE 2] Credited ${amount:.2f} to {receiver.owner}")

            # Transaction commits automatically here on successful block exit
            print("[SUCCESS] Transaction committed successfully to database.")
            return True

        except Exception as err:
            # session.begin() has ALREADY rolled back the session here!
            print(f"[ROLLBACK TRIGGERED] Failed transfer: {err}")
            return False

# Setup Accounts
with SessionFactory() as session:
    with session.begin():
        session.add_all([
            BankAccount(owner="Alice", balance=500.0),
            BankAccount(owner="Bob", balance=100.0)
        ])

# Scenario A: Successful Transfer
print("--- Scenario A: Normal Transfer ---")
execute_funds_transfer("Alice", "Bob", 150.0)

# Verify balances
with SessionFactory() as session:
    for acc in session.scalars(select(BankAccount)):
        print(f"Account: {acc.owner} -> Balance: ${acc.balance:.2f}")

# Scenario B: Failed Transfer triggering rollback
print("\n--- Scenario B: Failed Transfer (> $1,000) ---")
execute_funds_transfer("Alice", "Bob", 1200.0)

# Verify balances (Alice still has $350, deduction was rolled back!)
with SessionFactory() as session:
    for acc in session.scalars(select(BankAccount)):
        print(f"Account: {acc.owner} -> Balance: ${acc.balance:.2f}")
```

---

## 3. Nested Transactions & Savepoints (`session.begin_nested()`)

Relational databases support **Savepoints** within an active transaction. A savepoint allows you to roll back a specific portion of work without aborting the entire outer transaction.

In SQLAlchemy, savepoints are created using `session.begin_nested()`:

```
 Outer Transaction (session.begin())
  │
  ├──► Statement 1: Insert User Account (Kept)
  │
  ├──► Savepoint (session.begin_nested())
  │     ├──► Statement 2: Attempt Email Dispatch Record
  │     └──► FAILS! (Rolls back to Savepoint ONLY)
  │
  └──► Statement 3: Insert Audit Log (Kept)
  │
 Commit Outer Transaction ──► User & Audit Log saved; failed record discarded!
```

```python
def process_batch_with_savepoints():
    with SessionFactory() as session:
        with session.begin():
            # Operation 1: Always succeeds
            session.add(BankAccount(owner="Charlie", balance=250.0))

            # Operation 2: Risky sub-operation wrapped in a savepoint
            try:
                with session.begin_nested():  # Creates SAVEPOINT
                    # Attempting duplicate owner violates UNIQUE constraint!
                    session.add(BankAccount(owner="Charlie", balance=999.0))
                    session.flush()
            except Exception as err:
                print(f"[SAVEPOINT ROLLBACK] Sub-operation failed ({type(err).__name__}). Outer transaction continues.")

            # Operation 3: Outer transaction continues uninterrupted
            session.add(BankAccount(owner="Diana", balance=400.0))

        # Commit finalizes Charlie and Diana!
```

---

## 4. Architectural Summary Table

| Construct | Mechanism | Scope |
| :--- | :--- | :--- |
| `with session.begin():` | Automatic commit / rollback | Outer transaction boundary |
| `session.commit()` | Flushes changes and commits transaction | Explicit transaction commit |
| `session.rollback()` | Reverts pending changes to database state | Explicit transaction abort |
| `session.begin_nested()` | Emits SQL `SAVEPOINT` | Nested sub-transaction rollback |
| `session.flush()` | Sends pending SQL to DB without committing | In-flight constraint validation |

---

---

## ⚠️ Common Advanced Mistakes & Gotchas

### 1. Confusing `session.flush()` with `session.commit()`
- `session.flush()`: Sends SQL statements to the database engine and populates generated IDs, but keeps the transaction open.
- `session.commit()`: Persists the transaction permanently to disk.

### 2. Re-using an Errored Session Without Rollback
Once an exception occurs inside a transaction, the session enters an inactive state. Any subsequent query raises an `InvalidRequestError` until `session.rollback()` is called.

---

---

## 💻 Try It Yourself: Simulating Transaction Rollback on Failure

### Scenario
Demonstrate transaction rollback in SQLAlchemy by attempting a dual-account fund transfer where an error occurs midway through the operation.

### Complete Solution
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

class Base(DeclarativeBase):
    pass

class UserAccount(Base):
    __tablename__ = "accounts"
    id: Mapped[int] = mapped_column(primary_key=True)
    balance: Mapped[float]

engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)

with Session(engine) as session:
    a1 = UserAccount(id=1, balance=1000.0)
    session.add(a1)
    session.commit()

# Transaction with failure
with Session(engine) as session:
    try:
        acc = session.get(UserAccount, 1)
        acc.balance -= 500.0
        raise RuntimeError("Network crashed during bank transfer!")
        session.commit()
    except RuntimeError:
        session.rollback()
        print("Transaction safely rolled back.")

with Session(engine) as session:
    acc = session.get(UserAccount, 1)
    print(f"Verified Balance: ₹{acc.balance:,.2f} (Funds intact!)")
```

### Expected Output
```text
Transaction safely rolled back.
Verified Balance: ₹1,000.00 (Funds intact!)
```

---

## Practice Quiz

### 1.
What happens if an unhandled exception occurs inside a `with session.begin():` block?
A. The database drops all tables.
B. SQLAlchemy automatically executes `session.rollback()`, reverting all uncommitted modifications made during that block, before propagating the exception.
C. The partial changes are permanently written to disk.
D. The process freezes.

**Answer:** B

**Explanation:** The `session.begin()` context manager automatically issues a rollback when an unhandled exception escapes the block, ensuring that no partially written data persists.

---

### 2.
What is the purpose of `session.begin_nested()` in SQLAlchemy?
A. To open a separate operating system process.
B. To establish a database Savepoint within an existing transaction, allowing partial rollback of sub-operations without aborting the parent transaction.
C. To create a multi-threaded database server.
D. To disable all database locks.

**Answer:** B

**Explanation:** `session.begin_nested()` uses SQL savepoints to allow localized sub-transaction rollbacks while keeping the surrounding outer transaction intact.

---

### 3.
What is the difference between `session.flush()` and `session.commit()`?
A. `flush()` deletes the database, while `commit()` saves it.
B. `flush()` communicates pending SQL operations to the database transaction buffer without closing the transaction, while `commit()` permanently finalizes the transaction on disk.
C. `commit()` only works on SQLite.
D. There is no difference; they are aliases.

**Answer:** B

**Explanation:** `session.flush()` pushes queued SQL DML statements (`INSERT`, `UPDATE`, `DELETE`) to the database process so generated IDs and constraints can be evaluated, while `session.commit()` permanently seals the transaction.

---

### 4.
Which ACID property guarantees that all database operations in a transaction succeed together or fail together with zero partial state?
A. Atomicity
B. Consistency
C. Isolation
D. Durability

**Answer:** A

**Explanation:** **Atomicity** ensures all-or-nothing execution: if any part of the transaction fails, the entire transaction is rolled back, preventing partial updates.

---

### 5.
What exception is raised by SQLAlchemy when an operation violates a `unique=True` column constraint during flush or commit?
A. `sqlalchemy.exc.IntegrityError`
B. `ValueError`
C. `sqlalchemy.exc.NotFoundError`
D. `KeyError`

**Answer:** A

**Explanation:** Database constraint violations (such as unique constraints, foreign key violations, or nullability violations) trigger a `sqlalchemy.exc.IntegrityError`.

---
---

## 🚀 What's Next?

In the next lesson, we will continue your advanced Python journey with **Project: Blogging Platform Database** (9: Advanced Database Handling).

👉 **[Continue to Next Lesson: Project: Blogging Platform Database →](/tutorials/python-for-advanced/project-blogging-platform-database)**
