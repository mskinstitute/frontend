# Unit Testing

Enterprise software requires continuous confidence that code modifications do not introduce regressions into models, business logic, authorization rules, or view routing. Django provides an automated testing framework built atop Python's standard `unittest` library, featuring an isolated test database runner, mock HTTP request clients, and specialized assertions.

---

## 1. The Django Test Runner Lifecycle

When you execute `python manage.py test`:
1. Django constructs a **temporary, isolated test database** in memory or on disk.
2. It executes all pending migrations to build the schema from scratch.
3. Tests run in clean, transaction-isolated sandboxes (each test method rolls back database mutations upon completion).
4. The temporary test database is destroyed upon completion.
5. Your development and production databases remain 100% untouched!

---

## 2. Unit Testing Models

Test model validations, default values, custom methods, and `__str__` representations:

```python
# articles/tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from articles.models import Article

User = get_user_model()

class ArticleModelTest(TestCase):
    def setUp(self):
        # Runs BEFORE every test method
        self.user = User.objects.create_user(
            email="author@enterprise.com",
            username="author",
            password="SecurePassword123!"
        )

    def test_article_creation_and_slug_generation(self):
        article = Article.objects.create(
            title="Advanced Django ORM Patterns",
            content="Comprehensive guide to QuerySets...",
            author=self.user,
            status="published"
        )

        # Assertions
        self.assertEqual(str(article), "Advanced Django ORM Patterns (published)")
        self.assertEqual(article.slug, "advanced-django-orm-patterns")
        self.assertEqual(article.view_count, 0)
        self.assertTrue(article.created_at is not None)

    def test_draft_articles_cannot_be_featured(self):
        article = Article(
            title="Draft Title",
            content="Content...",
            author=self.user,
            status="draft",
            is_featured=True
        )
        # Verify clean() method raises ValidationError
        with self.assertRaises(ValidationError):
            article.clean()
```

---

## 3. Testing Views with `Client`

Django's `Client` acts as a dummy web browser, simulating GET and POST requests without running a live HTTP network server:

```python
# articles/tests/test_views.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from articles.models import Article

User = get_user_model()

class ArticleViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            email="editor@enterprise.com",
            username="editor",
            password="Password123"
        )
        self.article = Article.objects.create(
            title="Test Story",
            slug="test-story",
            content="Sample text",
            author=self.user,
            status="published"
        )

    def test_article_list_view_status_code_and_template(self):
        url = reverse("articles:home")
        response = self.client.get(url)

        # Assert HTTP 200 OK
        self.assertEqual(response.status_code, 200)
        # Assert template used
        self.assertTemplateUsed(response, "articles/home.html")
        # Assert context contains articles
        self.assertIn(self.article, response.context["articles"])

    def test_create_article_requires_authentication(self):
        url = reverse("articles:create")
        # Attempt access as anonymous guest
        response = self.client.get(url)
        
        # Should redirect to login page (HTTP 302)
        self.assertEqual(response.status_code, 302)
        self.assertIn("/accounts/login/", response.url)

    def test_authenticated_user_can_create_article(self):
        # Authenticate simulated client
        self.client.force_login(self.user)
        url = reverse("articles:create")

        payload = {
            "title": "New Testing Article",
            "content": "Body text for test.",
            "status": "published",
        }
        response = self.client.post(url, data=payload)

        # Assert successful creation redirects to detail view
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Article.objects.filter(title="New Testing Article").exists())
```

---

## 4. Running Tests with Code Coverage

Measure test completeness using `coverage.py`:

```bash
# Run tests under coverage measurement
coverage run --source='.' manage.py test

# Display terminal coverage report
coverage report

# Generate interactive HTML coverage dashboard
coverage html
```

Aim for >85% coverage across enterprise business logic.

---

## Practice Quiz

### Q1: What happens to the database when you run python manage.py test?
- A) It runs against your production database
- B) Django creates a temporary, isolated test database, runs migrations on it, and destroys it when testing finishes, leaving live data untouched
- C) It deletes your local SQLite file
- D) It formats your hard drive
**Answer:** B
**Explanation:** Django's test runner constructs an isolated, temporary database specifically for test execution and deletes it upon completion, protecting development and production data.

### Q2: Why does TestCase wrap each individual test method inside a database transaction?
- A) To make tests run 10x slower
- B) To roll back all database modifications at the end of each test method, ensuring tests remain isolated and do not pollute one another
- C) To prevent other users from writing to the database
- D) To test database concurrency
**Answer:** B
**Explanation:** Django's TestCase wraps each test in a database transaction that rolls back upon completion, guaranteeing each test method begins with a clean slate.

### Q3: What does self.client.force_login(user) accomplish in a Django test?
- A) It brute-forces the user's password
- B) It authenticates the simulated test client directly as the given user instance, bypassing login forms and password hashing for speed
- C) It changes the user's password in the database
- D) It grants superuser permissions
**Answer:** B
**Explanation:** force_login bypasses the password verification pipeline, quickly attaching user credentials to the test client session for rapid authorization testing.

### Q4: Which assertion verifies that an unauthenticated user is redirected to the login page?
- A) self.assert404(response)
- B) self.assertEqual(response.status_code, 302) and self.assertIn(reverse('login'), response.url)
- C) self.assertTrue(response.is_anonymous)
- D) self.assertFalse(response.user)
**Answer:** B
**Explanation:** When an unauthenticated client visits a protected view, Django returns an HTTP 302 redirect pointing to settings.LOGIN_URL.

### Q5: What tool is standard in Python for measuring the percentage of codebase lines executed during tests?
- A) pytest-speed
- B) coverage.py (coverage run manage.py test)
- C) pylint
- D) flake8
**Answer:** B
**Explanation:** coverage.py monitors Python code execution during test runs and generates detailed coverage statistics and HTML audit reports.
