# MVC Architecture: Splitting Routes, Controllers & Service Layers

In beginner tutorials, developers often stuff database queries, business logic, validation, and responses into a single massive `app.get()` callback. In production enterprise applications, this leads to an unmaintainable "spaghetti codebase". Professional Node.js engineering adopts the **MVC (Model-View-Controller) / Service-Layer Architecture**.

---

## 1. The Separation of Concerns Pattern

1. **Routes (`routes/`):** Define endpoints, match HTTP verbs, and apply route-specific middleware (guards). No business logic.
2. **Controllers (`controllers/`):** Parse HTTP inputs (`req.body`, `req.params`), call the appropriate service methods, and format the HTTP response.
3. **Services (`services/`):** Pure business logic (tax calculations, calling third-party APIs, orchestrating multi-step workflows). Independent of Express `req`/`res`.
4. **Models (`models/`):** Database schemas, queries, and data persistence contracts (Mongoose, Prisma, TypeORM).

```text
HTTP Request ---> Route ---> Controller ---> Service ---> Model (Database)
                                  |              |
HTTP Response <-------------------+ (res.json)  |
```

---

## 2. Real-World Implementation

### 1. The Route: `src/routes/product.routes.js`
```javascript
import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', requireAuth, productController.createProduct);

export default router;
```

### 2. The Controller: `src/controllers/product.controller.js`
```javascript
import * as productService from '../services/product.service.js';

export async function getAllProducts(req, res, next) {
  try {
    const { category, page } = req.query;
    const products = await productService.getFilteredProducts({ category, page });
    res.status(200).json({ status: 'success', data: products });
  } catch (error) {
    next(error); // Forward to global error handler
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.createNewProduct(req.body, req.user.id);
    res.status(201).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
}
```

### 3. The Service: `src/services/product.service.js`
```javascript
import Product from '../models/product.model.js';

export async function createNewProduct(payload, creatorId) {
  // Business logic: enforce SKU uniqueness, check category limits
  const existing = await Product.findOne({ sku: payload.sku });
  if (existing) {
    const err = new Error('A product with this SKU already exists');
    err.statusCode = 409;
    throw err;
  }

  return await Product.create({ ...payload, createdBy: creatorId });
}
```

---

# Multiple Choice Questions

### 1. What is the primary responsibility of a Controller in an Express MVC architecture?
A. Defining CSS styles for React components.
B. Handling the HTTP request and response: extracting parameters, invoking service logic, and returning HTTP status codes and JSON data.
C. Connecting directly to the raw TCP network socket.
D. Compiling TypeScript into WebAssembly.
**Answer:** B
**Explanation:** Controllers act as intermediaries between HTTP transport (req/res) and internal business logic, delegating actual domain operations to services.
---

### 2. Why should business logic and database queries NOT be placed directly inside Express route definition files?
A. Express routes run 10x slower if they contain more than 5 lines of code.
B. It couples HTTP transport tightly with business logic, making code impossible to unit test and reuse across CLI tools or background workers.
C. Route files cannot import NPM modules.
D. Route files are deleted upon build.
**Answer:** B
**Explanation:** Decoupling business logic into dedicated service layers allows functions to be unit tested in isolation without mocking Express `req` and `res` objects.
---

### 3. In the 3-tier architecture (Route -> Controller -> Service), what does the Service layer interact with?
A. Only the browser DOM.
B. The Data Access / Model layer and external third-party APIs.
C. The Express routing table.
D. The client CSS stylesheets.
**Answer:** B
**Explanation:** The Service layer orchestrates business logic and interacts directly with database models and external integrations.
---

### 4. How should an error occurring inside a controller be passed to the centralized error-handling middleware?
A. `throw window.alert(error)`
B. `next(error)`
C. `res.send(error.stack)`
D. `process.exit(1)`
**Answer:** B
**Explanation:** Passing an error argument to Express's `next(error)` invokes the registered error-handling middleware pipeline.
---

### 5. What is the benefit of keeping Service functions free of `req` and `res` objects?
A. They can be triggered by WebSockets, CRON jobs, or CLI scripts without needing fake HTTP mocks.
B. They consume zero RAM.
C. They bypass Node.js garbage collection.
D. It prevents Git merge conflicts.
**Answer:** A
**Explanation:** If services only accept plain JavaScript arguments (e.g. `productId, userId`) rather than `req`, they can be invoked from any context (CRON jobs, queues, CLI).
---
