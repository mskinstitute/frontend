# Route Parameters, Query Strings & Request Body Parsing

Client applications transmit data to backend APIs through three primary channels: **Route Parameters** (identifying specific entities in the URL path), **Query Strings** (filtering, pagination, and sorting parameters), and the **Request Body** (structured JSON payloads).

---

## 1. Route Parameters (`req.params`)

Route parameters are named URL segments used to capture values at specified positions in the URL path. They are defined using a colon `:` prefix:

```javascript
import express from 'express';
const app = express();

// Single parameter: /api/users/42
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id; // "42" (string type)
  res.json({ id: userId });
});

// Multiple parameters: /api/courses/react-101/reviews/99
app.get('/api/courses/:courseSlug/reviews/:reviewId', (req, res) => {
  const { courseSlug, reviewId } = req.params;
  res.json({ courseSlug, reviewId });
});
```

*Note: All values in `req.params` are initially strings. Convert them with `Number(req.params.id)` or `parseInt()` when querying numeric database IDs.*

---

## 2. Query Strings (`req.query`)

Query strings follow the `?` character in a URL and are separated by `&`. They are commonly used for filtering, pagination, and searching:

```text
GET /api/products?category=electronics&minPrice=100&sort=asc&page=2
```

Express parses query strings automatically into the `req.query` object:

```javascript
app.get('/api/products', (req, res) => {
  const { category, minPrice, sort, page = 1, limit = 20 } = req.query;

  console.log('Category filter:', category);
  console.log('Minimum price:', minPrice);
  console.log('Page number:', page);

  res.json({
    filters: { category, minPrice: Number(minPrice) },
    pagination: { page: Number(page), limit: Number(limit) }
  });
});
```

---

## 3. Request Body (`req.body`)

The request body carries large, structured payloads (JSON, form data) typically in POST, PUT, or PATCH requests. In Express, you MUST register body-parsing middleware before accessing `req.body`:

```javascript
// Parse application/json
app.use(express.json({ limit: '1mb' }));

// Parse application/x-www-form-urlencoded (HTML form submissions)
app.use(express.urlencoded({ extended: true }));

app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, paymentToken } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  res.status(201).json({
    orderId: 'ord_12345',
    status: 'CONFIRMED',
    totalItems: items.length
  });
});
```

---

# Multiple Choice Questions

### 1. Given the route definition `app.get('/articles/:category/:id')`, what will `req.params` contain when a client accesses `/articles/tech/55`?
A. `{ category: 'articles', id: 'tech' }`
B. `{ category: 'tech', id: '55' }`
C. `['tech', 55]`
D. `{ query: '55' }`
**Answer:** B
**Explanation:** Express maps the captured path segments to the keys specified in the route pattern: `category` receives `'tech'` and `id` receives `'55'`.
---

### 2. In an incoming URL `/api/search?q=nodejs&sort=desc`, how do you access the search term `nodejs` in an Express handler?
A. `req.params.q`
B. `req.query.q`
C. `req.body.q`
D. `req.headers.q`
**Answer:** B
**Explanation:** Query parameters following the `?` character in the URL are parsed into the `req.query` object.
---

### 3. What will `req.body` evaluate to if a client sends a JSON payload to an Express app that has NOT registered `app.use(express.json())`?
A. It throws a syntax error on the client.
B. It will be `undefined`.
C. It will automatically convert to an empty array.
D. It prints a warning to the console and exits.
**Answer:** B
**Explanation:** Without `express.json()` middleware configured, Express does not parse the incoming request body stream, leaving `req.body` as `undefined`.
---

### 4. What is the data type of `req.params.id` in the route `/users/:id` when the user requests `/users/100`?
A. Number
B. String
C. BigInt
D. Boolean
**Answer:** B
**Explanation:** All route parameters extracted from URL strings are of type String (`"100"`) and must be cast to numbers manually if required.
---

### 5. Why should you configure `{ limit: '1mb' }` in `express.json({ limit: '1mb' })`?
A. To speed up the internet connection.
B. To protect the server against Denial of Service (DoS) attacks by rejecting excessively large JSON payloads.
C. Because Express cannot support files larger than 1MB.
D. To comply with JavaScript array length limits.
**Answer:** B
**Explanation:** Setting a reasonable body payload limit prevents attackers from overwhelming server memory with massive megabyte or gigabyte JSON payloads.
---
