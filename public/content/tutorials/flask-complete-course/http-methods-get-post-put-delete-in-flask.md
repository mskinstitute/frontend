# Handling HTTP Methods (GET, POST, PUT, DELETE)

HTTP defines a set of request methods (also known as *verbs*) indicating the desired action to be performed on a given resource. By default, `@app.route()` only responds to `GET` requests. To build interactive web forms or REST APIs, routes must explicitly accept methods.

---

## 1. The `methods` Argument in `@app.route`

To allow multiple HTTP verbs on a route, supply a list to the `methods` parameter:

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/v1/articles", methods=["GET", "POST"])
def manage_articles():
    if request.method == "GET":
        # Fetch and return list of articles
        return jsonify([
            {"id": 1, "title": "Flask Fundamentals"},
            {"id": 2, "title": "REST APIs with Python"}
        ]), 200

    elif request.method == "POST":
        # Create a new article from request payload
        data = request.get_json()
        if not data or "title" not in data:
            return jsonify({"error": "Title is required"}), 400
            
        new_article = {"id": 3, "title": data["title"]}
        return jsonify(new_article), 201
```

If a client sends an unsupported method (e.g., `DELETE` to `/api/v1/articles`), Flask automatically responds with an HTTP **405 Method Not Allowed** header containing the allowed verbs.

---

## 2. Separate Route Handlers vs Consolidated Handlers

In RESTful design, you can either handle all methods in one view function using `if request.method == '...'`, or separate them using modern route decorators:

```python
@app.route("/api/v1/articles/<int:article_id>", methods=["GET"])
def get_article(article_id):
    return jsonify({"id": article_id, "title": "Sample Article"})

@app.route("/api/v1/articles/<int:article_id>", methods=["PUT"])
def update_article(article_id):
    data = request.get_json()
    return jsonify({"id": article_id, "updated_title": data.get("title")})

@app.route("/api/v1/articles/<int:article_id>", methods=["DELETE"])
def delete_article(article_id):
    return "", 204
```

---

## 3. Method Semantics Overview

| Method | Idempotent | Safe | Primary Purpose | Common Response Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Yes | Yes | Retrieve representation of a resource without side effects | `200 OK` |
| **POST** | No | No | Submit data to create a new subordinate resource | `201 Created` |
| **PUT** | Yes | No | Replace the entire target resource with payload | `200 OK` / `204 No Content` |
| **PATCH** | No | No | Apply partial modifications to a resource | `200 OK` |
| **DELETE** | Yes | No | Remove the target resource permanently | `204 No Content` |
| **HEAD** | Yes | Yes | Same as GET, but transfers status line and header section only | `200 OK` |
| **OPTIONS**| Yes | Yes | Describe communication options for target resource (CORS preflight) | `204 No Content` |

---

## 4. Automatic HEAD and OPTIONS Handling

Flask handles `HEAD` and `OPTIONS` automatically:
- Whenever you define a `GET` route, Flask automatically adds `HEAD` support. If a `HEAD` request arrives, Flask invokes the route handler, computes headers, but strips the response body before sending.
- Flask automatically generates an `OPTIONS` response listing allowed verbs in the `Allow` HTTP header.

---

## Practice Quiz

### Q1: What HTTP methods are permitted by default when `@app.route('/test')` is defined without the `methods` argument?
- A) `GET` only
- B) `GET` and `POST`
- C) `ALL` standard HTTP methods
- D) `POST` only
**Answer:** A
**Explanation:** If the `methods` argument is omitted, Flask configures the route to respond strictly to `GET` (and automatically handles `HEAD`).

### Q2: What status code does Flask return if a client sends an HTTP `DELETE` request to a route configured with `methods=['GET', 'POST']`?
- A) `400 Bad Request`
- B) `403 Forbidden`
- C) `404 Not Found`
- D) `405 Method Not Allowed`
**Answer:** D
**Explanation:** An HTTP 405 Method Not Allowed is automatically returned when the URL exists but the requested HTTP verb is not registered in the route's `methods` list.

### Q3: What is meant by an "idempotent" HTTP method?
- A) The method runs faster on multi-core processors
- B) Making multiple identical requests produces the same server state as making a single request
- C) The method can only be executed by administrators
- D) The method encrypts data in transit
**Answer:** B
**Explanation:** An HTTP method is idempotent if executing it once has the exact same side-effect on the server as executing it multiple times sequentially (e.g. GET, PUT, DELETE).

### Q4: Which HTTP status code should be returned after successfully creating a new record via POST?
- A) `200 OK`
- B) `201 Created`
- C) `202 Accepted`
- D) `204 No Content`
**Answer:** B
**Explanation:** Standard REST conventions specify `201 Created` when an HTTP POST request successfully persists a new entity on the server.

### Q5: How does Flask inspect the incoming request verb inside a view function?
- A) `request.verb`
- B) `request.method`
- C) `request.http_type`
- D) `request.action`
**Answer:** B
**Explanation:** The `request.method` property returns the uppercase HTTP method string (e.g., `'GET'`, `'POST'`, `'PUT'`).
