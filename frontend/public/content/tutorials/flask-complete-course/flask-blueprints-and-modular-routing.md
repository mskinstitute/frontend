# Modular Routing with Flask Blueprints

Putting all routes, models, and helper functions in a single `app.py` file works for prototypes, but enterprise applications quickly become unmaintainable as they grow to dozens of endpoints.

**Flask Blueprints** provide a modular pattern for dividing an application into reusable, self-contained components—such as an authentication module, an administrative portal, and a public API.

---

## 1. What is a Blueprint?

A **Blueprint** is essentially a recording object for application components (routes, error handlers, static files, and templates). Instead of registering routes directly with `app`, you register them with the Blueprint. Later, the Blueprint is registered onto the core application instance.

```
+-------------------------------------------------------------------------------+
|                            Flask Application (app)                            |
+-------------------------------------------------------------------------------+
        |                               |                               |
        v                               v                               v
+----------------+              +----------------+              +---------------+
| auth_bp        |              | courses_bp     |              | api_bp        |
| prefix: /auth  |              | prefix: /courses|             | prefix: /api  |
+----------------+              +----------------+              +---------------+
| /login         |              | /              |              | /v1/users     |
| /logout        |              | /<slug>        |              | /v1/checkout  |
| /register      |              | /enroll        |              | /v1/analytics |
+----------------+              +----------------+              +---------------+
```

---

## 2. Directory Structure for Blueprint-Driven Applications

```
my_enterprise_app/
├── app/
│   ├── __init__.py          # Initializes app and registers blueprints
│   ├── auth/                # Auth Blueprint
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── forms.py
│   ├── courses/             # Courses Blueprint
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── api/                 # REST API Blueprint
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── templates/
│   │   ├── auth/
│   │   └── courses/
│   └── static/
├── config.py
└── run.py
```

---

## 3. Defining a Blueprint

In `app/auth/routes.py`:

```python
from flask import Blueprint, render_template, redirect, url_for, flash

# Instantiate Blueprint
# First argument: Blueprint name
# Second argument: import_name (__name__)
# Optional: template_folder and url_prefix
auth_bp = Blueprint("auth", __name__, url_prefix="/auth", template_folder="templates")

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    return render_template("auth/login.html")

@auth_bp.route("/logout")
def logout():
    flash("Signed out successfully", "info")
    return redirect(url_for("auth.login")) # Note blueprint namespace!
```

---

## 4. Registering Blueprints with the Application

In `app/__init__.py`:

```python
from flask import Flask
from app.auth.routes import auth_bp
from app.courses.routes import courses_bp
from app.api.routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev-secret"

    # Register blueprints onto application
    app.register_blueprint(auth_bp)
    app.register_blueprint(courses_bp, url_prefix="/courses")
    app.register_blueprint(api_bp, url_prefix="/api/v1")

    return app
```

---

## 5. Reverse Routing with Blueprint Namespaces

When using Blueprints, `url_for()` requires the blueprint name as a prefix separated by a dot:

```python
# Absolute blueprint endpoint
url_for("auth.login")       # Resolves to /auth/login
url_for("courses.detail", slug="python") # Resolves to /courses/python

# Relative shorthand within the SAME blueprint
url_for(".login")           # Resolves to auth.login if invoked inside auth_bp!
```

---

## Practice Quiz

### Q1: What is the primary purpose of Flask Blueprints?
- A) To connect Flask directly to CSS compilers
- B) To organize an application into reusable, modular functional components and sub-applications
- C) To replace SQLite with PostgreSQL
- D) To automate browser testing
**Answer:** B
**Explanation:** Blueprints enable modular application design by grouping related views, templates, and static assets into distinct components.

### Q2: How is a route inside a blueprint named `admin` resolved using `url_for()`?
- A) `url_for('admin/dashboard')`
- B) `url_for('admin.dashboard')`
- C) `url_for('dashboard@admin')`
- D) `url_for('app.admin(dashboard)')`
**Answer:** B
**Explanation:** Blueprint endpoints in `url_for()` are formatted as `'blueprint_name.view_function_name'`.

### Q3: What does the `url_prefix` parameter do when registering a blueprint?
- A) Sets the domain name
- B) Prepends a shared path segment (e.g. `/api/v1`) to all routes declared within that blueprint
- C) Renames the Python module
- D) Enforces HTTPS
**Answer:** B
**Explanation:** Specifying `url_prefix='/admin'` prefixes every route defined in the blueprint with `/admin` automatically (e.g., `/admin/users`).

### Q4: Can a blueprint define its own dedicated `static_folder` and `template_folder`?
- A) No, only the root Flask application can have templates
- B) Yes, blueprints can specify isolated template and static asset directories
- C) Only on Linux servers
- D) Only in production mode
**Answer:** B
**Explanation:** `Blueprint('name', __name__, template_folder='templates', static_folder='static')` allows self-contained modules with isolated templates and assets.

### Q5: How do you refer to a view function in the current blueprint using relative endpoint notation?
- A) `url_for('~login')`
- B) `url_for('.login')`
- C) `url_for(':login')`
- D) `url_for('self.login')`
**Answer:** B
**Explanation:** Prefixing the endpoint with a period (`.view_name`) instructs Flask to resolve the function within the active blueprint namespace.
