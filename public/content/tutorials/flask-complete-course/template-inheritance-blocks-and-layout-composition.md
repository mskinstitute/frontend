# Template Inheritance & Layout Composition

Copying and pasting navigation bars, footers, head meta tags, and stylesheet imports across dozens of HTML pages is a recipe for maintenance nightmares. **Template inheritance** is Jinja2's most powerful feature, enabling you to build a master skeleton template containing common elements while child templates override specific content blocks.

---

## 1. The Master Skeleton (`templates/base.html`)

The base template defines the universal structure of your website and marks customizable areas using `{% block <name> %}{% endblock %}`:

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}MSK Institute{% endblock %}</title>
    
    <!-- Universal CSS Stylesheets -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}">
    
    <!-- Child templates can inject custom page-specific styles here -->
    {% block extra_css %}{% endblock %}
</head>
<body class="bg-gray-50 text-gray-900 flex flex-col min-h-screen">

    <!-- Global Navigation Header -->
    <header class="bg-indigo-900 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" class="text-2xl font-bold tracking-tight">MSK Institute</a>
            <nav class="space-x-6">
                <a href="/" class="hover:text-indigo-200">Home</a>
                <a href="/courses" class="hover:text-indigo-200">Courses</a>
                <a href="/contact" class="hover:text-indigo-200">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {% block content %}
        <!-- Default content replaced by child templates -->
        {% endblock %}
    </main>

    <!-- Global Footer -->
    <footer class="bg-gray-900 text-gray-400 py-6 text-center text-sm">
        <p>&copy; 2026 MSK Institute of Technology. All rights reserved.</p>
    </footer>

    <!-- Universal Scripts -->
    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

---

## 2. Child Templates (`{% extends %}`)

Child templates declare which base template they inherit from using `{% extends "base.html" %}`. This **must** be the very first tag in the child template file!

```html
<!-- templates/courses.html -->
{% extends "base.html" %}

{% block title %}Explore Engineering Courses - MSK Institute{% endblock %}

{% block extra_css %}
<link rel="stylesheet" href="{{ url_for('static', filename='css/course-cards.css') }}">
{% endblock %}

{% block content %}
<section class="space-y-6">
    <h1 class="text-3xl font-extrabold text-indigo-950">Professional Certification Courses</h1>
    <p class="text-gray-600">Choose from industry-aligned full-stack and cloud tracks.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {% for course in courses %}
        <div class="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold">{{ course.title }}</h2>
            <p class="text-sm text-gray-500 mt-2">{{ course.description }}</p>
            <a href="/courses/{{ course.slug }}" class="mt-4 inline-block text-indigo-600 font-semibold">
                Enroll Now &rarr;
            </a>
        </div>
        {% endfor %}
    </div>
</section>
{% endblock %}
```

---

## 3. Preserving Parent Content with `super()`

If a child template wants to add content to a block without completely overwriting what the parent template defined, call `{{ super() }}`:

```html
<!-- Child template appending a title -->
{% block title %}
    {{ super() }} | Courses Catalog
{% endblock %}
<!-- If parent title was "MSK Institute", output becomes: "MSK Institute | Courses Catalog" -->
```

---

## 4. Modular Partials with `{% include %}`

While `{% extends %}` provides top-down vertical page scaffolding, `{% include %}` allows horizontal inclusion of modular template snippets (e.g. newsletter banners, navigation bars, modals):

```html
<!-- Include a reusable newsletter signup form -->
<div class="sidebar">
    {% include "partials/_newsletter_box.html" %}
    {% include "partials/_social_links.html" %}
</div>
```

---

## Practice Quiz

### Q1: What rule must be strictly followed when using `{% extends %}` in a child template?
- A) It must be placed inside the `<body>` tag
- B) It must be the very first tag in the child template file
- C) It must be called after `{% include %}`
- D) It can only inherit from Python files
**Answer:** B
**Explanation:** The `{% extends %}` tag must be the very first statement in a child template so Jinja2 knows to resolve the parent layout before processing any blocks.

### Q2: How does a child template keep and append to the content defined in the parent block instead of replacing it?
- A) `{{ parent() }}`
- B) `{{ super() }}`
- C) `{{ base() }}`
- D) `{{ inherit() }}`
**Answer:** B
**Explanation:** Calling `{{ super() }}` inside a block renders the contents of the parent template's block at that location.

### Q3: What is the key difference between `{% extends %}` and `{% include %}`?
- A) `{% extends %}` is for JavaScript files; `{% include %}` is for HTML files
- B) `{% extends %}` establishes an inheritance hierarchy from a parent skeleton; `{% include %}` simply embeds a standalone partial snippet directly
- C) `{% include %}` can only be used once per project
- D) `{% extends %}` requires a database connection
**Answer:** B
**Explanation:** Inheritance (`extends`) structures overall layout from base templates down to child views, whereas `include` imports reusable template fragments horizontally.

### Q4: What happens if a child template does not define a block that exists in the parent template?
- A) Jinja2 throws a TemplateSyntaxError
- B) The parent template's default fallback block content is rendered seamlessly
- C) The entire page fails to load
- D) The HTML output is corrupted
**Answer:** B
**Explanation:** Any block omitted in a child template simply renders whatever default content was provided inside `{% block %}` in the parent template.

### Q5: Can child templates define multiple blocks (e.g., `title`, `content`, `extra_js`) within the same file?
- A) No, only one block is permitted per file
- B) Yes, child templates can override as many distinct named blocks as defined by the parent
- C) Only if registered in `app.py`
- D) Only in production mode
**Answer:** B
**Explanation:** A child template can override any number of named blocks established throughout the ancestor template hierarchy.
