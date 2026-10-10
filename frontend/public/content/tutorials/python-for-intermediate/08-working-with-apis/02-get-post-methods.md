---
id: python-intermediate-get-post-methods
slug: get-post-methods
course: python-for-intermediate
chapter: "8: Working with APIs"
topic: "8.2 GET & POST Methods"
title: "GET & POST Methods in Python"
description: "Master get & post methods in Python: comprehensive explanations, practical code examples, step-by-step walkthroughs, interactive quiz, and hands-on exercises."
difficulty: Intermediate
readingTime: 8
order: 37
keywords:
  - python get post methods
  - python intermediate
  - python get & post methods
  - msk notes python
lastUpdated: 2026-10-01
author: MSK Institute
version: 1.1.0
---

# GET and POST Methods in Python

In RESTful architecture and web communications, HTTP verbs inform the destination web server of the intended action. The two most fundamental verbs are **GET** (retrieving data) and **POST** (submitting or creating data). The `requests` library simplifies configuring parameters, headers, and payloads for both.

---

## 1. GET Requests and Query Parameters

A **GET** request is idempotent and safe: it retrieves data from the server without modifying server-side state.

### Passing Query Parameters with `params`

Instead of manually concatenating query strings (e.g., `https://api.example.com/search?query=python&page=2`), pass a Python dictionary to the `params` argument. The `requests` library automatically escapes special characters and builds the query string:

```python
import requests

endpoint = "https://httpbin.org/get"

# Query parameters as a clean dictionary
query_params = {
    "search": "machine learning & ai",
    "limit": 10,
    "sort": "recent"
}

response = requests.get(endpoint, params=query_params, timeout=5)

# Inspect how requests constructed the final URL
print("Constructed URL:", response.url)
# Output: https://httpbin.org/get?search=machine+learning+%26+ai&limit=10&sort=recent
```

Notice how spaces became `+` and the ampersand `&` became `%26` through automatic URL encoding!

---

## 2. POST Requests: Sending Data to the Server

A **POST** request transmits a payload in the HTTP request body to create or mutate server resources (e.g., submitting a registration form, charging an account, or creating a new blog post).

### Option A: Sending JSON Payloads (`json=...`)

Most modern REST APIs expect payloads formatted as JSON. Passing a dictionary to the `json` parameter automatically:
1. Serializes the dictionary into a JSON string via `json.dumps()`.
2. Sets the `Content-Type: application/json` HTTP header.

```python
import requests

api_url = "https://httpbin.org/post"

new_user = {
    "username": "coder_pro",
    "email": "coder@example.com",
    "roles": ["student", "researcher"]
}

# json parameter auto-serializes and adds JSON headers
response = requests.post(api_url, json=new_user, timeout=5)

print(f"Status: {response.status_code}")  # 200 (or 201 Created)
server_data = response.json()
print("Echoed JSON:", server_data.get("json"))
```

### Option B: Sending Form Data (`data=...`)

When submitting HTML forms or traditional URL-encoded payloads, pass the dictionary to the `data` parameter:

```python
import requests

form_payload = {
    "login_id": "test_user",
    "csrf_token": "abc123xyz"
}

# Automatically sets Content-Type: application/x-www-form-urlencoded
response = requests.post("https://httpbin.org/post", data=form_payload, timeout=5)
print("Form data received by server:", response.json().get("form"))
```

---

## 3. Custom Request Headers

Custom headers allow you to define authentication tokens, API keys, custom user agents, or content negotiation preferences:

```python
import requests

headers = {
    "User-Agent": "MSK-Learning-Bot/1.0",
    "Authorization": "Bearer secret_jwt_token_here",
    "Accept": "application/json"
}

response = requests.get("https://httpbin.org/headers", headers=headers, timeout=5)
print(response.json())
```

---

## 4. GET vs. POST: Architectural Comparison

| Dimension | GET Method | POST Method |
| :--- | :--- | :--- |
| **Purpose** | Retrieve existing resources | Create or process resources |
| **Payload Location** | URL query parameters (`?key=val`) | HTTP Request Body |
| **Idempotent?** | Yes (repeating produces same state) | No (repeating may create duplicate records) |
| **Data Length** | Limited by browser/server URL limits (~2048 chars) | Virtually unlimited |
| **Caching & History** | Cached by browsers, logged in server access logs | Never cached by default |
| **Security** | Sensitive data visible in URLs (browser history, logs) | Encrypted within TLS/HTTPS body payload |

