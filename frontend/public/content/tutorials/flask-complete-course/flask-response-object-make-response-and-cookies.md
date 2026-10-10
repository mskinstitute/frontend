# Response Objects, make_response & Cookies

Whenever a Flask view function completes execution, its return value is converted into an HTTP response object. Understanding how Flask constructs responses—and how to customize status codes, headers, and cookies using `make_response`—is critical for building robust web applications.

---

## 1. What Can a Flask View Return?

Flask accepts several return types from route handler functions:

1. **A String:** Converted to an HTML response (`200 OK`, `Content-Type: text/html`).
2. **A Dict or List:** Automatically serialized to JSON (`200 OK`, `Content-Type: application/json`).
3. **A Tuple `(body, status)`:** Sets custom status code: `return {"error": "Not Found"}, 404`.
4. **A Tuple `(body, status, headers)`:** Sets status code and custom HTTP headers.
5. **A WSGI Response Object:** An instance of `flask.Response` or created via `make_response()`.

```python
from flask import Flask, jsonify

app = Flask(__name__)

# Returning body + status code tuple
@app.route("/api/v1/created")
def created_example():
    return {"message": "Resource created"}, 201

# Returning body + status + custom headers tuple
@app.route("/api/v1/custom-header")
def custom_header():
    return "OK", 200, {"X-Custom-Engine": "Flask-MSK", "Cache-Control": "max-age=3600"}
```

---

## 2. Using `make_response()` for Explicit Control

When you need to mutate response headers, set cookies, or manipulate binary data before transmission, wrap the content in `make_response()`:

```python
from flask import Flask, make_response, render_template

app = Flask(__name__)

@app.route("/download/report.csv")
def download_csv():
    csv_data = "id,name,score\n1,Alice,98\n2,Bob,85\n3,Charlie,92"
    
    # Create explicit response object
    response = make_response(csv_data)
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers["Content-Disposition"] = "attachment; filename=report_2026.csv"
    return response
```

---

## 3. Working with HTTP Cookies

Cookies are small text strings stored by the client browser and transmitted in the `Cookie` header on subsequent requests.

### A. Setting a Cookie (`response.set_cookie()`)
Cookies must be attached to an outgoing response object before returning:

```python
from datetime import datetime, timedelta

@app.route("/set-preferences")
def set_preferences():
    response = make_response({"status": "Preferences saved"})
    
    # Set cookie with security attributes
    response.set_cookie(
        key="theme",
        value="dark_mode",
        max_age=timedelta(days=30),       # Cookie lifetime
        secure=True,                     # Only sent over HTTPS
        httponly=True,                   # Inaccessible to JavaScript (XSS defense)
        samesite="Lax"                   # CSRF defense
    )
    return response
```

### Cookie Security Attributes:
- `httponly=True`: Prevents client-side scripts (`document.cookie`) from reading the cookie, mitigating cross-site scripting (XSS) attacks.
- `secure=True`: Instructs the browser to only transmit the cookie over encrypted TLS/HTTPS connections.
- `samesite="Lax"` or `"Strict"`: Restricts cross-site cookie transmission to mitigate CSRF attacks.

### B. Reading a Cookie (`request.cookies`)
```python
from flask import request

@app.route("/get-preferences")
def get_preferences():
    theme = request.cookies.get("theme", default="light_mode")
    return f"Current active theme: {theme}"
```

### C. Deleting a Cookie (`response.delete_cookie()`)
Deleting a cookie sets its expiration date to the past:

```python
@app.route("/clear-preferences")
def clear_preferences():
    response = make_response({"status": "Preferences cleared"})
    response.delete_cookie("theme")
    return response
```

---

## Practice Quiz

### Q1: What utility function wraps raw return values into an explicit Flask `Response` object?
- A) `wrap_response()`
- B) `make_response()`
- C) `create_http_response()`
- D) `format_response()`
**Answer:** B
**Explanation:** `make_response()` converts any valid Flask return type (string, template, dictionary, tuple) into an explicit `Response` instance for header and cookie modification.

### Q2: Why should sensitive cookies always be configured with `httponly=True`?
- A) To make cookies load faster over HTTP/2
- B) To prevent malicious JavaScript from reading the cookie via `document.cookie` during an XSS attack
- C) To allow HTML forms to submit passwords
- D) To compress the cookie data
**Answer:** B
**Explanation:** Setting `httponly=True` forbids client-side JavaScript access to the cookie, neutralizing session token theft via Cross-Site Scripting (XSS).

### Q3: What does the `secure=True` cookie attribute guarantee?
- A) The cookie value is encrypted with AES-256
- B) The cookie is only transmitted by the browser over HTTPS encrypted connections
- C) The cookie cannot be deleted by the user
- D) The cookie expires in 1 hour
**Answer:** B
**Explanation:** `secure=True` instructs compliant browsers to never send the cookie over unencrypted plain HTTP connections.

### Q4: How do you return a custom HTTP status code and custom header without `make_response()`?
- A) Return a 3-element tuple: `return body, status_code, headers_dict`
- B) Set `app.status = 201`
- C) Pass `headers` as an argument to `@app.route()`
- D) Call `sys.set_status(201)`
**Answer:** A
**Explanation:** Flask natively recognizes a 3-element tuple `(body, status, headers)` as a shortcut to construct a complete response.

### Q5: How is an existing client cookie deleted in Flask?
- A) By calling `del request.cookies['key']`
- B) By calling `response.delete_cookie('key')` which expires the cookie in the client browser
- C) By restarting the Flask server
- D) By clearing server memory
**Answer:** B
**Explanation:** Calling `response.delete_cookie(key)` sends a `Set-Cookie` header with an expiration date in the past, prompting the browser to discard the cookie immediately.
