# OpenAPI 3 and Swagger UI with drf-spectacular

Interactive API documentation is essential for modern frontend-backend collaboration. DRF OpenAPI 3 documentation is powered by `drf-spectacular`, the officially recommended documentation generator for Django REST Framework.

---

## 1. Why `drf-spectacular`?

Older tools like `coreapi` and `drf-yasg` only supported OpenAPI 2.0 (Swagger 2.0). `drf-spectacular` generates fully compliant **OpenAPI 3.0** schemas, supporting:
- Rich typing and JSON Schema validation
- Accurate component schemas for nested serializers and Polymorphic models
- Interactive **Swagger UI** and **Redoc** endpoints
- Client code generation (TypeScript fetch, Axios, Python SDKs)

---

## 2. Installation and Settings Configuration

Install the package:

```bash
pip install drf-spectacular
```

Add to `INSTALLED_APPS` and configure DRF default schema class in `settings.py`:

```python
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'drf_spectacular',
    'store',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'MSK Institute E-Commerce & Academy API',
    'DESCRIPTION': 'High-performance REST API with JWT Auth, Filtering, and Stripe integration.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
}
```

---

## 3. Configuring URL Endpoints

In `config/urls.py`, register the raw schema download endpoint and the interactive Swagger UI:

```python
from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

urlpatterns = [
    # OpenAPI Schema (YAML or JSON)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI (Interactive Explorer)
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # Redoc (Clean Documentation Reader)
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

Visiting `/api/docs/swagger/` in your browser provides an interactive dashboard where developers can test endpoints, view request bodies, inspect status codes, and authenticate using the "Authorize" button.

---

## Practice Quiz

### Q1: What standard does `drf-spectacular` generate documentation for?
- A) GraphQL SDL
- B) OpenAPI 3.0
- C) SOAP WSDL
- D) gRPC Proto3
**Answer:** B
**Explanation:** `drf-spectacular` is the modern standard for generating OpenAPI 3.0 schemas for Django REST Framework applications.

### Q2: What setting must be added to `REST_FRAMEWORK` in `settings.py` for `drf-spectacular` to inspect views?
- A) `'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'`
- B) `'SWAGGER_SETTINGS': {'USE_SESSION_AUTH': False}`
- C) `'OPENAPI_PARSER': 'drf_spectacular.Parser'`
- D) `'DOCS_ENGINE': 'spectacular'`
**Answer:** A
**Explanation:** Setting `'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema'` instructs DRF viewsets to delegate schema introspection to drf-spectacular.

### Q3: What is the purpose of `SpectacularAPIView` in `urls.py`?
- A) It serves the static JavaScript and CSS bundle for Swagger UI
- B) It generates and downloads the underlying raw OpenAPI 3 schema in YAML or JSON format
- C) It intercepts incoming HTTP requests to log them into Sentry
- D) It serves the Django admin panel
**Answer:** B
**Explanation:** `SpectacularAPIView` exposes the raw generated OpenAPI 3.0 schema file (YAML/JSON) consumed by Swagger UI, Redoc, or frontend code generators.

### Q4: What does setting `'SERVE_INCLUDE_SCHEMA': False` in `SPECTACULAR_SETTINGS` do?
- A) It deletes the schema from the server disk
- B) It prevents the `/api/schema/` endpoint itself from appearing inside the generated API documentation list
- C) It hides all private customer endpoints
- D) It disables database migrations
**Answer:** B
**Explanation:** `SERVE_INCLUDE_SCHEMA: False` keeps the schema generation endpoint itself out of the public documentation schema to keep the list clean.

### Q5: Why is OpenAPI 3 documentation superior to static markdown for frontend developers?
- A) It supports live "Try It Out" execution and allows automated client code generation (TypeScript types/Axios clients)
- B) It reduces Python server memory consumption by 50%
- C) It forces users to enter credit card info
- D) It encrypts SQL database queries
**Answer:** A
**Explanation:** OpenAPI 3 schemas can be plugged into Swagger UI for live browser requests and imported into code generators like `openapi-typescript` to create type-safe frontend clients automatically.
