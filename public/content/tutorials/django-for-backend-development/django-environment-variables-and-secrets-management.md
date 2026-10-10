# Environment Variables & Secrets

Hardcoding sensitive credentials—such as database passwords, Stripe API keys, AWS secret tokens, and Django's `SECRET_KEY`—directly into source code files is one of the most severe security vulnerabilities in software engineering. If source code is pushed to public repositories or shared across teams, exposed credentials allow attackers to compromise production systems. Professional Django architectures use **Twelve-Factor App Environment Configuration**.

---

## 1. The Twelve-Factor Configuration Principle

> *"Store config in the environment."* — The Twelve-Factor App

A codebase should be completely decoupled from environment credentials. The exact same container image or git commit should run in:
- **Local Development:** Reading local SQLite and mock API keys.
- **Staging:** Reading staging PostgreSQL and sandbox payment gateways.
- **Production:** Reading production RDS clusters and live payment credentials.

---

## 2. Managing Environments with `python-dotenv`

In local development, store secrets in a `.env` file at the root of your project:

```bash
# .env (MUST BE ADDED TO .gitignore!)
DJANGO_SECRET_KEY="django-insecure-enterprise-super-secret-key-12345"
DJANGO_DEBUG="True"
DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1"

# Database connection URL
DATABASE_URL="postgres://postgres:secret123@localhost:5432/enterprise_db"

# Third-Party API Keys
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
STRIPE_SECRET_KEY="sk_test_51Mz..."
```

---

## 3. Integrating `.env` in `settings.py`

Use `python-dotenv` or `django-environ`:

```bash
pip install python-dotenv dj-database-url
```

```python
# config/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file if it exists
load_dotenv(BASE_DIR / ".env")

# 1. Secret Key (Crash if missing in production!)
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

# 2. Debug Flag (Defaults to False if unset)
DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ["true", "1", "yes"]

# 3. Allowed Hosts list parsing
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

# 4. Database configuration via dj-database-url
# Parses postgres://user:pass@host:port/dbname into Django DATABASES dict
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600, # Database connection pooling for performance
    )
}
```

---

## 4. Git Hygiene: `.gitignore` and `.env.example`

To ensure teammates know which environment variables are required without exposing secrets, commit a template `.env.example`:

```bash
# .env.example (Safe to commit to Git!)
DJANGO_SECRET_KEY=
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:password@localhost:5432/dbname
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

And guarantee `.env` is ignored in `.gitignore`:

```
# .gitignore
.env
.env.local
*.log
db.sqlite3
```

---

## Practice Quiz

### Q1: What is the primary security danger of committing SECRET_KEY to a Git repository?
- A) Python code will not run
- B) Anyone with read access to the repository can forge cryptographic session cookies, tamper with password reset tokens, and bypass CSRF protections
- C) It deletes the database
- D) Git repository hosting fees increase
**Answer:** B
**Explanation:** Django's SECRET_KEY provides the cryptographic salt for signing session cookies, CSRF tokens, and password reset links. If leaked, attackers can impersonate users and execute arbitrary session hijacks.

### Q2: What is the purpose of committing a .env.example file while ignoring .env in .gitignore?
- A) To back up passwords to GitHub
- B) To provide a safe template documenting all required environment variable keys for new developers without exposing actual production secrets
- C) It is required by Django
- D) It compiles templates
**Answer:** B
**Explanation:** .env.example documents the required configuration keys for onboarding developers and CI pipelines while keeping actual credentials safe and uncommitted.

### Q3: What does the dj-database-url package do?
- A) It creates a database in the cloud
- B) It parses standard database connection strings (e.g. postgres://user:pass@host:5432/db) into Django's structured DATABASES dictionary
- C) It downloads PostgreSQL drivers
- D) It formats SQL queries
**Answer:** B
**Explanation:** dj-database-url parses Twelve-Factor DATABASE_URL connection strings into Django's DATABASES configuration dictionary, standardizing database configuration across hosting providers.

### Q4: What does conn_max_age=600 configure when setting up databases?
- A) It deletes the database after 10 minutes
- B) It enables persistent database connection pooling, keeping database connections open for up to 600 seconds to eliminate per-request connection handshake overhead
- C) It restricts queries to 600 bytes
- D) It limits user passwords to 600 days
**Answer:** B
**Explanation:** conn_max_age maintains persistent database connections across requests, eliminating the CPU and latency overhead of opening new TCP database connections on every page load.

### Q5: In production environments like Docker or Kubernetes, how should environment variables be passed?
- A) Injected directly via container runtime configuration (e.g. Docker environment flags, Kubernetes Secrets, or cloud platform dashboard configs) rather than files
- B) Written on paper and typed in manually
- C) Hardcoded in settings.py
- D) Saved in a public text file on S3
**Answer:** A
**Explanation:** Production container runtimes inject secrets directly into OS process environments via secure secret management stores (AWS Secrets Manager, Kubernetes Secrets), leaving no plain files on disk.
