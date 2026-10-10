# RESTful API Design Standards: HTTP Verbs, Status Codes & Idempotency

**REST (Representational State Transfer)** is the dominant architectural style for designing scalable, maintainable web APIs. Following strict REST conventions ensures predictable, developer-friendly endpoints that conform to international web standards.

---

## 1. Resource-Oriented URL Naming Conventions

In REST, URLs represent **resources** (nouns, not actions/verbs). Use plural nouns and lowercase kebab-case:

| Good RESTful Design (Nouns) | Bad Anti-Pattern (Verbs in URL) | Intent |
| :--- | :--- | :--- |
| `GET /api/v1/users` | `GET /api/v1/getAllUsers` | Fetch list of users |
| `POST /api/v1/users` | `POST /api/v1/createNewUser` | Create a new user |
| `GET /api/v1/users/42` | `GET /api/v1/getUserById?id=42` | Fetch single user |
| `PATCH /api/v1/users/42` | `POST /api/v1/updateUser` | Partial update of user |
| `DELETE /api/v1/users/42` | `POST /api/v1/deleteUser` | Delete user |
| `GET /api/v1/users/42/orders` | `GET /api/v1/getUserOrders?u=42` | Nested sub-resource |

---

## 2. Standard HTTP Status Codes

Using the correct HTTP status code communicates the result unambiguously:

- **`200 OK`:** Standard successful GET, PUT, or PATCH.
- **`201 Created`:** Successful POST resulting in a newly created resource.
- **`204 No Content`:** Successful request with intentionally empty response body (typical for DELETE).
- **`400 Bad Request`:** Client sent malformed syntax or invalid input payload.
- **`401 Unauthorized`:** Client is unauthenticated (missing or invalid JWT token).
- **`403 Forbidden`:** Client is authenticated but lacks permission (e.g. non-admin accessing admin portal).
- **`404 Not Found`:** Requested resource or endpoint does not exist.
- **`409 Conflict`:** State conflict (e.g. trying to register with an email that already exists).
- **`422 Unprocessable Entity`:** Payload is syntactically valid JSON but violates domain rules.
- **`500 Internal Server Error`:** Unhandled server-side crash or database failure.

---

## 3. What is Idempotency?

An HTTP method is **idempotent** if making the same request multiple times produces the exact same server-side state as making it once.

| Method | Idempotent? | Safe (Read-Only)? | Explanation |
| :--- | :--- | :--- | :--- |
| **GET** | Yes | Yes | Reading data never mutates state |
| **HEAD / OPTIONS** | Yes | Yes | Metadata inspection only |
| **PUT** | Yes | No | Overwriting an entity 10 times results in identical state |
| **DELETE** | Yes | No | Deleting resource ID 5 multiple times leaves it deleted |
| **POST** | **No** | No | Calling `POST /orders` 5 times creates 5 separate orders |
| **PATCH** | Typically No | No | Increment operations (e.g. `price += 5`) produce different states |

---

# Multiple Choice Questions

### 1. Which of the following endpoints strictly adheres to RESTful resource-oriented naming standards?
A. `POST /api/v1/delete-user/42`
B. `DELETE /api/v1/users/42`
C. `GET /api/v1/fetchSingleUserById?id=42`
D. `POST /api/v1/saveNewProduct`
**Answer:** B
**Explanation:** REST uses HTTP verbs (`DELETE`) paired with plural resource nouns (`/users/42`), avoiding verb actions in the URL path.
---

### 2. Which HTTP status code should be sent when a user submits a valid login token but does NOT have admin privileges to view the page?
A. 401 Unauthorized
B. 403 Forbidden
C. 404 Not Found
D. 500 Internal Server Error
**Answer:** B
**Explanation:** 401 indicates lack of authentication (unrecognized user), whereas 403 Forbidden indicates the user is recognized but lacks authorization for that specific resource.
---

### 3. What does it mean for an HTTP method to be "idempotent"?
A. It executes in less than 10 milliseconds.
B. Multiple identical requests result in the same server resource state as a single request.
C. It requires database encryption.
D. The request payload must be sent in XML format.
**Answer:** B
**Explanation:** Idempotency guarantees that repeating an identical request has no additional side-effects beyond the initial execution.
---

### 4. Why is HTTP POST classified as non-idempotent?
A. POST cannot send JSON.
B. Sending the same POST request multiple times will create multiple duplicate records on the server.
C. POST requires a web socket.
D. POST requests cannot have headers.
**Answer:** B
**Explanation:** Because POST creates new resources, repeating a POST request creates new distinct entities each time.
---

### 5. Why should APIs include a version prefix in their path (e.g., `/api/v1/products`)?
A. It speeds up DNS resolution.
B. It allows developers to introduce breaking changes in `/api/v2/` without breaking legacy mobile and web clients using `/api/v1/`.
C. It is required by the JavaScript ECMAScript standard.
D. It prevents CORS errors.
**Answer:** B
**Explanation:** API versioning guarantees backwards compatibility for deployed client applications when internal schemas evolve.
---
