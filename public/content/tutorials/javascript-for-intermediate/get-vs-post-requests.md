# GET vs POST Requests in Modern JavaScript

In RESTful architecture, HTTP methods specify the desired action to be performed on a given resource. The two most widely used verbs are **GET** (retrieving data) and **POST** (creating or submitting data). Understanding their semantics, payload structures, and headers is fundamental for API integration.

---

## 1. Comparing GET and POST

| Feature | GET Request | POST Request |
| :--- | :--- | :--- |
| **Primary Purpose** | Retrieve data from server | Submit data to server to create/process resource |
| **Idempotent?** | Yes (Repeating request produces identical state) | No (Repeating request may create duplicates) |
| **Request Body** | No body (Forbidden or ignored by spec) | Contains data payload (JSON, FormData, etc.) |
| **Data Parameters** | Encoded in URL Query String (`?search=shoes&page=2`) | Encoded inside HTTP request body |
| **Caching** | Browser & CDN cacheable | Not cached by default |
| **Sensitive Data** | NEVER (URLs appear in logs, history, referrer) | Yes (Encrypted inside HTTPS body) |

---

## 2. Implementing GET Requests with URLSearchParams

GET requests pass parameters through the URL query string:

```javascript
async function searchProducts(query, category, page = 1) {
  // Use URL and URLSearchParams to encode query strings safely
  const url = new URL('https://api.example.com/v1/products');
  url.search = new URLSearchParams({
    q: query,
    cat: category,
    page: page.toString()
  }).toString();

  console.log('Final URL:', url.href);
  // https://api.example.com/v1/products?q=shoes&cat=footwear&page=1

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  return await response.json();
}
```

---

## 3. Implementing POST Requests with JSON Payloads

POST requests send data inside the request `body`. You **must** specify `Content-Type: application/json` and serialize the JavaScript object using `JSON.stringify()`:

```javascript
async function createNewArticle(articleData) {
  const response = await fetch('https://api.example.com/v1/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Informs server payload is JSON!
      'Authorization': 'Bearer YOUR_AUTH_TOKEN'
    },
    body: JSON.stringify(articleData) // Must be a serialized string!
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Failed to create article');
  }

  const createdResource = await response.json();
  console.log('Created Article ID:', createdResource.id);
  return createdResource;
}
```

```
Client App                                 Backend Server
    │                                             │
    │  POST /api/v1/articles                      │
    │  Headers: Content-Type: application/json    │
    │  Body: {"title": "Mastering JS"}            │
    ├────────────────────────────────────────────►│ Creates DB Record
    │                                             │ Generates ID: 492
    │  HTTP 201 Created                           │
    │  Body: {"id": 492, "title": "Mastering JS"} │
    │◄────────────────────────────────────────────┤
```

---

## 4. Submitting Files & Forms via POST: FormData

When uploading images or multipart files, omit the manual `Content-Type` header; the browser will automatically supply `multipart/form-data` with the proper cryptographic boundary!

```javascript
async function uploadUserProfile(avatarFile, bioText) {
  const formData = new FormData();
  formData.append('avatar', avatarFile);
  formData.append('bio', bioText);

  const response = await fetch('/api/profile/upload', {
    method: 'POST',
    // DO NOT set Content-Type header! Browser generates boundary automatically.
    body: formData
  });

  return await response.json();
}
```

---

## 5. Other Common REST Verbs Overview

- `PUT`: Completely replaces an existing resource.
- `PATCH`: Partially updates specific fields of an existing resource.
- `DELETE`: Removes a resource from the server.

---

## Practice Quiz

### Q1: Why should sensitive information like passwords NEVER be sent via a GET request?
- A) GET requests do not support HTTPS encryption
- B) URL parameters appear in browser history, server access logs, and HTTP Referer headers
- C) GET requests are limited to 10 characters
- D) GET requests automatically hash all strings
**Answer:** B
**Explanation:** Query parameters attached to GET URLs are stored in browser history, proxy server logs, and analytics tools, exposing sensitive credentials.

### Q2: What header must be included when sending a JSON string in a POST request body?
- A) Accept-Encoding: gzip
- B) Content-Type: application/json
- C) X-Requested-With: XMLHttpRequest
- D) Connection: keep-alive
**Answer:** B
**Explanation:** `Content-Type: application/json` tells the backend server's body parser to deserialize the raw incoming byte stream as JSON.

### Q3: What function converts a JavaScript object into a JSON string for a POST request body?
- A) JSON.parse(obj)
- B) JSON.stringify(obj)
- C) obj.toJSONString()
- D) Array.from(obj)
**Answer:** B
**Explanation:** `JSON.stringify(obj)` serializes a native JavaScript object or array into a valid JSON string.

### Q4: What HTTP status code is standard for a successfully created resource following a POST request?
- A) 200 OK
- B) 201 Created
- C) 204 No Content
- D) 301 Moved Permanently
**Answer:** B
**Explanation:** HTTP `201 Created` is the standard REST status code confirming that a new resource was successfully created on the server.

### Q5: Why should you NOT manually set Content-Type: multipart/form-data when using FormData?
- A) Modern servers do not accept multipart data
- B) The browser must automatically generate the unique boundary string parameter in the Content-Type header
- C) FormData is deprecated
- D) Fetch will throw a TypeError
**Answer:** B
**Explanation:** When passing a `FormData` instance to `fetch()`, the browser sets the header automatically, including the critical `boundary` string required to separate file segments.
