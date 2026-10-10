# Express Application Initialization, Routing & Request/Response Objects

The core workflow of any Express application revolves around three pillars: initializing the **application instance**, registering **routes** mapped to HTTP verbs, and manipulating the **Request (`req`)** and **Response (`res`)** objects.

---

## 1. Application Initialization and Server Lifecycle

An Express application begins by invoking the top-level `express()` function exported by the module:

```javascript
import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

// Register routes here...

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Graceful Shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed cleanly');
  });
});
```

---

## 2. HTTP Verb Routing Methods

Express supports all standard HTTP verbs:

```javascript
// GET: Retrieve resource
app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});

// POST: Create resource
app.post('/api/products', (req, res) => {
  res.status(201).json({ message: 'Product created' });
});

// PUT: Replace entire resource
app.put('/api/products/:id', (req, res) => {
  res.json({ message: `Product ${req.params.id} fully updated` });
});

// PATCH: Partial update of resource
app.patch('/api/products/:id', (req, res) => {
  res.json({ message: `Product ${req.params.id} partially modified` });
});

// DELETE: Remove resource
app.delete('/api/products/:id', (req, res) => {
  res.status(204).send(); // 204 No Content
});
```

---

## 3. The `req` and `res` Ecosystem

Express decorates the native Node.js request and response objects with convenient helper properties and methods:

### Key `req` Properties
- `req.method`: The HTTP verb (GET, POST, etc.)
- `req.path`: The path part of the request URL (e.g., `/api/users`)
- `req.ip`: Client IP address
- `req.headers`: Key-value map of incoming HTTP headers
- `req.get(headerName)`: Case-insensitive header lookup (e.g., `req.get('Authorization')`)

### Key `res` Methods
- `res.status(code)`: Sets the HTTP status code (chainable)
- `res.json(data)`: Sends JSON response with appropriate headers
- `res.send(body)`: Sends generic HTTP body (HTML, string, or Buffer)
- `res.sendStatus(code)`: Sets status code and sends its text representation (e.g., `res.sendStatus(404)` sends "Not Found")
- `res.redirect(url)`: Performs HTTP 302/301 redirection
- `res.set(field, value)`: Sets an outgoing HTTP header

---

# Multiple Choice Questions

### 1. Which HTTP status code should be returned when a new resource is successfully created via a POST request?
A. 200 OK
B. 201 Created
C. 204 No Content
D. 304 Not Modified
**Answer:** B
**Explanation:** HTTP 201 Created signifies that the request succeeded and resulted in the creation of a new resource.
---

### 2. What is the fundamental difference between HTTP PUT and HTTP PATCH methods in RESTful API design?
A. PUT is only used for images; PATCH is used for text.
B. PUT replaces the target resource entirely with the request payload, whereas PATCH applies a partial update to specific fields.
C. PATCH is not supported in modern browsers.
D. PUT never accepts a request body.
**Answer:** B
**Explanation:** In RESTful standards, PUT replaces the complete existing entity, while PATCH modifies only the specified attributes of the entity.
---

### 3. Which method on the Express `res` object sets the HTTP response code and returns the response in a chainable manner?
A. `res.header()`
B. `res.status()`
C. `res.writeCode()`
D. `res.statusCode()`
**Answer:** B
**Explanation:** `res.status(code)` sets the HTTP response code and returns the response object, allowing chaining such as `res.status(200).json(...)`.
---

### 4. How can you retrieve the value of the `Authorization` header safely regardless of whether the client sent it in upper or lowercase?
A. `req.headers.authorization_UPPER`
B. `req.get('Authorization')`
C. `req.rawHeaders[0]`
D. `req.findHeader('Auth')`
**Answer:** B
**Explanation:** `req.get(headerName)` performs a case-insensitive header lookup on the incoming request.
---

### 5. What does `res.status(204).send()` communicate to the client?
A. The server crashed.
B. Bad Request error.
C. The request succeeded, but there is intentionally no response body to return (No Content).
D. The client must redirect to another page.
**Answer:** C
**Explanation:** HTTP 204 indicates success where the server deliberately returns no content in the response body (frequently used for DELETE actions).
---
