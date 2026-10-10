# Django Debug Toolbar

Diagnosing performance issues in Django requires visibility into what occurs under the hood on every HTTP request. The **Django Debug Toolbar (DDT)** is a configurable sidebar that attaches to rendered HTML pages during local development, displaying detailed metrics on **SQL queries executed**, **cache hits/misses**, **HTTP headers**, **template rendering times**, and **memory consumption**.

---

## 1. Installing and Configuring Django Debug Toolbar

```bash
pip install django-debug-toolbar
```

### Configuration in `settings.py`:

```python
# config/settings.py

# 1. Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ...
    "debug_toolbar",
]

# 2. Add middleware (Place early in pipeline, just after GZip/Security)
MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    # ... other middlewares
]

# 3. Configure Internal IPs (ensures toolbar only shows on localhost)
INTERNAL_IPS = [
    "127.0.0.1",
    "localhost",
]
```

### Configuration in `config/urls.py`:

```python
from django.conf import settings
from django.urls import path, include

urlpatterns = [
    # ... project URLs
]

# Only include debug toolbar routes in development mode
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
```

---

## 2. The SQL Panel: Catching N+1 Queries

The most powerful panel in DDT is the **SQL Panel**:

```
┌─────────────────────────────────────────────────────────────┐
│ Django Debug Toolbar - SQL Queries                          │
├─────────────────────────────────────────────────────────────┤
│ Total Queries: 104  |  Time: 182.40ms  |  Duplicates: 101    │
├─────────────────────────────────────────────────────────────┤
│ 1. SELECT * FROM enterprise_articles (1.2ms)                │
│ 2. SELECT * FROM auth_user WHERE id = 1 (0.8ms) [DUPLICATE] │
│ 3. SELECT * FROM auth_user WHERE id = 1 (0.9ms) [DUPLICATE] │
│ 4. SELECT * FROM auth_user WHERE id = 1 (0.8ms) [DUPLICATE] │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

- **Duplicate Queries Badge:** Highlights duplicate queries in **red/magenta**, instantly alerting you to an N+1 query bug!
- **`EXPLAIN` and `TRACE`:** Clicking `EXPLAIN` on any query shows the database execution plan, showing if a full table scan occurred due to a missing index.

---

## 3. Other Core Debug Panels

- **Time Panel:** Breaks down CPU execution time between Python code, template compilation, and database queries.
- **Templates Panel:** Lists every template and partial (`base.html`, `_card.html`) rendered on the page, along with context variables passed to each.
- **Cache Panel:** Shows cache hits, misses, and keys accessed during the request.
- **Signals Panel:** Displays all signals dispatched and the receivers triggered.
- **Headers Panel:** Inspects incoming client headers and outgoing response headers.

---

## 4. Enabling Debug Toolbar Inside Docker

When running Django inside Docker, `request.META['REMOTE_ADDR']` is the Docker bridge IP (e.g. `172.18.0.1`), which causes `INTERNAL_IPS = ["127.0.0.1"]` to fail. Use this callback to enable DDT inside Docker containers:

```python
# config/settings.py
def show_toolbar(request):
    return DEBUG and not request.is_ajax()

DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}
```

---

## Practice Quiz

### Q1: What is the primary purpose of the Django Debug Toolbar?
- A) To design CSS grids
- B) To provide an interactive diagnostic sidebar during local development displaying executed SQL queries, execution timings, cache metrics, and templates
- C) To run automated unit tests in production
- D) To translate models into REST APIs
**Answer:** B
**Explanation:** Django Debug Toolbar provides deep visibility into the performance and execution metrics of the current request, particularly database queries and template rendering.

### Q2: Why must the Debug Toolbar URL patterns and middleware be guarded behind if settings.DEBUG?
- A) The toolbar will not function without CSS
- B) Displaying the debug toolbar in production would expose SQL queries, database passwords, and internal code architecture to public end users
- C) It crashes Linux servers
- D) Python deletes the toolbar in production
**Answer:** B
**Explanation:** The toolbar reveals private database queries, parameters, and server metrics; exposing it in production creates a critical security vulnerability.

### Q3: What visual indicator does the SQL panel display when an N+1 query issue exists?
- A) A popup alert box
- B) A highlighted duplicate query counter showing identical queries executed repeatedly
- C) It shuts down the development server
- D) It turns the web page black
**Answer:** B
**Explanation:** The toolbar identifies duplicate queries and highlights them with warning badges, making N+1 queries immediately obvious.

### Q4: Why is INTERNAL_IPS = ["127.0.0.1"] required for the Debug Toolbar to display?
- A) It sets the database IP address
- B) The toolbar checks INTERNAL_IPS to ensure it only renders for authorized local development clients, preventing unauthorized IP access
- C) It enables WiFi connections
- D) It is a legacy requirement for Python 2
**Answer:** B
**Explanation:** INTERNAL_IPS acts as a security safeguard; the toolbar only displays if the client IP appears in this whitelist.

### Q5: What information does clicking "EXPLAIN" on an SQL query in the toolbar reveal?
- A) A natural language description written by AI
- B) The database engine's underlying query execution plan, revealing index usage, sequential table scans, and estimated row costs
- C) The Python source code file
- D) The server CPU temperature
**Answer:** B
**Explanation:** EXPLAIN runs the database engine's query optimizer plan (e.g. EXPLAIN ANALYZE in PostgreSQL), showing whether indexes were utilized or if expensive table scans occurred.
