# Installing Django & Environment Setup

Django is a high-level Python web framework designed for rapid, secure, and maintainable software engineering. Following the "batteries-included" philosophy, Django ships out of the box with an Object-Relational Mapper (ORM), database migration engine, administrative dashboard, user authentication, and CSRF/XSS security protections.

---

## 1. Setting Up an Isolated Virtual Environment

Never install Python web frameworks into your global operating system environment. Dependency version conflicts between packages can break OS-level tools or other projects.

```bash
# 1. Create a dedicated virtual environment
python -m venv venv

# 2. Activate virtual environment
# On macOS / Linux:
source venv/bin/activate

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (CMD):
.\venv\Scripts\activate.bat
```

Verify that the active python binary points inside your virtual environment:

```bash
which python # or 'Get-Command python' on Windows
```

---

## 2. Installing Django and Freezing Dependencies

```bash
# Upgrade pip package installer
python -m pip install --upgrade pip

# Install latest production Django release
pip install django

# Verify Django installation and version
python -m django --version

# Freeze active dependencies into requirements.txt
pip freeze > requirements.txt
```

A clean `requirements.txt` enables deterministic dependency reproduction across teammates and staging/production Docker containers.

---

## 3. Creating the Project and Running the Local Dev Server

In Django terminology, a **Project** is a collection of configurations and applications for a given website.

```bash
# Initialize a new Django project named 'config' inside the current directory
django-admin startproject config .

# Apply initial core migrations (auth, contenttypes, sessions)
python manage.py migrate

# Launch the local HTTP development server
python manage.py runserver 8000
```

Navigate to `http://127.0.0.1:8000/` in your browser. You will see Django's default rocket launch greeting page confirming a successful setup!

---

## 4. Understanding the `manage.py` Script

The `manage.py` file is a thin executable wrapper around `django-admin` that sets the `DJANGO_SETTINGS_MODULE` environment variable to point to your project's `settings.py`.

Common `manage.py` commands:
- `python manage.py runserver`: Launches the development web server.
- `python manage.py makemigrations`: Generates new database migration files based on model changes.
- `python manage.py migrate`: Executes pending SQL migrations against the database.
- `python manage.py createsuperuser`: Creates an administrative user for `/admin/`.
- `python manage.py startapp <app_name>`: Scaffolds a new application module.
- `python manage.py shell`: Opens an interactive Python REPL with Django loaded.

---

## Practice Quiz

### Q1: Why is it critical to install Django inside a Python virtual environment?
- A) Django refuses to run on global Python
- B) Virtual environments isolate project dependencies, preventing version conflicts between different Python projects and OS system packages
- C) Virtual environments compile Python into C++
- D) To allow multiple users to log into the computer
**Answer:** B
**Explanation:** Python virtual environments isolate site-packages per project, ensuring version upgrades in one project do not disrupt or break other projects on the same host machine.

### Q2: What is the primary difference between django-admin and manage.py?
- A) manage.py is written in JavaScript
- B) manage.py automatically sets the DJANGO_SETTINGS_MODULE environment variable to point to your project's settings file
- C) django-admin can only be used on Linux
- D) manage.py is deprecated in Django 5
**Answer:** B
**Explanation:** manage.py is created automatically inside each project and configures the environment to know which settings.py file to load before delegating to django-admin.

### Q3: What command runs initial database migrations to configure auth and session tables?
- A) python manage.py build
- B) python manage.py migrate
- C) python manage.py syncdb
- D) python manage.py init
**Answer:** B
**Explanation:** python manage.py migrate evaluates all pending migration files across installed apps and executes the corresponding SQL DDL statements against your database.

### Q4: What does the command pip freeze > requirements.txt accomplish?
- A) It deletes unneeded packages
- B) It records the exact package names and installed version numbers of all dependencies in the active virtual environment for reproducible environments
- C) It freezes the operating system
- D) It locks all database records
**Answer:** B
**Explanation:** pip freeze outputs all packages and pinned version strings in standard requirements format, ensuring consistent deployments across dev, CI, and production.

### Q5: Why is python manage.py runserver intended strictly for local development?
- A) It only runs for 10 minutes
- B) It is a single-threaded lightweight development server lacking security hardening, multi-worker process management, and connection pooling needed for production
- C) It cannot serve HTML
- D) It requires root administrative privileges
**Answer:** B
**Explanation:** runserver is unhardened and unoptimized for production concurrency; production environments use WSGI/ASGI servers like Gunicorn, Uvicorn, and Nginx.
