# DRF API Exception Handling and Custom Exception Handler

In production API engineering, unhandled exceptions that return raw HTML error tracebacks or non-standard JSON shapes damage client stability. Django REST Framework provides a centralized **Exception Handler** architecture that intercepts exceptions and maps them into uniform, machine-readable JSON error contracts.

---

## 1. DRF's Default Exception Handling Behavior

By default, DRF handles its own internal exceptions (`rest_framework.exceptions.APIException` subclasses, such as `ValidationError`, `NotAuthenticated`, `PermissionDenied`, `NotFound`, `Throttled`).

However, **native Python/Django exceptions** (e.g. `django.core.exceptions.ValidationError`, `ObjectDoesNotExist`, `IntegrityError`, `KeyError`) are **not** caught by DRF's default handler! They bubble up and return raw `500 Server Error` HTML pages.

---

## 2. Implementing a Custom Enterprise Exception Handler

A custom exception handler intercepts all exceptions, normalizes Django exceptions into DRF errors, and formats error responses into a consistent enterprise schema:

```python
# api/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
import logging

logger = logging.getLogger("django.request")

def custom_api_exception_handler(exc, context):
    # 1. Map Django native exceptions to DRF exceptions
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, "message_dict"):
            exc = serializers.ValidationError(exc.message_dict)
        else:
            exc = serializers.ValidationError(exc.messages)

    if isinstance(exc, IntegrityError):
        # Translate database integrity violation (e.g. duplicate key)
        return Response(
            {
                "error": "Database Conflict",
                "detail": "A database constraint was violated. Duplicate record detected.",
                "code": "DB_INTEGRITY_CONFLICT",
            },
            status=status.HTTP_409_CONFLICT,
        )

    # 2. Call DRF's standard exception handler to get the base Response
    response = exception_handler(exc, context)

    # 3. Handle unhandled exceptions (500 Internal Server Errors)
    if response is None:
        view_name = context.get("view").__class__.__name__ if context.get("view") else "Unknown"
        logger.error(f"Unhandled Exception in {view_name}: {exc}", exc_info=True)

        return Response(
            {
                "error": "Internal Server Error",
                "detail": "An unexpected server error occurred. Our engineering team has been alerted.",
                "code": "INTERNAL_SERVER_ERROR",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # 4. Standardize standard DRF errors into unified envelope
    standardized_payload = {
        "error": exc.__class__.__name__,
        "status_code": response.status_code,
        "detail": response.data,
    }
    response.data = standardized_payload

    return response
```

---

## 3. Registering the Handler in `settings.py`

```python
# config/settings.py
REST_FRAMEWORK = {
    # Point to custom exception handler function
    "EXCEPTION_HANDLER": "api.exceptions.custom_api_exception_handler",
}
```

---

## 4. Standardized Response Format

Now, every single error across your entire API returns a predictable, standardized JSON contract:

```json
{
  "error": "ValidationError",
  "status_code": 400,
  "detail": {
    "email": ["Enter a valid corporate email address."],
    "amount": ["Amount must be greater than zero."]
  }
}
```

---

## Practice Quiz

### Q1: What happens by default in DRF when a view raises a native Django IntegrityError or standard Python KeyError?
- A) DRF catches it and returns 400 Bad Request
- B) DRF's default exception handler returns None, causing Django to bubble the exception up to a standard 500 Internal Server Error (often rendering HTML)
- C) It converts the error to XML
- D) The database drops the table
**Answer:** B
**Explanation:** DRF's default exception handler only processes DRF's own APIException subclasses; native Django or Python exceptions return None and trigger 500 HTML error pages.

### Q2: What parameter in settings.py registers a custom API exception handler?
- A) ERROR_HANDLER
- B) EXCEPTION_HANDLER under REST_FRAMEWORK (e.g. 'api.exceptions.custom_handler')
- C) CUSTOM_EXCEPTIONS
- D) MIDDLEWARE_ERRORS
**Answer:** B
**Explanation:** REST_FRAMEWORK['EXCEPTION_HANDLER'] points to the custom callable responsible for intercepting and formatting exceptions.

### Q3: What two arguments does an exception handler function receive?
- A) (request, response)
- B) (exc, context) where exc is the exception instance and context is a dict containing request and view information
- C) (error_code, message)
- D) (status, headers)
**Answer:** B
**Explanation:** The exception handler receives the caught exception (exc) and a context dictionary (containing 'view', 'request', 'args', 'kwargs').

### Q4: Why should database IntegrityError exceptions be mapped to HTTP 409 Conflict instead of generic 500 errors?
- A) To make errors harder to understand
- B) Integrity errors typically indicate client conflicts (such as duplicate entries on unique columns), which are client-correctable 4xx conflicts rather than backend server crashes
- C) Python forbids 500 errors
- D) It bypasses database indexes
**Answer:** B
**Explanation:** Unique constraint violations represent client-side conflicts (HTTP 409) rather than backend infrastructure failures (HTTP 500).

### Q5: What is the primary architectural benefit of a unified error response envelope across an enterprise API?
- A) It makes tests run faster
- B) Client applications (React, iOS, Android) can implement a single universal error-handling interceptor rather than parsing dozens of inconsistent error formats
- C) It eliminates the need for HTTP status codes
- D) It compiles Python code to C++
**Answer:** B
**Explanation:** Consistent JSON error contracts allow client-side HTTP interceptors to handle validation, authentication, and server errors systematically without custom per-endpoint parsing.
