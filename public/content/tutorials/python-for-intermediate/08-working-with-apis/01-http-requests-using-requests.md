---
id: python-intermediate-http-requests-using-requests
slug: http-requests-using-requests
course: python-for-intermediate
chapter: "8: Working with APIs"
topic: "8.1 HTTP Requests using requests"
title: "HTTP Requests using requests in Python"
description: "Master http requests using requests in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 36
keywords:
  - python http requests using requests
  - python intermediate
  - python http requests using requests
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# HTTP Requests Using the Requests Library in Python

In modern software development, applications rarely operate in isolation. They communicate with external web services, payment gateways, authentication providers, and cloud databases via **HTTP (Hypertext Transfer Protocol)**. While Python includes a standard `urllib` module, the third-party **`requests`** library is the undisputed industry standard—dubbed "HTTP for Humans"—due to its intuitive, developer-friendly API.

---

## 1. The HTTP Request-Response Cycle

HTTP follows a classic client-server model:
1. **Client Request**: Your Python script sends a message specifying a **Method** (`GET`, `POST`), target **URL**, optional **Headers** (metadata), and optional **Body** payload.
2. **Server Response**: The remote server processes the request and responds with a **Status Code**, response headers, and body content (HTML, JSON, XML, or binary data).

### Common HTTP Status Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Malformed client payload.
- `401 Unauthorized`: Authentication credentials missing or invalid.
- `403 Forbidden`: Authenticated, but lacking permission.
- `404 Not Found`: Target endpoint does not exist.
- `500 Internal Server Error`: Server-side crash.
- `503 Service Unavailable`: Server overloaded or undergoing maintenance.

---

## 2. Installing and Making Your First Request

Install the library using `pip`:
```bash
pip install requests
```

Making a basic `GET` request:

```python
import requests

url = "https://httpbin.org/get"

# Send an HTTP GET request
response = requests.get(url)

# Inspect the response
print(f"Status Code: {response.status_code}")  # 200
print(f"Is Successful? {response.ok}")        # True
print(f"Content Type: {response.headers.get('Content-Type')}")
```

---

## 3. Key Attributes of the `Response` Object

| Attribute / Method | Description | Example |
| :--- | :--- | :--- |
| `response.status_code` | Integer HTTP status code | `200`, `404` |
| `response.ok` | Boolean: `True` if status code < 400 | `True` |
| `response.text` | Decoded string content (uses encoding) | `"{\"title\": \"...\"}"` |
| `response.content` | Raw binary bytes (for images/files) | `b'\x89PNG...'` |
| `response.headers` | Case-insensitive dictionary of HTTP headers | `{'Date': '...', ...}` |
| `response.url` | Final URL after any redirects | `"https://..."` |
| `response.raise_for_status()` | Raises `HTTPError` if status is 4xx or 5xx | Exception or `None` |

```python
import requests

res = requests.get("https://httpbin.org/status/404")

try:
    # Automatically throws requests.exceptions.HTTPError if request failed
    res.raise_for_status()
except requests.exceptions.HTTPError as err:
    print(f"HTTP Failure intercepted: {err}")
```

---

## 4. Setting Timeouts: A Critical Best Practice

By default, `requests` does **not** time out. If an external server freezes or hangs, your Python script will wait indefinitely, blocking execution and consuming server threads.

**Always pass the `timeout` parameter** (in seconds):

```python
import requests

try:
    # Wait maximum 3.5 seconds for connection & data
    response = requests.get("https://httpbin.org/delay/2", timeout=3.5)
    print("Success:", response.status_code)
except requests.exceptions.Timeout:
    print("Request timed out! Server was too slow to respond.")
```

---

## 5. Comprehensive Error Handling with `requests.exceptions`

All exceptions in the `requests` library inherit from `requests.exceptions.RequestException`. Handle network errors defensively:

```python
import requests
from requests.exceptions import ConnectionError, Timeout, HTTPError, RequestException

def fetch_data_safely(endpoint_url: str):
    try:
        response = requests.get(endpoint_url, timeout=5)
        response.raise_for_status()  # Check for 4xx/5xx errors
        return response.text
        
    except ConnectionError:
        print(f"[Error] Failed to connect to server. Check DNS or internet connection.")
    except Timeout:
        print(f"[Error] The request timed out.")
    except HTTPError as http_err:
        print(f"[Error] HTTP protocol error occurred: {http_err}")
    except RequestException as err:
        print(f"[Error] Ambiguous request exception: {err}")
        
    return None

data = fetch_data_safely("https://httpbin.org/get")
```

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Forgetting `timeout` on Network Calls
By default, `requests.get()` will wait indefinitely if a remote server hangs. Always provide an explicit timeout: `requests.get(url, timeout=5.0)`.

### 2. Skipping `response.raise_for_status()`
A response with HTTP 404 (Not Found) or 500 (Server Error) does not raise an exception automatically. Always call `response.raise_for_status()` to catch HTTP errors reliably.

---

---

## 💻 Try It Yourself: Safe GitHub User Profile Inspector

### Scenario
Use the `requests` library to query GitHub's public API for a user profile (`https://api.github.com/users/<username>`), verifying status codes and displaying the public repository count.

### Complete Solution
```python
import requests

def inspect_github_user(username):
    url = f"https://api.github.com/users/{username}"
    try:
        response = requests.get(url, timeout=5.0)
        response.raise_for_status()
        data = response.json()
        print(f"User: {data.get('name')} (@{data.get('login')})")
        print(f"Public Repos: {data.get('public_repos')}")
        print(f"Followers: {data.get('followers')}")
    except requests.exceptions.HTTPError as err:
        if response.status_code == 404:
            print(f"Error: User '{username}' was not found on GitHub.")
        else:
            print(f"HTTP Error: {err}")
    except requests.exceptions.RequestException as err:
        print(f"Network Connection Failed: {err}")

# Inspect user
inspect_github_user("octocat")
```

### Expected Output
```text
User: The Octocat (@octocat)
Public Repos: 8
Followers: 15000+
```

---

## Practice Quiz

### 1. What does the `response.ok` property return when a server responds with status code `200`?
A. `200`
B. `True`
C. `"OK"`
D. `None`
**Answer:** B
**Explanation:** `response.ok` returns `True` if the HTTP status code is less than 400 (i.e. successful or redirection).
---

### 2. What happens if you make a `requests.get()` call without specifying a `timeout` argument and the remote server never responds?
A. Python times out automatically after 30 seconds
B. The script hangs indefinitely waiting for a response
C. Python raises a `ZeroDivisionError`
D. The request is rerouted to localhost
**Answer:** B
**Explanation:** By default, `requests` does not enforce a timeout; without setting `timeout=...`, code will block forever if the socket hangs.
---

### 3. Which method raises an `HTTPError` if the response status indicates an error (4xx or 5xx)?
A. `response.check_error()`
B. `response.raise_for_status()`
C. `response.assert_ok()`
D. `response.throw_if_failed()`
**Answer:** B
**Explanation:** `response.raise_for_status()` checks the status code and raises a `requests.exceptions.HTTPError` if it represents a client or server error.
---

### 4. What is the difference between `response.text` and `response.content`?
A. `response.text` gives Unicode string text, while `response.content` gives raw binary bytes
B. `response.text` gives HTTP headers, while `response.content` gives the body
C. `response.text` is deprecated
D. `response.content` is only for JSON files
**Answer:** A
**Explanation:** `response.text` decodes the payload into a Python string based on HTTP headers, whereas `response.content` provides raw un-decoded bytes (essential for images/PDFs).
---

### 5. What is the common base class for all exceptions raised by the `requests` library?
A. `NetworkError`
B. `IOError`
C. `requests.exceptions.RequestException`
D. `requests.BaseError`
**Answer:** C
**Explanation:** All exceptions thrown by `requests` inherit from `requests.exceptions.RequestException`, enabling clean catch-all handlers.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **GET & POST Methods** (8: Working with APIs).

👉 **[Continue to Next Lesson: GET & POST Methods →](/tutorials/python-for-intermediate/get-post-methods)**
