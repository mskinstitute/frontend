# Dynamic URLs & Type Converters

Routing connects incoming client URLs to corresponding Python view functions. In real-world web applications, URLs are rarely completely static; they contain dynamic resource identifiers such as user IDs, article slugs, or UUIDs.

---

## 1. Declaring Dynamic URL Parameters

To define dynamic URL parameters, place a variable name inside angle brackets `<variable_name>` within `@app.route()`:

```python
from flask import Flask

app = Flask(__name__)

@app.route("/user/<username>")
def show_user_profile(username):
    # 'username' is passed as a string argument to the function
    return f"Displaying profile for user: {username}"
```

If a client requests `/user/sumit`, Flask extracts `'sumit'` and passes it as the `username` argument to `show_user_profile()`.

---

## 2. Built-in URL Type Converters

By default, URL segments are parsed as strings. Flask provides built-in **type converters** (`<converter:variable_name>`) to validate and typecast incoming parameters automatically:

| Converter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `string` | `str` | Accepts any text without slashes (default) | `<string:category>` |
| `int` | `int` | Accepts positive integers only; typecasts to `int` | `<int:product_id>` |
| `float` | `float` | Accepts positive floating point numbers | `<float:discount_rate>` |
| `path` | `str` | Accepts any text, **including slashes** | `<path:file_subpath>` |
| `uuid` | `uuid.UUID` | Accepts RFC 4122 UUID strings | `<uuid:order_id>` |

### Practical Code Example:

```python
import uuid
from flask import Flask, abort

app = Flask(__name__)

@app.route("/products/<int:product_id>")
def get_product(product_id):
    # product_id is already an integer
    assert isinstance(product_id, int)
    return {"product_id": product_id, "name": f"Product #{product_id}"}

@app.route("/orders/<uuid:order_id>")
def get_order(order_id):
    # order_id is a valid uuid.UUID instance
    assert isinstance(order_id, uuid.UUID)
    return {"order_id": str(order_id), "status": "Shipped"}

@app.route("/downloads/<path:file_path>")
def download_file(file_path):
    # file_path captures slashes: e.g. 'docs/2026/report.pdf'
    return f"Streaming file located at: {file_path}"
```

If a client visits `/products/abc` (a non-integer), Flask's converter automatically rejects the request with an HTTP `404 Not Found` without ever invoking `get_product()`.

---

## 3. Unique URLs and Trailing Slash Redirection

Flask enforces canonical, unique URLs:

```python
@app.route("/projects/")
def projects():
    return "The projects page"

@app.route("/about")
def about():
    return "The about page"
```

1. **Canonical folder URL (`/projects/`):** If a user visits `/projects` without a trailing slash, Flask automatically sends an HTTP `308 Permanent Redirect` to `/projects/`.
2. **Canonical file URL (`/about`):** If a user visits `/about/` with a trailing slash, Flask returns an HTTP `404 Not Found`.

This rule prevents duplicate content penalties in search engine optimization (SEO).

---

## 4. Custom Regex Converters

When built-in converters are insufficient, you can create custom converters by subclassing `werkzeug.routing.BaseConverter`:

```python
from werkzeug.routing import BaseConverter

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super().__init__(url_map)
        self.regex = items[0]

# Register converter with the Flask app
app.url_map.converters['regex'] = RegexConverter

# Use in routes: match only 4-digit years
@app.route("/archive/<regex('[0-9]{4}'):year>")
def archive_by_year(year):
    return f"Viewing archives for year {year}"
```

---

## Practice Quiz

### Q1: What is the default type converter if none is specified (e.g. `@app.route('/user/<username>')`)?
- A) `int`
- B) `path`
- C) `string`
- D) `regex`
**Answer:** C
**Explanation:** If no converter prefix is provided, Flask defaults to the `string` converter, which accepts any string excluding slashes.

### Q2: Which built-in converter permits slashes (`/`) within the URL segment?
- A) `string`
- B) `path`
- C) `uuid`
- D) `float`
**Answer:** B
**Explanation:** The `path` converter allows slashes, making it ideal for matching nested file paths or hierarchical categories.

### Q3: What happens if a client requests `/orders/hello` for a route defined as `@app.route('/orders/<int:order_id>')`?
- A) Flask crashes with a Python 500 ValueError
- B) Flask returns an HTTP 404 Not Found because the type converter rejects non-integer strings
- C) Flask typecasts 'hello' to integer 0
- D) Flask redirects to the homepage
**Answer:** B
**Explanation:** When an incoming URL does not match the converter's criteria (e.g., non-digits for an `int` converter), Werkzeug's routing engine rejects it with an HTTP 404.

### Q4: Why does Flask redirect `/projects` to `/projects/` when the route is defined with a trailing slash?
- A) To save server bandwidth
- B) To enforce canonical URL standardization and avoid SEO duplicate content issues
- C) Because web browsers do not support URLs without slashes
- D) To bypass CSRF security
**Answer:** B
**Explanation:** Flask standardizes URLs like file directory systems: routes with a trailing slash behave like folders, and requests missing the trailing slash receive a 308 redirect to prevent duplicate SEO indexing.

### Q5: How do you register a custom URL converter in Flask?
- A) `app.register_converter('name', Class)`
- B) `app.url_map.converters['name'] = Class`
- C) `@app.converter('name')`
- D) `app.config['CONVERTERS'] = {'name': Class}`
**Answer:** B
**Explanation:** Custom converters subclassing `BaseConverter` must be added directly to `app.url_map.converters` mapping dictionary.
