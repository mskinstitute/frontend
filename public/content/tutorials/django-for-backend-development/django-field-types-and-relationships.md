# Field Types & Relationships

Relational database design models the complex associations between real-world entities. Django provides expressive model relationship fields to enforce referential integrity across **One-to-Many**, **Many-to-Many**, and **One-to-One** relationships, complete with automated reverse lookup managers and cascade deletion policies.

---

## 1. The Three Relational Field Types

```
1. ForeignKey (One-to-Many):
   Author (1) ───────────< Articles (Many)
   (Each article has one author; an author writes many articles)

2. ManyToManyField (Many-to-Many):
   Articles (Many) >───────< Tags (Many)
   (An article has multiple tags; a tag belongs to multiple articles)

3. OneToOneField (One-to-One):
   User (1) ───────────── Profile (1)
   (Each user has exactly one profile; each profile belongs to one user)
```

---

## 2. Implementing Relationships in Code

```python
# articles/models.py
from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    title = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.title

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()

    # One-to-Many: Author relationship
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,       # Delete articles if user is deleted
        related_name="articles"         # Reverse lookup: user.articles.all()
    )

    # One-to-Many: Optional Category
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,      # Keep article if category deleted, set FK to null
        null=True,
        blank=True,
        related_name="articles"
    )

    # Many-to-Many: Tags (creates bridge/junction table automatically)
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True)

    def __str__(self):
        return self.title

class ArticleAnalytics(models.Model):
    # One-to-One: Detailed telemetry attached to exactly one Article
    article = models.OneToOneField(
        Article,
        on_delete=models.CASCADE,
        related_name="analytics",
        primary_key=True
    )
    bounce_rate = models.FloatField(default=0.0)
    avg_read_time_seconds = models.PositiveIntegerField(default=0)
```

---

## 3. Deletion Policies (`on_delete`)

When the referenced parent object is deleted, `on_delete` determines the behavior on child rows:

| `on_delete` Policy | Behavior | Best Use Case |
| :--- | :--- | :--- |
| `models.CASCADE` | Automatically deletes all child records referencing the parent. | User comments or invoice line items. |
| `models.PROTECT` | Raises `ProtectedError` and blocks deletion if children exist. | Deleting a Customer who has active orders. |
| `models.SET_NULL` | Sets the foreign key column to `NULL` (requires `null=True`). | Deleting a department or optional category. |
| `models.SET_DEFAULT`| Sets the foreign key to its configured default value. | Reassigning tickets to a default unassigned user. |
| `models.DO_NOTHING` | Takes no action; causes database foreign key constraint failures. | Rarely recommended. |

---

## 4. Reverse Relationships with `related_name`

The `related_name` argument defines the reverse accessor name on the parent model:

```python
# Forward lookup (from child to parent):
article = Article.objects.get(id=1)
print(article.author.username)

# Reverse lookup (from parent to children):
# Without related_name: user.article_set.all()
# With related_name="articles":
author_user = User.objects.get(username="dr_sumit")
user_articles = author_user.articles.all() # Clean and expressive!
```

---

## Practice Quiz

### Q1: What happens to child Article rows if their author User is deleted and author is configured with on_delete=models.CASCADE?
- A) The articles are reassigned to admin
- B) All child articles referencing that user are automatically deleted from the database
- C) The database throws an error and prevents the user from being deleted
- D) The author column is set to NULL
**Answer:** B
**Explanation:** models.CASCADE cascades the deletion down to dependent records, removing all articles that reference the deleted user.

### Q2: When should on_delete=models.PROTECT be used?
- A) When you want to prevent the parent record from being deleted if any related child records still reference it
- B) When you want to encrypt the relationship
- C) When you want to delete children silently
- D) When the child record is a password
**Answer:** A
**Explanation:** models.PROTECT raises a ProtectedError to block parent deletion if foreign keys point to it, safeguarding critical relational histories (like financial transactions).

### Q3: What is the primary purpose of the related_name argument on ForeignKey?
- A) To name the database foreign key index
- B) To define the reverse lookup attribute on the related parent model (e.g. user.articles.all() instead of user.article_set.all())
- C) To translate the model to another language
- D) To create a new column in the database
**Answer:** B
**Explanation:** related_name specifies the attribute name used to access related child records from the target parent model instance, improving code readability.

### Q4: How does Django store ManyToManyField data under the hood?
- A) As a comma-separated string in a single column
- B) In an automatically generated intermediate junction (join) table holding foreign keys to both related tables
- C) In browser localStorage
- D) In Redis cache
**Answer:** B
**Explanation:** Relational databases cannot store arrays in standard normalized columns; Django automatically creates a hidden junction table containing foreign keys to both models.

### Q5: How does a OneToOneField differ from a ForeignKey with unique=True?
- A) They are identical in SQL schema, but OneToOneField provides a direct single-object reverse accessor (user.profile) rather than a QuerySet manager
- B) OneToOneField only works on SQLite
- C) ForeignKey cannot be indexed
- D) OneToOneField does not support on_delete
**Answer:** A
**Explanation:** While both enforce unique constraints at the database level, OneToOneField's reverse relationship directly yields the related object rather than a QuerySet.
