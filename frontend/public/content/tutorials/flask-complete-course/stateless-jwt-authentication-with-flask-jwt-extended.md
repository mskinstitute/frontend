# Stateless JWT Authentication with Flask-JWT-Extended

While cookie-based sessions (like Flask-Login) work seamlessly for traditional server-rendered websites, modern mobile apps and Single Page Applications (Next.js, React) require **stateless authentication**. Storing session IDs in cookies across cross-domain mobile applications triggers CORS restrictions and cross-site cookie blocking.

**JSON Web Tokens (JWT)** provide cryptographically signed, stateless authentication tokens. The **Flask-JWT-Extended** extension is the premier library for implementing JWT authentication in Flask.

---

## 1. How JWT Authentication Works

A JWT is an encoded, cryptographically signed token containing three base64-encoded segments:

```
[ Header (algorithm & token type) ].[ Payload (claims & user ID) ].[ Signature (HMAC-SHA256) ]
```

```
1. Client sends POST /api/login with { username, password }.
2. Server verifies password and generates two tokens:
   - Access Token: Short-lived (e.g. 15 minutes), used to access protected APIs.
   - Refresh Token: Long-lived (e.g. 30 days), used only to request a fresh access token.
3. Client stores tokens and attaches:
   Authorization: Bearer <access_token> on subsequent API requests.
4. Server cryptographically verifies signature without querying session tables!
```

---

## 2. Installing and Configuring Flask-JWT-Extended

```bash
pip install flask-jwt-extended
```

In `app.py`:

```python
import os
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Essential: Strong secret key used to sign JWT signatures
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "jwt-super-secret-key-prod")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)
```

---

## 3. Login Endpoint & Issuing Tokens

```python
from flask import request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from models import User

@app.route("/api/v1/auth/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Identity can be user ID or username
    # Additional claims store roles or permissions directly in token!
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer"
    }), 200
```

---

## 4. Protecting Endpoints with `@jwt_required()`

Restricting an endpoint requires decorating the view with `@jwt_required()`:

```python
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@app.route("/api/v1/user/profile", methods=["GET"])
@jwt_required()
def get_user_profile():
    # Extracts the user ID encoded in the verified JWT
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    
    # Access custom claims
    claims = get_jwt()
    user_role = claims.get("role")

    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user_role
    }), 200
```

---

## 5. Refreshing Access Tokens

When an access token expires (`401 Token has expired`), clients submit their refresh token to obtain a fresh access token without re-prompting for credentials:

```python
@app.route("/api/v1/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    # Only accepts a valid Refresh Token
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    
    return jsonify({"access_token": new_access_token}), 200
```

---

## Practice Quiz

### Q1: In which HTTP header does a client typically transmit a JWT token?
- A) `Content-Type: application/jwt`
- B) `Authorization: Bearer <token>`
- C) `Cookie: jwt_token=<token>`
- D) `X-Token-Auth: <token>`
**Answer:** B
**Explanation:** Standard RFC 6750 Bearer Token authentication specifies transmitting tokens in the `Authorization: Bearer <token>` header.

### Q2: What is the primary purpose of separating tokens into an Access Token and a Refresh Token?
- A) To reduce server disk storage
- B) To minimize the security impact of a stolen token (short access lifetime) while maintaining user convenience without constant logins (long refresh lifetime)
- C) Because JWT tokens can only hold 10 bytes
- D) To bypass SSL certificate validation
**Answer:** B
**Explanation:** Short-lived access tokens limit exposure if compromised, while refresh tokens allow clients to renew credentials securely.

### Q3: What decorator protects endpoints requiring a valid access token in Flask-JWT-Extended?
- A) `@auth_required`
- B) `@jwt_required()`
- C) `@token_protected`
- D) `@verify_jwt`
**Answer:** B
**Explanation:** `@jwt_required()` intercepts incoming requests, verifies the cryptographic signature and expiration of the Bearer token, and populates token context.

### Q4: How do you extract the user identity encoded in the verified JWT inside a route?
- A) `request.user_id`
- B) `get_jwt_identity()`
- C) `jwt.current_user`
- D) `session['user']`
**Answer:** B
**Explanation:** `get_jwt_identity()` extracts the `sub` (subject/identity) claim encoded in the active verified JWT.

### Q5: What setting must be passed to `@jwt_required()` on an endpoint designed specifically to issue new access tokens?
- A) `@jwt_required(refresh=True)`
- B) `@jwt_required(type='refresh')`
- C) `@jwt_required(renewable=True)`
- D) `@jwt_refresh_only`
**Answer:** A
**Explanation:** Setting `@jwt_required(refresh=True)` instructs Flask-JWT-Extended to accept strictly valid refresh tokens and reject standard access tokens.
