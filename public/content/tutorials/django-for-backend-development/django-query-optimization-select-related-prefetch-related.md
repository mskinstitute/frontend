# Query Optimization

The Object-Relational Mapper (ORM) abstracts database interactions, but naive ORM queries frequently introduce severe performance bottlenecks. The most notorious enterprise performance flaw is the **N+1 Queries Problem**, where fetching a list of 100 records issues 101 separate SQL queries to the database. Django provides `select_related` and `prefetch_related` to eliminate the N+1 problem completely.

---

## 1. The Catastrophic N+1 Queries Problem

Consider displaying 100 articles alongside their author's name:

```python
# ❌ The N+1 Anti-Pattern:
articles = Article.objects.all()[:100] # 1 SQL Query: SELECT * FROM articles LIMIT 100

for article in articles:
    # Triggers an additional SQL query ON EVERY ITERATION:
    # SELECT * FROM auth_user WHERE id = article.author_id
    print(article.author.username)

# Total Database Queries: 1 + 100 = 101 queries!
```

If 100 concurrent users visit this view, the database receives **10,100 queries per second**, crushing database CPU and ballooning response times to seconds.

---

## 2. `select_related`: SQL `INNER JOIN` (Single-Valued Relationships)

`select_related` performs an SQL `JOIN` in a **single database query**, pre-populating related foreign keys and one-to-one models:

```python
# ✅ Solved with select_related (One-to-Many & One-to-One):
articles = Article.objects.select_related("author", "category")[:100]

# Single SQL Query Executed:
# SELECT enterprise_articles.*, auth_user.*, enterprise_category.*
# FROM enterprise_articles
# INNER JOIN auth_user ON enterprise_articles.author_id = auth_user.id
# LEFT OUTER JOIN enterprise_category ON enterprise_articles.category_id = enterprise_category.id
# LIMIT 100

for article in articles:
    # Zero additional queries! Author and Category are already in Python memory!
    print(article.author.username, article.category.name)

# Total Database Queries: EXACTLY 1!
```

**Rule of Thumb:** Use `select_related` for `ForeignKey` and `OneToOneField`.

---

## 3. `prefetch_related`: Multi-Valued Relationships (Many-to-Many)

SQL `JOIN`s on Many-to-Many or reverse ForeignKey relationships result in Cartesian product data duplication. `prefetch_related` solves this by executing **two separate queries** and stitching records together in Python:

```python
# ✅ Solved with prefetch_related (Many-to-Many & Reverse FK):
articles = Article.objects.prefetch_related("tags")[:100]

# Query 1: SELECT * FROM enterprise_articles LIMIT 100
# Query 2: SELECT * FROM enterprise_tags WHERE article_id IN (1, 2, 3, ... 100)
# Django joins the instances in memory!

for article in articles:
    for tag in article.tags.all(): # Zero additional queries!
        print(tag.title)

# Total Database Queries: EXACTLY 2!
```

---

## 4. Combining Both in Production

In complex dashboards, combine both techniques seamlessly:

```python
articles = (
    Article.objects
    .filter(status="published")
    .select_related("author", "category")     # SQL JOIN for single relations
    .prefetch_related("tags", "comments")     # Batch queries for multi-relations
    .only("id", "title", "slug", "created_at", "author__username") # Restrict columns
)
```

### `only()` and `defer()`
- `only(*fields)`: Limits the `SELECT` clause to retrieve only specified columns, reducing database bandwidth for tables with massive `TextField` columns.
- `defer(*fields)`: Fetches all columns except the specified heavy columns.

---

## Practice Quiz

### Q1: What is the "N+1 Queries Problem" in database ORMs?
- A) A bug where calculations are off by 1
- B) An efficiency defect where querying 1 parent list issues 1 initial query followed by N individual queries to fetch related child rows for each item in the list
- C) An algorithm for binary search
- D) A database index failure
**Answer:** B
**Explanation:** N+1 queries occur when accessing related objects in a loop executes a new database query per item, devastating database throughput.

### Q2: When should you use select_related vs prefetch_related?
- A) select_related is for SQLite; prefetch_related is for PostgreSQL
- B) select_related uses SQL JOINs for single-valued relationships (ForeignKey, OneToOne); prefetch_related executes separate batch queries for multi-valued relationships (ManyToMany, reverse ForeignKeys)
- C) They are identical
- D) prefetch_related is deprecated
**Answer:** B
**Explanation:** select_related performs a single SQL JOIN (ideal for single-valued FKs), whereas prefetch_related performs a batch lookup with WHERE IN to avoid Cartesian product bloat on multi-valued sets.

### Q3: How many total database queries are executed when querying 500 articles with Article.objects.select_related('author')?
- A) 501 queries
- B) Exactly 1 query
- C) 500 queries
- D) 2 queries
**Answer:** B
**Explanation:** select_related performs an SQL JOIN in the primary query, fetching article and author columns in a single SQL operation.

### Q4: What does the .only("title", "created_at") method accomplish on a QuerySet?
- A) It makes the QuerySet read-only
- B) It restricts the SQL SELECT statement to retrieve only the specified columns, reducing memory and network overhead for tables with large content fields
- C) It deletes all other columns
- D) It only returns 1 row
**Answer:** B
**Explanation:** only() optimizes memory and payload size by querying only the specified columns rather than SELECT *, deferring other fields until explicitly accessed.

### Q5: What happens if code accesses a deferred field that was excluded via .defer('content')?
- A) It returns None
- B) Django executes an automatic individual SQL query on the fly to fetch the missing column from the database
- C) It raises an AttributeError
- D) The application crashes
**Answer:** B
**Explanation:** Deferred fields are loaded lazily: accessing a deferred attribute triggers a targeted SQL query to retrieve its value when needed.
