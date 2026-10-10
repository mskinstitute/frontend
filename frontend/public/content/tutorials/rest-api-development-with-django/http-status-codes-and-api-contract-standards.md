# HTTP Status Codes and API Contract Standards

HTTP status codes are the standardized vocabulary through which REST APIs communicate the outcome of client requests. Returning accurate status codes—rather than masking errors with generic `200 OK` or unhelpful `500 Server Error` responses—is essential for API contracts and client error handling.

---

## 1. Status Code Classification

HTTP status codes are categorized into five distinct ranges:

```
1xx (Informational) ──► Request received, continuing process (e.g. 101 Switching Protocols)
2xx (Success)       ──► Action was successfully received, understood, and accepted
3xx (Redirection)   ──► Further action needed to complete request (e.g. 301 Moved Permanently)
4xx (Client Error)  ──► Request contains bad syntax or cannot be fulfilled due to client fault
5xx (Server Error)  ──► Server failed to fulfill an apparently valid request due to backend fault
```

---

## 2. Essential Status Codes for Enterprise APIs

| Code | Name | Meaning | Standard Scenario |
| :--- | :--- | :--- | :--- |
| **`200`** | `OK` | Request succeeded. | Standard `GET`, `PATCH`, or `PUT` response. |
| **`201`** | `Created` | Resource created. | Successful `POST` request; returns new resource. |
| **`204`** | `No Content` | Succeeded, no body. | Successful `DELETE` request. |
| **`400`** | `Bad Request` | Malformed syntax / validation failed. | Serializer validation failed (missing required field). |
| **`401`** | `Unauthorized` | Unauthenticated. | Missing or invalid token (`Bearer` token invalid). |
| **`403`** | `Forbidden` | Authenticated but unauthorized. | User logged in, but lacks permission to view resource. |
| **`404`** | `Not Found` | Resource does not exist. | Object with specified ID or slug not in database. |
| **`405`** | `Method Not Allowed` | Verb not supported. | Sending `DELETE` to read-only resource. |
| **`409`** | `Conflict` | State conflict. | Duplicate entry violating unique constraint. |
| **`429`** | `Too Many Requests`| Rate limit exceeded. | API throttling threshold breached. |
| **`500`** | `Internal Server Error`| Unhandled backend crash. | Uncaught Python exception in view code. |
| **`502`** | `Bad Gateway` | Upstream failure. | Nginx cannot connect to Gunicorn socket. |
| **`503`** | `Service Unavailable`| Temporary outage. | Maintenance mode or overloaded cluster. |

---

## 3. The `401 Unauthorized` vs `403 Forbidden` Rule

- **`401 Unauthorized`:** Really means **Unauthenticated**. The client has not provided valid credentials. Header `WWW-Authenticate` is often included.
- **`403 Forbidden`:** The server knows who the client is, but the authenticated user **lacks permission** to execute the action. Sending credentials again will not change the outcome.

---

## 4. Standardized Error Response Payload Contract

In enterprise REST architectures, never return plain text strings or ad-hoc error shapes. Standardize on RFC 7807 (`Problem Details for HTTP APIs`):

```json
{
  "type": "https://api.enterprise.com/errors/validation-error",
  "title": "Invalid Request Payload",
  "status": 400,
  "detail": "The payload failed validation checks.",
  "errors": {
    "email": ["Enter a valid corporate email address."],
    "budget": ["Budget must be a positive integer."]
  },
  "instance": "/api/v1/projects/"
}
```

---

## 5. Using Status Codes in Django REST Framework

DRF provides named constants in `rest_framework.status`:

```python
from rest_framework import status
from rest_framework.response import Response

def delete_user(self, request, pk):
    return Response(status=status.HTTP_204_NO_CONTENT)

def validate_input(self, errors):
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)
```

---

## Practice Quiz

### Q1: What is the critical distinction between HTTP 401 Unauthorized and HTTP 403 Forbidden?
- A) 401 is for mobile apps; 403 is for web browsers
- B) 401 means unauthenticated (missing or invalid credentials); 403 means authenticated, but the user lacks permissions for that resource
- C) They are identical synonyms
- D) 403 is a server-side crash
**Answer:** B
**Explanation:** 401 indicates authentication is missing or invalid; 403 indicates authentication succeeded, but the user is forbidden from performing the action.

### Q2: What status code should an API return when a client attempts to create an account with an email that is already registered?
- A) 200 OK
- B) 409 Conflict (or 400 Bad Request with validation errors)
- C) 500 Internal Server Error
- D) 404 Not Found
**Answer:** B
**Explanation:** 409 Conflict signifies that the request conflicts with current server state (such as duplicate entries on unique database constraints).

### Q3: Why is returning 200 OK with a body like {"error": "Invalid password"} considered an API design anti-pattern?
- A) It violates HTTP standards: caching proxies, API gateways, and client libraries rely on HTTP status codes to detect errors and trigger retry or alert logic
- B) Browsers cannot display JSON with 200 OK
- C) It crashes Python
- D) It violates HTTPS encryption
**Answer:** A
**Explanation:** Masking errors behind 200 OK breaks standard HTTP intermediaries, monitoring tools, and client fetch interceptors that depend on status codes to route errors.

### Q4: What status code is returned when a client makes more API requests than permitted by the rate limiter?
- A) 400 Bad Request
- B) 429 Too Many Requests
- C) 503 Service Unavailable
- D) 405 Method Not Allowed
**Answer:** B
**Explanation:** HTTP 429 Too Many Requests indicates the client has sent too many requests in a given amount of time (rate limiting / throttling).

### Q5: In Django REST Framework, where are standard named status code constants imported from?
- A) django.http.status
- B) rest_framework.status
- C) rest_framework.codes
- D) django.core.status
**Answer:** B
**Explanation:** DRF exports descriptive status constants (e.g. status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST) from rest_framework.status.
