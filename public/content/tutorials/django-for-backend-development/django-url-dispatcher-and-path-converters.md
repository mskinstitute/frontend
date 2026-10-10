# URL Dispatcher and Routing

The **URL Dispatcher** is the front door of every Django application. It matches incoming HTTP request paths against a list of URL patterns, extracts dynamic parameters (like integers, slugs, or UUIDs) using **Path Converters**, and dispatches the request to the matching view callable.

---

## 1. Anatomy of `path()` and `re_path()`

```python
from django.urls import path, re_path
from . import views

urlpatterns = [
    # 1. Static literal path
    path("about/", views.about_view, name="about"),

    # 2. Dynamic path with path converter
    path("articles/<int:pk>/", views.article_by_id, name="by-id"),

    # 3. Dynamic slug path
    path("articles/<slug:slug>/", views.article_by_slug, name="by-slug"),

    # 4. Regex path for specialized formats (e.g. 4-digit year)
    re_path(r"^archive/(?P<year>[0-9]{4})/$", views.archive_view, name="archive"),
]
```

---

## 2. Built-in Path Converters

Django includes five native path converters that both match patterns and typecast extracted URL parameters into native Python types:

| Path Converter | Matches | Python Type Passed to View | Example |
| :--- | :--- | :--- | :--- |
| `str` (default) | Any non-empty string excluding `/` | `str` | `<str:username>` matches `"alice"` |
| `int` | Zero or any positive integer | `int` | `<int:pk>` matches `42` -> passes `42` |
| `slug` | ASCII letters, numbers, hyphens, underscores | `str` | `<slug:post_slug>` matches `"django-orm-guide"` |
| `uuid` | Formatted UUID string | `uuid.UUID` | `<uuid:id>` matches `"123e4567-e89b-..."` |
| `path` | Any non-empty string **including** `/` | `str` | `<path:filepath>` matches `"media/docs/invoice.pdf"` |

---

## 3. Creating Custom Path Converters

If standard converters do not fit your domain (e.g. 4-digit years or phone numbers), register a custom converter:

```python
# config/converters.py
class FourDigitYearConverter:
    regex = r"[0-9]{4}"

    def to_python(self, value: str) -> int:
        # Cast matched URL string into Python integer
        return int(value)

    def to_url(self, value: int) -> str:
        # Cast Python value back to URL string for reverse()
        return f"{value:04d}"
```

Register in `urls.py`:

```python
# config/urls.py
from django.urls import path, register_converter
from config.converters import FourDigitYearConverter
from . import views

# Register converter with tag name 'yyyy'
register_converter(FourDigitYearConverter, "yyyy")

urlpatterns = [
    # Clean and readable!
    path("archive/<yyyy:year>/", views.year_archive, name="year-archive"),
]
```

---

## 4. Namespacing and URL Resolution

Always define `app_name` inside your app's `urls.py`:

```python
# billing/urls.py
app_name = "billing"

urlpatterns = [
    path("invoices/<int:pk>/", views.invoice_detail, name="invoice-detail"),
]
```

Resolve URLs unambiguously across your project:
- **In Python:** `reverse("billing:invoice-detail", kwargs={"pk": 105})`
- **In Templates:** `{% url 'billing:invoice-detail' pk=invoice.id %}`

---

## Practice Quiz

### Q1: What Python data type does the <int:pk> path converter pass into the view function?
- A) str
- B) int
- C) float
- D) list
**Answer:** B
**Explanation:** Path converters automatically typecast the matched URL segment; <int:pk> parses digits and passes a native Python int directly to the view.

### Q2: What characters are matched by the <slug:slug> path converter?
- A) Any Unicode character including spaces
- B) ASCII letters, numbers, hyphens, and underscores
- C) Only digits
- D) Only lowercase vowels
**Answer:** B
**Explanation:** The slug converter matches ASCII letters or numbers plus hyphens and underscores (e.g. hello-world_123).

### Q3: What two methods must a custom path converter class implement?
- A) validate() and execute()
- B) to_python() and to_url()
- C) serialize() and deserialize()
- D) get() and post()
**Answer:** B
**Explanation:** A custom converter class defines a regex attribute, to_python(value) (converting URL string to Python type), and to_url(value) (converting Python type back to URL string).

### Q4: When should you use the <path:subpath> converter instead of <str:subpath>?
- A) When you want to match floating point numbers
- B) When the URL segment contains forward slashes (/) that should be captured as part of the parameter (e.g. file directory paths)
- C) Path converters cannot capture slashes
- D) When matching hexadecimal numbers
**Answer:** B
**Explanation:** <str> stops matching at the first forward slash (/), whereas <path> matches the complete path including nested slashes.

### Q5: What function registers a custom path converter with Django's URL dispatcher?
- A) register_converter()
- B) add_path_converter()
- C) django.urls.setup()
- D) url_converter()
**Answer:** A
**Explanation:** register_converter(ConverterClass, 'converter_name') registers your custom converter for use in path() strings across the project.
