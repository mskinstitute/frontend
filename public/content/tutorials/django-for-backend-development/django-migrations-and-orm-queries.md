# Migrations & ORM Queries

Django's Object-Relational Mapper (ORM) translates high-level Python method calls into optimized SQL queries. The ORM's `QuerySet` API is **lazy**: queries are not executed against the database until the data is explicitly evaluated. Mastering QuerySet filtering, chaining, aggregations, and migration workflows ensures both developer productivity and database performance.

---

## 1. The QuerySet Execution Lifecycle

A QuerySet represents a collection of database rows. Creating a QuerySet does **not** touch the database:

```python
# No SQL is executed here! (Lazy evaluation)
published_articles = Article.objects.filter(status="published").order_by("-created_at")

# Database query executes ONLY when QuerySet is evaluated:
for article in published_articles:  # 1. Iteration
    print(article.title)

article_list = list(published_articles)  # 2. Converting to list
count = published_articles.count()       # 3. Aggregation (executes SELECT COUNT(*))
first = published_articles.first()       # 4. Slicing / Indexing (LIMIT 1)
exists = published_articles.exists()     # 5. Boolean check (EXISTS query)
```

---

## 2. QuerySet Filtering with Field Lookups

Django uses double-underscore (`__`) notation for SQL operators:

```python
# Exact match
Article.objects.filter(status__exact="published")

# Case-insensitive contains (SQL LIKE '%django%')
Article.objects.filter(title__icontains="django")

# Greater than or equal (SQL >=)
Article.objects.filter(view_count__gte=1000)

# SQL IN operator
Article.objects.filter(category__slug__in=["python", "django", "backend"])

# Date filters
Article.objects.filter(created_at__year=2026)

# Spanning relationships across foreign keys:
# Find all articles written by user with username 'dr_sumit'
Article.objects.filter(author__username="dr_sumit")
```

---

## 3. Complex Queries with `Q` Objects and `F` Expressions

### Logical OR Queries with `Q`
Standard `.filter(a=1, b=2)` combines clauses with SQL `AND`. To write SQL `OR` queries, use `Q` objects:

```python
from django.db.models import Q

# SQL: WHERE status = 'published' OR is_featured = true
query = Article.objects.filter(Q(status="published") | Q(is_featured=True))

# SQL: WHERE status = 'published' AND NOT author_id = 5
query = Article.objects.filter(Q(status="published") & ~Q(author__id=5))
```

### Database Field Operations with `F` Expressions
`F` expressions reference database column values directly in SQL without loading them into Python memory:

```python
from django.db.models import F

# Atomically increment view_count in database (race-condition free!)
Article.objects.filter(id=1).update(view_count=F("view_count") + 1)
```

---

## 4. Advanced Migration Commands

```bash
# Display status of all applied/unapplied migrations
python manage.py showmigrations

# Rollback an app to a specific previous migration
python manage.py migrate articles 0002

# Rollback an app completely
python manage.py migrate articles zero
```

---

## Practice Quiz

### Q1: What does it mean that Django QuerySets are "lazy"?
- A) They execute slowly on the CPU
- B) QuerySets do not contact the database when constructed; SQL execution is deferred until the data is actually evaluated (iterated, sliced, or counted)
- C) They only work in development mode
- D) They do not support joins
**Answer:** B
**Explanation:** Lazy evaluation allows chaining filters and conditions without issuing multiple queries; SQL is executed only when the QuerySet is evaluated (e.g. in a loop or count()).

### Q2: How do you construct an SQL OR condition in Django ORM?
- A) Article.objects.filter(status='published').or_filter(is_featured=True)
- B) Article.objects.filter(Q(status='published') | Q(is_featured=True))
- C) Article.objects.or()
- D) Article.objects.where("status = 'published' OR is_featured = 1")
**Answer:** B
**Explanation:** Django's Q objects encapsulate SQL conditions that can be combined using bitwise operators (& for AND, | for OR, ~ for NOT).

### Q3: Why is using F('view_count') + 1 superior to article.view_count += 1 followed by save()?
- A) It formats the number into a string
- B) It performs the update directly inside the database engine via SQL (UPDATE ... SET view_count = view_count + 1), avoiding Python memory overhead and race conditions
- C) It deletes old records
- D) It only works on Fridays
**Answer:** B
**Explanation:** F expressions execute directly on the database server without pulling data into Python, preventing concurrency race conditions when multiple users increment counters simultaneously.

### Q4: Which method checks if matching records exist with maximum efficiency?
- A) len(Article.objects.filter(title='Test')) > 0
- B) Article.objects.filter(title='Test').exists()
- C) Article.objects.filter(title='Test').count() > 0
- D) list(Article.objects.filter(title='Test')) != []
**Answer:** B
**Explanation:** .exists() issues a lightweight SQL query (SELECT (1) AS `a` ... LIMIT 1) that evaluates existence without instantiating model objects or fetching full tables.

### Q5: What command lists all migrations across all apps along with an [X] indicating whether they have been applied?
- A) python manage.py listmigrations
- B) python manage.py showmigrations
- C) python manage.py status
- D) python manage.py check
**Answer:** B
**Explanation:** showmigrations outputs a clean overview of every installed app's migration files, marking applied migrations with [X] and unapplied ones with [ ].
