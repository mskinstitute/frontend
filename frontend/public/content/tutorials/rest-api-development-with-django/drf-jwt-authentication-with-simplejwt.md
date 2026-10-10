# DRF JWT Authentication with SimpleJWT

While standard database tokens require an SQL query on every single HTTP request, **JSON Web Tokens (JWT)** provide stateless, cryptographically signed authentication. The enterprise standard library for JWT in Django is **`djangorestframework-simplejwt`**. It implements short-lived **Access Tokens** and long-lived **Refresh Tokens** with built-in token rotation.

---

## 1. Dual-Token JWT Architecture

```
1. Client POST /api/token/ (credentials) ──► Returns: { access: "...", refresh: "..." }
2. Client calls API with: Authorization: Bearer <access_token> (Valid for 5-15 mins)
3. Access token expires (401 Unauthorized)
4. Client POST /api/token/refresh/ (refresh_token) ──► Returns fresh <access_token>
```

---

## 2. Installation & Setup

```bash
pip install djangorestframework-simplejwt
```

Configure `JWTAuthentication` in `settings.py`:

```python
# config/settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}
```

---

## 3. Registering JWT Endpoints in `urls.py`

```python
# config/urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # 1. Login / Obtain token pair
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # 2. Silent refresh
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # 3. Verify validity
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
```

---

## 4. Customizing JWT Lifetimes & Rotation Settings

```python
# config/settings.py
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),   # Short-lived access
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),       # Long-lived refresh
    "ROTATE_REFRESH_TOKENS": True,                     # Issue NEW refresh token on refresh
    "BLACKLIST_AFTER_ROTATION": True,                  # Invalidate old refresh token!
    "UPDATE_LAST_LOGIN": True,
    
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),                  # Expects: Authorization: Bearer <token>
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}
```

---

## 5. Adding Custom Claims to Tokens

By default, JWTs only include `user_id`. You can embed custom claims (like `email`, `role`, or `tenant_id`) to avoid database lookups on client frontends:

```python
# accounts/tokens.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Inject custom claims into the signed JWT payload:
        token["email"] = user.email
        token["role"] = getattr(user, "role", "viewer")
        token["organization_id"] = str(user.organization.id) if getattr(user, "organization", None) else None

        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
```

---

## Practice Quiz

### Q1: What header format does SimpleJWT expect for authenticated requests?
- A) Authorization: Token <token>
- B) Authorization: Bearer <access_token>
- C) X-JWT-Token: <access_token>
- D) Cookie: jwt=<token>
**Answer:** B
**Explanation:** In alignment with OAuth 2.0 Bearer Token standards, SimpleJWT expects Authorization: Bearer <token>.

### Q2: What security advantage does ROTATE_REFRESH_TOKENS and BLACKLIST_AFTER_ROTATION provide?
- A) It makes JWTs run in C++
- B) Whenever a refresh token is used, it is revoked and replaced with a new refresh token; if an attacker steals a used refresh token, the server rejects it
- C) It disables password resets
- D) It deletes user profiles
**Answer:** B
**Explanation:** Token rotation ensures that refresh tokens can only be used once; using an already-invalidated token can alert the system to potential theft and revoke all downstream sessions.

### Q3: Why are Access Tokens configured with short lifetimes (e.g. 5 to 15 minutes)?
- A) To force users to re-enter passwords constantly
- B) Because stateless JWTs cannot be easily revoked before expiration; short lifetimes minimize the window of opportunity if an access token is intercepted
- C) Because browsers crash if tokens last longer
- D) To save database space
**Answer:** B
**Explanation:** Since verifying a stateless JWT does not consult a database, revoking an access token is challenging; short expiration windows limit damage if a token is compromised.

### Q4: What does the TokenRefreshView endpoint (/api/token/refresh/) do?
- A) It deletes the database
- B) It accepts a valid refresh_token in the request body and issues a fresh, valid access_token without requiring user credentials
- C) It sends an email with a new password
- D) It logs the user out
**Answer:** B
**Explanation:** TokenRefreshView allows client SPAs to renew expired access tokens silently in the background using their long-lived refresh token.

### Q5: What information is contained in the signature of a JSON Web Token?
- A) The user's plaintext password
- B) A cryptographic hash of the header and payload generated using the server's secret key, verifying that the token has not been tampered with
- C) The server's hard drive serial number
- D) The database SQL schema
**Answer:** B
**Explanation:** The signature is calculated by hashing the encoded header and payload with a secret key; altering any payload data invalidates the signature.
