# Testing Flask with Pytest, Gunicorn & Docker Deployment

Building an enterprise Flask application is only half the battle; ensuring code reliability through automated testing and packaging it for production deployment completes the engineering lifecycle.

In this lesson, we explore automated unit testing with **Pytest**, WSGI production serving with **Gunicorn**, and containerization with **Docker**.

---

## 1. Automated Testing with Pytest & Flask Test Client

Flask provides a built-in test client that simulates HTTP requests against your application without starting a live web server socket.

```bash
pip install pytest pytest-flask
```

### Pytest Fixtures (`tests/conftest.py`):
```python
import pytest
from app import create_app
from app.extensions import db
from models import User

@pytest.fixture
def app():
    # Instantiate app with TestingConfig (in-memory SQLite)
    test_app = create_app("testing")
    
    with test_app.app_context():
        db.create_all()
        # Seed test user
        user = User(username="testuser", email="test@example.com")
        user.password = "ValidPassword123"
        db.session.add(user)
        db.session.commit()
        
        yield test_app
        
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    # Returns simulated HTTP client
    return app.test_client()
```

### Writing Unit & Integration Tests (`tests/test_auth.py`):
```python
def test_home_page_returns_200(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"MSK Institute" in response.data

def test_user_login_success(client):
    response = client.post("/auth/login", data={
        "username": "testuser",
        "password": "ValidPassword123"
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Welcome back!" in response.data

def test_protected_route_requires_login(client):
    response = client.get("/dashboard")
    # Redirects to login page with 302
    assert response.status_code == 302
    assert "/auth/login" in response.headers["Location"]
```

Run tests in your terminal:
```bash
pytest -v
```

---

## 2. Production WSGI Server: Gunicorn

In production, never use `flask run` or `python app.py`. Deploy using **Gunicorn** (Green Unicorn), a production-grade pre-fork worker WSGI server:

```bash
pip install gunicorn
```

Run Gunicorn pointing to your WSGI callable:
```bash
gunicorn --workers 4 --bind 0.0.0.0:8000 "wsgi:app"
```

### Worker Sizing Formula:
Recommended Gunicorn workers formula: `(2 x CPU_Cores) + 1`. For a 2-core server: `(2 x 2) + 1 = 5` workers.

---

## 3. Containerizing Flask with Docker

A Docker container bundles the application, Python runtime, system libraries, and dependencies into an immutable image.

### Production `Dockerfile`:
```dockerfile
# Multi-stage production build
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application source code
COPY . .

# Create non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Start Gunicorn server
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:8000", "wsgi:app"]
```

---

## 4. Multi-Container Orchestration with `docker-compose.yml`

Connect Flask, PostgreSQL, and Redis:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=super-secure-production-secret-key
      - DATABASE_URL=postgresql://msk_user:msk_pass@db:5432/msk_prod
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: msk_user
      POSTGRES_PASSWORD: msk_pass
      POSTGRES_DB: msk_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Start the entire production stack:
```bash
docker compose up -d --build
```

---

## Practice Quiz

### Q1: What does Flask's `app.test_client()` provide for automated testing?
- A) A Selenium headless Chrome browser
- B) An in-process simulated HTTP client that tests routes without launching a live network server socket
- C) A tool to stress-test Wi-Fi routers
- D) A database schema generator
**Answer:** B
**Explanation:** `test_client()` simulates requests directly against the WSGI interface in-memory, making unit tests run in milliseconds.

### Q2: What does passing `follow_redirects=True` to `client.post()` accomplish?
- A) It prevents HTTP 500 errors
- B) The test client automatically follows 301/302 redirects and returns the final destination page's response
- C) It redirects users to Google
- D) It bypasses login authentication
**Answer:** B
**Explanation:** `follow_redirects=True` tells the test client to follow HTTP redirect status codes until reaching the final destination view.

### Q3: What is the recommended formula for calculating Gunicorn worker counts on a server?
- A) `CPU_Cores * 100`
- B) `(2 * CPU_Cores) + 1`
- C) `CPU_Cores / 2`
- D) `RAM_GB * 2`
**Answer:** B
**Explanation:** The official Gunicorn documentation recommends `(2 x $num_cores) + 1` as the optimal worker process count for handling I/O and CPU workloads.

### Q4: Why should a Dockerfile create and switch to a non-root user (`USER appuser`)?
- A) To speed up container launch time
- B) To enforce security least-privilege principles, preventing attackers from gaining host root access if the application is compromised
- C) Because Python cannot run as root
- D) To reduce image size
**Answer:** B
**Explanation:** Running containers as non-root users is a fundamental security hardening practice that restricts malicious code execution if an app exploit occurs.

### Q5: What command launches a multi-container stack defined in `docker-compose.yml` in detached background mode?
- A) `docker run all`
- B) `docker compose up -d`
- C) `docker start cluster`
- D) `docker compose detach`
**Answer:** B
**Explanation:** `docker compose up -d` builds and launches all defined services (web, database, redis) in the background.
