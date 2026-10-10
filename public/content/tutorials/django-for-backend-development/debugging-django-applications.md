# Debugging Tips

Diagnosing bugs, tracking down unhandled exceptions, and resolving database locking issues are critical skills for backend engineers. Developing an efficient debugging workflow transforms opaque 500 server crashes into actionable solutions.

---

## 1. Understanding Django's Error Traceback

When `DEBUG = True`, Django displays an interactive debugging page on unhandled exceptions:

```
┌─────────────────────────────────────────────────────────────┐
│ TypeError at /articles/create/                              │
│ 'NoneType' object has no attribute 'username'               │
├─────────────────────────────────────────────────────────────┤
│ Request Method: POST                                        │
│ Request URL:    http://127.0.0.1:8000/articles/create/       │
│ Django Version: 5.0.2                                       │
│ Exception Type: TypeError                                   │
├─────────────────────────────────────────────────────────────┤
│ Traceback:                                                  │
│ File "/app/articles/views.py", line 42, in create_article   │
│   author_name = request.user.profile.username               │
│                                                             │
│ Local vars:                                                 │
│ request: <WSGIRequest: POST '/articles/create/'>            │
│ form:    <ArticleForm bound=True, valid=True>               │
└─────────────────────────────────────────────────────────────┘
```

Inspect **Local vars** at each frame to see the exact state of variables at the moment of the crash.

---

## 2. Interactive Debugging with Python `breakpoint()`

Modern Python 3.7+ includes the built-in `breakpoint()` function, which automatically pauses server execution and drops into the `pdb` (Python Debugger) terminal:

```python
# articles/views.py
def complex_financial_calculation(request):
    raw_amount = request.POST.get("amount")
    
    # Drop into interactive debugger!
    breakpoint()
    
    calculated_tax = float(raw_amount) * 0.18
    return JsonResponse({"tax": calculated_tax})
```

When the request hits this line, your terminal pauses with an interactive prompt:
- `p variable_name`: Print variable value.
- `n`: Step to **next** line of code.
- `s`: **Step into** the function currently being called.
- `c`: **Continue** normal execution until next breakpoint.
- `q`: **Quit** debugger immediately.

---

## 3. Structured Logging in Django

Never use `print()` statements for debugging in production codebases; `print()` lacks timestamps, log levels, and log rotation. Use Python's standard `logging` module:

```python
# config/settings.py
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} [{module}] {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs/django_errors.log",
            "formatter": "verbose",
            "level": "ERROR",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True,
        },
        "articles": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    },
}
```

In your views:

```python
import logging
logger = logging.getLogger(__name__)

def update_billing(request, user_id):
    logger.info(f"Initiating billing cycle for user {user_id}")
    try:
        ...
    except PaymentFailedError as exc:
        logger.error(f"Billing failed for user {user_id}: {exc}", exc_info=True)
```

`exc_info=True` automatically attaches the full exception traceback to the log!

---

## 4. Production Error Monitoring with Sentry

In production where `DEBUG = False`, unhandled exceptions present users with a generic 500 error page. Use **Sentry** to capture and aggregate production stack traces in real time:

```bash
pip install sentry-sdk
```

```python
# config/settings.py
import sentry_sdk

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=0.2, # 20% performance telemetry
    profiles_sample_rate=0.2,
)
```

---

## Practice Quiz

### Q1: What built-in Python function pauses execution and drops into the interactive pdb debugger?
- A) debug()
- B) breakpoint()
- C) stop()
- D) pause()
**Answer:** B
**Explanation:** Python 3.7+ introduced breakpoint() as the universal built-in trigger for interactive debugging, launching pdb or configured third-party debuggers.

### Q2: Why is using print() statements considered an anti-pattern for production server logging?
- A) print() statements slow down the CPU by 500%
- B) print() statements lack timestamps, severity levels (INFO/ERROR), structured JSON formatting, and cannot be routed to log monitoring files or aggregators
- C) print() is deprecated in Python 3
- D) print() breaks database transactions
**Answer:** B
**Explanation:** print() simply outputs unformatted text to stdout without log levels, timestamps, module origins, or log rotation capabilities provided by the logging framework.

### Q3: In the pdb debugger prompt, which command continues execution until the next breakpoint?
- A) n
- B) c
- C) s
- D) r
**Answer:** B
**Explanation:** In pdb, the c command stands for "continue", resuming standard execution until another breakpoint is hit or the process completes.

### Q4: What does exc_info=True accomplish when calling logger.error("Message", exc_info=True)?
- A) It sends an email to the user
- B) It automatically formats and includes the complete Python exception traceback in the log record
- C) It crashes the server
- D) It restarts the database
**Answer:** B
**Explanation:** exc_info=True instructs the logging module to capture and append the full exception traceback to the log message, which is vital for post-mortem debugging.

### Q5: What tool is standard in production Django environments for real-time error tracking and alerting?
- A) Google Analytics
- B) Sentry (sentry-sdk)
- C) SQLite
- D) Nginx
**Answer:** B
**Explanation:** Sentry is the industry standard for monitoring production exceptions, capturing stack traces, user context, request headers, and performance telemetry.
