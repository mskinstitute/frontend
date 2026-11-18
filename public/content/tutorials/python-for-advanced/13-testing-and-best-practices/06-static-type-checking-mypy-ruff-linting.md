---
id: static-type-checking-mypy-ruff-linting
slug: static-type-checking-mypy-ruff-linting
course: python-for-advanced
chapter: "13: Testing, Typing & Code Quality"
topic: "13.6 Static Type Checking (mypy), Ruff Linting & Code Quality"
title: "Python Static Typing with mypy & Ultra-Fast Linting with Ruff"
description: "Write production-grade Python using modern PEP 604/695 type annotations, mypy --strict static analysis, and Ruff linting & formatting configured in pyproject.toml."
difficulty: Advanced
readingTime: 16
order: 6
keywords:
  - python mypy tutorial
  - ruff linter formatter python
  - python static type checking
  - pyproject.toml ruff mypy config
  - python typing protocol typeddict
  - production python code quality
lastUpdated: 2026-11-18
author: "Er. Sumit Kumar (MSK Institute)"
version: 1.0.0
---

**Static type checking with `mypy` and automated linting/formatting with `Ruff` catch entire classes of bugs—such as `None` dereferences, wrong argument types, unused imports, and security anti-patterns—before your Python code ever executes.** Together with `pytest`, `mypy` and `Ruff` form the standard 2026 production code-quality triad configured inside `pyproject.toml`.

Python remains dynamically typed at runtime: the CPython interpreter does not enforce type hints automatically. Instead, static analyzers inspect your codebase ahead of time, giving large engineering teams the safety of a statically typed language while keeping Python's expressive speed.

---

## Modern Python 3.12+ Type Annotation Syntax

Forget legacy `from typing import List, Dict, Optional, Union` boilerplate from older Python 3.8 tutorials. Modern Python supports clean, built-in generic and union syntax out of the box:

| Legacy Syntax (Python 3.8) | Modern Syntax (Python 3.12+) | Purpose |
| :--- | :--- | :--- |
| `List[str]`, `Dict[str, int]` | `list[str]`, `dict[str, int]` | Built-in collection generics (PEP 585) |
| `Optional[str]` | `str \| None` | Nullable return values or parameters (PEP 604) |
| `Union[int, float]` | `int \| float` | Multiple allowed types |
| `TypeVar("T")` + `Generic[T]` | `def first[T](items: list[T]) -> T:` | Native generic type parameters (PEP 695) |
| `TypeAlias` | `type UserId = int` | Explicit `type` statement aliases (PEP 695) |

### Expressive Domain Modeling with `TypedDict`, `Literal`, and `Protocol`

```python
from typing import Literal, Protocol, TypedDict

type Currency = Literal["INR", "USD", "EUR"]


class PaymentRecord(TypedDict):
    student_id: str
    amount: int
    currency: Currency


class Notifier(Protocol):
    """Structural interface: any class with a matching send() method qualifies."""

    def send(self, recipient: str, message: str) -> bool: ...


def process_receipt(record: PaymentRecord, notifier: Notifier) -> str:
    summary = f"Received {record['currency']} {record['amount']} for {record['student_id']}"
    notifier.send(record["student_id"], summary)
    return summary
```

Notice why `Protocol` is preferred over heavy inheritance in advanced Python: any class that implements `send(self, recipient: str, message: str) -> bool` satisfies `Notifier` automatically (structural subtyping / static duck typing) without needing to subclass `Notifier`.

---

## Catching Real Bugs Before Runtime with `mypy`

Consider this subtle production bug where a database lookup might return `None`:

```python
def find_student_email(student_id: str, directory: dict[str, str]) -> str | None:
    return directory.get(student_id)


def send_certificate(student_id: str, directory: dict[str, str]) -> str:
    email = find_student_email(student_id, directory)
    # BUG: email could be None -> AttributeError at runtime!
    return email.lower()
```

Running `mypy --strict app.py` catches this immediately before deployment:

```text
app.py:8: error: Item "None" of "str | None" has no attribute "lower"  [union-attr]
Found 1 error in 1 file (checked 1 source file)
```

### Type Narrowing (Making `mypy` Happy the Right Way)

```python
def send_certificate(student_id: str, directory: dict[str, str]) -> str:
    email = find_student_email(student_id, directory)
    if email is None:
        raise ValueError(f"No email registered for student {student_id}")
    # mypy narrows `email` from `str | None` to `str` here!
    return email.lower()
```

---

## Ultra-Fast Linting & Formatting with `Ruff`

Historically, Python projects needed five separate tools (`flake8`, `black`, `isort`, `pyupgrade`, `bandit`) that ran slowly in CI. **Ruff** (written in Rust) replaces all of them in a single binary that runs 10–100x faster.

### Essential Daily Commands

