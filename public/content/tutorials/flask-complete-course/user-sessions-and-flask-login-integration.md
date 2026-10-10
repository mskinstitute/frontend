# User Session Management with Flask-Login

Once a user verifies their credentials, an application must persist their authenticated state across subsequent requests without asking them to re-enter their password on every page click.

**Flask-Login** is the standard extension for managing user session lifecycles in Flask. It handles logging users in, logging them out, tracking active sessions via cookies, and protecting views with the `@login_required` decorator.

---

## 1. Installing and Configuring Flask-Login

Install the extension:

```bash
pip install flask-login
```

In `app.py`:

```python
from flask import Flask
from flask_login import LoginManager

app = Flask(__name__)
app.config["SECRET_KEY"] = "super-secret-session-key"

login_manager = LoginManager()
login_manager.init_app(app)

# Specify the route endpoint where unauthenticated users should be redirected
login_manager.login_view = "login"
login_manager.login_message = "Please log in to access this page."
login_manager.login_message_category = "warning"
```

---

## 2. Implementing the `UserMixin` on Your User Model

Flask-Login requires your User model to implement four attributes/methods:
- `is_authenticated`: Returns `True` if user is logged in.
- `is_active`: Returns `True` if user account is active and unbanned.
- `is_anonymous`: Returns `False` for real users.
- `get_id()`: Returns a unique string identifying the user.

Instead of writing these manually, subclass `flask_login.UserMixin`:

```python
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default="student")
```

---

## 3. The `user_loader` Callback

Flask-Login stores only the user's ID inside the encrypted session cookie. On each incoming request, Flask-Login invokes a callback function you register with `@login_manager.user_loader` to fetch the full `User` object from the database:

```python
@login_manager.user_loader
def load_user(user_id):
    # user_id is passed as a string by Flask-Login
    return User.query.get(int(user_id))
```

If the ID is invalid or user no longer exists, the callback must return `None`.

---

## 4. Authenticating Users (`login_user`, `logout_user`, `current_user`)

```python
from flask import render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from models import User

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
        
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        remember = request.form.get("remember") == "on"
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            # Log the user into session
            # remember=True issues a persistent 'remember me' cookie
            login_user(user, remember=remember)
            flash("Welcome back!", "success")
            
            # Handle post-login redirection (e.g. ?next=/profile)
            next_page = request.args.get("next")
            return redirect(next_page or url_for("dashboard"))
        else:
            flash("Invalid username or password.", "danger")
            
    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been signed out.", "info")
    return redirect(url_for("home"))
```

---

## 5. Protecting Routes with `@login_required`

To restrict access to authenticated members only, decorate the view function with `@login_required`:

```python
@app.route("/dashboard")
@login_required
def dashboard():
    # current_user is available everywhere!
    return render_template("dashboard.html", user=current_user)
```

In templates, `current_user` is globally accessible without explicitly passing it from Python:

```html
{% if current_user.is_authenticated %}
    <p>Logged in as: {{ current_user.username }}</p>
    <a href="{{ url_for('logout') }}">Sign Out</a>
{% else %}
    <a href="{{ url_for('login') }}">Sign In</a>
{% endif %}
```

---

## Practice Quiz

### Q1: What base class can be mixed into a User model to provide Flask-Login's required authentication properties automatically?
- A) `LoginBase`
- B) `UserMixin`
- C) `AuthModel`
- D) `SessionUser`
**Answer:** B
**Explanation:** Subclassing `UserMixin` automatically provides `is_authenticated`, `is_active`, `is_anonymous`, and `get_id()` implementations.

### Q2: What is the purpose of the `@login_manager.user_loader` callback function?
- A) It hashes new passwords
- B) It loads the complete User instance from the database using the user ID stored in the session cookie
- C) It connects the database engine
- D) It generates JWT tokens
**Answer:** B
**Explanation:** The `user_loader` function reloads the user model instance from storage on every incoming request based on the ID saved in the session.

### Q3: What decorator prevents unauthenticated users from accessing a route in Flask-Login?
- A) `@auth_required`
- B) `@login_required`
- C) `@protected`
- D) `@secure_route`
**Answer:** B
**Explanation:** `@login_required` checks if `current_user.is_authenticated` is True; if not, it redirects the user to `login_manager.login_view`.

### Q4: How is the currently authenticated user accessed inside Jinja2 templates?
- A) `{{ request.user }}`
- B) `{{ current_user }}`
- C) `{{ session.logged_in_user }}`
- D) `{{ auth.user }}`
**Answer:** B
**Explanation:** Flask-Login injects `current_user` as a global proxy variable into all Jinja2 template contexts.

### Q5: What does setting `remember=True` in `login_user(user, remember=True)` do?
- A) It prevents the user from ever logging out
- B) It generates a persistent remember-me cookie that keeps the user logged in even after closing their web browser
- C) It stores the password in plaintext
- D) It creates an admin backup
**Answer:** B
**Explanation:** Passing `remember=True` issues a secure, long-lived "remember me" cookie, preserving the session across browser restarts.
