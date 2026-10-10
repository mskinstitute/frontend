# Installing and Configuring Django REST Framework

**Django REST Framework (DRF)** is the industry-standard toolkit for building Web APIs in Python. It equips Django with browsable web APIs, serializers, content negotiation, pagination, throttling, and modular authentication schemes. Configuring DRF correctly in `settings.py` establishes the architectural defaults for your entire API.

---

## 1. Installation

```bash
# Install Django REST Framework
pip install djangorestframework

# Optional recommended companion packages
pip install markdown       # Markdown support for the browsable API
pip install django-filter  # Advanced filtering backends
```

Add `rest_framework` to `INSTALLED_APPS`:

```python
# config/settings.py
INSTALLED_APPS = [
    # Core Django apps...
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party applications
    "rest_framework",
    "django_filters",

    # Local apps
    "api",
]
```

---

## 2. Global REST_FRAMEWORK Configuration

The `REST_FRAMEWORK` dictionary in `settings.py` defines global defaults across all endpoints:

```python
# config/settings.py
REST_FRAMEWORK = {
    # 1. Global Authentication Policies
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication", # For Browsable API & cookies
        "rest_framework_simplejwt.authentication.JWTAuthentication", # For SPA & Mobile
    ],

    # 2. Global Permission Policies
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated", # Secure by default: require login!
    ],

    # 3. Global Pagination
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,

    # 4. Global Filtering & Search Backends
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],

    # 5. Global Throttling (Rate Limiting)
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/hour",
    },

    # 6. Renderers (JSON in production, HTML Browsable API in dev)
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
}
```

---

## 3. The Interactive Browsable API

One of DRF's premier features is the **Browsable API**. When an endpoint is requested via a web browser (`Accept: text/html`), DRF renders a fully interactive HTML interface allowing developers to inspect JSON outputs, execute test `POST` / `PUT` forms, and view response headers directly in the browser!

To enable login/logout in the browsable API, include DRF's authentication views in `urls.py`:

```python
# config/urls.py
from django.urls import path, include

urlpatterns = [
    # ... your routes
    path("api-auth/", include("rest_framework.urls")), # Enables login in browsable UI
]
```

---

## 4. Production Security: Disabling Browsable API

In high-security production environments, you may wish to disable the HTML Browsable API to save bandwidth and avoid exposing form schemas:

```python
# In production settings:
if not DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
        "rest_framework.renderers.JSONRenderer",
    ]
```

---

## Practice Quiz

### Q1: What entry must be added to INSTALLED_APPS in settings.py to activate Django REST Framework?
- A) "drf"
- B) "rest_framework"
- C) "django_api"
- D) "django_rest"
**Answer:** B
**Explanation:** DRF is registered as an installed Django application using the package name "rest_framework".

### Q2: What is the primary benefit of the BrowsableAPIRenderer?
- A) It compiles Python code to JavaScript
- B) It provides an interactive web UI in the browser where developers can test endpoints, submit form payloads, and inspect JSON responses without external tools like Postman
- C) It deletes unauthorized users
- D) It runs unit tests
**Answer:** B
**Explanation:** The Browsable API renders a human-friendly web interface for testing endpoints, viewing headers, and executing mock requests directly within the browser.

### Q3: Why is configuring DEFAULT_PERMISSION_CLASSES: ['rest_framework.permissions.IsAuthenticated'] considered an enterprise security best practice?
- A) It disables public endpoints completely
- B) It adopts a "secure by default" posture: all API endpoints require authentication unless a view explicitly declares AllowAny
- C) It enables two-factor authentication
- D) It encrypts database tables
**Answer:** B
**Explanation:** Making IsAuthenticated the global default prevents accidental exposure of private endpoints when developers forget to add permission classes to individual views.

### Q4: What does adding path("api-auth/", include("rest_framework.urls")) enable in urls.py?
- A) It generates SSL certificates
- B) It wires the login and logout views required to authenticate sessions within the interactive Browsable API interface
- C) It connects to Google OAuth
- D) It creates an admin user
**Answer:** B
**Explanation:** rest_framework.urls provides session login and logout endpoints tailored for authenticating within the interactive Browsable API view.

### Q5: What is the purpose of DEFAULT_RENDERER_CLASSES in DRF settings?
- A) It styles CSS components
- B) It configures content negotiation: defining which formats (e.g. JSON, Browsable HTML, XML) DRF can use to serialize outgoing response bodies
- C) It renders templates with React
- D) It controls database table rendering
**Answer:** B
**Explanation:** DEFAULT_RENDERER_CLASSES dictates the media types and serialization renderers supported by the API based on client Accept request headers.
