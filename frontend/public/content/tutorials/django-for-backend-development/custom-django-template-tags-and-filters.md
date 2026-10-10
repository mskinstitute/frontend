# Django Template Filters & Tags

While Django provides dozens of built-in template tags and filters, enterprise applications frequently require bespoke presentation logic—such as markdown rendering, reading-time estimations, dynamic currency conversions, or custom permission checks in HTML. Django's **Custom Template Tags & Filters** system enables you to extend the template engine with pure Python functions.

---

## 1. Directory Structure Requirements

To create custom template tags, create a `templatetags` package inside an installed app:

```
articles/
├── __init__.py
├── models.py
├── views.py
└── templatetags/         # Must be a Python package!
    ├── __init__.py       # Empty init file required
    └── article_extras.py # Custom tag & filter definitions
```

---

## 2. Creating Custom Filters

A filter is a Python function that takes one or two arguments and returns a transformed value:

```python
# articles/templatetags/article_extras.py
from django import template
from django.utils.safestring import mark_safe
import markdown as md_compiler

register = template.Library()

# 1. Custom string formatting filter: {{ value|reading_time }}
@register.filter(name="reading_time")
def reading_time(text: str) -> str:
    if not text:
        return "1 min read"
    word_count = len(text.split())
    minutes = max(1, round(word_count / 200))
    return f"{minutes} min read"

# 2. Markdown compiler filter with safe HTML marking: {{ article.content|markdown }}
@register.filter(name="markdown")
def markdown_to_html(text: str):
    # Compiles markdown into HTML
    html = md_compiler.markdown(text, extensions=["fenced_code", "tables"])
    # mark_safe informs Django that this HTML is sanitized and safe to render unescaped!
    return mark_safe(html)
```

---

## 3. Creating Custom Simple Tags

Simple tags accept arguments and return string or context data:

```python
from django import template
from articles.models import Article

register = template.Library()

# Tag rendering dynamic data: {% recent_articles count=5 %}
@register.simple_tag
def get_recent_articles(count=5):
    return Article.objects.filter(status="published").order_by("-created_at")[:count]
```

---

## 4. Creating Inclusion Tags (Reusable Widgets)

**Inclusion Tags** compile custom logic and render a dedicated partial template, returning HTML directly:

```python
# articles/templatetags/article_extras.py
@register.inclusion_tag("articles/components/trending_widget.html")
def show_trending_widget(limit=3):
    trending = Article.objects.filter(status="published").order_by("-view_count")[:limit]
    return {"trending_articles": trending}
```

The partial template (`trending_widget.html`):

```django
<div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
  <h3 class="font-bold text-cyan-400 text-sm mb-3">🔥 Trending Articles</h3>
  <ul class="space-y-2 text-xs">
    {% for article in trending_articles %}
      <li>
        <a href="{% url 'articles:detail' slug=article.slug %}" class="hover:underline text-slate-200">
          {{ article.title }}
        </a>
      </li>
    {% endfor %}
  </ul>
</div>
```

---

## 5. Loading and Using Custom Tags in Templates

In your HTML template, load the module name using `{% load %}`:

```django
{% extends "base.html" %}
{% load article_extras %} {# Loads article_extras.py #}

{% block content %}
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <h1>{{ article.title }}</h1>
      <span class="text-xs text-slate-400">{{ article.content|reading_time }}</span>
      
      {# Render markdown safely #}
      <div class="article-body">
        {{ article.content|markdown }}
      </div>
    </div>

    <aside>
      {# Inclusion Tag rendering complete widget #}
      {% show_trending_widget limit=5 %}
    </aside>
  </div>
{% endblock %}
```

---

## Practice Quiz

### Q1: What directory name inside an installed Django app must contain custom template tags and filters?
- A) template_helpers/
- B) templatetags/
- C) custom_tags/
- D) filters/
**Answer:** B
**Explanation:** Django's template discovery mechanism looks strictly for a Python package named templatetags inside installed apps containing an __init__.py file.

### Q2: What object must be instantiated at the top of a template tag module to register tags and filters?
- A) django.tags.Registry()
- B) register = template.Library()
- C) app = TemplateApp()
- D) manager = TagManager()
**Answer:** B
**Explanation:** register = template.Library() creates the module-level registry instance through which @register.filter and @register.simple_tag decorators bind functions.

### Q3: What is the purpose of django.utils.safestring.mark_safe() in custom template filters?
- A) It encrypts the HTML string with SSL
- B) It informs Django's template engine that the returned string is safe HTML and should not be automatically escaped into &lt; and &gt; entities
- C) It removes all JavaScript
- D) It validates HTML syntax
**Answer:** B
**Explanation:** Django automatically escapes HTML to prevent XSS. If a filter generates trusted HTML (like compiled markdown), mark_safe instructs Django to render raw HTML without escaping.

### Q4: What makes an @register.inclusion_tag distinct from a standard @register.simple_tag?
- A) Inclusion tags can only run on mobile devices
- B) An inclusion tag processes data and renders it through a dedicated partial template, returning rendered HTML markup directly into the calling template
- C) Inclusion tags run in C++
- D) Simple tags are deprecated
**Answer:** B
**Explanation:** Inclusion tags evaluate Python logic and pass a context dictionary to a specified template fragment, rendering encapsulated component widgets directly.

### Q5: How do you make a custom tag module available inside an HTML template?
- A) <import src="extras">
- B) {% load <module_name> %}
- C) {% import <module_name> %}
- D) {% include_tags <module_name> %}
**Answer:** B
**Explanation:** The {% load module_name %} tag loads the custom template tag library file from the templatetags directory into the current template scope.
