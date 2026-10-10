# Security Best Practices

Deploying a Django backend to production requires hardening against common web application vulnerabilities (OWASP Top 10). Django provides automated diagnostic tools, environment isolation, and production security settings to protect databases, user credentials, and network communications.

---

## 1. Running the Django Security Audit Check

Django includes a built-in security auditing command that inspects your active settings for production vulnerabilities:

```bash
python manage.py check --deploy
```

This command flags misconfigured security headers, insecure session settings, unencrypted cookies, and exposed debug flags.

---

## 2. Hardening Production `settings.py`

Ensure the following security flags are enabled in your production environment:

```python
# ==========================================
# PRODUCTION SECURITY HARDENING
# ==========================================

# 1. Disable Debug Mode
DEBUG = False

# 2. Strict Host Header Validation (Prevents Host Header Poisoning)
ALLOWED_HOSTS = [".enterprise.com", "api.enterprise.com"]

# 3. Enforce HTTPS & SSL Redirection
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# 4. HTTP Strict Transport Security (HSTS)
SECURE_HSTS_SECONDS = 31536000 # Enforce HTTPS for 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# 5. Secure Cookies (Transmitted ONLY over HTTPS)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# 6. Mitigate XSS & Clickjacking
SESSION_COOKIE_HTTPONLY = True # Blocks JavaScript access to session cookie
X_FRAME_OPTIONS = "DENY"       # Completely forbids iframe embedding
SECURE_CONTENT_TYPE_NOSNIFF = True # Prevents MIME-sniffing
SECURE_BROWSER_XSS_FILTER = True
```

---

## 3. SQL Injection Prevention

Django's ORM protects against SQL injection by parameterizing all queries by default:

```python
# ✅ Safe: Parameterized query automatically escaped by ORM
Article.objects.filter(title=user_input)

# ❌ Dangerous: Raw SQL string formatting (SQL Injection Vulnerability!)
# Article.objects.raw(f"SELECT * FROM enterprise_articles WHERE title = '{user_input}'")

# ✅ Safe Raw SQL: Using query parameters
Article.objects.raw("SELECT * FROM enterprise_articles WHERE title = %s", [user_input])
```

---

## 4. Environment Variables & Secret Isolation

Never commit `SECRET_KEY`, database passwords, or API tokens to source control:

```python
# config/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Load variables from .env file (excluded in .gitignore!)
load_dotenv()

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

---

## 5. Password Security & Argon2 Hashing

Django's default password hasher is PBKDF2 with SHA-256. For high-security enterprise environments, adopt **Argon2** (winner of the Password Hashing Competition):

```bash
pip install argon2-cffi
```

```python
# config/settings.py
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
]
```

---

## Practice Quiz

### Q1: What built-in management command scans a Django project for production security vulnerabilities?
- A) python manage.py audit
- B) python manage.py check --deploy
- C) python manage.py test --security
- D) python manage.py verify
**Answer:** B
**Explanation:** python manage.py check --deploy executes an exhaustive automated security checklist, validating HSTS, SSL, and cookie settings.

### Q2: What does the HTTP Strict Transport Security (HSTS) header (SECURE_HSTS_SECONDS) do?
- A) It speeds up database queries
- B) It instructs browsers that the site must only be accessed using HTTPS, refusing unencrypted HTTP connections for the specified duration
- C) It hashes user passwords
- D) It blocks search engine indexers
**Answer:** B
**Explanation:** HSTS prevents man-in-the-middle attacks and SSL-stripping by forcing compliant browsers to communicate exclusively over HTTPS for a defined period.

### Q3: Why must SESSION_COOKIE_SECURE and CSRF_COOKIE_SECURE be set to True in production?
- A) To compress cookie sizes
- B) To ensure that session and CSRF cookies are transmitted exclusively over encrypted HTTPS connections, preventing plaintext sniffing over insecure networks
- C) To disable cookies completely
- D) To allow cross-domain cookie sharing
**Answer:** B
**Explanation:** The Secure cookie flag prevents browsers from sending cookies over unencrypted HTTP channels, protecting session IDs and tokens from packet sniffing.

### Q4: How does Django's ORM protect against SQL injection vulnerabilities?
- A) By compiling all Python code into binary machine code
- B) By using parameterized queries where values are sent separately to the database engine rather than directly concatenating user input into raw SQL strings
- C) By converting all strings into uppercase
- D) By disabling SQL completely
**Answer:** B
**Explanation:** Django's ORM parameterizes database queries, ensuring user inputs are treated strictly as data parameters rather than executable SQL commands.

### Q5: What does setting X_FRAME_OPTIONS = "DENY" protect against?
- A) Distributed Denial of Service (DDoS)
- B) Clickjacking attacks, by preventing malicious third-party websites from rendering your application inside an invisible <iframe>
- C) Cross-Site Scripting (XSS)
- D) SQL Injection
**Answer:** B
**Explanation:** X_FRAME_OPTIONS = 'DENY' instructs browsers never to render your pages inside an iframe or frame, neutralizing clickjacking attacks.
