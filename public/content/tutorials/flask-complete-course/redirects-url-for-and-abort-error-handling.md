# Reverse Routing with url_for, Aborts & Error Handlers

Hardcoding URLs (like `/user/profile` or `/products/123`) throughout templates and Python code creates brittle, error-prone applications. Flask provides **reverse routing** with `url_for()`, dynamic HTTP error triggers with `abort()`, and custom error handling with `@app.errorhandler`.

---

## 1. Reverse Routing with `url_for()`

Instead of hardcoding paths, `url_for()` dynamically resolves the URL for a given view function name:

```python
from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return "Home Page"

@app.route("/user/<username>")
def profile(username):
    return f"Profile of {username}"

@app.route("/login")
def login():
    # After successful authentication, redirect to user profile
    # Function name 'profile' is passed as the first argument
    return redirect(url_for("profile", username="sumit"))
```

### Why Use `url_for()`?
1. **Refactoring Safety:** If you change the URL pattern from `@app.route('/user/<username>')` to `@app.route('/members/<username>')`, your code and templates automatically update without breaking.
2. **Special Characters & Escaping:** Automatically encodes spaces and non-ASCII characters.
3. **Static File Resolution:** Generates fingerprint-aware URLs for CSS, JS, and image assets:
   ```html
   <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
   ```
4. **Absolute URLs:** Pass `_external=True` to generate full URLs (e.g. for verification emails):
   ```python
   reset_url = url_for("reset_password", token=token, _external=True)
   # Generates: https://example.com/reset-password?token=xyz
   ```

---

## 2. Triggering HTTP Errors with `abort()`

When a requested resource is absent or unauthorized, halt execution immediately with `abort()`:

```python
from flask import Flask, abort

app = Flask(__name__)

users_db = {1: "Alice", 2: "Bob"}

@app.route("/users/<int:user_id>")
def get_user(user_id):
    if user_id not in users_db:
        # Halts view execution and triggers an HTTP 404 response
        abort(404, description="User with the requested ID does not exist.")
    return {"user_id": user_id, "name": users_db[user_id]}
```

Common abort codes:
- `abort(400)`: Bad Request (malformed input)
- `abort(401)`: Unauthorized (authentication required)
- `abort(403)`: Forbidden (authenticated, but lacking permissions)
- `abort(404)`: Not Found
- `abort(500)`: Internal Server Error

---

## 3. Custom Error Handlers with `@app.errorhandler`

Default Flask error pages are plain and unstyled. You can customize them using `@app.errorhandler()`:

```python
from flask import render_template, jsonify

# HTML Error Handler for Web Clients
@app.errorhandler(404)
def page_not_found(error):
    # 'error' contains the HTTPException instance and description
    return render_template("errors/404.html", error_msg=error.description), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template("errors/500.html"), 500

# JSON API Error Handler
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "status": "error",
        "code": 400,
        "message": error.description or "Bad request syntax or parameters"
    }), 400
```

---

## Practice Quiz

### Q1: What is the primary parameter passed as the first argument to `url_for()`?
- A) The raw URL path string (e.g. `"/profile"`)
- B) The name of the target Python view function (or `'blueprint.function'`)
- C) The database table name
- D) The HTTP status code
**Answer:** B
**Explanation:** `url_for()` performs reverse routing by taking the view function name as its first argument and constructing the matching URL dynamically.

### Q2: How do you instruct `url_for()` to generate an absolute URL including domain and protocol (e.g. for email links)?
- A) `url_for('reset', absolute=True)`
- B) `url_for('reset', _external=True)`
- C) `url_for('reset', full_path=True)`
- D) `url_for('reset', domain=True)`
**Answer:** B
**Explanation:** Setting `_external=True` instructs `url_for()` to generate a complete absolute URL (e.g., `https://domain.com/path`) rather than a relative path.

### Q3: What does calling `abort(403)` do inside a view function?
- A) Closes the user's browser tab
- B) Immediately halts function execution and raises an HTTPException with a 403 Forbidden status
- C) Deletes the user account
- D) Rolls back database migrations
**Answer:** B
**Explanation:** `abort(status_code)` raises a Werkzeug `HTTPException` that halts the view and yields the corresponding HTTP status response.

### Q4: What must custom error handlers registered with `@app.errorhandler(404)` explicitly return along with the template/body?
- A) The client's IP address
- B) The corresponding HTTP status code (e.g. `404`)
- C) A CSRF token
- D) The SQL database connection
**Answer:** B
**Explanation:** Error handlers must return the error status code (e.g. `404`) as the second element of the tuple; otherwise Flask will return a misleading `200 OK` status with the error HTML!

### Q5: How do you reference a static asset file `static/css/main.css` inside a template using `url_for`?
- A) `url_for('css', file='main.css')`
- B) `url_for('static', filename='css/main.css')`
- C) `url_for('/static/css/main.css')`
- D) `url_for('assets', path='main.css')`
**Answer:** B
**Explanation:** Flask reserves the endpoint name `'static'` for serving files from the `static` directory via `url_for('static', filename='...')`.
