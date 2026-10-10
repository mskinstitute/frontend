# Form Classes & Built-In Field Validators

Manually writing `<input>` tags, extracting values from `request.form`, typecasting strings, and writing dozens of `if not email:` checks is tedious and error-prone. **WTForms** allows you to declare forms as Python classes, providing automatic validation, casting, and error aggregation.

---

## 1. Declaring a Form Class

Create a `forms.py` file and subclass `flask_wtf.FlaskForm`:

```python
from flask_wtf import FlaskForm
from wtforms import (
    StringField, 
    PasswordField, 
    BooleanField, 
    SubmitField, 
    SelectField, 
    TextAreaField
)
from wtforms.validators import (
    DataRequired, 
    Length, 
    Email, 
    EqualTo, 
    Regexp
)

class RegistrationForm(FlaskForm):
    username = StringField(
        label="Username",
        validators=[
            DataRequired(message="Username is required."),
            Length(min=3, max=25, message="Username must be between 3 and 25 characters."),
            Regexp(r'^[a-zA-Z0-9_]+$', message="Username must contain only letters, numbers, and underscores.")
        ]
    )
    
    email = StringField(
        label="Email Address",
        validators=[
            DataRequired(message="Email is required."),
            Email(message="Please provide a valid email address.")
        ]
    )
    
    password = PasswordField(
        label="Password",
        validators=[
            DataRequired(),
            Length(min=8, message="Password must be at least 8 characters long.")
        ]
    )
    
    confirm_password = PasswordField(
        label="Confirm Password",
        validators=[
            DataRequired(),
            EqualTo("password", message="Passwords must match.")
        ]
    )
    
    track = SelectField(
        label="Specialization Track",
        choices=[
            ("fullstack", "Full-Stack Web Development"),
            ("data_ai", "Data Science & AI"),
            ("cloud", "Cloud & DevOps")
        ],
        validators=[DataRequired()]
    )
    
    terms = BooleanField(
        label="I agree to the Terms of Service",
        validators=[DataRequired(message="You must accept the terms.")]
    )
    
    submit = SubmitField(label="Create Account")
```

---

## 2. Handling Forms in the View Function

In your route, instantiate the form and call `form.validate_on_submit()`:

```python
from flask import Flask, render_template, redirect, url_for, flash
from forms import RegistrationForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "super-secret-key-change-in-production"

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    
    # validate_on_submit() checks:
    # 1. Is this an HTTP POST request?
    # 2. Is the CSRF token valid?
    # 3. Do all field validators pass?
    if form.validate_on_submit():
        user_name = form.username.data
        user_email = form.email.data
        
        # In a real app: save user to database with hashed password
        flash(f"Account successfully created for {user_name}!", "success")
        return redirect(url_for("login"))
        
    # On GET request or failed validation, re-render form with errors
    return render_template("register.html", form=form)
```

---

## 3. Rendering the Form in Jinja2

WTForms fields are callable objects. Invoking `{{ form.field_name() }}` generates the complete `<input>` HTML element:

```html
<!-- templates/register.html -->
{% extends "base.html" %}

{% block content %}
<div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">Create Your Account</h2>
    
    <form method="POST" action="">
        <!-- Automatically renders hidden CSRF input token -->
        {{ form.hidden_tag() }}
        
        <!-- Username Field -->
        <div class="mb-4">
            {{ form.username.label(class="block text-sm font-medium text-gray-700 mb-1") }}
            {{ form.username(class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500", placeholder="johndoe") }}
            {% for error in form.username.errors %}
                <p class="text-red-500 text-xs mt-1">{{ error }}</p>
            {% endfor %}
        </div>
        
        <!-- Email Field -->
        <div class="mb-4">
            {{ form.email.label(class="block text-sm font-medium text-gray-700 mb-1") }}
            {{ form.email(class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500", placeholder="you@example.com") }}
            {% for error in form.email.errors %}
                <p class="text-red-500 text-xs mt-1">{{ error }}</p>
            {% endfor %}
        </div>

        <!-- Password Field -->
        <div class="mb-4">
            {{ form.password.label(class="block text-sm font-medium text-gray-700 mb-1") }}
            {{ form.password(class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500") }}
            {% for error in form.password.errors %}
                <p class="text-red-500 text-xs mt-1">{{ error }}</p>
            {% endfor %}
        </div>
        
        <!-- Submit Button -->
        <div class="mt-6">
            {{ form.submit(class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer transition") }}
        </div>
    </form>
</div>
{% endblock %}
```

---

## Practice Quiz

### Q1: What three checks does `form.validate_on_submit()` execute automatically?
- A) Checks database connectivity, disk space, and memory
- B) Checks if request is POST, verifies the CSRF token, and executes all declared field validators
- C) Sends confirmation email, creates user, and logs in
- D) Compiles TypeScript files
**Answer:** B
**Explanation:** `validate_on_submit()` is a shortcut that confirms the request is a POST submission, validates the CSRF signature, and runs every validator declared on the form fields.

### Q2: How is the hidden CSRF input field rendered in templates when using FlaskForm?
- A) `{{ form.csrf() }}`
- B) `{{ form.hidden_tag() }}`
- C) `{{ form.render_security() }}`
- D) `{{ form.inputs.hidden }}`
**Answer:** B
**Explanation:** `{{ form.hidden_tag() }}` renders all hidden fields belonging to the form, including the mandatory CSRF token input.

### Q3: Which validator guarantees that two password fields match during registration?
- A) `SameAs('password')`
- B) `EqualTo('password')`
- C) `Identical('password')`
- D) `Match('password')`
**Answer:** B
**Explanation:** The `EqualTo('other_field_name')` validator verifies that the current field's input matches the value of the specified field.

### Q4: How do you extract the sanitized, type-converted value of a field inside a view function?
- A) `request.form['username']`
- B) `form.username.data`
- C) `form.username.value()`
- D) `form.username.text`
**Answer:** B
**Explanation:** WTForms stores the cleaned, validated, and typecasted value of each field on its `.data` attribute (e.g. `form.username.data`).

### Q5: How are validation errors accessed for an individual field in a Jinja2 template?
- A) `form.errors['username']`
- B) `form.username.errors` (a list of error message strings)
- C) `form.username.has_error()`
- D) `form.username.failed`
**Answer:** B
**Explanation:** Each form field object exposes an `.errors` property containing a list of strings representing any validation rules that failed.
