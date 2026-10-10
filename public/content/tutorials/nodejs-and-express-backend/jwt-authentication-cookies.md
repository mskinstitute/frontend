# User Authentication with JWT (JSON Web Tokens) & HTTP-Only Cookies

Stateless authentication using **JSON Web Tokens (JWT)** is the modern standard for securing REST APIs and distributed microservices. When paired with **HTTP-Only Cookies**, JWTs protect client applications against Cross-Site Scripting (XSS) credential theft.

---

## 1. Anatomy of a JSON Web Token

A JWT consists of three base64url-encoded parts separated by periods (`.`):
```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjEiLCJyb2xlIjoiYWRtaW4ifQ.uS7Z-K...
[            HEADER            ].[             PAYLOAD              ].[   SIGNATURE   ]
```

1. **Header:** Algorithm and token type (`{"alg": "HS256", "typ": "JWT"}`).
2. **Payload:** Claims and user identifiers (`{"id": "usr_123", "role": "admin", "exp": 1718000000}`). *Never store sensitive data like plaintext passwords or credit cards in the payload!*
3. **Signature:** Cryptographic hash of `(base64Header + "." + base64Payload)` generated using a secret key or private RSA key.

---

## 2. Signing and Verifying JWTs

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-production-secret-key';
const JWT_EXPIRES_IN = '1d';

// Generate token upon login
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify token in authentication middleware
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
```

---

## 3. Why HTTP-Only Cookies Beat LocalStorage

Storing JWT tokens in browser `localStorage` exposes them to complete theft via malicious JavaScript injected through Cross-Site Scripting (XSS).

Instead, transmit the token in an **HTTP-Only, Secure, SameSite Cookie**:

```javascript
export function sendAuthTokenCookie(res, token) {
  const cookieOptions = {
    httpOnly: true, // Prevents client-side JS from accessing document.cookie (XSS Defense)
    secure: process.env.NODE_ENV === 'production', // Transmitted ONLY over HTTPS
    sameSite: 'strict', // Mitigates Cross-Site Request Forgery (CSRF)
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  };

  res.cookie('token', token, cookieOptions);
}
```

---

## 4. Authentication Guard Middleware

```javascript
import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
  // Check Authorization header OR cookie
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'You are not logged in. Please provide a valid token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid or has expired.' });
  }
};
```

---

# Multiple Choice Questions

### 1. Why is storing JWT authentication tokens in browser `localStorage` dangerous?
A. `localStorage` deletes data after 10 seconds.
B. Any malicious JavaScript script injected via Cross-Site Scripting (XSS) can read `localStorage` and steal the token.
C. `localStorage` cannot store strings.
D. It increases server bandwidth by 500%.
**Answer:** B
**Explanation:** `localStorage` is completely accessible to client-side JavaScript, meaning any XSS vulnerability allows attackers to extract tokens.
---

### 2. What security property does the `httpOnly: true` cookie flag enforce?
A. The cookie can only be read on Sundays.
B. Client-side JavaScript cannot access the cookie via `document.cookie`, preventing XSS credential theft.
C. The cookie cannot be sent over HTTPS.
D. The cookie is automatically encrypted with SHA-512.
**Answer:** B
**Explanation:** `httpOnly` instructs the browser that the cookie must never be accessible to client-side scripts, protecting it from XSS exfiltration.
---

### 3. Which part of a JSON Web Token verifies that the token payload has not been tampered with in transit?
A. The Header
B. The Payload
C. The Signature
D. The Expiration Date
**Answer:** C
**Explanation:** The Signature is computed with the secret key over the header and payload; modifying even a single character in the payload invalidates the signature.
---

### 4. What happens when `jwt.verify()` encounters a token whose expiration timestamp (`exp`) is in the past?
A. It silently extends the token by 2 hours.
B. It throws a `TokenExpiredError`.
C. It resets the user's password.
D. It returns the string `"OK"`.
**Answer:** B
**Explanation:** `jwt.verify()` checks the `exp` claim and automatically throws a `TokenExpiredError` if the token has lapsed.
---

### 5. Why should sensitive information like user passwords never be stored inside a JWT payload?
A. The payload is merely base64url-encoded and can be trivially decoded by anyone who inspects the token.
B. JWTs cannot store characters other than numbers.
C. Passwords make tokens exceed maximum HTTP header lengths.
D. JWT rejects strings longer than 10 characters.
**Answer:** A
**Explanation:** Base64 encoding is not encryption; anyone who intercepts a JWT can decode the payload and read all contained fields.
---
