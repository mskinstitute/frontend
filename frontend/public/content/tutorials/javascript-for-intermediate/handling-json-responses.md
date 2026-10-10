# Handling JSON Responses in Modern JavaScript

JavaScript Object Notation (JSON) is the universal data interchange format of modern web services. When receiving responses via the Fetch API, reading and parsing JSON safely requires understanding response body streams and error handling.

---

## 1. The response.json() Method

The HTTP response body returned by `fetch()` is a readable stream. To parse this stream into a native JavaScript object, invoke `response.json()`:

```javascript
async function loadUserData() {
  const response = await fetch('https://api.github.com/users/octocat');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  // response.json() reads the stream to completion and parses JSON
  const userData = await response.json();
  
  console.log('Username:', userData.login);
  console.log('Public Repositories:', userData.public_repos);
}
```

```
Network Payload (Raw String) ──► ReadableStream ──► response.json() ──► Native JS Object
```

---

## 2. Response Body Streams Can Only Be Read ONCE!

A crucial architectural detail of the Fetch API is that **the body stream can only be consumed once**. Attempting to read it a second time throws a `TypeError`:

```javascript
const response = await fetch('/api/data');

const json = await response.json(); // Consumed the stream!
// const text = await response.text(); // ERROR: TypeError: Failed to execute 'text' on 'Response': body stream already read!
```

### The Solution: Cloning the Response

If you need to read the body multiple times (for example, for logging and parsing):

```javascript
const response = await fetch('/api/data');
const clonedResponse = response.clone(); // Clones the stream before reading

const textDebug = await clonedResponse.text();
const jsonData = await response.json();
```

---

## 3. Safe Parsing: Handling Malformed JSON & Non-JSON Responses

If a server crashes and returns an HTML error page (e.g., `502 Bad Gateway` from Nginx) instead of JSON, `response.json()` will throw a `SyntaxError: Unexpected token < in JSON`.

```javascript
async function safeFetchJson(url) {
  const response = await fetch(url);
  
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const rawText = await response.text();
    throw new Error(`Expected JSON but received: ${contentType}. Content: ${rawText.slice(0, 100)}`);
  }

  try {
    return await response.json();
  } catch (parseError) {
    throw new Error(`Failed to parse JSON payload: ${parseError.message}`);
  }
}
```

---

## 4. Other Response Parsing Methods

Depending on the API format, `Response` provides multiple stream consumers:

| Method | Decodes As | Typical Media Types |
| :--- | :--- | :--- |
| `response.json()` | JavaScript Object / Array | `application/json` |
| `response.text()` | UTF-8 String | `text/plain`, `text/html`, `text/csv` |
| `response.blob()` | Binary Large Object | Images (`image/png`), PDFs, Audio files |
| `response.formData()`| `FormData` Object | `multipart/form-data` |
| `response.arrayBuffer()`| Raw Binary Buffer | WebAssembly `.wasm`, low-level byte manipulation |

---

## Practice Quiz

### Q1: What does response.json() return?
- A) A synchronous JavaScript object
- B) A Promise that resolves to the parsed JavaScript object
- C) A JSON formatted string
- D) An ArrayBuffer
**Answer:** B
**Explanation:** Because the response body is streamed asynchronously over the network, `response.json()` returns a Promise that resolves once the stream is read and parsed.

### Q2: What happens if you call both response.json() and response.text() on the same Response instance without cloning?
- A) Both execute normally
- B) The second call throws a TypeError: body stream already read
- C) The browser re-fetches the URL automatically
- D) The second call returns null
**Answer:** B
**Explanation:** HTTP response streams can only be read once. Attempting to consume a body stream that has already been read throws a `TypeError`.

### Q3: Why does calling response.json() sometimes throw SyntaxError: Unexpected token '<'?
- A) The JSON contains an arrow function
- B) The server returned an HTML page (like a 404/500 error page) instead of valid JSON
- C) The JSON is encrypted
- D) The browser does not support JSON
**Answer:** B
**Explanation:** When servers encounter fatal errors (502/504), proxy servers like Nginx often return HTML error pages starting with `<!DOCTYPE html>`. The JSON parser encounters `<` and throws a SyntaxError.

### Q4: Which method should you use on a Response object to download and display an image file?
- A) response.image()
- B) response.blob()
- C) response.binary()
- D) response.canvas()
**Answer:** B
**Explanation:** `response.blob()` parses the response body into an immutable Binary Large Object, which can then be converted to a URL via `URL.createObjectURL()`.

### Q5: How can you check if the server declared the response payload as JSON?
- A) response.isJson()
- B) response.headers.get('content-type')?.includes('application/json')
- C) response.type === 'json'
- D) JSON.valid(response)
**Answer:** B
**Explanation:** Inspecting the `content-type` response header ensures the server sent the standard MIME type `application/json`.
