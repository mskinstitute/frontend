# Fetching Data from APIs in Modern JavaScript

Modern web applications communicate with backend servers and cloud microservices through RESTful APIs and GraphQL endpoints. The modern standard for performing HTTP network requests in browsers and modern Node.js runtimes is the **Fetch API**.

---

## 1. Anatomy of the Fetch API

The `fetch()` global function initiates an HTTP request and returns a Promise that resolves to a `Response` object representing the response to the request.

```javascript
async function loadUserData(userId) {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  
  const response = await fetch(url);
  console.log('Response Status:', response.status); // e.g. 200, 404, 500
  console.log('Status Text:', response.statusText); // e.g. "OK", "Not Found"
  console.log('Headers:', response.headers.get('content-type'));
}
```

---

## 2. The Critical "Gotcha": fetch() Only Rejects on Network Failures!

Unlike legacy libraries like Axios, **`fetch()` will NOT reject its Promise on HTTP error status codes (like 404 Not Found or 500 Internal Server Error)**!

A fetch Promise only rejects if there is a **fatal network error** (DNS lookup failed, device offline, CORS failure).

```
HTTP 404 / 500 Response:
  fetch() Promise ──► FULFILLED! (response.ok === false)

No Internet / DNS Failure:
  fetch() Promise ──► REJECTED! (TypeError: Failed to fetch)
```

### The Standard Production Pattern: Check response.ok

`response.ok` is a built-in boolean that evaluates to `true` if the HTTP status code is in the range `200-299`:

```javascript
async function fetchSecureResource(endpoint) {
  try {
    const response = await fetch(endpoint);

    // MUST CHECK response.ok!
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch operation failed:', error.message);
    throw error; // Re-throw or handle gracefully
  }
}
```

---

## 3. Configuring Request Options

The second argument to `fetch()` is an options configuration object:

```javascript
const response = await fetch('/api/v1/articles', {
  method: 'GET', // Default is GET
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  cache: 'no-cache', // Bypass browser cache
  mode: 'cors'        // Enable Cross-Origin Resource Sharing
});
```

---

## 4. Setting Request Timeouts with AbortSignal.timeout()

Avoid indefinite hanging on slow mobile networks by providing a timeout signal:

```javascript
async function fetchWithTimeout(url, ms = 5000) {
  try {
    // Abort automatically if server doesn't respond within 5000ms
    const response = await fetch(url, {
      signal: AbortSignal.timeout(ms)
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.error(`Request timed out after ${ms}ms!`);
    } else {
      console.error('Network error:', err);
    }
  }
}
```

---

## Practice Quiz

### Q1: When does the Promise returned by fetch() reject?
- A) When the server returns a 404 Not Found
- B) When the server returns a 500 Internal Server Error
- C) Only when there is an actual network failure (e.g., offline, DNS resolution failed)
- D) Whenever response.ok is false
**Answer:** C
**Explanation:** `fetch()` resolves its Promise normally even for 4xx and 5xx HTTP statuses. It only rejects if the request could not be completed due to a network outage or CORS failure.

### Q2: What property on the Response object should you check to verify if an HTTP request succeeded with a 2xx status code?
- A) response.success
- B) response.statusValid
- C) response.ok
- D) response.is200
**Answer:** C
**Explanation:** `response.ok` is a boolean property that evaluates to `true` if the HTTP status code is in the range 200–299.

### Q3: What is the default HTTP method used by fetch() when no options object is provided?
- A) POST
- B) GET
- C) HEAD
- D) OPTIONS
**Answer:** B
**Explanation:** When called with just a URL (`fetch(url)`), the HTTP method defaults to `GET`.

### Q4: Which modern Web API method provides a clean way to automatically cancel a fetch request after a specified timeout?
- A) window.setTimeoutCancel()
- B) AbortSignal.timeout(ms)
- C) fetch.cancelAfter(ms)
- D) Promise.raceTimeout()
**Answer:** B
**Explanation:** `AbortSignal.timeout(ms)` creates an abort signal that triggers after the specified milliseconds, passing it in `{ signal }` to `fetch()`.

### Q5: If a server returns an HTTP 500 status code, what does response.ok evaluate to?
- A) true
- B) false
- C) null
- D) undefined
**Answer:** B
**Explanation:** Since 500 is outside the 200–299 range, `response.ok` evaluates to `false`.
