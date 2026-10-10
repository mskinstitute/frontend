# Creating First Django App

In Django, features are organized into modular, decoupled applications. When you create an app, Django scaffolds a standardized directory structure containing models, views, tests, and admin configurations. Learning how to create, register, and wire an app into the URL routing pipeline is the primary workflow of Django development.

---

## 1. Scaffolding an App with `startapp`

To create a new app named `articles`:

```bash
python manage.py startapp articles
```

Django generates the following files:

```
articles/
├── __init__.py
├── admin.py         # Registration of models with Django Admin dashboard
├── apps.py          # App configuration metadata
├── migrations/      # Auto-generated database migration scripts
│   └── __init__.py
├── models.py        # Data models and database schemas
├── tests.py         # Unit and integration test suites
└── views.py         # Request handling and HTTP response logic
```

---

## 2. Registering the App in `INSTALLED_APPS`

Django will **not** detect your app's models, migrations, or templates until it is registered in `settings.py`:

```python
# config/settings.py

INSTALLED_APPS = [
    # Core apps...
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Custom Domain Apps
    "articles.apps.ArticlesConfig", # Or simply 'articles'
]
```

---

## 3. Writing Your First View (`views.py`)

A Django view is a Python callable (function or class) that takes an `HttpRequest` object and returns an `HttpResponse` object.

```python
# articles/views.py
from django.http import HttpResponse, JsonResponse

def home_view(request):
    return HttpResponse("<h1>Welcome to Enterprise Django Platform</h1>")

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "articles-api",
        "version": "1.0.0"
    })
```

---

## 4. App-Level URL Routing (`articles/urls.py`)

Create a dedicated `urls.py` inside the `articles/` directory:

```python
# articles/urls.py
from django.urls import path
from . import views

# Application namespace for reverse URL resolution
app_name = "articles"

urlpatterns = [
    path("", views.home_view, name="home"),
    path("health/", views.health_check, name="health-check"),
]
```

---

## 5. Wiring App URLs to the Project Root

Connect the app's URLs to the root `config/urls.py`:

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("articles/", include("articles.urls")),
]
```

Now visiting `http://127.0.0.1:8000/articles/health/` returns the JSON payload:
```json
{
  "status": "healthy",
  "service": "articles-api",
  "version": "1.0.0"
}
```

---

## Practice Quiz

### Q1: What command scaffolds a new application module in a Django project?
- A) django-admin create-app <name>
- B) python manage.py startapp <name>
- C) python manage.py new-module <name>
- D) npm init django-app
**Answer:** B
**Explanation:** python manage.py startapp <name> scaffolds the standard Django application folder containing models.py, views.py, admin.py, and migrations.

### Q2: What happens if you forget to add a newly created app to INSTALLED_APPS in settings.py?
- A) The computer displays a blue screen
- B) Django will not discover the app's models, database migrations will not be generated, and templates or admin registrations will be ignored
- C) Django deletes the app folder automatically
- D) Python throws an IndentationError
**Answer:** B
**Explanation:** Django uses INSTALLED_APPS as the registry of active features; unregistered apps are completely ignored by the migration engine, template loader, and admin site.

### Q3: What is the fundamental contract of a Django view function?
- A) It must accept an HttpRequest object as its first parameter and return an HttpResponse object
- B) It must return a SQL query string
- C) It must return void
- D) It must take a CSS file and compile it
**Answer:** A
**Explanation:** Every Django view receives an HttpRequest object representing incoming HTTP request metadata and must return an HttpResponse (or subclass like JsonResponse) containing status and body.

### Q4: What is the purpose of setting app_name = "articles" in an app's urls.py?
- A) It changes the database name
- B) It establishes an application URL namespace, enabling unambiguous reverse URL lookups via reverse('articles:home')
- C) It sets the browser tab title
- D) It encrypts the route URLs
**Answer:** B
**Explanation:** app_name defines a namespace so you can reference routes uniquely as 'app_name:view_name' across templates and views, preventing collision with other apps.

### Q5: In which file should you define database tables and entity schemas for an app?
- A) views.py
- B) admin.py
- C) models.py
- D) urls.py
**Answer:** C
**Explanation:** models.py defines the data layer: classes inheriting from django.db.models.Model represent database tables, columns, and relationships.
