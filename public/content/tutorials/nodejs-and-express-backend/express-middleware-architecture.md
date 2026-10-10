# Middleware Pipeline: Application-Level, Router-Level & Third-Party

Middleware functions are the fundamental building blocks of an Express.js backend. In Express, everything from parsing request bodies and authenticating sessions to logging traffic and handling CORS is executed through a **pipeline of middleware functions**.

---

## 1. What is Middleware?

A middleware function has access to the Request object (`req`), the Response object (`res`), and the `next` function in the application’s request-response cycle.

```text
Request ---> [ Middleware 1 (Logger) ] ---> [ Middleware 2 (Auth) ] ---> [ Route Handler ] ---> Response
```

A middleware function must either:
1. End the request-response cycle by sending a response (`res.send()`, `res.json()`), OR
2. Call `next()` to pass control to the subsequent middleware function in the stack.

```javascript
// A simple custom logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next(); // MUST call next() to prevent the request from hanging!
};
```

---

## 2. The 5 Types of Middleware in Express

### 1. Application-Level Middleware
Bound directly to the `app` instance using `app.use()` or `app.METHOD()`. Runs on every matching path across the entire application:
```javascript
app.use(express.json());
app.use(requestLogger);
```

### 2. Router-Level Middleware
Bound to an instance of `express.Router()`. Perfect for modular route scoping (e.g. protecting all admin routes):
```javascript
const adminRouter = express.Router();

adminRouter.use((req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
});

adminRouter.get('/dashboard', (req, res) => res.json({ stats: 'admin data' }));
app.use('/admin', adminRouter);
```

### 3. Built-In Middleware
Included natively in Express (`express.json()`, `express.urlencoded()`, `express.static('public')`).

### 4. Third-Party Middleware
Installed from NPM (`cors`, `helmet`, `morgan`, `cookie-parser`).

### 5. Error-Handling Middleware
Special middleware defined with **4 arguments**: `(err, req, res, next)`.

---

# Multiple Choice Questions

### 1. What happens if a middleware function fails to send a response and also forgets to call `next()`?
A. Express throws an immediate syntax error.
B. The client request hangs indefinitely until the browser or client socket times out.
C. The request automatically redirects to `/home`.
D. The server process restarts.
**Answer:** B
**Explanation:** If middleware neither sends a response nor calls `next()`, the execution pipeline stalls and the client connection hangs until timeout.
---

### 2. How does Express distinguish an Error-Handling middleware from regular application middleware?
A. Error middleware must be defined inside an `error.js` file.
B. Error-handling middleware accepts exactly 4 parameters: `(err, req, res, next)`.
C. Error middleware uses `app.catch()` instead of `app.use()`.
D. Error middleware requires a TypeScript decorator.
**Answer:** B
**Explanation:** Express inspects the function's parameter length (`fn.length === 4`); functions with four parameters `(err, req, res, next)` are treated as error handlers.
---

### 3. Which built-in middleware serves static assets like images, CSS, and client-side JavaScript bundles directly from a directory?
A. `express.files()`
B. `express.static()`
C. `express.serve()`
D. `express.assets()`
**Answer:** B
**Explanation:** `express.static(root, [options])` is the built-in middleware for serving static files from a specified folder.
---

### 4. What is the execution order of middleware in an Express application?
A. In reverse alphabetical order of function names.
B. In the exact top-to-bottom order in which they are declared using `app.use()`.
C. Simultaneously on parallel worker threads.
D. Randomly based on CPU load.
**Answer:** B
**Explanation:** Express executes middleware sequentially in the exact order they are registered via `app.use()` and route handlers.
---

### 5. Why should global middleware like `express.json()` and logging be registered near the very top of `app.js`?
A. Because Node.js cannot read bottom lines of code.
B. To ensure they process incoming requests before the requests reach specific route handlers.
C. To prevent CSS from overriding JavaScript.
D. Express will not start otherwise.
**Answer:** B
**Explanation:** Because middleware runs sequentially, request body parsers and loggers must be registered before the route handlers that depend on them.
---
