# Template Engine Basics

Django's built-in **Django Template Language (DTL)** is designed to balance power with ease of use. It bridges backend Python view logic and frontend HTML presentation. DTL enforces a strict separation of concerns: templates control presentation, while business logic remains in Python views and models.

---

## 1. DTL Syntax Building Blocks

Django templates use four primary syntactic constructs:

1. **Variables (`{{ variable }}`):** Evaluates a variable from the context and outputs its string value.
2. **Tags (`{% tag %}`):** Executes template logic, such as loops, conditional blocks, template inheritance, and URL resolution.
3. **Filters (`{{ value|filter }}`):** Modifies variables prior to display (e.g. `{{ title|title }}`, `{{ created_at|date:"M d, Y" }}`).
4. **Comments (`{# comment #}`):** Comments omitted from the final HTML output.

---

## 2. Template Variables & Dot Notation

DTL uses dot notation (`.`) to traverse objects, dictionaries, and methods:

```django
{# Context passed from view: {"article": article_obj, "stats": {"likes": 42}} #}

<h1>{{ article.title }}</h1>
<p>Author: {{ article.author.get_full_name }}</p>
<span>Likes: {{ stats.likes }}</span>
```

### Lookup Priority Order:
When evaluating `foo.bar`, Django tries in order:
1. Dictionary lookup (`foo['bar']`)
2. Attribute lookup (`foo.bar`)
3. Method call (`foo.bar()`) - Note: methods that require arguments cannot be called in DTL!
4. List-index lookup (`foo[bar]`)

---

## 3. Core Template Tags

### Conditional Blocks (`if`, `elif`, `else`)
```django
{% if article.status == "published" %}
  <span class="badge badge-success">Live</span>
{% elif article.status == "draft" %}
  <span class="badge badge-warning">Draft Mode</span>
{% else %}
  <span class="badge badge-secondary">Archived</span>
{% endif %}
```

### Looping with `for` and `empty`
```django
<div class="article-grid">
  {% for article in articles %}
    <article class="card">
      <h2>{{ article.title }}</h2>
      <p>{{ article.content|truncatewords:25 }}</p>
      <small>Loop Index: {{ forloop.counter }} of {{ forloop.length }}</small>
    </article>
  {% empty %}
    <p class="empty-state">No articles have been published yet.</p>
  {% endfor %}
</div>
```

The `{% empty %}` block executes automatically if the list is empty or undefined, eliminating boilerplate `{% if articles %}` wrapping!

---

## 4. Useful Built-in Filters

- `|lower` / `|upper` / `|title`: String case formatting.
- `|truncatewords:30`: Truncates text after 30 words with `...`.
- `|date:"F j, Y, g:i a"`: Formats dates (e.g. "September 15, 2026, 4:45 am").
- `|default:"N/A"`: Fallback if variable is false, empty, or None.
- `|length`: Returns the count of items in an array or string.

---

## 5. Reverse URL Resolution with `{% url %}`

Never hardcode relative URLs (`/articles/5/`) in HTML templates. Use the `{% url %}` tag to dynamically generate URLs from view names:

```django
{# Resolves URL defined as path("<slug:slug>/", views.detail, name="detail") in articles app #}
<a href="{% url 'articles:detail' slug=article.slug %}">
  Read Full Story
</a>
```

If you ever change your URL routing structure in `urls.py`, all template links update automatically without broken links!

---

## Practice Quiz

### Q1: What syntax does the Django Template Language use to output a variable value?
- A) <%= variable %>
- B) {{ variable }}
- C) {% variable %}
- D) ${variable}
**Answer:** B
**Explanation:** Double curly braces {{ variable }} evaluate and print variable values in Django templates.

### Q2: What does the {% empty %} clause inside a {% for %} loop accomplish?
- A) It deletes the array from memory
- B) It renders fallback markup if the list being iterated is empty or does not exist
- C) It throws a 404 error
- D) It clears all HTML inputs
**Answer:** B
**Explanation:** The {% empty %} block executes if the iterable is empty or evaluates to false, providing clean fallback UI without wrapping the loop in an extra {% if %}.

### Q3: Why can't you call Python methods that require arguments inside standard DTL templates (e.g. {{ article.calculate_cost(5) }})?
- A) Python does not support arguments
- B) DTL deliberately disallows method arguments to enforce separation of concerns, keeping complex business calculations in views/models rather than presentation templates
- C) DTL runs in C++
- D) Because of HTML5 restrictions
**Answer:** B
**Explanation:** Django's template philosophy prevents business logic from leaking into templates; complex operations requiring arguments should be computed in Python views or custom template tags.

### Q4: What filter formats long text down to 20 words followed by an ellipsis?
- A) {{ text|slice:20 }}
- B) {{ text|truncatewords:20 }}
- C) {{ text|shorten:20 }}
- D) {{ text|cut:20 }}
**Answer:** B
**Explanation:** The truncatewords filter truncates a string after a specified number of words, appending an ellipsis (...).

### Q5: Why is using {% url 'articles:detail' slug=article.slug %} superior to writing href="/articles/{{ article.slug }}/"?
- A) It runs on a separate thread
- B) It dynamically resolves URLs using the project's URLconf, ensuring links never break if URL routing patterns change in urls.py
- C) It converts links to HTTPS
- D) It compresses HTML size
**Answer:** B
**Explanation:** The {% url %} tag decouples templates from URL paths; modifying path routes in urls.py immediately reflects across all templates without manual search-and-replace.
