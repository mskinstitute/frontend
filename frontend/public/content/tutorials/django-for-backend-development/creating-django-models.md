# Creating Models

Django's **Object-Relational Mapper (ORM)** allows you to define your database schema using clean, idiomatic Python classes. A Django model is the single, definitive source of truth about your data: it contains the essential fields and behaviors of the data you're storing. Django automatically maps model classes to SQL database tables and handles migrations without writing raw SQL.

---

## 1. Defining a Model Class

Every model inherits from `django.db.models.Model`. Each class attribute represents a database column.

```python
# articles/models.py
from django.db import models
from django.utils.text import slugify

class Article(models.Model):
    # Core data fields
    title = models.CharField(max_length=200, help_text="Article headline")
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    content = models.TextField()
    
    # Status choices
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    
    # Numerical and Boolean fields
    view_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    # Automatic audit timestamps
    created_at = models.DateTimeField(auto_now_add=True) # Set only upon creation
    updated_at = models.DateTimeField(auto_now=True)     # Updated on every save()

    class Meta:
        # Table metadata configuration
        db_table = "enterprise_articles"
        ordering = ["-created_at"] # Default ordering: newest first
        verbose_name = "Article"
        verbose_name_plural = "Articles"

    def __str__(self):
        return f"{self.title} ({self.status})"

    def save(self, *args, **kwargs):
        # Automatically generate URL slug if empty
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
```

---

## 2. Model Field Options

Django field definitions accept universal configuration options:
- `null=True`: Allows the database column to store `NULL` values. (Avoid on `CharField`/`TextField` where Django conventions prefer empty strings `""`).
- `blank=True`: Controls form/admin validation; allows the field to be submitted empty in web forms.
- `default=value`: Default value assigned when creating a new record.
- `unique=True`: Enforces an SQL `UNIQUE` constraint on the column.
- `db_index=True`: Creates an SQL B-tree index on the column for accelerated lookup speeds.

---

## 3. The `auto_now` vs `auto_now_add` Timestamp Rule

- **`auto_now_add=True`:** Automatically sets the field to `now()` when the object is **first created**. Ideal for `created_at`.
- **`auto_now=True`:** Automatically updates the field to `now()` **every time** the record is saved via `save()`. Ideal for `updated_at`.

---

## 4. Generating and Applying SQL Migrations

Whenever you create or modify a model:

```bash
# 1. Inspect models and generate migration scripts in articles/migrations/
python manage.py makemigrations articles

# 2. View raw SQL that Django will execute (optional inspection)
python manage.py sqlmigrate articles 0001

# 3. Apply changes to physical database tables
python manage.py migrate
```

---

## Practice Quiz

### Q1: What class must all Django models inherit from?
- A) django.views.View
- B) django.db.models.Model
- C) object
- D) django.core.ModelBase
**Answer:** B
**Explanation:** All Django models inherit from django.db.models.Model, which provides the underlying ORM machinery for database mapping, querysets, and migrations.

### Q2: What is the difference between null=True and blank=True in Django model fields?
- A) They are exact duplicates
- B) null=True controls database-level NULL storage, while blank=True controls field validation in Django forms and the admin panel
- C) null=True is for strings; blank=True is for numbers
- D) blank=True alters SQL column constraints
**Answer:** B
**Explanation:** null is purely database-related (allowing NULL in the database column), whereas blank is validation-related (determining whether a form or admin input can be left blank).

### Q3: How does auto_now_add=True differ from auto_now=True on DateTimeField?
- A) auto_now_add sets the timestamp only upon initial record creation; auto_now updates the timestamp every time the object is saved
- B) auto_now_add only works with UTC; auto_now uses local time
- C) auto_now is deprecated
- D) auto_now_add adds 1 hour to the time
**Answer:** A
**Explanation:** auto_now_add is stamped once upon initial creation (created_at), while auto_now is refreshed on every save operation (updated_at).

### Q4: Why is defining a __str__ method on models considered an enterprise best practice?
- A) It converts database data to JSON
- B) It returns a human-readable string representation of the model instance in the Django Admin, shell, and debug logs instead of `<Article: Article object (1)>`
- C) It is required for migrations
- D) It encrypts the model
**Answer:** B
**Explanation:** The __str__ method controls how instances appear in the Django admin UI, interactive shell, and logging outputs, making records easy to identify.

### Q5: What command generates Python migration files from modified models without applying them to the database?
- A) python manage.py migrate
- B) python manage.py makemigrations
- C) python manage.py create-tables
- D) python manage.py db-sync
**Answer:** B
**Explanation:** makemigrations scans your models.py files and generates declarative migration instructions in the migrations/ folder; migrate then executes those instructions against the database.
