# Building JSON APIs with jsonify & Status Codes

Modern web and mobile architectures frequently separate the backend from the frontend: Flask serves as a stateless **RESTful API**, communicating with Next.js, React, or mobile clients via **JSON**.

Flask provides built-in utilities—primarily **`jsonify()`**—to construct robust API contracts adhering to RFC standards.

---

## 1. Understanding `jsonify()` vs `json.dumps()`

Python includes a standard `json` library, but you should **always use Flask's `jsonify()`** when building web APIs:

| Feature | Standard `json.dumps()` | Flask `jsonify()` |
| :--- | :--- | :--- |
| **Output Type** | Plain Python string | Fully formed `Response` object |
| **Header** | `Content-Type: text/html` (default) | `Content-Type: application/json` |
| **Status Code** | Requires manual wrapping | Supports tuple syntax: `jsonify(...), 201` |
| **Order Preservation** | May reorder keys | Respects JSON serialization configurations |

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/api/v1/health")
def health_check():
    return jsonify({
        "status": "healthy",
        "uptime_seconds": 3600,
        "database": "connected"
    }), 200
```

---

## 2. Standardizing API Response Envelopes

Enterprise APIs should adopt a consistent JSON response envelope for both success and error states:

```python
def api_response(data=None, message="Success", status_code=200, error=None):
    payload = {
        "success": error is None,
        "message": message,
        "data": data,
        "error": error
    }
    return jsonify(payload), status_code
```

### Usage Examples:
```python
@app.route("/api/v1/students/<int:student_id>")
def get_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return api_response(
            message="Resource not found",
            error={"code": "STUDENT_NOT_FOUND", "id": student_id},
            status_code=404
        )
        
    return api_response(
        data={"id": student.id, "name": student.name, "email": student.email},
        status_code=200
    )
```

---

## 3. Parsing Incoming JSON Data

Always validate incoming payloads when processing `POST`, `PUT`, or `PATCH` requests:

```python
@app.route("/api/v1/students", methods=["POST"])
def create_student():
    # 1. Verify JSON Content-Type
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    # 2. Extract JSON payload
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Malformed or empty JSON body"}), 400

    # 3. Validate required fields
    required_fields = ["name", "email"]
    missing = [f for f in required_fields if f not in data or not str(data[f]).strip()]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 422

    # 4. Persist
    new_student = Student(name=data["name"], email=data["email"])
    db.session.add(new_student)
    db.session.commit()

    return jsonify({"id": new_student.id, "name": new_student.name}), 201
```

---

## 4. HTTP Status Code Best Practices for APIs

- `200 OK`: Successful GET, PUT, or PATCH.
- `201 Created`: Successful POST that created a new database entity.
- `204 No Content`: Successful DELETE operation (no response body).
- `400 Bad Request`: Malformed syntax (e.g. invalid JSON).
- `401 Unauthorized`: Client lacks valid authentication credentials.
- `403 Forbidden`: Client is authenticated but lacks required permission.
- `404 Not Found`: Target resource URI does not exist.
- `415 Unsupported Media Type`: Client failed to send `Content-Type: application/json`.
- `422 Unprocessable Entity`: Valid JSON, but fails business validation rules (e.g. password too short).

---

## Practice Quiz

### Q1: What HTTP response header is automatically set when returning `jsonify(...)`?
- A) `Content-Type: text/plain`
- B) `Content-Type: application/json`
- C) `Content-Type: application/x-javascript`
- D) `Content-Type: text/html`
**Answer:** B
**Explanation:** `jsonify()` constructs a WSGI response object with the standard `Content-Type: application/json` header.

### Q2: What status code should be returned when a client sends XML to an endpoint that strictly expects JSON?
- A) `200 OK`
- B) `415 Unsupported Media Type`
- C) `500 Internal Server Error`
- D) `404 Not Found`
**Answer:** B
**Explanation:** HTTP `415 Unsupported Media Type` informs the client that the server refuses the payload's `Content-Type`.

### Q3: What property on the Flask `request` object checks if the incoming request has an `application/json` Content-Type?
- A) `request.has_json`
- B) `request.is_json`
- C) `request.json_valid`
- D) `request.type == 'json'`
**Answer:** B
**Explanation:** `request.is_json` returns `True` if the request's `Content-Type` header indicates JSON data (`application/json` or `application/*+json`).

### Q4: When a resource is successfully deleted in a RESTful API, what status code is standard when returning an empty body?
- A) `200 OK`
- B) `204 No Content`
- C) `201 Created`
- D) `410 Gone`
**Answer:** B
**Explanation:** HTTP 204 No Content signifies that the action succeeded and there is no additional payload in the response body.

### Q5: What status code is appropriate when a JSON payload is well-formed, but a field fails business logic (e.g. negative age value)?
- A) `404 Not Found`
- B) `422 Unprocessable Entity`
- C) `502 Bad Gateway`
- D) `401 Unauthorized`
**Answer:** B
**Explanation:** HTTP 422 Unprocessable Entity indicates that the server understands the content type and syntax, but semantic instructions fail business validation.