> **Security Rule:** Never transmit passwords, API secret keys, or personally identifiable information (PII) inside a GET query string!

---

---

## ⚠️ Common Intermediate Mistakes & Gotchas

### 1. Sending Query Parameters via String Formatting
Never concatenate query parameters manually into the URL string. Use the `params={}` dictionary argument in `requests.get()` so special characters and spaces are URL-encoded automatically.

### 2. Confusing `data=` and `json=` in POST
- `data=payload`: Sends form-encoded data (`application/x-www-form-urlencoded`).
- `json=payload`: Serializes the dict to JSON and automatically sets `Content-Type: application/json`.

---

---

## 💻 Try It Yourself: Simulated POST Submission

### Scenario
Send a POST request containing a new user registration dictionary to `https://httpbin.org/post` using the `json=` argument, and verify that the remote server echoed back the JSON body.

### Complete Solution
```python
import requests

payload = {
    "username": "aarav_developer",
    "role": "Backend Engineer",
    "skills": ["Python", "SQLite", "REST APIs"]
}

response = requests.post("https://httpbin.org/post", json=payload, timeout=5.0)
if response.status_code == 200:
    echoed = response.json()
    print("Server successfully received and echoed payload:")
    print("Received JSON:", echoed["json"])
```

### Expected Output
```text
Server successfully received and echoed payload:
Received JSON: {'role': 'Backend Engineer', 'skills': ['Python', 'SQLite', 'REST APIs'], 'username': 'aarav_developer'}
```

---

## Practice Quiz

### 1. Which keyword argument should you pass to `requests.get()` to include URL query parameters cleanly?
A. `query`
B. `params`
C. `data`
D. `args`
**Answer:** B
**Explanation:** The `params` parameter takes a dictionary and encodes it into URL query parameters (e.g. `?search=python`).
---

### 2. What does `requests.post(url, json=payload)` do automatically?
A. Compresses the payload into a zip archive
B. Serializes the dictionary to a JSON string and sets `Content-Type: application/json`
C. Encrypts the payload with RSA keys
D. Sends the request via FTP
**Answer:** B
**Explanation:** Using `json=...` serializes the dictionary to a JSON formatted string and sets the appropriate `application/json` header automatically.
---

### 3. Why should sensitive information like user passwords never be transmitted using a GET request?
A. GET requests are disabled over HTTPS
B. Query parameters appear in plain text in browser histories, server access logs, and referral headers
C. GET requests cannot send characters other than numbers
D. The GET method requires root administrative privileges
**Answer:** B
**Explanation:** GET query parameters are part of the URL, making them visible in browser histories, proxy logs, and web server logs.
---

### 4. What is the difference between passing data to `data=` vs `json=` in `requests.post()`?
A. `data=` sends form-encoded (`application/x-www-form-urlencoded`) data, while `json=` sends JSON-encoded (`application/json`) data
B. `data=` is used only for text files
C. `json=` is deprecated in modern versions of requests
D. There is no difference
**Answer:** A
**Explanation:** `data=` submits form-encoded or raw byte strings, whereas `json=` sends JSON-encoded data with matching headers.
---

### 5. How do you supply an API authentication token using an HTTP header in `requests`?
A. `requests.get(url, auth_token="my_token")`
B. `requests.get(url, headers={"Authorization": "Bearer my_token"})`
C. `requests.get(url, params={"auth": "my_token"})`
D. `requests.get(url, token="my_token")`
**Answer:** B
**Explanation:** Standard HTTP authentication tokens (like Bearer tokens) are passed as key-value pairs inside the `headers` dictionary.
---
---

## 🚀 What's Next?

In the next lesson, we will continue your intermediate Python journey with **Parsing JSON Data** (8: Working with APIs).

👉 **[Continue to Next Lesson: Parsing JSON Data →](/tutorials/python-for-intermediate/parsing-json-data)**
