# CRUD Operations, Query Filtering & Pagination

The fundamental responsibility of any web application backend is executing **CRUD** operations: **C**reating, **R**eading, **U**pdating, and **D**eleting records. Flask-SQLAlchemy manages transactions and database operations through **`db.session`**.

---

## 1. Creating Records (`db.session.add`)

To insert records into the database:
1. Instantiate the model class.
2. Add it to the active transaction with `db.session.add()`.
3. Commit the transaction with `db.session.commit()`.

```python
from models import db, Course

@app.route("/courses/new", methods=["POST"])
def create_course():
    data = request.get_json()
    
    new_course = Course(
        title=data["title"],
        slug=data["slug"],
        price=data.get("price", 49.99),
        is_published=True
    )
    
    try:
        db.session.add(new_course)
        db.session.commit()
        return {"status": "Created", "id": new_course.id}, 201
    except Exception as e:
        # Essential: rollback the session on error to avoid leaving it in an invalid state!
        db.session.rollback()
        return {"error": "Failed to create course", "details": str(e)}, 400
```

---

## 2. Reading & Querying Records

In modern SQLAlchemy (2.0 style supported in Flask-SQLAlchemy 3.x), query records using `db.select()` or model query shortcuts:

### Querying All Records:
```python
# Fetch all published courses
courses = Course.query.filter_by(is_published=True).all()
```

### Querying a Single Record:
```python
# By Primary Key (returns None if missing)
course = Course.query.get(10)

# Or 404 Helper (aborts with HTTP 404 automatically if not found!)
course = Course.query.get_or_404(10, description="Course not found")

# First matching record
course = Course.query.filter_by(slug="flask-complete-course").first_or_404()
```

### Advanced Filtering & Sorting:
```python
# Complex filters with operators (<, >, !=, like)
cheap_courses = Course.query.filter(
    Course.price < 50.00,
    Course.title.ilike("%python%")
).order_by(Course.created_at.desc()).limit(10).all()
```

---

## 3. Updating Records

To update an existing record, fetch the instance, mutate its Python attributes, and commit:

```python
@app.route("/courses/<int:course_id>/price", methods=["PATCH"])
def update_price(course_id):
    course = Course.query.get_or_404(course_id)
    new_price = request.json.get("price")
    
    # Mutate attribute
    course.price = new_price
    
    # SQLAlchemy tracks the modification automatically!
    db.session.commit()
    return {"status": "Price updated", "new_price": float(course.price)}
```

---

## 4. Deleting Records (`db.session.delete`)

```python
@app.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    db.session.delete(course)
    db.session.commit()
    return {"message": "Course permanently deleted"}, 200
```

---

## 5. Built-in Database Pagination (`paginate()`)

Fetching thousands of database rows at once exhausts server memory and crashes browser clients. Flask-SQLAlchemy provides native pagination via `.paginate()`:

```python
@app.route("/courses")
def list_courses():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    
    # Generates a Pagination object
    pagination = Course.query.filter_by(is_published=True)\
        .order_by(Course.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
        
    # The Pagination object contains:
    # pagination.items -> current page's list of Course objects
    # pagination.total -> total number of matching records in database
    # pagination.pages -> total pages
    # pagination.has_prev / pagination.has_next
    
    return render_template("courses_list.html", pagination=pagination)
```

In Jinja2:
```html
{% for course in pagination.items %}
    <h3>{{ course.title }}</h3>
{% endfor %}

<div class="pagination-controls">
    {% if pagination.has_prev %}
        <a href="?page={{ pagination.prev_num }}">Previous</a>
    {% endif %}
    <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
    {% if pagination.has_next %}
        <a href="?page={{ pagination.next_num }}">Next</a>
    {% endif %}
</div>
```

---

## Practice Quiz

### Q1: What does `get_or_404(pk)` do if no record matches the primary key?
- A) Returns `None`
- B) Automatically aborts view execution with an HTTP 404 Not Found error
- C) Inserts a new record with that primary key
- D) Retries the query 3 times
**Answer:** B
**Explanation:** `get_or_404()` looks up an entity by primary key and immediately raises an `HTTPException(404)` if the record is missing.

### Q2: Why is `db.session.rollback()` essential inside an `except` block?
- A) It re-installs the database
- B) It cancels the failed transaction and resets the session to a clean state so subsequent queries do not fail
- C) It deletes the database tables
- D) It emails the client an error log
**Answer:** B
**Explanation:** If an error (e.g. unique constraint collision) occurs during a transaction, the session enters an aborted state; calling `rollback()` resets it.

### Q3: How do you access the list of records on the current page from a Flask-SQLAlchemy `Pagination` object?
- A) `pagination.data`
- B) `pagination.items`
- C) `pagination.records`
- D) `pagination.rows`
**Answer:** B
**Explanation:** The `.items` property of a `Pagination` instance contains the Python list of model objects for the current page.

### Q4: When updating an existing model instance's attributes, why is `db.session.add(instance)` typically unnecessary?
- A) Flask saves all changes automatically without committing
- B) Because the instance is already in the session's identity map; SQLAlchemy automatically tracks attribute mutations and updates them upon `commit()`
- C) Because SQLAlchemy updates cannot be tracked
- D) Because `add()` is only for deleting
**Answer:** B
**Explanation:** Loaded instances are already tracked by the SQLAlchemy identity map. Mutating attributes flags the object as dirty, and changes are flushed upon `db.session.commit()`.

### Q5: Which query method performs case-insensitive wildcard pattern matching in SQLAlchemy?
- A) `Course.title.regex()`
- B) `Course.title.ilike('%term%')`
- C) `Course.title.match()`
- D) `Course.title.contains_case()`
**Answer:** B
**Explanation:** `.ilike()` compiles to the SQL `ILIKE` operator (or `LOWER(column) LIKE LOWER(value)`), enabling case-insensitive pattern matching.
