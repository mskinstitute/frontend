# Virtual Environments & First Flask Application

Before building web applications with Flask, establishing an isolated virtual environment is critical. Virtual environments guarantee that your project's dependencies never conflict with system-wide Python packages or other projects on the same machine.

---

## 1. Setting Up an Isolated Virtual Environment

Python 3 provides the built-in `venv` module. Follow these commands in your project terminal:

### On Windows (PowerShell / Command Prompt):
```bash
# Create project workspace directory
mkdir flask_mastery_project
cd flask_mastery_project

# Create a virtual environment named .venv
python -m venv .venv

# Activate the virtual environment
.venv\Scripts\activate
```

### On macOS / Linux:
```bash
# Create and activate
python3 -m venv .venv
source .venv/bin/activate
```

When activated, your terminal prompt will display `(.venv)`.

---

## 2. Installing Flask 3.x

Install the latest version of Flask using `pip`:

```bash
pip install flask
```

To verify the installation and view installed dependencies:

```bash
pip list
```

You will notice that installing `flask` automatically installs its key dependencies:
- `Werkzeug`: WSGI utilities and routing
- `Jinja2`: Template engine
- `MarkupSafe`: HTML string escaping
- `click`: Command Line Interface framework
- `itsdangerous`: Cryptographic signing for session cookies
- `blinker`: Signal dispatching (in modern Flask 3.x)

---

## 3. Creating Your First Minimal Flask Application

Create a file named `app.py` in your project root:

```python
from flask import Flask

# Initialize the Flask WSGI application
app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Hello, World! Welcome to MSK Flask Mastery.</h1>"

@app.route("/about")
def about():
    return {
        "status": "success",
        "message": "MSK Institute Flask Microframework Tutorial",
        "version": "3.0.0"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

---

## 4. Dissecting the Code Line by Line

1. `from flask import Flask`: Imports the central application class.
2. `app = Flask(__name__)`:
   - An instance of the `Flask` class is created.
   - `__name__` is a Python special variable representing the current module's name (`"__main__"` when run directly).
   - Flask uses `__name__` to locate templates, static assets, and resource folders relative to this file.
3. `@app.route("/")`:
   - A Python decorator that registers a URL path mapping. When an incoming HTTP GET request matches `"/"`, Flask invokes the decorated `home()` function.
4. `return "<h1>...</h1>"`:
   - Returns an HTML string. Flask automatically converts string returns into an HTTP `200 OK` response with `Content-Type: text/html; charset=utf-8`.
5. `return {"status": "success", ...}`:
   - In modern Flask, returning a Python dictionary automatically serializes to a JSON response with `Content-Type: application/json`.
6. `app.run(debug=True, port=5000)`:
   - Starts Werkzeug's local development server on `http://127.0.0.1:5000`.

---

## 5. Running the Application

Execute `app.py` directly:

```bash
python app.py
```

Console Output:
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 482-192-301
```

Open `http://127.0.0.1:5000` in your web browser to view your live web application!

---

## Practice Quiz

### Q1: Why is `__name__` passed into `app = Flask(__name__)`?
- A) To tell Flask what operating system it is running on
- B) To allow Flask to locate template files, static assets, and project root boundaries relative to the main module
- C) To set the database table name
- D) To configure the user's password encryption key
**Answer:** B
**Explanation:** Flask requires `__name__` to determine the root path of the application package or module so it can reliably discover templates, static folders, and resources.

### Q2: What happens in modern Flask when a view function returns a Python dictionary?
- A) An unhandled TypeError exception is thrown
- B) Flask automatically serializes it to JSON and sends a `Content-Type: application/json` header
- C) Flask creates a new SQL database table
- D) Flask prompts the user for a download
**Answer:** B
**Explanation:** In Flask 1.1+, returning a dictionary or list from a view function automatically invokes `jsonify()`, returning an HTTP 200 JSON response.

### Q3: Which command activates a Python virtual environment on Windows PowerShell?
- A) `source .venv/bin/activate`
- B) `.venv\Scripts\activate`
- C) `python -m activate`
- D) `pip activate .venv`
**Answer:** B
**Explanation:** On Windows PowerShell or CMD, virtual environments are activated by running `.venv\Scripts\activate` (or `.venv\Scripts\Activate.ps1`).

### Q4: What is the primary purpose of the `debug=True` flag in `app.run()` during development?
- A) It optimizes server caching for 10,000 concurrent users
- B) It enables automatic code reloading on file changes and provides an interactive in-browser debugger for tracebacks
- C) It sends error logs to production Sentry instances
- D) It enables HTTPS SSL certificates automatically
**Answer:** B
**Explanation:** `debug=True` activates live code reloading upon saving source files and provides an interactive browser debugger with a secure PIN.

### Q5: Why is the built-in `app.run()` development server explicitly not recommended for production deployments?
- A) It does not support Python 3
- B) It is single-threaded or weakly threaded, lacks robust worker pooling, and cannot withstand production traffic concurrency or security attacks
- C) It deletes the database upon restarting
- D) It only works on localhost ports
**Answer:** B
**Explanation:** Werkzeug's development server is designed solely for local debugging; production deployments require robust WSGI application servers such as Gunicorn or uWSGI behind Nginx.
