# Template Inheritance

Writing redundant HTML boilerplate across dozens of views—such as repetitive `<head>` tags, navigation bars, CSS stylesheets, and footers—violates the Don't Repeat Yourself (DRY) principle. Django's **Template Inheritance** solves this using a skeleton layout architecture with overridable `{% block %}` sections.

---

## 1. The Master Base Layout (`base.html`)

Create a master layout defining the site-wide HTML skeleton and content slots:

```django
{# templates/base.html #}
{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  {# Overridable Title Block with default fallback #}
  <title>{% block title %}Enterprise Django Portal{% endblock %}</title>
  
  {# Tailwind CSS CDN / Static Assets #}
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="{% static 'css/styles.css' %}">
  
  {# Extra Head Block for per-page CSS #}
  {% block extra_head %}{% endblock %}
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">

  {# Global Header #}
  <header class="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center">
    <a href="{% url 'articles:home' %}" class="font-bold text-cyan-400 text-lg">CloudNexus</a>
    <nav class="flex gap-4 text-sm">
      <a href="{% url 'articles:home' %}" class="hover:text-cyan-300">Articles</a>
      {% if user.is_authenticated %}
        <span>{{ user.email }}</span>
        <a href="{% url 'logout' %}" class="text-rose-400">Logout</a>
      {% else %}
        <a href="{% url 'login' %}" class="text-cyan-400">Sign In</a>
      {% endif %}
    </nav>
  </header>

  {# Global Messages / Alerts (Flash Notifications) #}
  {% if messages %}
    <div class="container mx-auto p-4 space-y-2">
      {% for message in messages %}
        <div class="p-3 rounded text-xs font-semibold {% if message.tags == 'error' %}bg-rose-950 border border-rose-800 text-rose-300{% else %}bg-emerald-950 border border-emerald-800 text-emerald-300{% endif %}">
          {{ message }}
        </div>
      {% endfor %}
    </div>
  {% endif %}

  {# Primary Content Block #}
  <main class="flex-1 container mx-auto p-6">
    {% block content %}
      {# Child templates inject custom page content here #}
    {% endblock %}
  </main>

  {# Global Footer #}
  <footer class="border-t border-slate-800 p-6 text-center text-xs text-slate-500">
    &copy; 2026 Enterprise Django Systems. All rights reserved.
  </footer>

  {# Extra Scripts Block for per-page JS #}
  {% block extra_scripts %}{% endblock %}
</body>
</html>
```

---

## 2. Extending the Layout in Child Templates

Child templates declare which base template they inherit from using `{% extends %}` as the very first line:

```django
{# templates/articles/article_detail.html #}
{% extends "base.html" %}

{# Override Page Title #}
{% block title %}{{ article.title }} | CloudNexus{% endblock %}

{# Inject Page Content #}
{% block content %}
  <article class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl">
    <header class="border-b border-slate-800 pb-4 mb-6">
      <h1 class="text-3xl font-extrabold text-white mb-2">{{ article.title }}</h1>
      <div class="text-xs text-slate-400 flex gap-4">
        <span>By {{ article.author.username }}</span>
        <span>Published: {{ article.created_at|date:"M d, Y" }}</span>
        <span>Views: {{ article.view_count }}</span>
      </div>
    </header>

    <div class="prose prose-invert max-w-none text-slate-300 leading-relaxed">
      {{ article.content|linebreaks }}
    </div>
  </article>
{% endblock %}
```

---

## 3. Preserving Parent Content with `{{ block.super }}`

If you want to append content to a block rather than completely overwriting it, use `{{ block.super }}`:

```django
{% block extra_head %}
  {{ block.super }} {# Retains any CSS loaded in parent base.html #}
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs/themes/prism-tomorrow.min.css">
{% endblock %}
```

---

## 4. Reusable Partials with `{% include %}`

For repeated UI fragments (like an article card or pagination bar), use `{% include %}`:

```django
{# Includes reusable component template #}
{% include "articles/components/article_card.html" with item=article %}
```

---

## Practice Quiz

### Q1: What tag must be the very first tag in a child template that inherits from a master layout?
- A) {% load static %}
- B) {% extends "base.html" %}
- C) {% block content %}
- D) {% include "header.html" %}
**Answer:** B
**Explanation:** {% extends %} informs Django's template parser of the inheritance chain and must be the first tag evaluated in a child template.

### Q2: What is the purpose of the {{ block.super }} variable in a template block?
- A) To grant superuser privileges
- B) To render the content defined in the parent template's block, allowing child templates to append or prepend content rather than replacing it
- C) To restart the server
- D) To speed up rendering by 2x
**Answer:** B
**Explanation:** {{ block.super }} allows a child template to retain the parent template's block contents and append extra elements (such as additional CSS or JS tags).

### Q3: What is the architectural difference between {% extends %} and {% include %}?
- A) {% extends %} creates a base skeleton layout that child views fill into; {% include %} embeds a small reusable partial component into the current template
- B) {% extends %} only works with CSS; {% include %} is for JavaScript
- C) They are identical
- D) {% include %} is deprecated in Django 5
**Answer:** A
**Explanation:** {% extends %} defines the overarching layout structure (inheritance), while {% include %} imports a standalone partial template fragment into the current document (composition).

### Q4: How do you configure Django to find templates stored in a global root /templates/ directory?
- A) Copy templates into the Python installation directory
- B) Add BASE_DIR / 'templates' to the DIRS list under TEMPLATES in settings.py
- C) Create a symlink
- D) Set TEMPLATE_ROOT = True
**Answer:** B
**Explanation:** Adding Path(BASE_DIR / 'templates') to TEMPLATES['DIRS'] instructs Django's template engine to look in the project's root templates folder.

### Q5: What does the |linebreaks filter do in Django templates?
- A) It formats text into Python code
- B) It converts newlines in plain text into HTML paragraphs (<p>) and line breaks (<br>)
- C) It removes all blank lines
- D) It deletes punctuation
**Answer:** B
**Explanation:** linebreaks parses plain text strings and converts single newlines into <br> tags and double newlines into <p> tags for proper HTML formatting.
