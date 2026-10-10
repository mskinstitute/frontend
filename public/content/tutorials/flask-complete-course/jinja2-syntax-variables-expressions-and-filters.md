# Jinja2 Syntax, Variables & Custom Filters

Flask uses **Jinja2**, a fast, expressive, and extensible templating engine for Python. Jinja2 decouples application business logic from HTML presentation, preventing XSS vulnerabilities through automatic contextual HTML escaping.

---

## 1. The Three Primary Jinja2 Delimiters

Jinja2 distinguishes templates from standard HTML using three fundamental delimiter pairs:

1. `{{ expression }}`: **Expressions & Variables** (evaluates and prints output to template).
2. `{% statement %}`: **Statements & Control Logic** (for loops, conditionals, template inheritance).
3. `{# comment #}`: **Comments** (stripped out during rendering; never visible in page source).

---

## 2. Rendering Templates with `render_template()`

Flask automatically looks for templates in a folder named `templates/` located in the application's root directory.

### Project Layout:
```
my_flask_app/
├── app.py
└── templates/
    └── index.html
```

### Python View Code (`app.py`):
```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    user_data = {
        "username": "Priya Sharma",
        "role": "Lead Data Scientist",
        "is_authenticated": True,
        "skills": ["Python", "Flask", "SQLAlchemy", "PyTorch"]
    }
    # Pass variables into template context as keyword arguments
    return render_template("index.html", user=user_data, page_title="Dashboard")
```

### Template Code (`templates/index.html`):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ page_title }} - MSK Institute</title>
</head>
<body>
    <h1>Welcome, {{ user.username }}!</h1>
    <p>Role: {{ user['role'] }}</p>
    
    {# Calculate mathematical expressions directly in Jinja2 #}
    <p>Total skills: {{ user.skills|length }}</p>
</body>
</html>
```

---

## 3. Working with Jinja2 Filters

Filters modify or transform variables before they are rendered on the page. Apply filters using the pipe operator `|`:

```html
<!-- Text transformations -->
<p>{{ user.username|upper }}</p>            <!-- PRIYA SHARMA -->
<p>{{ user.username|lower }}</p>            <!-- priya sharma -->
<p>{{ user.username|title }}</p>            <!-- Priya Sharma -->

<!-- Safe Defaults -->
<p>{{ bio|default("No bio provided.", true) }}</p>

<!-- Numeric & List operations -->
<p>{{ scores|sum }}</p>
<p>{{ scores|sort }}</p>
<p>{{ "2026-09-16"|truncate(7) }}</p>

<!-- Escaping & HTML Raw Injection -->
<p>{{ raw_html_content|striptags }}</p>
<p>{{ trusted_html_snippet|safe }}</p>
```

> [!WARNING]
> Only use the `|safe` filter on trusted content you authored or sanitized with bleach. Never apply `|safe` directly to unsanitized user submissions, as this introduces severe Stored Cross-Site Scripting (XSS) vulnerabilities.

---

## 4. Creating Custom Template Filters

You can register custom Python functions as Jinja2 filters using the `@app.template_filter()` decorator:

```python
from datetime import datetime

@app.template_filter("currency_inr")
def format_inr(value):
    # Formats number into Indian Rupee format
    try:
        return f"₹{float(value):,.2f}"
    except (ValueError, TypeError):
        return value

@app.template_filter("time_ago")
def time_ago(dt):
    if not isinstance(dt, datetime):
        return dt
    now = datetime.now()
    diff = now - dt
    if diff.days > 0:
        return f"{diff.days} days ago"
    seconds = diff.seconds
    if seconds >= 3600:
        return f"{seconds // 3600} hours ago"
    return f"{seconds // 60} mins ago"
```

In your HTML template:
```html
<span class="price">{{ course.price|currency_inr }}</span>
<span class="date">Posted: {{ article.created_at|time_ago }}</span>
```

---

## Practice Quiz

### Q1: Which Jinja2 delimiter is used to evaluate expressions and print variables into the rendered HTML?
- A) `{% variable %}`
- B) `{{ variable }}`
- C) `{# variable #}`
- D) `<% variable %>`
**Answer:** B
**Explanation:** Double curly braces `{{ ... }}` denote variable interpolation and expressions in Jinja2.

### Q2: In which directory does Flask search for template files by default?
- A) `views/`
- B) `templates/`
- C) `html/`
- D) `static/`
**Answer:** B
**Explanation:** By convention, Flask searches for templates in a subfolder named `templates` located relative to the application module root.

### Q3: What does the Jinja2 `|safe` filter do?
- A) It encrypts the variable before storing it in the database
- B) It disables automatic HTML escaping for that variable, rendering raw HTML tags
- C) It removes all JavaScript scripts from the string
- D) It checks if the user is authenticated
**Answer:** B
**Explanation:** The `|safe` filter marks a string as safe HTML, preventing Jinja2 from escaping characters like `<` and `>`, allowing raw HTML to render.

### Q4: Which decorator registers a custom Python function as a Jinja2 filter in a Flask application?
- A) `@app.filter()`
- B) `@app.template_filter()`
- C) `@app.jinja_helper()`
- D) `@jinja2.register()`
**Answer:** B
**Explanation:** The `@app.template_filter('filter_name')` decorator registers a custom function as a filter available in all templates rendered by the application.

### Q5: How do comments written in `{# comment #}` appear in the rendered HTML source code sent to the client browser?
- A) As HTML comments `<!-- comment -->`
- B) They are completely stripped out by Jinja2 during compilation and never appear in the client's browser
- C) In bold red font
- D) In the browser console logs
**Answer:** B
**Explanation:** Jinja2 comment delimiters `{# ... #}` are processed server-side and completely omitted from the rendered output.
