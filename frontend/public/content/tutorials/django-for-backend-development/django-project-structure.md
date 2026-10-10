# Django Project Structure

A well-structured Django project scales cleanly from a simple prototype into an enterprise platform with dozens of engineers. Understanding the distinction between a **Project** and an **App**, as well as the responsibilities of each generated file (`settings.py`, `urls.py`, `wsgi.py`, `asgi.py`), is foundational to backend engineering.

---

## 1. Projects vs Apps: The Architectural Distinction

- **Django Project:** The overarching container and configuration root. It defines database connections, middleware pipelines, installed apps, global URL routing, and security settings. A project can contain multiple apps.
- **Django App:** A focused, self-contained Python package that accomplishes a single business domain (e.g. `users`, `billing`, `inventory`, `notifications`). An app can theoretically be reused across different Django projects.

```
my_enterprise_project/
├── manage.py                  # Project management CLI
├── config/                    # Project Configuration Package
│   ├── __init__.py
│   ├── settings.py            # Global project settings & configs
│   ├── urls.py                # Root URL dispatcher
│   ├── asgi.py                # ASGI entrypoint for WebSockets/async
│   └── wsgi.py                # WSGI entrypoint for synchronous servers
└── apps/                      # Custom Domain Apps
    ├── accounts/              # User authentication & profiles
    ├── billing/               # Stripe/PayPal transactions & invoices
    └── products/              # Inventory & catalog models
```

---

## 2. Anatomy of `settings.py`

The `settings.py` file dictates all runtime behavior:

```python
import os
from pathlib import Path

# Base project directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security: Never keep SECRET_KEY or DEBUG=True in production!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-secret-key-change-me")
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = ["localhost", "127.0.0.1", ".enterprise.com"]

# Applications installed in this project
INSTALLED_APPS = [
    # Core Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party packages
    "rest_framework",
    "corsheaders",
    # Local domain apps
    "apps.accounts",
    "apps.billing",
]

# Middleware execution pipeline (order matters!)
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

# Database configuration (PostgreSQL in production, SQLite in local dev)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

---

## 3. WSGI vs ASGI Entrypoints

- **`wsgi.py` (Web Server Gateway Interface):** The synchronous Python web standard. Used by traditional production WSGI servers like Gunicorn or uWSGI to serve synchronous HTTP views.
- **`asgi.py` (Asynchronous Server Gateway Interface):** The modern asynchronous Python specification. Required for handling asynchronous views, WebSockets (via Django Channels), and long-lived streaming connections with servers like Uvicorn or Daphne.

---

## 4. Root URL Routing (`urls.py`)

The root `urls.py` delegates subpaths to specific apps via `include()`:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/billing/", include("apps.billing.urls")),
]
```

---

## Practice Quiz

### Q1: What is the fundamental difference between a Django Project and a Django App?
- A) A project runs on Python; an app runs on Node.js
- B) A project is the overall container of configuration and settings; an app is a self-contained module representing a specific domain feature (e.g. billing, blog)
- C) An app contains the database; a project contains the CSS
- D) There is no difference; they are exact synonyms
**Answer:** B
**Explanation:** In Django's architecture, a project represents the complete site configuration and contains one or more modular apps that encapsulate domain-specific business logic.

### Q2: What is the purpose of asgi.py compared to wsgi.py?
- A) asgi.py compiles templates to WebAssembly
- B) asgi.py provides the asynchronous entrypoint for WebSockets and async Python views, whereas wsgi.py is synchronous
- C) asgi.py is used exclusively for unit testing
- D) wsgi.py is deprecated and should be deleted
**Answer:** B
**Explanation:** ASGI supports asynchronous Python capabilities like WebSockets and async view execution, whereas WSGI is the traditional synchronous HTTP standard.

### Q3: Why is DEBUG = False mandatory in production environments?
- A) With DEBUG = True, Django reveals detailed traceback pages containing environment variables, database passwords, and source code on any unhandled exception
- B) Django cannot connect to PostgreSQL with DEBUG = True
- C) DEBUG = True disables CSS styles
- D) DEBUG = True restricts traffic to 1 request per second
**Answer:** A
**Explanation:** Leaving DEBUG enabled in production exposes sensitive architectural details, secret keys, environment variables, and stack traces to potential attackers upon any error.

### Q4: What does the include() function do in the root urls.py?
- A) It imports CSS stylesheets into HTML
- B) It mounts and delegates URL routing patterns from child app-specific urls.py files into the root URLconf
- C) It merges database tables
- D) It restarts the development server
**Answer:** B
**Explanation:** include() decouples URL routing by allowing each app to manage its own internal routing endpoints, which the root urls.py includes at a specific prefix.

### Q5: Why is the order of items in the MIDDLEWARE list important?
- A) It dictates the alphabetical sorting of log files
- B) Middleware components execute sequentially top-to-bottom on incoming requests, and in reverse bottom-to-top on outgoing responses
- C) It controls database table creation order
- D) Django randomly shuffles the middleware list at runtime
**Answer:** B
**Explanation:** Django processes middleware as an onion pipeline: incoming requests pass through each middleware from top to bottom, while responses flow through them in reverse order.
