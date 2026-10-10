# Flask-SQLAlchemy Setup & Engine Configuration

Persistent data storage is the backbone of web applications. While Python supports raw database drivers (like `sqlite3` or `psycopg2`), writing raw SQL strings is tedious, error-prone, and vulnerable to SQL injection.

**Flask-SQLAlchemy** integrates **SQLAlchemy**—the premier Object Relational Mapper (ORM) for Python—with Flask. It manages database engines, handles connection pooling, and simplifies session lifecycles.

---

## 1. Installing Flask-SQLAlchemy 3.x

Install the extension:

```bash
pip install flask-sqlalchemy
```

For PostgreSQL or MySQL support, install the corresponding database driver:
```bash
# For PostgreSQL
pip install psycopg2-binary

# For MySQL
pip install pymysql
```

---

## 2. Configuring the Database URI

Flask-SQLAlchemy connects to your database via `SQLALCHEMY_DATABASE_URI`. The URI format follows standard RFC connection strings:

```
dialect+driver://username:password@host:port/database_name
```

### Common Database URI Formats:

| Database Engine | `SQLALCHEMY_DATABASE_URI` Example |
| :--- | :--- |
| **SQLite (Local File)** | `sqlite:///app.db` (relative to instance folder) |
| **SQLite (In-Memory for Tests)** | `sqlite:///:memory:` |
| **PostgreSQL** | `postgresql+psycopg2://db_user:secret_pass@localhost:5432/msk_db` |
| **MySQL / MariaDB** | `mysql+pymysql://db_user:secret_pass@localhost:3306/msk_db` |

---

## 3. Initializing the `SQLAlchemy` Extension

In modern Flask-SQLAlchemy 3.x, initialize the `SQLAlchemy` object and bind it to your application:

```python
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure local SQLite database inside Flask's secure instance/ folder
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "instance", "app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Production Connection Pool Tuning (PostgreSQL / MySQL)
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_size": 10,         # Maximum number of permanent connections
    "max_overflow": 20,      # Extra connections created during traffic surges
    "pool_timeout": 30,      # Seconds to wait before timing out
    "pool_recycle": 1800     # Recycle connections every 30 minutes to prevent disconnects
}

# Instantiate the ORM extension
db = SQLAlchemy(app)
```

---

## 4. Understanding Application Context and `db.create_all()`

In Flask-SQLAlchemy 3.x, database operations (like creating tables) **must** run within Flask's **application context**:

```python
# Create database tables defined by your models
with app.app_context():
    db.create_all()
    print("Database tables initialized successfully!")
```

Attempting to run `db.create_all()` outside `with app.app_context():` will raise an `ActiveContextError` or `RuntimeError: Working outside of application context`.

---

## Practice Quiz

### Q1: What configuration key specifies the database connection string in Flask-SQLAlchemy?
- A) `DATABASE_URL`
- B) `SQLALCHEMY_DATABASE_URI`
- C) `DB_CONNECTION_STRING`
- D) `SQLALCHEMY_ENGINE_PATH`
**Answer:** B
**Explanation:** Flask-SQLAlchemy reads `app.config['SQLALCHEMY_DATABASE_URI']` to initialize the database engine connection.

### Q2: Why should `SQLALCHEMY_TRACK_MODIFICATIONS` be explicitly set to `False`?
- A) It deletes the database upon server reboot
- B) It disables an unnecessary legacy event system that consumes significant CPU and RAM memory
- C) It prevents new records from being saved
- D) It disables foreign key constraints
**Answer:** B
**Explanation:** `SQLALCHEMY_TRACK_MODIFICATIONS` is a deprecated legacy Flask-SQLAlchemy feature that tracks object modifications. Setting it to `False` saves significant memory overhead.

### Q3: Why must `db.create_all()` be executed inside `with app.app_context():` in Flask-SQLAlchemy 3.x?
- A) To encrypt the database file
- B) Because Flask-SQLAlchemy requires the active application context to locate `app.config` and the engine connection
- C) To verify user login credentials
- D) To create a Git commit
**Answer:** B
**Explanation:** In Flask 3.x, database engines are bound to the application instance; running operations outside the application context raises a `RuntimeError`.

### Q4: What does the SQLite URI `sqlite:///app.db` (with three slashes) denote?
- A) An in-memory temporary database
- B) A database file stored relative to the application's instance or working directory
- C) An absolute root filesystem path
- D) A remote cloud database
**Answer:** B
**Explanation:** In SQLite URIs, three slashes (`sqlite:///file.db`) indicate a relative path, whereas four slashes (`sqlite:////absolute/path/file.db`) represent an absolute filesystem path.

### Q5: What is the purpose of `pool_recycle` in `SQLALCHEMY_ENGINE_OPTIONS`?
- A) It deletes old user records after 30 days
- B) It periodically refreshes database connections before database servers (like MySQL) close stale idle connections
- C) It clears the browser cache
- D) It empties the Recycle Bin
**Answer:** B
**Explanation:** Many database servers automatically disconnect idle connections after a timeout. `pool_recycle` proactively reconnects workers before the database server terminates the socket.