```bash
# Install mypy and ruff in your project virtual environment
pip install mypy ruff

# Lint code and report rule violations
ruff check .

# Automatically fix safe lint issues (unused imports, sorted imports, modern syntax)
ruff check --fix .

# Format code consistently (PEP 8 / Black-compatible formatting)
ruff format .

# Run strict static type checking
mypy --strict src/
```

---

## Single Source of Truth: `pyproject.toml` Configuration

Modern Python repositories keep `ruff`, `mypy`, and `pytest` rules unified in `pyproject.toml`:

```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "F",   # pyflakes (undefined names, unused imports)
    "I",   # isort (import sorting)
    "B",   # flake8-bugbear (likely bugs like mutable default args)
    "UP",  # pyupgrade (modern Python syntax)
    "SIM", # flake8-simplify
    "S",   # flake8-bandit (security checks)
]
ignore = ["S101"]  # Allow assert statements inside pytest test suites

[tool.mypy]
python_version = "3.12"
strict = true
warn_unused_ignores = true
disallow_untyped_defs = true
```

> 💡 **Pro Tip:** Enabling rule `"B"` (`flake8-bugbear`) automatically flags classic Python traps like mutable default arguments (`def add(item, items=[])`) and bare `except:` clauses across your entire repository in milliseconds!

---

## Complete Production Quality Gate Pipeline

Before opening a pull request or deploying a backend service, professional Python teams run this 4-step quality gate locally and in GitHub Actions:

```bash
ruff format --check . && ruff check . && mypy src/ && pytest -q
```

1. **`ruff format --check .`** → Enforces uniform formatting across every team member.
2. **`ruff check .`** → Catches unused imports, bugbear traps, and security issues.
3. **`mypy src/`** → Proves type safety across module boundaries.
4. **`pytest -q`** → Verifies runtime behavior and business logic invariants.

---

## Hands-On Engineering Lab

1. **Type-Safe Refactor:** Take your Chapter 13 `Tested Calculator Application` and add full Python 3.12 type annotations (`float | int`, custom `Protocol` for operations) so `mypy --strict` passes with zero errors.
2. **Bugbear Audit:** Intentionally write a function with a mutable default argument (`def log_event(msg, logs=[])`), run `ruff check --select B`, and observe how Ruff pinpoints rule `B006`.
3. **CI Ready:** Add `[tool.ruff]` and `[tool.mypy]` sections to a `pyproject.toml` file and verify that `ruff format --check . && ruff check . && mypy . && pytest` exits with status `0`.

---

## Practice Quiz

### 1. Does CPython enforce function type annotations automatically at runtime?
A. Yes, CPython raises a `TypeError` whenever an annotated type does not match
B. No, type annotations are metadata checked by static tools like `mypy` (or runtime validators like Pydantic)
C. Only inside `async def` functions
D. Only when running Python on Linux
**Answer:** B
**Explanation:** Standard CPython treats type annotations as metadata stored in `__annotations__` and does not perform runtime type enforcement; static checkers like `mypy` or `pyright` verify them ahead of time.

---

### 2. What is the modern Python 3.10+ equivalent of `Optional[dict[str, int]]`?
A. `dict[str, int] & None`
B. `dict[str, int] | None`
C. `Nullable<dict[str, int]>`
D. `dict[str, int]?`
**Answer:** B
**Explanation:** PEP 604 introduced the `|` union operator for types, replacing `Optional[X]` with the cleaner `X | None`.

---

### 3. Which `typing` construct enables static duck typing (structural subtyping) without requiring explicit subclassing?
A. `Final`
B. `Protocol`
C. `ClassVar`
D. `NewType`
**Answer:** B
**Explanation:** `typing.Protocol` defines structural interfaces: any class implementing the required methods and attributes satisfies the protocol without inheriting from it.

---

### 4. Which combination of legacy Python tools does `Ruff` replace in a single fast executable?
A. `pytest` and `SQLAlchemy`
B. `flake8`, `isort`, `pyupgrade`, and `black`
C. `pip` and `sqlite3`
D. `asyncio` and `multiprocessing`
**Answer:** B
**Explanation:** Ruff unifies linting (Flake8 + popular plugins like bugbear/bandit/pyupgrade), import sorting (isort), and code formatting (Black-compatible) into one Rust-powered CLI.

---

### 5. What does `mypy` flag when you call `email.lower()` on a variable typed as `str | None` without checking `if email is None:`?
A. `SyntaxError`
B. A `[union-attr]` error warning that `None` has no attribute `lower`
C. A `MemoryError`
D. Nothing, because `mypy` ignores `None`
**Answer:** B
**Explanation:** Strict null checking is one of `mypy`'s most valuable features; until you narrow the union with `if email is not None:`, calling string methods on `str | None` is reported as a `[union-attr]` error.

---

## What's Next?

Now that you can write tested, strictly typed, linted production Python, move on to **[Chapter 14: Tkinter Basics →](/tutorials/python-for-advanced/tkinter-basics)** to build event-driven desktop applications!
