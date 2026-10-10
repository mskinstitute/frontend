# Network Tab for API Calls in Modern JavaScript

When frontend JavaScript interacts with backend APIs, debugging HTTP requests and responses is a daily necessity. The **Network Tab** in browser DevTools provides deep visibility into every network transaction—displaying request headers, payloads, response bodies, timings, status codes, and SSL certificates.

---

## 1. Network Tab Overview & Filtering

Open DevTools (`F12`) and navigate to the **Network** tab:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Filter: [ Fetch/XHR ] [  Preserve log ] [  Disable cache ]            │
├──────────────┬────────┬────────┬──────┬────────┬────────┬──────────────┤
│ Name         │ Status │ Type   │ Size │ Time   │ Method │ Waterfall    │
├──────────────┼────────┼────────┼──────┼────────┼────────┼──────────────┤
│ /api/v1/auth │ 200 OK │ fetch  │ 1.2KB│ 145ms  │ POST   │ █▒▒          │
│ /api/v1/cart │ 304    │ fetch  │ 420B │ 45ms   │ GET    │ █            │
│ /api/v1/pay  │ 500    │ fetch  │ 2.4KB│ 820ms  │ POST   │ █████        │
└──────────────┴────────┴────────┴──────┴────────┴────────┴──────────────┘
```

### Essential Settings
- **Fetch/XHR Filter:** Click this button to filter out images, CSS, and fonts, showing **only JavaScript API calls**.
- **Preserve Log:** Prevents clearing the network history when a form submits or the page reloads.
- **Disable Cache:** Forces the browser to bypass local cache and retrieve fresh assets from the server while DevTools is open.

---

## 2. Inspecting Request & Response Details

Clicking any request entry in the table opens the detail drawer with key inspection tabs:

### 1. Headers Tab
- **General:** Request URL, Request Method (`GET`, `POST`), Status Code (`200`, `401`, `500`), Remote IP Address.
- **Request Headers:** Headers sent by the browser (`Authorization: Bearer ...`, `Content-Type: application/json`).
- **Response Headers:** Headers sent back by the server (`set-cookie`, `access-control-allow-origin`, `cache-control`).

### 2. Payload Tab (Request Body)
- Displays the raw or formatted parameters/JSON sent in a `POST` or `PUT` request body.

### 3. Response / Preview Tab
- Displays the parsed JSON object or text returned by the server. Allows expanding objects and inspecting error details.

---

## 3. Debugging Common API Errors

### 1. CORS Errors (Cross-Origin Resource Sharing)
- **Symptom:** Red request in Network tab; console reads `No 'Access-Control-Allow-Origin' header is present`.
- **Cause:** Backend server is hosted on a different origin (domain/port) and did not return proper CORS headers.

### 2. 401 Unauthorized vs. 403 Forbidden
- **401 Unauthorized:** Missing or expired `Authorization` token header.
- **403 Forbidden:** Authenticated, but user lacks permission for that resource.

### 3. 404 Not Found
- Incorrect API route URL or resource ID.

### 4. 500 Internal Server Error
- Unhandled server-side exception. Check the **Response** tab to read the server's crash log or stack trace.

---

## 4. Network Throttling: Simulating Mobile Networks

Modern users frequently browse on slow 3G or 4G connections. DevTools allows you to simulate these environments:
- Click the **Throttling dropdown** (defaults to "No throttling").
- Select **Fast 3G**, **Slow 3G**, or **Offline**.
- Test whether your loading spinners appear properly and whether your timeout abort controllers function under high latency.

---

## Practice Quiz

### Q1: Which filter in the DevTools Network tab displays only JavaScript API requests (excluding images, CSS, and fonts)?
- A) Doc
- B) Fetch/XHR
- C) Media
- D) WS
**Answer:** B
**Explanation:** The `Fetch/XHR` filter isolates requests initiated via `fetch()` and `XMLHttpRequest`.

### Q2: What does enabling the "Preserve Log" checkbox in the Network tab do?
- A) Saves all network traffic to an external hard drive
- B) Prevents the network request list from being wiped during page navigation or reloads
- C) Disables caching permanently
- D) Encrypts HTTP packets
**Answer:** B
**Explanation:** "Preserve Log" retains network activity history across page refreshes and redirects, which is essential for debugging form submissions.

### Q3: Where can you inspect the JSON body sent to the server in a POST request?
- A) In the Cookies tab
- B) In the Payload (or Request Body) tab
- C) In the Elements panel
- D) In the Console tab
**Answer:** B
**Explanation:** The `Payload` tab shows data submitted to the server in the HTTP request body.

### Q4: If a request fails with an HTTP 401 status code, what does this indicate?
- A) Server hardware crash
- B) Missing, invalid, or expired authentication credentials
- C) Page not found
- D) CORS policy violation
**Answer:** B
**Explanation:** HTTP 401 Unauthorized indicates that the request lacks valid authentication credentials for the requested target.

### Q5: How can you test how your application behaves on slow mobile internet connections?
- A) By turning off the monitor
- B) Using the Network Throttling dropdown in DevTools (e.g., Slow 3G)
- C) By adding while loops to JavaScript code
- D) By clearing history
**Answer:** B
**Explanation:** Network throttling simulates slow connections (Slow 3G, Fast 3G, or Offline) directly in the browser to evaluate real-world mobile performance.
