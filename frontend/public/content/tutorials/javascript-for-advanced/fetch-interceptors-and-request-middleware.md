# Fetch Interceptors & Request Middleware in Modern JavaScript

While third-party libraries like Axios include built-in request/response interceptors, relying on heavy external dependencies is unnecessary in modern JavaScript. Implementing a **Fetch Interceptor Middleware Pipeline** allows you to centrally inject authentication tokens, refresh expired JWTs, handle rate limits, and standardize error responses.

---

## 1. The Interceptor Pipeline Architecture

```
  Outgoing Request:
  fetchRequest ──► [ Auth Header Middleware ] ──► [ Logging Middleware ] ──► HTTP Network
                                                                                  │
  Incoming Response:                                                              ▼
  Client Code  ◄── [ Error Transform Middleware ] ◄── [ 401 Refresh Token ] ◄── Response
```

---

## 2. Implementing a Functional Fetch Interceptor Wrapper

```javascript
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // Register request interceptor
  useRequest(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Register response interceptor
  useResponse(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async fetch(endpoint, options = {}) {
    let url = `${this.baseUrl}${endpoint}`;
    let config = { ...options, headers: { ...options.headers } };

    // 1. Execute Request Interceptors in order
    for (const interceptor of this.requestInterceptors) {
      const modified = await interceptor(url, config);
      if (modified) {
        url = modified.url || url;
        config = modified.config || config;
      }
    }

    // 2. Perform Network Call
    let response = await fetch(url, config);

    // 3. Execute Response Interceptors in order
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, { url, config, client: this });
    }

    return response;
  }
}
```

---

## 3. Real-World Interceptor 1: Automatic Auth Bearer Injection

```javascript
const api = new ApiClient('https://api.enterprise.com/v1');

// Middleware: Attach JWT Token from storage to all requests
api.useRequest(async (url, config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['X-Request-Id'] = crypto.randomUUID();
  return { url, config };
});
```

---

## 4. Real-World Interceptor 2: Automatic 401 Token Refresh

When an access token expires, intercept the 401 response, obtain a fresh token using the refresh token, and **replay the original request transparently**:

```javascript
api.useResponse(async (response, { url, config, client }) => {
  // If unauthorized and we haven't already retried this request:
  if (response.status === 401 && !config._isRetry) {
    console.warn('Access token expired. Refreshing token...');

    try {
      // Fetch new access token
      const refreshRes = await fetch('https://api.enterprise.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: localStorage.getItem('refresh_token') })
      });

      if (!refreshRes.ok) throw new Error('Session expired. Please log in again.');

      const { accessToken } = await refreshRes.json();
      localStorage.setItem('auth_token', accessToken);

      // Replay original request with fresh token!
      config._isRetry = true;
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return await fetch(url, config);
    } catch (refreshErr) {
      localStorage.clear();
      window.location.href = '/login';
      throw refreshErr;
    }
  }

  return response;
});
```

---

## Practice Quiz

### Q1: What is the primary purpose of a Fetch Request Interceptor?
- A) To compress image files
- B) To modify outgoing requests centrally (e.g. injecting auth tokens, timestamps, or request IDs) before transmission
- C) To render CSS animations
- D) To restart the server
**Answer:** B
**Explanation:** Request interceptors process outgoing configuration objects before network dispatch, standardizing headers, tokens, and telemetry.

### Q2: How can an interceptor transparently handle an expired JWT token (HTTP 401)?
- A) By deleting the browser
- B) By catching the 401 status, calling the refresh token endpoint, updating storage, and re-executing the original request with the new token
- C) By converting the request to a GET request
- D) By ignoring the error
**Answer:** B
**Explanation:** Intercepting 401 responses allows the client to fetch a new token in the background and replay the failed request seamlessly without user disruption.

### Q3: Why is a flag like config._isRetry used in 401 token refresh interceptors?
- A) To encrypt the payload
- B) To prevent an infinite retry loop if the refresh token itself is invalid or expired
- C) To measure network latency
- D) It is required by HTTP standards
**Answer:** B
**Explanation:** Marking the request as a retry (`_isRetry = true`) prevents infinite loops if the replayed request fails with 401 again.

### Q4: Does the native browser Fetch API include interceptors out of the box?
- A) Yes, fetch.interceptors exists natively
- B) No, native fetch does not have interceptors; they are implemented using custom wrapper functions or classes
- C) Only in Firefox
- D) Only in Node.js
**Answer:** B
**Explanation:** Unlike Axios, native `fetch()` does not include an interceptors property; developers wrap `fetch()` in custom pipeline architectures.

### Q5: What standard browser method generates unique request tracing IDs for X-Request-Id headers?
- A) Math.random()
- B) crypto.randomUUID()
- C) Date.now()
- D) performance.now()
**Answer:** B
**Explanation:** `crypto.randomUUID()` produces a cryptographically secure, standard RFC 4122 Version 4 UUID string.
