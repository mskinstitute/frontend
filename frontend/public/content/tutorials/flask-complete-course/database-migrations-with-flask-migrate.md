# Database Schema Migrations with Flask-Migrate

In development, dropping and recreating database tables with `db.drop_all()` and `db.create_all()` wipes out all existing data. In production, destroying production data to add a new column or table is completely unacceptable.

**Flask-Migrate** wraps **Alembic**—SQLAlchemy's database migration engine—into the `flask` CLI, providing automated schema diffing and version-controlled migration scripts.

---

## 1. Installing and Configuring Flask-Migrate

Install the extension:

```bash
pip install flask-migrate
```

In `app.py`:

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/app.db"

db = SQLAlchemy(app)
# Initialize Migrate with app and db instances
migrate = Migrate(app, db)
```

---

## 2. The Migration Lifecycle

Flask-Migrate adds the `flask db` command group to your terminal:

```
[ Developer edits models.py ]
             |
             v
1. flask db migrate -m "Add avatar column"  --> (Generates migration script in migrations/versions/)
             |
             v
2. Review generated migration script
             |
             v
3. flask db upgrade                        --> (Applies ALTER TABLE to database)
```

### Step 1: Initializing Migrations Repository
Run this **once** when starting a new project:

```bash
flask db init
```

This creates a `migrations/` directory in your project root containing Alembic configuration files and an `alembic_version` tracking table.

### Step 2: Generating a Migration Script
Whenever you add, modify, or delete columns or models in `models.py`, generate a revision:

```bash
flask db migrate -m "Add bio and social_links to User"
```

Alembic inspects your SQLAlchemy models, compares them to the active database schema, and writes a Python migration script into `migrations/versions/`.

### Step 3: Inspecting the Generated Script
Always inspect the generated file in `migrations/versions/`. Notice the `upgrade()` and `downgrade()` functions:

```python
# migrations/versions/4a2b1c8f_add_bio.py
def upgrade():
    op.add_column('users', sa.Column('bio', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('users', 'bio')
```

### Step 4: Applying Migrations
Apply the revision to your database:

```bash
flask db upgrade
```

### Step 5: Rolling Back a Migration
If a migration causes an issue, roll back to the previous revision:

```bash
flask db downgrade
```

---

## 3. Important Caveats & SQLite Limitations

1. **SQLite Alter Column Restrictions:** SQLite does not natively support dropping or altering columns. In Flask-Migrate, enable `render_as_batch=True` in `Migrate(app, db, render_as_batch=True)` so Alembic recreates the table under the hood during complex migrations on SQLite.
2. **Commit Migrations to Git:** The `migrations/` directory **must** be checked into version control so team members and CI/CD deployment pipelines apply identical schema migrations.

---

## Practice Quiz

### Q1: What underlying library powers Flask-Migrate?
- A) Django Migrations
- B) Alembic
- C) Flyway
- D) Liquibase
**Answer:** B
**Explanation:** Flask-Migrate is an integration layer that binds the Alembic database migration tool to the Flask application and CLI.

### Q2: Which command is run once per project to establish the migrations tracking repository?
- A) `flask db start`
- B) `flask db init`
- C) `flask db setup`
- D) `flask db create`
**Answer:** B
**Explanation:** `flask db init` creates the `migrations/` folder structure and configurations needed to track schema revisions.

### Q3: What command automatically compares your SQLAlchemy models against the current database schema and creates a revision script?
- A) `flask db diff`
- B) `flask db migrate -m "message"`
- C) `flask db commit`
- D) `flask db generate`
**Answer:** B
**Explanation:** `flask db migrate -m "..."` generates an Alembic migration script by inspecting differences between model declarations and the live database schema.

### Q4: What command executes pending migration scripts and updates the database schema?
- A) `flask db apply`
- B) `flask db upgrade`
- C) `flask db run`
- D) `flask db push`
**Answer:** B
**Explanation:** `flask db upgrade` advances the database schema to the latest revision by executing the `upgrade()` function in pending migration files.

### Q5: Why should the `migrations/` directory be committed to Git?
- A) Because Git requires it to compile Python
- B) So team members and production deployment pipelines can apply identical, sequential schema updates without data loss
- C) To backup the database records
- D) To generate documentation
**Answer:** B
**Explanation:** Version-controlling migration files ensures that every developer environment and staging/production database transitions through the exact same schema revisions.
