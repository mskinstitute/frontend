# Jinja2 Macros & Reusable UI Components

In modern frontend component architecture (like React components), UI elements are broken down into parameterized, reusable functions. Jinja2 provides the exact same capability for server-rendered Python web applications through **Macros**.

---

## 1. What is a Jinja2 Macro?

A **macro** is analogous to a Python function: it takes arguments (with optional default values) and returns a rendered block of HTML.

### Defining a Basic Macro:
```html
<!-- templates/macros/ui.html -->
{% macro render_badge(text, variant='primary') %}
    {% if variant == 'success' %}
        <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            {{ text }}
        </span>
    {% elif variant == 'danger' %}
        <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
            {{ text }}
        </span>
    {% else %}
        <span class="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800">
            {{ text }}
        </span>
    {% endif %}
{% endmacro %}
```

---

## 2. Importing and Using Macros in Templates

Import macros into your pages just like importing Python functions:

```html
<!-- templates/profile.html -->
{% extends "base.html" %}
{% import "macros/ui.html" as ui %}

{% block content %}
<div class="user-card">
    <h2>{{ user.name }}</h2>
    <div class="status-tags">
        {{ ui.render_badge("Active Student", variant="success") }}
        {{ ui.render_badge("Python Certified", variant="primary") }}
    </div>
</div>
{% endblock %}
```

You can also import specific macros directly into the local namespace:
```html
{% from "macros/ui.html" import render_badge %}
{{ render_badge("Pro Member") }}
```

---

## 3. Building an Enterprise Form Field Macro

One of the most valuable uses of macros is standardizing form input rendering, including error states and labels:

```html
<!-- templates/macros/forms.html -->
{% macro render_input(name, label, type='text', value='', placeholder='', error=None, required=False) %}
<div class="form-group mb-4">
    <label for="{{ name }}" class="block text-sm font-semibold text-gray-700 mb-1">
        {{ label }} {% if required %}<span class="text-red-500">*</span>{% endif %}
    </label>
    
    <input 
        type="{{ type }}" 
        id="{{ name }}" 
        name="{{ name }}" 
        value="{{ value }}"
        placeholder="{{ placeholder }}"
        class="w-full px-4 py-2 rounded-lg border {% if error %}border-red-500 bg-red-50 text-red-900{% else %}border-gray-300 focus:border-indigo-500{% endif %} focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
        {% if required %}required{% endif %}
    >
    
    {% if error %}
    <p class="mt-1 text-xs text-red-600 font-medium">{{ error }}</p>
    {% endif %}
</div>
{% endmacro %}
```

### Usage in Checkout Template:
```html
{% from "macros/forms.html" import render_input %}

<form method="POST" action="/checkout">
    {{ render_input('full_name', 'Full Legal Name', placeholder='Sumit Verma', required=True) }}
    {{ render_input('email', 'Email Address', type='email', placeholder='sumit@example.com', required=True) }}
    {{ render_input('phone', 'Phone Number', type='tel', placeholder='+91 9876543210') }}
    
    <button type="submit" class="btn btn-primary">Proceed to Payment</button>
</form>
```

---

## 4. Variadic Arguments with `varargs` and `kwargs`

Just like Python functions with `*args` and `**kwargs`, Jinja2 macros support arbitrary positional and keyword parameters via the special `varargs` and `kwargs` variables:

```html
{% macro render_button(label) %}
    <button class="btn" {% for key, val in kwargs.items() %}{{ key }}="{{ val }}" {% endfor %}>
        {{ label }}
    </button>
{% endmacro %}

<!-- Call with dynamic HTML data-attributes -->
{{ render_button('Delete Item', id='btn-del', data_modal='confirm-modal') }}
```

---

## Practice Quiz

### Q1: What Jinja2 statement defines a reusable parameterized UI block?
- A) `{% component ... %}`
- B) `{% macro ... %}`
- C) `{% function ... %}`
- D) `{% def ... %}`
**Answer:** B
**Explanation:** `{% macro name(args) %} ... {% endmacro %}` defines a reusable template macro.

### Q2: How do you import a macro file `macros/forms.html` giving it an alias `forms`?
- A) `{% using "macros/forms.html" as forms %}`
- B) `{% import "macros/forms.html" as forms %}`
- C) `{% include "macros/forms.html" with alias forms %}`
- D) `{% require "macros/forms.html" -> forms %}`
**Answer:** B
**Explanation:** The syntax `{% import 'path/to/file.html' as alias %}` imports macros into a designated namespace.

### Q3: How do macros help improve web application security and accessibility?
- A) By compiling HTML to C binary
- B) By standardizing form input attributes, labels, ARIA tags, and validation error displays in one central tested location
- C) By encrypting the browser DOM
- D) By disabling JavaScript
**Answer:** B
**Explanation:** Macros centralize UI patterns, guaranteeing that accessibility labels, error styling, and input constraints are consistently applied across all forms.

### Q4: What special variable inside a macro holds arbitrary keyword arguments passed during invocation?
- A) `extra_args`
- B) `kwargs`
- C) `params`
- D) `props`
**Answer:** B
**Explanation:** In Jinja2 macros, `kwargs` contains a dictionary of extra keyword arguments not explicitly declared in the macro signature.

### Q5: Can default values be specified for macro arguments (e.g. `type='text'`)?
- A) No, Jinja2 requires all arguments to be provided explicitly
- B) Yes, default values are assigned identically to Python function signatures
- C) Only for integers
- D) Only in Flask debug mode
**Answer:** B
**Explanation:** Macro parameters accept default values in their definition signature (e.g., `{% macro render_btn(text, style='primary') %}`).
