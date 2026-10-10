# Role-Based Access Control & Custom Decorators

While authentication answers *"Who are you?"*, authorization answers *"What are you allowed to do?"*. A student should not be able to access the admin portal, and an instructor should not be able to delete another instructor's course.

In Flask, **Role-Based Access Control (RBAC)** is cleanly implemented using **Python Decorators** combined with `functools.wraps`.

---

## 1. Defining User Roles on the Model

First, attach role attributes or an Enum to your `User` model:

```python
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    role = db.Column(db.String(20), default="student", nullable=False) # 'student', 'instructor', 'admin'

    def is_admin(self):
        return self.role == "admin"

    def is_instructor(self):
        return self.role in ("instructor", "admin")
```

---

## 2. Crafting Custom Authorization Decorators

A custom decorator wraps a view function and checks permission conditions before invoking the original handler. Use `functools.wraps` to preserve function signatures and docstrings (essential for Flask routing!):

```python
from functools import wraps
from flask import abort
from flask_login import current_user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 1. Check if user is logged in
        if not current_user.is_authenticated:
            abort(401) # Unauthorized
            
        # 2. Check if user holds the admin role
        if not current_user.is_admin():
            abort(403) # Forbidden: authenticated, but insufficient privileges!
            
        return f(*args, **kwargs)
    return decorated_function
```

---

## 3. Parameterized Role Guard Decorator

For enterprise applications with multiple roles, create a reusable decorator that accepts permissible role names:

```python
def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                abort(401)
                
            if current_user.role not in allowed_roles:
                abort(403, description=f"Access requires one of these roles: {allowed_roles}")
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

---

## 4. Applying Decorators to Protected Routes

> [!IMPORTANT]
> **Decorator Order Matters:** The `@app.route()` decorator **must** always be on the outside (top), followed by authentication/authorization decorators:

```python
from flask import Flask, render_template

app = Flask(__name__)

# Only accessible by system administrators
@app.route("/admin/dashboard")
@admin_required
def admin_panel():
    return render_template("admin/dashboard.html")

# Accessible by instructors and admins
@app.route("/courses/create", methods=["GET", "POST"])
@roles_required("instructor", "admin")
def create_course():
    return render_template("instructor/create_course.html")
```

---

## Practice Quiz

### Q1: What HTTP status code should be returned when an authenticated user attempts to access a resource they do not have permissions for?
- A) `401 Unauthorized`
- B) `403 Forbidden`
- C) `404 Not Found`
- D) `405 Method Not Allowed`
**Answer:** B
**Explanation:** `401 Unauthorized` means authentication is required (the user is anonymous). `403 Forbidden` means the user is authenticated, but their role lacks authorization.

### Q2: Why is `@wraps(f)` from `functools` required when writing custom Flask view decorators?
- A) To compress Python bytecode
- B) To preserve the original view function's `__name__` and docstring, preventing endpoint collision errors in Flask's routing map
- C) To connect to the database
- D) To bypass CSRF validation
**Answer:** B
**Explanation:** Flask uses the function's `__name__` as the routing endpoint. Without `@wraps(f)`, every decorated function would be renamed to `decorated_function`, causing duplicate endpoint collisions.

### Q3: What is the correct ordering when applying `@app.route` and a custom permission decorator?
- A) `@admin_required` above `@app.route()`
- B) `@app.route()` must be the outermost decorator (on top), followed by `@login_required` and custom authorization decorators
- C) The order does not matter
- D) Decorators cannot be stacked
**Answer:** B
**Explanation:** `@app.route()` must be the outermost decorator so it binds the fully wrapped, protected callable to Flask's URL routing map.

### Q4: What does calling `abort(403)` do inside a decorator?
- A) Logs the user out immediately
- B) Immediately halts execution and triggers Flask's 403 Forbidden error handler
- C) Deletes the user account
- D) Restarts the server
**Answer:** B
**Explanation:** `abort(403)` raises a Werkzeug `Forbidden` exception, stopping the request from reaching the view function and returning an HTTP 403 response.

### Q5: How can UI navigation links be conditionally hidden from non-admin users in Jinja2 templates?
- A) `<admin-only><a href="/admin">Panel</a></admin-only>`
- B) `{% if current_user.is_authenticated and current_user.is_admin() %}<a href="/admin">Panel</a>{% endif %}`
- C) CSS `display: hidden`
- D) Jinja2 cannot check user roles
**Answer:** B
**Explanation:** Using `{% if current_user.is_authenticated and current_user.is_admin() %}` conditionally renders administrative links only for authorized users.
