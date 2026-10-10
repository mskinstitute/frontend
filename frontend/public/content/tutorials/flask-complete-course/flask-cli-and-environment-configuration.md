# Flask CLI & Environment Configuration

While running `python app.py` works for simple one-file experiments, professional Flask development relies on the **Flask Command Line Interface (CLI)** and robust environment configuration.

---

## 1. The `flask` CLI Command

Flask includes a built-in CLI powered by the `click` library. The primary command is `flask run`.

```bash
flask run
```

When you execute `flask run`, Flask searches for an application entry point in the current working directory following this resolution order:
1. The file or module specified by the `FLASK_APP` environment variable.
2. `wsgi.py`
3. `app.py`

---

## 2. Configuring Environment Variables

In modern web development, configuration must be separated from source code (as mandated by **The Twelve-Factor App** methodology). We configure Flask using environment variables:

| Variable | Values | Purpose |
| :--- | :--- | :--- |
| `FLASK_APP` | `app.py`, `src.app`, `myapp:create_app()` | Points to the entry point module or factory function |
| `FLASK_DEBUG` | `1` (true), `0` (false) | Enables/disables live code reloader and interactive debugger |
| `SECRET_KEY` | Hex string / random secret | Cryptographic key used to sign session cookies and CSRF tokens |
| `DATABASE_URL`| Connection string | Database URI for SQLite, PostgreSQL, or MySQL |

---

## 3. Automated Configuration with `python-dotenv`

Manually setting environment variables in every new terminal session is error-prone. Flask natively integrates with `python-dotenv`:

```bash
pip install python-dotenv
```

When `python-dotenv` is installed, the `flask` CLI automatically detects and loads environment variables from two files in your project root:
1. `.env`: Sensitive variables (passwords, API keys, secrets) — **never committed to Git**.
2. `.flaskenv`: Public, project-wide development settings — **committed to Git**.

### Example `.flaskenv`:
```ini
FLASK_APP=app.py
FLASK_DEBUG=1
FLASK_RUN_PORT=5000
FLASK_RUN_HOST=127.0.0.1
```

### Example `.env`:
```ini
SECRET_KEY=9f82d8c47b5e4310a0e365cb551239c8
DATABASE_URL=sqlite:///instance/app.db
API_KEY=live_sec_prod_992182
```

---

## 4. Structured Configuration Classes in Flask

Instead of scattering `os.environ.get()` calls throughout your code, create a centralized `config.py` file using Python classes:

```python
import os
from datetime import timedelta

class Config:
    # Base configuration shared across all environments
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-dev-secret-key-change-in-prod')
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///dev.db')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

# Configuration dictionary mapping
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

Loading the configuration into your Flask app:

```python
from flask import Flask
from config import config

app = Flask(__name__)
# Load configuration based on environment variable
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[env])
```

---

## Practice Quiz

### Q1: What library enables Flask to automatically load `.env` and `.flaskenv` files when executing `flask run`?
- A) `requests`
- B) `python-dotenv`
- C) `pydantic`
- D) `virtualenv`
**Answer:** B
**Explanation:** Installing `python-dotenv` allows Flask CLI commands to automatically import variables from `.flaskenv` and `.env` files into the process environment.

### Q2: What is the difference between `.flaskenv` and `.env`?
- A) `.flaskenv` is for production only, `.env` is for development only
- B) `.flaskenv` stores public development variables safe for Git commit; `.env` contains sensitive secrets and must be gitignored
- C) `.flaskenv` contains HTML templates; `.env` contains Python functions
- D) There is no difference; they are aliases for the same file
**Answer:** B
**Explanation:** `.flaskenv` contains non-sensitive environment flags (like `FLASK_APP=app.py`), while `.env` holds sensitive secrets (API keys, passwords) and must be placed in `.gitignore`.

### Q3: What setting enables live reloading and the browser traceback debugger in Flask 3.x?
- A) `FLASK_DEBUG=1`
- B) `FLASK_AUTO_REFRESH=true`
- C) `LIVE_SERVER=on`
- D) `DEBUG_BROWSER=enable`
**Answer:** A
**Explanation:** Setting `FLASK_DEBUG=1` in the environment activates debug mode, which enables automatic server restarts upon file edits and launches the interactive debugger.

### Q4: How does Flask load configuration settings from a Python class?
- A) `app.settings.import_class(Config)`
- B) `app.config.from_object(Config)`
- C) `app.load_environment(Config)`
- D) `app.inject(Config)`
**Answer:** B
**Explanation:** The `app.config.from_object(Config)` method parses any uppercase attributes defined on the given class and populates `app.config`.

### Q5: If `FLASK_APP` is not set, which file names will Flask automatically inspect by default?
- A) `server.py` or `main.py`
- B) `wsgi.py` or `app.py`
- C) `index.py` or `run.py`
- D) `application.py` or `boot.py`
**Answer:** B
**Explanation:** By convention, the Flask CLI inspects `wsgi.py` first, then `app.py` in the current working directory if `FLASK_APP` is unspecified.
