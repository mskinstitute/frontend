# DRF Token Authentication and Session Auth

Securing API endpoints requires identifying the caller on every request. Django REST Framework ships with built-in authentication mechanisms, the two most prominent being **SessionAuthentication** (ideal for browser web SPAs on the same domain) and **TokenAuthentication** (ideal for mobile apps, external clients, and third-party integrations).

---

## 1. SessionAuthentication vs TokenAuthentication

| Feature | `SessionAuthentication` | `TokenAuthentication` |
| :--- | :--- | :--- |
| **Credential** | Cookie-based session ID (`sessionid`) | Static Bearer Token string |
| **CSRF Required?** | **Yes** (on all mutating requests) | **No** (immune to CSRF) |
| **Best Used For** | Same-domain React/Vue SPAs | Mobile apps, CLI tools, server-to-server APIs |
| **Storage** | `django_session` table | `authtoken_token` table |

---

## 2. Setting Up DRF `TokenAuthentication`

Add `rest_framework.authtoken` to `INSTALLED_APPS`:

```python
# config/settings.py
INSTALLED_APPS = [
    # ...
    "rest_framework",
    "rest_framework.authtoken", # Creates authtoken_token database table
]

# Run migration to create token table
# python manage.py migrate
```

Configure `TokenAuthentication` in global settings:

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
}
```

---

## 3. Exposing the Login / Token Obtain Endpoint

DRF provides a built-in view (`obtain_auth_token`) that validates username and password and returns a token:

```python
# config/urls.py
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # POST /api/auth/token/  { "username": "...", "password": "..." }
    path("api/auth/token/", obtain_auth_token, name="api-token-auth"),
]
```

### Response:
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

---

## 4. Making Authenticated Requests

Clients transmit the token in the `Authorization` HTTP header prefixed with `Token`:

```http
GET /api/v1/projects/ HTTP/1.1
Host: api.enterprise.com
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Accept: application/json
```

---

## 5. Automatically Generating Tokens on User Signup

Use a Django `post_save` signal to automatically generate an auth token whenever a new user registers:

```python
# accounts/signals.py
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
```

---

## Practice Quiz

### Q1: What HTTP header and prefix format does DRF TokenAuthentication expect?
- A) Auth: <token>
- B) Authorization: Token <token_string>
- C) Bearer: <token>
- D) Token: <token>
**Answer:** B
**Explanation:** By default, DRF's TokenAuthentication inspects the Authorization header for the format Authorization: Token 9944b09199....

### Q2: Why does TokenAuthentication not require CSRF token validation on POST requests?
- A) TokenAuthentication is insecure
- B) CSRF attacks rely on browsers automatically attaching cookies; since Authorization headers are not automatically sent by cross-origin browser form posts, TokenAuthentication is inherently immune to CSRF
- C) Django disables security for tokens
- D) DRF automatically injects CSRF tokens
**Answer:** B
**Explanation:** CSRF vulnerabilities exploit automatic cookie transmission; custom Authorization headers cannot be attached by malicious cross-origin form submissions, rendering token requests immune to CSRF.

### Q3: What database table is created by adding rest_framework.authtoken to INSTALLED_APPS?
- A) auth_user
- B) authtoken_token
- C) django_tokens
- D) rest_credentials
**Answer:** B
**Explanation:** The authtoken app creates the authtoken_token table, which maps user foreign keys to their 40-character hexadecimal token string.

### Q4: What view does DRF provide out-of-the-box to exchange credentials for an auth token?
- A) login_user()
- B) obtain_auth_token
- C) generate_token_view
- D) auth_handshake()
**Answer:** B
**Explanation:** rest_framework.authtoken.views.obtain_auth_token accepts POST requests with username and password, validating credentials and returning the user's token.

### Q5: What is a known limitation of DRF's built-in TokenAuthentication in large-scale enterprise systems?
- A) Tokens can only be 5 characters long
- B) Built-in tokens do not expire automatically and require a database lookup on every single request, leading many enterprises to adopt stateless JWTs (SimpleJWT)
- C) It only works with SQLite
- D) Tokens can only be used once
**Answer:** B
**Explanation:** Standard DRF tokens never expire unless deleted manually and hit the database on every request; enterprise systems frequently migrate to expiring, stateless JWT tokens.
