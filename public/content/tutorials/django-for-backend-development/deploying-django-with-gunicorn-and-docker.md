# Deploying Django with Gunicorn and Docker

Deploying a production Django backend requires moving away from the single-threaded `runserver` to a robust, multi-process WSGI server. Modern enterprise deployments package Django into containerized **Docker** images orchestrated behind **Gunicorn (Green Unicorn)** and **Nginx**, deployed across cloud platforms (Heroku, AWS ECS, Google Cloud Run, or DigitalOcean).

---

## 1. The Production Architecture Stack

```
User (Browser) ──► HTTPS (Port 443) ──► Nginx Reverse Proxy
                                                │
                                                ▼ (Reverse Proxy / UNIX Socket)
                                        Gunicorn WSGI Master Process
                                        ├── Worker 1 (Python Process)
                                        ├── Worker 2 (Python Process)
                                        └── Worker 3 (Python Process)
                                                │
                                                ▼
                                        PostgreSQL Database
```

- **Nginx:** Handles SSL termination, serves static/media files, and load balances requests.
- **Gunicorn:** Manages a pool of pre-forked worker processes executing Python code.

---

## 2. Production Dependencies

```bash
# Production WSGI server
pip install gunicorn

# PostgreSQL database driver
pip install psycopg2-binary

# Database URL parser for cloud platforms (DATABASE_URL)
pip install dj-database-url

# Static file serving for single-container cloud environments
pip install whitenoise
```

---

## 3. Configuring WhiteNoise for Static Assets

On platforms like Heroku or single-container Docker setups without a separate Nginx container, **WhiteNoise** allows Django to serve its own static files efficiently with gzip/brotli compression and caching:

```python
# config/settings.py
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", # Place directly after SecurityMiddleware!
    # ...
]

# Enable WhiteNoise compression and caching
STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

---

## 4. Production Dockerfile

```dockerfile
# Use lightweight official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies (for psycopg2 and build tools)
RUN apt-get update && apt-get install -y --no-install-recommends     build-essential     libpq-dev     && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Collect static files at build time
RUN python manage.py collectstatic --noinput

# Expose production port
EXPOSE 8000

# Run Gunicorn with 3 pre-forked worker processes
CMD ["gunicorn", "--workers=3", "--bind=0.0.0.0:8000", "config.wsgi:application"]
```

---

## 5. Heroku Deployment via `Procfile`

For deploying to Heroku or Railway, specify process commands in a `Procfile`:

```
release: python manage.py migrate
web: gunicorn config.wsgi:application --workers 3 --log-file -
```

The `release` phase runs database migrations automatically before traffic is switched to the newly deployed container, preventing downtime.

---

## Practice Quiz

### Q1: Why is Gunicorn required to serve Django applications in production instead of manage.py runserver?
- A) runserver only works on Windows
- B) Gunicorn is a battle-tested pre-fork worker WSGI server that can handle concurrent requests across multiple CPU processes, whereas runserver is an unhardened, single-threaded development utility
- C) runserver cannot connect to databases
- D) Gunicorn compiles Python to JavaScript
**Answer:** B
**Explanation:** runserver is strictly for local development. Gunicorn manages a pool of worker processes to serve production traffic concurrently with process monitoring and crash recovery.

### Q2: What does WhiteNoise enable for containerized Django deployments?
- A) It generates white CSS backgrounds
- B) It allows Django to serve its own static files directly with high efficiency, compression, and cache headers, removing the strict requirement for a separate Nginx or S3 static server
- C) It cancels background noise in audio files
- D) It encrypts passwords
**Answer:** B
**Explanation:** WhiteNoise embeds static file serving directly into the WSGI pipeline, applying compression and cache headers without needing a dedicated static file web server.

### Q3: How do you calculate the recommended number of Gunicorn worker processes?
- A) Exactly 100 workers
- B) (2 x CPU Cores) + 1
- C) 1 worker per registered user
- D) It must always be 1
**Answer:** B
**Explanation:** Gunicorn's official documentation recommends the formula (2 x $num_cores) + 1 workers to balance CPU utilization and memory consumption.

### Q4: What does the command python manage.py collectstatic do?
- A) It deletes unused CSS
- B) It discovers static assets across all installed apps and copies them into the single centralized STATIC_ROOT directory for production serving
- C) It downloads static images from Google
- D) It verifies JavaScript syntax
**Answer:** B
**Explanation:** collectstatic gathers static assets from each app's static/ directories and consolidates them into the directory defined by STATIC_ROOT.

### Q5: In a Heroku or Railway Procfile, what does the release phase do?
- A) It posts an announcement on Twitter
- B) It executes maintenance tasks (such as database migrations) in a temporary dyno before the new application build goes live
- C) It restarts the user's computer
- D) It deletes previous code versions
**Answer:** B
**Explanation:** The release phase runs commands (like python manage.py migrate) prior to launching the new web processes, preventing database schema mismatch errors.
