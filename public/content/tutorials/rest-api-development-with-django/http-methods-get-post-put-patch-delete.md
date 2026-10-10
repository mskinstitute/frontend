# HTTP Methods: GET, POST, PUT, PATCH, DELETE

The HTTP protocol defines a set of request methods to indicate the desired action to be performed on a given resource. Designing professional REST APIs requires strict adherence to method semantics, **idempotency**, and **safety**.

---

## 1. HTTP Methods Comparison Matrix

| Method | CRUD Action | Safe? | Idempotent? | Request Body Allowed? | Standard Success Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`GET`** | Read / Retrieve | **Yes** | **Yes** | No | `200 OK` |
| **`POST`** | Create / Action | No | No | Yes | `201 Created` |
| **`PUT`** | Replace / Overwrite | No | **Yes** | Yes | `200 OK` or `204 No Content` |
| **`PATCH`** | Partial Update | No | No (Technically) | Yes | `200 OK` |
| **`DELETE`**| Destroy / Remove | No | **Yes** | Optional (Rare) | `204 No Content` |

---

## 2. Safe vs Idempotent Methods

- **Safe Methods:** Calling the method **never modifies server-side resource state**. `GET`, `HEAD`, and `OPTIONS` are safe (read-only).
- **Idempotent Methods:** Making the exact same request once produces the exact same server-side outcome as making it 100 times. `GET`, `PUT`, `DELETE`, `HEAD`, and `OPTIONS` are idempotent.

```
Idempotence Example (PUT vs POST):
POST /orders/  ──► Executes 5 times  ──► Creates 5 separate order records! (NOT IDEMPOTENT)
PUT  /users/4/ ──► Executes 5 times  ──► Replaces user 4 with identical data (IDEMPOTENT)
DELETE /orders/9 ──► Executes 5 times ──► Order 9 is gone after run 1; remaining runs do nothing (IDEMPOTENT)
```

---

## 3. The `PUT` vs `PATCH` Distinction

A frequent source of API design errors is confusing `PUT` and `PATCH`:

### `PUT` (Full Resource Replacement):
`PUT` replaces the entire target resource representation. Any existing fields omitted from the payload are reset to default values or set to `null`!

```json
// Original resource on server:
// { "id": 1, "name": "Alice", "role": "admin", "bio": "Senior Architect" }

// Client sends PUT with only name:
// PUT /users/1/  { "name": "Alicia" }

// Result on server:
// { "id": 1, "name": "Alicia", "role": null, "bio": null }  <-- Omitted fields wiped!
```

### `PATCH` (Partial Modification):
`PATCH` applies partial delta updates. Only the provided keys are mutated; unmentioned fields remain unchanged:

```json
// Client sends PATCH:
// PATCH /users/1/  { "name": "Alicia" }

// Result on server:
// { "id": 1, "name": "Alicia", "role": "admin", "bio": "Senior Architect" }  <-- Preserved!
```

---

## 4. Method Handling in Django REST Framework

DRF simplifies method routing in APIViews:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ProductAPIView(APIView):
    def get(self, request, pk):
        # Safe & Idempotent Read
        return Response({"id": pk, "name": "Cloud Server"})

    def put(self, request, pk):
        # Complete overwrite
        return Response({"status": "Product overwritten completely"})

    def patch(self, request, pk):
        # Partial update
        return Response({"status": "Product attributes patched"})

    def delete(self, request, pk):
        # Idempotent deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
```

---

## Practice Quiz

### Q1: What does it mean for an HTTP method to be "idempotent"?
- A) The method runs in constant O(1) time
- B) Making multiple identical requests produces the identical server state as making a single request
- C) The method requires an SSL certificate
- D) The response is encrypted
**Answer:** B
**Explanation:** An idempotent HTTP method guarantees that multiple duplicate requests result in the same server state as a single request (e.g. PUT, DELETE).

### Q2: What is the critical difference between PUT and PATCH?
- A) PUT is for creating; PATCH is for reading
- B) PUT completely replaces the target resource (wiping omitted fields), while PATCH applies partial modifications strictly to the specified fields
- C) PATCH only works with JSON
- D) PUT cannot be used on mobile devices
**Answer:** B
**Explanation:** PUT replaces the entire resource representation, whereas PATCH mutates only the specific fields sent in the request body.

### Q3: What standard HTTP status code should be returned upon successful creation of a resource via POST?
- A) 200 OK
- B) 201 Created
- C) 204 No Content
- D) 202 Accepted
**Answer:** B
**Explanation:** HTTP 201 Created explicitly confirms that the request succeeded and resulted in the creation of a new server resource.

### Q4: Which of the following HTTP methods is considered "safe" (read-only)?
- A) POST
- B) DELETE
- C) GET
- D) PATCH
**Answer:** C
**Explanation:** GET is defined by the HTTP specification as a safe method that retrieves representations without altering the server-side state.

### Q5: What standard HTTP status code should a DELETE endpoint return when deletion succeeds and no response body is returned?
- A) 200 OK
- B) 204 No Content
- C) 404 Not Found
- D) 301 Moved Permanently
**Answer:** B
**Explanation:** HTTP 204 No Content signals that the server successfully fulfilled the request and there is no additional content to send in the response payload.
