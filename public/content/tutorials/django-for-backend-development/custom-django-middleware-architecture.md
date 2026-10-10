# Custom Middleware

Django processes incoming HTTP requests and outgoing HTTP responses through an extensible pipeline known as **Middleware**. Each middleware component behaves like an onion layer: it can inspect, alter, or short-circuit incoming requests before they reach the view, and post-process outgoing responses before they are returned to the client browser.

---

## 1. The Middleware Execution Pipeline

```
Incoming Request:
Client ──► [SecurityMiddleware] ──► [SessionMiddleware] ──► [AuthMiddleware] ──► View Function
                                                                                      │
Outgoing Response:                                                                    ▼
Client ◄── [SecurityMiddleware] ◄── [SessionMiddleware] ◄── [AuthMiddleware] ◄── Response
```

- **Top-to-Bottom on Requests:** Middlewares execute in the exact order listed in `settings.MIDDLEWARE`.
- **Bottom-to-Top on Responses:** Middlewares execute in reverse order when returning responses.

---

## 2. Anatomy of Modern Callable Middleware

Modern Django middleware is structured as a Python callable (function or class) taking `get_response`:

```python
# config/middleware/request_timer.py
import time
import logging

logger = logging.getLogger("django.performance")

class PerformanceTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization upon server boot

    def __call__(self, request):
        # 1. Code executed BEFORE the view is called:
        start_time = time.monotonic()

        # 2. Hand over request to next layer (or view)
        response = self.get_response(request)

        # 3. Code executed AFTER the view completes:
        duration = time.monotonic() - start_time
        duration_ms = round(duration * 1000, 2)

        # Attach custom performance header to outgoing HTTP response
        response["X-Response-Time-Ms"] = str(duration_ms)

        if duration_ms > 500:
            logger.warning(
                f"Slow Request Detected: {request.method} {request.path} took {duration_ms}ms"
            )

        return response
```

---

## 3. Special Middleware Hooks

Classes can implement specialized hook methods for specific interception points:

- **`process_view(request, view_func, view_args, view_kwargs)`:** Called just before Django calls the view function. Returning an `HttpResponse` bypasses the view entirely.
- **`process_exception(request, exception)`:** Called when a view raises an unhandled exception. Ideal for reporting crashes to Sentry or Datadog.
- **`process_template_response(request, response)`:** Called if the view returned a `TemplateResponse` object, allowing manipulation of template context before rendering.

---

## 4. IP Whitelisting & API Rate Limiting Middleware

```python
# config/middleware/ip_guard.py
from django.http import HttpResponseForbidden
from django.conf import settings

class IPWhitelistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Restrict /admin/ access to corporate VPN IP ranges
        if request.path.startswith("/admin/"):
            client_ip = self.get_client_ip(request)
            if client_ip not in settings.ADMIN_IP_WHITELIST:
                return HttpResponseForbidden("Access Denied: IP address not in corporate whitelist.")

        return self.get_response(request)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
```

---

## 5. Registering Custom Middleware in `settings.py`

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # Custom Enterprise Middlewares:
    "config.middleware.request_timer.PerformanceTimingMiddleware",
    "config.middleware.ip_guard.IPWhitelistMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]
```

---

## Practice Quiz

### Q1: In what order do middleware components execute during the lifecycle of an HTTP request and response?
- A) Alphabetical order in both directions
- B) Top-to-bottom on incoming requests, and bottom-to-top (reverse) on outgoing responses
- C) Random order
- D) Only on responses
**Answer:** B
**Explanation:** Django's middleware architecture is an onion pipeline: requests traverse middlewares from top to bottom, and generated responses pass back through in reverse order.

### Q2: What does returning an HttpResponse directly from a middleware before calling get_response(request) do?
- A) It throws a 500 error
- B) It short-circuits the request pipeline, bypassing all subsequent middlewares and the view entirely (e.g. for access control or caching)
- C) It crashes the dev server
- D) It restarts the database
**Answer:** B
**Explanation:** Returning an HttpResponse early short-circuits execution, preventing the view from being invoked; this is standard for authorization guards, IP blockers, and response caching.

### Q3: How do you extract the real client IP address when Django sits behind a reverse proxy (e.g. Nginx or Cloudflare)?
- A) request.user.ip
- B) Reading request.META.get('HTTP_X_FORWARDED_FOR') and taking the first IP address
- C) document.ipAddress
- D) By querying DNS
**Answer:** B
**Explanation:** When requests pass through reverse proxies, REMOTE_ADDR reflects the proxy's IP; the client's actual origin IP is forwarded in the X-Forwarded-For HTTP header.

### Q4: When is the process_exception(request, exception) hook called?
- A) When a user enters the wrong password
- B) Only when a view raises an unhandled exception during its execution
- C) Whenever an SQL query runs
- D) During server startup
**Answer:** B
**Explanation:** process_exception is triggered exclusively when view execution results in an unhandled exception, allowing custom error logging, alerting, or formatted error responses.

### Q5: Why is __init__(self, get_response) only executed once in class-based middleware?
- A) Middleware classes are instantiated once when the web server boots and initializes the application, remaining in memory across requests
- B) Python forbids calling __init__ multiple times
- C) Django deletes the class after the first request
- D) Because of SQLite limitations
**Answer:** A
**Explanation:** Django instantiates middleware objects once during server startup; subsequent requests repeatedly execute the __call__(request) method on the existing instance.
