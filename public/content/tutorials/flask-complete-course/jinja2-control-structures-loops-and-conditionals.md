# Control Structures, Loops & Conditionals in Jinja2

Dynamic web pages require conditional branching and iterative rendering. Jinja2 provides robust control structures enclosed within `{% ... %}` blocks, including `if/elif/else` conditions and feature-rich `for` loops.

---

## 1. Conditionals (`if`, `elif`, `else`)

Jinja2 conditionals mirror Python's logical evaluation rules, checking for truthy and falsy values:

```html
{% if user.is_authenticated %}
    <div class="user-menu">
        <span>Signed in as <strong>{{ user.username }}</strong></span>
        {% if user.role == 'admin' %}
            <a href="/admin" class="btn btn-warning">Admin Panel</a>
        {% elif user.role == 'instructor' %}
            <a href="/portal" class="btn btn-info">Teacher Portal</a>
        {% else %}
            <a href="/student" class="btn btn-primary">My Courses</a>
        {% endif %}
        <a href="/logout">Logout</a>
    </div>
{% else %}
    <div class="auth-buttons">
        <a href="/login">Log In</a>
        <a href="/register">Create Account</a>
    </div>
{% endif %}
```

You can combine conditions with boolean operators `and`, `or`, `not`, and identity checks `is defined`, `is none`:

```html
{% if discount > 0 and not is_expired %}
    <span class="badge">Special Offer Active!</span>
{% endif %}
```

---

## 2. Iteration with `for` Loops

Iterate over lists, tuples, dictionaries, and database querysets:

```html
<ul class="courses-list">
{% for course in courses %}
    <li class="course-card">
        <h3>{{ course.title }}</h3>
        <p>Instructor: {{ course.instructor }}</p>
        <span class="price">₹{{ course.price }}</span>
    </li>
{% endfor %}
</ul>
```

### Empty List Handling with `{% else %}`
Jinja2 provides a built-in `else` block inside `for` loops that renders when the collection is empty:

```html
<ul class="notifications">
{% for alert in user.notifications %}
    <li>{{ alert.message }} ({{ alert.date }})</li>
{% else %}
    <li class="empty-state">No new notifications. You are all caught up!</li>
{% endfor %}
</ul>
```

---

## 3. The Special `loop` Variable

Inside every `{% for %}` loop, Jinja2 provides an automatic `loop` context variable containing execution metadata:

| Variable | Type | Description |
| :--- | :--- | :--- |
| `loop.index` | `int` | 1-based iteration counter (1, 2, 3...) |
| `loop.index0` | `int` | 0-based iteration counter (0, 1, 2...) |
| `loop.revindex`| `int` | Iterations remaining until the end (1-based) |
| `loop.first` | `bool`| `True` during the first iteration |
| `loop.last` | `bool`| `True` during the final iteration |
| `loop.length` | `int` | Total number of items in the iterable sequence |
| `loop.cycle` | method| Alternate between arguments: `loop.cycle('odd', 'even')` |

### Practical Example: Zebra-Striped Tables & Badges

```html
<table class="table">
    <thead>
        <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Enrolled Date</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    {% for student in students %}
        <tr class="{{ loop.cycle('bg-white', 'bg-slate-50') }}">
            <td>{{ loop.index }}</td>
            <td>
                {{ student.name }}
                {% if loop.first %}
                    <span class="badge bg-gold">Top Student</span>
                {% endif %}
            </td>
            <td>{{ student.enrolled_at }}</td>
            <td><a href="/students/{{ student.id }}">View</a></td>
        </tr>
    {% endfor %}
    </tbody>
</table>
```

---

## Practice Quiz

### Q1: What statement handles an empty list inside a Jinja2 `{% for %}` loop without requiring a separate `if` check?
- A) `{% empty %}`
- B) `{% else %}`
- C) `{% default %}`
- D) `{% fallback %}`
**Answer:** B
**Explanation:** Jinja2 supports an `{% else %}` clause directly inside a `{% for %}` loop, which executes if the iterable has no elements.

### Q2: What is the value of `loop.index` during the very first iteration of a Jinja2 loop?
- A) `0`
- B) `1`
- C) `None`
- D) `first`
**Answer:** B
**Explanation:** `loop.index` is 1-based (starts at 1). For 0-based indexing, use `loop.index0`.

### Q3: How do you alternate row CSS classes between 'odd' and 'even' in a Jinja2 loop?
- A) `{{ loop.cycle('odd', 'even') }}`
- B) `{{ loop.switch('odd', 'even') }}`
- C) `{{ loop.alternator('odd', 'even') }}`
- D) `{{ loop.toggle() }}`
**Answer:** A
**Explanation:** `loop.cycle('odd', 'even')` cycles through the provided arguments on each iteration of the loop.

### Q4: Which boolean expression checks if a variable `user_bio` is explicitly defined in the template context?
- A) `{% if user_bio.exists %}`
- B) `{% if user_bio is defined %}`
- C) `{% if is_set(user_bio) %}`
- D) `{% if user_bio != nil %}`
**Answer:** B
**Explanation:** In Jinja2, the `is defined` test checks whether a variable was passed into the template context.

### Q5: How must an `{% if %}` conditional block be terminated in Jinja2?
- A) `{% fi %}`
- B) `{% end %}`
- C) `{% endif %}`
- D) `{% closeif %}`
**Answer:** C
**Explanation:** Control blocks in Jinja2 require explicit termination tags matching their opener, such as `{% endif %}` and `{% endfor %}`.
